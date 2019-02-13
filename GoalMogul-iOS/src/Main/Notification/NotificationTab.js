import React, { Component } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import _ from 'lodash';

// Components
import SearchBarHeader from '../Common/Header/SearchBarHeader';
import NotificationCard from './Notification/NotificationCard';
import NotificationNeedCard from './Need/NotificationNeedCard';
import EmptyResult from '../Common/Text/EmptyResult';

// Actions
import {
  seeMoreNotification,
  seeLessNotification,
  refreshNotificationTab,
  fetchUnreadCount,
  clearUnreadCount,
  markAllNotificationAsRead
} from '../../redux/modules/notification/NotificationTabActions';

// Selectors
import {
  getNotifications,
  getNotificationNeeds
} from '../../redux/modules/notification/NotificationSelector';
import { Actions } from 'react-native-router-flux';

// Constants
const DEBUG_KEY = '[ UI NotificationTab ]';

class NotificationTab extends Component {
  constructor(props) {
    super(props);
    this.setTimer = this.setTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
  }

  componentDidMount() {
    // Refresh notification tab 
    console.log(`${DEBUG_KEY}: component did mount`);
    if (!this.props.data || _.isEmpty(this.props.data.length)) {
      this.props.refreshNotificationTab();
    }
    this.setTimer();
  }

  componentWillUnmount() {
    // Remove timer before exiting to prevent app from crashing
    this.stopTimer();
  }

  setTimer() {
    this.stopTimer(); // Clear the previous timer if there is one

    console.log(`${DEBUG_KEY}: [ Setting New Timer ] for refreshing unread count`);
    this.timer = setInterval(() => {
      console.log(`${DEBUG_KEY}: [ Timer firing ] Fetching unread count.`);
      this.props.fetchUnreadCount();
    }, 10000);
  }

  stopTimer() {
    if (this.timer !== undefined) {
      clearInterval(this.timer);
    }
  }

  refreshNotification() {
    console.log(`${DEBUG_KEY}: refreshing notification`);
    // Stop timer before sending the mark all notification as read to prevent race condition
    this.stopTimer();
    this.props.refreshNotificationTab();
    this.props.clearUnreadCount();
    this.props.markAllNotificationAsRead();
    // Reset timer after we successfully mark all current notification as read
    this.setTimer();
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
    const { text } = item;
    return <TitleComponent text={text} />;
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

  renderListHeader = () => {
    return null;
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
          ListHeaderComponent={this.renderListHeader}
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
      activeOpacity={0.85}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3
      }}
      onPress={() => onPress()}
    >
      <Text style={styles.seeMoreTextStyle}>{text}</Text>
      <View style={{ alignSelf: 'center', alignItems: 'center' }}>
        <Icon
          name='ios-arrow-round-forward'
          type='ionicon'
          color='#17B3EC'
          iconStyle={styles.iconStyle}
        />
      </View>
    </TouchableOpacity>
  );
};

/**
 * Title component at the start of each notification type
 */
const TitleComponent = (props) => {
  const { text } = props;

  return (
    <View style={styles.titleComponentContainerStyle}>
      <Text style={{ fontSize: 11, color: '#6d6d6d', fontWeight: '600' }}>
        {text}
      </Text>
    </View>
  );
};

const mapStateToProps = (state) => {
  const notificationData = getNotifications(state);
  const notificationNeedData = getNotificationNeeds(state);
  const { needs, notifications } = state.notification;

  return {
    refreshing: needs.refreshing || notifications.refreshing,
    data: [...notificationData, ...notificationNeedData],
    loading: needs.loading || notifications.loading
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
    fontSize: 20,
    marginLeft: 5,
    marginTop: 2
  },
  titleComponentContainerStyle: {
    paddingLeft: 12, // Needs to be aligned with NotificationCard padding
    padding: 6,
    borderColor: 'lightgray',
    borderBottomWidth: 0.5
  }
};

export default connect(
  mapStateToProps,
  {
    refreshNotificationTab,
    seeMoreNotification,
    seeLessNotification,
    fetchUnreadCount,
    clearUnreadCount,
    markAllNotificationAsRead
  },
  null,
  { withRef: true }
)(NotificationTab);
