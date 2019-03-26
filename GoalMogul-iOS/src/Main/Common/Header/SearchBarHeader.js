import React, { Component } from 'react';
import {
  View,
  Image,
  TouchableWithoutFeedback,
  Text,
  TouchableOpacity,
  Platform
} from 'react-native';
import R from 'ramda';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Constants } from 'expo';

/* Asset */
// import Logo from '../../../asset/header/logo.png';
import IconMenu from '../../../asset/header/menu.png';
import Setting from '../../../asset/header/setting.png';
import BackButton from '../../../asset/utils/back.png';
import FriendsSettingIcon from '../../../asset/utils/friendsSettingIcon.png';
import profilePic from '../../../asset/utils/defaultUserProfile.png';

import { actionSheet, switchByButtonIndex } from '../ActionSheetFactory';

/* Component */
import DelayedButton from '../Button/DelayedButton';
import {
  SearchIcon
} from '../../../Utils/Icons';

// Utils
import { componentKeyByTab } from '../../../redux/middleware/utils';

/* Actions */
import {
  back,
  openProfile,
  openSetting,
  blockUser
} from '../../../actions';

import {
  openMyEventTab
} from '../../../redux/modules/event/MyEventTabActions';

import {
  openMyTribeTab
} from '../../../redux/modules/tribe/MyTribeTabActions';

import {
  createReport
} from '../../../redux/modules/report/ReportActions';

// styles
import {
  APP_BLUE,
  APP_DEEP_BLUE
} from '../../../styles';

import {
  IPHONE_MODELS,
  IMAGE_BASE_URL
} from '../../../Utils/Constants';
import { getUserData } from '../../../redux/modules/User/Selector';

const tintColor = '#33485e';

// For profile friend setting ActionSheetIOS
const FRIENDSHIP_SETTING_BUTTONS = ['Block', 'Report', 'Cancel'];
const CANCEL_INDEX = 2;

const DEBUG_KEY = '[ Component SearchBarHeader ]';
const SHARE_TO_MENU_OPTTIONS = ['My Tribes', 'My Events', 'Cancel'];
const CANCEL_INDEX_MEN = 2;

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
      return;
    }
    this.props.back();
  }

  handleProfileOnClick() {
    this.props.openProfile(this.props.appUserId);
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
        this.props.createReport(this.props.profileUserId, 'User');
      }]
    ]);
    const friendsSettingActionSheet = actionSheet(
      FRIENDSHIP_SETTING_BUTTONS,
      CANCEL_INDEX,
      switchCases
    );
    friendsSettingActionSheet();
  }

  handleMenuIconOnClick = () => {
    Actions.drawerOpen();
    // Menu options are moved to drawer in /Main/Menu/Menu.js
    // const menuSwitchCases = switchByButtonIndex([
    //   [R.equals(0), () => {
    //     // User choose to share to feed
    //     console.log(`${DEBUG_KEY} User choose My Tribes `);
    //     this.props.openMyTribeTab();
    //   }],
    //   [R.equals(1), () => {
    //     // User choose to share to an event
    //     console.log(`${DEBUG_KEY} User choose My Events `);
    //     this.props.openMyEventTab();
    //   }]
    // ]);
    //
    // const menuActionSheet = actionSheet(
    //   SHARE_TO_MENU_OPTTIONS,
    //   CANCEL_INDEX,
    //   menuSwitchCases
    // );
    // return menuActionSheet();
  };

  renderSearchBarLeftIcon() {
    if (this.props.backButton) {
      const backButtonTintColor = this.props.title ? 'white' : tintColor;
      return (
        <View style={{ height: 25, width: 25 }}>
          <DelayedButton activeOpacity={0.6} onPress={this.handleBackOnClick.bind(this)}>
            {/*<Icon
              type='entypo'
              name='chevron-thin-left'
              color='#35475d'
              containerStyle={{ justifyContent: 'flex-start' }}
            />
            // tintColor: '#32485f' for backbutton
            */}
            <Image
              source={BackButton}
              style={{ height: 25, width: 25, tintColor: backButtonTintColor }}
            />
          </DelayedButton>
        </View>

      );
    }
    return this.renderProfileImage();
    // return (
    //   <TouchableOpacity activeOpacity={0.6}
    //     style={styles.headerLeftImage}
    //     onPress={this.handleProfileOnClick.bind(this)}
    //   >
    //     <Image style={{ ...styles.headerLeftImage, tintColor }} source={Logo} />
    //   </TouchableOpacity>
    // );
  }

  // This is to replace logo image with user profile preview
  renderProfileImage() {
    let image = this.props.image;
    // console.log('image is: ', image);
    let profileImage = (
      <DelayedButton
        activeOpacity={0.6}
        style={styles.headerLeftImage}
        onPress={this.handleProfileOnClick.bind(this)}
      >
        <Image
          style={{ ...styles.headerLeftImage }}
          resizeMode='contain'
          source={profilePic}
        />
      </DelayedButton>

    );
    if (image) {
      image = `${IMAGE_BASE_URL}${image}`;
      profileImage = (
        <DelayedButton
          activeOpacity={0.6}
          style={styles.headerLeftImage}
          onPress={this.handleProfileOnClick.bind(this)}
        >
          <Image
            style={{ ...styles.headerLeftImage, borderWidth: 1, borderColor: 'white' }}
            resizeMode='contain'
            source={{ uri: image }}
          />
        </DelayedButton>
      );
    }
    return profileImage;
  }

  /**
   * @param setting:
   * @param haveSetting:
   * @param pageSetting: if a page needs a pageSetting icon, ..., then it needs
   *        to pass in pageSetting and handlePageSetting
   * @param rightIcon:
   */
  renderSearchBarRightIcon() {
    // On other people's profile page
    if ((this.props.setting && !this.props.haveSetting) || this.props.pageSetting) {
    // if (this.props.setting && true) {
      const { handlePageSetting } = this.props;
      return (
        <DelayedButton
          onPress={handlePageSetting || this.handleFriendsSettingOnClick.bind(this)}
          touchableWithoutFeedback
        >
          <Image
            style={{ ...styles.headerRightImage, tintColor, height: 21 }}
            source={FriendsSettingIcon}
          />
        </DelayedButton>
      );
    }

    // On self profile page
    if (this.props.setting && this.props.haveSetting) {
      return (
        <TouchableWithoutFeedback onPress={this.handleSettingOnClick.bind(this)}>
          <Image style={{ ...styles.headerRightImage, tintColor }} source={Setting} />
        </TouchableWithoutFeedback>
      );
    }

    // Standard search bar menu
    const { menuOnPress } = this.props;
    if (this.props.rightIcon === 'menu') {
      return (
        <TouchableOpacity activeOpacity={0.6} onPress={menuOnPress || this.handleMenuIconOnClick}>
          <Image style={{ ...styles.headerRightImage, tintColor }} source={IconMenu} />
        </TouchableOpacity>
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
          <Text style={{ fontSize: 20, color: 'white' }} >
            {this.props.title}
          </Text>
        </View>
      );
    }
    return (
      <DelayedButton 
        activeOpacity={0.6} 
        onPress={() => {
          const componentKeyToOpen = componentKeyByTab(this.props.navigationTab, 'searchLightBox');
          Actions.push(`${componentKeyToOpen}`);
        }}
      >
        <View style={styles.searchButtonContainerStyle}>
          <SearchIcon 
            iconContainerStyle={{ marginBottom: 3, marginTop: 1 }} 
            iconStyle={{ tintColor: '#4ec9f3', height: 15, width: 15 }}
          />
          <Text style={styles.searchPlaceHolderTextStyle}>
            Search GoalMogul
          </Text>
        </View>
      </DelayedButton>
    );
  }

  render() {
    const paddingTop = (
      Platform.OS === 'ios' &&
      IPHONE_MODELS.includes(Constants.platform.ios.model.toLowerCase())
    ) ? 30 : 40;

    return (
      <View style={{ ...styles.headerStyle, paddingTop }}>
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
    // backgroundColor: '#f3f4f6',
    backgroundColor: '#0397CB',
    fontSize: 12,
    height: 28,
  },
  searchIconStyle: {
    top: 14,
    fontSize: 13
  },
  headerStyle: {
    flexDirection: 'row',
    // backgroundColor: '#4ec9f3',
    backgroundColor: APP_BLUE,
    // backgroundColor: '#6bc6f0',
    paddingTop: 40,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerLeftImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },
  headerRightImage: {
    width: 27,
    height: 21,
  },
  // Styles for method 2
  // It's currently being used
  searchButtonContainerStyle: {
    height: 30,
    width: 260,
    // backgroundColor: '#1998c9',
    backgroundColor: APP_DEEP_BLUE,
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

const mapStateToProps = (state, props) => {
  const appUserId = state.user.userId;
  const { image } = state.user.user.profile; // Image is app user image
  const navigationTab = state.navigation.tab;

  // If no userId passed in, then we assume it's app userId
  const profileUserId = props.userId || appUserId; 
  const user = getUserData(state, profileUserId, 'user');
  const profileUserName = user.name;
  
  const haveSetting = appUserId.toString() === profileUserId.toString();

  return {
    haveSetting,
    profileUserId,
    profileUserName,
    image,
    appUserId,
    navigationTab
  };
};

export default connect(
  mapStateToProps,
  {
    back,
    openProfile,
    openSetting,
    blockUser,
    openMyEventTab,
    openMyTribeTab,
    createReport
  }
)(SearchBarHeader);
