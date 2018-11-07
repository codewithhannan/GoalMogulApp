/**
 * Actions for notification tab and general notification like subscribe
 */
import { Permissions, Notifications } from 'expo';
import { Alert } from 'react-native';

import { api as API } from '../../middleware/api';

const BASE_ROUTE = 'secure/notification/subscription';
const DEBUG_KEY = '[ Action Notification ]';

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
  const { token } = getState().user;
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;

  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== 'granted') {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  // Stop here if the user did not grant permissions
  if (finalStatus !== 'granted') {
    return;
  }

  // Get the token that uniquely identifies this device
  const notificationToken = await Notifications.getExpoPushTokenAsync();

  const onSuccess = (res) => {
    Alert.alert(
      'Success',
      'You have succesfully subscribed to the notification.'
    );
    console.log(`${DEBUG_KEY}: subscribe to notification success with res: `, res);
  };

  const onError = (err) => {
    Alert.alert(
      'Error',
      'Failed to subscribe to notification. Please try again later.'
    );
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
