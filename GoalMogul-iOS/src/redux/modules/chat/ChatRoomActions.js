import { CHAT_ROOM_LOAD_INITIAL_BEGIN, CHAT_ROOM_LOAD_INITIAL, CHAT_ROOM_UPDATE_CURRENTLY_TYPING_USERS, CHAT_ROOM_UPDATE_MEDIA_REF, CHAT_ROOM_UPDATE_MESSAGES, CHAT_ROOM_LOAD_MORE_MESSAGES_BEGIN, CHAT_ROOM_LOAD_MORE_MESSAGES } from "./ChatRoomReducers";
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
				} else {
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

export const updateMessageList = (chatRoom, currentMessageList) => (dispatch, getState) => {
	const oldestMessage = currentMessageList[currentMessageList.length - 1];
	if (oldestMessage) {
		MessageStorageService.getAllMessagesAfterMessage(chatRoom, oldestMessage, (err, messages) => {
			if (err || !messages) {
				Alert.alert('Error', 'Could not auto-update messages. Please try re-opening this conversation.');
			} else {
				const giftedChatMessages = _transformMessagesForGiftedChat(currentMessageList, chatRoom);
				dispatch({
					type: CHAT_ROOM_UPDATE_MESSAGES,
					payload: giftedChatMessages,
				});
			};
		});
	} else {
		// if no messages in convo, load the first 10
		return loadOlderMessages(10, 0);
	};
};

export const loadOlderMessages = (chatRoom, pageSize, pageOffset) => (dispatch, getState) => {
	const { token } = getState().user;
	dispatch({
		type: CHAT_ROOM_LOAD_MORE_MESSAGES_BEGIN,
		payload: {},
	});
	MessageStorageService.getLatestMessagesByConversation(currentChatRoomId, pageSize, pageOffset, (err, messages) => {
		if (err || !messages) {
			Alert.alert('Error', 'Could not load more messages for selected chat room.');
			dispatch({
				type: CHAT_ROOM_LOAD_MORE_MESSAGES,
				payload: [],
			});
		} else {
			const giftedChatMessages = _transformMessagesForGiftedChat(messages, chatRoom);
			dispatch({
				type: CHAT_ROOM_LOAD_MORE_MESSAGES,
				payload: giftedChatMessages,
			});
		};
	});
};

export const deleteMessage = (messageId, chatRoom, currentMessageList) => (dispatch, getState) => {
	MessageStorageService.deleteMessage(messageId, (err, numRemoved) => {
		if (numRemoved) {
			updateMessageList(chatRoom, currentMessageList.filter(messageDoc => messageDoc._id != messageId))(dispatch, getState);
		};
	});
};

export const sendMessage = (messagesToSend, mountedMediaRef, chatRoom, currentMessageList) => (dispatch, getState) => {
	// iterate through each messagesToSend:
		// POST {chatRoomRef, content{message,tags[]}, media} to '/secure/chat/message'
		// transform message and insert into MessageStorageService
		// updateMessageList(chatRoom, currentMessageList)
};

export const messageMediaRefChanged = (mediaRef) => (dispatch, getState) => {
	dispatch({
		type: CHAT_ROOM_UPDATE_MESSAGE_MEDIA_REF,
		payload: mediaRef,
	});
};
// --------------------------- utils --------------------------- //

function _transformMessageFromGiftedChat(messageDoc, mountedMediaRef, chatRoom) {
	// TODO(Jay)
}

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