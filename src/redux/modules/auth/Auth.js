/** @format */

// Authantication actions
import * as SecureStore from 'expo-secure-store'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const USERNAME = 'username'
export const PASSWORD = 'password'
export const AUTH_TOKEN_OBJECT = 'auth_token'
export const USER_ID = 'user_id'
const DEBUG_KEY = '[ Action Auth ]'
export const auth = {
    getKey() {
        return new Promise(async (resolve, reject) => {
            try {
                // const username = await SecureStore.getItemAsync(USERNAME)
                // const password = await SecureStore.getItemAsync(PASSWORD)
                // const token = await SecureStore.getItemAsync(AUTH_TOKEN_OBJECT)
                const username = await AsyncStorage.getItem(USERNAME)
                const password = await AsyncStorage.getItem(PASSWORD)
                const token = await AsyncStorage.getItem(AUTH_TOKEN_OBJECT)

                const value =
                    username !== null && password !== null
                        ? { username, password, token }
                        : {}

                resolve(value)
            } catch (err) {
                console.log(`${DEBUG_KEY}: err getting key is: `, err)
                reject(err)
            }
        })
    },

    async getByKey(keyToGet) {
        try {
            const val = await AsyncStorage.getItem(keyToGet)
            return val
        } catch (err) {
            console.log(
                `${DEBUG_KEY}: [ getByKey ] for key: ${keyToGet} with err:`,
                err
            )
            return undefined
        }
    },

    async saveByKey(key, value) {
        if (typeof value !== 'string') {
            console.warn(
                `${DBUG_KEY}: [ saveByKey ] incorrect value format. Expect string but real val is:`,
                value
            )
            return false
        }
        try {
            // await SecureStore.setItemAsync(key, `${value}`, {})
            await AsyncStorage.setItem(key, `${value}`)
            return true
        } catch (err) {
            console.log(
                `${DEBUG_KEY}: [ saveByKey ] for key: ${key} and val: ${value} with err:`,
                err
            )
            return false
        }
    },

    async deleteByKey(key) {
        try {
            // await SecureStore.deleteItemAsync(key)
            await AsyncStorage.removeItem(key)
            return true
        } catch (err) {
            console.log(
                `${DEBUG_KEY}: [ deleteByKey ] for key: ${key} with err:`,
                err
            )
            return false
        }
    },

    async saveKey(username, password, token, callback) {
        try {
            // await SecureStore.setItemAsync(USERNAME, `${username}`, {})
            // await SecureStore.setItemAsync(PASSWORD, `${password}`, {})
            // await SecureStore.setItemAsync(AUTH_TOKEN_OBJECT, token, {})

            await AsyncStorage.setItem(USERNAME, `${username}`)
            await AsyncStorage.setItem(PASSWORD, `${password}`)
            await AsyncStorage.setItem(AUTH_TOKEN_OBJECT, token)
            if (callback) {
                callback(true)
            }
        } catch (err) {
            if (callback) {
                return callback(err)
            }
            throw err
        }
    },

    async updatePassword(password) {
        try {
            // const username = await SecureStore.getItemAsync(USERNAME)
            const username = await AsyncStorage.getItem(USERNAME)

            await saveKey(username, password)
            return true
        } catch (err) {
            console.log(`${DEBUG_KEY}: err updating password is: `, err)
            return false
        }
    },

    async reset(callback) {
        try {
            // await SecureStore.deleteItemAsync(USERNAME)
            // await SecureStore.deleteItemAsync(PASSWORD)
            // const USERTOKENASYNC = await SecureStore.deleteItemAsync(
            //     AUTH_TOKEN_OBJECT
            // )
            await AsyncStorage.removeItem(USERNAME)
            await AsyncStorage.removeItem(PASSWORD)
            const USERTOKENASYNC = await AsyncStorage.removeItem(
                AUTH_TOKEN_OBJECT
            )

            if (callback) {
                callback(true)
            }
        } catch (e) {
            if (callback) {
                return callback(e)
            }
            throw e
        }
    },
}
