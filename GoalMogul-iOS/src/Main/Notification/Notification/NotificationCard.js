import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity
} from 'react-native';
import R from 'ramda';
import timeago from 'timeago.js';
import { connect } from 'react-redux';

// Component
import { actionSheet, switchByButtonIndex } from '../../Common/ActionSheetFactory';
import ProfileImage from '../../Common/ProfileImage';
import Timestamp from '../../Goal/Common/Timestamp';

// Asset
import FriendsSettingIcon from '../../../asset/utils/friendsSettingIcon.png';

// Actions
import {
  openNotificationDetail,
  removeNotification,
  markNotifAsRead
} from '../../../redux/modules/notification/NotificationActions';

// Constants
const DEBUG_KEY = '[ UI NotificationCard ]';

class NotificationCard extends React.PureComponent {
  handleNotificationCardOnPress = (item) => {
    const { parsedNoti, _id } = item;
    if (!parsedNoti || !parsedNoti.path) {
      console.log(`${DEBUG_KEY}: no parsedNoti or path is in notification:`, item);
      return;
    }

    if (!_id) {
      console.warn(`${DEBUG_KEY}: missing notification id for item:`, item);
      return;
    }

    // TODO: open detail based on the path;
    console.log(`${DEBUG_KEY}: open notification detail for item: `, item);
    this.props.openNotificationDetail(item);
  }

  handleOptionsOnPress() {
    const { item } = this.props;
    const { _id } = item;
    const options = switchByButtonIndex([
      [R.equals(0), () => {
        console.log(`${DEBUG_KEY} User chooses to remove notification`);
        return this.props.removeNotification(_id);
      }]      
    ]);


    const requestOptions = ['Remove this notification', 'Cancel'];

    const cancelIndex = 1;

    const adminActionSheet = actionSheet(
      requestOptions,
      cancelIndex,
      options
    );
    adminActionSheet();
  }

  renderProfileImage(item) {
    const { parsedNoti } = item;
    const imageUrl = parsedNoti && parsedNoti.icon
      ? parsedNoti.icon
      : undefined;
    return (
      <ProfileImage
        imageStyle={{ height: 50, width: 50, borderRadius: 5 }}
        defaultImageStyle={styles.defaultImageStyle}
        imageUrl={imageUrl}
        rounded
        imageContainerStyle={styles.imageContainerStyle}  
        userId=''
      />
    );
  }

  renderOptions() {
    return (
      <TouchableOpacity 
        activeOpacity={0.85}
        onPress={() => this.handleOptionsOnPress()}
        style={{ alignSelf: 'center', justifyContent: 'center', padding: 5, paddingTop: 10, paddingBottom: 10 }}
      >
        <Image
          style={{ width: 23, height: 19, tintColor: '#33485e' }}
          source={FriendsSettingIcon}
        />
      </TouchableOpacity>
    );
  }

  renderContent(item) {
    const { created, parsedNoti } = item;
    const text = parsedNoti && parsedNoti.notificationMessage
      ? parsedNoti.notificationMessage
      : 'Jordan Gardner commented on your post in "Society of Gamma -' +
      ' Bay Area this is the test part."';

    return (
      <View style={{ flex: 1, marginLeft: 10, marginRight: 18 }}>
        <Text
          style={{ flexWrap: 'wrap', color: 'black', fontSize: 13, marginTop: 2 }}
          numberOfLines={2}
          ellipsizeMode='tail'
        >
          {text}
        </Text>
        <View style={{ marginBottom: 3 }}>
          <Timestamp time={timeago().format(created)} />
        </View>
      </View>
    );
  }

  render() {
    const { item } = this.props;
    if (!item) return null;
    // If read, backgroundColor is: '#eef8fb'
    const read = this.props.read;
    const cardContainerStyle = read
      ? { ...styles.cardContainerStyle }
      : { ...styles.cardContainerStyle, backgroundColor: '#eef8fb' };
    return (
      <TouchableOpacity 
        activeOpacity={0.85}
        style={cardContainerStyle}
        onPress={() => this.handleNotificationCardOnPress(item)}
      >
        {this.renderProfileImage(item)}
        {this.renderContent(item)}
        {this.renderOptions(item)}
      </TouchableOpacity>
    );
  }
}

const styles = {
  cardContainerStyle: {
    flexDirection: 'row',
    padding: 12,
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: 'center'
  },
  imageContainerStyle: {
    borderWidth: 0.5,
    padding: 0.5,
    borderColor: 'lightgray',
    alignItems: 'center',
    borderRadius: 6,
    alignSelf: 'center',
    backgroundColor: 'white'
  },
  defaultImageStyle: {
    width: 44, 
    height: 48, 
    borderRadius: 5, 
    marginLeft: 3, 
    marginRight: 3, 
    marginTop: 1, 
    marginBottom: 1
  }
};

const mapStateToProps = (state, props) => {
  const { data } = state.notification.unread;
  const { item } = props;
  let read = true;
  if (item && item._id) {
    read = !data.some(a => a._id === item._id);
  }

  return {
    read
  };
};

export default connect(
  mapStateToProps,
  {
    removeNotification,
    markNotifAsRead,
    openNotificationDetail
  }
)(NotificationCard);
