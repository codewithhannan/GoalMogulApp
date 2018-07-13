import {

} from '../../../../reducers/Home';

import { api as API } from '../../../middleware/api';

const DEBUG_KEY = '[ Action Home Mastermind ]';
const BASE_ROUTE = 'secure/goal/';

// Refresh goal for mastermind tab
export const refreshFeed = () => (dispatch, getState) => {

};

// Load more goal for mastermind tab
export const loadMoreFeed = () => (dispatch, getState) => {

};

/**
 * Basic API to load feeds based on skip and limit
 * @param isRefresh:
 * @param skip:
 * @param limit:
 * @param token:
 */
const loadFeed = (skip, limit, token, callback) => {

};
