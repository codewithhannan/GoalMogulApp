/** @format */

import { AppLoading } from 'expo'
import React, { Component } from 'react'
import { Dimensions, Image, Text, View } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
// Actions
import { tryAutoLoginV2, loadInitialAssets } from './actions'
/* Asset */
import LogoText from './asset/header/GMText.png'
import LogoIcon from './asset/header/header-logo-white.png'
import HandshakeArt from './asset/header/handshake.png'
import { trackViewScreen } from './monitoring/segment'
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
        trackViewScreen(Screen.SPLASH_SCREEN)
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
            <View style={styles.containerStyle}>
                {/* Main content including logo, artwork and slogan */}
                <View style={styles.bodyContainerStyle}>
                    {/* Top header logo */}
                    <View style={styles.logoContainerStyle}>
                        <Image source={LogoIcon} style={styles.logoIconStyle} />
                        <Image source={LogoText} style={styles.logoTextStyle} />
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
    },
    logoIconStyle: {
        height: 100,
        width: 100,
        marginBottom: 16,
        // resizeMode: 'contain',
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
        fontSize: 24 * UI_SCALE,
        letterSpacing: LETTER_SPACING.WIDE,
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
        registration: () => Actions.push('registrationAccount'),
        login: () => Actions.push('login'),
        tryAutoLoginV2: (params) => dispatch(tryAutoLoginV2(params)),
    }
}

export default connect(null, mapDispatchToProps)(SplashScreen)
