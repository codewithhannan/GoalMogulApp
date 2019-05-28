import { Notifications } from 'expo';
import { default as LiveChatService, INCOMING_EVENT_NAMES, OUTGOING_EVENT_NAMES } from '../../socketio/services/LiveChatService';
import MongoDatastore from 'react-native-local-mongodb';
import Fuse from 'fuse.js';
import { api as API } from '../../redux/middleware/api';
import { arrayUnique } from '../../reducers/MeetReducers';

const LISTENER_BASE_IDENTIFIER = 'chatmessageservice';
const CHAT_MESSAGES_COLLECTION_NAME = 'chatmessages';
const DEBUG_KEY = '[MessageStorageService]';
const MESSAGE_QUEUE_POLLING_INTERVAL_SECONDS = 3;
const DB_RESULTS_RESPONSE_CAP = 250000;
const DB_QUERY_RESULTS_CAP = 25000000;
const FUSE_MESSAGE_SEARCH_OPTIONS = {
    shouldSort: true,
    tokenize: true,
    minMatchCharLength: 2,
    maxPatternLength: 32,
    keys: [{
        name: 'content.message',
        weight: 0.7
    }, {
        name: 'content.links',
        weight: 0.3,
    }],
};

// a collection for storing ChatMessage documents (as defined by the api models)
const localDb = new MongoDatastore({ filename: CHAT_MESSAGES_COLLECTION_NAME, autoload: true });
// index the fields we will most commonly query by
localDb.ensureIndex({ fieldName: 'chatRoomRef' });
localDb.ensureIndex({ fieldName: 'recipient' });
localDb.ensureIndex({ fieldName: '_id' });

class MessageStorageService {
    isInitialized = false;
    isUserMounted = false;
    mountedUser = {
        userId: null,
        authToken: null,
    };
    currentlyActiveChatRoomId = null;
    incomingMessageListeners = {}; // listens to incoming messages via sockets
    pulledMessageListeners = {}; // listens to new messages via pull

    // -------------------------------- Initializations -------------------------------- //

    /**
     * Initializes the service
     * @requires {@link LiveChatService#initialize} to be called before this can run
     */
    initialize = () => {
        // listen to incoming messages
        LiveChatService.addListenerToEvent(
            INCOMING_EVENT_NAMES.incomingMessage,
            `${LISTENER_BASE_IDENTIFIER}:${INCOMING_EVENT_NAMES.incomingMessage}`,
            this._onIncomingMessage.bind(this)
        );
        this.isInitialized = true;
    }

    /**
     * Mounts a user onto the service for credential use
     * @param {Object} userState: {userId, authToken}
     */
    mountUser = (userState) => {
        const { authToken } = userState;
        // mount the user
        this.isUserMounted = true;
        this.mountedUser = userState;
        // pull the message queue
        this._beginMessageQueuePolling();
    }
    /**
     * Unmounts the currently mounted user
     */
    unMountUser = () => {
        this._endMessageQueuePolling();
        this.isUserMounted = false;
        this.mountedUser = {
            authToken: null,
            userId: null,
        };
    }
    /**
     * Sets the currently active chatroom so incoming messages for that room are marked as read
     * @param {String} chatRoomId 
     */
    setActiveChatRoom = (chatRoomId) => {
        this.currentlyActiveChatRoomId = chatRoomId;
    }
    /**
     * Unsets the currently active chatroom
     * @param {String} chatRoomId
     */
    unsetActiveChatRoom = (chatRoomId) => {
        if (chatRoomId == this.currentlyActiveChatRoomId) {
            this.currentlyActiveChatRoomId = null;
        };
    }

    // -------------------------------- Listeners -------------------------------- //

    /**
     * Adds a listener that fires when incoming messages are inserted into the local store
     * @param {String} listenerIdentifier 
     * @param {Function} listener: fn(dataObj:{messageDoc, senderName, chatRoomName, chatRoomType, chatRoomPicture})
     */
    onIncomingMessageStored = (listenerIdentifier, listener) => {
        if (typeof listenerIdentifier != "string" || typeof listener != "function") {
            return console.log('Listener identifier must be a string and listener must be a function.');
        }
        this.incomingMessageListeners[listenerIdentifier] = listener;
    }
    /**
     * Removes a listener to the incoming message store event
     * @param {String} listenerIdentifier 
     */
    offIncomingMessageStored = (listenerIdentifier) => {
        this.incomingMessageListeners[listenerIdentifier] = undefined;
        delete this.incomingMessageListeners[listenerIdentifier];
    }
    /**
     * Adds a listener that fires when pulled messages are inserted into the local store
     * @param {String} listenerIdentifier 
     * @param {Function} listener: fn([MessageDoc])
     */
    onPulledMessageStored = (listenerIdentifier, listener) => {
        if (typeof listenerIdentifier != "string" || typeof listener != "function") {
            return console.log('Listener identifier must be a string and listener must be a function.');
        }
        this.pulledMessageListeners[listenerIdentifier] = listener;
    }
    /**
     * Removes a listener to the pulled message store event
     * @param {String} listenerIdentifier 
     */
    offPulledMessageStored = (listenerIdentifier) => {
        this.pulledMessageListeners[listenerIdentifier] = undefined;
        delete this.pulledMessageListeners[listenerIdentifier];
    }

    // -------------------------------- Modifiers -------------------------------- //

    /**
     * Marks all messages in a conversation as read
     * @param {String} conversationId
     */
    markConversationMessagesAsRead = (conversationId) => {
        localDb.update({
            recipient: this.mountedUser.userId,
            chatRoomRef: conversationId,
        }, {
            $set: { isRead: true },
        }, {
            multi: true,
        });
    }
    /**
     * Stores a message created locally to the storage
     * @param {Object} messageDoc
     * @param {Function} callback: (err, storedDoc)
     */
    storeLocallyCreatedMessage = (messageDoc, callback) => {
        localDb.insert(messageDoc, callback);
    }
    /**
     * Deletes a message from the store
     * @param {String} messageId: id of the message to delete
     * @param {Function} callback: (err, numRemoved)
     */
    deleteMessage = (messageId, callback) => {
        localDb.remove({
            recipient: this.mountedUser.userId,
            _id: messageId,
        }, callback);
    }
    /**
     * Deletes all messages in a conversation from the store
     * @param {String} conversationId: id of the conversation to delete messages from
     * @param {Function} callback: (err, numRemoved)
     */
    deleteConversationMessages = (conversationId, callback) => {
        localDb.remove({
            recipient: this.mountedUser.userId,
            chatRoomRef: conversationId,
        }, { multi: true }, callback);
    }

    // -------------------------------- Getters -------------------------------- //

    /**
     * Gets the unread message count for the current user
     * @returns total unread message count
     */
    getUnreadMessageCount = (callback) => {
        localDb.count({
            recipient: this.mountedUser.userId,
            $or: [{
                isRead: {$exists: false},
            }, {
                isRead: {$ne: true},
            }],
        }, callback);
    }
    /**
     * Gets the unread message count for the current user by room type
     * @param roomType: 'Direct' or 'Group'
     * @returns total unread message count
     */
    getUnreadMessageCountByRoomType = (roomType, callback) => {
        localDb.count({
            isDirectMessage: roomType == 'Direct',
            recipient: this.mountedUser.userId,
            $or: [{
                isRead: {$exists: false},
            }, {
                isRead: {$ne: true},
            }],
        }, callback);
    }
    /**
     * @param {[String]} conversationIds: the conversations to get unread counts for
     * @returns {{conversationId -> unreadCount}} - an object that maps conversationId to unreadCount
     */
    getUnreadMessageCountByConversations = (conversationIds, callback) => {
        if (!conversationIds.length) return callback(null, {});
        let unreadCountMap = {};
        let queryFiredCount = 0; // to ensure all db queries have fired before running callback
        conversationIds.forEach(conversationId => {
            localDb.count({
                recipient: this.mountedUser.userId,
                chatRoomRef: conversationId,
                $or: [{
                    isRead: {$exists: false},
                }, {
                    isRead: {$ne: true},
                }],
            }, (err, count) => {
                if (typeof count == "number") {
                    unreadCountMap[conversationId] = count;
                };

                // increment count and return if all queries have fired
                queryFiredCount++;
                if (queryFiredCount == conversationIds.length) {
                    callback(null, unreadCountMap);
                };
            });
        });
    }
    /**
     * Gets the latest messages for a conversation
     * @param {String} conversationId
     * @param {Number} limit
     * @param {Number} skip
     * @param {Function} callback: fn(err, docs)
     */
    getLatestMessagesByConversation = (conversationId, limit, skip, callback) => {
        localDb.find({
            recipient: this.mountedUser.userId,
            chatRoomRef: conversationId,
        }).sort({ created: -1 }).limit(limit).skip(skip).exec(callback);
    }
    /**
     * Gets all messages created after a specified message
     * @param conversationId
     * @param messageId
     * @param {Function} callback: fn(err, docs)
     */
    getAllMessagesAfterMessage = (conversationId, messageId, callback) => {
        localDb.findOne({
            _id: messageId
        }, (err, markerMessage) => {
            if (!markerMessage) {
                return callback(null, []);
            };
            const oldestDate = new Date(markerMessage.created);
            localDb.find({
                chatRoomRef: conversationId,
                recipient: this.mountedUser.userId,
                created: { $gte: oldestDate },
            }).sort({ created: -1 }).exec(callback);
        });
    }
    /**
     * Gets messages from a conversation within a date range 
     * @param {String} conversationId
     * @param {Date} startDate,
     * @param {Date} endDate
     * @param {Function} callback: fn(err, [Message])
     */
    getMessagesInTimestampRange = (conversationId, startDate, endDate, callback) => {
        localDb.find({
            recipient: this.mountedUser.userId,
            chatRoomRef: conversationId,
            created: { $gte: startDate, $lte: endDate },
        }).limit(DB_RESULTS_RESPONSE_CAP).sort({ created: -1 }).exec(callback);
    }
    /**
     * Gets a few messages before and after a specified marker message
     * @param conversationId
     * @param markerMessage
     * @param beforeAndAfterLimit
     * @param callback (error, [Message])
     */
    getMessagesBeforeAndAfterMarker = (conversationId, markerMessage, beforeAndAfterLimit, callback) => {
        const markerDate = new Date(markerMessage.created);
        localDb.find({
            recipient: this.mountedUser.userId,
            chatRoomRef: conversationId,
            $or: [{
                created: { $gte: markerDate },
            }, {
                _id: markerMessage._id,
            }],
        }).limit(DB_RESULTS_RESPONSE_CAP).sort({ created: 1 }).limit(beforeAndAfterLimit).exec((err, messagesAfter) => {
            if (err) {
                return callback(err);
            };
            localDb.find({
                recipient: this.mountedUser.userId,
                chatRoomRef: conversationId,
                created: { $lt: markerDate },
            }).limit(DB_RESULTS_RESPONSE_CAP).sort({ created: -1 }).limit(beforeAndAfterLimit).exec((err, messagesBefore) => {
                if (err) {
                    return callback(err);
                };
                callback(null, arrayUnique(messagesAfter.concat(messagesBefore)).sort((doc1, doc2) => doc2.created - doc1.created));
            });
        });
    }
    /**
     * Searches the last {@link DB_QUERY_RESULTS_CAP} messages in a conversation
     * @param {String} conversationId
     * @param {String} searchQuery
     * @param {Function} callback: fn(err, [Message])
     */
    searchMessagesInConversation = (conversationId, searchQuery, callback) => {
        if (searchQuery.length < FUSE_MESSAGE_SEARCH_OPTIONS.minMatchCharLength || searchQuery.length > FUSE_MESSAGE_SEARCH_OPTIONS.maxPatternLength) {
            return callback(
                new Error(`Search query must be between ${FUSE_MESSAGE_SEARCH_OPTIONS.minMatchCharLength} and ${FUSE_MESSAGE_SEARCH_OPTIONS.maxPatternLength} characters.`)
            );
        };
        localDb.find({
            recipient: this.mountedUser.userId,
            chatRoomRef: conversationId,
        }).sort({ created: -1 }).limit(DB_QUERY_RESULTS_CAP).exec((err, docs) => {
            if (err) {
                return callback(err);
            };
            const fuseSearch = new Fuse(docs, FUSE_MESSAGE_SEARCH_OPTIONS);
            callback(null, fuseSearch.search(searchQuery));
        });
    }

    // -------------------------------- Private -------------------------------- //

    /**
     * Handles incoming messages from socketio
     * @param data: the incoming message from socketio
     */
    _onIncomingMessage = (data) => {
        const { messageAckId, messageDoc, senderName, chatRoomName, chatRoomType, chatRoomPicture } = data.data;
        // store message doc
        localDb.insert(this._transformMessageForLocalStorage(messageDoc), (err) => {
            // if error, the message will go to the server's message queue and we can try reinserting on a later pull
            if (err) return;
            // ack message if no error
            LiveChatService.emitEvent(
                OUTGOING_EVENT_NAMES.ackMessage,
                { messageAckId },
                (resp) => {
                    if (resp.error) {
                        console.log(`${DEBUG_KEY} Error ack'ing message: ${resp.message}`, messageDoc);
                    };
                }
            );
            // fire listeners to this event
            const listeners = Object.values(this.incomingMessageListeners);
            for (let listener of listeners) {
                if (typeof listener != "function") continue;
                try {
                    listener(data.data);
                } catch(e) {
                    console.log(
                        `${DEBUG_KEY}: Error running incomingMessage listener`,
                        e
                    );
                };
            };
        })
    }
    /**
     * Poll the server's message queue in case the LiveChatService experiences interruptions and some messages end up in the queue
     */
    _beginMessageQueuePolling = () => {
        const { authToken } = this.mountedUser;
        this._pollMessageQueue(authToken);
        this._messageQueuePoller = setInterval(() => this._pollMessageQueue(authToken), MESSAGE_QUEUE_POLLING_INTERVAL_SECONDS * 1000);
    }
    _resetAppNotificationsBadge = () => {
        const { authToken } = this.mountedUser;
        API.get('secure/notification/entity/unread-count', authToken).then(res => {
            if (res.status === 200) {
                let notiCount = parseInt(res.count);
                notiCount = isNaN(notiCount) ? 0 : notiCount;
                Notifications.setBadgeNumberAsync(notiCount);
                return;
            };
            Notifications.setBadgeNumberAsync(0);
        }).catch(err => Notifications.setBadgeNumberAsync(0));
    }
    _pollMessageQueue = (authToken) => {
        this._pullMessageQueueRequest(authToken).then(resp => {
            if (resp.status == 200) {
                const messages = resp.data;
                // Update app badge count now that we've pulled from message queue
                // if (messages.length) {
                    this._resetAppNotificationsBadge();
                // };
                messages.forEach(messageDoc => {
                    localDb.insert(this._transformMessageForLocalStorage(messageDoc), (err) => {
                        if (err) return;
                        // fire listeners to this event
                        const listeners = Object.keys(this.pulledMessageListeners);
                        for (let listener of listeners) {
                            if (typeof listener != "function") continue;
                            try {
                                listener(resp.data);
                            } catch(e) {
                                console.log(
                                    `${DEBUG_KEY}: Error running incomingMessage listener`,
                                    e
                                );
                            };
                        };
                    });
                });
            };
        }).catch(err => { /* We tried */ });
    }
    /**
     * Stops the message queue polling
     * To be called when the user is unmounted
     */
    _endMessageQueuePolling = () => {
        clearInterval(this._messageQueuePoller);
    }
    /**
     * Creates a promise requesting to pull the server's message queue
     * @param {String} authToken 
     * @param {Number} maybeLimit 
     * @returns [Promise]
     */
    _pullMessageQueueRequest = (authToken, maybeLimit) => {
        let body = {};
        if (maybeLimit) {
            body.limit = maybeLimit;
        };
        return API.post(`secure/chat/message/queue/pull`, body, authToken, 4);
    }

    /**
     * Transforms a message for local storage
     * @param {Object} messageDoc 
     * @return {Message}
     */
    _transformMessageForLocalStorage = (messageDoc) => {
        let transformedDoc = { ...messageDoc };
        transformedDoc.created = new Date(transformedDoc.created);
        if (messageDoc.isSystemMessage || messageDoc.creator == this.mountedUser.userId) {
            transformedDoc.isRead = true;
        };
        return transformedDoc;
    }
}

export default new MessageStorageService();