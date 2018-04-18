// slack-bot integration configuration

'use strict';

module.exports = {
	botOrigin: process.env.CS_API_SLACKBOT_ORIGIN,
	secret: process.env.CS_API_INTEGRATION_BOT_SHARED_SECRET,
	botReceivePath: '/codestream/receive'
};
