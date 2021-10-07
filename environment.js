/**
 * **************************
 * environment.js
 * path: '/environment.js' (root of your project)
 * ****************************
 *
 * @format
 */

import * as Updates from 'expo-updates'
import {
    API_URL,
    GOOGLE_RECAPTCHA_KEY,
    SEGMENT_CONFIG,
    SENTRY_CONFIG,
    SOCKET_IO_URL,
} from './config'

const ENV = {
    dev: {
        GOOGLE_RECAPTCHA_KEY,
        SENTRY_CONFIG,
        SEGMENT_CONFIG,
        segmentDebug: true,
        url: API_URL,
        socketIOUrl: SOCKET_IO_URL,
        /**
         * Print out all log with level that is smaller than the logLevel setting here
         * 1. Most important message that we shouldn' miss
         * 2. Typical debugging message
         * 3. API request should go here
         * 4.
         * 5. Timer firing message
         *
         * When log level is set to 5, it means to show all log messages we have
         * TODO: wrap console.log with such a logger
         */
        logLevel: 3,
    },
    staging: {
        GOOGLE_RECAPTCHA_KEY,
        SENTRY_CONFIG,
        SEGMENT_CONFIG,
        segmentDebug: false,
        url: API_URL,
        socketIOUrl: SOCKET_IO_URL,
        logLevel: 3,
    },
    prod: {
        GOOGLE_RECAPTCHA_KEY,
        SENTRY_CONFIG,
        SEGMENT_CONFIG,
        segmentDebug: false,
        url: API_URL,
        socketIOUrl: SOCKET_IO_URL,
        logLevel: 3,
    },
}

const getEnvVars = () => {
    // This variable is set to true when react-native is running in Dev mode.
    // __DEV__ is true when run locally, but false when published.
    // Currently, i am not sure if DEV is working properly
    if (Updates.releaseChannel.startsWith('prod')) {
        return ENV.prod
    } else if (Updates.releaseChannel.startsWith('staging')) {
        return ENV.staging
    } else {
        return ENV.dev
    }
    // if (__DEV__) {
    //     return ENV.dev
    // } else if (env === 'staging') {
    //     return ENV.staging
    // } else if (env === 'prod') {
    //     return ENV.prod
    // } else {
    //     return ENV.dev
    // }
}

export default getEnvVars
