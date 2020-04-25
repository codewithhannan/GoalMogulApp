/**
 * This file is created during implementation of GM V2. This is the central hub
 * for registration actions.
 * 
 * TODO: migration all actions from /src/actions/RegistrationActions.js here
 */

import { REGISTRATION_TEXT_CHANGE, REGISTRATION_USER_TARGETS } from "./RegistrationReducers";


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

/**
 * User updates the selection on the targets for using GoalMogul
 * 
 * @param {String} title one of titles in REGISTRATION_USER_TARGETS
 * @param {Boolean} value indicate if a target is selected or not
 */
export const registrationTargetSelection = (title, value, extra) => (dispatch, getState) => {
    dispatch({
        type: REGISTRATION_USER_TARGETS,
        payload: {
            title, value, extra
        }
    })
};
