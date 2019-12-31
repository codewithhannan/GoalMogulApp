import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';
import { SENTRY_CONFIG } from '../../config';
import { SENTRY_MESSAGE_LEVEL, SENTRY_MESSAGE_TYPE } from './Constants';

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
    Sentry.setUser({ id: userId, username });
};

class SentryRequestBuilder {
    constructor(message, type = SENTRY_MESSAGE_TYPE.message) {
        this.tags = {};
        this.extraContext = {};
        this.level = SENTRY_MESSAGE_LEVEL.INFO; // default level is info
        this.message = message;
        this.type = type;
    }

    withLevel(level) {
        this.level = level;
        return this;
    }

    withTag(key, value) {
        this.tags[key] = value;
        return this;
    }

    withExtraContext(key, value) {
        this.extraContext[key] = value;
        return this;
    }

    withType(type) {
        this.type = type;
        return this;
    }

    send() {
        const level = this.level;
        const tags = this.tags;
        const extraContext = this.extraContext;
        const message = this.message;
        const type = this.type;

        Sentry.withScope(function(scope) {
            scope.setLevel(level);
            if (tags && Object.keys(tags).length > 0) {
                scope.setTags(tags);
            }
            
            if (extraContext && Object.keys(extraContext).length > 0) {
                scope.setExtras(extraContext);
            }
            
            if (type == 'message') {
                Sentry.captureMessage(message);
            } else if (type == 'event') {
                Sentry.captureEvent(message);
            } else {
                Sentry.captureException(message);
            }
        })
    }
};

export { SentryRequestBuilder, setUser, captureException, initSentry };
