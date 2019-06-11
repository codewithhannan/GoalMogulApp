import _ from 'lodash';

import { CHAT_ROOM_LOAD_INITIAL_BEGIN, CHAT_ROOM_LOAD_INITIAL, CHAT_ROOM_UPDATE_CURRENTLY_TYPING_USERS, CHAT_ROOM_UPDATE_MESSAGES, CHAT_ROOM_LOAD_MORE_MESSAGES_BEGIN, CHAT_ROOM_LOAD_MORE_MESSAGES, CHAT_ROOM_UPDATE_MESSAGE_MEDIA_REF, CHAT_ROOM_UPDATE_GHOST_MESSAGES, CHAT_ROOM_CLOSE_ACTIVE_ROOM } from "./ChatRoomReducers";
import { api as API } from "../../middleware/api";
import { Alert } from 'react-native';
import Decode from 'unescape';

import MessageStorageService from '../../../services/chat/MessageStorageService';
import { IMAGE_BASE_URL } from "../../../Utils/Constants";
import ImageUtils from "../../../Utils/ImageUtils";
import { MemberDocumentFetcher } from "../../../Utils/UserUtils";

const LOADING_RIPPLE_URL = "https://i.imgur.com/EhwxDDf.gif";

export const initialLoad = (currentChatRoomId, pageSize) => (dispatch, getState) => {
	const state = getState();
	const { token } = state.user;

	// load chat room if it already exists in the state
    const { chatRoomsMap } = state.chatRoom;
	const maybeChatRoom = currentChatRoomId && chatRoomsMap[currentChatRoomId];
	if (maybeChatRoom) {
		dispatch({
			type: CHAT_ROOM_LOAD_INITIAL,
			payload: { messages: [], chatRoom: maybeChatRoom },
		});
		MessageStorageService.getLatestMessagesByConversation(currentChatRoomId, pageSize, 0, async (err, messages) => {
			if (!messages) return;
			let transformedMessages = [];
			try {
				transformedMessages = await _transformMessagesForGiftedChat(messages, maybeChatRoom, token);
			} catch(e) { /* best attempt */ }
			dispatch({
				type: CHAT_ROOM_LOAD_INITIAL,
				payload: {
					messages: transformedMessages,
				},
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
				return; // Alert.alert('Error', 'Invalid chat room.');
			};
			MessageStorageService.getLatestMessagesByConversation(currentChatRoomId, pageSize, 0, async (err, messages) => {
				if (err || !messages) {
					Alert.alert('Error', 'Could not load messages for selected chat room.');
					dispatch({
						type: CHAT_ROOM_LOAD_INITIAL,
						payload: { messages: [], chatRoom },
					});
				} else {
					let giftedChatMessages = [];
					try {
						giftedChatMessages = await _transformMessagesForGiftedChat(messages, chatRoom, token);
					} catch(e) {/* best attempt */}
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
				return// Alert.alert('Error', 'Could not refresh chat room. Please try again later.');
			};
			const chatRoom = resp.data;
			maybeCallback && maybeCallback(null, chatRoom);
			if (!chatRoom) {
				return; // Alert.alert('Error', 'Invalid chat room.');
			};
			dispatch({
				type: CHAT_ROOM_LOAD_INITIAL,
				payload: { chatRoom },
			});
		}).catch(err => {
			maybeCallback && maybeCallback(err);
			// Alert.alert('Error', 'Could not refresh chat room.');
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
		_.remove(updatedUserIds, (memberId) => memberId == userId);
	};
	dispatch({
		type: CHAT_ROOM_UPDATE_CURRENTLY_TYPING_USERS,
		payload: updatedUserIds,
	})
};

export const updateMessageList = (chatRoom, currentMessageList, clearGhostMessages) => (dispatch, getState) => {
	const { token } = getState().user;
	const oldestMessage = currentMessageList.sort((doc1, doc2) => doc1.createdAt - doc2.createdAt)[0];
	if (oldestMessage) {
		MessageStorageService.getAllMessagesAfterMessage(chatRoom._id, oldestMessage._id, async (err, messages) => {
			if (err || !messages) {
				Alert.alert('Error', 'Could not auto-update messages. Please try re-opening this conversation.');
			} else {
				let giftedChatMessages = [];
				try {
					giftedChatMessages = await _transformMessagesForGiftedChat(messages, chatRoom, token);
				} catch(e) {/* best attempt */};
				MessageStorageService.markConversationMessagesAsRead(chatRoom._id);
				dispatch({
					type: CHAT_ROOM_UPDATE_MESSAGES,
					payload: giftedChatMessages,
				});
			};
			if (clearGhostMessages) {
				dispatch({
					type: CHAT_ROOM_UPDATE_GHOST_MESSAGES,
					payload: null,
				});
			};
		});
	} else {
		// if no messages in convo, load the first 10
		return initialLoad(chatRoom._id, 10)(dispatch, getState);
	};
};

export const loadOlderMessages = (chatRoom, pageSize, pageOffset) => (dispatch, getState) => {
	const { token } = getState().user;
	dispatch({
		type: CHAT_ROOM_LOAD_MORE_MESSAGES_BEGIN,
		payload: {},
	});
	MessageStorageService.getLatestMessagesByConversation(chatRoom._id, pageSize, pageOffset, async (err, messages) => {
		if (err || !messages) {
			Alert.alert('Error', 'Could not load more messages for selected chat room.');
			dispatch({
				type: CHAT_ROOM_LOAD_MORE_MESSAGES,
				payload: [],
			});
		} else {
			let giftedChatMessages = [];
			try {
				giftedChatMessages = await _transformMessagesForGiftedChat(messages, chatRoom, token);
			} catch(e) {/* best attempt */};
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

export const deleteConversationMessages = (chatRoom, currentMessageList) => (dispatch, getState) => {
	MessageStorageService.deleteConversationMessages(chatRoom._id, (err, numRemoved) => {
		if (numRemoved) {
			Alert.alert('Success', 'All messages from this conversation have been purged.');
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
		// iterate over each message to be sent (usually should only be 1)
		messagesToSend.forEach(messageToSend => {
			// insert message into local storage
			const messageToInsert = _transformMessageFromGiftedChat(messageToSend, uploadedMediaRef, chatRoom);
			MessageStorageService.storeLocallyCreatedMessage({...messageToInsert, isRead: true, isLocal: true}, (err, insertedDoc) => {
				if (err) {
					// clear ghost message
					dispatch({
						type: CHAT_ROOM_UPDATE_GHOST_MESSAGES,
						payload: null,
					});
					return Alert.alert('Error', 'Could not store message locally. Please try again later.');
				};
				// update state to show newly inserted message and clear the ghost message
				updateMessageList(chatRoom, currentMessageList, true)(dispatch, getState);

				// send the message
				const { text, sharedEntity } = messageToSend;
				let body = {
					created: insertedDoc.created,
					chatRoomRef: chatRoom._id,
					content: {
						message: text,
					},
					customIdentifier: insertedDoc._id,
				};
				if (sharedEntity) {
					body.sharedEntity = sharedEntity;
				}
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
	const { _id, createdAt, text, user, sharedEntity } = messageDoc;
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
	if (sharedEntity) {
		transformedDoc.sharedEntity = sharedEntity;
	};
	if (uploadedMediaRef) {
		transformedDoc.media = uploadedMediaRef;
	};
	return transformedDoc;
};

export async function _transformMessagesForGiftedChat(messages, chatRoom, token) {
	let chatRoomMemberMap = {};
	if (chatRoom && chatRoom.members) {
		chatRoomMemberMap = chatRoom.members.reduce((map, memberDoc) => {
			map[memberDoc.memberRef._id] = memberDoc.memberRef;
			return map;
		}, {});
	};
	return await Promise.all(messages.map(async messageDoc => {
		let { _id, created, creator, content, media, isSystemMessage, isLocal, sharedEntity, goalRecommendation } = messageDoc;

		//--- populate message content ---//

		if (sharedEntity && sharedEntity.userRef) {
			try {
				sharedEntity.userRef = (await MemberDocumentFetcher.getUserDocument(sharedEntity.userRef, token, chatRoomMemberMap, true)) || sharedEntity.userRef;
			} catch (e) { /* best attempt */ };
		};
		if (sharedEntity && sharedEntity.tribeRef) {
			try {
				sharedEntity.tribeRef = (await fetchTribe(sharedEntity.tribeRef, token)) || sharedEntity.tribeRef;
				if (typeof sharedEntity.tribeRef == "object") {
					sharedEntity.tribeRef = sharedEntity.tribeRef.data; // extract data from api result
				};
			} catch (e) { /* best attempt */ };
		};
		if (sharedEntity && sharedEntity.eventRef) {
			try {
				sharedEntity.eventRef = (await fetchEvent(sharedEntity.eventRef, token)) || sharedEntity.eventRef;
				if (typeof sharedEntity.eventRef == "object") {
					sharedEntity.eventRef = sharedEntity.eventRef.data; // extract data from api result
				};
			} catch (e) { /* best attempt */ };
		};
		let user;
		if (creator) {
			user = await MemberDocumentFetcher.getUserDocument(creator, token, chatRoomMemberMap);
		};

		// return transformed message
		return {
			_id, isLocal, sharedEntity, user, goalRecommendation,
			createdAt: new Date(created),
			image: media && `${IMAGE_BASE_URL}${media}`,
			text: content && Decode(content.message),
			system: !!isSystemMessage,
		};
	}));
};
async function fetchTribe(tribeId, token) {
	try {
		return await API.get(`secure/tribe/documents/${tribeId}?noMembers=true`, token);
	} catch(e) { /* best attempt */ };
};
async function fetchEvent(eventId, token) {
	try {
		return await API.get(`secure/event/documents/${eventId}?noParticipants=true`, token);
	} catch(e) { /* best attempt */ };
};
export function _transformUserForGiftedChat(userDoc) {
	const {_id, name, profile} = userDoc;
	const profileImage = profile && profile.image && `${IMAGE_BASE_URL}${profile.image}`;
	return { _id, name, avatar: profileImage };
};