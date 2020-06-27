/** @format */

import * as Segment from 'expo-analytics-segment'
import getEnvVars from '../../../environment'

/**
 * All names of events tracked using Segment. Please only use the names here.
 * Add names as needed.
 *
 * Property key is the reference in the app. Property value is the name
 * appeared in the server-side dashboard.
 */
const EVENT = {
    // Goal
    CREATE_GOAL_MODAL_OPENED: 'CreateGoalModal Opened',
    CREATE_GOAL_MODAL_CANCELLED: 'CreateGoalModal Cancelled',
    GOAL_CREATED: 'Goal Created',
    EDIT_GOAL_MODAL_OPENED: 'EditGoalModal Opened',
    EDIT_GOAL_MODAL_CANCELLED: 'EditGoalModal Cancelled',
    GOAL_UPDATED: 'Goal Updated',
    GOAL_DELETED: 'Goal Deleted',
    GOAL_LIKED: 'Goal Liked',
    GOAL_UNLIKED: 'Goal Unliked',
    GOAL_FOLLOWED: 'Goal Followed', //
    GOAL_UNFOLLOWED: 'Goal Unfollowed', //

    // Post
    CREATE_POST_MODAL_OPENED: 'CreatePostModal Opened',
    CREATE_POST_MODAL_CANCELLED: 'CreatePostModal Cancelled',
    POST_CREATED: 'Post Created',
    EDIT_POST_MODAL_OPENED: 'EditPostModal Opened',
    EDIT_POST_MODAL_CANCELLED: 'EditPostModal Cancelled',
    POST_UPDATED: 'Post Updated',
    POST_DELETED: 'Post Deleted',
    POST_LIKED: 'Post Liked',
    POST_UNLIKED: 'Post Unliked',
    POST_OPENED: 'Post Opened',
    POST_FOLLOWED: 'Post Followed', //
    POST_UNFOLLOWED: 'Post Unfollowed', //

    // Comment
    COMMENT_ADDED: 'Comment Added',
    COMMENT_DELETED: 'Comment Deleted',
    COMMENT_LIKED: 'Comment Liked',
    COMMENT_UNLIKED: 'Comment Unliked',

    // Event
    CREATE_EVENT_MODAL_OPENED: 'CreateEventModal Opened',
    CREATE_EVENT_MODAL_CANCELLED: 'CreateEventModal Cancelled',
    EVENT_CREATED: 'Event Created',
    EDIT_EVENT_MODAL_OPENED: 'EditEventModal Opened',
    EDIT_EVENT_MODAL_CANCELLED: 'EditEventModal Cancelled',
    EVENT_EDITED: 'Event Updated',
    EVENT_DELETED: 'Event Deleted',
    EVENT_RSVPED: 'Event Rsvped',
    EVENT_PARTICIPANT_INVITED: 'Event Participant Invited',
    EVENT_DETAIL_OPENED: 'Event Detail Opened',

    // Tribe
    CREATE_TRIBE_MODAL_OPENED: 'CreateTribeModal Opened',
    CREATE_TRIBE_MODAL_CANCELLED: 'CreateTribeModal Cancelled',
    TRIBE_CREATED: 'Tribe Created',
    EDIT_TRIBE_MODAL_OPENED: 'EditTribeModal Opened',
    EDIT_TRIBE_MODAL_CANCELLED: 'EditTribeModal Cancelled',
    TRIBE_UPDATED: 'Tribe Updated',
    TRIBE_DELETED: 'Tribe Deleted',
    TRIBE_INVITE_SENT: 'TribeInvit Sent',
    TRIBE_INVITE_ACCEPTED: 'TribeInvit Accepted',
    TRIBE_INVITE_DECLINED: 'TribeInvit Declined',
    TRIBE_JOIN_REQUESTED: 'TribeJoin Requested',
    TRIBE_JOIN_CANCELLED: 'TribeJoin Cancelled',
    TRIBE_LEFT: 'Tribe Left',
    TRIBE_MEMBER_REMOVED: 'TribeMember Removed',
    TRIBE_DETAIL_OPENED: 'Tribe Detail Opened',

    // Chat
    CREATE_CHATROOM_OPENED: 'CreateChatroom Opened',
    CREATE_CHATROOM_CANCELLED: 'CreateChatroom Cancelled',
    CHATROOM_CREATED: 'CreateChatroom Created',
    EDIT_CHATROOM_OPENED: 'EditChatroom Opened',
    EDIT_CHATROOM_CANCELLED: 'EditChatroom Cancelled',
    CHATROOM_UPDATED: 'EditChatroom Updated',
    CHATROOM_JOIN_REQUEST_ACCEPTED: 'Chatroom Join Request Accepted',
    CHATROOM_MEMBER_PROMOTED: 'Chatroom Member Promoted',
    CHATROOM_MEMBER_DEMOTED: 'Chatroom Member Demoted',
    CHATROOM_MEMBER_REMOVED: 'Chatroom Member Removed',
    CHATROOM_MESSAGE_SENT: 'Chatroom Message Sent',

    // Profile
    PROFILE_UPDATED: 'Profile Updated',
    VERIFY_EMAIL_RESENT: 'VerificationEmail Resent',
    EMAIL_UPDATED: 'Email Updated',
    PHONE_UPDATED: 'Phone Updated',
    PHONE_VERIFIED: 'Phone Verified',
    USER_BLOCKED: 'User Blocked',
    USER_UNBLOCKED: 'User Unblocked',
    PROFILE_OPENED: 'Profile Opened',
    PROFILE_REFRESHED: 'Profile Refreshed',

    // Registration
    REG_INTRO: 'Registration Intro Opened',
    REG_INTRO_SKIP: 'Registration Intro Skiped',
    REG_PROFILE: 'Registration AddProfile Opened',
    REG_CAMERA: 'Registration Camera Opened',
    REG_CAMROLL: 'Registration CameraRoll Opened',
    REG_CONTACT: 'Registration Contact Opened',
    REG_CONTACT_SKIP: 'Registration Contact Skiped',
    REG_CONTACT_SYNC: 'Registration Contact Synced',
    REG_CONTACT_SYNC_SKIP: 'Registration Contact Sync Skiped',
    REG_SUCCESS: 'Registration Success',

    // Search
    SEARCH_OPENED: 'Search Opened',
    SEARCH_CLOSED: 'Search Closed',
    USER_SEARCHED: 'User Searched',
    SEARCH_QUERY_SENT: 'Search Query Sent',
    TRIBE_MEMBER_SEARCHED: 'Tribe Member Searched',
    SEARCH_RESULT_CLICKED: 'Search Result Clicked',

    // Report
    USER_REPORTED: 'User Reported',
    GOAL_REPORTED: 'Goal Reported',
    POST_REPORTED: 'Post Reported',
    TRIBE_REPORTED: 'Tribe Reported',
    EVENT_REPORTED: 'Event Reported',
    COMMENT_REPORTED: 'Comment Reported',
    GENERAL_REPORT_CREATED: 'General Report Created',

    // App
    APP_ACTIVE: 'App Active',
    APP_INACTIVE: 'App Inactive',
    USER_LOGOUT: 'User Logout',
    TUTORIAL_STARTED: 'Tutorial Started',
    TUTORIAL_PAGE_VIEWED: 'Tutorial Page Viewed',
    TUTORIAL_DONE: 'Tutorial Done',
    NOTIFICATION_SELECTED: 'Notification Selected',
    NOTIFICATION_DETAIL_OPENED: 'Notification Detail Opened',
}

const SCREENS = {
    LOGIN_PAGE: 'LoginPage',
    HOME: 'Home',
    GOAL_DETAIL: 'GoalDetail',
    POST_DETAIL: 'PostDetail',
    SHARE_DETAIL: 'ShareDetail',
    PROFILE: 'Profile',
    PROFILE_DETAIL: 'ProfileDetail',
    EVENT_TAB: 'EventTab',
    EVENT_DETAIL: 'EventDetail',
    TRIBE_TAB: 'TribeTab',
    TRIBE_DETAIL: 'TribeDetail',
    SETTING: 'Setting',
    EMAIL: 'Email',
    EDIT_EMAIL_FORM: 'EditEmailForm',
    EDIT_PWD_FORM: 'EditPasswordForm',
    PHONE_VERIFICATION: 'PhoneVerification',
    ADD_PHONE_NUMBER: 'AddPhoneNumber',
    EDIT_PHONE_NUMBER: 'EditPhoneNumber',
    FRIENDS_BLOCKED: 'FriendsBlocked',
    PRIVACY: 'Privacy',
    FRIENDS_SETTING: 'FriendsSettings',
    CHATROOM_PUBLIC_VIEW: 'ChatRoomPubicView',
    NOTIFICATION_SETTING: 'NotificationSetting',
    SEARCH_OVERLAY: 'SearchOverlay',
    MEET_TAB: 'MeetTab',
    SHARE_MEET_TAB: 'ShareMeetTab',
    FRIEND_TAB_VIEW: 'FriendTabView',
    REQUEST_TAB_VIEW: 'RequestTabView',
    DISCOVER_TAB_VIEW: 'DiscoverTabView',
    FRIEND_INVITATION_VIEW: 'FriendInvitationView',
}

const allEventNames = new Set()
const allScreenNames = new Set()

const { SEGMENT_CONFIG } = getEnvVars()

const initSegment = () => {
    Segment.initialize({ iosWriteKey: SEGMENT_CONFIG.IOS_WRITE_KEY })
    allEventNames.clear()
    for (const prop in EVENT) {
        if (EVENT.hasOwnProperty(prop)) {
            allEventNames.add(EVENT[prop])
        }
    }
    allScreenNames.clear()
    for (const prop in SCREENS) {
        if (SCREENS.hasOwnProperty(prop)) {
            allScreenNames.add(SCREENS[prop])
        }
    }
}

const identify = (userId, username) => {
    Segment.identify(userId)
}

const identifyWithTraits = (userId, trait) => {
    Segment.identifyWithTraits(userId, trait)
}

const track = (event) => {
    if (!allEventNames.has(event)) {
        throw `Don't use customized event name '${event}'. Define it first in src/monitoring/segment`
    }
    // console.log(`>>>>>> track: ${event}`)
    Segment.track(event)
}

const trackWithProperties = (event, properties) => {
    if (!allEventNames.has(event)) {
        throw `Don't use customized event name '${event}'. Define it first in src/monitoring/segment`
    }
    // console.log(`>>>>>> trackWithProperties: ${event}:\n${JSON.stringify(properties)}`)
    Segment.trackWithProperties(event, properties)
}

const trackViewScreen = (screenName) => {
    if (!allScreenNames.has(screenName)) {
        throw `Don't use customized screen name '${screenName}'. Define it first in src/monitoring/segment`
    }
    // console.log(`>>>>>> trackViewScreen: ${event}`)
    // Segment.screen(screenName);
    Segment.track(`Screen ${screenName}`)
}

const trackScreenWithProps = (screenName, properties) => {
    if (!allScreenNames.has(screenName)) {
        throw `Don't use customized screen name '${screenName}'. Define it first in src/monitoring/segment`
    }
    // console.log(`>>>>>> trackScreenWithProps: ${screenName}\n${JSON.stringify(properties)}`)
    // Segment.screenWithProperties does not seem to work properly
    Segment.trackWithProperties(`ScreenView ${screenName}`, properties)
}

const resetUser = () => {
    Segment.reset()
}

export {
    resetUser,
    trackViewScreen,
    trackScreenWithProps,
    track,
    trackWithProperties,
    identify,
    initSegment,
    identifyWithTraits,
    EVENT,
    SCREENS,
}
