import { CHAT_ROOM_LOAD_INITIAL_BEGIN, CHAT_ROOM_LOAD_INITIAL, CHAT_ROOM_UPDATE_CURRENTLY_TYPING_USERS, CHAT_ROOM_UPDATE_MEDIA_REF } from "./ChatRoomReducers";
import { api as API } from "../../middleware/api";
import { Alert } from 'react-native';

import MessageStorageService from '../../../services/chat/MessageStorageService';
import { IMAGE_BASE_URL } from "../../../Utils/Constants";

export const initialLoad = (currentChatRoomId, pageSize) => (dispatch, getState) => {
	const { token } = getState().user;
	dispatch({
		type: CHAT_ROOM_LOAD_INITIAL_BEGIN,
		payload: {},
	});
	API.get(`secure/chat/room/documents/${currentChatRoomId}`, token)
		.then(resp => {
			const chatRoom = resp.data;
			if (!chatRoom) {
				throw new Error('Invalid chat room.');
			};
			MessageStorageService.getLatestMessagesByConversation(currentChatRoomId, pageSize, 0, (err, messages) => {
				if (err || !messages) {
					Alert.alert('Error', 'Could not load messages for selected chat room.');
					dispatch({
						type: CHAT_ROOM_LOAD_INITIAL,
						payload: { messages: [], chatRoom: null },
					});
				} else if (messages) {
					const giftedChatMessages = _transformMessagesForGiftedChat(messages, chatRoom);
					dispatch({
						type: CHAT_ROOM_LOAD_INITIAL,
						payload: { giftedChatMessages, chatRoom },
					});
				};
			});
		}).catch(err => {
			Alert.alert('Error', 'Could not load selected chat room.');
			dispatch({
				type: CHAT_ROOM_LOAD_INITIAL,
				payload: { messages: [], chatRoom: null },
			});
		});
};

export const updateTypingStatus = (userId, updatedTypingStatus, currentlyTypingUserIds) => (dispatch, getState) => {
	let updatedUserIds = currentlyTypingUserIds;
	if (updatedTypingStatus) {
		updatedUserIds.push(userId.toString());
		updatedUserIds = _.uniq(updatedUserIds);
	} else {
		updatedUserIds = _.remove(updatedUserIds, (memberId) => memberId == userId);
	};
	dispatch({
		type: CHAT_ROOM_UPDATE_CURRENTLY_TYPING_USERS,
		payload: updatedUserIds,
	})
};

export const updateMessageList = (currentMessageList) => (dispatch, getState) => {

}

export const loadOlderMessages = (pageSize, pageOffset) => (dispatch, getState) => {

}

export const deleteMessage = (messageId, currentMessageList) => (dispatch, getState) => {

}

export const sendMessage = (messages, chatRoomId) => (dispatch, getState) => {

}

export const messageMediaRefChanged = (mediaRef) => (dispatch, getState) => {
	dispatch({
		type: CHAT_ROOM_UPDATE_MESSAGE_MEDIA_REF,
		payload: mediaRef,
	});
};
// --------------------------- utils --------------------------- //

function _transformMessagesForGiftedChat(messages, chatRoom) {
	let chatRoomMemberMap = {};
	if (chatRoom.members) {
		chatRoomMemberMap = chatRoom.members.reduce((map, memberDoc) => {
			map[memberDoc.memberRef._id] = _transformUserForGiftedChat(memberDoc.memberRef);
			return map;
		}, {});
	};
	return messages.map(messageDoc => {
		const { _id, creator, created, content, media } = messageDoc;
		return {
			_id,
			image: media && `${IMAGE_BASE_URL}${media}`,
			text: content.message,
			createdAt: created,
			user: chatRoomMemberMap[creator]
		};
	});
};
function _transformUserForGiftedChat(userDoc) {
	const {_id, name, profile} = userDoc;
	const profileImage = profile && profile.image;
	return { _id, name, avatar: profileImage };
};