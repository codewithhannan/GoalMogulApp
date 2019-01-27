/**
 * Actions for Chat tab
 */

import {
	CHATTAB_SWITCH_TAB
} from './ChatTabReducers';

export const chatTabSelectTab = (index) => (dispatch) => {
	dispatch({
		type: CHATTAB_SWITCH_TAB,
		payload: {
			index
		}
	});
};

/* Following are actions to load chat tabs */
export const refreshChatTab = (tab) => (dispatch, getState) => {

};

export const loadMoreChatTab = (tab) => (dispatch, getState) => {

};

export const loadChatTab = () => (dispatch, getState) => {

};
