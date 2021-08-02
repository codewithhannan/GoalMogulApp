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
     * @param String // mongoose object ID as string
     * @returns date encoded in mongoose object ID
     */
    getObjectIdTime(id) {
        let timeStamp = parseInt(id.substr(0, 8), 16) * 1000
        return new Date(timeStamp)
    },
    /**
     * Ex Input: 'Hey there, {{getUserName}}!' --> Ex Output: 'Hey there, Revanth Sakthi!'
     * @param  text - predefined string with variables outlined by {{variableName}}
     * @param  user - user object contains all the info about the user
     * @returns {string} - string with all variables evaluated
     */
    parseExpressionAndEval(text, user) {
        if (!text) return ''
        let left = []
        let right = text
        while (right.indexOf('{{') != -1) {
            let oI = right.indexOf('{{')
            let cI = right.indexOf('}}', oI)
            const variable = right.substring(oI + 2, cI)
            left.push(right.substring(0, oI))
            // console.log('\nFunction name from variable methods:', variable)
            if (variable in variableMethods) {
                let res = variableMethods[variable](user)
                left.push(res)
            } else {
                left.push(variable)
            }
            right = right.substring(cI + 2)
        }
        return left.join('') + right
    },
}

const variableMethods = {
    /**
     * @param String - string which contains full name of user
     * @returns first name of the user
     */
    firstNameCaps(user) {
        if (user.user.name) {
            // console.log('This is the user:', user)
            let path = user.user.name.split(/(\s+)/).filter(function (e) {
                return e.trim().length > 0
            })
            return path[0].toUpperCase()
        } else return
    },
    /**
     * @param String - string which contains full name of user
     * @returns first name of the user
     */
    firstname(user) {
        if (user.user.name) {
            // console.log('This is the user:', user)
            let path = user.user.name.split(/(\s+)/).filter(function (e) {
                return e.trim().length > 0
            })
            return path[0]
        } else return
    },
    /**
     * @param String - string which contains full name of user
     * @returns first name of the user
     */
    getFirstName(name) {
        let path = name.split(/(\s+)/).filter(function (e) {
            return e.trim().length > 0
        })
        return path[0]
    },
}

module.exports = {
    getTimeDifference: helperMethods.getTimeDifference,
    getRandomValue: helperMethods.getRandomValue,
    getObjectIdTime: helperMethods.getObjectIdTime,
    parseExpressionAndEval: helperMethods.parseExpressionAndEval,
    firstNameCaps: variableMethods.firstNameCaps,
    getFirstName: variableMethods.getFirstName,
}
