import React, { Component } from 'react';
import {
  View,
  Image,
  TouchableWithoutFeedback,
  Text,
  TouchableOpacity
} from 'react-native';
import R from 'ramda';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

/* Asset */
import Logo from '../../../asset/header/logo.png';
import IconMenu from '../../../asset/header/menu.png';
import Setting from '../../../asset/header/setting.png';
import BackButton from '../../../asset/utils/back.png';
import FriendsSettingIcon from '../../../asset/utils/friendsSettingIcon.png';

import { actionSheet, switchByButtonIndex } from '../ActionSheetFactory';

/* Actions */
import {
  back,
  openProfile,
  openSetting,
  blockUser
} from '../../../actions';

const tintColor = '#33485e';

// For profile friend setting ActionSheetIOS
const FRIENDSHIP_SETTING_BUTTONS = ['Block', 'Report', 'Cancel'];
const CANCEL_INDEX = 2;

const DEBUG_KEY = '[ Component SearchBarHeader ]';

/**
  TODO: refactor element to have consistent behavior
  rightIcon: 'empty' or null,
  backButton: true or false,
  setting: true or false
*/
class SearchBarHeader extends Component {
  state = {
    overlay: false
  }

  handleBackOnClick() {
    if (this.props.onBackPress) {
      this.props.onBackPress();
    }
    this.props.back();
  }

  handleProfileOnClick() {
    this.props.openProfile(this.props.userId);
  }

  handleSettingOnClick() {
    // TODO: open account setting page
    this.props.openSetting();
  }

  handleFriendsSettingOnClick = () => {
    const text = 'Please go to Settings to manage blocked users.';
    const switchCases = switchByButtonIndex([
      [R.equals(0), () => {
        console.log(`${DEBUG_KEY} User blocks _id: `, this.props.profileUserId);
        this.props.blockUser(
          this.props.profileUserId,
          () => alert(
            `You have successfully blocked ${this.props.profileUserName}. ${text}`
          )
        );
      }],
      [R.equals(1), () => {
        console.log(`${DEBUG_KEY} User reports profile with _id: `, this.props.profileUserId);
      }]
    ]);
    const friendsSettingActionSheet = actionSheet(
      FRIENDSHIP_SETTING_BUTTONS,
      CANCEL_INDEX,
      switchCases
    );
    friendsSettingActionSheet();
  }

  renderSearchBarLeftIcon() {
    if (this.props.backButton) {
      return (
        <View style={{ height: 25, width: 25 }}>
          <TouchableOpacity onPress={this.handleBackOnClick.bind(this)}>
            {/*<Icon
              type='entypo'
              name='chevron-thin-left'
              color='#35475d'
              containerStyle={{ justifyContent: 'flex-start' }}
            />
            */}
            <Image
              source={BackButton}
              style={{ height: 25, width: 25, tintColor: '#32485f' }}
            />
          </TouchableOpacity>
        </View>

      );
    }
    return (
      <TouchableOpacity
        style={styles.headerLeftImage}
        onPress={this.handleProfileOnClick.bind(this)}
      >
        <Image style={{ ...styles.headerLeftImage, tintColor }} source={Logo} />
      </TouchableOpacity>
    );
  }

  renderSearchBarRightIcon() {
    // On other people's profile page
    if (this.props.setting && !this.props.haveSetting) {
    // if (this.props.setting && true) {
      return (
        <TouchableWithoutFeedback onPress={this.handleFriendsSettingOnClick.bind(this)}>
          <Image
            style={{ ...styles.headerRightImage, tintColor, height: 28 }}
            source={FriendsSettingIcon}
          />
        </TouchableWithoutFeedback>
      );
    }

    // On self profile page
    if (this.props.setting && this.props.haveSetting) {
      return (
        <TouchableWithoutFeedback onPress={this.handleSettingOnClick.bind(this)}>
          <Image style={styles.headerRightImage} source={Setting} />
        </TouchableWithoutFeedback>
      );
    }

    // Standard search bar menu
    if (this.props.rightIcon === 'menu') {
      return (
        <Image style={styles.headerRightImage} source={IconMenu} />
      );
    }

    // Empty dummy view as default
    return (
      <View style={styles.headerRightImage} />
    );
  }

  renderSearchBarOrTitle() {
    if (this.props.title) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 20 }} >
            {this.props.title}
          </Text>
        </View>
      );
    }
    return (
      <TouchableOpacity onPress={() => Actions.push('searchLightBox')}>
        <View style={styles.searchButtonContainerStyle}>
          <View style={{ marginBottom: 3 }}>
            <Icon
              type='font-awesome'
              name='search'
              size={17}
              color='#4ec9f3'
            />
          </View>
          <Text style={styles.searchPlaceHolderTextStyle}>
            Search GoalMogul
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={styles.headerStyle}>
        {this.renderSearchBarLeftIcon()}
        {this.renderSearchBarOrTitle()}
        {this.renderSearchBarRightIcon()}
      </View>
    );
  }
}

const styles = {
  // Styles for search method 1
  searchContainerStyle: {
    backgroundColor: '#ffffff',
    borderTopColor: '#ffffff',
    borderBottomColor: '#ffffff',
    padding: 0,
    height: 28,
    width: 250,
    marginRight: 5,
  },
  searchInputStyle: {
    backgroundColor: '#f3f4f6',
    fontSize: 12,
    height: 28,
  },
  searchIconStyle: {
    top: 14,
    fontSize: 13
  },
  headerStyle: {
    flexDirection: 'row',
    backgroundColor: '#4ec9f3',
    // backgroundColor: '#6bc6f0',
    paddingTop: 30,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerLeftImage: {
    width: 30,
    height: 30,
  },
  headerRightImage: {
    width: 25,
    height: 21,
  },
  // Styles for method 2
  // It's currently being used
  searchButtonContainerStyle: {
    height: 30,
    width: 260,
    backgroundColor: '#1998c9',
    borderRadius: 16,
    padding: 0,
    marginRight: 14,
    marginLeft: 14,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center'
  },
  searchPlaceHolderTextStyle: {
    fontSize: 13,
    alignSelf: 'center',
    // color: '#b2b3b4',
    color: '#4ec9f3',
    marginLeft: 5
  }
};

const mapStateToProps = state => {
  const { userId } = state.user;
  const profileUserId = state.profile.userId;
  const profileUserName = state.profile.user.name;
  const haveSetting = state.profile.userId.toString() === state.user.userId.toString();

  return {
    userId,
    haveSetting,
    profileUserId,
    profileUserName
  };
};

export default connect(
  mapStateToProps,
  {
    back,
    openProfile,
    openSetting,
    blockUser
  }
)(SearchBarHeader);
