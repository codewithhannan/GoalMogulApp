import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';

export const initSentry = () => {
    Sentry.init({
        dsn: 'https://e8ba02e422f349b4a2c76c8882392ae4@sentry.io/1860637',
        enableInExpoDevelopment: true,
        debug: true
    });
      
    Sentry.setRelease(Constants.manifest.revisionId);
};

/**
 * 
 * @param {string} message exception message
 * @param {string} type exception type. One of fatal, error, warning, info and debug
 */
export const captureException = (message, type = 'error') => {
    Sentry.captureMessage(message, type);
};

/**
 * Set user identity for crash report
 * @param {*} userId 
 * @param {*} username 
 */
export const setUser = (userId, username) => {
    Sentry.setUser({ userId });
};
