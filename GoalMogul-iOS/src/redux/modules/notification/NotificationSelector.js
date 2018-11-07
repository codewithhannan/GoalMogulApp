import { createSelector } from 'reselect';
import _ from 'lodash';

const getNotificationData = (state) => state.notification.notifications;
const getNotificationFeed = (state) => state.notification.needs;

export const getNotifications = createSelector(
  [getNotificationData],
  (notifications) => {
    const { seeMoreCount, data } = notifications;

    if (_.isEmpty(data) || data.length === 0) return [];

    const header = [{ type: 'header', text: 'Notifications', _id: 'notification' }];
    const seeMore = [{ type: 'seemore', text: 'See More', _id: 'notification_see_more' }];
    const seeLess = [{ type: 'seeless', text: 'See Less', _id: 'notification_see_less' }];

    let dataToReturn = [];
    if (seeMoreCount === data.length) {
      dataToReturn = [...data, ...seeLess];
    } else if (seeMoreCount > data.length) {
      dataToReturn = data;
    } else {
      dataToReturn = [...data.slice(0, seeMoreCount), ...seeMore];
    }
    dataToReturn = dataToReturn.map((item) => {
      if (!item.type) {
        return {
          type: 'notification',
          ...item
        };
      }
      return item;
    });

    return [...header, ...dataToReturn];
  }
);

export const getNotificationNeeds = createSelector(
  [getNotificationFeed],
  (notificationNeeds) => {
    const { seeMoreCount, data } = notificationNeeds;
    if (_.isEmpty(data) || data.length === 0) return [];

    const header = [{ type: 'header', text: 'Friend\'s Needs', _id: 'notification_feed' }];
    const seeMore = [{ type: 'seemore', text: 'See More', _id: 'notification_feed_see_more' }];
    const seeLess = [{ type: 'seeless', text: 'See Less', _id: 'notification_feed_see_less' }];

    let dataToReturn = [];
    if (seeMoreCount >= data.length) {
      dataToReturn = [...data, ...seeLess];
    } else if (seeMoreCount > data.length) {
      dataToReturn = data;
    } else {
      dataToReturn = [...data.slice(0, seeMoreCount), ...seeMore];
    }
    dataToReturn = dataToReturn.map((item) => {
      if (!item.type) {
        return {
          type: 'need',
          ...item
        };
      }
      return item;
    });

    return [...header, ...dataToReturn];
  }
);
