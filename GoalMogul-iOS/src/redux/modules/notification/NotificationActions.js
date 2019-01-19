/**
 * Actions for notification tab and general notification like subscribe
 */
import { Permissions, Notifications, SecureStore, Linking } from 'expo';
import { Alert } from 'react-native';

import { api as API } from '../../middleware/api';

const BASE_ROUTE = 'secure/notification/subscription';
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

  const hasToken = await SecureStore.getItemAsync(NOTIFICATION_TOKEN_KEY, {});
  if (hasToken && hasToken !== '') {
    console.log(`${DEBUG_KEY}: user has already provided the notification token: `, hasToken);
    return; // Notification Token is already stored
  }

  // Stop here if the user did not grant permissions
  if (finalStatus !== 'granted') {
    return;
  }

  // Get the token that uniquely identifies this device
  const notificationToken = await Notifications.getExpoPushTokenAsync();

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
    .post(
      `${BASE_ROUTE}`, { entityId: notificationToken }, token
    )
    .then((res) => {
      onSuccess(res);
    })
    .catch((err) => {
      onError(err);
    });
};
