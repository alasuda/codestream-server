'use strict';

var PutMarkerLocationsTest = require('./put_marker_locations_test');

class BadTypeLocationTest extends PutMarkerLocationsTest {

	get description () {
		return 'should return error when attempting to put marker locations with a bad type for locations';
	}

	getExpectedError () {
		return {
			code: 'RAPI-1005',
			info: 'locations must be an object'
		};
	}

	setData (callback) {
		super.setData(() => {
			this.data.locations = 1;
			callback();
		});
	}
}

module.exports = BadTypeLocationTest;
