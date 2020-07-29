/** @format */

import { AppLoading } from 'expo'
import { Asset } from 'expo-asset'
import Constants from 'expo-constants'
import * as Font from 'expo-font'
import { LinearGradient } from 'expo-linear-gradient'
import React, { Component } from 'react'
import {
    Dimensions,
    Image,
    Platform,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
// Actions
import { tryAutoLogin } from './actions'
import background from './asset/background'
import banner from './asset/banner'
import Icons from './asset/base64/Icons'
/* Asset */
import HeaderLogo from './asset/header/header-logo-white.png'
import image from './asset/image'
import Helpfulness from './asset/utils/help.png'
import { trackViewScreen } from './monitoring/segment'
import { Screen } from './monitoring/segment/Constants'
import { DEVICE_MODEL, IPHONE_MODELS, IS_ZOOMED } from './Utils/Constants'
// Components
import { RightArrowIcon } from './Utils/Icons'
import { color } from './styles/basic'

const IS_SMALL_PHONE =
    Platform.OS === 'ios' && IPHONE_MODELS.includes(DEVICE_MODEL)
const width = Dimensions.get('window').width
const DEBUG_KEY = '[ UI SplashScreen ]'

class SplashScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fontLoaded: false,
            appReady: false,
        }
    }

    async componentDidMount() {
        console.log(
            `${DEBUG_KEY}: [componentDidMount]: iphone model: `,
            Constants.platform.ios.model.toLowerCase()
        )
        await Font.loadAsync({
            'gotham-pro': require('../assets/fonts/GothamPro.ttf'),
            'gotham-pro-bold': require('../assets/fonts/GothamPro-Bold.ttf'),
            'SFProDisplay-Bold': require('../assets/fonts/SFProDisplay-Bold.otf'),
            'SFProDisplay-Regular': require('../assets/fonts/SFProDisplay-Regular.otf'),
            'SFProDisplay-Semibold': require('../assets/fonts/SFProDisplay-Semibold.otf'),
        })
        this.setState({ fontLoaded: true })
        trackViewScreen(Screen.SPLASH_SCREEN)
    }

    // Functions to preload static assets
    _loadAssetsAsync() {
        const imageAssets = cacheImages([
            require('./asset/utils/badge.png'),
            require('./asset/utils/dropDown.png'),
            require('./asset/utils/like.png'),
            require('./asset/utils/bulb.png'),
            require('./asset/utils/help.png'),
            require('./asset/utils/privacy.png'),
            require('./asset/utils/edit.png'),
            require('./asset/utils/default_profile.png'),
            require('./asset/utils/defaultUserProfile.png'),
            require('./asset/utils/meetSetting.png'),
            require('./asset/utils/back.png'),
            require('./asset/utils/next.png'),
            require('./asset/utils/plus.png'),
            require('./asset/utils/cancel_no_background.png'),
            require('./asset/utils/briefcase.png'),
            require('./asset/utils/love.png'),
            require('./asset/utils/cancel.png'),
            require('./asset/utils/post.png'),
            require('./asset/utils/friendsSettingIcon.png'),
            require('./asset/utils/camera.png'),
            require('./asset/utils/cameraRoll.png'),
            require('./asset/utils/photoIcon.png'),
            require('./asset/utils/expand.png'),
            require('./asset/utils/forward.png'),
            require('./asset/utils/steps.png'),
            require('./asset/utils/activity.png'),
            require('./asset/utils/calendar.png'),
            require('./asset/utils/location.png'),
            require('./asset/utils/lightBulb.png'),
            require('./asset/utils/comment.png'),
            require('./asset/utils/reply.png'),
            require('./asset/utils/makeSuggestion.png'),
            require('./asset/utils/imageOverlay.png'),
            require('./asset/utils/info_white.png'),
            require('./asset/utils/info.png'),
            require('./asset/utils/HelpBG2.png'),
            require('./asset/utils/allComments.png'),
            require('./asset/utils/undo.png'),
            require('./asset/utils/trash.png'),
            require('./asset/utils/invite.png'),
            require('./asset/utils/tutorial.png'),
            require('./asset/utils/right_arrow.png'),
            require('./asset/utils/search.png'),
            require('./asset/utils/dot.png'),
            require('./asset/utils/envelope.png'),
            require('./asset/utils/eventIcon.png'),
            require('./asset/utils/tribeIcon.png'),
            // Friends Tab images
            require('./asset/utils/Friends.png'),
            require('./asset/utils/ContactSync.png'),
            require('./asset/utils/Suggest.png'),
            require('./asset/utils/clipboard.png'),
            require('./asset/utils/logout.png'),
            require('./asset/utils/bug_report.png'),
            // Suggestion Modal Icons
            require('./asset/suggestion/book.png'),
            require('./asset/suggestion/chat.png'),
            require('./asset/suggestion/event.png'),
            require('./asset/suggestion/flag.png'),
            require('./asset/suggestion/friend.png'),
            require('./asset/suggestion/group.png'),
            require('./asset/suggestion/link.png'),
            require('./asset/suggestion/other.png'),
            // Explore related icons
            require('./asset/explore/explore.png'),
            require('./asset/explore/tribe.png'),
            require('./asset/explore/PeopleGlobe.png'),
            require('./asset/explore/ExploreImage.png'),
            // Navigation Icons
            require('./asset/footer/navigation/meet.png'),
            require('./asset/footer/navigation/chat.png'),
            require('./asset/header/menu.png'),
            require('./asset/header/setting.png'),
            require('./asset/header/home-logo.png'),
            require('./asset/header/header-logo-white.png'),
            require('./asset/header/logo.png'),
            require('./asset/header/GMText.png'),
            // Banners
            require('./asset/banner/bronze.png'),
            require('./asset/banner/gold.png'),
            require('./asset/banner/green.png'),
            require('./asset/banner/silver.png'),
            // Tutorial
            require('../assets/tutorial/RightArrow.png'),
            require('../assets/tutorial/Replay.png'),
            require('../assets/tutorial/logo.png'),
            //Chat
            require('./asset/utils/direct_message.png'),
            require('./asset/utils/profile_people.png'),
            require('./asset/utils/sendButton.png'),
        ])

        const fontAssets = cacheFonts({
            'gotham-pro': require('../assets/fonts/GothamPro.ttf'),
            'gotham-pro-bold': require('../assets/fonts/GothamPro-Bold.ttf'),
            'SFProDisplay-Bold': require('../assets/fonts/SFProDisplay-Bold.otf'),
            'SFProDisplay-Regular': require('../assets/fonts/SFProDisplay-Regular.otf'),
            'SFProDisplay-Semibold': require('../assets/fonts/SFProDisplay-Semibold.otf'),
        })

        const loadBase64Icons = Object.keys(Icons).map((k) =>
            Image.prefetch(Icons[k])
        )
        const loadBase64Badges = Object.keys(banner).map((k) =>
            Image.prefetch(banner[k])
        )
        const loadBase64Backgrounds = Object.keys(background).map((k) =>
            Image.prefetch(background[k])
        )
        const loadBase64Image = Object.keys(image).map((k) =>
            Image.prefetch(image[k])
        )

        return Promise.all([
            ...imageAssets,
            ...fontAssets,
            ...loadBase64Icons,
            ...loadBase64Badges,
            ...loadBase64Backgrounds,
            ...loadBase64Image,
        ]).catch((err) => {
            console.log(`${DEBUG_KEY}: [ _loadAssetsAsync ]: err`, err)
        })
    }

    handleGetStartedOnPress() {
        this.props.registration()
    }

    handleLoginPress() {
        this.props.login()
    }

    renderLogo() {
        let headerContainerStyle
        if (IS_ZOOMED) {
            if (IS_SMALL_PHONE) {
                headerContainerStyle = zoomedStyles.headerContainerStyle
            } else {
                headerContainerStyle =
                    zoomedStyles.largePhoneHeaderContainerStyle
            }
        } else {
            if (IS_SMALL_PHONE) {
                headerContainerStyle = styles.headerContainerStyle
            } else {
                headerContainerStyle = styles.largePhoneHeaderContainerStyle
            }
        }

        const logoImageStyle = IS_SMALL_PHONE
            ? styles.logoImageStyle
            : styles.largePhoneLogoImageStyle
        const headerFontSize = IS_SMALL_PHONE ? 36 : 38

        return (
            <View style={headerContainerStyle}>
                <Image style={logoImageStyle} source={HeaderLogo} />
                {this.state.fontLoaded ? (
                    <View style={{ flexDirection: 'row' }}>
                        <Text
                            style={{
                                ...styles.headerBoldTextStyle,
                                fontSize: headerFontSize,
                            }}
                        >
                            Goal
                        </Text>
                        <Text
                            style={{
                                ...styles.headerTextStyle,
                                fontSize: headerFontSize,
                            }}
                        >
                            Mogul
                        </Text>
                    </View>
                ) : null}
            </View>
        )
    }

    render() {
        if (!this.state.appReady) {
            return (
                <AppLoading
                    startAsync={async () => {
                        await this._loadAssetsAsync()
                        await this.props.tryAutoLogin({
                            hideSplashScreen: true,
                        })
                    }}
                    onFinish={() => this.setState({ appReady: true })}
                    onError={console.warn}
                    autoHideSplash={false}
                />
            )
        }

        // Zoomed related style assignment
        const highlightContainerStyle = IS_ZOOMED
            ? zoomedStyles.highlightContainerStyle
            : styles.highlightContainerStyle

        return (
            <View style={styles.containerStyle}>
                <LinearGradient
                    colors={['#4bcaf4', '#1caadb']}
                    style={{ flex: 1 }}
                >
                    {/* Top header logo */}
                    {this.renderLogo()}

                    {/* Main content on the center */}
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <View style={styles.bodyContainerStyle}>
                            <Image
                                style={styles.imageStyle}
                                source={Helpfulness}
                                resizeMode="contain"
                            />
                            {this.state.fontLoaded ? (
                                <View style={{ marginTop: 30 }}>
                                    <Text style={styles.titleTextStyle}>
                                        Achieve more,
                                    </Text>
                                    <Text style={styles.titleTextStyle}>
                                        together.
                                    </Text>
                                </View>
                            ) : null}
                        </View>

                        <View style={highlightContainerStyle}>
                            <TouchableOpacity
                                activeOpacity={0.6}
                                style={styles.reactionContainerStyle}
                                onPress={this.handleGetStartedOnPress.bind(
                                    this
                                )}
                            >
                                {this.state.fontLoaded ? (
                                    <Text style={styles.buttonTextStyle}>
                                        Get Started
                                    </Text>
                                ) : null}
                                <RightArrowIcon
                                    iconStyle={{
                                        ...styles.iconStyle,
                                        tintColor: '#ffffff',
                                        height: 15,
                                        width: 30,
                                    }}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Bottom bar for direct to login */}
                    <TouchableOpacity
                        activeOpacity={0.6}
                        style={{
                            ...styles.loginHighlightContainerStyle,
                            height: IS_SMALL_PHONE ? 60 : 81,
                        }}
                        onPress={this.handleLoginPress.bind(this)}
                    >
                        {this.state.fontLoaded ? (
                            <Text
                                style={{
                                    ...styles.haveAccountTextStyle,
                                    paddingBottom: IS_SMALL_PHONE ? 0 : 21,
                                }}
                            >
                                Have an account?
                            </Text>
                        ) : null}

                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={this.handleLoginPress.bind(this)}
                        >
                            {this.state.fontLoaded ? (
                                <Text
                                    style={{
                                        ...styles.loginTextStyle,
                                        paddingBottom: IS_SMALL_PHONE ? 0 : 24,
                                    }}
                                >
                                    Log In
                                </Text>
                            ) : null}
                        </TouchableOpacity>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        )
    }
}

const zoomedStyles = {
    largePhoneHeaderContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 70,
    },
    headerContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
    },
    highlightContainerStyle: {
        marginTop: 30,
        marginBottom: 20,
        backgroundColor: color.GM_BLUE,
        height: 56,
        width: 230,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 5,
    },
}

const styles = {
    containerStyle: {
        flex: 1,
    },
    // Header style
    largePhoneHeaderContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 90,
    },
    headerContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 70,
    },
    headerTextStyle: {
        fontSize: 36,
        color: '#ffffff',
        fontFamily: 'gotham-pro',
    },
    headerBoldTextStyle: {
        fontSize: 36,
        color: '#ffffff',
        fontWeight: '800',
        fontFamily: 'gotham-pro-bold',
    },
    largePhoneLogoImageStyle: {
        height: 54,
        width: 54,
        marginRight: 10,
        marginBottom: 4,
    },
    logoImageStyle: {
        height: 45,
        width: 45,
        marginRight: 10,
        marginBottom: 3,
    },
    // Body style
    bodyContainerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageStyle: {
        height: 200,
        width: 200,
        tintColor: '#045C7A',
    },
    titleTextStyle: {
        fontSize: 22,
        color: '#045C7A',
        alignSelf: 'center',
        fontWeight: '700',
        letterSpacing: 0.5,
        fontFamily: 'gotham-pro',
    },
    // Highlight style
    buttonTextStyle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#ffffff',
        alignSelf: 'center',
        marginTop: 5,
        fontFamily: 'gotham-pro-bold',
    },
    highlightContainerStyle: {
        marginTop: 50,
        marginBottom: 40,
        backgroundColor: color.GM_BLUE,
        height: 56,
        width: 230,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 5,
    },
    reactionContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    // Footer style
    loginHighlightContainerStyle: {
        backgroundColor: color.GM_BLUE,
        flexDirection: 'row',
        height: 60,
        width,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginTextStyle: {
        paddingLeft: 3,
        color: '#ffffff',
        fontWeight: '800',
        fontSize: 18,
        fontFamily: 'gotham-pro-bold',
    },
    haveAccountTextStyle: {
        fontSize: 15,
        color: '#0d6992',
        marginRight: 3,
        fontFamily: 'gotham-pro',
    },
    iconStyle: {
        alignSelf: 'center',
        marginLeft: 5,
    },
}

function cacheImages(images) {
    return images.map((image) => {
        if (typeof image === 'string') {
            return Image.prefetch(image)
        }

        return Asset.fromModule(image).downloadAsync()
    })
}

function cacheFonts(fonts) {
    return [Font.loadAsync(fonts)]
}

const mapDispatchToProps = (dispatch) => {
    return {
        registration: () => Actions.push('registrationAccount'),
        login: () => Actions.push('login'),
        tryAutoLogin: (params) => dispatch(tryAutoLogin(params)),
    }
}

export default connect(null, mapDispatchToProps)(SplashScreen)
