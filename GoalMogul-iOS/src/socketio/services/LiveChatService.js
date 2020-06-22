/** @format */

import SocketIOManager from '../SocketIOManager'

const CHAT_NAMESPACE = '/chat'
const DEBUG_KEY = '[ LiveChatService ]'

class LiveChatService {
    socket = null
    eventListenerMap = {}
    isInitialized = false
    isUserMounted = false
    mountedUser = {
        userId: null,
        authToken: null,
    }
    oneUserMountedListeners = []

    /**
     * Initializes the service
     * @requires {@link SocketIOManager#initialize} to be called before this can run
     */
    initialize() {
        this.socket = SocketIOManager.initializeNamespaceAndGet(CHAT_NAMESPACE)
        this.isInitialized = true
    }

    /**
     * Mounts a user onto the service for credential use
     * @param {Object} userState: {userId, authToken}
     */
    mountUser(userState) {
        const { authToken } = userState
        this.socket.emit(
            OUTGOING_EVENT_NAMES.authenticate,
            { authToken },
            (resp) => {
                console.log(DEBUG_KEY, resp)
                if (resp.success) {
                    this.isUserMounted = true
                    this.mountedUser = userState
                    this.oneUserMountedListeners.forEach((listener) => {
                        try {
                            listener()
                        } catch (e) {
                            console.log(
                                `${DEBUG_KEY}: Error firing oneUserMounted listener`,
                                e
                            )
                        }
                    })
                } else {
                    console.log(
                        `${DEBUG_KEY}: Error mounting user with authToken: ${authToken}`,
                        resp.message
                    )
                }
            }
        )
    }
    /**
     * Unmounts the currently mounted user
     */
    unMountUser() {
        this.isUserMounted = false
        this.mountedUser = {
            authToken: null,
            userId: null,
        }
    }
    /**
     * Fires listener once when a user has been mounted
     * @param {Function} listener : one-time listener fired when a user is mounted
     */
    oneUserMounted(listener) {
        if (this.isUserMounted) {
            listener()
        } else {
            this.oneUserMountedListeners.push(listener)
        }
    }

    /**
     * Emits an event via socket
     * @param {String} eventName: the name of the event to emit
     * @param {Object} data: the data to emit
     * @param {Function} onResponse: the function to handle the server's response
     */
    emitEvent(eventName, data, onResponse) {
        if (!this.isUserMounted)
            return console.log('Must initialize live chat service first.')
        const authToken = this.mountedUser.authToken
        this.socket.emit(eventName, { ...data, authToken }, onResponse)
    }

    /**
     * Emits data to a specified event when the socket connects/reconnects
     * @param {String} identifier: a unique identifier for this emission task
     * @param {String} eventName: the event to emit to
     * @param {Object} data: the data to emit
     * @param {Function} onResponse: to handle the server's response
     */
    emitOnConnect(identifier, eventName, data, onResponse) {
        if (!this.isUserMounted)
            return console.log('Must initialize live chat service first.')
        const authToken = this.mountedUser.authToken
        SocketIOManager.addTaskToOnConnect(
            {
                taskName: identifier,
                task(socket) {
                    socket.emit(eventName, { ...data, authToken }, onResponse)
                },
            },
            CHAT_NAMESPACE
        )
    }
    /**
     * Cancels an emission task queued to fire on socket connect/reconnect
     * @param {String} identifier: the unique identifier for the emission task
     */
    cancelEmitOnConnect(identifier) {
        if (!this.isInitialized)
            return console.log('Must initialize live chat service first.')
        SocketIOManager.removeTaskFromOnConnect(identifier)
    }

    /**
     * Adds a listener to an event
     * @param {String} eventName: The event to listen to
     * @param {String} listenerIdentifier: A unique identifier for this listener
     * @param {Function} listener: The function to fire when the event occurs
     */
    addListenerToEvent(eventName, listenerIdentifier, listener) {
        if (!this.isInitialized)
            return console.log('Must initialize live chat service first.')
        if (!this.eventListenerMap[eventName]) {
            this._initializeListenerForEvent(eventName)
        }
        this.eventListenerMap[eventName][listenerIdentifier] = listener
    }
    /**
     * Removes a listener from an event
     * @param {String} eventName: The event to listen to
     * @param {String} listenerIdentifier: A unique identifier for this listener
     */
    removeListenerFromEvent(eventName, listenerIdentifier) {
        if (!this.isInitialized)
            return console.log('Must initialize live chat service first.')
        this.eventListenerMap[eventName][listenerIdentifier] = undefined
        delete this.eventListenerMap[eventName][listenerIdentifier]
    }
    /**
     * Private method to initialize the socket listeners for an event
     * @param eventName
     * NOTE: We are currently assuming that reconnecting doesn't affect the registered socket.on's
     */
    _initializeListenerForEvent(eventName) {
        if (!this.isInitialized)
            return console.log('Must initialize live chat service first.')
        this.eventListenerMap[eventName] = {}
        this.socket.on(eventName, (...args) => {
            const listeners = Object.values(this.eventListenerMap[eventName])
            for (let listener of listeners) {
                if (typeof listener != 'function') continue
                try {
                    listener(...args)
                } catch (e) {
                    console.log(
                        `${DEBUG_KEY}: Error running listener for event: '${eventName}'`,
                        e
                    )
                }
            }
        })
    }
}

export default new LiveChatService()
export const INCOMING_EVENT_NAMES = {
    incomingMessage: 'incomingmessage',
    typingIndicator: 'typingindicator',
}
export const OUTGOING_EVENT_NAMES = {
    authenticate: 'authenticate',
    ackMessage: 'ackmessage',
    joinRoom: 'joinroom',
    leaveRoom: 'leaveroom',
    updateTypingStatus: 'updatetypingstatus',
}
