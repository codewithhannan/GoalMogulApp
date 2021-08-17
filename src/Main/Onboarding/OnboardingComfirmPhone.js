/** @format */

import React from 'react'
import {
    View,
    Text,
    Dimensions,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    Platform,
} from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import OnboardingHeader from './Common/OnboardingHeader'
import OTPInputView from '@twotalltotems/react-native-otp-input'
import OTPTextInput from 'react-native-otp-textinput'

import { text } from '../../styles/basic'
import OnboardingStyles, { getCardBottomOffset } from '../../styles/Onboarding'

import DelayedButton from '../Common/Button/DelayedButton'
import { api as API } from '../../redux/middleware/api'
import { getData } from '../../store/storage'

import Icons from '../../asset/base64/Icons'
import {
    wrapAnalytics,
    SCREENS,
    trackWithProperties,
    EVENT as E,
} from '../../monitoring/segment'
import {
    phoneNumberVerify,
    phoneNumberSent,
} from '../../redux/modules/auth/phoneVerification'

const { button: buttonStyle, text: textStyle } = OnboardingStyles

class OnBoardingComfirmPhone extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true, // test loading param
            errMessage: undefined,
            code: '',
            hasFilled: false,
            phoneNumber: '',
            errorMessage: false,
        }
    }

    async componentDidMount() {
        const getPhoneNumber = await getData('PHONE_NUMBER')

        this.setState({ phoneNumber: getPhoneNumber })
    }

    onCodeFilled = (code) => {
        this.setState({ ...this.state, code, hasFilled: true })

        // trackWithProperties(E.REG_PHONE_VERIFICATION_SKIP, {
        //     UserId: this.props.userId,
        // })
        // const screenTransitionCallback = () => {
        //     Actions.push('registration_add_photo')
        // }
        // screenTransitionCallback()
    }

    onNotNow = () => {
        trackWithProperties(E.REG_PHONE_VERIFICATION_SKIP, {
            UserId: this.props.userId,
        })
        const screenTransitionCallback = () => {
            Actions.push('registration_add_photo')
        }
        screenTransitionCallback()
    }

    onError = () => this.setState({ errorMessage: true })

    onNext = (value) => {
        const errorMessage = () => {
            this.onError()
        }
        return this.props.phoneNumberVerify(value, errorMessage)
    }

    renderButtons() {
        const { code, errorMessage } = this.state

        return (
            <View style={{ width: '100%', justifyContent: 'center' }}>
                <DelayedButton
                    onPress={() => this.onNext(code, errorMessage)}
                    style={
                        buttonStyle.GM_BLUE_BG_WHITE_BOLD_TEXT.containerStyle
                    }
                >
                    <Text
                        style={buttonStyle.GM_BLUE_BG_WHITE_BOLD_TEXT.textStyle}
                    >
                        Submit
                    </Text>
                </DelayedButton>
                {/* <DelayedButton
                    onPress={this.onNotNow}
                    style={[
                        buttonStyle.GM_WHITE_BG_GRAY_TEXT.containerStyle,
                        { marginTop: 8 },
                    ]}
                >
                    <Text style={buttonStyle.GM_WHITE_BG_GRAY_TEXT.textStyle}>
                        Skip
                    </Text>
                </DelayedButton> */}
            </View>
        )
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View
                    style={[
                        OnboardingStyles.container.page,
                        { paddingBottom: getCardBottomOffset() },
                    ]}
                >
                    <OnboardingHeader />
                    <View style={[OnboardingStyles.container.card]}>
                        <View
                            style={{
                                flexGrow: 1,
                                alignItems: 'center',
                                width: '100%',
                            }}
                        >
                            <View
                                style={{
                                    width: '100%',
                                    marginTop: 120,
                                }}
                            >
                                <Text
                                    style={
                                        ([textStyle.title],
                                        {
                                            fontSize: 22,
                                            fontWeight: '700',
                                            alignSelf: 'flex-start',
                                        })
                                    }
                                >
                                    Mobile Phone Verification!
                                </Text>
                                {/* <Text style={textStyle.title}>use GoalMogul!</Text> */}
                            </View>
                            <Text style={styles.noteTextStyle}>
                                Please enter the 6 digit code we sent to
                                {''} {this.state.phoneNumber}. It may take up 10
                                seconds to arrive.
                            </Text>

                            {Platform.OS == 'android' ? (
                                <OTPTextInput
                                    ref={(e) => (this.otpInput = e)}
                                    inputCount={6}
                                    defaultValue={this.state.code}
                                    handleTextChange={(code) => {
                                        this.setState({ code })
                                    }}
                                    tintColor="#45C9F6"
                                    containerStyle={{
                                        marginTop: 25,
                                        marginBottom: 25,
                                    }}
                                />
                            ) : (
                                <OTPInputView
                                    style={{
                                        width: '90%',
                                        height: 50,
                                        marginTop: 25,
                                        marginBottom: 25,
                                    }}
                                    pinCount={6}
                                    code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                                    onCodeChanged={(code) => {
                                        this.setState({ code })
                                    }}
                                    autoFocusOnLoad
                                    codeInputFieldStyle={
                                        styles.digitInputContainerStyle
                                    }
                                    onCodeFilled={this.onCodeFilled}
                                    placeholderTextColor={'black'}
                                />
                            )}

                            <View
                                style={{
                                    alignSelf: 'flex-start',
                                    flexDirection: 'row',
                                    left: 7,
                                    width: '80%',
                                }}
                            >
                                {!this.state.errorMessage ? (
                                    <>
                                        <Text
                                            style={{
                                                fontFamily:
                                                    'SFProDisplay-Semibold',
                                                fontSize: 12,
                                            }}
                                        >
                                            Didn’t receive the code?
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() => Actions.pop()}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily:
                                                        'SFProDisplay-Regular',
                                                    left: 2,
                                                    fontSize: 12,
                                                    color: '#45C9F6',
                                                }}
                                            >
                                                Send again.
                                            </Text>
                                        </TouchableOpacity>
                                    </>
                                ) : (
                                    <>
                                        <Text
                                            style={{
                                                fontFamily:
                                                    'SFProDisplay-Regular',
                                                fontSize: 12,
                                                color: '#F66565',
                                            }}
                                        >
                                            Invalid Verification Code. Please
                                            re-enter your verification code.
                                            <Text
                                                onPress={() => {
                                                    Actions.pop()
                                                }}
                                                style={{
                                                    fontFamily:
                                                        'SFProDisplay-Regular',
                                                    left: 2,
                                                    fontSize: 12,
                                                    color: '#45C9F6',
                                                }}
                                            >
                                                {''} Send new code.
                                            </Text>
                                        </Text>
                                    </>
                                )}
                            </View>
                        </View>
                        {this.renderButtons()}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

const styles = {
    noteTextStyle: {
        fontSize: text.TEXT_FONT_SIZE.FONT_1,
        lineHeight: text.TEXT_LINE_HEIGHT.FONT_3_5,
        fontFamily: text.FONT_FAMILY.REGULAR,
        color: '#333333',
        alignSelf: 'flex-start',
        marginTop: 15,
        left: 2,
    },
    digitInputContainerStyle: {
        height: 47,
        width: 42,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        color: 'black',
    },
}

const mapStateToProps = (state) => {
    const { userId } = state.user
    return { userId }
}

const AnalyticsWrapper = wrapAnalytics(
    OnBoardingComfirmPhone,
    SCREENS.REG_ENTER_PHONE
)

export default connect(mapStateToProps, {
    phoneNumberVerify,
    phoneNumberSent,
})(AnalyticsWrapper)
