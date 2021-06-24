/**
 * Onboarding flow account registration page.
 * Inputs are: Full Name, Email, Gender, Date of Birth
 *
 * Currenty, we don't verify phone number during registration
 * to minimize the effort. In this component, there are two approaches
 * setup for phone verification. We can turn that on if phone verification
 * is required during the signup
 *
 * 1. Verifying the phone number by re-redirecting user to web browser.
 * 2. This method requires twillo integration. If twillo is integrated, we can then leverage
 *    PhoneVerificationModal which is already implemented to perform such verification
 *
 * @format
 * @link https://www.figma.com/file/T1ZgWm5TKDA4gtBS5gSjtc/GoalMogul-App?node-id=24%3A195
 */

import React from 'react'
import { View, Text, Alert, Keyboard } from 'react-native'
import { connect } from 'react-redux'
import * as WebBrowser from 'expo-web-browser'
import * as Linking from 'expo-linking'
import { Actions } from 'react-native-router-flux'
import OnboardingHeader from './Common/OnboardingHeader'
import OnboardingFooter from './Common/OnboardingFooter'
import InputBox from './Common/InputBox'
import DelayedButton from '../Common/Button/DelayedButton'

import { color, text } from '../../styles/basic'
import OnboardingStyles from '../../styles/Onboarding'

import { registrationLogin, onVerifyPhoneNumber } from '../../actions'
import {
    registrationTextInputChange,
    registerAccount,
    validatePhoneCode,
    cancelRegistration,
} from '../../redux/modules/registration/RegistrationActions'
PhoneVerificationMoal
import UserAgreementCheckBox from './UserAgreementCheckBox'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { DEVICE_PLATFORM } from '../../Utils/Constants'
import { getBottomSpace } from 'react-native-iphone-x-helper'
import {
    wrapAnalytics,
    SCREENS,
    track,
    EVENT as E,
} from '../../monitoring/segment'
import { trackWithProperties } from 'expo-analytics-segment'
import PhoneVerificationMoal from './PhoneVerificationModal'

const NEXT_STEP = 'registration'
const FIELD_REQUIREMENTS = {
    done: 'done',
    email: {
        invalid_email: 'Invalid Email',
        require_email: 'Email is required',
    },
    name: {
        require_name: 'Name is required',
    },
    inviteCode: {
        require_code: 'Invite Code is required',
    },
}

class RegistrationAccount extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isModalOpen: false, // phone verification method 2
            emailStatus: undefined,
            nameStatus: undefined,
            phoneStatus: undefined,
            passwordStatus: undefined,
            inviteCodeStatus: undefined,
            userAgreementChecked: true,
        }
    }

    componentWillUnmount() {
        this.props.cancelRegistration()
    }

    nextStep = () => {
        Actions.replace(NEXT_STEP)
    }

    /** Below are the phone verification method 2 **/
    // Open phone verification modal. This is for future usage
    openModal() {
        this.setState({ ...this.state, isModalOpen: true })
    }

    // Close phone verification modal. This is for future usage
    closeModal() {
        this.setState({ ...this.state, isModalOpen: false })
    }

    // Invoked by the modal. This is for future usage
    phoneVerify = (code) => {
        // TODO: verify with endpoint and return the correct value
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(true)
                // this.props.validatePhoneCode(code);
            }, 1000)
        })
    }

    phoneVerifyPass = () => {
        this.closeModal()
        setTimeout(() => {
            this.nextStep()
        }, 150)
    }

    phoneVerifyCancel = () => {
        this.closeModal()
        setTimeout(() => {
            this.nextStep()
        }, 150)
    }
    /** Above are the phone verification method 2 **/

    onNext = () => {
        // User attempts to click next when no fields have been set
        if (
            this.state.nameStatus == undefined &&
            this.state.emailStatus == undefined &&
            this.state.inviteCodeStatus == undefined &&
            this.state.passwordStatus == undefined
        ) {
            this.setState({
                ...this.state,
                nameStatus: FIELD_REQUIREMENTS.name.require_name,
                emailStatus: FIELD_REQUIREMENTS.email.require_email,
                passwordStatus: FIELD_REQUIREMENTS.password.missing_password,
                inviteCodeStatus: FIELD_REQUIREMENTS.inviteCode.require_code,
            })
            return
        }
        const { phone } = this.props
        const onSuccess = () => {
            // If phone number is input, go through phone verification
            // if (phone && phone.trim().length) {
            // This is for future usage
            // this.openModal()

            // Open web browser to verify phone number
            // this.handlePhoneVerification()
            // return
            // }

            // Right now we only register the phone number
            this.nextStep()
        }
        return this.props.registerAccount(onSuccess)
    }

    /**
     * Open web browser to log message
     */
    handlePhoneVerification = async () => {
        this.props.onVerifyPhoneNumber(this.handleRedirect)
    }

    handleRedirect = (event) => {
        WebBrowser.dismissBrowser()
        // parse url and determine verification states
        const { path, queryParams } = Linking.parse(event.url)
        console.log('event is: ', event)
        if (path === 'status=fail') {
            Alert.alert(
                'Phone verification failed',
                'You can also verify your phone number in settings later on',
                [
                    {
                        text: 'Try again',
                        onPress: () => this.handlePhoneVerification(),
                    },
                    {
                        text: 'Skip',
                        style: 'cancel',
                        onPress: () => this.nextStep(),
                    },
                ]
            )
            return
        }

        this.nextStep()
    }

    isValidEmail = (email) => {
        const isValid = (email) => {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return re.test(String(email).toLowerCase())
        }
        return isValid(email)
    }

    validateName = (name) => {
        if (!name || !name.trim().length) {
            this.setState({
                ...this.state,
                nameStatus: FIELD_REQUIREMENTS.name.require_name,
            })
        }
    }

    validateInviteCode = (code) => {
        if (!code || !code.trim().length) {
            this.setState({
                ...this.state,
                inviteCodeStatus: FIELD_REQUIREMENTS.inviteCode.require_code,
            })
        }
    }

    validateEmail = (email) => {
        if (!email || !email.trim().length) {
            this.setState({
                ...this.state,
                emailStatus: FIELD_REQUIREMENTS.email.require_email,
            })
        } else if (!this.isValidEmail(email)) {
            this.setState({
                ...this.state,
                emailStatus: FIELD_REQUIREMENTS.email.invalid_email,
            })
        }
    }

    validatePassword = (password) => {
        if (!password || !password.trim().length) {
            this.setState({
                ...this.state,
                passwordStatus: FIELD_REQUIREMENTS.password.missing_password,
            })
        } else if (password.trim().length < 8) {
            this.setState({
                ...this.state,
                passwordStatus: FIELD_REQUIREMENTS.password.password_too_short,
            })
        }
    }

    profileFilledTrack = () => {
        if (
            this.state.nameStatus == FIELD_REQUIREMENTS.done &&
            this.state.emailStatus == FIELD_REQUIREMENTS.done &&
            this.props.dateOfBirth &&
            this.props.gender
        ) {
            return track(E.REG_FIELDS_FILL)
        }
    }

    renderLogin() {
        return (
            <View style={[styles.loginBoxStyle, { opacity: 0 }]}>
                <Text
                    style={[
                        OnboardingStyles.text.subTitle,
                        { textAlign: 'center' },
                    ]}
                >
                    Already user GoalMogul?
                </Text>
                <DelayedButton onPress={this.props.registrationLogin}>
                    <Text
                        style={[
                            OnboardingStyles.text.subTitle,
                            {
                                textAlign: 'center',
                                alignItems: 'flex-end',
                                color: color.GM_BLUE,
                            },
                        ]}
                    >
                        {' '}
                        Log In
                    </Text>
                </DelayedButton>
            </View>
        )
    }

    renderInputs = () => {
        const {
            gender,
            email,
            dateOfBirth,
            name,
            countryCode,
            registerErrMsg,
            inviterCode,
        } = this.props
        return (
            <View
                style={{
                    flexGrow: 1,
                    justifyContent: 'center',
                    paddingBottom: 8,
                    width: '100%',
                    marginTop: 0,
                }}
            >
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        // marginBottom: 20,
                    }}
                >
                    {registerErrMsg ? (
                        <Text style={styles.errorStyle}>{registerErrMsg}</Text>
                    ) : null}
                </View>

                <InputBox
                    key="name"
                    inputTitle="Full Name"
                    placeholder="Your Full Name"
                    onChangeText={(val) => {
                        if (
                            this.state.nameStatus != FIELD_REQUIREMENTS.done &&
                            val &&
                            val.trim().length
                        ) {
                            this.setState({
                                ...this.state,
                                nameStatus: FIELD_REQUIREMENTS.done,
                            })
                        }
                        this.props.registrationTextInputChange('name', val)
                    }}
                    value={name}
                    disabled={this.props.loading}
                    returnKeyType="next"
                    onBlur={() => this.validateName(name)}
                    onSubmitEditing={() => {
                        this.validateName(name)
                        this.refs['email'].focus()
                    }}
                    caption={
                        !this.state.nameStatus ||
                        this.state.nameStatus == FIELD_REQUIREMENTS.done
                            ? 'So your friends can recognize you'
                            : this.state.nameStatus
                    }
                    status={
                        this.state.nameStatus &&
                        this.state.nameStatus !== FIELD_REQUIREMENTS.done
                            ? 'danger'
                            : 'basic'
                    }
                />
                <InputBox
                    key="email"
                    inputTitle="Email"
                    ref="email"
                    autoCapitalize="none"
                    placeholder="Your Email Address"
                    onChangeText={(val) => {
                        if (
                            this.state.emailStatus != FIELD_REQUIREMENTS.done &&
                            val &&
                            val.trim().length
                        ) {
                            this.setState({
                                ...this.state,
                                emailStatus: FIELD_REQUIREMENTS.done,
                            })
                        }
                        this.props.registrationTextInputChange('email', val)
                    }}
                    value={email}
                    autoCompleteType="email"
                    keyboardType="email-address"
                    returnKeyType="next"
                    disabled={this.props.loading}
                    onBlur={() => this.validateEmail(email)}
                    onSubmitEditing={() => {
                        this.validateEmail(email)
                        // TODO
                        // this.scrollView.props.scrollToFocusedInput()
                        Keyboard.dismiss()
                    }}
                    caption={
                        !this.state.emailStatus ||
                        this.state.emailStatus == FIELD_REQUIREMENTS.done
                            ? `We'll send a link to set your password here`
                            : this.state.emailStatus
                    }
                    status={
                        this.state.emailStatus &&
                        this.state.emailStatus !== FIELD_REQUIREMENTS.done
                            ? 'danger'
                            : 'basic'
                    }
                />
                <InputBox
                    key="gender"
                    inputTitle="Gender"
                    ref="gender"
                    onChangeText={(val) =>
                        this.props.registrationTextInputChange('gender', val)
                    }
                    value={gender}
                    disabled={this.props.loading}
                    caption="This is used to customize your experience"
                />
                <InputBox
                    key="dateOfBirth"
                    inputTitle="Date of birth"
                    ref="dateOfBirth"
                    onChangeText={(val) => {
                        this.props.registrationTextInputChange(
                            'dateOfBirth',
                            val
                        )
                    }}
                    placeholder={`You must be at least 13yrs of age`}
                    value={dateOfBirth}
                    returnKeyType="done"
                    caption={`We won't share this information with anyone`}
                    disabled={this.props.loading}
                />
                <InputBox
                    key="inviterCode"
                    inputTitle="Invite Code"
                    ref="inviterCode"
                    placeholder={`Enter you referral code here`}
                    value={inviterCode}
                    returnKeyType="inviterCode"
                    onSubmitEditing={() => {
                        this.validateInviteCode(inviterCode)
                    }}
                    returnKeyType="done"
                    caption={``}
                    disabled={this.props.loading}
                    onBlur={() => {
                        this.validateInviteCode(inviterCode)
                    }}
                    onChangeText={(val) => {
                        if (
                            this.state.inviteCodeStatus !=
                                FIELD_REQUIREMENTS.done &&
                            val &&
                            val.trim().length
                        ) {
                            this.setState({
                                ...this.state,
                                inviteCodeStatus: FIELD_REQUIREMENTS.done,
                            })
                        }
                        this.props.registrationTextInputChange(
                            'inviterCode',
                            val
                        )
                    }}
                    caption={
                        !this.state.inviteCodeStatus ||
                        this.state.inviteCodeStatus == FIELD_REQUIREMENTS.done
                            ? ''
                            : this.state.inviteCodeStatus
                    }
                    status={
                        this.state.inviteCodeStatus &&
                        this.state.inviteCodeStatus !== FIELD_REQUIREMENTS.done
                            ? 'danger'
                            : 'basic'
                    }
                />
                <UserAgreementCheckBox
                    onPress={(val) =>
                        this.setState({
                            ...this.state,
                            userAgreementChecked: val,
                        })
                    }
                    isAutoAccepted={true}
                    checked={this.state.userAgreementChecked}
                />
            </View>
        )
    }

    render() {
        return (
            <View style={[OnboardingStyles.container.page, { zIndex: 1 }]}>
                {this.profileFilledTrack()}
                <KeyboardAwareScrollView
                    bounces={false}
                    enableOnAndroid={true}
                    enableAutomaticScroll={DEVICE_PLATFORM === 'ios'}
                    contentContainerStyle={[
                        {
                            paddingBottom: getBottomSpace(),
                        },
                    ]}
                    innerRef={(ref) => (this.scrollView = ref)}
                >
                    <OnboardingHeader />
                    <View style={OnboardingStyles.container.card}>
                        {this.renderInputs()}
                        <OnboardingFooter
                            buttonText="Continue"
                            onButtonPress={this.onNext}
                            disabled={
                                this.props.loading ||
                                this.state.inviteCodeStatus !==
                                    FIELD_REQUIREMENTS.done ||
                                this.state.nameStatus !==
                                    FIELD_REQUIREMENTS.done ||
                                this.state.emailStatus !==
                                    FIELD_REQUIREMENTS.done ||
                                !this.props.dateOfBirth ||
                                !this.props.gender
                            }
                        />
                        <DelayedButton
                            style={[
                                OnboardingStyles.button.GM_WHITE_BG_GRAY_TEXT
                                    .containerStyle,
                            ]}
                            onPress={() => Actions.pop()}
                        >
                            <Text
                                style={[
                                    OnboardingStyles.button
                                        .GM_WHITE_BG_GRAY_TEXT.textStyle,
                                ]}
                            >
                                Cancel
                            </Text>
                        </DelayedButton>
                    </View>
                </KeyboardAwareScrollView>
                {/* As documented in the header, this is for phone verification
                method 2
                <PhoneVerificationMoal
                    isOpen={this.state.isModalOpen}
                    phoneVerify={(code) => this.phoneVerify(code)}
                    phoneVerifyCancel={() => this.phoneVerifyCancel()}
                    phoneVerifyPass={() => this.phoneVerifyPass()}
                /> */}
            </View>
        )
    }
}

const styles = {
    containerStyle: {
        flex: 1,
        backgroundColor: 'white',
        paddingBottom: 10,
        zIndex: 1,
    },
    loginBoxStyle: {
        backgroundColor: 'white',
        width: '100%',
        height: 42,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 40,
    },
    errorStyle: {
        marginTop: 5,
        color: '#ff0033',
        justifyContent: 'center',
        alignSelf: 'center',
    },
}

const mapStateToProps = (state) => {
    const {
        name,
        email,
        gender,
        dateOfBirth,
        error,
        loading,
        registerErrMsg,
        inviterCode,
    } = state.registration

    return {
        name,
        email,
        gender,
        dateOfBirth,
        error,
        loading,
        registerErrMsg,
        inviterCode,
    }
}

const AnalyticsWrapper = wrapAnalytics(
    RegistrationAccount,
    SCREENS.REG_REISTER_ACCOUNT
)

export default connect(mapStateToProps, {
    registrationLogin,
    registerAccount,
    validatePhoneCode,
    registrationTextInputChange,
    onVerifyPhoneNumber,
    cancelRegistration,
})(AnalyticsWrapper)
