import { CHAT_ROOM_LOAD_INITIAL_BEGIN, CHAT_ROOM_LOAD_INITIAL, CHAT_ROOM_UPDATE_CURRENTLY_TYPING_USERS, CHAT_ROOM_UPDATE_MESSAGES, CHAT_ROOM_LOAD_MORE_MESSAGES_BEGIN, CHAT_ROOM_LOAD_MORE_MESSAGES, CHAT_ROOM_UPDATE_MESSAGE_MEDIA_REF, CHAT_ROOM_UPDATE_GHOST_MESSAGES, CHAT_ROOM_CLOSE_ACTIVE_ROOM } from "./ChatRoomReducers";
import { api as API } from "../../middleware/api";
import { Alert } from 'react-native';

import MessageStorageService from '../../../services/chat/MessageStorageService';
import { IMAGE_BASE_URL } from "../../../Utils/Constants";
import ImageUtils from "../../../Utils/ImageUtils";

const LOADING_RIPPLE_URL = "https://i.imgur.com/EhwxDDf.gif";

export const initialLoad = (currentChatRoomId, pageSize) => (dispatch, getState) => {
	const state = getState();
	const { token } = state.user;

	// load chat room if it already exists in the state
    const { chatRoomsMap, activeChatRoomId } = state.chatRoom;
	const maybeChatRoom = activeChatRoomId && chatRoomsMap[activeChatRoomId];
	if (maybeChatRoom) {
		dispatch({
			type: CHAT_ROOM_LOAD_INITIAL,
			payload: { messages: [], chatRoom: maybeChatRoom },
		});
		MessageStorageService.getLatestMessagesByConversation(currentChatRoomId, pageSize, 0, (err, messages) => {
			if (!messages) return;
			dispatch({
				type: CHAT_ROOM_LOAD_INITIAL,
				payload: { messages: _transformMessagesForGiftedChat(messages, maybeChatRoom) },
			});
		});
	} else { // if no chat room already in state, show loader
		dispatch({
			type: CHAT_ROOM_LOAD_INITIAL_BEGIN,
			payload: {},
		});
	};

	// fetch a fresh copy of the chat room, regardless of if we have it in the state already
	API.get(`secure/chat/room/documents/${currentChatRoomId}`, token)
		.then(resp => {
			if (resp.status != 200) {
				return Alert.alert('Error', 'Could not fetch chat room. Please try again later.');
			};
			const chatRoom = resp.data;
			if (!chatRoom) {
				dispatch({
					type: CHAT_ROOM_LOAD_INITIAL,
					payload: { messages: [], chatRoom: null },
				});
				return Alert.alert('Error', 'Invalid chat room.');
			};
			MessageStorageService.getLatestMessagesByConversation(currentChatRoomId, pageSize, 0, (err, messages) => {
				if (err || !messages) {
					Alert.alert('Error', 'Could not load messages for selected chat room.');
					dispatch({
						type: CHAT_ROOM_LOAD_INITIAL,
						payload: { messages: [], chatRoom },
					});
				} else {
					const giftedChatMessages = _transformMessagesForGiftedChat(messages, chatRoom);
					dispatch({
						type: CHAT_ROOM_LOAD_INITIAL,
						payload: { messages: giftedChatMessages, chatRoom },
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

export const refreshChatRoom = (currentChatRoomId, maybeCallback) => (dispatch, getState) => {
	const { token } = getState().user;
	API.get(`secure/chat/room/documents/${currentChatRoomId}`, token)
		.then(resp => {
			if (resp.status != 200) {
				maybeCallback && maybeCallback(new Error('Server error refreshing chat room'));
				return Alert.alert('Error', 'Could not refresh chat room. Please try again later.');
			};
			const chatRoom = resp.data;
			maybeCallback && maybeCallback(null, chatRoom);
			if (!chatRoom) {
				return Alert.alert('Error', 'Invalid chat room.');
			};
			dispatch({
				type: CHAT_ROOM_LOAD_INITIAL,
				payload: { chatRoom },
			});
		}).catch(err => {
			maybeCallback && maybeCallback(err);
			Alert.alert('Error', 'Could not refresh chat room.');
		});
};

export const closeActiveChatRoom = () => (dispatch, getState) => {
	dispatch({
		type: CHAT_ROOM_CLOSE_ACTIVE_ROOM,
		payload: {}
	});
}

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
	const oldestMessage = currentMessageList.sort((doc1, doc2) => doc1.createdAt - doc2.createdAt)[0];
	if (oldestMessage) {
		MessageStorageService.getAllMessagesAfterMessage(chatRoom._id, oldestMessage._id, (err, messages) => {
			if (err || !messages) {
				Alert.alert('Error', 'Could not auto-update messages. Please try re-opening this conversation.');
			} else {
				const giftedChatMessages = _transformMessagesForGiftedChat(messages, chatRoom);
				MessageStorageService.markConversationMessagesAsRead(chatRoom._id);
				dispatch({
					type: CHAT_ROOM_UPDATE_MESSAGES,
					payload: giftedChatMessages,
				});
			};
		});
	} else {
		// if no messages in convo, load the first 10
		return initialLoad(chatRoom._id, 10)(dispatch, getState);
	};
};

export const loadOlderMessages = (chatRoom, pageSize, pageOffset) => (dispatch, getState) => {
	dispatch({
		type: CHAT_ROOM_LOAD_MORE_MESSAGES_BEGIN,
		payload: {},
	});
	MessageStorageService.getLatestMessagesByConversation(chatRoom._id, pageSize, pageOffset, (err, messages) => {
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
	if (!chatRoom) return;
	const { token } = getState().user;

	let uploadedMediaRef = null;
	// upload the image if a file's mounted
	if (mountedMediaRef) {
		// clear the state for it
		changeMessageMediaRef(undefined)(dispatch, getState);
		const ghostMessage = buildSendingImageGhostMessage(messagesToSend[0]);
		dispatch({
			type: CHAT_ROOM_UPDATE_GHOST_MESSAGES,
			payload: [ghostMessage],
		});
		// Resize image
		ImageUtils.getImageSize(mountedMediaRef).then(({ width, height }) => {
			return ImageUtils.resizeImage(mountedMediaRef, width, height);
		}).then((image) => {
			// Get image ref and a presigned url
			return ImageUtils.getPresignedUrl(image.uri, token, (objectKey) => {
				uploadedMediaRef = objectKey;
			}, 'ChatFile');
		}).then(({ signedRequest, file }) => {
			// upload to s3
			return ImageUtils.uploadImage(file, signedRequest);
		}).then((res) => {
			if (res instanceof Error) {
				console.log('error uploading image to s3 with res: ', res);
				Alert.alert('Error', 'Could not upload image. Please try again later.');
				return;
			};
			sendMessages();
		}).catch(err => {
			// clear ghost message
			dispatch({
				type: CHAT_ROOM_UPDATE_GHOST_MESSAGES,
				payload: null,
			});
			console.log('Internal error uploading image to s3 with error: ', err);
			Alert.alert('Error', 'Could not upload image.');
		});
	} else {
		sendMessages();
	};

	function sendMessages() {
		// clear ghost message
		dispatch({
			type: CHAT_ROOM_UPDATE_GHOST_MESSAGES,
			payload: null,
		});
		// iterate over each message to be sent (usually should only be 1)
		messagesToSend.forEach(messageToSend => {
			// insert message into local storage
			const messageToInsert = _transformMessageFromGiftedChat(messageToSend, uploadedMediaRef, chatRoom);
			MessageStorageService.storeLocallyCreatedMessage({...messageToInsert, isRead: true}, (err, insertedDoc) => {
				if (err) {
					return Alert.alert('Error', 'Could not store message locally. Please try again later.');
				};
				// update state to show newly inserted message
				updateMessageList(chatRoom, currentMessageList)(dispatch, getState);

				// send the message
				const { text } = messageToSend;
				let body = {
					chatRoomRef: chatRoom._id,
					content: {
						message: text,
					},
				};
				if (uploadedMediaRef) {
					body.media = uploadedMediaRef;
				};
				const handleRequestFailure = (failure) => {
					Alert.alert('Error', 'Could not send message to others.');
					MessageStorageService.deleteMessage(insertedDoc._id, (err) => {
						if (err) return;
						updateMessageList(chatRoom, currentMessageList)(dispatch, getState);
					});
				};
				API.post(`secure/chat/message`, body, token).then(resp => {
					if (resp.status != 200) {
						handleRequestFailure();
					};
				}).catch(handleRequestFailure);
			});
		});
	};
};

export const changeMessageMediaRef = (mediaRef) => (dispatch, getState) => {
	dispatch({
		type: CHAT_ROOM_UPDATE_MESSAGE_MEDIA_REF,
		payload: mediaRef,
	});
}

// --------------------------- utils --------------------------- //

function buildSendingImageGhostMessage(messageToSend) {
	let tempMessage = { ...messageToSend };
	tempMessage.image = LOADING_RIPPLE_URL;
	return tempMessage;
}

function _transformMessageFromGiftedChat(messageDoc, uploadedMediaRef, chatRoom) {
	const { _id, createdAt, text, user } = messageDoc;
	let transformedDoc = {
		_id,
		created: new Date(createdAt),
		creator: user._id,
		recipient: user._id,
		content: {
			message: text,
		},
		chatRoomRef: chatRoom._id,
	};
	if (uploadedMediaRef) {
		transformedDoc.media = uploadedMediaRef;
	};
	return transformedDoc;
};

function _transformMessagesForGiftedChat(messages, chatRoom) {
	let chatRoomMemberMap = {};
	if (chatRoom.members) {
		chatRoomMemberMap = chatRoom.members.reduce((map, memberDoc) => {
			map[memberDoc.memberRef._id] = _transformUserForGiftedChat(memberDoc.memberRef);
			return map;
		}, {});
	};
	return messages.map(messageDoc => {
		const { _id, created, creator, content, media } = messageDoc;
		return {
			_id,
			createdAt: new Date(created),
			image: media && `${IMAGE_BASE_URL}${media}`,
			text: content && content.message,
			user: chatRoomMemberMap[creator]
		};
	});
};
function _transformUserForGiftedChat(userDoc) {
	const {_id, name, profile} = userDoc;
	const profileImage = profile && profile.image && `${IMAGE_BASE_URL}${profile.image}`;
	return { _id, name, avatar: profileImage };
};