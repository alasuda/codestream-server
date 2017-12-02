'use strict';

// make jshint happy
/* globals describe */

var ReposRequestTester = require('./repos_request_tester');

var reposRequestTester = new ReposRequestTester();

describe('repo requests', function() {

	this.timeout(20000);

	describe('GET /repos/:id', reposRequestTester.getRepoTest);
	describe('GET /repos', reposRequestTester.getReposTest);
	describe('POST /repos', reposRequestTester.postRepoTest);
	describe('GET /no-auth/find-repo', reposRequestTester.findRepoTest);

});
