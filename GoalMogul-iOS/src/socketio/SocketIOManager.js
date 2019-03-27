import SocketIOClient from 'socket.io-client';
import { config } from '../redux/middleware/api/config';

const SERVER_URL = config.socketIOUrl;

const DEBUG_KEY = '[SOCKET_IO_MANAGER]';

class SocketIOManager {
    isInitialized = false;
    socket = null;
    tasksOnSocketConnect = {}; // these fire on connect and reconnect
    socketsByNamespace = {};

    /**
     * Initializes the manager. Must be called for other methods to work.
     */
    initialize() {
        this.socket = SocketIOClient(SERVER_URL, {
            transports: ['websocket'],
            jsonp: false,
            reconnectionAttempts: Infinity, // just in case default behavior changes
            autoConnect: true, // same as above
        });
        this.socket.on('connect', () => {
            const tasksToRun = this.tasksOnSocketConnect;
            for (let taskName in tasksToRun) {
                if (typeof tasksToRun[taskName] != "function") {
                    continue;
                };
                try {
                    tasksToRun[taskName]();
                } catch (e) {
                    console.log(`${DEBUG_KEY}: Error running task with name: ${taskName}`, e);
                };
            };
        });
        this.socket.on('connect_error', (err) => {
            console.log(`${DEBUG_KEY}: Error connecting SocketIO`, err);
        });          
        this.isInitialized = true;
    }

    /**
     * Establishes a socket with the given namespace
     * @param {String} nsp: namespace to join
     * @return {Socket}
     */
    initializeNamespaceAndGet(nsp) {
        if (!this.isInitialized) throw new Error('Must initialize socket manager first.');
        if (!this.socketsByNamespace[nsp]) {
            this.socketsByNamespace[nsp] = this.socket(nsp);
        };
        return this.socketsByNamespace[nsp];
    }
    /**
     * Gets a socket
     * @param {Optional:String} maybeNsp - to get a socket specific to a namespace
     * @return {Socket}
     */
    getSocket(maybeNsp) {
        if (!this.isInitialized) throw new Error('Must initialize socket manager first.');
        if (maybeNsp) {
            return this.socketsByNamespace[maybeNsp];
        } else {
            return this.socket;
        };
    }
    /**
     * Reconnects a socket if disconnected and returns it
     * @param {Optional:String} maybeNsp - to specify a namespace within the socket
     * @return {Socket}
     */
    reconnectSocketAndGet(maybeNsp) {
        if (!this.isInitialized) throw new Error('Must initialize socket manager first.');
        let socket = maybeNsp ? this.socketsByNamespace[maybeNsp] : this.socket;
        if (socket && !socket.connected) {
            socket.connect();
        };
        return socket;
    }
    /**
     * Adds a task to fire when the socket connects or reconnects
     * @param {Object} taskPayload: {taskName:String, task:Function(connectedSocket)}
     * @param {Optional:String} maybeNsp: to pass in a namespaced socket when calling the task
     */
    addTaskToOnConnect(taskPayload, maybeNsp) {
        if (!this.isInitialized) throw new Error('Must initialize socket manager first.');
        const { taskeName, task } = taskPayload;
        if (typeof taskeName != "string" || typeof task != "function") {
            throw new Error('taskPayload must contain a taskName string and a task function');
        };
        let socket = this.socket;
        if (maybeNsp) {
            socket = this.socketsByNamespace[maybeNsp];
        };
        this.tasksOnSocketConnect[taskeName] = () => task(socket);
    }
    /**
     * Removes a task that was originally queued to fire on a connection or reconnection event
     * @param {String} taskName
     */
    removeTaskFromOnConnect(taskName) {
        this.tasksOnSocketConnect[taskeName] = undefined;
        delete this.tasksOnSocketConnect[taskeName];
    }
};

const managerInstance = new SocketIOManager();

export default managerInstance;