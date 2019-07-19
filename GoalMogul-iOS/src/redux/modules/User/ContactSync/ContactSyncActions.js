/**
 * NOTE: Majority of contact sync actions are in RegistrationActions.js and MeetActions.js
 * This is created with better code structure and usability
 */
import {
    Linking
} from 'react-native';
// import { Linking } from 'expo';
import * as SMS from 'expo-sms';
import _ from 'lodash';
import { generateInvitationLink } from '../../../middleware/utils';
import { DropDownHolder } from '../../../../Main/Common/Modal/DropDownModal';

const DEBUG_KEY = '[ Actions ContactSyncActions ]';
/**
 * Based on contact object to determine invite method.
 * Order is: phone number and then email
 * @param {object} contact 
 */
export const inviteUser = (contact) => async (dispatch, getState) => {
    const { user } = getState().user;

    const phoneNumber = getPhoneNumber(contact);
    if (phoneNumber) {
        await inviteUserWithText(phoneNumber, user);
        return;
    }

    const email = getEmail(contact);
    if (email) {
        inviteUserWithEmail(email, user);
    }
};

export const getPhoneNumber = (contact) => {
    if (!contact) return null;
    const { phoneNumbers } = contact;
    if (!phoneNumbers || _.isEmpty(phoneNumbers)) return null;

    const mobileNumbers = phoneNumbers.filter(c => c.label === 'mobile');
    if (_.isEmpty(mobileNumbers)) return null;
    const mobileNumber = mobileNumbers[0];
    if (mobileNumber && mobileNumber.number) return mobileNumber.number;
    return null;
};

export const getEmail = (contact) => {
    if (!contact) return null;
    const { emails } = contact;
    if (!emails || _.isEmpty(emails)) return null;
    let emailToReturn;
    emails.forEach(e => {
        if (e.email && !emailToReturn) {
            emailToReturn = e.email
        }
    });
    return emailToReturn;
};

const inviteUserWithText = async (phoneNumber, user) => {
    const { inviteCode } = user;
    const inviteLink = generateInvitationLink(inviteCode);

    const message = `Hey, I’m using GoalMogul to get more stuff done and better myself. ` + 
    `Can you check out this link and suggest ways to help me achieve my goals faster? Thanks! \n\n${inviteLink}`;

    const isAvailable = await SMS.isAvailableAsync();
    console.log(`${DEBUG_KEY}: SMS is available?`, isAvailable);
    if (isAvailable) {
        // do your SMS stuff here
        const { result } = await SMS.sendSMSAsync(
            [`${phoneNumber}`],
            `${message}`
        );
        console.log(`${DEBUG_KEY}: result is: `, result);
    } else {
        // misfortune... there's no SMS available on this device
        DropDownHolder.alert('error', 'Error', 'We\'re sorry that your phone doesn\'t support SMS.');
    }
};

const inviteUserWithEmail = (email, user) => {
    const { inviteCode } = user;
    const inviteLink = generateInvitationLink(inviteCode);

    const subject = 'Welcome to Goalmogul';
    const message = `Hey, I’m using GoalMogul to get more stuff done and better myself. ` + 
    `Can you check out this link and suggest ways to help me achieve my goals faster? Thanks! \n\n${inviteLink}`;

    Linking.openURL(`mailto:${email}?subject=${subject}&body=${message}`);
};
