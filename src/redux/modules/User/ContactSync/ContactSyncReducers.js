/**
 * NOTE: This is reducers for contact sync functions. There might be
 *
 * @format
 */

import _ from 'lodash'
import {
    arrayUnique,
    hasTypePrefix,
    getEmails,
    getPhoneNumbers,
} from '../../../middleware/utils'
import { MEET_CONTACT_SYNC_FETCH_DONE } from '../../../../reducers/MeetReducers'

const INITIAL_STATE = {
    contacts: {
        data: [],
        hasUploaded: false,
    },
    remoteMatches: {
        data: [],
        limit: 20,
        skip: 0,
        hasNextPage: undefined,
    },
}

export const CONTACT_SYNC_LOAD_CONTACT_DONE = 'contact_sync_load_contact_done'
export const CONTACT_SYNC_INVITE_CONTACT = 'contact_sync_invite_contact'
export const CONTACT_SYNC_FINISH = 'contact_sync_finish'

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CONTACT_SYNC_LOAD_CONTACT_DONE: {
            let newState = _.cloneDeep(state)
            const { data } = action.payload
            // Only keep contacts that contactType is person
            const filteredData = data.filter(
                (c) => c && c.contactType === 'person'
            )
            newState = _.set(newState, 'contacts.data', filteredData)
            return newState
        }

        // User invite a contact. Mark it as invited
        case CONTACT_SYNC_INVITE_CONTACT: {
            let newState = _.cloneDeep(state)
            const { data } = action.payload
            const oldData = _.get(newState, 'contacts.data')

            // Mark user as invited
            const newData = oldData.map((c) => {
                if (_.isEqual(c, data)) {
                    return {
                        ...c,
                        isInvited: true,
                    }
                }
                return c
            })

            newState = _.set(newState, 'contacts.data', newData)
            return newState
        }

        /**
         * NOTE: we don't filtered here like MeetReducers since we want to get the set
         * of people that have no idea about GM
         */
        case MEET_CONTACT_SYNC_FETCH_DONE: {
            let newState = _.cloneDeep(state)
            const { data, refresh } = action.payload
            // Only take this into account if this is an refresh
            if (!refresh) return newState
            let contacts = _.get(newState, 'contacts.data')

            contacts.filter((c) => {
                let shouldNotSkip = true

                data.forEach((u) => {
                    if (!shouldNotSkip) return // Already find the match. Skip for performance
                    let tempShouldNotSkip = contactUserComparator(u, c)
                    if (!tempShouldNotSkip) {
                        shouldNotSkip = tempShouldNotSkip
                    }
                })

                return shouldNotSkip
            })

            newState = _.set(newState, 'contacts.data', contacts)
            return newState
        }

        default:
            return { ...state }
    }
}

const contactUserComparator = (user, contact) => {
    if (!user || !contact || _.isEmpty(user) || _.isEmpty(contact)) return true // Shouldn't skip

    const userName = user.name
    const userEmail =
        user.email && user.email.address ? user.email.address : undefined
    const userPhone =
        user.phone && user.phone.number ? user.phone.number : undefined

    const contactEmails = getEmails(contact)
    if (
        userEmail &&
        contactEmails &&
        !_.isEmpty(contactEmails) &&
        contactEmails.some((e) => e === userEmail)
    ) {
        return false // Some email matches with user email. Should skip
    }

    const contactPhoneNumbers = getPhoneNumbers(contact)
    if (
        userPhone &&
        contactPhoneNumbers &&
        !_.isEmpty(contactPhoneNumbers) &&
        contactPhoneNumbers.some((p) => p === userPhone)
    ) {
        return false // Some phone number in the contact matches with user email. Should skip
    }

    return true
}
