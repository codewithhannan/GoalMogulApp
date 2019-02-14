/*
 * Chat Tab is a main page with two sub tabs including ChatRoomTab, MessageTab
 */

import _ from 'lodash';
import { arrayUnique } from '../../middleware/utils';

const INITIAL_STATE = {
	navigationState: {
		index: 0,
		routes: [
			{ key: 'directMessages', title: 'DIRECT MESSAGES' },
			{ key: 'chatrooms', title: 'CHATROOMS' },
		]
	},
	selectedTab: 'directMessages',
	showPlus: true,
	directMessages: {
		data: [],
		searchQuery: undefined,
		hasNextPage: undefined,
		limit: 5,
		skip: 0,
		loading: false,
		refreshing: false,
	},
	chatrooms: {
		data: [],
		searchQuery: undefined,
		hasNextPage: undefined,
		limit: 5,
		skip: 0,
		loading: false,
		refreshing: false,
	}
};

export const CHAT_SWITCH_TAB = 'chat_switch_tab';
export const CHAT_ON_FOCUS = 'chat_on_focus';
export const CHAT_LOAD = 'chat_load';
export const CHAT_REFRESH = 'chat_refresh';
export const CHAT_REFRESH_DONE = 'chat_refresh_done';
export const CHAT_LOAD_DONE = 'chat_load_done';
export const PLUS_PRESSED = 'chat_plus_pressed'
export const PLUS_UNPRESSED = 'chat_plus_unpressed';

export const CHAT_LOAD_TYPES = {
	directMessages: 'direct_messages',
	chatrooms: 'chatrooms',
};

export default (state=INITIAL_STATE, action) => {
	switch (action.type) {
		case CHAT_SWITCH_TAB: {
			const { index } = action.payload;
			let newState = _.cloneDeep(state);
			newState = _.set(newState, 'navigationState.index', index);

			const selectedTab = state.navigationState.routes[index].key;
			return _.set(newState, 'navigationState.selectedTab', selectedTab);
		}

		case CHAT_LOAD: {
			const { type } = action.payload;
			if (! (type in CHAT_LOAD_TYPES)) throw new Error();
			const newState = _.cloneDeep(state);
			return _.set(newState, `${type}.loading`, true);
		}

		case CHAT_REFRESH: {
			const { type } = action.payload;
			if (! (type in CHAT_LOAD_TYPES)) throw new Error();
			const newState = _.cloneDeep(state);
			return _.set(newState, `${type}.refreshing`, true);
		}

		/**
		 * @param type: CHAT_LOAD_TYPES#{directMessages, chatrooms}
		 */
		case CHAT_REFRESH_DONE: {
			const { data, type } = action.payload;
			if (! (type in CHAT_LOAD_TYPES)) throw new Error();
			let newState = _.cloneDeep(state);
			newState = _.set(newState, `${type}.refreshing`, false);

			return _.set(newState, `${type}.data`, data);
		}

		case CHAT_LOAD_DONE: {
			const { skip, data, hasNextPage, type } = action.payload;
			if (! (type in CHAT_LOAD_TYPES)) throw new Error();
			let newState = _.cloneDeep(state);
			newState = _.set(newState, `${type}.loading`, false);

			if (skip !== undefined) {
				newState = _.set(newState, `${type}.skip`, skip);
			}
			newState = _.set(newState, `${type}.hasNextPage`, hasNextPage);
			const oldData = _.get(newState, `${type}.data`);
			return _.set(newState, `${type}.data`, arrayUnique(oldData.concat(data)));
		}

		case PLUS_PRESSED: {
			let newState = _.cloneDeep(state);
			return _.set(newState, 'showPlus', false);
		}

		case PLUS_UNPRESSED: {
			let newState = _.cloneDeep(state);
			return _.set(newState, 'showPlus', true);
		}

		default: {
			return { ...state };
		}
	}
};
