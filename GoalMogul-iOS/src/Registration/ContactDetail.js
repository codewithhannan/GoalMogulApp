import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { connect } from 'react-redux';

// Components
import ProfileImage from '../Main/Common/ProfileImage';
import DelayedButton from '../Main/Common/Button/DelayedButton';

// Assets
import badge from '../asset/utils/badge.png';
import addUser from '../asset/utils/addUser.png';
import Icons from '../asset/base64/Icons';

// Actions
import { updateFriendship, openProfile } from '../actions';

const { CheckIcon: check } = Icons;
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
      // Currently we don't allow user to withdraw invitation on this page
      return;
      // ActionSheetIOS.showActionSheetWithOptions({
      //   options: FRIENDSHIP_BUTTONS,
      //   cancelButtonIndex: CANCEL_INDEX,
      // },
      // (buttonIndex) => {
      //   console.log('button clicked', FRIENDSHIP_BUTTONS[buttonIndex]);
      //   switch (buttonIndex) {
      //     case WITHDRAW_INDEX:
      //       this.props.updateFriendship(_id, '', 'deleteFriend', TAB_KEY, () => {
      //         this.setState({ requested: false });
      //       });
      //       break;
      //     default:
      //       return;
      //   }
      // });
    }
    this.props.updateFriendship(_id, '', 'requestFriend', TAB_KEY, () => {
      this.setState({ requested: true });
    });
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

  render() {
    // console.log('item is: ', this.props.item.item);
    const { name, headline, _id, profile } = this.props.item;
    return (
      <View style={styles.containerStyle}>
        <ProfileImage 
          imageStyle={{ height: 30, width: 30, borderRadius: 4 }}
          imageUrl={profile ? profile.image : undefined}
          imageContainerStyle={{ ...styles.imageContainerStyle }}
          userId={_id}
        />
        {/* <View
          style={{
            ...styles.addUserIconContainerStyle,
            backgroundColor: '#d8d8d8',
            borderWidth: 0
          }}
        /> */}
        <DelayedButton 
          style={styles.bodyContainerStyle}
          activeOpacity={0.6}
          onPress={() => this.props.openProfile(_id)}
        >
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
        </DelayedButton>
        <View style={{ justifyContent: 'flex-end', flexDirection: 'row' }}>
        <DelayedButton 
          activeOpacity={0.6} 
          onPress={this.onFriendRequest.bind(this, _id)}
        >
          {this.renderButton()}
        </DelayedButton>
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
    flex: 1,
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
  imageContainerStyle: {
    borderWidth: 0.5,
    padding: 0.5,
    borderColor: 'lightgray',
    alignItems: 'center',
    borderRadius: 5,
    alignSelf: 'flex-start',
    backgroundColor: 'white'
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
  {
    updateFriendship,
    openProfile
  }
)(ContactDetail);
