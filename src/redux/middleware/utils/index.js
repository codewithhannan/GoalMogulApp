/** @format */

// This is a utils functions
import _ from 'lodash'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import * as Localization from 'expo-localization'

// Assets
import ShareIcon from '../../../asset/utils/forward.png'
import EditIcon from '../../../asset/utils/edit.png'
import UndoIcon from '../../../asset/utils/undo.png'
import TrashIcon from '../../../asset/utils/trash.png'
import Icons from '../../../asset/base64/Icons'
import { IMAGE_BASE_URL, USER_INVITE_URL } from '../../../Utils/Constants'
import DEFAULT_PROFILE_IMAGE from '../../../asset/utils/defaultUserProfile.png'
import { Alert } from 'react-native'
import { Logger } from './Logger'
import { Actions } from 'react-native-router-flux'

const { CheckIcon } = Icons
/**
 * Url query builder to query URL based on params
 */
export const queryBuilder = (skip, limit, filter) =>
    queryBuilderBasicBuilder({ skip, limit, ...filter })

export const queryBuilderBasicBuilder = (params) =>
    Object.keys(params)
        .filter((key) => params[key] !== undefined && params[key] !== '')
        .map((key) => {
            if (params[key] !== null && typeof params[key] === 'object') {
                return `${key}=${JSON.stringify(params[key])}`
            }
            return `${key}=${params[key]}`
        })
        .join('&')

export const arrayUnique = (array) => {
    let a = array.concat()
    for (let i = 0; i < a.length; ++i) {
        for (let j = i + 1; j < a.length; ++j) {
            if (a[i]._id === a[j]._id) {
                a.splice(j--, 1)
            }
        }
    }

    return a
}

/* Functions to create switch cases */
export const switchCase = (cases) => (defaultCase) => (key) =>
    cases.hasOwnProperty(key) ? cases[key] : defaultCase

const executeIfFunction = (f) => (f instanceof Function ? f() : f)

export const switchCaseF = (cases) => (defaultCase) => (key) =>
    executeIfFunction(switchCase(cases)(defaultCase)(key))

const executeIfFunctionWithVal = (f, val) =>
    f instanceof Function ? f(val) : f

export const switchCaseFWithVal = (values) => (cases) => (defaultCase) => (
    key
) => executeIfFunctionWithVal(switchCase(cases)(defaultCase)(key), values)

// const switchCaseF = cases => ({
//   withDefaultCase(defaultCase) {
//     return {
//       execute(key) {
//         return executeIfFunction(switchCase(cases)(defaultCase)(key));
//       }
//     }
//   }
// })

/* Functions to set state and skip if undefined */
export const setState = (newState, path, data) => {
    // If data exists or original field is set, then we set explicitly.
    if (data || _.get(newState, `${path}`))
        return _.set(newState, `${path}`, data)
    return newState
}

/**
 * Helper functions
 */
export const capitalizeWord = (word) => {
    if (!word) return ''
    return word.replace(/^\w/, (c) => c.toUpperCase())
}

/**
 * Reassign startIndex for tags.
 * If newTag is empty, then we don't do comparison to skip.
 */
const DEBUG_KEY = '[ Utils index ]'
export const clearTags = (newContent, newTag, tags = []) => {
    // console.log(`${DEBUG_KEY}: [ clearTags ]: newContent:`, newContent);
    // console.log(`${DEBUG_KEY}: [ clearTags ]: newTag:`, newTag);
    // console.log(`${DEBUG_KEY}: [ clearTags ]: tags:`, tags);
    let tagTextToStartIndexMap = {}
    const newTags = tags
        .sort((a, b) => a.startIndex - b.startIndex)
        .map((t) => {
            const { startIndex, tagText, tagReg, user } = t
            let position = 1 // Get the first occurane of the index
            if (tagText in tagTextToStartIndexMap) {
                position = tagTextToStartIndexMap[`${tagText}`] + 1
            }
            // Update map
            tagTextToStartIndexMap[`${tagText}`] = position

            // Get the new startIndex
            let newStartIndex = getPosition(newContent, tagText, position)
            // console.log(`${DEBUG_KEY}: [ clearTags ]: startIndex is:`, newStartIndex);

            // It means that we match to the new tag for an old one.
            // Then we need to increase the position by 1
            if (
                newTag &&
                !_.isEmpty(newTag) &&
                newStartIndex === newTag.startIndex
            ) {
                position += 1
                tagTextToStartIndexMap[`${tagText}`] = position
                newStartIndex = getPosition(newContent, tagText, position)
            }

            if (newStartIndex >= newContent.length) {
                // This might happen if we reselect the same tag at the same position after we backspace
                // to trigger suggestion search again
                // Otherwise This should never happen unless there is some problem
                console.warn(
                    `Failed to match for tag ${tagText} in content: ${newContent} at ` +
                        `position: ${position}`
                )
                return t
            }

            return {
                startIndex: newStartIndex,
                endIndex: newStartIndex + tagText.length,
                user,
                tagReg,
                tagText,
            }
        })
    return newTags
}

/**
 * Given content and its tags, we sanitize the tags to make sure all tags have its
 * corresponding text in content.
 *
 * This is created to handle the corner case where use back space from the middle of
 * a tag like {@Jia Zeng} starting from Jia and system will fail to remove the tag
 * for Jia Zeng at that position.
 *
 * Since trigger text @ no longer exists for that tag, we should sanitize to remove that
 * tag from the list
 * @param {*} content
 * @param {*} tags
 */
export const sanitizeTags = (content, tags) => {
    // We need to reassign position since this is triggered after deletion
    const tagsToSanitize = clearTags(content, {}, tags)

    const tagToReturn = tagsToSanitize
        .map((t) => {
            const { startIndex, tagText, endIndex } = t
            const textInContent = content.slice(startIndex, endIndex)
            if (textInContent !== tagText) {
                // This is good since we filter the unwanted / dangling tags
                console.warn(
                    `${DEBUG_KEY}: [ sanitizeTags ]: can't find tag in content: ${content}. Tag:`,
                    t
                )
                return {}
            }
            return t
        })
        .filter((t) => !_.isEmpty(t))

    return tagToReturn
}

/**
 * Get the position of nth ocurrance of a substring
 * if no nth occurances found, then it will return the length of the parent string
 */
function getPosition(string, subString, index) {
    return string.split(subString, index).join(subString).length
}

export const nFormatter = (num, digits) => {
    const si = [
        { value: 1, symbol: '' },
        { value: 1e3, symbol: 'k' },
        { value: 1e6, symbol: 'M' },
        { value: 1e9, symbol: 'G' },
        { value: 1e12, symbol: 'T' },
        { value: 1e15, symbol: 'P' },
        { value: 1e18, symbol: 'E' },
    ]
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
    let i
    for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
            break
        }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol
}

export const generateInvitationLink = (inviteCode) => {
    return `${USER_INVITE_URL}${inviteCode}`
}

export const PAGE_TYPE_MAP = {
    user_profile_detail: 'USER_DETAIL',
    user: 'USER',
    goal: 'GOAL',
    post: 'POST',
    event: 'EVENT',
    tribe: 'TRIBE',
    goalFeed: 'GOAL_FEED',
    activity: 'ACTIVITY',
    chat: 'CHAT',
}

// const DEBUG_KEY = '[ Utils ]';
export const hasTypePrefix = (type, key) => {
    // console.log(`${DEBUG_KEY}: [ hasTypePrefix ] isString: ${isString(key)}`);
    if (key === undefined || !isString(key)) {
        return false
    }

    if (!Object.keys(PAGE_TYPE_MAP).some((t) => t === type)) {
        return false
    }
    const typePrefix = _.get(PAGE_TYPE_MAP, type)
    // console.log(`${DEBUG_KEY}: [ hasTypePrefix ] typePrefix: ${typePrefix}`);

    const keys = key.split('_')
    // console.log(`${DEBUG_KEY}: [ hasTypePrefix ] keys: `, keys);
    return keys[0] === typePrefix
}

export function isString(value) {
    return typeof value === 'string' || value instanceof String
}

/**
 * Contruct pageId based on page type
 * @param {*} type
 * @param {*} DEBUG_KEY
 */
export const constructPageId = (
    type,
    DEBUG_KEY = '[ Utils constructPageId ]'
) => {
    const prefix = _.get(PAGE_TYPE_MAP, `${type}`)
    if (prefix === undefined || _.isEmpty(prefix)) {
        console.warn(
            `${DEBUG_KEY}: fail to construct page Id for type: ${type}`
        )
    }

    const currentTime = new Date()
    return `${prefix}_${currentTime.getTime()}`
}

/**
 * Construct component key by tab and base key
 * @param {*} tab
 * @param {*} key
 */
export const componentKeyByTab = (tab, key) => {
    let ret = key
    if (tab !== 'homeTab' && tab !== undefined) {
        ret = `${tab}_${key}`
    }
    return ret
}

export const isSharedPost = (postType) => {
    return postType !== 'General' && postType !== 'GoalStorylineUpdate'
}

/**
 *
 */
export const makeCaretOptions = (type, goalRef, postRef) => {
    if (type === 'Post') {
        if (!postRef) {
            // Invalid postRef
            console.warn(
                `[ Utils ]: [ makeCaretOptions ]: invalid postRef`,
                postRef
            )
            return []
        }

        // This is a post
        if (!isSharedPost(postRef.postType)) {
            return [{ option: 'Edit Update' }, { option: 'Delete' }]
        }

        // This is a share
        return [{ option: 'Delete' }]
    }

    if (type === 'Goal') {
        if (!goalRef) {
            // Invalid goalRef
            console.warn(
                `[ Utils ]: [ makeCaretOptions ]: invalid goalRef`,
                goalRef
            )
            return []
        }
        const { isCompleted } = goalRef
        return [
            {
                option: isCompleted ? 'Unmark as Complete' : 'Mark as Complete',
                iconSource: isCompleted ? UndoIcon : CheckIcon,
            },
            { option: 'Edit Goal', iconSource: EditIcon },
            { option: 'Delete', iconSource: TrashIcon },
        ]
    }

    console.warn(`[ Utils ]: [ makeCaretOptions ]: invalid type`, type)
    return []
}

export const constructMenuName = (component, pageId) => `${component}-${pageId}`

/**
 * Given a commentId and all comments, find its parentCommentId. It can return self,
 * if it has no parent comment.
 * @param {*} commentId
 * @param {*} comments
 */
export const getParentCommentId = (commentId, comments, props) => {
    let ret = commentId // Set to self
    if (!comments) return ret

    for (const c of comments) {
        if (!c || _.isEmpty(c)) continue

        const { _id, replyToRef } = c
        if (_id === commentId && replyToRef) {
            const { pageId, navigationTab, entityId } = props
            Actions.push(componentKeyByTab(navigationTab, 'replyThread'), {
                itemId: replyToRef,
                pageId,
                entityId,
                initScrollToComment: commentId,
            })
            ret = replyToRef // Set to parent comment
            break
        }
    }

    return ret
}

/**
 * Contact sync related helpers
 */
export const getPhoneNumber = (contact) => {
    if (!contact) return null
    const { phoneNumbers } = contact
    if (!phoneNumbers || _.isEmpty(phoneNumbers)) return null

    const mobileNumbers = phoneNumbers.filter((c) => c.label === 'mobile')
    if (_.isEmpty(mobileNumbers)) return null
    const mobileNumber = mobileNumbers[0]
    if (mobileNumber && mobileNumber.number) return mobileNumber.number
    return null
}

export const getPhoneNumbers = (contact) => {
    if (!contact) return null
    const { phoneNumbers } = contact
    if (!phoneNumbers || _.isEmpty(phoneNumbers)) return null

    return phoneNumbers.map((n) => (n ? n.number : null)).filter((n) => !!n)
}

export const getEmail = (contact) => {
    if (!contact) return null
    const { emails } = contact
    if (!emails || _.isEmpty(emails)) return null
    let emailToReturn
    emails.forEach((e) => {
        if (e.email && !emailToReturn) {
            emailToReturn = e.email
        }
    })
    return emailToReturn
}

export const getEmails = (contact) => {
    if (!contact) return null
    const { emails } = contact
    if (!emails || _.isEmpty(emails)) return null
    let ret
    ret = emails
        .map((e) => {
            if (e.email) {
                return e.email
            }
            return null
        })
        .filter((e) => e !== null)
    return ret
}

const Entities = require('html-entities').XmlEntities
const entities = new Entities()
export const decode = (text) => entities.decode(text)
// const { decodeEntity } = require('html-entities')
// const entities = new Entities()
// export const decode = (text) => decodeEntity(text)

export const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

/**
 * Return an image source that can be applied directly to Image component, e.g.
 * let a = getImageOrDefault()
 * return <Image source={a} />
 *
 * @param {*} imageSource
 * @param {*} defaultImageSource
 */
export const getImageOrDefault = (imageSource, defaultImageSource) => {
    // console.log('IMAGE SOURCE HA YE', imageSource)
    if (!imageSource && !defaultImageSource) {
        return
    }

    // Use passed in default image source
    // If it's a URL, it should has format { uri: imageUrl }
    // If it's an asset, it should be just the imported image
    if (!imageSource) {
        return defaultImageSource
    }

    if (typeof imageSource == 'string') {
        if (
            imageSource.indexOf('https://') != 0 &&
            imageSource.indexOf('file:///') != 0
        ) {
            // This is an image stored in S3 with format ProfileImage/token
            return { uri: `${IMAGE_BASE_URL}${imageSource}` }
        } else {
            // This is a full URL
            console.log('RETURN YE HA', { uri: imageSource })
            return { uri: imageSource }
        }
    }

    // This is a local image / icon passed in as imageUrl
    // It's typically has Integer type
    return imageSource
}

/**
 * Return full profile image url by using the imageSource supplied from
 * user object, user.profile.image. It's typically a token in S3.
 * @param {*} imageSource
 */
export const getProfileImageOrDefaultFromUser = (user, defaultSource) =>
    getImageOrDefault(_.get(user, 'profile.image', defaultSource))

export const getProfileImageOrDefault = (imageSource) =>
    getImageOrDefault(imageSource, DEFAULT_PROFILE_IMAGE)

/**
 * Validate if a string is a valid phone number
 * @see https://gitlab.com/catamphetamine/libphonenumber-js#isvalid-boolean
 * @param {String} pn Phone number to verify
 */
export const isValidPhoneNumber = (pn) => {
    try {
        const parsedPhoneNumber = parsePhoneNumberFromString(
            pn,
            Localization.region
        )
        if (parsedPhoneNumber && parsedPhoneNumber.isValid()) {
            return true
        }
    } catch (err) {
        // Ignore error
        console.log(
            `${DEBUG_KEY}: failed to validate phone number: ${pn}, `,
            err
        )
    }
    if (pn && !pn.startsWith('+')) {
        return isValidPhoneNumber(`+${pn}`)
    }
    return false
}

/**
 * Use libphonenumber.js to check if a string can be a phone number
 * @see https://gitlab.com/catamphetamine/libphonenumber-js#ispossible-boolean
 * @param {String} pn Phone number to check if it's possible a phone number
 */
export const isPossiblePhoneNumber = (pn) => {
    try {
        const parsedPhoneNumber = parsePhoneNumberFromString(
            pn,
            Localization.region
        )
        if (parsedPhoneNumber && parsedPhoneNumber.isPossible()) {
            return true
        }
    } catch (err) {
        // Ignore error
        console.log(
            `${DEBUG_KEY}: failed to check possible phone number: ${pn}, `,
            err
        )
    }

    if (pn && !pn.startsWith('+')) {
        return isPossiblePhoneNumber(`+${pn}`)
    }

    return false
}

export const EMAIL_VALIDATION_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
export const isValidEmail = (email) =>
    EMAIL_VALIDATION_REGEX.test(String(email).toLowerCase())

/**
 * Parse a phone number string to E164 phone number string "+19190192883"
 * @see https://gitlab.com/catamphetamine/libphonenumber-js#parsephonenumberfromstringstring-options-or-defaultcountry-phonenumber
 * @param {String} pn Phone number string to parse
 */
export const getE164PhoneNumber = (pn) => {
    try {
        const parsedPhoneNumber = parsePhoneNumberFromString(
            pn,
            Localization.region
        )
        if (parsedPhoneNumber && parsedPhoneNumber.isValid()) {
            return parsedPhoneNumber.number
        }
    } catch (err) {
        // Ignore error
        console.log(`${DEBUG_KEY}: failed to get phone number: ${pn}, `, err)
    }

    if (pn && !pn.startsWith('+')) {
        return getE164PhoneNumber(`+${pn}`)
    }
    return undefined
}

export const is2xxRespose = (status) => status >= 200 && status < 300
export const is4xxResponse = (status) => status >= 400 && status < 500
export const is5xxResponse = (status) => status >= 500 && status < 600

/**
 * Get current user's friend's userId from friendship object
 * @param {*} maybeFriendshipRef friendship object
 * @param {*} userId current userId
 */
export const getFriendUserId = (maybeFriendshipRef, userId) => {
    const { participants } = maybeFriendshipRef
    let ret
    participants.forEach((p) => {
        if (p.users_id !== userId) ret = p.users_id
    })
    return ret
}

export const SHAREING_PRIVACY_ALERT_TYPE = {
    goal: 'goal',
    update: 'update',
    goal_and_update: 'goal_and_update',
}
export const sharingPrivacyAlert = (type) => {
    const getMessage = (alertType) => {
        switch (alertType) {
            case SHAREING_PRIVACY_ALERT_TYPE.update:
                return {
                    first: 'this Update',
                    second: "'Edit Update'",
                }
            case SHAREING_PRIVACY_ALERT_TYPE.goal:
                return {
                    first: 'this Goal',
                    second: "'Edit Goal'",
                }
            case SHAREING_PRIVACY_ALERT_TYPE.goal_and_update:
                return {
                    first: 'both Update and attached goal',
                    second: "'Edit Update'",
                }
            default:
                Logger.log(
                    '[Utils] [sharingPrivacyAlert] invalid type: ',
                    type,
                    3
                )
                return undefined
        }
    }
    const message = getMessage(type)
    if (!message) return
    const { first, second } = message

    return Alert.alert(
        'Public Permissions',
        'You need to make ' +
            first +
            " publicly visible to share it into the Tribe so others can see it.\nTap the '...' and select " +
            second +
            ' to change its privacy settings'
    )
}

export const countWords = (lines) => {
    let wordCount = 0
    if (Array.isArray(lines)) {
        lines.forEach((val) => {
            wordCount += countWords(_.get(val, 'text', 0) || val)
        })
    } else if (typeof lines === 'string') {
        if (lines.includes('\n')) wordCount = countWords(lines.split('\n'))
        else wordCount = lines.split(' ').filter((val) => val !== '').length // filter out empty strings from count
    }
    return wordCount
}
