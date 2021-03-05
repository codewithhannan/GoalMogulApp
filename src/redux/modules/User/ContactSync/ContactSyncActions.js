/**
 * NOTE: Majority of contact sync actions are in RegistrationActions.js and MeetActions.js
 * This is created with better code structure and usability
 *
 * @format
 */

import { Linking } from 'react-native'
// import { Linking } from 'expo';
import * as SMS from 'expo-sms'
import _ from 'lodash'
import {
    generateInvitationLink,
    getEmail,
    getPhoneNumber,
} from '../../../middleware/utils'
import { DropDownHolder } from '../../../../Main/Common/Modal/DropDownModal'
import { trackWithProperties } from '../../../../monitoring/segment'

const DEBUG_KEY = '[ Actions ContactSyncActions ]'
/**
 * Based on contact object to determine invite method.
 * Order is: phone number and then email
 * @param {object} contact
 */
export const inviteUser = (
    contact,
    maybeTrackingClickEventName,
    maybeTrackingResultEventName
) => async (dispatch, getState) => {
    const { user, userId } = getState().user

    const phoneNumber = getPhoneNumber(contact)
    if (phoneNumber) {
        if (maybeTrackingClickEventName) {
            trackWithProperties(maybeTrackingClickEventName, {
                UserId: userId,
                Channel: 'Message',
            })
        }

        const res = await inviteUserWithText(phoneNumber, user)
        if (res !== 'cancelled') {
            // Track action being finished
            if (maybeTrackingResultEventName) {
                trackWithProperties(maybeTrackingResultEventName, {
                    UserId: userId,
                    Channel: 'Message',
                })
            }
        }
        return
    }

    const email = getEmail(contact)
    if (email) {
        // Currently we can't track if email is fulfilled or not
        if (maybeTrackingClickEventName) {
            trackWithProperties(maybeTrackingClickEventName, {
                UserId: userId,
                Channel: 'Email',
            })
        }
        inviteUserWithEmail(email, user)
    }
}

const inviteUserWithText = async (phoneNumber, user) => {
    const { inviteCode } = user
    const inviteLink = generateInvitationLink(inviteCode)

    const message =
        `Hey, I’m using GoalMogul to get more stuff done and better myself. ` +
        `Can you check out this link and suggest ways to help me achieve my goals faster? Thanks! \n\n${inviteLink}`

    const isAvailable = await SMS.isAvailableAsync()
    console.log(`${DEBUG_KEY}: SMS is available?`, isAvailable)
    if (isAvailable) {
        // do your SMS stuff here
        const { result } = await SMS.sendSMSAsync(
            [`${phoneNumber}`],
            `${message}`
        )
        console.log(`${DEBUG_KEY}: result is: `, result)
        return result
    } else {
        // misfortune... there's no SMS available on this device
        DropDownHolder.alert(
            'error',
            'Error',
            "We're sorry that your phone doesn't support SMS."
        )
    }
    return undefined
}

const inviteUserWithEmail = (email, user) => {
    const { inviteCode } = user
    const inviteLink = generateInvitationLink(inviteCode)

    const subject = 'Welcome to Goalmogul'
    const message =
        `Hey, I’m using GoalMogul to get more stuff done and better myself. ` +
        `Can you check out this link and suggest ways to help me achieve my goals faster? Thanks! \n\n${inviteLink}`

    Linking.openURL(`mailto:${email}?subject=${subject}&body=${message}`)
}
