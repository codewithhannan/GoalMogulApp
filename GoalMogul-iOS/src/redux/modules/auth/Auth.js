// Authantication actions
import { SplashScreen } from "expo";
import * as SecureStore from "expo-secure-store";

import { SPLASHSCREEN_HIDE } from "../../../reducers/AuthReducers";

const USERNAME = "username";
const PASSWORD = "password";
const AUTH_TOKEN = "auth_token";
const DEBUG_KEY = "[ Action Auth ]";
export const auth = {
  getKey() {
    return new Promise(async (resolve, reject) => {
      try {
        const username = await SecureStore.getItemAsync(USERNAME);
        const password = await SecureStore.getItemAsync(PASSWORD);
        const token = await SecureStore.getItemAsync(AUTH_TOKEN);

        const value =
          username !== null && password !== null
            ? { username, password, token }
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
      console.log(
        `${DEBUG_KEY}: [ getByKey ] for key: ${keyToGet} with err:`,
        err
      );
      return undefined;
    }
  },

  async saveByKey(key, value) {
    if (typeof value !== "string") {
      console.warn(
        `${DBUG_KEY}: [ saveByKey ] incorrect value format. Expect string but real val is:`,
        value
      );
      return false;
    }
    try {
      await SecureStore.setItemAsync(key, `${value}`, {});
      return true;
    } catch (err) {
      console.log(
        `${DEBUG_KEY}: [ saveByKey ] for key: ${key} and val: ${value} with err:`,
        err
      );
      return false;
    }
  },

  async deleteByKey(key) {
    try {
      await SecureStore.deleteItemAsync(key);
      return true;
    } catch (err) {
      console.log(
        `${DEBUG_KEY}: [ deleteByKey ] for key: ${key} with err:`,
        err
      );
      return false;
    }
  },

  async saveKey(username, password, token, callback) {
    try {
      await SecureStore.setItemAsync(USERNAME, `${username}`, {});
      await SecureStore.setItemAsync(PASSWORD, `${password}`, {});
      await SecureStore.setItemAsync(AUTH_TOKEN, token, {});
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
      await SecureStore.deleteItemAsync(AUTH_TOKEN);

      if (callback) {
        callback(true);
      }
    } catch (e) {
      if (callback) {
        return callback(e);
      }
      throw e;
    }
  },
};

export const hideSplashScreen = () => async (dispatch, getState) => {
  setTimeout(async () => {
    SplashScreen.hide();
    dispatch({
      type: SPLASHSCREEN_HIDE,
    });
  }, 100);
};
