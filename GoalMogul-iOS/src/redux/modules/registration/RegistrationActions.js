/**
 * This file is created during implementation of GM V2. This is the central hub
 * for registration actions.
 * 
 * TODO: migration all actions from /src/actions/RegistrationActions.js here
 */

import { REGISTRATION_TEXT_CHANGE } from "./RegistrationReducers";


/**
 * Alter the state of registration text input
 * @param {String} type one of [name, email, phone, password]
 * @param {String} value 
 */
export const registrationTextInputChange = (type, value) => (dispatch, getState) => {
    dispatch({
        type: REGISTRATION_TEXT_CHANGE,
        payload: {
            value, type
        }
    });
};
