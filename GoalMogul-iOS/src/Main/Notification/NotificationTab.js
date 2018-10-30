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
import NotificationCard from './NotificationCard';
import NotificationNeedCard from './NotificationNeedCard';
import EmptyResult from '../Common/Text/EmptyResult';

// Actions
import {
  seeMoreNotification,
  seeLessNotification,
  refreshNotifications
} from '../../redux/modules/notification/NotificationTabActions';

// Selectors
import {
  getNotifications,
  getNotificationNeeds
} from '../../redux/modules/notification/NotificationSelector';

// Constants
const DEBUG_KEY = '[ UI NotificationTab ]';

class NotificationTab extends Component {
  keyExtractor = (item) => item._id;

  handleRefresh = () => {
    this.props.refreshNotifications();
  }

  renderSeeMore = (item) => {
    const onPress = item.type === 'seemore'
      ? () => this.props.seeMoreNotification()
      : () => this.props.seeLessNotification();

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
      return <EmptyResult text='You have no notifications' />;
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
          data={TestData}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
          onRefresh={this.handleRefresh}
          refreshing={this.props.loading}
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
  { _id: '3', type: 'seemore' },
  { _id: '4', type: 'header', text: 'Friend\'s Needs' },
  { _id: '5', type: 'need' }
];

const SeeMoreButton = (props) => {
  const { onPress, text } = props;
  return (
    <TouchableOpacity
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
          color='#45C9F6'
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
    refreshing: false,
    data: [...notificationData, ...notificationNeedData],
    loading: needs.loading || notifications.loading
  };
};

const styles = {
  seeMoreTextStyle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#45C9F6',
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
    refreshNotifications,
    seeMoreNotification,
    seeLessNotification,
  }
)(NotificationTab);
