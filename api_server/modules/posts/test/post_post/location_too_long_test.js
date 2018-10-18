'use strict';

const CodeBlockTest = require('./code_block_test');

class LocationTooLongTest extends CodeBlockTest {

	get description () {
		return 'should return an error when attempting to create a post with a code block element where the location array is too long';
	}

	getExpectedError () {
		return {
			code: 'RAPI-1005',
			info: 'codeBlocks: location array is too long'
		};
	}

	// form the data to use in trying to create the post
	makePostData (callback) {
		// 6 elements in the location array ... not allowed!
		super.makePostData(() => {
			this.data.codeBlocks[0].location = [1, 2, 3, 4, 5, 6];
			callback();
		});
	}
}

module.exports = LocationTooLongTest;
