/** @format */

import React from 'react'
import {
    View,
    Image,
    Text,
    Platform,
    Alert,
    Linking,
    TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'
import * as WebBrowser from 'expo-web-browser'
import { Actions } from 'react-native-router-flux'
import R from 'ramda'
import Tooltip from 'react-native-walkthrough-tooltip'
import Svg, { Path, Circle } from 'react-native-svg'

// Components
import DelayedButton from '../Common/Button/DelayedButton'

// Actions
import { openMyEventTab } from '../../redux/modules/event/MyEventTabActions'

import { openMyTribeTab } from '../../redux/modules/tribe/MyTribeTabActions'

import { openMeet, openSetting, logout, openChallenges } from '../../actions'
import InviteFriendModal from '../MeetTab/Modal/InviteFriendModal'

import {
    showNextTutorialPage,
    startTutorial,
    updateNextStepNumber,
} from '../../redux/modules/User/TutorialActions'

// Assets
import Setting from '../../asset/header/setting.png'
import Challenges from '../../asset/icons/Challenges.png'
import Mail from '../../asset/icons/Mail.png'
import Settings from '../../asset/icons/Settings.png'
import Friends from '../../asset/icons/Friends.png'
import Feedback from '../../asset/icons/Feedback.png'
import Policy from '../../asset/icons/Policy.png'
import Logout from '../../asset/icons/LogOut.png'
import Icons from '../../asset/base64/Icons'
import Silver from '../../asset/banner/silver.png'
import Gold from '../../asset/banner/gold.png'

import {
    IPHONE_MODELS,
    BUG_REPORT_URL,
    PRIVACY_POLICY_URL,
    DEVICE_MODEL,
} from '../../Utils/Constants'
import { default_style } from '../../styles/basic'
import { IS_SMALL_PHONE } from '../../styles'

import Popup from '../Journey/Popup'
import { openPopup } from '../../actions/PopupActions'

const GOLD_CHALLENGE_URL = 'https://new5reactpages.web.app/page5'
const SILVER_CHALLENGE_URL = 'https://new5reactpages.web.app/page4'

const DEBUG_KEY = '[ UI Menu ]'
const { AccountMultiple, MessageIcon } = Icons

const marginBottom = IS_SMALL_PHONE ? 10 : 40

class Menu extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            showInviteFriendModal: false,
            toolTipVisible: false,
        }
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
                    <Text style={styles.titleTextStyle}>Invite a friend</Text>
                    <View style={{ position: 'absolute', right: 0 }}>
                        <Svg
                            width={25}
                            height={25}
                            viewBox="0 0 20 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            {...this.props}
                        >
                            <Path
                                d="M17.333 4.333L10 8.916 2.667 4.333V2.499L10 7.083l7.333-4.584v1.834zm0-3.667H2.667A1.827 1.827 0 00.833 2.499v11a1.833 1.833 0 001.834 1.834h14.666a1.833 1.833 0 001.834-1.834v-11A1.833 1.833 0 0017.333.666z"
                                fill="#828282"
                            />
                        </Svg>
                    </View>
                </DelayedButton>
                <DelayedButton
                    activeOpacity={0.6}
                    onPress={() => this.props.openMeet()}
                    style={styles.buttonStyle}
                >
                    <Text style={styles.titleTextStyle}>My friends</Text>
                    <View style={{ position: 'absolute', right: 0 }}>
                        <Svg
                            width={25}
                            height={25}
                            viewBox="0 0 20 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            {...this.props}
                        >
                            <Path
                                d="M13.667 12.583v1.833H.833v-1.833s0-3.667 6.417-3.667 6.417 3.667 6.417 3.667zm-3.209-8.709a3.208 3.208 0 10-6.416 0 3.208 3.208 0 006.416 0zm3.154 5.042a4.878 4.878 0 011.888 3.667v1.833h3.667v-1.833s0-3.328-5.555-3.667zM12.75.666a3.107 3.107 0 00-1.77.54 4.583 4.583 0 010 5.336 3.107 3.107 0 001.77.54 3.209 3.209 0 000-6.416z"
                                fill="#828282"
                            />
                        </Svg>
                    </View>
                </DelayedButton>
                {/* Trending goals - this is unavailable for now, so commented out. */}
                {/* <DelayedButton
                    activeOpacity={0.6}
                    onPress={() => this.props.openMeet()}
                    style={styles.buttonStyle}
                >
                    <Image
                        source={AccountMultiple}
                        style={[styles.iconStyle, { tintColor: '#828282' }]}
                    />
                    <Text style={styles.titleTextStyle}>Trending goals</Text>
                </DelayedButton> */}
                <DelayedButton
                    activeOpacity={0.6}
                    onPress={() => this.props.openSetting()}
                    style={styles.buttonStyle}
                >
                    <Text style={styles.titleTextStyle}>Account settings</Text>
                    <View style={{ position: 'absolute', right: 0 }}>
                        <Svg
                            width={25}
                            height={25}
                            viewBox="0 0 18 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            {...this.props}
                        >
                            <Path
                                d="M9 13.209a3.208 3.208 0 110-6.416 3.208 3.208 0 010 6.416zm6.81-2.32c.037-.292.065-.586.065-.888 0-.303-.027-.605-.064-.917l1.934-1.494a.463.463 0 00.11-.587l-1.833-3.172c-.11-.201-.358-.284-.56-.201l-2.282.916c-.477-.357-.972-.669-1.55-.898l-.338-2.429a.463.463 0 00-.459-.385H7.167a.463.463 0 00-.459.385l-.339 2.43c-.577.228-1.072.54-1.549.897L2.537 3.63a.45.45 0 00-.559.201L.145 7.003a.452.452 0 00.11.587l1.934 1.494a7.838 7.838 0 00-.064.917c0 .302.027.596.064.889L.255 12.41a.452.452 0 00-.11.587l1.833 3.172a.46.46 0 00.56.201l2.282-.925a6.37 6.37 0 001.55.907l.338 2.43c.037.22.23.384.459.384h3.666c.23 0 .422-.165.459-.385l.339-2.429a6.68 6.68 0 001.549-.907l2.283.926a.46.46 0 00.559-.202l1.833-3.172a.463.463 0 00-.11-.586l-1.934-1.522z"
                                fill="#828282"
                            />
                        </Svg>
                    </View>
                </DelayedButton>

                {/**
                 * This is the button to handle challenges
                 * */}

                <Tooltip
                    animated={true}
                    arrowSize={{ width: 16, height: 11 }}
                    backgroundColor="rgba(0,0,0,0.12)"
                    isVisible={this.state.toolTipVisible}
                    contentStyle={{
                        backgroundColor: '#EFEFEF',
                        width: 220,
                        // right: 2,
                        position: 'absolute',

                        // marginBottom: 100,
                        bottom: 430,
                        marginHorizontal: 40,

                        borderRadius: 15,
                    }}
                    content={
                        <>
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'column',
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({ toolTipVisible: false })
                                        this.props.openChallenges(
                                            SILVER_CHALLENGE_URL
                                        )
                                    }}
                                >
                                    <View
                                        style={{
                                            marginTop: 10,
                                            flexDirection: 'row',
                                            justifyContent: 'space-evenly',
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 21,
                                                fontWeight: '400',
                                            }}
                                        >
                                            Silver Challenges
                                        </Text>
                                        <View style={{ top: 5 }}>
                                            <Image
                                                source={Silver}
                                                style={{
                                                    height: 20,
                                                    width: 22,
                                                }}
                                            />
                                        </View>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({ toolTipVisible: false })
                                        this.props.openChallenges(
                                            GOLD_CHALLENGE_URL
                                        )
                                    }}
                                >
                                    <View
                                        style={{
                                            marginTop: 10,
                                            flexDirection: 'row',
                                            justifyContent: 'space-evenly',
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 21,
                                                fontWeight: '400',
                                            }}
                                        >
                                            Gold Challenges
                                        </Text>
                                        <View style={{ top: 2, left: 2 }}>
                                            <Image
                                                source={Gold}
                                                style={{
                                                    height: 20,
                                                    width: 22,
                                                }}
                                            />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </>
                    }
                    placement="bottom"
                    onClose={() => this.setState({ toolTipVisible: false })}
                />

                <DelayedButton
                    activeOpacity={0.6}
                    onPress={() =>
                        // this.props.openChallenges(
                        //     'https://new5reactpages.web.app/page4'
                        // )
                        this.setState({ toolTipVisible: true })
                    }
                    style={styles.buttonStyle}
                >
                    <Text style={styles.titleTextStyle}>Challenges</Text>
                    <View style={{ position: 'absolute', right: 0 }}>
                        <Svg
                            width={25}
                            height={25}
                            viewBox="0 0 22 22"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            {...this.props}
                        >
                            <Path
                                d="M20.9 1.1h-3.3V0H4.4v1.1H1.1C.44 1.1 0 1.54 0 2.2v2.64c0 2.53 1.87 4.62 4.4 4.95v.11c0 3.19 2.2 5.83 5.17 6.49L8.8 18.7H6.27c-.44 0-.88.33-.99.77L4.4 22h13.2l-.88-2.53c-.11-.44-.55-.77-.99-.77H13.2l-.77-2.31c2.97-.66 5.17-3.3 5.17-6.49v-.11c2.53-.33 4.4-2.42 4.4-4.95V2.2c0-.66-.44-1.1-1.1-1.1zM4.4 7.59c-1.21-.33-2.2-1.43-2.2-2.75V3.3h2.2v4.29zM13.2 11L11 9.79 8.8 11l.55-2.2L7.7 6.6h2.31L11 4.4l.99 2.2h2.31l-1.65 2.2.55 2.2zm6.6-6.16c0 1.32-.99 2.53-2.2 2.75V3.3h2.2v1.54z"
                                fill="#828282"
                            />
                        </Svg>
                    </View>
                </DelayedButton>

                {/* Bottom Section */}
                <View style={styles.bottomContainer}>
                    <View style={{ marginBottom: 10 }}>
                        <DelayedButton
                            activeOpacity={0.6}
                            onPress={() =>
                                Linking.openURL(
                                    `mailto:support@goalmogul.com?subject=${this.props.name}&body=body`
                                )
                            }
                            style={styles.buttonStyle}
                        >
                            <Text style={styles.bottomText}>
                                Give us feedback
                            </Text>
                            <View style={{ position: 'absolute', right: 0 }}>
                                <Svg
                                    width={25}
                                    height={25}
                                    viewBox="0 0 18 18"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    {...this.props}
                                >
                                    <Path
                                        d="M17.974 6.934a.527.527 0 00-.425-.359l-5.58-.81L9.473.707a.527.527 0 00-.946 0L6.032 5.764l-5.58.811a.527.527 0 00-.293.9l4.038 3.936-.953 5.557a.527.527 0 00.765.556L9 14.9l4.99 2.624a.527.527 0 00.766-.556l-.953-5.557 4.038-3.936a.527.527 0 00.133-.54z"
                                        fill="#828282"
                                    />
                                </Svg>
                            </View>
                        </DelayedButton>
                        <DelayedButton
                            activeOpacity={0.6}
                            onPress={() => this.handlePrivacyPolicyOnPress()}
                            style={styles.buttonStyle}
                        >
                            <Text style={styles.bottomText}>
                                Privacy policy
                            </Text>
                            <View style={{ position: 'absolute', right: 0 }}>
                                <Svg
                                    width={24}
                                    height={24}
                                    viewBox="0 0 18 18"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    {...this.props}
                                >
                                    <Path
                                        d="M16.817 2.52a.588.588 0 00-.425-.487L9.158.022a.588.588 0 00-.316 0L1.608 2.033a.588.588 0 00-.425.486c-.042.302-1 7.431 1.456 10.977 2.452 3.543 6.07 4.45 6.223 4.487a.586.586 0 00.276 0c.153-.037 3.77-.944 6.223-4.487C17.817 9.95 16.86 2.821 16.817 2.52zM13.665 6.68l-4.934 4.935a.587.587 0 01-.832 0L4.848 8.565a.588.588 0 010-.832l.606-.606c.23-.23.602-.23.831 0l2.03 2.03 3.913-3.914a.588.588 0 01.832 0l.605.606c.23.23.23.602 0 .832z"
                                        fill="#828282"
                                    />
                                </Svg>
                            </View>
                        </DelayedButton>
                        <DelayedButton
                            activeOpacity={0.6}
                            onPress={() => {
                                Alert.alert(
                                    'Log out',
                                    'Are you sure you want to log out?',
                                    [
                                        {
                                            text: 'Cancel',
                                            onPress: () =>
                                                console.log(
                                                    'user cancel logout'
                                                ),
                                        },
                                        {
                                            text: 'Confirm',
                                            onPress: () => this.props.logout(),
                                        },
                                    ]
                                )
                            }}
                            style={styles.logOutButtonStyle}
                        >
                            <Text
                                style={[
                                    styles.titleTextStyle,
                                    { color: '#42C0F5', fontWeight: '600' },
                                ]}
                            >
                                Log out
                            </Text>
                            <View style={{ position: 'absolute', right: 0 }}>
                                <Svg
                                    width={25}
                                    height={25}
                                    viewBox="0 0 12 18"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    {...this.props}
                                >
                                    <Path
                                        d="M11.25 9.75a.75.75 0 00-.75.75v3a.75.75 0 01-.75.75H7.5V3c0-.64-.408-1.213-1.022-1.426L6.256 1.5H9.75a.75.75 0 01.75.75V4.5a.75.75 0 101.5 0V2.25C12 1.01 10.99 0 9.75 0H1.687c-.028 0-.052.013-.08.016C1.571.013 1.537 0 1.5 0 .673 0 0 .673 0 1.5V15c0 .64.408 1.212 1.021 1.425l4.514 1.505c.153.047.305.07.465.07.827 0 1.5-.673 1.5-1.5v-.75h2.25c1.24 0 2.25-1.01 2.25-2.25v-3a.75.75 0 00-.75-.75z"
                                        fill="#42C0F5"
                                    />
                                </Svg>
                            </View>
                        </DelayedButton>
                    </View>
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
        // paddingTop: 40,
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 10,
        alignItems: 'center',
    },
    buttonStyle: {
        paddingTop: 15,
        paddingBottom: 10,
        // justifyContent: 'space-around',
        flexDirection: 'row',

        alignItems: 'center',
        marginHorizontal: 25,
        justifyContent: 'flex-start',
    },
    iconStyle: {
        marginLeft: 15,
        marginRight: 15,
        height: 20,
        width: 22,
    },
    titleTextStyle: {
        color: 'black',
        fontWeight: '600',
        fontSize: 21,
    },
    bottomContainer: {
        bottom: 5,
        position: 'absolute',
        width: '100%',
    },
    bottomText: { color: 'black', fontWeight: '600', fontSize: 20 },
    logOutButtonStyle: {
        // backgroundColor: '#F2F2F2',
        // paddingLeft: 28,
        marginBottom: marginBottom,
        marginHorizontal: 26,
        top: 15,
    },
}

const mapStateToProps = (state) => {
    const { user } = state.user
    const { name } = user

    return {
        user,
    }
}

export default connect(mapStateToProps, {
    openMyEventTab,
    openMyTribeTab,
    openMeet,
    openSetting,
    openChallenges,
    logout,
    // Tutorial related,
    showNextTutorialPage,
    startTutorial,
    updateNextStepNumber,
    openPopup,
})(Menu)
