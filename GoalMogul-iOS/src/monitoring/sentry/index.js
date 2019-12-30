import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';
import { SENTRY_CONFIG } from '../../config';
import { SENTRY_MESSAGE_LEVEL } from './Constants';

const initSentry = () => {
    Sentry.init({
        dsn: SENTRY_CONFIG.DNS,
        enableInExpoDevelopment: true,
        debug: true,
        ignoreErrors: ['SubmissionError']
    });
      
    Sentry.setRelease(Constants.manifest.revisionId);
};

/**
 * 
 * @param {string} message exception message
 * @param {string} level exception level. One of fatal, error, warning, info and debug
 */
const captureException = (message, level = 'error') => {
    Sentry.captureMessage(message, level);
};

/**
 * Set user identity for crash report
 * @param {*} userId 
 * @param {*} username 
 */
const setUser = (userId, username) => {
    Sentry.setUser({ userId });
};

class SentryRequestBuilder {
    constructor(message, type = 'message') {
        this.tags = new Map();
        this.extraContext = new Map();
        this.level = SENTRY_MESSAGE_LEVEL.INFO; // default level is info
        this.message = message;
        this.type = type;
    }

    withLevel(level) {
        this.level = level;
        return this;
    }

    withTag(key, value) {
        this.tags.set(key, value);
        return this;
    }

    withExtraContext(key, value) {
        this.extraContext.set(key, value);
        return this;
    }

    withType(type) {
        this.type = type;
        return this;
    }

    send() {
        Sentry.withScope(function(scope) {
            scope.setLevel(this.level);
            scope.setTags(this.tags);
            scope.setExtras(this.extraContext);
            if (this.type == 'message') {
                Sentry.captureMessage(this.message);
            } else if (this.type == 'event') {
                Sentry.captureEvent(this.message);
            } else {
                Sentry.captureException(this.message);
            }
        })
    }
};

export { SentryRequestBuilder, setUser, captureException, initSentry };
