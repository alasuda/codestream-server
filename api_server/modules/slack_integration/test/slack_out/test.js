// handle unit tests for outgoing slack integration messages

'use strict';

const SlackOutTest = require('./slack_out_test');
const CodeBlockTest = require('./code_block_test');
const MentionTest = require('./mention_test');
const ReplyTest = require('./reply_test');

class SlackOutTester {

	test () {
		new SlackOutTest().test();
		new CodeBlockTest().test();
		new MentionTest().test();
		new ReplyTest().test();
	}
}

module.exports = new SlackOutTester();
