// Authantication actions
import { AsyncStorage } from 'react-native';
import { SecureStore, SplashScreen } from 'expo';

import {
  SPLASHSCREEN_HIDE
} from '../../../reducers/AuthReducers';

import {
  subscribeNotification
} from '../notification/NotificationActions';
import { handleUpdatePassword } from '../../../actions';

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

  async getByKey(keyToGet) {
    try {
      const val = await SecureStore.getItemAsync(keyToGet);
      return val; 
    } catch (err) {
      console.log(`${DEBUG_KEY}: [ getByKey ] for key: ${keyToGet} with err:`, err);
      return undefined;
    }
  },

  async saveByKey(key, value) {
    if (typeof value !== 'string') {
      console.warn(`${DBUG_KEY}: [ saveByKey ] incorrect value format. Expect string but real val is:`, value);
      return false;
    }
    try {
      await SecureStore.setItemAsync(
        key, `${value}`, {}
      );
      return true;
    } catch (err) {
      console.log(`${DEBUG_KEY}: [ saveByKey ] for key: ${key} and val: ${value} with err:`, err);
      return false;
    }
  },

  async deleteByKey(key) {
    try {
      await SecureStore.deleteItemAsync(key);
      return true;
    } catch (err) {
      console.log(`${DEBUG_KEY}: [ deleteByKey ] for key: ${key} with err:`, err);
      return false;
    }
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
  async updatePassword(password) {
    try {
      const username = await SecureStore.getItemAsync(USERNAME);
      await saveKey(username, password);
      return true;
    } catch (err) {
      console.log(`${DEBUG_KEY}: err updating password is: `, err);
      return false;
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
