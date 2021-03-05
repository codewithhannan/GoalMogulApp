/** @format */

import getEnvVars from '../../../../environment'

const config = getEnvVars()
export class Logger {
    /**
     * Log message with log level
     *
     * @param {string} message message to log
     * @param {any} object object to log
     * @param {any} logLevel default log level
     */
    static log(message, object, logLevel = 3) {
        if (logLevel <= config.logLevel) {
            console.log(message, object)
        }
    }
}
