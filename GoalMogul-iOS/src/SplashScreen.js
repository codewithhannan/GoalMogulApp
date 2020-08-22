/** @format */

import { AppLoading } from 'expo'
import { Asset } from 'expo-asset'
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
import { tryAutoLoginV2, loadInitialAssets } from './actions'
/* Asset */
import HeaderLogo from './asset/header/header-logo-white.png'
import Helpfulness from './asset/utils/help.png'
import { trackViewScreen } from './monitoring/segment'
import { Screen } from './monitoring/segment/Constants'
import { DEVICE_MODEL, IPHONE_MODELS, IS_ZOOMED } from './Utils/Constants'
// Components
import { RightArrowIcon } from './Utils/Icons'
import { color } from './styles/basic'
import { IS_SMALL_PHONE } from './styles'

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
        this.setState({ fontLoaded: true })
        trackViewScreen(Screen.SPLASH_SCREEN)
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
        fontFamily: 'SFProDisplay-Regular',
    },
    headerBoldTextStyle: {
        fontSize: 36,
        color: '#ffffff',
        fontWeight: '800',
        fontFamily: 'SFProDisplay-Bold',
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
        fontFamily: 'SFProDisplay-Regular',
    },
    // Highlight style
    buttonTextStyle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#ffffff',
        alignSelf: 'center',
        fontFamily: 'SFProDisplay-Bold',
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
        fontFamily: 'SFProDisplay-Bold',
    },
    haveAccountTextStyle: {
        fontSize: 15,
        color: '#0d6992',
        marginRight: 3,
        fontFamily: 'SFProDisplay-Regular',
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
        tryAutoLoginV2: (params) => dispatch(tryAutoLoginV2(params)),
    }
}

export default connect(null, mapDispatchToProps)(SplashScreen)
