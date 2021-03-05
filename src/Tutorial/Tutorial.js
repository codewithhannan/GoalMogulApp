/** @format */

import React from 'react'
import {
    View,
    Text,
    Image,
    StyleSheet,
    Animated,
    TouchableOpacity,
    Platform,
} from 'react-native'
import * as Font from 'expo-font'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'

// Assets
import LOGO from '../../assets/tutorial/logo.png'
import cancel from '../asset/utils/cancel_no_background.png'

// Actions
import { tutorial as TutorialAction } from '../redux/modules/auth/Tutorial'

// Components
import ProgressBar from './ProgressBar'
import Challenge from './Challenge'
import Learn from './Learn'
import Tribe from './Tribe'
import Host from './Host'

// Constants
import { IPHONE_MODELS, DEVICE_MODEL } from '../Utils/Constants'
import { color } from '../styles/basic'

const DEBUG_KEY = '[ UI Tutorial ]'
const DURATION = 500
const PAUSE = 3500
/**
 * This tutorial will show the animation with the sequence
 * 1. Challenge
 * 2. Learn
 * 3. Tribe
 * 4. Host
 */
class Tutorial extends React.Component {
    constructor(props) {
        super(props)
        // Expo.SplashScreen.preventAutoHide();
        this.state = {
            fontLoaded: false,
            hasShownComplete: false,
            animationStart: false,
            onLastPage: false,
        }
        this.challengeAnim = new Animated.Value(0)
        this.LearnAnim = new Animated.Value(0)
        this.TribeAnim = new Animated.Value(0)
        this.HostAnim = new Animated.Value(0)
        this.animationCallback = this.animationCallback.bind(this)
        this.HostAnim.addListener(({ value }) => {
            this._value = value
            this.animationCallback(value)
        })
        this.progress = new Animated.Value(0)

        this.settingAccount = new Animated.Value(0.8)
        this.setupComplete = new Animated.Value(0)

        this.animate = this.animate.bind(this)
    }

    animationCallback = (value) => {
        if (value !== 0 && this.state.onLastPage === false) {
            this.setState({
                ...this.state,
                onLastPage: true,
            })
        }

        if (value !== 1 && this.state.onLastPage === true) {
            this.setState({
                ...this.state,
                onLastPage: false,
            })
        }
    }

    async componentDidMount() {
        await Font.loadAsync({
            'gotham-pro': require('../../assets/fonts/GothamPro.ttf'),
            'gotham-pro-bold': require('../../assets/fonts/GothamPro-Bold.ttf'),
        })
        this.setState({ fontLoaded: true })
        if (this.props.initial === false) {
            this.settingAccount.setValue(0)
        }

        this.animate()
    }

    animate(extraAnimation = [], extraDuration = 0) {
        const sequenceAnimations = Animated.sequence([
            ...extraAnimation,
            Animated.delay(DURATION),
            // Show challenge
            Animated.timing(this.challengeAnim, {
                useNativeDriver: false,
                duration: DURATION,
                toValue: 1,
            }),
            Animated.delay(PAUSE),
            Animated.timing(this.challengeAnim, {
                useNativeDriver: false,
                duration: DURATION,
                toValue: 0,
            }),
            // Show Learn
            Animated.timing(this.LearnAnim, {
                useNativeDriver: false,
                duration: DURATION,
                toValue: 1,
            }),
            Animated.delay(PAUSE),
            Animated.timing(this.LearnAnim, {
                useNativeDriver: false,
                duration: DURATION,
                toValue: 0,
            }),
            // Show Tribe
            Animated.timing(this.TribeAnim, {
                useNativeDriver: false,
                duration: DURATION,
                toValue: 1,
            }),
            Animated.delay(PAUSE),
            Animated.timing(this.TribeAnim, {
                useNativeDriver: false,
                duration: DURATION,
                toValue: 0,
            }),
            // Show Host
            Animated.timing(this.HostAnim, {
                useNativeDriver: false,
                duration: DURATION,
                toValue: 1,
            }),
        ])

        const { headerAnimation, callback } = this.animateHeader(
            6 * DURATION + 3 * PAUSE + extraDuration
        )

        const parallelAnimation = Animated.parallel([
            headerAnimation,
            sequenceAnimations,
            Animated.timing(this.progress, {
                useNativeDriver: false,
                duration: 8 * DURATION + 4 * PAUSE + extraDuration,
                toValue: 1,
            }),
        ])
        parallelAnimation.start()

        if (callback) callback()
    }

    animateHeader = (delay) => {
        if (this.state.hasShownComplete || this.props.initial === false)
            return {}

        const headerAnimation = Animated.sequence([
            Animated.delay(delay),
            Animated.timing(this.settingAccount, {
                useNativeDriver: false,
                duration: DURATION,
                toValue: 0,
            }),
            Animated.timing(this.setupComplete, {
                useNativeDriver: false,
                duration: DURATION,
                toValue: 0.8,
            }),
        ])

        return {
            headerAnimation,
            callback: () =>
                this.setState({
                    ...this.state,
                    hasShownComplete: true,
                }),
        }
    }

    handleContinue = () => {
        const { userId } = this.props
        const onSuccess = (change) => {
            console.log(
                `${DEBUG_KEY}: setting tutorial success for user: ${userId},` +
                    `user prev tutorial status: ${change}`
            )
        }
        const onError = (err) => {
            console.log(
                `${DEBUG_KEY}: error setting user tutorial shown: `,
                err
            )
            return
        }
        TutorialAction.setTutorialShown(userId, onSuccess, onError)
        // Actions.mainTabs();
        Actions.replace('drawer')
    }

    handleReplay = () => {
        this.progress.setValue(0)
        this.animate(
            [
                Animated.timing(this.HostAnim, {
                    useNativeDriver: false,
                    duration: DURATION,
                    toValue: 0,
                }),
            ],
            DURATION
        )
    }

    renderHeaderText = () => {
        return (
            <View style={{ width: '100%' }}>
                {this.renderUnseenText()}
                <View style={styles.headerTextContainerStyle}>
                    {this.renderSettingAccountText()}
                </View>
                <View style={styles.headerTextContainerStyle}>
                    {this.renderSettingCompleteText()}
                </View>
                <View style={styles.headerTextContainerStyle}>
                    {this.renderNonSettingText()}
                </View>
            </View>
        )
    }

    // This is rendered when User chooses to see tutorial from menu
    renderNonSettingText = () => {
        const { initial } = this.props
        return (
            <Animated.View
                style={{
                    opacity: initial === false ? 1 : 0,
                    alignItems: 'center',
                    zIndex: initial === false ? 2 : 0,
                    paddingTop: 10,
                }}
            >
                <Text
                    style={{
                        color: '#124562',
                        fontSize: 20,
                        fontWeight: '600',
                    }}
                >
                    Achieve more with GoalMogul
                </Text>
            </Animated.View>
        )
    }

    // This is the background to reserve space for header text
    renderUnseenText = () => {
        return (
            <Animated.View
                style={{ opacity: 0, alignItems: 'center', width: '100%' }}
            >
                <Text style={{ color: '#124562', fontSize: 15 }}>
                    We're done
                </Text>
                <Text
                    style={{
                        color: '#124562',
                        fontSize: 20,
                        fontWeight: '600',
                    }}
                >
                    Set up complete!
                </Text>
            </Animated.View>
        )
    }

    renderSettingAccountText = () => {
        return (
            <Animated.View
                style={{ opacity: this.settingAccount, alignItems: 'center' }}
            >
                <Text style={{ color: '#124562', fontSize: 15 }}>
                    Give us a second...
                </Text>
                <Text
                    style={{
                        color: '#124562',
                        fontSize: 20,
                        fontWeight: '600',
                    }}
                >
                    We are setting up your account
                </Text>
            </Animated.View>
        )
    }

    renderSettingCompleteText = () => {
        return (
            <Animated.View
                style={{ opacity: this.setupComplete, alignItems: 'center' }}
            >
                <Text style={{ color: '#124562', fontSize: 15 }}>
                    We're done
                </Text>
                <Text
                    style={{
                        color: '#124562',
                        fontSize: 20,
                        fontWeight: '600',
                    }}
                >
                    Set up complete!
                </Text>
            </Animated.View>
        )
    }

    // Header contains Logo with text
    renderHeader() {
        const paddingTop =
            Platform.OS === 'ios' && IPHONE_MODELS.includes(DEVICE_MODEL)
                ? 30
                : 50

        return (
            <View style={[styles.headerContainerStyle, { paddingTop }]}>
                <View style={styles.logoContainerStyle}>
                    <Image source={LOGO} style={styles.logoImageStyle} />
                    {this.state.fontLoaded ? (
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.headerBoldTextStyle}>Goal</Text>
                            <Text style={styles.headerTextStyle}>Mogul</Text>
                        </View>
                    ) : null}
                </View>
                {this.renderHeaderText()}
            </View>
        )
    }

    renderCancelButton() {
        // Don't render if it's initial
        if (this.props.initial !== false) return null

        return (
            <CancelButton
                hostAnim={this.HostAnim}
                onLastPage={this.state.onLastPage}
            />
        )
    }

    // barColor='#055c7a'
    // #007FAD
    render() {
        if (!this.state.fontLoaded) return null
        return (
            <View style={styles.containerStyle}>
                {this.renderCancelButton()}
                {this.renderHeader()}
                <View style={{ height: 10, width: '100%' }}>
                    <ProgressBar
                        progress={this.progress}
                        fillColor={`${color.GM_BLUE_LIGHT}`}
                        barColor="#124562"
                    />
                </View>

                <View style={styles.subViewContainerStyle}>
                    <Challenge opacity={this.challengeAnim} />
                </View>

                <View style={styles.subViewContainerStyle}>
                    <Learn opacity={this.LearnAnim} />
                </View>

                <View style={styles.subViewContainerStyle}>
                    <Tribe opacity={this.TribeAnim} />
                </View>

                <View style={styles.subViewContainerStyle}>
                    <Host
                        opacity={this.HostAnim}
                        continue={this.handleContinue}
                        replay={this.handleReplay}
                        buttonDisabled={!this.state.onLastPage}
                        {...this.props}
                    />
                </View>
            </View>
        )
    }
}

const CancelButton = (props) => {
    // Don't render if we are on the last page
    if (props.onLastPage) return null

    const paddingTop =
        Platform.OS === 'ios' && IPHONE_MODELS.includes(DEVICE_MODEL) ? 10 : 30

    return (
        <TouchableOpacity
            style={{
                padding: 10,
                paddingBottom: 15,
                paddingLeft: 15,
                position: 'absolute',
                top: 15,
                right: 0,
                zIndex: 3,
                paddingTop,
            }}
            activeOpacity={0.6}
            onPress={() => {
                Actions.replace('drawer')
            }}
        >
            <Image
                source={cancel}
                style={{ height: 18, width: 18, tintColor: 'white' }}
            />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    containerStyle: {
        backgroundColor: color.GM_BLUE,
        flex: 1,
        alignItems: 'center',
    },
    subViewContainerStyle: {
        position: 'absolute',
        top: 150,
        left: 0,
        right: 0,
        bottom: 0,
    },
    /* Header related styles */
    headerContainerStyle: {
        padding: 30,
        paddingBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    logoContainerStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginBottom: 7,
    },
    logoImageStyle: {
        height: 45,
        width: 45,
        marginRight: 10,
        marginBottom: 5,
    },
    headerTextContainerStyle: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    headerTextStyle: {
        fontSize: 32,
        color: '#ffffff',
        fontFamily: 'gotham-pro',
    },
    headerBoldTextStyle: {
        fontSize: 32,
        color: '#ffffff',
        fontWeight: '800',
        fontFamily: 'gotham-pro-bold',
    },
    /* Header related styles end */
})

const mapStateToProps = (state) => {
    const { userId } = state.user
    return {
        userId,
    }
}

export default connect(mapStateToProps, {})(Tutorial)
