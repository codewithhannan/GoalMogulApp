/** @format */

import * as Segment from 'expo-analytics-segment'
import getEnvVars from '../../../environment'
import React from 'react'
import LRUCache from 'lru-cache'

const DEBUG = getEnvVars().segmentDebug;
const TAG = '[Segment]'

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
    GOAL_DEADLINE_ADDED: 'Goal Deadline Added',
    GOAL_STEP_ADDED: 'Goal Step Added',
    GOAL_NEED_ADDED: 'Goal Need Added',
    GOAL_MARKED_DONE: 'Goal Marked Complete',
    GOAL_MARKED_UNDONE: 'Goal Marked Incomplete',
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
    POST_SHARED: 'Post Shared',

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
    CHAT_INTIVE_SENT: 'Chatroom Invite Sent',
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
    PROFILE_PHOTO_UPDATED: 'Profile Photo Updated',

    /** Registration */ 
    REG_ACCOUNT_CREATED: 'Registration Account Created', //ok
    // add profile photo
    REG_ADD_PHOTO_SKIPPED: 'Registration AddPhoto Skipped',
    REG_ADD_PHOTO_ATTACHED: 'Registration AddPhoto Attached',
    REG_ADD_PHOTO_UPLOADED: 'Registration AddPhoto Uploaded',
    REG_CAMERA: 'Registration Camera Opened',
    REG_CAMROLL: 'Registration CameraRoll Opened',
    // contact sync
    REG_CONTACT_SYNC: 'Registration Contact Synced',
    REG_CONTACT_SYNC_SKIP: 'Registration ContactSync Skiped',
    REG_CONTACT_INVITE_SKIPPED: 'Registration ContactInvite Skipped',
    REG_CONTACT_INVITE_CLICKED: 'Registration ContactInvite Clicked',
    REG_CONTACT_INTIVE_SENT: 'Registration ContactInvite Sent',
    REG_CONTACT_MEMBER_ADDED: 'Registration ContactMember Added',
    // survey
    REG_SURVEY_SELECTED: 'Registration Survey Selected',
    // tribe selection
    REG_TRIBE_SELECTED: 'Registration Tribe selected',
    // community guideline
    REG_COMMUNITY_SWIPED: 'Registration CommunityGuideline Swiped',
    // Deprecated Registration events
    REG_INTRO: 'Registration Intro Opened', // no longer has this page since v0.7.x
    REG_INTRO_SKIP: 'Registration Intro Skiped', // no longer has this page since v0.7.x
    REG_PROFILE: 'Registration AddProfile Opened', // no longer has this page since v0.7.x
    REG_CONTACT_SKIP: 'Registration Contact Skiped', // no longer needs this event
    REG_CONTACT: 'Registration ContactSync Opened', // replaced by screen impression

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
    ONBOARDING_DONE: 'Onboarding Done',
    NOTIFICATION_SELECTED: 'Notification Selected',
    NOTIFICATION_DETAIL_OPENED: 'Notification Detail Opened',
}

const SCREENS = {
    SPLASH_SCREEN: 'SplashScreen',
    LOGIN_PAGE: 'LoginPage',
    HOME: 'Home',
    HOME_GOAL: 'HomeGoalTab',
    HOME_FEED: 'HomeFeedTab',
    GOAL_DETAIL: 'GoalDetail',
    POST_DETAIL: 'PostDetail',
    SHARE_DETAIL: 'ShareDetail',
    PROFILE: 'Profile',
    PROFILE_DETAIL: 'ProfileDetail',
    EVENT_TAB: 'EventTab',
    EVENT_DETAIL: 'EventDetail',
    MY_EVENT_DETAIL: 'MyEventDetail',
    TRIBE_TAB: 'TribeTab',
    TRIBE_DETAIL: 'TribeDetail',
    TRIBE_GOAL_SHARE: 'TribeGoalShare',
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
    SHARE_EXPLORE_TAB: 'ShareExploreTab',
    FRIEND_TAB_VIEW: 'FriendTabView',
    REQUEST_TAB_VIEW: 'RequestTabView',
    DISCOVER_TAB_VIEW: 'DiscoverTabView',
    FRIEND_INVITATION_VIEW: 'FriendInvitationView',
    PROFILE_ABOUT_TAB: 'ProfileAboutTab',
    PROFILE_GOAL_TAB: 'ProfileGoalTab',
    PROFILE_POST_TAB: 'ProfilePostTab',
    PROFILE_NEED_TAB: 'ProfileNeedTab',
    EXPLORE_PAGE: 'ExplorePage',
    EXPLORE_CHAT_TAB: 'ExploreChatTab',
    EXPLORE_EVENT_TAB: 'ExploreEventTab',
    EXPLORE_TRIBE_TAB: 'ExploreTribeTab',
    EXPLORE_PEOPLE_TAB: 'ExplorePeopleTab',

    // Onboarding section
    REG_REISTER_ACCOUNT: 'RegistrationAccountView',
    REG_ADD_PHOTO: 'RegistrationAddPhotoView',
    REG_CONTACTY_SYNC: 'RegistrationContactSyncView',
    REG_SURVEY: 'RegistrationSurveyView',
    REG_TRIBES: 'RegistrationTribeView',
    REG_COMMUNITY: 'RegistrationCommunityGuidelineView',
    REG_WELCOME: 'RegistrationWelcomeView',
}

const allEventNames = new Set<string>()
const allScreenNames = new Set<string>()

const eventsQueue = new LRUCache<string, number>(100)
const screensQueue = new LRUCache<string, number>(100)

const { SEGMENT_CONFIG } = getEnvVars()

/**
 * Calls to initialize segment library. Must call when app starts.
 */
function initSegment() {
    Segment.initialize({ iosWriteKey: SEGMENT_CONFIG.IOS_WRITE_KEY, androidWriteKey: SEGMENT_CONFIG.ANDROID_WRITE_KEY })
    allEventNames.clear()
    for (const prop in EVENT) {
        if (EVENT.hasOwnProperty(prop)) {
            allEventNames.add((EVENT as Record<string, string>)[prop])
        }
    }
    allScreenNames.clear()
    for (const prop in SCREENS) {
        if (SCREENS.hasOwnProperty(prop)) {
            allScreenNames.add((SCREENS as Record<string, string>)[prop])
        }
    }
}

/**
 * Identifies a user. Calls when user logs in, signs up, or otherwise changes its identity.
 */
function identify(userId: string, username: string) {
    Segment.identify(userId)
}

/**
 * Identifies a user with a list of traits.
 */
function identifyWithTraits(userId: string, trait: Record<string, unknown>) {
    Segment.identifyWithTraits(userId, trait)
}

function validateEventTracking(eventName: string): boolean {
    if (!allEventNames.has(eventName)) {
        if (DEBUG) {
            console.warn(`${TAG} Don't use customized event name '${eventName}'. Define it first in src/monitoring/segment`)
        }
        return false
    }
    const lastMs = eventsQueue.get(eventName) ?? 0
    const nowMs = new Date().getTime()
    if (nowMs - lastMs < 200) {
        if (DEBUG) {
            console.warn(`${TAG} '${eventName}' fired too frequent. Likely duplicate`)
        }
        return false
    }
    eventsQueue.set(eventName, nowMs, /* maxAge= */ 5000)
    return true
}

function validateScreenTracking(screenName: string): boolean {
    if (!allScreenNames.has(screenName)) {
        if (DEBUG) {
            console.warn(`${TAG} Don't use customized screen name '${screenName}'. Define it first in src/monitoring/segment`)
        }
        return false
    }
    const lastMs = screensQueue.get(screenName) ?? 0
    const nowMs = new Date().getTime()
    if (nowMs - lastMs < 200) {
        if (DEBUG) {
            console.warn(`${TAG} '${screenName}' fired too frequent. Likely duplicate`)
        }
        return false
    }
    screensQueue.set(screenName, nowMs, /* maxAge= */ 5000)
    return true
}

/** 
 * Sends a tracking event with the supplied name to Segment. 
 * 
 * @param eventName name of the event defined in `EVENT`
 */
function track(eventName: string) {
    if (!validateEventTracking(eventName)) { return }
    if (DEBUG) {
        console.log(`${TAG} track: ${eventName}`)
    }
    Segment.track(eventName)
}

/** 
 * Sends a tracking event with the supplied name and a list of properties to Segment. 
 * 
 * @param eventName name of the event defined in `EVENT`
 */
function trackWithProperties(eventName: string, properties: Record<string, unknown>) {
    if (!validateEventTracking(eventName)) { return }
    if (DEBUG) { console.log(`${TAG} trackWithProperties: ${eventName}:\n${JSON.stringify(properties)}`) }
    Segment.trackWithProperties(eventName, properties)
}

/** 
 * Tracks when user views a screen, aka. impression. It should be called when the new component initializes.
 * 
 * @param screenName name of the screen defined in `SCREENS`
 */
function trackViewScreen(screenName: string) {
    if (!validateScreenTracking(screenName)) { return }
    if (DEBUG) { console.log(`${TAG} trackViewScreen: ${screenName}`) }
    Segment.track(`ScreenView ${screenName}`)
}

/** 
 * Tracks when user views a screen, aka. impression with a list of properties.
 * 
 * @param screenName name of the screen defined in `SCREENS`
 */
function trackScreenWithProps(screenName: string, properties: Record<string, unknown>) {
    if (!validateScreenTracking(screenName)) { return }
    if (DEBUG) { console.log(`${TAG} trackScreenWithProps: ${screenName}\n${JSON.stringify(properties)}`) }
    // Segment.screenWithProperties does not seem to work properly
    Segment.trackWithProperties(`ScreenView ${screenName}`, properties)
}

/** 
 * Tracks when user leaves a screen. 
 * 
 * Together with `trackViewScreen`, we can track when user enters / leaves
 * a specific component / page, and how long they spend in that page. So usually, `trackViewScreen` and
 * `trackScreenCloseWithProps` come in pairs.
 * 
 * @param screenName name of the screen defined in `SCREENS`
 */
function trackScreenCloseWithProps(screenName: string, properties: Record<string, unknown>) {
    if (!validateScreenTracking(screenName)) { return }
    if (DEBUG) { console.log(`${TAG} trackScreenCloseWithProps: ${screenName}\n${JSON.stringify(properties)}`) }
    // Segment.screenWithProperties does not seem to work properly
    Segment.trackWithProperties(`ScreenClose ${screenName}`, properties)
}

/**
 * Resets user identity. Should be called when the user logs out.
 */
function resetUser() {
    Segment.reset()
}

/**
 * Empowers the given component with predefined analytics tracking.
 * 
 * Currently, it adds screen enter and leave tracking, as well as how long a user stays there.
 */
function wrapAnalytics(Comp: React.ComponentType<unknown>, screenName: string) {
    class AnalyticsWrapper extends React.Component {
        readonly _analyticsVars = {
            startTime: new Date(),
        };

        componentDidMount() {
            this._analyticsVars.startTime = new Date()
            trackViewScreen(screenName)
        }

        componentWillUnmount() {
            const duration =
                (new Date().getTime() - this._analyticsVars.startTime.getTime()) / 1000
            trackScreenCloseWithProps(screenName, {
                DurationSec: duration,
            })
        }

        render() {
            const { forwardedRef, ...rest } = this.props
            return <Comp {...rest} ref={forwardedRef} />
        }
    }

    return React.forwardRef((props, ref) => {
        return <AnalyticsWrapper {...props} forwardedRef={ref} />
    })
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
    wrapAnalytics,
    EVENT,
    SCREENS,
}
