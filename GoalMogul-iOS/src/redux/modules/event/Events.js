/**
 * This reducer is the source of truth for Events related Components based on the design
 * https://docs.google.com/document/d/1JxjCLZGsp5x_Sy0R56y05aUgAUALtuSVAgJIway9JTg/edit?usp=sharing
 */

import _ from 'lodash';

import {
    EVENT_DETAIL_OPEN,
    EVENT_DETAIL_CLOSE
} from './EventReducers';

import {

} from './EventTabReducers';

/**
 * Related Consts
 * 
 * Explore related
 * EVENT_DETAIL_OPEN
 * EVENT_DETAIL_CLOSE
 * EVENTTAB_REFRESH_DONE,
 * EVENTTAB_LOAD_DONE,
 * EVENTTAB_LOAD,
 * EVENT_SWITCH_TAB,
 * EVENT_FEED_FETCH,
 * EVENT_FEED_FETCH_DONE,
 * EVENT_FEED_REFRESH_DONE,
 * EVENT_EDIT_SUCCESS,
 * 
 * Own event related
 * 
 */

const INITIAL_STATE = {

};

const DEBUG_KEY = '[ Reducers Events ]';

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        default: 
            return { ...state };
    }
};
