/**
 * Sentry related constants
 */

const SENTRY_TAGS = {
    GOOGLE_SERVIVE: 'google service',
    ACTION: {
        LOGIN_IN: 'login',
        LOGOUT: 'logout',
        FETCH_USER_PROFILE: 'fetech user profile',
        USERNAME: 'username',
        TOKEN: 'token verification',
        UNSUBSCRIBE_NOTIFICATIONS: 'unsubscribe notifications (expo push token deletion)',
        GOAL_UPDATE: 'goal update'
    }
};

const SENTRY_TAG_VALUE = {
    ACTIONS: {
        FAILED: 'failed'
    }
};

const SENTRY_MESSAGE_TYPE = {
    ERROR: 'error',
    MESSAGE: 'message',
    EVENT: 'event'
};

// Based on the document, exception / message level can be one of:
// 'fatal', 'error', 'warning', 'log', 'info, 'debug', 'critical'
const SENTRY_MESSAGE_LEVEL = {
    DEBUG: 'debug', // debugging purpose
    INFO: 'info', // extra information for app behavior
    LOG: 'log', // TBD
    WARNING: 'warning', // TBD
    ERROR: 'error', // request exception and un-intended behavior of app
    FATAL: 'fatal', // app crash, this should be handled by Sentry mostly
    CRITICAL: 'critical' // TBD
}

export { SENTRY_TAGS, SENTRY_TAG_VALUE, SENTRY_MESSAGE_LEVEL, SENTRY_MESSAGE_TYPE };
