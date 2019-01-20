/**
 * Actions for notification tab and general notification like subscribe
 */
import { Permissions, Notifications, SecureStore, Linking } from 'expo';
import { Alert } from 'react-native';
import _ from 'lodash';

import { api as API, queryBuilderBasicBuilder } from '../../middleware/api';

import {
  NOTIFICATION_MARK_ALL_READ,
  NOTIFICATION_UNSUBSCRIBE,
  NOTIFICATION_SUBSCRIBE
} from './NotificationTabReducers';

const BASE_ROUTE = 'secure/notification';
const DEBUG_KEY = '[ Action Notification ]';
const NOTIFICATION_TOKEN_KEY = 'notification_token_key';
const NOTIFICATION_ALERT_SHOWN = 'notification_alert_shown';

export const openNotificationDetail = (item) => (dispatch, getState) => {
  // TODO: use the item.parsedNoti.path to determine which detail to open

};

/**
 * User clicks to see more
 * @param type: ['notifications', 'needs']
 */
export const seeMore = (type) => (dispatch, getState) => {

};

/**
 * Ask user for notification token to send over to subscribe for notification
 */
export const subscribeNotification = () => async (dispatch, getState) => {
  const { token, userId } = getState().user;
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;

  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== 'granted') {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    console.log(`${DEBUG_KEY}: asking for notification permit status: `, existingStatus);

    // Every user should have his / her notification token set
    const USER_NOTIFICATION_ALERT_SHOWN = `${userId}_${NOTIFICATION_ALERT_SHOWN}`;
    const hasShown = await SecureStore.getItemAsync(USER_NOTIFICATION_ALERT_SHOWN, {});
    const hasShownNumber = hasShown ? parseInt(hasShown) : 0;
    if (hasShownNumber > 1) {
      // We have shown notification enabling for more than 2 times
      return;
    }

    Alert.alert(
      'Notification',
      'To subscribe to notification, you can go the app setting or click enable',
      [
        {
          text: 'Enable',
          onPress: () => Linking.openURL('app-settings:')
        },
        {
          text: 'Cancel',
          onPress: () => console.log('User cancel share to enable'),
          style: 'cancel'
        }
      ]
    );
    // Update alert count
    await SecureStore.setItemAsync(USER_NOTIFICATION_ALERT_SHOWN, `${hasShownNumber + 1}`, {});
    return;
  }

  // Stop here if the user did not grant permissions
  if (finalStatus !== 'granted') {
    return;
  }

  // Get the token that uniquely identifies this device
  const notificationToken = await Notifications.getExpoPushTokenAsync();

  // Get the token that an user has on this device
  const hasToken = await SecureStore.getItemAsync(NOTIFICATION_TOKEN_KEY, {});
  
  if (hasToken && hasToken !== '' && _.isEqual(hasToken, notificationToken)) {
    // Only if user has a token stored and cuurent fetched token is the same as the previous one
    // We skip the check
    console.log(`${DEBUG_KEY}: user has already provided the notification token: `, hasToken);
    return; // Notification Token is already stored
  }

  const onSuccess = async (res) => {
    await SecureStore.setItemAsync(
      NOTIFICATION_TOKEN_KEY, notificationToken, {}
    );
    Alert.alert(
      'Success',
      'You have succesfully subscribed to the notification.'
    );
    console.log(`${DEBUG_KEY}: subscribe to notification success with res: `, res);
  };

  const onError = (err) => {
    console.log(`${DEBUG_KEY}: error subscribe to notification with err: `, err);
  };

  // POST the token to your backend server from
  // where you can retrieve it to send push notifications.
  return API
    .put(
      'secure/user/setting/expo-token', { pushToken: notificationToken }, token
    )
    .then((res) => {
      onSuccess(res);
    })
    .catch((err) => {
      onError(err);
    });
};

/**
 * User subscribes to the notification of an entity
 */
export const subscribeEntityNotification = (entityId, entityKind) => (dispatch, getState) => {
  const { token } = getState().user;


  const onSuccess = (res) => {
    console.log(`${DEBUG_KEY}: subscribe notification for entity: ${entityId}, type: ${entityKind}
      succeed with res: `, res);
    dispatch({
      type: NOTIFICATION_SUBSCRIBE,
      payload: {
        entityId,
        entityKind
      }
    });
  };

  const onError = (err) => {
    console.log(`${DEBUG_KEY}: subscribe notification for entity: ${entityId}, type: ${entityKind} 
      failed with error: `, err);
  };

  API
    .put(`${BASE_ROUTE}/subscription`, {
      entityId,
      entityKind
    }, token)
    .then(res => {
      if (res.status === 200) {
        return onSuccess(res);
      }
      return onError(res);
    })
    .catch(err => {
      onError(err);
    });
};

/**
 * User unsubscribes from the notification of an entity 
 */
export const unsubscribeEntityNotification = (entityId, entityKind) => (dispatch, getState) => {
  const requestBody = {
    entityId,
    entityKind
  };

  const onSuccess = (res) => {
    console.log(`${DEBUG_KEY}: unsubscribe notification for entity: ${entityId}, type: ${entityKind}
      succeed with res: `, res);
    dispatch({
      type: NOTIFICATION_UNSUBSCRIBE,
      payload: {
        entityId,
        entityKind
      }
    });
  };

  const onError = (err) => {
    console.log(`${DEBUG_KEY}: unsubscribe notification for entity: ${entityId},  
      type: ${entityKind} failed with error: `, err);
  };

  unsubscribeNotification(requestBody, onSuccess, onError)(dispatch, getState);
};

/**
 * User unsubscribes from the notification of a stream 
 */
export const unsubscribeStreamNotification = (notificationStreamRef) => (dispatch, getState) => {
  const requestBody = {
    notificationStreamRef
  };

  const onSuccess = (res) => {
    console.log(`${DEBUG_KEY}: unsubscribe notification for streamRef: ${notificationStreamRef} 
      succeed with res: `, res);
  };

  const onError = (err) => {
    console.log(`${DEBUG_KEY}: unsubscribe notification for entity: ${notificationStreamRef}  
      failed with error: `, err);
  };

  unsubscribeNotification(requestBody, onSuccess, onError)(dispatch, getState);
};

/**
 * Helper function to unsubscribe a notification
 * @param {} requestBody 
 * @param {*} onSuccess 
 * @param {*} onError 
 */
const unsubscribeNotification = (requestBody, onSuccess, onError) => (dispatch, getState) => {
  const { token } = getState().user;

  API
    .delete(`${BASE_ROUTE}/subscription?${queryBuilderBasicBuilder(requestBody)}`, {}, token)
    .then(res => {
      if (res.status === 200) {
        return onSuccess(res);
      }
      return onError(res);
    })
    .catch(err => {
      onError(err);
    });
};

/**
 * User marks all of the notifications as read
 */
export const markAllNotificationAsRead = () => (dispatch, getState) => {
  const { token } = getState().user;

  const onSuccess = (res) => {
    console.log(`${DEBUG_KEY}: mark all notification read succeed with res:`, res);
    dispatch({
      type: NOTIFICATION_MARK_ALL_READ
    });
  };

  const onError = (err) => {
    console.log(`${DEBUG_KEY}: mark all notification read failed with err:`, err);
  };

  API
    .post(`${BASE_ROUTE}/entity/read`, {}, token)
    .then((res) => {
      if (res.status === 200) {
        return onSuccess(res);
      }
      return onError(res);
    })
    .catch(err => {
      onError(err);
    });
};
