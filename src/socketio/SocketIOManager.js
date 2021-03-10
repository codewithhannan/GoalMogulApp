/** @format */

import SocketIOClient from 'socket.io-client'
import getEnvVars from '../../environment'

const SERVER_URL = getEnvVars().socketIOUrl
const SOCKET_CONFIG = {
    transports: ['websocket'],
    jsonp: false,
    reconnectionAttempts: Infinity, // just in case default behavior changes
    autoConnect: true, // same as above
}
const DEBUG_KEY = '[SOCKET_IO_MANAGER]'

class SocketIOManager {
    isInitialized = false
    socketManager = null
    tasksOnSocketConnect = {} // these fire on connect and reconnect
    socketsByNamespace = {}

    /**
     * Initializes the manager. Must be called for other methods to work.
     */
    initialize() {
        this.socketManager = new SocketIOClient.Manager(
            SERVER_URL,
            SOCKET_CONFIG
        )
        this.socketManager.on('reconnect', () => {
            const tasksToRun = Object.values(this.tasksOnSocketConnect)
            for (let task of tasksToRun) {
                if (typeof task != 'function') {
                    continue
                }
                try {
                    task()
                } catch (e) {
                    console.log(
                        `${DEBUG_KEY}: Error running task with name: ${taskName}`,
                        e
                    )
                }
            }
        })
        this.socketManager.on('connect_error', (err) => {
            console.log(`${DEBUG_KEY}: Error connecting SocketIO`, err)
        })
        this.isInitialized = true
    }

    /**
     * Establishes a socket with the given namespace
     * @param {String} nsp: namespace to join
     * @return {Socket}
     */
    initializeNamespaceAndGet(nsp) {
        if (!this.isInitialized)
            throw new Error('Must initialize socket manager first.')
        if (!this.socketsByNamespace[nsp]) {
            this.socketsByNamespace[nsp] = this.socketManager.socket(
                nsp,
                SOCKET_CONFIG
            )
        }
        return this.socketsByNamespace[nsp]
    }
    /**
     * Gets a socket
     * @param {Optional:String} maybeNsp - to get a socket specific to a namespace
     * @return {Socket}
     */
    getSocket(maybeNsp) {
        if (!this.isInitialized)
            throw new Error('Must initialize socket manager first.')
        if (maybeNsp) {
            return this.socketsByNamespace[maybeNsp]
        } else {
            return this.socketManager
        }
    }
    /**
     * Reconnects a socket if disconnected and returns it
     * @param {Optional:String} maybeNsp - to specify a namespace within the socket
     * @return {Socket}
     */
    reconnectSocketAndGet(maybeNsp) {
        if (!this.isInitialized)
            throw new Error('Must initialize socket manager first.')
        let socket = maybeNsp
            ? this.socketsByNamespace[maybeNsp]
            : this.socketManager
        if (socket && !socket.connected) {
            socket.connect()
        }
        return socket
    }
    /**
     * Adds a task to fire when the socket connects or reconnects
     * @param {Object} taskPayload: {taskName:String, task:Function(connectedSocket)}
     * @param {Optional:String} maybeNsp: to pass in a namespaced socket when calling the task
     */
    addTaskToOnConnect(taskPayload, maybeNsp) {
        if (!this.isInitialized)
            throw new Error('Must initialize socket manager first.')
        const { taskName, task } = taskPayload
        if (typeof taskName != 'string' || typeof task != 'function') {
            throw new Error(
                'taskPayload must contain a taskName string and a task function'
            )
        }
        let socket = this.socketManager
        if (maybeNsp) {
            socket = this.socketsByNamespace[maybeNsp]
        }
        this.tasksOnSocketConnect[taskName] = () => task(socket)
    }
    /**
     * Removes a task that was originally queued to fire on a connection or reconnection event
     * @param {String} taskName
     */
    removeTaskFromOnConnect(taskName) {
        this.tasksOnSocketConnect[taskName] = undefined
        delete this.tasksOnSocketConnect[taskName]
    }
}

const managerInstance = new SocketIOManager()

export default managerInstance
