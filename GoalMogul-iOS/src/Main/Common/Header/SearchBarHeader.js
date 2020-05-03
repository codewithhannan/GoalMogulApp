/**
 * TODO: add prop types for this component. Start documenting from version 0.4.1
 * 
 * props
 * 
 * tutorialOn: describe if there is any tutorial for the component
 * Sample usage is at:
 * tutorialOn={{
      rightIcon: {
          iconType: 'menu',
          tutorialText: this.props.tutorialText[2],
          order: 2,
          name: 'meettab_menu'
      }
  }}
 */
import React, { Component } from 'react';
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    Platform
} from 'react-native';
import R from 'ramda';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import Constants from 'expo-constants';
import { walkthroughable, CopilotStep } from 'react-native-copilot-gm';

/* Asset */
import Logo from '../../../asset/header/logo.png';
import IconMenu from '../../../asset/header/menu.png';
import IconMeet from '../../../asset/header/meet.png';
import IconSearch from '../../../asset/header/search.png';
import BackButton from '../../../asset/utils/back.png';
import FriendsSettingIcon from '../../../asset/utils/friendsSettingIcon.png';

import { actionSheet, switchByButtonIndex } from '../ActionSheetFactory';

/* Component */
import DelayedButton from '../Button/DelayedButton';

/* Utils */
import { componentKeyByTab } from '../../../redux/middleware/utils';

/* Actions */
import {
    back,
    openProfile,
    openSetting,
    blockUser
} from '../../../actions';
import { openMyEventTab } from '../../../redux/modules/event/MyEventTabActions';
import { openMyTribeTab } from '../../../redux/modules/tribe/MyTribeTabActions';
import { createReport } from '../../../redux/modules/report/ReportActions';

// styles
import { GM_BLUE, GM_BLUE_LIGHT_LIGHT } from '../../../styles';

import { IPHONE_MODELS } from '../../../Utils/Constants';
import { getUserData } from '../../../redux/modules/User/Selector';


const tintColor = 'white';
const rightIconColor = '#333';
// For profile friend setting ActionSheetIOS
const FRIENDSHIP_SETTING_BUTTONS = ['Block', 'Report', 'Cancel'];
const CANCEL_INDEX = 2;

const DEBUG_KEY = '[ Component SearchBarHeader ]';
const WalkableView = walkthroughable(View);

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
                    () => alert(`You have successfully blocked ${this.props.profileUserName}. ${text}`)
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
    };

    renderLeftIcon() {
        const height = this.props.backButton ? 23 : 38;
        return (
            <DelayedButton
                activeOpacity={0.6}
                onPress={this.props.backButton ? this.handleBackOnClick.bind(this) : ()=>{}}
            >
                <Image
                    source={this.props.backButton ? BackButton : Logo }
                    style={{ height, width: 38, tintColor }}
                />
            </DelayedButton>
        );
    }

    /**
     * @param setting:
     * @param haveSetting:
     * @param pageSetting: if a page needs a pageSetting icon, ..., then it needs
     *        to pass in pageSetting and handlePageSetting
     * @param rightIcon:
     */
    renderRightIcons() {
        const { menuOnPress, tutorialOn } = this.props;
        const hasRightIconTutorial = tutorialOn && tutorialOn.rightIcon;

        // On other people's profile page
        if ((this.props.setting && !this.props.haveSetting) || this.props.pageSetting) {
            const { handlePageSetting } = this.props;
            return (
                <DelayedButton
                    onPress={handlePageSetting || this.handleFriendsSettingOnClick.bind(this)}
                    touchableWithoutFeedback
                >
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Image style={{ height: 30, width: 35, tintColor }} source={FriendsSettingIcon} />
                    </View>
                </DelayedButton>
            );
        }

        // Standard search bar menu
        if (this.props.rightIcon === 'menu') {
            // has tutorial for right icon menu
            if (hasRightIconTutorial && tutorialOn.rightIcon.iconType === 'menu') {
                return (
                    <CopilotStep text={tutorialOn.rightIcon.tutorialText} order={tutorialOn.rightIcon.order} name={tutorialOn.rightIcon.name}>
                        <WalkableView>
                            <TouchableOpacity
                                activeOpacity={0.6}
                                onPress={menuOnPress || this.handleMenuIconOnClick}
                                style={{ ...styles.headerRightContaner }}
                            >
                                <Image style={{ height: 24, width: 24, tintColor: rightIconColor}} source={IconMenu} />
                            </TouchableOpacity>
                        </WalkableView>
                    </CopilotStep>
                );
            }
            return (
                <View style={{ flexDirection: "row" }}>
                    <DelayedButton
                        activeOpacity={0.6}
                        onPress={() => {
                            const componentKeyToOpen = componentKeyByTab(this.props.navigationTab, 'searchLightBox');
                            Actions.push(componentKeyToOpen);
                        }}
                        style={styles.headerRightContaner}
                    >
                        <Image style={{ height: 18, width: 18, tintColor: rightIconColor }} source={IconSearch} />
                    </DelayedButton>
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={() => {
                            const componentKeyToOpen = componentKeyByTab(this.props.navigationTab, 'meet');
                            Actions.push(componentKeyToOpen) }}
                        style={{ ...styles.headerRightContaner }}
                    >
                        <Image style={{ height: 21, width: 21, tintColor: rightIconColor }} source={IconMeet} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={menuOnPress || this.handleMenuIconOnClick}
                        style={{ ...styles.headerRightContaner }}
                    >
                        <Image style={{ height: 24, width: 24, tintColor: rightIconColor }} source={IconMenu} />
                    </TouchableOpacity>
                </View>
            );
        }

        // Empty dummy view as default
        return (
            <View style={styles.headerRightImage} />
        );
    }

    renderTitle() {
        if (this.props.title) {
            const titleColor = tintColor;
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, color: titleColor }} >
                        {this.props.title}
                    </Text>
                </View>
            );
        }
        return (
            <View style={{ flex: 1 }} />
        );
    }

    render() {
        const paddingTop = (
            Platform.OS === 'ios' &&
            IPHONE_MODELS.includes(Constants.platform.ios.model.toLowerCase())
        ) ? 40 : 55;

        return (
            <View style={{ ...styles.headerStyle, paddingTop }}>
                {this.renderLeftIcon()}
                {this.renderTitle()}
                {this.renderRightIcons()}
            </View>
        );
    }
}

const styles = {
    headerStyle: {
        flexDirection: 'row',
        backgroundColor: GM_BLUE,
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerLeftImage: {
        width: 32,
        height: 32,
        backgroundColor: 'white'
    },
    headerRightContaner: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: GM_BLUE_LIGHT_LIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8
    },
    searchButtonContainerStyle: {
        height: 36,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    searchPlaceHolderTextStyle: {
        fontSize: 14,
        alignSelf: 'center',
        color: '#4ec9f3',
        marginLeft: 5
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.4,
        shadowRadius: 2,
        backgroundColor: 'white'
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
        navigationTab,
        user
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
