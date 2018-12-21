// this class should be used to create all post documents in the database

'use strict';

const Post = require('./post');
const ModelCreator = require(process.env.CS_API_TOP + '/lib/util/restful/model_creator');
const LastReadsUpdater = require('./last_reads_updater');
const PostPublisher = require('./post_publisher');
const EmailNotificationQueue = require('./email_notification_queue');
const { awaitParallel } = require(process.env.CS_API_TOP + '/server_utils/await_utils');
const StreamPublisher = require(process.env.CS_API_TOP + '/modules/streams/stream_publisher');
const ModelSaver = require(process.env.CS_API_TOP + '/lib/util/restful/model_saver');
const CodemarkCreator = require(process.env.CS_API_TOP + '/modules/codemarks/codemark_creator');
const Errors = require('./errors');

class PostCreator extends ModelCreator {

	constructor (options) {
		super(options);
		this.errorHandler.add(Errors);
	}
	
	get modelClass () {
		return Post;	// class to use to create a post model
	}

	get collectionName () {
		return 'posts';	// data collection to use
	}

	// convenience wrapper
	async createPost (attributes) {
		return await this.createModel(attributes);
	}

	// get attributes that are required for post creation, and those that are optional,
	// along with their types
	getRequiredAndOptionalAttributes () {
		return {
			required: {
				string: ['streamId']
			},
			optional: {
				string: ['text', 'parentPostId'],
				object: ['codemark'],
				'array(string)': ['mentionedUserIds']
			}
		};
	}

	// called before the post is actually saved
	async preSave () {
		this.attributes.origin = this.origin || this.request.request.headers['x-cs-plugin-ide'] || '';
		this.attributes.creatorId = this.user.id;
		this.attributes.createdAt = Date.now();
		if (this.request.isForTesting()) { // special for-testing header for easy wiping of test data
			this.attributes._forTesting = true;
		}
		this.createId();				// create an ID for the post
		await this.getStream();			// get the stream for the post
		await this.getTeam();			// get the team that owns the stream
		await this.getCompany();		// get the company that owns the team
		await this.createCodemark();		// create the associated knowledge-base codemarks, if any
		await this.getSeqNum();			// requisition a sequence number for the post
		await super.preSave();			// base-class preSave
		await this.updateStream();		// update the stream as needed
		await this.updateLastReads();	// update lastReads attributes for affected users
		await this.updateNumReplies();	// update numReplies for the parent post, and codemark if applicable
		await this.updatePostCount();	// update the post count for the author of the post
	}

	// get the stream we're trying to create the post in
	async getStream () {
		this.stream = await this.data.streams.getById(this.attributes.streamId);
		if (!this.stream) {
			throw this.errorHandler.error('notFound', { info: 'stream'});
		}
		if (this.stream.get('type') === 'file') {
			// creating posts in a file stream is no longer allowed
			throw this.errorHandler.error('createAuth', { reason: 'can not post to a file stream' });
		}
	}

	// get the team that owns the stream for which the post is being created
	async getTeam () {
		this.team = await this.data.teams.getById(this.stream.get('teamId'));
		if (!this.team) {
			throw this.errorHandler.error('notFound', { info: 'team'});
		}
		this.attributes.teamId = this.team.id;	// post gets the same teamId as the stream
	}

	// get the company that owns the team for which the post is being created
	// only needed for analytics so we only do this for inbound emails 
	async getCompany () {
		if (!this.forInboundEmail) {
			// only needed for inbound email, for tracking
			return;
		}
		this.company = await this.data.companies.getById(this.team.get('companyId'));
	}

	// create an associated knowledge base codemark, if applicable
	async createCodemark () {
		if (!this.attributes.codemark) {
			return;
		}
		const codemarkAttributes = Object.assign({}, this.attributes.codemark, {
			teamId: this.team.id,
			streamId: this.stream.id,
			postId: this.attributes.id
		});
		if (this.attributes.parentPostId) {
			codemarkAttributes.parentPostId = this.attributes.parentPostId;
		}
		this.transforms.createdCodemark = await new CodemarkCreator({
			request: this.request
		}).createCodemark(codemarkAttributes);
		delete this.attributes.codemark;
		this.attributes.codemarkId = this.transforms.createdCodemark.id;
	}

	// requisition a sequence number for this post
	async getSeqNum () {
		let seqNum = null;
		let numRetries = 0;
		let gotError = null;
		// this is a mutex-type operation ... we never want to assign the same
		// sequence number to two posts ... we maintain the next sequence number
		// in the stream document, and use findAndModify to increment the next
		// sequence number and fetch the current sequence number in the same
		// atomic operation, ensuring no one will ever get the same value ...
		// since we can get race conditions here (very rare), we'll put this in
		// a retry loop
		while (!seqNum && numRetries < 20) {
			let foundStream;
			try {
				foundStream = await this.data.streams.findAndModify(
					{ id: this.data.streams.objectIdSafe(this.attributes.streamId) },
					{ $inc: { nextSeqNum: 1 } },
					{ fields: { nextSeqNum: 1 } }
				);
			}
			catch (error) {
				numRetries++;
				gotError = error;
				continue;
			}
			gotError = null;
			seqNum = foundStream.nextSeqNum;
		}
		if (gotError) {
			throw gotError;
		}
		this.attributes.seqNum = seqNum;
	}

	// update the stream associated with the created post
	async updateStream () {
		// update the mostRecentPostId attribute, and the sortId attribute
		// (which is the same if there is a post in the stream) to the ID of
		// the created post
		const op = {
			$set: {
				mostRecentPostId: this.attributes.id,
				mostRecentPostCreatedAt: this.attributes.createdAt,
				sortId: this.attributes.id,
				modifiedAt: Date.now()
			}
		};
		// increment the number of markers in this stream
		if (this.transforms.createdMarkers && this.transforms.createdMarkers.length) {
			const numAddedMarkers = this.transforms.createdMarkers.length;
			op.$set.numMarkers = (this.stream.get('numMarkers') || 0) + numAddedMarkers;
		}
		this.transforms.streamUpdateForPost = await new ModelSaver({
			request: this.request,
			collection: this.data.streams,
			id: this.stream.id
		}).save(op);
	}

	// update the lastReads attribute for each user in the stream or team,
	// for those users for whom this post represents a new unread message
	async updateLastReads () {
		await new LastReadsUpdater({
			data: this.data,
			user: this.user,
			stream: this.stream,
			team: this.team,
			previousPostSeqNum: this.attributes.seqNum - 1,
			logger: this
		}).updateLastReads();
	}

	// if this is a reply, update the numReplies attribute for the parent post and/or parent codemark
	async updateNumReplies () {
		if (!this.model.get('parentPostId')) {
			return;
		}
		this.parentPost = await this.data.posts.getById(this.model.get('parentPostId'));
		if (this.parentPost.get('parentPostId')) {
			throw this.errorHandler.error('noReplyToReply');
		}
		await this.updateParentPost();
		await this.updateParentCodemark();
	}

	// update numReplies for a parent post to this post
	async updateParentPost () {
		const op = { 
			$set: {
				numReplies: (this.parentPost.get('numReplies') || 0) + 1,
				modifiedAt: Date.now()
			} 
		};
		this.transforms.postUpdate = await new ModelSaver({
			request: this.request,
			collection: this.data.posts,
			id: this.parentPost.id
		}).save(op);
	}
	
	// update numReplies for the parent post's codemark, if any
	async updateParentCodemark () {
		if (!this.parentPost.get('codemarkId')) {
			return;
		}
		const codemark = await this.request.data.codemarks.getById(this.parentPost.get('codemarkId'));
		if (!codemark) { return; }

		const op = { 
			$set: {
				numReplies: (codemark.get('numReplies') || 0) + 1,
				modifiedAt: Date.now()
			}
		};
		this.transforms.codemarkUpdate = await new ModelSaver({
			request: this.request,
			collection: this.data.codemarks,
			id: codemark.id
		}).save(op);
	}

	// update the total post count for the author of the post, along with the date/time of last post,
	// also clear lastReads for the stream 
	async updatePostCount () {
		const op = {
			$set: { 
				lastPostCreatedAt: this.attributes.createdAt,
				totalPosts: (this.user.get('totalPosts') || 0) + 1,
				modifiedAt: Date.now()
			},
			$unset: { [`lastReads.${this.stream.id}`]: true }
		};
		this.transforms.updatePostCountOp = await new ModelSaver({
			request: this.request,
			collection: this.data.users,
			id: this.user.id
		}).save(op);
	}

	// after the post was created...
	async postCreate () {
		// all these operations are independent and can happen in parallel
		await awaitParallel([
			this.publishCreatedStreamsForMarkers,	// publish any streams created on-the-fly for the markers, as needed
			this.publishRepos,					// publish any created or updated repos to the team
			this.publishPost,					// publish the actual post to members of the team or stream
			this.publishParentPost,				// if this post was a reply and we updated the parent post, publish that
			this.triggerNotificationEmails,		// trigger email notifications to members who should receive them
			this.publishToAuthor,				// publish directives to the author's me-channel
			//this.sendPostCountToAnalytics,		// update analytics post count for the post's author
			this.trackPost,						// for server-generated posts, send analytics info
			this.updateMentions					// for mentioned users, update their mentions count for analytics 
		], this);
	}

	// if we created any streams on-the-fly for the markers, publish them as needed
	async publishCreatedStreamsForMarkers () {
		// streams created on-the-fly for markers are necessarily going to be file streams,
		// these should automatically get published to the whole team
		await Promise.all((this.transforms.createdStreamsForMarkers || []).map(async stream => {
			await this.publishStream(stream);
		}));
	}

	// publish any created or updated repos to the team
	async publishRepos () {
		// the repos only need to be published if the stream for the post (this.stream, 
		// which is possibly different from the stream to be published) is a private stream ... 
		// otherwise the repos will be published along with the post anyway, to the entire team
		if (!this.stream.hasPrivateContent()) {
			return;
		}

		const repos = (this.transforms.createdRepos || []).map(repo => repo.getSanitizedObject())
			.concat(this.transforms.repoUpdates || []);
		if (repos.length === 0) {
			return;
		}

		const teamId = this.team.id;
		const channel = 'team-' + teamId;
		const message = {
			repos: repos,
			requestId: this.request.request.id
		};
		try {
			await this.request.api.services.messager.publish(
				message,
				channel,
				{ request: this.request }
			);
		}
		catch (error) {
			// this doesn't break the chain, but it is unfortunate...
			this.request.warn(`Could not publish repos message to team ${teamId}: ${JSON.stringify(error)}`);
		}
	}

	// publish a given stream
	async publishStream (stream) {
		// the stream only needs to be published if the stream for the post (this.stream, 
		// which is possibly different from the stream to be published) is a private stream ... 
		// otherwise the stream will be published along with the post anyway, to the entire team
		if (!this.stream.hasPrivateContent()) {
			return;
		}
		const sanitizedStream = stream.getSanitizedObject();
		await new StreamPublisher({
			stream: sanitizedStream,
			data: { stream: sanitizedStream },
			request: this.request,
			messager: this.api.services.messager,
			isNew: true
		}).publishStream();
	}
	
	// publish the post to the appropriate messager channel
	async publishPost () {
		await new PostPublisher({
			request: this.request,
			data: this.request.responseData,
			messager: this.api.services.messager,
			stream: this.stream.attributes
		}).publishPost();
	}

	// if the parent post was updated, publish the parent post
	async publishParentPost () {
		if (!this.transforms.postUpdate) {
			return;
		}
		const data = {
			post: this.transforms.postUpdate
		};
		if (this.transforms.codemarkUpdate) {
			data.codemark = this.transforms.codemarkUpdate;
		}
		await new PostPublisher({
			request: this.request,
			data,
			messager: this.api.services.messager,
			stream: this.stream.attributes	// assuming stream for the parent post is the same as for the reply
		}).publishPost();
	}

	// send an email notification as needed to users who are offline
	async triggerNotificationEmails () {
		if (this.requestSaysToBlockEmails()) {
			// don't do email notifications for unit tests, unless asked
			this.request.log('Would have triggered email notifications for stream ' + this.stream.id);
			return;
		}

		const queue = new EmailNotificationQueue({
			request: this.request,
			fromSeqNum: this.model.get('seqNum'),
			initialTriggerTime: this.model.get('createdAt'),
			stream: this.stream
		});
		try {
			await queue.initiateEmailNotifications();
		}
		catch (error) {
			this.request.warn(`Unable to queue email notifications for stream ${this.stream.id} and post ${this.model.id}: ${error.toString()}`);
		}
	}

	// publish a message reflecting this post to the post's author
	// this includes an increase in the post count, and a clearing of the 
	// author's lastReads for the stream
	async publishToAuthor () {
		const channel = `user-${this.user.id}`;
		const message = {
			requestId: this.request.request.id,
			user: this.transforms.updatePostCountOp
		};
		try {
			await this.api.services.messager.publish(
				message,
				channel,
				{ request: this.request }
			);
		}
		catch (error) {
			// this doesn't break the chain, but it is unfortunate...
			this.request.warn(`Could not publish author update message to user ${this.user.id}: ${JSON.stringify(error)}`);
		}
	}

	// send the post count update to our analytics service
	async sendPostCountToAnalytics () {
		// check if user has opted out
		const preferences = this.user.get('preferences') || {};
		if (preferences.telemetryConsent === false) { // note: undefined is not an opt-out, so it's opt-in by default
			return;
		}
		this.api.services.analytics.setPerson(
			this.user.id,
			{
				'Total Posts': this.user.get('totalPosts'),
				'Date of Last Post': new Date(this.user.get('lastPostCreatedAt')).toISOString()
			},
			{
				request: this.request,
				user: this.user
			}
		);
	}

	// track this post for analytics, with the possibility that the user may have opted out
	async trackPost () {
		// only track for inbound emails, client-originating posts are tracked by the client
		if (!this.forInboundEmail) {
			return;
		}
		// check if user has opted out
		const preferences = this.user.get('preferences') || {};
		if (preferences.telemetryConsent === false) { // note: undefined is not an opt-out, so it's opt-in by default
			return ;
		}

		const endpoint = 'Email';
		const categories = {
			'channel': 'Private Channel',
			'direct': 'Direct Message',
			'file': 'Source File'
		};
		let category = categories[this.stream.get('type')] || '???';
		if (this.stream.get('type') === 'channel' && this.stream.get('privacy') === 'public') {
			category = 'Public Channel';
		}
		const companyName = this.company ? this.company.get('name') : '???';
		const providerInfo = (this.team && this.team.get('providerInfo')) || {};
		const provider = providerInfo.slack ? 'Slack' : 'CodeStream';
		const trackObject = {
			distinct_id: this.user.id,
			Type: 'Chat',
			Thread: 'Parent',
			Category: category,
			'Email Address': this.user.get('email'),
			'Join Method': this.user.get('joinMethod'),
			'Team ID': this.team ? this.team.id : undefined,
			'Team Name': this.team ? this.team.get('name') : undefined,
			'Team Size': this.team ? this.team.get('memberIds').length : undefined,
			'Reporting Group': this.team ? (this.team.get('reportingGroup') || '') : undefined,
			'Provider': provider,
			Company: companyName,
			'Endpoint': endpoint,
			'Date of Last Post': new Date(this.model.get('createdAt')).toISOString()
		};
		if (this.user.get('registeredAt')) {
			trackObject['Date Signed Up'] = new Date(this.user.get('registeredAt')).toISOString();
		}
		if (this.user.get('totalPosts') === 1) {
			trackObject['First Post?'] = new Date(this.model.get('createdAt')).toISOString();
		}

		this.api.services.analytics.track(
			'Post Created',
			trackObject,
			{
				request: this.request,
				user: this.user
			}
		);
	}

	// for unregistered users who are mentioned, we track that they've been mentioned
	// and how many times for analytics purposes
	async updateMentions () {
		await this.getMentionedUsers();
		await this.updateMentionedUsers();
	}

	// get any mentioned users so we can tell who is unregistered
	async getMentionedUsers () {
		const userIds = this.attributes.mentionedUserIds || [];
		if (userIds.length === 0) {
			return;
		}
		this.mentionedUsers = await this.data.users.getByIds(
			userIds,
			{
				noCache: true,
				fields: ['id', 'isRegistered']
			}
		);
	}

	// for unregistered users who are mentioned, we track that they've been mentioned
	// and how many times for analytics purposes
	async updateMentionedUsers () {
		await Promise.all((this.mentionedUsers || []).map(async user => {
			await this.updateMentionsForUser(user);
		}));
	}

	// for an unregistered mentioned user, we track that they've been mentioned
	// and how many times for analytics purposes
	async updateMentionsForUser (user) {
		if (user.get('isRegistered')) {
			return ;	// we only do this for unregistered users
		}
		const update = {
			$set: {
				internalMethod: 'mention_notification',
				internalMethodDetail: this.user.id
			},
			$inc: {
				numMentions: 1
			}
		};
		await this.data.users.updateDirect(
			{ id: this.data.users.objectIdSafe(user.id) },
			update
		);
	}

	// determine if special header was sent with the request that says to block emails
	requestSaysToBlockEmails () {
		return (
			(
				this.request.api.config.email.suppressEmails &&
				!this.request.request.headers['x-cs-test-email-sends']
			) ||
			(
				this.request.request.headers &&
				this.request.request.headers['x-cs-block-email-sends']
			)
		);
	}
}

module.exports = PostCreator;
