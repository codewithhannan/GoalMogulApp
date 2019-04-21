import { config } from '../api/config';

export class Logger {
    static log(message, object, logLevel) {
        if (logLevel <= config.logLevel) {
            console.log(message, object);
        }
    }

};
