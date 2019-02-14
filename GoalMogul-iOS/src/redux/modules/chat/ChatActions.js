/**
 * Actions for Chat tab
 */

import {
	CHAT_SWITCH_TAB,
	PLUS_PRESSED
} from './ChatReducers';

export const selectChatTab = (index) => (dispatch) => {
	dispatch({
		type: CHAT_SWITCH_TAB,
		payload: {
			index
		}
	});
};

export const plusPressed = () => (dispatch) => {
	dispatch({
		type: PLUS_PRESSED,
	});
}

export const plusUnpressed = () => (dispatch) => {
	dispatch({
		type: PLUS_UNPRESSED,
	});
}

/* Following are actions to load chat rooms */
export const refreshChatRooms = (tab, pageSize, maybeSearchQuery) => (dispatch, getState) => {
	/* handle search query if exists */
};

export const loadMoreChatRooms = (tab, pageSize, resultsOffset, maybeSearchQuery) => (dispatch, getState) => {
	/* handle search query if exists */
};

export const loadChatRooms = (tab, pageSize) => (dispatch, getState) => {

};