/**
 * This reducer is the source of truth for Posts related Components based on the design
 * https://docs.google.com/document/d/1JxjCLZGsp5x_Sy0R56y05aUgAUALtuSVAgJIway9JTg/edit?usp=sharing
 */

import _ from 'lodash';

import {
    PROFILE_FETCH_TAB_DONE,
    PROFILE_REFRESH_TAB_DONE,
    PROFILE_POST_DELETE_SUCCESS
} from '../../User/Users';

import {
    PROFILE_CLOSE_PROFILE
} from '../../../../reducers/User';

/**
 * Related consts to add
 * 
 * Post related
 * 
 * 
 * Profile related
 * PROFILE_FETCH_TAB_DONE
 * PROFILE_REFRESH_TAB_DONE
 * PROFILE_CLOSE_PROFILE
 * PROFILE_POST_DELETE_SUCCESS
 * 
 * Comment related
 * The ones that need to increase / decrease comment count
 * 
 * Home related (Activity Feed)
 * 
 * Tribe related
 * 
 * Event related
 * 
 */

const INITIAL_STATE = {

};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        default: 
            return { ...state };
    }
};
