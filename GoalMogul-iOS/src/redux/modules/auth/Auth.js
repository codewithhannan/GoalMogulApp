// Authantication actions
import { AsyncStorage } from 'react-native';
import {
  setGenericPassword,
  getGenericPassword,
  resetGenericPassword
} from 'react-native-keychain';
import { SecureStore, SplashScreen } from 'expo';

import {
  SPLASHSCREEN_HIDE
} from '../../../reducers/AuthReducers';

import {
  subscribeNotification
} from '../notification/NotificationActions';

const USERNAME = 'username';
const PASSWORD = 'password';
const DEBUG_KEY = '[ Action Auth ]';
export const auth = {
  getKey() {
    return new Promise(async (resolve, reject) => {
      try {
        const username = await SecureStore.getItemAsync(USERNAME);
        const password = await SecureStore.getItemAsync(PASSWORD);
        const value = username !== null && password !== null
          ? { username, password }
          : {};

        resolve(value);
      } catch (err) {
        console.log(`${DEBUG_KEY}: err getting key is: `, err);
        reject(err);
      }
    });
  },
  async saveKey(username, password, callback) {
    try {
      await SecureStore.setItemAsync(
        USERNAME, `${username}`, {}
      );
      await SecureStore.setItemAsync(
        PASSWORD, `${password}`, {}
      );
      // await setGenericPassword(
      //   username,
      //   password,
      //   { }
      // );
      if (callback) {
        callback(true);
      }
    } catch (err) {
      if (callback) {
        return callback(err);
      }
      throw err;
    }
  },
  async reset(callback) {
    try {
      await SecureStore.deleteItemAsync(USERNAME);
      await SecureStore.deleteItemAsync(PASSWORD);
      // await resetGenericPassword();
      if (callback) {
        callback(true);
      }
    } catch (e) {
      if (callback) {
        return callback(e);
      }
      throw e;
    }
  }
};

export const hideSplashScreen = () => (dispatch, getState) => {
  setTimeout(async () => {
    SplashScreen.hide();
    dispatch({
      type: SPLASHSCREEN_HIDE
    });
    await subscribeNotification()(dispatch, getState);
  }, 1000);
};
