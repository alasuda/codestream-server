// handle unit tests for the "POST /posts" request

'use strict';

const PostPostTest = require('./post_post_test');
const PostToDirectTest = require('./post_to_direct_test');
const PostToFileStreamTest = require('./post_to_file_stream_test');
const CodeBlockTest = require('./code_block_test');
const NoCommitHashTest = require('./no_commit_hash_test');
const NoCommitHashWithFileTest = require('./no_commit_hash_with_file_test');
const NoCommitHashWithStreamTest = require('./no_commit_hash_with_stream_test');
const CodeBlocksNotArrayTest = require('./code_blocks_not_array_test');
const CodeBlocksTooLongTest = require('./code_blocks_too_long_test');
const CodeBlockNotObjectTest = require('./code_block_not_object_test');
const CodeBlockTooBigTest = require('./code_block_too_big_test');
const CodeMustBeStringTest = require('./code_must_be_string_test');
const NoCodeTest = require('./no_code_test');
const PreContextMustBeStringTest = require('./pre_context_must_be_string_test');
const PostContextMustBeStringTest = require('./post_context_must_be_string_test');
const InvalidFileTest = require('./invalid_file_test');
const LocationMustBeArrayTest = require('./location_must_be_array_test');
const LocationTooLongTest = require('./location_too_long_test');
const LocationTooShortTest = require('./location_too_short_test');
const LocationMustBeNumbersTest = require('./location_must_be_numbers_test');
const RemotesMustBeArrayTest = require('./remotes_must_be_array_test');
const RemotesMustBeArrayOfStringsTest = require('./remotes_must_be_array_of_strings_test');
const TooManyRemotesTest = require('./too_many_remotes_test');
const InvalidCoordinateObjectTest = require('./invalid_coordinate_object_test');
const NoLocationOkTest = require('./no_location_ok_test');
const CodeBlockHasInvalidStreamIdTest = require('./code_block_has_invalid_stream_id_test');
const CodeBlockHasImproperAttributesTest = require('./code_block_has_improper_attributes_test');
const CodeBlockHasUnknownStreamIdTest = require('./code_block_has_unknown_stream_id_test');
const CodeBlockForBadStreamTypeTest = require('./code_block_for_bad_stream_type_test');
const CodeBlockFromDifferentTeamTest = require('./code_block_from_different_team_test');
const CodeBlockStreamOnTheFly = require('./code_block_stream_on_the_fly_test');
const FindRepoByRemotesTest = require('./find_repo_by_remotes_test');
const UpdateMatchedRepoWithRemotesTest = require('./update_matched_repo_with_remotes_test');
const UpdateSetRepoWithRemotesTest = require('./update_set_repo_with_remotes_test');
const CreateRepoOnTheFlyTest = require('./create_repo_on_the_fly_test');
const NumMarkersTest = require('./num_markers_test');
const CodeBlockFromDifferentStreamTest = require('./code_block_from_different_stream_test');
const PostReplyTest = require('./post_reply_test');
const NoStreamIdTest = require('./no_stream_id_test');
const InvalidStreamIdTest = require('./invalid_stream_id_test');
const DirectOnTheFlyTest = require('./direct_on_the_fly_test');
const ChannelOnTheFlyTest = require('./channel_on_the_fly_test');
const FileStreamOnTheFlyTest = require('./file_stream_on_the_fly_test');
const InvalidRepoIdTest = require('./invalid_repo_id_test');
const NoStreamAttributeTest = require('./no_stream_attribute_test');
const InvalidTeamIdTest = require('./invalid_team_id_test');
const DuplicateChannelTest = require('./duplicate_channel_test');
const DuplicateDirectTest = require('./duplicate_direct_test');
const DuplicateFileStreamTest = require('./duplicate_file_stream_test');
const InvalidTypeTest = require('./invalid_type_test');
const NoTypeTest = require('./no_type_test');
const InvalidPrivacyTest = require('./invalid_privacy_test');
const MeDirectTest = require('./me_direct_test');
const MeChannelTest = require('./me_channel_test');
const NameRequiredTest = require('./name_required_test');
const NoFileTest = require('./no_file_test');
const TeamStreamMustBeChannelTest = require('./team_stream_must_be_channel_test');
const NoRepoIdTest = require('./no_repo_id_test');
const NoTeamIdTest = require('./no_team_id_test');
const ACLTeamTest = require('./acl_team_test');
const ACLStreamTest = require('./acl_stream_test');
const ACLTeamOnTheFlyTest = require('./acl_team_on_the_fly_test');
const NewPostMessageToTeamTest = require('./new_post_message_to_team_test');
const NewPostMessageToTeamStreamTest = require('./new_post_message_to_team_stream_test');
const NewPostMessageToChannelTest = require('./new_post_message_to_channel_test');
const NewPostMessageToDirectTest = require('./new_post_message_to_direct_test');
const NewPostNoMessageToChannelTest = require('./new_post_no_message_to_channel_test');
const NewPostNoMessageToDirectTest = require('./new_post_no_message_to_direct_test');
const NewFileStreamMessageToTeamTest = require('./new_file_stream_message_to_team_test');
const NewCodeBlockStreamMessageToTeamTest = require('./new_code_block_stream_message_to_team_test');
const NewTeamStreamMessageToTeamTest = require('./new_team_stream_message_to_team_test');
const NewChannelMessageToMembersTest = require('./new_channel_message_to_members_test');
const NewDirectMessageToMembersTest = require('./new_direct_message_to_members_test');
const NewRepoMessageToTeamTest = require('./new_repo_message_to_team_test');
const UpdatedSetRepoMessageTest = require('./updated_set_repo_message_test');
const UpdatedMatchedRepoMessageTest = require('./update_matched_repo_message_test');
const MostRecentPostTest = require('./most_recent_post_test');
const LastReadsNoneTest = require('./last_reads_none_test');
const NoLastReadsForAuthorTest = require('./no_last_reads_for_author_test');
const LastReadsPreviousPostTest = require('./last_reads_previous_post_test');
const NoLastReadsUpdateTest = require('./no_last_reads_update_test');
const SeqNumTest = require('./seqnum_test');
const StreamOnTheFlySeqNumTest = require('./stream_on_the_fly_seqnum_test');
const NumCommentsTest = require('./num_comments_test');
const NumCommentsMessageTest = require('./num_comments_message_test');
const MentionTest = require('./mention_test');
const UnregisteredMentionTest = require('./unregistered_mention_test');
const MessageToAuthor = require('./message_to_author_test');
const SetPersonAnalyticsTest = require('./set_person_analytics_test');
const OnTheFlyCodeBlockStreamFromDifferentTeamTest = require('./on_the_fly_code_block_stream_from_different_team_test');
const OnTheFlyCodeBlockStreamRepoNotFoundTest = require('./on_the_fly_code_block_stream_repo_not_found_test');
const OnTheFlyCodeBlockStreamNoRepoIdTest = require('./on_the_fly_code_block_stream_no_repo_id_test');
const OnTheFlyCodeBlockStreamInvalidRepoIdTest = require('./on_the_fly_code_block_stream_invalid_repo_id_test');
const HasRepliesTest = require('./has_replies_test');
const SecondReplyTest = require('./second_reply_test');
const HasRepliesMessageToStreamTest = require('./has_replies_message_to_stream_test');
const NumRepliesMessageToStreamTest = require('./num_replies_message_to_stream_test');
const OriginFromPluginTest = require('./origin_from_plugin_test');
const ProviderPostTest = require('./provider_post_test');
const ExtendedAttributesTest = require('./extended_attributes_test');

class PostPostRequestTester {

	postPostTest () {
		new PostPostTest().test();
		new PostToDirectTest().test();
		new PostToFileStreamTest().test();
		new CodeBlockTest().test();
		new CodeBlockFromDifferentStreamTest({ streamType: 'direct' }).test();
		new CodeBlockFromDifferentStreamTest({ streamType: 'channel' }).test();
		new CodeBlockFromDifferentStreamTest({ streamType: 'file' }).test();
		new NoCommitHashTest().test();
		new NoCommitHashWithFileTest().test();
		new NoCommitHashWithStreamTest().test();
		new CodeBlocksNotArrayTest().test();
		new CodeBlocksTooLongTest().test();
		new LocationTooShortTest().test();
		new CodeBlockNotObjectTest().test();
		new CodeBlockTooBigTest().test();
		new CodeMustBeStringTest().test();
		new NoCodeTest().test();
		new PreContextMustBeStringTest().test();
		new PostContextMustBeStringTest().test();
		new InvalidFileTest().test();
		new LocationMustBeArrayTest().test();
		new LocationTooLongTest().test();
		new LocationMustBeNumbersTest().test();
		new RemotesMustBeArrayTest().test();
		new RemotesMustBeArrayOfStringsTest().test();
		new TooManyRemotesTest().test();
		new InvalidCoordinateObjectTest().test();
		new NoLocationOkTest().test();
		new CodeBlockHasInvalidStreamIdTest().test();
		new CodeBlockHasImproperAttributesTest().test();
		new CodeBlockHasUnknownStreamIdTest().test();
		new CodeBlockForBadStreamTypeTest({ streamType: 'direct' }).test();
		new CodeBlockForBadStreamTypeTest({ streamType: 'channel' }).test();
		new CodeBlockFromDifferentTeamTest().test();
		new NumMarkersTest().test();
		new CodeBlockStreamOnTheFly({ streamType: 'direct' }).test();
		new CodeBlockStreamOnTheFly({ streamType: 'channel' }).test();
		new CodeBlockStreamOnTheFly({ streamType: 'file' }).test();
		new FindRepoByRemotesTest().test();
		new UpdateMatchedRepoWithRemotesTest().test();
		new UpdateSetRepoWithRemotesTest().test();
		new CreateRepoOnTheFlyTest().test();
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
		new NoTypeTest().test();
		new InvalidPrivacyTest().test();
		new MeDirectTest().test();
		new MeChannelTest().test();
		new NameRequiredTest().test();
		new NoFileTest().test();
		new TeamStreamMustBeChannelTest().test();
		new NoRepoIdTest().test();
		new NoTeamIdTest().test();
		new ACLStreamTest().test();
		new ACLTeamTest().test();
		new ACLTeamOnTheFlyTest().test();
		new NewPostMessageToTeamTest().test();
		new NewPostMessageToTeamStreamTest().test();
		new NewPostMessageToChannelTest().test();
		new NewPostMessageToDirectTest().test();
		new NewPostNoMessageToChannelTest().test();
		new NewPostNoMessageToDirectTest().test();
		new NewFileStreamMessageToTeamTest().test();
		new NewCodeBlockStreamMessageToTeamTest().test();
		new NewTeamStreamMessageToTeamTest().test();
		new NewChannelMessageToMembersTest().test();
		new NewDirectMessageToMembersTest().test();
		new NewRepoMessageToTeamTest().test();
		new UpdatedSetRepoMessageTest().test();
		new UpdatedMatchedRepoMessageTest().test();
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
		new HasRepliesTest().test();
		new SecondReplyTest().test();
		new HasRepliesMessageToStreamTest({ type: 'direct' }).test();
		new HasRepliesMessageToStreamTest({ type: 'channel' }).test();
		new NumRepliesMessageToStreamTest({ type: 'direct' }).test();
		new NumRepliesMessageToStreamTest({ type: 'channel' }).test();
		new MentionTest().test();
		new UnregisteredMentionTest().test();
		new MessageToAuthor().test();
		new SetPersonAnalyticsTest().test();
		new OnTheFlyCodeBlockStreamFromDifferentTeamTest().test();
		new OnTheFlyCodeBlockStreamRepoNotFoundTest().test();
		new OnTheFlyCodeBlockStreamNoRepoIdTest().test();
		new OnTheFlyCodeBlockStreamInvalidRepoIdTest().test();
		new OriginFromPluginTest().test();
		new ProviderPostTest().test();
		new ExtendedAttributesTest().test();
	}
}

module.exports = PostPostRequestTester;
