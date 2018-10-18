'use strict';

const PostToChannelTest = require('./post_to_channel_test');
const Assert = require('assert');

class MentionTest extends PostToChannelTest {

	get description () {
		return 'should return mentioned user IDs in returned post when creating a post with mentions';
	}

	// form the data for the post we'll create in the test
	makePostData (callback) {
		super.makePostData(() => {
			// add users to the mentionedUserIds array
			this.data.mentionedUserIds = [this.users[1].user._id, this.currentUser.user._id];
			callback();
		});
	}

	// validate the response to the test request
	validateResponse (data) {
		const sorted = [...this.data.mentionedUserIds].sort();
		Assert.deepEqual(data.post.mentionedUserIds, sorted, 'mentionedUserIds attribute not correct in response');
		super.validateResponse(data);
	}
}

module.exports = MentionTest;
