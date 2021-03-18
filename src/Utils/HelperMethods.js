/** @format */

import moment from 'moment'

const helperMethods = {
    /**
     * @param Date // date from which difference is to calculated.
     * @param String// selects the return value type either days or weeks
     * @returns the difference in days or week
     */
    getTimeDifference(date, valueType) {
        let a = moment(date)
        let b = moment(Date.now())
        return b.diff(a, valueType)
    },
    /**
     * @param Array // array with multiple values
     * @returns any random value from the array
     */
    getRandomValue(array) {
        return array[Math.floor(Math.random() * array.length)]
    },
    /**
     * @param String // string which contains full name of user
     * @returns first name of the user
     */
    getFirstName(name) {
        let path = name.split(/(\s+)/).filter(function (e) {
            return e.trim().length > 0
        })
        return path[0]
    },
    /**
     * @param String // mongoose object ID as string
     * @returns date encoded in mongoose object ID
     */
    getObjectIdTime(id) {
        let timeStamp = parseInt(id.substr(0, 8), 16) * 1000
        return new Date(timeStamp)
    },
}

module.exports = {
    getTimeDifference: helperMethods.getTimeDifference,
    getRandomValue: helperMethods.getTimeDifference,
    getFirstName: helperMethods.getFirstName,
    getObjectIdTime: helperMethods.getObjectIdTime,
}
