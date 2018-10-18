'use strict';

const CodeStreamMessageTest = require('./codestream_message_test');

class PresenceJoinTest extends CodeStreamMessageTest {

	constructor (options) {
		super(options);
		this.withPresence = true;	// necessary to get presence messages
	}

	get description () {
		return 'members of the team should get a "join" presence message when another user subscribes to the team channel';
	}

	// set the channel name to listen on
	setChannelName (callback) {
		// we'll listen on the team channel for the presence message
		this.channelName = 'team-' + this.team._id;
		callback();
	}

	// generate the message that triggers the test
	generateMessage (callback) {
		// have the second user subscribe to the team channel, the current user
		// should receive a "join" presence message
		const otherUser = this.users[1].user;
		const token = this.users[1].pubNubToken;
		this.makePubnubForClient(token, otherUser);
		this.pubnubClientsForUser[otherUser._id].subscribe(
			this.channelName,
			() => {},
			callback,
			{
				withPresence: this.withPresence
			}
		);
	}

	// validate the received message against expectations
	validateMessage (message) {
		let otherUser = this.users[1].user;
		if (message.action === 'join' && message.uuid === otherUser._pubnubUuid) {
			return true;
		}
	}
}

module.exports = PresenceJoinTest;
