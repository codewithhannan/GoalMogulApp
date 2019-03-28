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
    limit: 10,
    skip: 0,
    hasNextPage: false,
    loading: false,
    searchResults: [],
    searching: false,
};

export const CHAT_ROOM_SWITCH_TAB = 'chat_room_switch_tab';
export const CHAT_ROOM_LOAD_INITIAL = 'chat_room_load_initial';
export const CHAT_ROOM_UPDATE_CHAT_ROOM = 'chat_room_update_chat_room';
export const CHAT_ROOM_LOAD_MORE_MESSAGES_BEGIN = 'chat_room_load_more_messages_begin';
export const CHAT_ROOM_LOAD_MORE_MESSAGES = 'chat_room_load_more_messages';
export const CHAT_ROOM_UPDATE_MESSAGES = 'chat_room_update_messages'; // we update the entire message list when a new message comes in for consistency purposes
export const CHAT_ROOM_SEARCH_MESSAGES_BEGIN = 'chat_room_search_messages_begin';
export const CHAT_ROOM_SEARCH_MESSAGES_CLEAR = 'chat_room_search_messages_clear';
export const CHAT_ROOM_SEARCH_MESSAGES = 'chat_room_search_messages';

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
                newState = _.set(newState, 'hasNextPage', !!messages.length);
            };
            if (chatRoom) {
                newState = _.set(newState, 'chatRoom', chatRoom);
            };
            return newState;
        }
        case CHAT_ROOM_UPDATE_CHAT_ROOM: {
            let newState = _.cloneDeep(state);
            return _.set(newState, 'chatRoom', action.payload);
        }
        case CHAT_ROOM_LOAD_MORE_MESSAGES_BEGIN: {
            let newState = _.cloneDeep(state);
            return _.set(newState, 'loading', true);
        }
        case CHAT_ROOM_LOAD_MORE_MESSAGES: {
            let newState = _.cloneDeep(state);
            const messages  = action.payload;
            const oldMessages = _.get(newState, `messages`);
            const mergedMessages = arrayUnique(oldMessages.concat(messages));
            newState = _.set(newState, 'loading', false);
            newState = _.set(newState, 'skip', mergedMessages.length);
            newState = _.set(newState, 'hasNextPage', !!messages.length);
			return _.set(newState, `messages`, mergedMessages);
        }
        case CHAT_ROOM_UPDATE_MESSAGES: {
            let newState = _.cloneDeep(state);
            const messages = action.payload;
            newState = _.set(newState, 'skip', messages.length);
			return _.set(newState, `messages`, messages);
        }
        case CHAT_ROOM_SEARCH_MESSAGES_BEGIN: {
            let newState = _.cloneDeep(state);
            return _.set(newState, `searching`, true);
        }
        case CHAT_ROOM_SEARCH_MESSAGES_CLEAR: {
            let newState = _.cloneDeep(state);
            newState = _.set(newState, 'searchResults', []);
            return _.set(newState, `searching`, false);
        }
        case CHAT_ROOM_SEARCH_MESSAGES: {
            let newState = _.cloneDeep(state);
            newState = _.set(newState, 'searchResults', actions.payload);
            return _.set(newState, `searching`, false);
        }
		default: {
			return { ...state };
		}
	}
};
