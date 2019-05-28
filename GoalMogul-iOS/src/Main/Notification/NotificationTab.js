import React, { Component } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Actions } from 'react-native-router-flux';

// Components
import SearchBarHeader from '../Common/Header/SearchBarHeader';
import NotificationCard from './Notification/NotificationCard';
import NotificationNeedCard from './Need/NotificationNeedCard';
import EmptyResult from '../Common/Text/EmptyResult';
import DelayedButton from '../Common/Button/DelayedButton';
import {
  RightArrowIcon
} from '../../Utils/Icons';

// Actions
import {
  seeMoreNotification,
  seeLessNotification,
  refreshNotificationTab,
  clearUnreadCount,
  markAllNotificationAsRead
} from '../../redux/modules/notification/NotificationTabActions';

// Selectors
import {
  getNotifications,
  getNotificationNeeds
} from '../../redux/modules/notification/NotificationSelector';

// Styles
import {
  APP_BLUE
} from '../../styles';

import { Notifications } from 'expo';
import MessageStorageService from '../../services/chat/MessageStorageService';
// Constants
const DEBUG_KEY = '[ UI NotificationTab ]';

class NotificationTab extends Component {

  componentDidMount() {
    // Refresh notification tab 
    console.log(`${DEBUG_KEY}: component did mount`);
    if (!this.props.data || _.isEmpty(this.props.data.length)) {
      this.props.refreshNotificationTab();
    }
  }

  componentDidUpdate(prevProps) {
    // When notification finishes refreshing and 
    // user is at the notification tab. 
    // Then send mark all as read
    const justFinishRefreshing = prevProps.refreshing === true && this.props.refreshing === false;
    const userOnNotificationPage = this.props.shouldUpdateUnreadCount === false;

    if (justFinishRefreshing && userOnNotificationPage) {
      this.props.markAllNotificationAsRead();
    }
  }

  componentWillUnmount() {
    // Remove timer before exiting to prevent app from crashing
  }

  /**
   * This function is no longer in used since we refresh the tab through when
   * we see there is unread count
   */
  refreshNotification() {
    console.log(`${DEBUG_KEY}: refreshing notification`);
    // Stop timer before sending the mark all notification as read to prevent race condition
    // this.stopTimer();
    this.props.refreshNotificationTab();
    // this.props.clearUnreadCount();
    // this.props.markAllNotificationAsRead();
    // // Reset timer after we successfully mark all current notification as read
    // this.setTimer();
  }

  keyExtractor = (item) => item._id;

  handleRefresh = () => {
    this.props.refreshNotificationTab();
  }

  renderSeeMore = (item) => {
    // const onPress = item.type === 'seemore'
    //   ? () => this.props.seeMoreNotification()
    //   : () => this.props.seeLessNotification();
    if (item.type !== 'seemore') return;

    const onPress = item.notificationType === 'notification'
      ? () => Actions.push('notificationList')
      : () => Actions.push('notificationNeedList');
    return <SeeMoreButton text={item.text} onPress={onPress} />;
  }

  renderHeader = (item) => {
    return (
        <TitleComponent item={item} />
    );
  }

  renderItem = (props) => {
    const { item } = props;

    // TODO: update this to the latest type
    if (item.type === 'seemore' || item.type === 'seeless') {
      return this.renderSeeMore(item);
    }
    if (item.type === 'header') {
      return this.renderHeader(item);
    }
    if (item.type === 'need') {
      return <NotificationNeedCard item={item} />;
    }
    if (item.type === 'empty') {
      return <EmptyResult text='You have no notifications' textStyle={{ paddingTop: 260 }} />;
    }
    return (
      <NotificationCard item={item} />
    );
  }

  render() {
    const { data } = this.props;
    let dataToRender = data;
    if (_.isEmpty(data) || data.length === 0) {
      dataToRender = [{ type: 'empty', _id: 'empty' }];
    }

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <SearchBarHeader rightIcon='menu' />
        <FlatList
          data={dataToRender}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
          onRefresh={this.handleRefresh}
          refreshing={this.props.refreshing}
        />
      </View>
    );
  }
}

const TestData = [
  { _id: '0', type: 'header', text: 'Notifications' },
  { _id: '1' },
  { _id: '2' },
  { _id: '3', type: 'seemore', text: 'See More' },
  { _id: '4', type: 'header', text: 'Friend\'s Needs' },
  { _id: '5', type: 'need' }
];

const SeeMoreButton = (props) => {
  const { onPress, text } = props;
  return (
    <TouchableOpacity 
      activeOpacity={0.6}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3
      }}
      onPress={() => onPress()}
    >
      <Text style={styles.seeMoreTextStyle}>{text}</Text>
      <RightArrowIcon 
        iconContainerStyle={{ alignSelf: 'center', alignItems: 'center' }}
        iconStyle={{ tintColor: '#17B3EC', ...styles.iconStyle }}
      />
      {/* <View style={{ alignSelf: 'center', alignItems: 'center' }}>
        <Icon
          name='ios-arrow-round-forward'
          type='ionicon'
          color='#17B3EC'
          iconStyle={styles.iconStyle}
        />
      </View> */}
    </TouchableOpacity>
  );
};

/**
 * Title component at the start of each notification type
 */
const TitleComponent = (props) => {
  const { text, notificationType, length } = props.item;
  let seeAll = null;
  if (length !== undefined && length === 0 && notificationType === 'notification') {
      const { seeAllContainerStyle, seeAllTextStyle } = styles;
      const onPress = () => Actions.push('notificationList');
      seeAll = (
          <DelayedButton
              style={{ ...seeAllContainerStyle, paddingLeft: 5, alignSelf: 'flex-end' }}
              activeOpacity={0.6} 
              onPress={onPress}
          >
              <Text style={seeAllTextStyle}>Manage All</Text>
          </DelayedButton>
      );
  }

  return (
    <View style={styles.titleComponentContainerStyle}>
      <Text style={{ fontSize: 11, color: '#6d6d6d', fontWeight: '600' }}>
        {text}
      </Text>
      {seeAll}
    </View>
  );
};

const mapStateToProps = (state) => {
  const notificationData = getNotifications(state);
  const notificationNeedData = getNotificationNeeds(state);
  const { needs, notifications, unread } = state.notification;
  const { shouldUpdateUnreadCount } = unread;

  return {
    refreshing: needs.refreshing || notifications.refreshing,
    data: [...notificationData, ...notificationNeedData],
    loading: needs.loading || notifications.loading,
    shouldUpdateUnreadCount
  };
};

const styles = {
  seeMoreTextStyle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#17B3EC',
    alignSelf: 'center'
  },
  iconStyle: {
    alignSelf: 'center',
    // fontSize: 20,
    height: 15,
    width: 20,
    marginLeft: 5,
  },
  titleComponentContainerStyle: {
    paddingLeft: 12, // Needs to be aligned with NotificationCard padding
    paddingTop: 10,
    padding: 6,
    borderColor: 'lightgray',
    borderBottomWidth: 0.5,
    flexDirection: 'row', 
    alignItems: 'center'
  },
  seeAllContainerStyle: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  seeAllTextStyle: {
      color: APP_BLUE,
      fontSize: 12,
      fontWeight: '700'
  },
};

export default connect(
  mapStateToProps,
  {
    refreshNotificationTab,
    seeMoreNotification,
    seeLessNotification,
    clearUnreadCount,
    markAllNotificationAsRead
  },
  null,
  { withRef: true }
)(NotificationTab);
