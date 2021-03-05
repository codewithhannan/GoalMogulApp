/** @format */

/** @format */

import AsyncStorage from '@react-native-async-storage/async-storage'

export const store = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
        console.log(error)
    }
}

export const get = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key)
        const item = JSON.parse(value)

        if (!item) return null
    } catch (error) {
        console.log(error)
    }
}

export const removeData = async (storedKey) => {
    try {
        await AsyncStorage.removeItem(storedKey)
    } catch (e) {}
}
