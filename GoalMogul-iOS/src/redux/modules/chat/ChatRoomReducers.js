/*
 * Chat Tab is a main page with two sub tabs including ChatRoomTab, MessageTab
 */

import _ from 'lodash';
import { arrayUnique } from '../../middleware/utils';

const INITIAL_STATE = {
	navigationState: {
		index: 0,
		routes: [
			{ key: 'chatRoomConversation', title: 'CONVERSATION' },
            { key: 'chatRoomOptions', title: 'OPTIONS' },
            { key: 'chatRoomMembers', title: 'MEMBERS' },
            { key: 'chatRoomSearch', title: 'SEARCH' },
		]
    },
    selectedTab: 'chatRoomConversation',
    chatRoom: null,
    messages: [],
    loading: false,
    searchResults: [],
    searching: false,
};

export const CHAT_ROOM_SWITCH_TAB = 'chat_room_switch_tab';
export const CHAT_ROOM_LOAD_INITIAL = 'chat_room_load_initial';
export const CHAT_ROOM_UPDATE_CHAT_ROOM = 'chat_room_update_chat_room';
export const CHAT_ROOM_LOAD_MORE_MESSAGES_BEGIN = 'chat_room_load_more_messages_begin';
export const CHAT_ROOM_LOAD_MORE_MESSAGES = 'chat_room_load_more_messages';
export const CHAT_ROOM_APPEND_NEW_MESSAGES = 'chat_room_append_new_messages';

export default (state=INITIAL_STATE, action) => {
	switch (action.type) {
		case CHAT_ROOM_SWITCH_TAB: {
			const { index } = action.payload;
			let newState = _.cloneDeep(state);
			newState = _.set(newState, 'navigationState.index', index);

			const selectedTab = state.navigationState.routes[index].key;
			return _.set(newState, 'selectedTab', selectedTab);
		}
        case CHAT_ROOM_LOAD_INITIAL: {
            const  { messages, chatRoom } = action.payload;
            let newState = _.cloneDeep(state);
            if (messages) {
                newState = _.set(newState, 'messages', messages);
            };
            if (chatRoom) {
                newState = _.set(newState, 'chatRoom', chatRoom);
            };
            return newState;
        }
		default: {
			return { ...state };
		}
	}
};
