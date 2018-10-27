import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity
} from 'react-native';
import R from 'ramda';
import timeago from 'timeago.js';

// Component
import { actionSheet, switchByButtonIndex } from '../Common/ActionSheetFactory';
import ProfileImage from '../Common/ProfileImage';
import Timestamp from '../Goal/Common/Timestamp';

// Asset
import FriendsSettingIcon from '../../asset/utils/friendsSettingIcon.png';

// Constants
const DEBUG_KEY = '[ UI NotificationCard ]';

class NotificationCard extends React.Component {

  handleOptionsOnPress() {
    const { onRemoveUser, onPromoteUser, onDemoteUser, item, category } = this.props;
    const { _id } = item;
    const options = switchByButtonIndex([
      [R.equals(0), () => {
        console.log(`${DEBUG_KEY} User chooses option 1`);
        return onRemoveUser(_id) || console.log(`${DEBUG_KEY}:
           No remove user function is supplied.`);
      }],
      [R.equals(1), () => {
        console.log(`${DEBUG_KEY} User chooses option2`);
        return onDemoteUser(_id) || console.log(`${DEBUG_KEY}:
           No demote user function is supplied.`);
      }],
    ]);


    const requestOptions = category === 'Admin'
      ? ['Remove User', 'Demote User', 'Cancel']
      : ['Remove User', 'Promote User', 'Cancel'];

    const cancelIndex = 2;

    const adminActionSheet = actionSheet(
      requestOptions,
      cancelIndex,
      options
    );
    adminActionSheet();
  }

  renderProfileImage(item) {
    return (
        <ProfileImage
          imageStyle={{ height: 50, width: 50 }}
          imageUrl={undefined}
          rounded
          imageContainerStyle={styles.imageContainerStyle}
        />
    );
  }

  renderOptions() {
    return (
      <TouchableOpacity
        onPress={() => this.handleOptionsOnPress()}
        style={{ alignSelf: 'center', justifyContent: 'center' }}
      >
        <Image
          style={{ width: 23, height: 19, tintColor: '#33485e' }}
          source={FriendsSettingIcon}
        />
      </TouchableOpacity>
    );
  }

  renderContent(item) {
    // TODO: use the actual content
    const text = 'Jordan Gardner commented on your post in "Society of Gamma -' +
      ' Bay Area this is the test part."';

    const created = '';
    return (
      <View style={{ flex: 1, marginLeft: 10, marginRight: 18 }}>
        <Text
          style={{ flex: 1, flexWrap: 'wrap', color: 'black', fontSize: 13, marginTop: 2 }}
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
    const read = false;
    const cardContainerStyle = read
      ? { ...styles.cardContainerStyle }
      : { ...styles.cardContainerStyle, backgroundColor: '#eef8fb' };
    return (
      <View style={cardContainerStyle}>
        {this.renderProfileImage(item)}
        {this.renderContent(item)}
        {this.renderOptions(item)}
      </View>
    );
  }
}

const styles = {
  cardContainerStyle: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center'
  },
  imageContainerStyle: {
    borderWidth: 0.5,
    padding: 1.5,
    borderColor: 'lightgray',
    alignItems: 'center',
    borderRadius: 6,
    alignSelf: 'center',
    backgroundColor: 'white'
  },
};

export default NotificationCard;
