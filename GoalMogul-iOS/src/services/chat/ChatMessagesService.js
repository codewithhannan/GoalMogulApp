import { default as LiveChatService, INCOMING_EVENT_NAMES, OUTGOING_EVENT_NAMES } from '../../socketio/services/LiveChatService';
import MongoDatastore from 'react-native-local-mongodb';
import { api as API } from '../../redux/middleware/api';

const LISTENER_BASE_IDENTIFIER = 'chatmessageservice';
const CHAT_MESSAGES_COLLECTION_NAME = 'chatmessages';
const DEBUG_KEY = '[ChatMessagesService]';
const MESSAGE_QUEUE_POLLING_INTERVAL_SECONDS = 3;

// a collection for storing ChatMessage documents (as defined by the api models)
const localDb = new MongoDatastore({ filename: CHAT_MESSAGES_COLLECTION_NAME, autoload: true });
// index the fields we will most commonly query by
localDb.ensureIndex({ fieldName: 'chatRoomRef' });
localDb.ensureIndex({ fieldName: 'recipient' });

class ChatMessagesService {
    isInitialized = false;
    isUserMounted = false;
    mountedUser = {
        userId: null,
        authToken: null,
        user: null,
    };

    /**
     * Initializes the service
     * @requires {@link LiveChatService#initialize} to be called before this can run
     */
    initialize() {
        // listen to incoming messages
        LiveChatService.addListenerToEvent(
            INCOMING_EVENT_NAMES.incomingMessage,
            `${LISTENER_BASE_IDENTIFIER}:${INCOMING_EVENT_NAMES.incomingMessage}`,
            this.onIncomingMessage.bind(this)
        );
        this.isInitialized = true;
    }

    /**
     * Mounts a user onto the service for credential use
     * @param {Object} userState: {userId, authToken, user}
     */
    mountUser(userState) {
        const { authToken } = userState;
        this._pullMessageQueue(authToken).then(resp => {
            if (resp.status == 200) {
                this.isUserMounted = true;
                this.mountedUser = userState;
                const messages = resp.data;
                messages.forEach(messageDoc => {
                    localDb.insert(messageDoc);
                });
                this._beginMessageQueuePolling();
            } else {
                console.log(`${DEBUG_KEY}: Error mounting user with authToken: ${authToken}`, resp.message);
            }
        }).catch(err => {
            console.log(`${DEBUG_KEY}: Error mounting user with authToken: ${authToken}`, err);
        });
    }
    /**
     * Unmounts the currently mounted user
     */
    unMountUser() {
        this._endMessageQueuePolling();
        this.isUserMounted = false;
        this.mountUser = {
            authToken: null,
            userId: null,
            user: null,
        };
    }

    onIncomingMessage = (data) => {
        const { messageAckId, messageDoc, senderName, chatRoomName } = data.data;
        // ack message
        // store message doc
    }

    /**
     * Poll the server's message queue in case the LiveChatService experiences interruptions and some messages end up in the queue
     */
    _beginMessageQueuePolling() {
        const { authToken } = this.mountedUser;
        this._messageQueuePoller = setInterval(() => {
            this._pullMessageQueue(authToken).then(resp => {
                if (resp.status == 200) {
                    const messages = resp.data;
                    messages.forEach(messageDoc => {
                        localDb.insert(messageDoc);
                    });
                };
            }).catch(err => {
                /* We tried */
            });
        }, MESSAGE_QUEUE_POLLING_INTERVAL_SECONDS * 1000);
    }
    /**
     * Stops the message queue polling
     * To be called when the user is unmounted
     */
    _endMessageQueuePolling() {
        clearInterval(this._messageQueuePoller);
    }
    /**
     * Creates a promise requesting to pull the server's message queue
     * @param {String} authToken 
     * @param {Number} maybeLimit 
     * @returns [Promise]
     */
    _pullMessageQueue(authToken, maybeLimit) {
        let body = {};
        if (maybeLimit) {
            body.limit = maybeLimit;
        };
        return API.post(`secure/chat/message/queue/pull`, body, authToken);
    }
}

const serviceInstance = new ChatMessagesService();
export default serviceInstance;