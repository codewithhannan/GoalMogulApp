/** @format */

// Tutorial actions
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'
import { Logger } from '../../middleware/utils/Logger'

const TUTORIAL_KEY = 'tutorial'
const DEBUG_KEY = '[ Action Tutorial ]'
export const tutorial = {
    async getTutorialShown(userId) {
        try {
            // const status = await SecureStore.getItemAsync(TUTORIAL_KEY)
            const status = await AsyncStorage.getItem(TUTORIAL_KEY)

            if (status === '' || status === null) {
                return false
            }
            const allUsers = status.split(',')
            Logger.log(`${DEBUG_KEY}: all users shown are: `, allUsers, 2)
            return allUsers.includes(userId)
        } catch (err) {
            console.log(`${DEBUG_KEY}: err getting key is: `, err)
            throw err
        }
    },

    async setTutorialShown(userId, onSuccess, onError) {
        try {
            // const status = await SecureStore.getItemAsync(TUTORIAL_KEY)
            const status = await AsyncStorage.getItem(TUTORIAL_KEY)

            let ret = []
            if (status && status !== null) {
                ret = status.split(',')
            }
            if (ret.includes(userId)) return onSuccess(false)

            ret = [...ret, userId]
            ret = ret.join(',')

            // await SecureStore.setItemAsync(TUTORIAL_KEY, ret, {})
            await AsyncStorage.setItem(TUTORIAL_KEY, ret)
            onSuccess(true)
        } catch (err) {
            if (onError(err)) {
                onError(err)
            }
        }
    },

    async removeTutorialShown(userId, onSuccess, onError) {
        try {
            // const status = await SecureStore.getItemAsync(TUTORIAL_KEY)
            const status = await AsyncStorage.getItem(TUTORIAL_KEY)
            if (!status || status === null) return onSuccess(false)
            let ret = status.split(',')
            if (!ret.includes(userId)) return onSuccess(false)
            ret = ret.filter((s) => s !== userId)

            // await SecureStore.setItemAsync(TUTORIAL_KEY, ret, {})
            await AsyncStorage.setItem(TUTORIAL_KEY, ret)
        } catch (err) {
            if (onError(err)) {
                onError(err)
            }
        }
    },

    async reset(callback) {
        try {
            // await SecureStore.deleteItemAsync(TUTORIAL_KEY)
            await AsyncStorage.removeItem(TUTORIAL_KEY)
            // await resetGenericPassword();
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
