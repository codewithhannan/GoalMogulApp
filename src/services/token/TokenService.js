/** @format */

/**
 * This is a singleton service that maintains the authToken and refreshToken
 *
 * Design is at: https://docs.google.com/document/d/1Z1b1wyOR8Oqy77GhRCwWNGbxIUYllDvUjCVz8cca-ew/edit?usp=sharing
 *
 * @format
 */

import _ from 'lodash'
import getEnvVars from '../../../environment'
import * as SecureStore from 'expo-secure-store'

import { Logger } from '../../redux/middleware/utils/Logger'
import { store } from '../../store'
import { logout } from '../../actions'
import AsyncStorage from '@react-native-async-storage/async-storage'

const config = getEnvVars()
const EMPTY_TOKEN_OBJECT = {
    token: undefined,
    createdAt: undefined,
    accountOnHold: undefined,
}
const DAY_IN_MS = 24 * 60 * 60 * 1000
const TOKEN_EXPIRATION_COMPENSATION_IN_MS = 5 * 60 * 1000 // 5 minute token refresh compensation
const AUTH_TOKEN_EXPIRE_DAYS_IN_MS = 2 * DAY_IN_MS // auth token expires in 2 days
const REFRESH_TOKEN_EXPIRE_DAYS_IN_MS = 30 * DAY_IN_MS // refresh token expires in 30 days
const AUTH_TOKEN_SHOULD_REFRESH_TIME_TO_EXPIRE_IN_MS = 4 * 60 * 60 * 1000 // refresh auth token when it's 4 hrs to expiration
const CREDENTIAL_KEY_PREFIX = 'credential'
const CREDENTIAL_TYPE_SUFFIX_REFRESH = '_refresh_token'
const CREDENTIAL_TYPE_SUFFIX_AUTH = '_refresh_auth'
const TOKEN_TYPE = {
    auth: 'auth',
    refresh: 'refresh',
}

class TokenService {
    constructor() {
        if (!TokenService.instance) {
            this._userId = undefined
            this._isRefreshingAuthToken = false
            this._isRefreshingRefreshToken = false
            this._authTokenObject = { ...EMPTY_TOKEN_OBJECT }
            this._refreshTokenObject = { ...EMPTY_TOKEN_OBJECT }
            this._pendingAuthTokenQueue = []
            this._pendingRefreshTokenRequest = undefined
            this._isUnmounting = undefined
            TokenService.instance = this
        }

        return TokenService.instance
    }

    /*************** Internal facing APIs ****************/
    static getCredentialKey(type) {
        switch (type) {
            case TOKEN_TYPE.auth:
                return CREDENTIAL_KEY_PREFIX + CREDENTIAL_TYPE_SUFFIX_AUTH
            case TOKEN_TYPE.refresh:
                return CREDENTIAL_KEY_PREFIX + CREDENTIAL_TYPE_SUFFIX_REFRESH
            default:
                return null
        }
    }

    /**
     * Get token object from SecureStore
     * @param {String} type ['refresh', 'auth']
     * @return {Object} { token, createdAt, userId } for authToken, { token, createdAt, userId, isOnboarded } for refreshToken
     * null if none existed
     */
    async _getTokenFromSecureStore(type) {
        const key = TokenService.getCredentialKey(type)

        try {
            // const credentialJsonString = await SecureStore.getItemAsync(key)
            const credentialJsonString = await AsyncStorage.getItem(key)

            return JSON.parse(credentialJsonString)
        } catch (err) {
            // Best effort. Worst case scenario user needs to re-login
            // TODO: sentry error logging
            return
        }
    }

    /**
     * This method chooses to persist with one type of token per key.
     * The reason is that the smaller the item to persist, the faster
     * the load time is.
     * @param {String} type ['refresh', 'auth']
     * @param {Object} tokenObject
     */
    async _storeTokenToSecureStore(type, tokenObject) {
        const key = TokenService.getCredentialKey(type)
        const value = JSON.stringify({
            ...tokenObject,
        })

        try {
            // await SecureStore.setItemAsync(key, value, {})
            await AsyncStorage.setItem(key, value)
        } catch (err) {
            // Best effort. Worst case scenario user needs to re-login
            // TODO: sentry error logging
        }
    }

    /**
     * Delete both auth token and refresh token from the SecureStore
     */
    async _removeTokenFromSecureStore() {
        await this._removeTokenFromSecureStoreByType(TOKEN_TYPE.auth)
        await this._removeTokenFromSecureStoreByType(TOKEN_TYPE.refresh)
    }

    async _removeTokenFromSecureStoreByType(type) {
        Logger.log(
            '[TokenService] [_removeTokenFromSecureStoreByType] start removing type: ',
            type,
            1
        )
        const key = TokenService.getCredentialKey(type)

        try {
            // await SecureStore.deleteItemAsync(key)
            await AsyncStorage.removeItem(key)
        } catch (err) {
            // Best effort. Worst case scenario user needs to re-login
            // TODO: sentry error logging
            Logger.log(
                '[TokenService] [_removeTokenFromSecureStoreByType] error removing type: ',
                type,
                1
            )
        }
        Logger.log(
            '[TokenService] [_removeTokenFromSecureStoreByType] finish removing type: ',
            type,
            1
        )
    }

    async _purgeRefreshTokenBeforeUse() {
        this._refreshTokenObject = { ...EMPTY_TOKEN_OBJECT }
        await this._removeTokenFromSecureStoreByType(TOKEN_TYPE.refresh)
    }

    /**
     * Process pending request queue after AuthToken is refreshed
     * @param {*} error
     * @param {*} token
     */
    _processPendingAuthTokenRequests(error, token) {
        this._pendingAuthTokenQueue.forEach((prom) => {
            if (error) {
                prom.reject(error)
            } else if (this._isUnmounting) {
                prom.reject(new Error('Unmounting the service'))
            } else {
                prom.resolve(token)
            }
        })
        this._pendingAuthTokenQueue = []
    }

    /**
     * Refresh auth token
     * Nice to have: next step is to add retry for refreshing auth token
     */
    async _refreshAuthToken(shouldAutoLogout) {
        console.log('[_refreshAuthToken] start refreshing auth token')
        // Check and set isRefreshingAuthToken to true
        if (!this._isRefreshingAuthToken) {
            this._isRefreshingAuthToken = true
        } else {
            // _refreshAuthToken is already running
            console.log(
                '[_refreshAuthToken] _refreshAuthToken is already running'
            )
            return
        }

        // Get refresh token
        const refreshTokenObject = await this.checkAndGetValidRefreshToken()
        if (!refreshTokenObject) {
            // TODO: sentry logging
            this._isRefreshingAuthToken = false
            return this._processPendingAuthTokenRequests(
                new Error('Failed to obtain refreshToken'),
                undefined
            )
        }

        const { token: refreshToken, userId } = _.cloneDeep(refreshTokenObject)
        console.log('[_refreshAuthToken] Start purging refresh token')
        // Before sending the request, we need to purge the refreshToken to incide it's used
        await this._purgeRefreshTokenBeforeUse()
        console.log('[_refreshAuthToken] Finish purging refresh token')

        // Prepare url and body
        const url = `${config.url}pub/user/refresh-tokens`
        const body = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                refreshToken,
            }),
        }

        // Send request
        let resp
        try {
            resp = await fetch(url, body).then((res) => res.json())
            Logger.log(
                '[TokenService] [_refreshAuthToken] response is: ',
                resp,
                1
            )
        } catch (err) {
            // TODO: sentry logging
            this._processPendingAuthTokenRequests(err, undefined)
            this._isRefreshingAuthToken = false
            Logger.log(
                '[TokenService] [_refreshAuthToken] failed to refresh authToken with err ',
                err,
                1
            )
            return
        }

        // Process response. As long as both token exist, this request is successful
        if (resp.token && resp.refreshToken) {
            // On Success, persist new token pair in both cache and storage
            await this.populateAndPersistToken(
                resp.token,
                resp.refreshToken,
                undefined,
                userId
            )
            // Then process the request
            this._processPendingAuthTokenRequests(undefined, resp.token)
        } else {
            // On Error, notify the requests waiting for the auth token
            this._processPendingAuthTokenRequests(
                new Error('Failed to obtain authToken'),
                undefined
            )

            if (shouldAutoLogout) {
                // Logout user since they have no refresh valid token to use
                // Assuming this endpoit shouldn't fail
                await store.dispatch(logout())
            }
        }

        // Set the refreshing to false after the token is updated in cache so that no double
        // triggering of refreshAuthToken function
        this._isRefreshingAuthToken = false
    }

    /*************** Public facing APIs ****************/

    /**
     * Obtain the auth token for a request
     */
    async getAuthToken(shouldAutoLogout = true) {
        // Check and get if has valid auth token
        const authTokenObject = await this.checkAndGetValidAuthToken()
        if (authTokenObject) {
            // Trigger auth token refresh when it's x hrs from expiration
            if (
                authTokenObject.createdAt + AUTH_TOKEN_EXPIRE_DAYS_IN_MS <=
                Date.now() + AUTH_TOKEN_SHOULD_REFRESH_TIME_TO_EXPIRE_IN_MS
            ) {
                this._refreshAuthToken(shouldAutoLogout)
            }
            return authTokenObject.token
        }

        // Check if refreshing auth token
        if (!this._isRefreshingAuthToken) {
            try {
                this._refreshAuthToken(shouldAutoLogout)
            } catch (err) {
                // TODO: sentry logging
                Logger.log(
                    '[TokenService] [_getAuthToken]: exception thrown in _refreshAuthToken',
                    err,
                    1
                )
                // Best effort
            }
        }

        // Create a promise and place into queue
        return new Promise((resolve, reject) => {
            Logger.log(
                '[TokenService] [getAuthToken] Push request to pendingAuthTokenQueue',
                null,
                4
            )
            this._pendingAuthTokenQueue.push({ resolve, reject })
        })
    }

    /**
     * Unmount user when user logs out
     */
    async unmountUser() {
        Logger.log(
            '[TokenService] [unmountUser] Start unmount user',
            this._userId,
            1
        )
        // clear processing queue
        this._isUnmounting = new Promise((res, rej) => {
            this._processPendingAuthTokenRequests(new Error('User unmounting'))
            res()
        })

        // Wait to clear in flight requests
        await this._isUnmounting

        // remove cache
        this._authTokenObject = { ...EMPTY_TOKEN_OBJECT }
        this._refreshTokenObject = { ...EMPTY_TOKEN_OBJECT }
        Logger.log(
            '[TokenService] [unmountUser] refreshTokenObject in cache is now',
            this._refreshTokenObject,
            1
        )

        // remove credential from local storage
        await this._removeTokenFromSecureStore()

        this._userId = undefined
        Logger.log(
            '[TokenService] [unmountUser] Successfully unmount user',
            this._userId,
            1
        )
    }

    /**
     * Mount a user
     */
    mountUser(userId) {
        this._userId = userId
        Logger.log(
            '[TokenService] [mountUser] Successfully mount user',
            this._userId,
            1
        )
    }

    /**
     * Populate cache and persist the tokens to SecureStore
     * There is no need to wait since cache will be set and used
     * @param {String} authToken
     * @param {String} refreshToken
     * @param {Boolean} isOnboarded
     */
    async populateAndPersistToken(
        authToken,
        refreshToken,
        isOnboarded,
        userId,
        accountOnHold
    ) {
        let userIdToUse = userId || this._userId

        // This is to prevent the case that this._userId is mounted but lost when
        // app is closed or other edge case. We can always recover from the SecureStore
        // If still not found, user needs to re-login
        if (!userIdToUse) {
            const loadedRefreshTokenObject = await this._getTokenFromSecureStore(
                TOKEN_TYPE.refresh
            )
            if (!_.get(loadedRefreshTokenObject, 'userId')) {
                return store.dispatch(logout())
            }
            userIdToUse = loadedRefreshTokenObject.userId
        }

        // createdAt is set to 5 minutes ago arbitrarily
        const createdAt = Date.now() - TOKEN_EXPIRATION_COMPENSATION_IN_MS
        if (authToken) {
            const authTokenObject = {
                token: authToken,
                createdAt,
                isOnboarded,
                userId: userIdToUse,
                accountOnHold: accountOnHold,
            }
            // Replace the authToken in cache
            this._authTokenObject = authTokenObject

            // Persist in secure store
            await this._storeTokenToSecureStore(
                TOKEN_TYPE.auth,
                authTokenObject
            )
            Logger.log(
                '[TokenService] [populateAndPersistToken] persisted authTokenObject: ',
                authTokenObject,
                1
            )
        }

        if (refreshToken) {
            const refreshTokenObject = {
                token: refreshToken,
                createdAt,
                isOnboarded,
                userId: userIdToUse,
                accountOnHold: accountOnHold,
            }
            // Replace the refreshToken in cache
            this._refreshTokenObject = refreshTokenObject

            // Persist in secure store
            await this._storeTokenToSecureStore(
                TOKEN_TYPE.refresh,
                refreshTokenObject
            )
            Logger.log(
                '[TokenService] [populateAndPersistToken] persisted refreshTokenObject: ',
                refreshTokenObject,
                1
            )
        }
    }

    /**
     * Check and get valid auth token
     *
     * @return {null} if no valid auth token object. Otherwise { token, userId, createdAt }
     */
    async checkAndGetValidAuthToken() {
        // First try to check from cache
        const tokenObject = this._authTokenObject

        // Logger.log(
        //     '[TokenService] [checkAndGetValidAuthToken] authTokenObject loaded from cache is ',
        //     tokenObject,
        //     1
        // )
        if (
            tokenObject &&
            _.get(tokenObject, 'token') &&
            _.get(tokenObject, 'createdAt')
        ) {
            if (
                tokenObject.createdAt >
                Date.now() - AUTH_TOKEN_EXPIRE_DAYS_IN_MS
            ) {
                // if token exists in cache, then should be userId
                return tokenObject
            }
            // cache has the token but it expired
            // it shouldn't load from SecureStore
            // it should refresh right away
            return null
        }

        // If cache has no such token, then try to load from SecureStore
        const authTokenObject = await this._getTokenFromSecureStore(
            TOKEN_TYPE.auth
        )
        Logger.log(
            '[TokenService] [checkAndGetValidAuthToken] authTokenObject loaded from SecureStore is ',
            authTokenObject,
            1
        )
        if (
            authTokenObject &&
            _.get(authTokenObject, 'token') &&
            _.get(authTokenObject, 'createdAt') &&
            authTokenObject.createdAt >
                Date.now() - AUTH_TOKEN_EXPIRE_DAYS_IN_MS
        ) {
            // populate cache if valid auth token
            this._authTokenObject = authTokenObject
            return this._authTokenObject
        }

        return null
    }

    /**
     * Get if user is onboarded. Boolean check on if user is onboarded stored
     * in refreshTokenObject. Hence as long as user is logged in, we are able
     * to obtain if user is onboarded
     */
    async getIfUserOnboarded() {
        const refreshTokenObject = await this.checkAndGetValidRefreshToken()
        if (!refreshTokenObject) {
            return false
        }

        return refreshTokenObject.isOnboarded
    }

    /**
     * Mark user as onboarded and persist such information in refreshTokenObject
     */
    async markUserAsOnboarded() {
        let refreshTokenObject = await this.checkAndGetValidRefreshToken()
        if (refreshTokenObject == null) {
            // Best effort. Something must have gone wrong
            return
        }

        if (refreshTokenObject.isOnboarded) {
            // No action needed
            return
        }

        refreshTokenObject = _.set(refreshTokenObject, 'isOnboarded', true)
        this._refreshTokenObject = refreshTokenObject

        await this._storeTokenToSecureStore(
            TOKEN_TYPE.refresh,
            refreshTokenObject
        )
    }

    /**
     * Check and get valid refresh token. When user doesn't have a valid refresh token,
     * user needs to re-login
     *
     * @return {null} if no valid refresh token object. Otherwise { token, userId, createdAt }
     */
    async checkAndGetValidRefreshToken() {
        // First try to check from cache
        const tokenObject = this._refreshTokenObject
        Logger.log(
            '[TokenService] [checkAndGetValidRefreshToken] refreshTokenObject loaded from cache is ',
            tokenObject,
            1
        )
        if (
            tokenObject &&
            _.get(tokenObject, 'token') &&
            _.get(tokenObject, 'createdAt') &&
            _.get(tokenObject, 'userId')
        ) {
            if (
                tokenObject.createdAt >
                Date.now() - REFRESH_TOKEN_EXPIRE_DAYS_IN_MS
            ) {
                // if token exists in cache, then should be userId
                return tokenObject
            }
            // cache has the token but it expired
            // it shouldn't load from SecureStore
            // it should refresh right away
            return null
        }

        // Cache has no such token. Then it tries to load from SecureStore
        const refreshTokenObject = await this._getTokenFromSecureStore(
            TOKEN_TYPE.refresh
        )
        Logger.log(
            '[TokenService] [checkAndGetValidRefreshToken] refreshTokenObject loaded from SecureStore is ',
            refreshTokenObject,
            1
        )
        if (
            refreshTokenObject &&
            _.get(refreshTokenObject, 'token') &&
            _.get(refreshTokenObject, 'createdAt') &&
            _.get(refreshTokenObject, 'userId') &&
            refreshTokenObject.createdAt >
                Date.now() - REFRESH_TOKEN_EXPIRE_DAYS_IN_MS
        ) {
            // populate cache if valid auth token
            this._refreshTokenObject = refreshTokenObject
            return this._refreshTokenObject
        }

        return null
    }
}

const instance = new TokenService()
export default instance
