// handle unit tests for the "POST /posts" request

'use strict';

var PostPostTest = require('./post_post_test');
var PostToDirectTest = require('./post_to_direct_test');
var PostToChannelTest = require('./post_to_channel_test');
var PostToFileStreamTest = require('./post_to_file_stream_test');
var CodeBlockTest = require('./code_block_test');
var NoCommitHashTest = require('./no_commit_hash_test');
var CodeBlocksNotArrayTest = require('./code_blocks_not_array_test');
var CodeBlocksTooLongTest = require('./code_blocks_too_long_test');
var CodeBlockNotObjectTest = require('./code_block_not_object_test');
var CodeBlockTooBigTest = require('./code_block_too_big_test');
var CodeMustBeStringTest = require('./code_must_be_string_test');
var PreContextMustBeStringTest = require('./pre_context_must_be_string_test');
var PostContextMustBeStringTest = require('./post_context_must_be_string_test');
var LocationMustBeArrayTest = require('./location_must_be_array_test');
var LocationTooLongTest = require('./location_too_long_test');
var LocationTooShortTest = require('./location_too_short_test');
var LocationMustBeNumbersTest = require('./location_must_be_numbers_test');
var InvalidCoordinateObjectTest = require('./invalid_coordinate_object_test');
var NoLocationOkTest = require('./no_location_ok_test');
var CodeBlockHasInvalidStreamIdTest = require('./code_block_has_invalid_stream_id_test');
var CodeBlockHasImproperAttributesTest = require('./code_block_has_improper_attributes_test');
var CodeBlockHasUnknownStreamIdTest = require('./code_block_has_unknown_stream_id_test');
var CodeBlockForBadStreamTypeTest = require('./code_block_for_bad_stream_type_test');
var CodeBlockFromDifferentTeamTest = require('./code_block_from_different_team_test');
var NumMarkersTest = require('./num_markers_test');
var MultipleCodeBlocksTest = require('./multiple_code_blocks_test');
var CodeBlockFromDifferentStreamTest = require('./code_block_from_different_stream_test');
var PostReplyTest = require('./post_reply_test');
var NoStreamIdTest = require('./no_stream_id_test');
var InvalidStreamIdTest = require('./invalid_stream_id_test');
var DirectOnTheFlyTest = require('./direct_on_the_fly_test');
var ChannelOnTheFlyTest = require('./channel_on_the_fly_test');
var FileStreamOnTheFlyTest = require('./file_stream_on_the_fly_test');
var InvalidRepoIdTest = require('./invalid_repo_id_test');
var NoStreamAttributeTest = require('./no_stream_attribute_test');
var InvalidTeamIdTest = require('./invalid_team_id_test');
var DuplicateChannelTest = require('./duplicate_channel_test');
var DuplicateDirectTest = require('./duplicate_direct_test');
var DuplicateFileStreamTest = require('./duplicate_file_stream_test');
var InvalidTypeTest = require('./invalid_type_test');
var MeDirectTest = require('./me_direct_test');
var MeChannelTest = require('./me_channel_test');
var NameRequiredTest = require('./name_required_test');
var NoFileTest = require('./no_file_test');
var NoRepoIdTest = require('./no_repo_id_test');
var ACLTeamTest = require('./acl_team_test');
var ACLStreamTest = require('./acl_stream_test');
var ACLTeamOnTheFlyTest = require('./acl_team_on_the_fly_test');
var ACLRepoOnTheFlyTest = require('./acl_repo_on_the_fly_test');
var NewPostMessageToTeamTest = require('./new_post_message_to_team_test');
var NewPostMessageToStreamTest = require('./new_post_message_to_stream_test');
var NewPostNoMessageTest = require('./new_post_no_message_test');
var NewFileStreamMessageToTeamTest = require('./new_file_stream_message_to_team_test');
var NewStreamMessageToMembersTest = require('./new_stream_message_to_members_test');
var NewStreamNoMessageTest = require('./new_stream_no_message_test');
var MostRecentPostTest = require('./most_recent_post_test');
var LastReadsNoneTest = require('./last_reads_none_test');
var NoLastReadsForAuthorTest = require('./no_last_reads_for_author_test');
var LastReadsPreviousPostTest = require('./last_reads_previous_post_test');
var NoLastReadsUpdateTest = require('./no_last_reads_update_test');
var SeqNumTest = require('./seqnum_test');
var StreamOnTheFlySeqNumTest = require('./stream_on_the_fly_seqnum_test');
var NumCommentsTest = require('./num_comments_test');
var NumCommentsMessageTest = require('./num_comments_message_test');
var MentionTest = require('./mention_test');
var PostCountTest = require('./post_count_test');
var SetPersonAnalyticsTest = require('./set_person_analytics_test');

class PostPostRequestTester {

	postPostTest () {
		new PostPostTest().test();
		new PostToDirectTest().test();
		new PostToChannelTest().test();
		new PostToFileStreamTest().test();
		new CodeBlockTest().test();
		new NoCommitHashTest().test();
		new CodeBlocksNotArrayTest().test();
		new CodeBlocksTooLongTest().test();
		new LocationTooShortTest().test();
		new CodeBlockNotObjectTest().test();
		new CodeBlockTooBigTest().test();
		new CodeMustBeStringTest().test();
		new PreContextMustBeStringTest().test();
		new PostContextMustBeStringTest().test();
		new LocationMustBeArrayTest().test();
		new LocationTooLongTest().test();
		new LocationMustBeNumbersTest().test();
		new InvalidCoordinateObjectTest().test();
		new NoLocationOkTest().test();
		new CodeBlockHasInvalidStreamIdTest().test();
		new CodeBlockHasImproperAttributesTest().test();
		new CodeBlockHasUnknownStreamIdTest().test();
		new CodeBlockForBadStreamTypeTest({ streamType: 'direct' }).test();
		new CodeBlockForBadStreamTypeTest({ streamType: 'channel' }).test();
		new CodeBlockFromDifferentTeamTest().test();
		new NumMarkersTest().test();
		new MultipleCodeBlocksTest().test();
		new CodeBlockFromDifferentStreamTest({ streamType: 'direct' }).test();
		new CodeBlockFromDifferentStreamTest({ streamType: 'channel' }).test();
		new CodeBlockFromDifferentStreamTest({ streamType: 'file' }).test();
		new PostReplyTest().test();
		new NoStreamIdTest().test();
		new InvalidStreamIdTest().test();
		new DirectOnTheFlyTest().test();
		new ChannelOnTheFlyTest().test();
		new FileStreamOnTheFlyTest().test();
		new InvalidRepoIdTest().test();
		new NoStreamAttributeTest({ attribute: 'teamId' }).test();
		new NoStreamAttributeTest({ attribute: 'type' }).test();
		new InvalidTeamIdTest().test();
		new DuplicateChannelTest().test();
		new DuplicateDirectTest().test();
		new DuplicateFileStreamTest().test();
		new InvalidTypeTest().test();
		new MeDirectTest().test();
		new MeChannelTest().test();
		new NameRequiredTest().test();
		new NoFileTest().test();
		new NoRepoIdTest().test();
		new ACLTeamTest({ }).test();
		new ACLStreamTest().test();
		new ACLTeamOnTheFlyTest().test();
		new ACLRepoOnTheFlyTest().test();
		new NewPostMessageToTeamTest().test();
		new NewPostMessageToStreamTest({ type: 'channel' }).test();
		new NewPostMessageToStreamTest({ type: 'direct' }).test();
		new NewPostNoMessageTest({ type: 'channel' }).test();
		new NewPostNoMessageTest({ type: 'direct' }).test();
		new NewFileStreamMessageToTeamTest().test();
		new NewStreamMessageToMembersTest({ type: 'channel' }).test();
		new NewStreamMessageToMembersTest({ type: 'direct' }).test();
		new NewStreamNoMessageTest({ type: 'channel' }).test();
		new NewStreamNoMessageTest({ type: 'direct' }).test();
		new MostRecentPostTest().test();
		new LastReadsNoneTest({ type: 'direct' }).test();
		new LastReadsNoneTest({ type: 'channel' }).test();
		new LastReadsNoneTest({ type: 'file' }).test();
		new NoLastReadsForAuthorTest().test();
		new LastReadsPreviousPostTest({ type: 'direct' }).test();
		new LastReadsPreviousPostTest({ type: 'channel' }).test();
		new LastReadsPreviousPostTest({ type: 'file' }).test();
		new NoLastReadsUpdateTest().test();
		new SeqNumTest().test();
		new StreamOnTheFlySeqNumTest().test();
		new NumCommentsTest().test();
		new NumCommentsMessageTest().test();
		new MentionTest().test();
		new PostCountTest().test();
		new SetPersonAnalyticsTest().test();
	}
}

module.exports = PostPostRequestTester;
