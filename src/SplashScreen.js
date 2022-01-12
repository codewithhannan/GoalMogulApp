/** @format */

import AppLoading from 'expo-app-loading'
import React, { Component } from 'react'
import {
    Dimensions,
    Image,
    Text,
    View,
    SafeAreaView,
    StatusBar,
} from 'react-native'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
// Actions
import {
    tryAutoLoginV2,
    loadInitialAssets,
    getUserVisitedNumber,
} from './actions'
/* Asset */
import LogoText from './asset/header/GMText.png'
import LogoIcon from './asset/header/header-logo-white.png'
import newSplashScreenLogo from './asset/header/newSplashScreenLogo.png'

import { track, trackViewScreen, EVENT as E } from './monitoring/segment'
import { Screen } from './monitoring/segment/Constants'
import { IS_BIG_IPHONE } from './Utils/Constants'
// Components
import { color, default_style } from './styles/basic'
import { FONT_FAMILY, LETTER_SPACING } from './styles/basic/text'
import { UI_SCALE } from './styles'
import DelayedButton from './Main/Common/Button/DelayedButton'
import {
    getBottomSpace,
    getStatusBarHeight,
} from 'react-native-iphone-x-helper'

const WINDOW_WIDTH = Dimensions.get('window').width
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
        this.setState({ fontLoaded: true })
        track(E.SPLASH_SCREEN)

        // this.props.getUserVisitedNumber()
    }

    handleGetStartedOnPress() {
        this.props.registration()
    }

    handleLoginPress() {
        this.props.login()
    }

    render() {
        if (!this.state.appReady) {
            return (
                <AppLoading
                    startAsync={async () => {
                        // Load necessary assets like fonts
                        await loadInitialAssets()

                        // Attempt auto login
                        await this.props.tryAutoLoginV2()
                    }}
                    onFinish={() => this.setState({ appReady: true })}
                    onError={console.warn}
                    autoHideSplash={false}
                />
            )
        }

        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.containerStyle}>
                    {/* Main content including logo, artwork and slogan */}
                    <StatusBar
                        animated={true}
                        backgroundColor="#42C0F5"
                        // barStyle={statusBarStyle}
                        // showHideTransition={statusBarTransition}
                    />
                    <View style={styles.bodyContainerStyle}>
                        {/* Top header logo */}
                        <View style={styles.logoContainerStyle}>
                            <Image
                                source={newSplashScreenLogo}
                                style={styles.logoIconStyle}
                            />
                        </View>
                        {/* Artwork */}
                        {/* <Image source={HandshakeArt} style={styles.artworkStyle} /> */}
                        {/* Slogan */}
                        <Text style={styles.sloganTextStyle}>
                            Achieve more, together.
                        </Text>
                    </View>
                    {/* Bottom bar for registration and log in */}
                    <View style={styles.actionButtonsContainerStyle}>
                        <DelayedButton
                            onPress={this.handleGetStartedOnPress.bind(this)}
                            touchableWithoutFeedback
                        >
                            <View style={styles.signUpButtonStyle}>
                                <Text
                                    style={[
                                        default_style.buttonText_1,
                                        {
                                            color: color.GM_BLUE_DEEP,
                                        },
                                    ]}
                                >
                                    Sign Up
                                </Text>
                            </View>
                        </DelayedButton>
                        <DelayedButton
                            onPress={this.handleLoginPress.bind(this)}
                            touchableWithoutFeedback
                        >
                            <Text
                                style={[
                                    default_style.buttonText_1,
                                    {
                                        color: 'white',
                                        paddingVertical: 16,
                                    },
                                ]}
                            >
                                Log In
                            </Text>
                        </DelayedButton>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}

const styles = {
    // containers
    containerStyle: {
        flex: 1,
        backgroundColor: color.GM_BLUE_DEEP,
        paddingBottom: getBottomSpace(),
        paddingTop: getStatusBarHeight(true),
    },
    bodyContainerStyle: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionButtonsContainerStyle: {
        paddingVertical: 24,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },

    // Logo
    logoContainerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: IS_BIG_IPHONE ? 60 : 48,
        flexDirection: 'row',
    },
    logoIconStyle: {
        height: 60,
        width: 300,
        marginBottom: 16,
        resizeMode: 'contain',
    },
    logoTextStyle: {
        height: 40,
        width: 208,
        resizeMode: 'contain',
    },

    // center artwork and slogan
    artworkStyle: {
        height: IS_BIG_IPHONE ? 180 : 160,
        width: WINDOW_WIDTH,
        resizeMode: 'contain',
        marginVertical: 24,
        tintColor: 'white',
    },
    sloganTextStyle: {
        color: 'white',
        fontFamily: FONT_FAMILY.MEDIUM,
        fontSize: 22 * UI_SCALE,
        letterSpacing: LETTER_SPACING.WIDE,
        top: 100,
    },

    // action button styles
    signUpButtonStyle: {
        paddingVertical: 12,
        backgroundColor: 'white',
        width: '100%',
        borderRadius: 3,
        alignItems: 'center',
    },
}

const mapDispatchToProps = (dispatch) => {
    return {
        registration: () => {
            Actions.push('registrationAccount')
            track(E.SPLASH_SCREEN_SIGN_UP)
        },
        login: () => {
            Actions.push('login')
            track(E.LOGIN_STARTED)
        },
        tryAutoLoginV2: (params) => dispatch(tryAutoLoginV2(params)),
        getUserVisitedNumber: (params) =>
            dispatch(getUserVisitedNumber(params)),
    }
}

export default connect(null, mapDispatchToProps)(SplashScreen)
