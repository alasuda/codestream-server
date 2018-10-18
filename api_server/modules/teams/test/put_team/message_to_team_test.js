'use strict';

const Aggregation = require(process.env.CS_API_TOP + '/server_utils/aggregation');
const CodeStreamMessageTest = require(process.env.CS_API_TOP + '/modules/messager/test/codestream_message_test');
const CommonInit = require('./common_init');

class MessageToTeamTest extends Aggregation(CodeStreamMessageTest, CommonInit) {

	get description () {
		return 'members of the team should receive a message with the team when a team is updated';
	}

	// make the data that triggers the message to be received
	makeData (callback) {
		this.init(callback);
	}

	// set the name of the channel we expect to receive a message on
	setChannelName (callback) {
		this.channelName = `team-${this.team._id}`;
		callback();
	}

	// generate the message by issuing a request to update the team
	generateMessage (callback) {
		this.updateTeam(error => {
			if (error) { return callback(error); }
			this.message = this.updateTeamResponse;
			callback();
		});
	}
}

module.exports = MessageToTeamTest;
