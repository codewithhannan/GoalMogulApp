import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, ActionSheetIOS } from 'react-native';
import { connect } from 'react-redux';

// Components
import ProfileImage from '../../Common/ProfileImage';

// Assets
import badge from '../../../asset/utils/badge.png';
import addUser from '../../../asset/utils/addUser.png';
import check from '../../../asset/utils/check.png';

// Actions

const checkIconColor = '#2dca4a';
const FRIENDSHIP_BUTTONS = ['Withdraw request', 'Cancel'];
const WITHDRAW_INDEX = 0;
const CANCEL_INDEX = 1;
const TAB_KEY = 'contacts'

class ContactDetail extends Component {

  state = {
    requested: false
  }

  onFriendRequest = (_id) => {
    if (this.state.requested) {
      ActionSheetIOS.showActionSheetWithOptions({
        options: FRIENDSHIP_BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
      },
      (buttonIndex) => {
        console.log('button clicked', FRIENDSHIP_BUTTONS[buttonIndex]);
        switch (buttonIndex) {
          case WITHDRAW_INDEX:
            // this.props.updateFriendship(_id, '', 'deleteFriend', TAB_KEY, () => {
            //   this.setState({ requested: false });
            // });
            break;
          default:
            return;
        }
      });
      return;
    }
    // this.props.updateFriendship(_id, '', 'requestFriend', TAB_KEY, () => {
    //   this.setState({ requested: true });
    // });
  }

  renderButton() {
    if (this.state.requested) {
      return (
        <View style={styles.checkIconContainerStyle}>
          <Image
            source={check}
            style={{
              height: 16,
              width: 20,
              tintColor: checkIconColor
            }}
          />
        </View>
      );
    }
    return (
      <View style={styles.addUserIconContainerStyle}>
        <Image source={addUser} style={{ ...styles.iconStyle, tintColor: 'white' }} />
      </View>
    );
  }

  renderProfileImage(profile, _id) {
    return (
      <ProfileImage
        imageContainerStyle={{ height: 30, width: 30, borderRadius: 15 }}
        imageStyle={{ height: 30, width: 30, borderRadius: 15 }}
        defaultImageStyle={{ height: 30, width: 26, borderRadius: 15 }}
        imageUrl={profile.image}
        userId={_id}
      />
    );
  }

  render() {
    const { item } = this.props;
    if (!item) return '';
    const { name, headline, _id, profile } = item;
    return (
      <View style={styles.containerStyle}>
        {this.renderProfileImage(profile, _id)}
        <View style={styles.bodyContainerStyle}>
          <Text
            style={styles.nameTextStyle}
            numberOfLines={1}
            ellipsizeMode='tail'
          >
            {name}
          </Text>
          <Image style={styles.imageStyle} source={badge} />
          <Text
            style={styles.titleTextStyle}
            numberOfLines={1}
            ellipsizeMode='tail'
          >
            {headline}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = {
  containerStyle: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,
    marginBottom: 10
  },
  bodyContainerStyle: {
     flexDirection: 'row',
     justifyContent: 'flex-start',
     alignItems: 'center',
     width: 285,
     marginLeft: 5,
     marginRight: 5
  },
  nameTextStyle: {
    marginLeft: 8,
    marginRight: 4,
    fontSize: 15,
    fontWeight: '700',
    maxWidth: 200
  },
  titleTextStyle: {
    flex: 1,
    flexWrap: 'wrap'
  },
  imageStyle: {
    marginRight: 3
  },
  addUserIconContainerStyle: {
    height: 30,
    width: 30,
    borderRadius: 15,
    borderWidth: 0,
    backgroundColor: '#17B3EC',
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkIconContainerStyle: {
    height: 30,
    width: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: checkIconColor,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconStyle: {
    height: 16,
    width: 16
  }
};

export default connect(
  null,
  null
)(ContactDetail);
