/**
 * Actions for Chat tab
 */
import { Alert } from 'react-native';

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
					dispatch({
						type: CHAT_REFRESH_DONE,
						payload: {
							type: tab,
							data: chatRooms.map(chatDoc => {
								chatDoc.isChatRoom = true;
								return chatDoc;
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
			};
			break;
		case CHAT_LOAD_TYPES.chatRooms:
			if (maybeSearchQuery && maybeSearchQuery.trim().length) {
				API.get(`secure/chat/room/es?query=${maybeSearchQuery}&limit=${pageSize}&skip=0&forceRefresh=true`, token).then(res => {
					const chatRooms = res.data;
					dispatch({
						type: CHAT_REFRESH_DONE,
						payload: {
							type: tab,
							data: chatRooms.map(chatDoc => {
								chatDoc.isChatRoom = true;
								return chatDoc;
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
				API.get(`secure/chat/room/latest?roomType=Group&limit=${pageSize}&skip=0`, token).then(res => {
					const chatRooms = res.data;
					dispatch({
						type: CHAT_REFRESH_DONE,
						payload: {
							type: tab,
							data: chatRooms.map(chatDoc => {
								chatDoc.isChatRoom = true;
								return chatDoc;
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
					dispatch({
						type: CHAT_LOAD_DONE,
						payload: {
							type: tab,
							data: chatRooms.map(chatDoc => {
								chatDoc.isChatRoom = true;
								return chatDoc;
							}),
							skip: resultsOffset,
							hasNextPage: !!chatRooms.length,
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
			};
			break;
		case CHAT_LOAD_TYPES.chatRooms:
			if (maybeSearchQuery && maybeSearchQuery.trim().length) {
				API.get(`secure/chat/room/es?query=${maybeSearchQuery}&limit=${pageSize}&skip=${resultsOffset}`, token).then(res => {
					const chatRooms = res.data;
					dispatch({
						type: CHAT_LOAD_DONE,
						payload: {
							type: tab,
							data: chatRooms.map(chatDoc => {
								chatDoc.isChatRoom = true;
								return chatDoc;
							}),
							skip: resultsOffset,
							hasNextPage: !!chatRooms.length,
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
				API.get(`secure/chat/room/latest?roomType=Group&limit=${pageSize}&skip=${resultsOffset}`, token).then(res => {
					const chatRooms = res.data;
					dispatch({
						type: CHAT_LOAD_DONE,
						payload: {
							type: tab,
							data: chatRooms.map(chatDoc => {
								chatDoc.isChatRoom = true;
								return chatDoc;
							}),
							skip: resultsOffset,
							hasNextPage: !!chatRooms.length,
						},
					});
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