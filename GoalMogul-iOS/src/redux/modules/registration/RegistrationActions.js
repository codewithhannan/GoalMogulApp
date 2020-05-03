/**
 * This file is created during implementation of GM V2. This is the central hub
 * for registration actions.
 * 
 * TODO: migration all actions from /src/actions/RegistrationActions.js here
 */
import _ from "lodash";
import { REGISTRATION_TEXT_CHANGE, REGISTRATION_USER_TARGETS, REGISTRATION_TRIBE_SELECT, REGISTRATION_TRIBE_FETCH } from "./RegistrationReducers";
import { REGISTRATION_ACCOUNT_LOADING, REGISTRATION_ADDPROFILE, REGISTRATION_ACCOUNT_SUCCESS } from "../../../actions/types";
import { api as API } from "../../middleware/api";


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

/**
 * User selects a tribe and update the reducer
 * @param {String} _id tribeId
 * @param {Boolean} selected {@code true} if this tribe with _id is selected
 */
export const registrationTribeSelection = (_id, selected) => (dispatch) => {
    dispatch({
        type: REGISTRATION_TRIBE_SELECT,
        payload: { _id, selected }
    })
};

/**
 * Fetch tribes for user to select during onboarding flow
 */
export const registrationFetchTribes = () => (dispatch, getState) => {

    dispatch({
        type: REGISTRATION_TRIBE_FETCH,
        payload: { tribes: [], status: "done" }
    })
};

export const validatePhoneCode = async () => (dispatch) => {

};

/**
 * Compose country code and phone number
 * @param {*} countryCode 
 * @param {*} phone 
 */
const phoneNumber = (countryCode, phone) => {
    if (!phone) {
        // TODO: add sentry log info
        return undefined;
    }

    const callingCodeArr = _.get(countryCode, "country.callingCode");
    if (!callingCodeArr || callingCodeArr.length() == 0) {
        // TODO: add sentry log warning
        return phone;
    }

    return callingCodeArr[0] + phone;
}

/**
 * Action triggered when user clicks on next step in RegistrationAccount.
 * 1. Massage data for the request format
 * 2. Hit endpoint /pub/user to register
 * 
 * @param {Function} screenTransitionCallback required. When account registration succeeded.
 */
export const registerAccount = (onSuccess) => async (dispatch, getState) => {
    const { name, password, email, countryCode, phone } = getState().registration;

    // TODO: phone might not exist

    // const data = validateEmail(email) ?
    // {
    //   name, email, password, phoneNumber
    // } :
    // {
    //   name, phone: email, password
    // };
    const data = {
        name, password, email,
        phone: phoneNumber(countryCode, phone)
    }

    dispatch({
        type: REGISTRATION_ACCOUNT_LOADING
    });

    const message = await API
        .post('pub/user/', { ...data }) // use default log level
        .then((res) => {
            if (res.message) {
                return res.message;
            }
            dispatch({
                type: REGISTRATION_ADDPROFILE
            });
            // AuthReducers record user token
            const payload = {
                token: res.token,
                userId: res.userId,
                name
            };
            dispatch({
                type: REGISTRATION_ACCOUNT_SUCCESS,
                payload
            });

            // Invoke screen transition callback for registration success
            onSuccess();

            // set up chat listeners
            LiveChatService.mountUser({
                userId: res.userId,
                authToken: res.token,
            });
            MessageStorageService.mountUser({
                userId: res.userId,
                authToken: res.token,
            });
        // Actions.reset('auth');
        })
        .catch((err) => {
            // TODO: add sentry log error
            console.log(err);
        });

    if (message) {
        dispatch({
            type: REGISTRATION_ERROR,
            error: message
        });
    }
};