/**
 * Sentry related constants
 *
 * @format
 */

const SENTRY_TAGS = {
    GOOGLE_SERVIVE: 'google service',
    ACTION: {
        LOGIN_IN: 'login',
        LOGOUT: 'logout',
        FETCH_USER_PROFILE: 'fetech user profile',
        USERNAME: 'username',
        TOKEN: 'token verification',
        UNSUBSCRIBE_NOTIFICATIONS:
            'unsubscribe notifications (expo push token deletion)',
        GOAL_UPDATE: 'goal update',
    },
    AUTH: {
        ACTION: 'AuthActions',
        EXPO_SECURE_STORE_FETCH: 'expo secure store fetch',
        AUTO_AUTHENTICATE: 'auto login',
    },
    TRIBE: {
        ACTION: 'tribe action',
        REDUCER: 'tribe reducer',
        SELECTOR: 'tribe selector',
    },
    GOAL: {
        ACTION: 'goal action',
        REDUCER: 'goal reducer',
        SELECTOR: 'goal selector',
    },
    POST: {
        ACTION: 'post action',
        REDUCER: 'post reduer',
        SELECTOR: 'post selector',
    },
    CHAT: {
        ACTION: 'chat action',
        REDUCER: 'chat reducer',
        SELECTOR: 'chat seletor',
    },
    REGISTRATION: {
        ACTION: 'registration action',
    },
    SEARCH: {
        SEARCH_USER_ACTION: 'search user action',
    },
}

const SENTRY_TAG_VALUE = {
    ACTIONS: {
        FAILED: 'failed',
    },
}

const SENTRY_MESSAGE_TYPE = {
    ERROR: 'error', // handle exception being thrown, e.g. catch(err)
    MESSAGE: 'message', // customized error messages in code piece
    EVENT: 'event', // currently this is not used as context is added in scope
}

const SENTRY_CONTEXT = {
    USER: {
        USER_ID: 'user id',
    },
    TRIBE: {
        PAGE: {
            PAGE_ID: 'tribe page id',
        },
        MEMBER_UPDATE_TYPE: 'tribe membership update type',
        TRIBE_ID: 'tribe id',
        LEAVE_TYPE: 'leave type', // leave type can be removed by admin or member leaves himself
    },
    PAGINATION: {
        SKIP: 'skip',
        LIMIT: 'limit',
    },
    POST: {
        POST_ID: 'post id',
    },
    GOAL: {
        GOAL_ID: 'goal id',
    },
    CHAT: {
        CHAT_ID: 'chat id',
        ADDEE_ID: 'chat invite addee id',
        PROMOTEE_ID: 'chat promotee id',
        DEMOTEE_ID: 'chat demotee id',
        MEMBER_ID: 'chat member id',
    },
    REGISTRATION: {
        USER_ID: 'user id',
        EMAIL: 'email',
        PHONE_NUMBER: 'phone number',
    },
    LOGIN: {
        USERNAME: 'username',
    },
    SEARCH: {
        QUERY: 'search query',
    },
}

// Based on the document, exception / message level can be one of:
// 'fatal', 'error', 'warning', 'log', 'info, 'debug', 'critical'
const SENTRY_MESSAGE_LEVEL = {
    DEBUG: 'debug', // debugging purpose
    INFO: 'info', // extra information for app behavior
    LOG: 'log', // TBD
    WARNING: 'warning', // TBD
    ERROR: 'error', // request exception and un-intended behavior of app
    FATAL: 'fatal', // app crash, this should be handled by Sentry mostly
    CRITICAL: 'critical', // TBD
}

export {
    SENTRY_TAGS,
    SENTRY_TAG_VALUE,
    SENTRY_MESSAGE_LEVEL,
    SENTRY_MESSAGE_TYPE,
    SENTRY_CONTEXT,
}
