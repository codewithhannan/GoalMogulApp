/** @format */

import React from 'react'
import { View, Image, Text, Platform, Alert, Linking } from 'react-native'
import { connect } from 'react-redux'
import * as WebBrowser from 'expo-web-browser'
import { Actions } from 'react-native-router-flux'
import R from 'ramda'

// Components
import DelayedButton from '../Common/Button/DelayedButton'
import { actionSheet, switchByButtonIndex } from '../Common/ActionSheetFactory'

// Actions
import { openMyEventTab } from '../../redux/modules/event/MyEventTabActions'

import { openMyTribeTab } from '../../redux/modules/tribe/MyTribeTabActions'

import { openMeet, openSetting, logout } from '../../actions'
import InviteFriendModal from '../MeetTab/Modal/InviteFriendModal'

import {
    showNextTutorialPage,
    startTutorial,
    updateNextStepNumber,
} from '../../redux/modules/User/TutorialActions'

// Assets
import Setting from '../../asset/header/setting.png'
import Icons from '../../asset/base64/Icons'
import {
    IPHONE_MODELS,
    BUG_REPORT_URL,
    PRIVACY_POLICY_URL,
    DEVICE_MODEL,
} from '../../Utils/Constants'
import { default_style } from '../../styles/basic'
import { IS_SMALL_PHONE } from '../../styles'

const DEBUG_KEY = '[ UI Menu ]'
const { AccountMultiple, MessageIcon } = Icons

const marginBottom = IS_SMALL_PHONE ? 10 : 40

class Menu extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            showInviteFriendModal: false,
        }
    }

    handleTutorialOnPress = () => {
        const tutorialSwitchCases = switchByButtonIndex([
            [
                R.equals(0),
                () => {
                    console.log(
                        `${DEBUG_KEY}: [handleTutorialOnPress]: Create goal walkthrough`
                    )
                    Actions.pop()
                    Actions.jump('homeTab')
                    setTimeout(() => {
                        this.props.startTutorial('create_goal', 'home')
                    }, 500)
                },
            ],
            // [R.equals(1), () => {
            //     console.log(`${DEBUG_KEY}: [handleTutorialOnPress]: Friends Tab Walkthrough`);
            //     Actions.pop();
            //     Actions.jump('meetTab');
            //     setTimeout(() => {
            //         this.props.startTutorial('meet_tab_friend', 'meet_tab');
            //     }, 500);
            // }]
        ])

        const shareToActionSheet = actionSheet(
            [
                'How to Add Goals - Tutorial',
                'Grow Your Network - Tutorial',
                'Cancel',
            ],
            2,
            tutorialSwitchCases
        )
        return shareToActionSheet()
    }

    handleBugReportOnPress = async () => {
        const url = BUG_REPORT_URL
        let result = await WebBrowser.openBrowserAsync(url)
        console.log(`${DEBUG_KEY}: close bug report link with res: `, result)
    }

    handlePrivacyPolicyOnPress = async () => {
        const url = PRIVACY_POLICY_URL
        let result = await WebBrowser.openBrowserAsync(url, { showTitle: true })
        console.log(
            `${DEBUG_KEY}: close privacy policy link with res: `,
            result
        )
    }

    openInviteFriendModal = () => {
        this.setState({ ...this.state, showInviteFriendModal: true })
    }

    closeInviteFriendModal = () => {
        this.setState({ ...this.state, showInviteFriendModal: false })
    }

    handleInviteFriend = () => {
        // Close side drawer
        // Open invite friend modal
    }

    render() {
        const paddingTop =
            Platform.OS === 'ios' && IPHONE_MODELS.includes(DEVICE_MODEL)
                ? 30
                : 40

        return (
            <View style={{ flex: 1 }}>
                <View style={{ ...styles.headerStyle, paddingTop }}>
                    <View style={{ height: 15 }} />
                </View>

                <DelayedButton
                    activeOpacity={0.6}
                    onPress={() => this.openInviteFriendModal()}
                    style={styles.buttonStyle}
                >
                    <Image
                        source={MessageIcon}
                        style={[styles.iconStyle, { tintColor: 'grey' }]}
                    />
                    <Text style={styles.titleTextStyle}>Invite a friend</Text>
                </DelayedButton>

                <DelayedButton
                    activeOpacity={0.6}
                    onPress={() => this.props.openMeet()}
                    style={styles.buttonStyle}
                >
                    <Image
                        source={AccountMultiple}
                        style={[styles.iconStyle, { tintColor: 'grey' }]}
                    />
                    <Text style={styles.titleTextStyle}>My friends</Text>
                </DelayedButton>

                {/* Trending goals - this is unavailable for now, so commented out. */}
                {/* <DelayedButton
                    activeOpacity={0.6}
                    onPress={() => this.props.openMeet()}
                    style={styles.buttonStyle}
                >
                    <Image
                        source={AccountMultiple}
                        style={[styles.iconStyle, { tintColor: 'black' }]}
                    />
                    <Text style={styles.titleTextStyle}>Trending goals</Text>
                </DelayedButton> */}

                <DelayedButton
                    activeOpacity={0.6}
                    onPress={() => this.props.openSetting()}
                    style={styles.buttonStyle}
                >
                    <Image
                        source={Setting}
                        style={[styles.iconStyle, { tintColor: 'grey' }]}
                    />
                    <Text style={styles.titleTextStyle}>Account settings</Text>
                </DelayedButton>

                {/* Bottom Section */}
                <View style={styles.bottomContainer}>
                    <View style={[{ padding: 20 }]}>
                        <DelayedButton
                            activeOpacity={0.6}
                            onPress={() =>
                                Linking.openURL('mailto:support@goalmogul.com')
                            }
                            style={styles.buttonStyle}
                        >
                            <Text style={styles.bottomText}>Help</Text>
                        </DelayedButton>
                        <DelayedButton
                            activeOpacity={0.6}
                            onPress={() => this.handleBugReportOnPress()}
                            style={styles.buttonStyle}
                        >
                            <Text style={styles.bottomText}>
                                Give us feedback
                            </Text>
                        </DelayedButton>
                        <DelayedButton
                            activeOpacity={0.6}
                            onPress={() => this.handlePrivacyPolicyOnPress()}
                            style={styles.buttonStyle}
                        >
                            <Text style={styles.bottomText}>
                                Privacy policy
                            </Text>
                        </DelayedButton>
                    </View>

                    <DelayedButton
                        activeOpacity={0.6}
                        onPress={() => {
                            Alert.alert('Log out', 'Are you sure to log out?', [
                                {
                                    text: 'Cancel',
                                    onPress: () =>
                                        console.log('user cancel logout'),
                                },
                                {
                                    text: 'Confirm',
                                    onPress: () => this.props.logout(),
                                },
                            ])
                        }}
                        style={styles.logOutButtonStyle}
                    >
                        <Text
                            style={[
                                styles.titleTextStyle,
                                { color: '#FF2B2C' },
                            ]}
                        >
                            Log out
                        </Text>
                    </DelayedButton>
                </View>
                <InviteFriendModal
                    isVisible={this.state.showInviteFriendModal}
                    closeModal={this.closeInviteFriendModal}
                />
            </View>
        )
    }
}

const styles = {
    headerStyle: {
        flexDirection: 'row',
        paddingTop: 40,
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 10,
        alignItems: 'center',
    },
    buttonStyle: {
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    iconStyle: {
        marginLeft: 15,
        marginRight: 15,
        height: 20,
        width: 20,
    },
    titleTextStyle: default_style.buttonText_1,
    bottomContainer: {
        bottom: 0,
        position: 'absolute',
        width: '100%',
    },
    bottomText: default_style.buttonText_1,
    logOutButtonStyle: {
        // backgroundColor: '#F2F2F2',
        paddingLeft: 20,
        marginBottom: marginBottom,
    },
}

const mapStateToProps = (state) => {
    const { user } = state.user

    return {
        user,
    }
}

export default connect(mapStateToProps, {
    openMyEventTab,
    openMyTribeTab,
    openMeet,
    openSetting,
    logout,
    // Tutorial related,
    showNextTutorialPage,
    startTutorial,
    updateNextStepNumber,
})(Menu)
