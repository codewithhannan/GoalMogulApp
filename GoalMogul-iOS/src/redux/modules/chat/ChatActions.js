/**
 * Actions for Chat tab
 */
import _ from 'lodash';
import { Alert } from 'react-native';

import Bluebird from 'bluebird';

import {
	CHAT_SWITCH_TAB,
	PLUS_PRESSED,
	PLUS_UNPRESSED,
	CHAT_LOAD_TYPES,
	CHAT_REFRESH,
	CHAT_REFRESH_DONE,
	CHAT_LOAD,
	CHAT_LOAD_DONE,
	SEARCH_QUERY_UPDATED
} from './ChatReducers';

import {api as API} from '../../middleware/api';
import MessageStorageService from '../../../services/chat/MessageStorageService';
import { Actions } from 'react-native-router-flux';

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

export const searchQueryUpdated = (tab, query) => (dispatch) => {
	dispatch({
		type: SEARCH_QUERY_UPDATED,
		payload: {
			query,
			type: tab,
		},
	});
}

export const createOrGetDirectMessage = (userId) => (dispatch, getState) => {
	const { token } = getState().user;
	const body = {
		roomType: 'Direct',
		membersToAdd: userId,
	};
	API.post(`secure/chat/room`, body, token).then(resp => {
		if (resp.status != 200) {
			Alert.alert('Error', 'Could not create Chat Room. Please try again later.');
			return;
		};
		const chatRoom = resp.data;
		Actions.push('chatRoomConversation', { chatRoomId: chatRoom._id });
		Alert.alert('Success');
	}).catch(err => {
		Alert.alert('Error', 'Could not create a conversation with specified user.');
	});
};

export const updateCurrentChatRoomsList = (tab, currentChatRoomsList, minPageSize, maybeSearchQuery) => (dispatch, getState) => {
	if (maybeSearchQuery || maybeSearchQuery.trim().length) {
		return;
	};
	const pageSize = Math.max(currentChatRoomsList.length, minPageSize);
	const { token } = getState().user;
	switch (tab) {
		case CHAT_LOAD_TYPES.directMessages:
			API.get(`secure/chat/room/latest?roomType=Direct&limit=${pageSize}&skip=0`, token).then(res => {
				const chatRooms = res.data;
				transformChatRoomResultsAndDispatch(CHAT_REFRESH_DONE, {
					type: tab,
					data: chatRooms,
				}, dispatch);
			}).catch(err =>  console.log(`Error live updating chat room list`, err));
			break;
		case CHAT_LOAD_TYPES.chatRooms:
			API.get(`secure/chat/room/latest?roomType=Group&limit=${pageSize}&skip=0`, token).then(res => {
				const chatRooms = res.data;
				transformChatRoomResultsAndDispatch(CHAT_REFRESH_DONE, {
					type: tab,
					data: chatRooms.map(chatDoc => {
						chatDoc.isChatRoom = true;
						return chatDoc;
					}),
				}, dispatch);
			}).catch(err =>  console.log(`Error live updating chat room list`, err));
			break;
	}
};

/* Following are actions to load chat rooms */
export const refreshChatRooms = (tab, pageSize, maybeSearchQuery) => (dispatch, getState) => {
	dispatch({
		type: CHAT_REFRESH,
		payload: {
			type: tab
		},
	});
	const { token } = getState().user;
	switch (tab) {
		case CHAT_LOAD_TYPES.directMessages:
			if (maybeSearchQuery && maybeSearchQuery.trim().length) {
				API.get(`secure/user/friendship/es?query=${maybeSearchQuery}&limit=${pageSize}&skip=0`, token).then(res => {
					const userFriends = res.data;
					dispatch({
						type: CHAT_REFRESH_DONE,
						payload: {
							type: tab,
							data: userFriends.map(userDoc => {
								userDoc.isFriend = true;
								return userDoc;
							}),
						},
					});
				}).catch(err =>  {
					Alert.alert(
						'Error',
						'Error loading data. Please try again.'
					);
					console.log(err);
					dispatch({
						type: CHAT_REFRESH_DONE,
						payload: { type: tab, data: [], },
					});
				});
			} else {
				API.get(`secure/chat/room/latest?roomType=Direct&limit=${pageSize}&skip=0`, token).then(res => {
					const chatRooms = res.data;
					transformChatRoomResultsAndDispatch(CHAT_REFRESH_DONE, {
						type: tab,
						data: chatRooms,
					}, dispatch);
				}).catch(err =>  {
					Alert.alert(
						'Error',
						'Error loading data. Please try again.'
					);
					console.log(err);
					dispatch({
						type: CHAT_REFRESH_DONE,
						payload: { type: tab, data: [], },
					});
				});
			};
			break;
		case CHAT_LOAD_TYPES.chatRooms:
			if (maybeSearchQuery && maybeSearchQuery.trim().length) {
				API.get(`secure/chat/room/es?query=${maybeSearchQuery}&limit=${pageSize}&skip=0&forceRefresh=true`, token).then(res => {
					const chatRooms = res.data;
					transformChatRoomResultsAndDispatch(CHAT_REFRESH_DONE, {
						type: tab,
						data: chatRooms,
					}, dispatch);
				}).catch(err =>  {
					Alert.alert(
						'Error',
						'Error loading data. Please try again.'
					);
					console.log(err);
					dispatch({
						type: CHAT_REFRESH_DONE,
						payload: { type: tab, data: [], },
					});
				});
			} else {
				API.get(`secure/chat/room/latest?roomType=Group&limit=${pageSize}&skip=0`, token).then(res => {
					const chatRooms = res.data;
					transformChatRoomResultsAndDispatch(CHAT_REFRESH_DONE, {
						type: tab,
						data: chatRooms,
					}, dispatch);
				}).catch(err =>  {
					Alert.alert(
						'Error',
						'Error loading data. Please try again.'
					);
					console.log(err);
					dispatch({
						type: CHAT_REFRESH_DONE,
						payload: { type: tab, data: [], },
					});
				});
			};
			break;
	}
};

export const loadMoreChatRooms = (tab, pageSize, prevResultsOffset, maybeSearchQuery) => (dispatch, getState) => {
	dispatch({
		type: CHAT_LOAD,
		payload: {
			type: tab
		},
	});
	const { token } = getState().user;
	const resultsOffset = prevResultsOffset + pageSize;
	switch (tab) {
		case CHAT_LOAD_TYPES.directMessages:
			if (maybeSearchQuery && maybeSearchQuery.trim().length) {
				API.get(`secure/user/friendship/es?query=${maybeSearchQuery}&limit=${pageSize}&skip=${resultsOffset}`, token).then(res => {
					const userFriends = res.data;
					dispatch({
						type: CHAT_LOAD_DONE,
						payload: {
							type: tab,
							data: userFriends.map(userDoc => {
								userDoc.isFriend = true;
								return userDoc;
							}),
							skip: resultsOffset,
							hasNextPage: !!userFriends.length,
						},
					});
				}).catch(err =>  {
					Alert.alert(
						'Error',
						'Error loading data. Please try again.'
					);
					console.log(err);
					dispatch({
						type: CHAT_LOAD_DONE,
						payload: { type: tab, data: [], skip: prevResultsOffset },
					});
				});
			} else {
				API.get(`secure/chat/room/latest?roomType=Direct&limit=${pageSize}&skip=${resultsOffset}`, token).then(res => {
					const chatRooms = res.data;
					transformChatRoomResultsAndDispatch(CHAT_LOAD_DONE, {
						type: tab,
						data: chatRooms,
						skip: resultsOffset,
						hasNextPage: !!chatRooms.length,
					}, dispatch);
				}).catch(err =>  {
					Alert.alert(
						'Error',
						'Error loading data. Please try again.'
					);
					console.log(err);
					dispatch({
						type: CHAT_LOAD_DONE,
						payload: { type: tab, data: [], skip: prevResultsOffset },
					});
				});
			};
			break;
		case CHAT_LOAD_TYPES.chatRooms:
			if (maybeSearchQuery && maybeSearchQuery.trim().length) {
				API.get(`secure/chat/room/es?query=${maybeSearchQuery}&limit=${pageSize}&skip=${resultsOffset}`, token).then(res => {
					const chatRooms = res.data;
					transformChatRoomResultsAndDispatch(CHAT_LOAD_DONE, {
						type: tab,
						data: chatRooms,
						skip: resultsOffset,
						hasNextPage: !!chatRooms.length,
					}, dispatch);
				}).catch(err =>  {
					Alert.alert(
						'Error',
						'Error loading data. Please try again.'
					);
					console.log(err);
					dispatch({
						type: CHAT_LOAD_DONE,
						payload: { type: tab, data: [], skip: prevResultsOffset },
					});
				});
			} else {
				API.get(`secure/chat/room/latest?roomType=Group&limit=${pageSize}&skip=${resultsOffset}`, token).then(res => {
					const chatRooms = res.data;
					transformChatRoomResultsAndDispatch(CHAT_LOAD_DONE, {
						type: tab,
						data: chatRooms,
						skip: resultsOffset,
						hasNextPage: !!chatRooms.length,
					}, dispatch);
				}).catch(err =>  {
					Alert.alert(
						'Error',
						'Error loading data. Please try again.'
					);
					dispatch({
						type: CHAT_LOAD_DONE,
						payload: { type: tab, data: [], skip: prevResultsOffset },
					});
				});
			};
			break;
	}
};

const getUnreadMessageCountByConversations = Bluebird.promisify(MessageStorageService.getUnreadMessageCountByConversations);
const getLatestMessagesByConversation = Bluebird.promisify(MessageStorageService.getLatestMessagesByConversation);
async function transformChatRoomResultsAndDispatch(dispatchType, dispatchPayload, dispatch) {
	let transformedPayload = _.cloneDeep(dispatchPayload);
	const chatRooms = dispatchPayload.data;
	let unreadMessageCountByConversationMap = {};
	try {
		unreadMessageCountByConversationMap = await getUnreadMessageCountByConversations(chatRooms.map(doc => doc._id));
	} catch (e) { /* we tried */ };

	try {
		transformedPayload.data = await Promise.all(chatRooms.map(async chatRoom => {
			chatRoom.isChatRoom = true;
			chatRoom.unreadMessageCount = unreadMessageCountByConversationMap[chatRoom._id];
			try {
				chatRoom.latestMessage = (await getLatestMessagesByConversation(chatRoom._id, 1, 0))[0];
			} catch (e) { /* we tried */ };
			return chatRoom;
		}));
	} catch(e) { /* should never happen */ }

	dispatch({
		type: dispatchType,
		payload: transformedPayload,
	});
}