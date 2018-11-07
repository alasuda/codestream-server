'use strict';

const OpenTest = require('./open_test');

class ACLTest extends OpenTest {

	constructor (options) {
		super(options);
		this.dontCloseFirst = true;
	}
	
	get description () {
		return 'should return an error when trying to open a stream the user is not a member of';
	}

	getExpectedError () {
		return {
			code: 'RAPI-1010',
			reason: 'only members can open this stream'
		};
	}

	setTestOptions (callback) {
		super.setTestOptions(() => {
			this.userOptions.numRegistered = 3;
			this.teamOptions.creatorIndex = 1;
			Object.assign(this.streamOptions, {
				creatorIndex: 1,
				members: [2]
			});
			callback();
		});
	}
}

module.exports = ACLTest;
