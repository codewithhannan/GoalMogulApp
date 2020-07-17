/**
 * Onboarding flow account registration page.
 * Inputs are: Full Name, Email, Phone number, Password
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
import {
    View,
    Text,
    Alert,
    KeyboardAvoidingView,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native'
import { connect } from 'react-redux'
import * as WebBrowser from 'expo-web-browser'
import * as Linking from 'expo-linking'
import { Actions } from 'react-native-router-flux'
import OnboardingHeader from './Common/OnboardingHeader'
import OnboardingFooter from './Common/OnboardingFooter'
import InputBox from './Common/InputBox'
import DelayedButton from '../Common/Button/DelayedButton'
import {
    GM_FONT_SIZE,
    GM_BLUE,
    GM_FONT_FAMILY,
    GM_FONT_LINE_HEIGHT,
    BUTTON_STYLE,
    TEXT_STYLE,
    DEFAULT_STYLE,
} from '../../styles'
import { registrationLogin, onVerifyPhoneNumber } from '../../actions'
import {
    registrationTextInputChange,
    registerAccount,
    validatePhoneCode,
    cancelRegistration,
} from '../../redux/modules/registration/RegistrationActions'
import PhoneVerificationMoal from './PhoneVerificationModal'
import { Button, CheckBox } from '@ui-kitten/components'
import UserAgreementCheckBox from './UserAgreementCheckBox'

const NEXT_STEP = 'registration_add_photo'
const FIELD_REQUIREMENTS = {
    done: 'done',
    email: {
        invalid_email: 'Invalid Email',
        require_email: 'Email is required',
    },
    name: {
        require_name: 'Name is required',
    },
    phone: {},
    password: {
        password_too_short: 'Password should have at least 8 characters',
        missing_password: 'Password is required',
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
            userAgreementChecked: false,
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
            this.state.passwordStatus == undefined
        ) {
            this.setState({
                ...this.state,
                nameStatus: FIELD_REQUIREMENTS.name.require_name,
                emailStatus: FIELD_REQUIREMENTS.email.require_email,
                passwordStatus: FIELD_REQUIREMENTS.password.missing_password,
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

    renderLogin() {
        return (
            <View style={[styles.loginBoxStyle, { opacity: 0 }]}>
                <Text
                    style={{
                        fontSize: GM_FONT_SIZE.FONT_3,
                        lineHeight: GM_FONT_LINE_HEIGHT.FONT_3,
                        fontWeight: 'bold',
                        color: '#BDBDBD',
                        fontFamily: GM_FONT_FAMILY.GOTHAM_BOLD,
                    }}
                >
                    Already user GoalMogul?
                </Text>
                <DelayedButton onPress={this.props.registrationLogin}>
                    <Text
                        style={{
                            fontSize: GM_FONT_SIZE.FONT_3,
                            lineHeight: GM_FONT_LINE_HEIGHT.FONT_3,
                            textAlign: 'center',
                            alignItems: 'flex-end',
                            fontWeight: 'bold',
                            color: GM_BLUE,
                            fontFamily: GM_FONT_FAMILY.GOTHAM_BOLD,
                        }}
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
            phone,
            email,
            password,
            name,
            countryCode,
            registerErrMsg,
        } = this.props
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                style={{
                    flex: 1,
                    marginLeft: 20,
                    marginRight: 20,
                    justifyContent: 'center',
                    backgroundColor: 'transparent',
                    zIndex: 0,
                    flexGrow: 1, // this will fix scrollview scroll issue by passing parent view width and height to it
                }}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            paddingBottom: 10,
                        }}
                    >
                        <View
                            style={{
                                height: 29,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            {registerErrMsg ? (
                                <Text style={styles.errorStyle}>
                                    {registerErrMsg}
                                </Text>
                            ) : null}
                        </View>
                        <InputBox
                            key="name"
                            inputTitle="Full Name"
                            placeholder="Your Full Name"
                            onChangeText={(val) => {
                                if (
                                    this.state.nameStatus !=
                                        FIELD_REQUIREMENTS.done &&
                                    val &&
                                    val.trim().length
                                ) {
                                    this.setState({
                                        ...this.state,
                                        nameStatus: FIELD_REQUIREMENTS.done,
                                    })
                                }
                                this.props.registrationTextInputChange(
                                    'name',
                                    val
                                )
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
                                    ? ' '
                                    : this.state.nameStatus
                            }
                            status={
                                this.state.nameStatus &&
                                this.state.nameStatus !==
                                    FIELD_REQUIREMENTS.done
                                    ? 'danger'
                                    : 'basic'
                            }
                        />
                        <InputBox
                            key="email"
                            inputTitle="Email"
                            ref="email"
                            placeholder="Your Email Address"
                            onChangeText={(val) => {
                                if (
                                    this.state.emailStatus !=
                                        FIELD_REQUIREMENTS.done &&
                                    val &&
                                    val.trim().length
                                ) {
                                    this.setState({
                                        ...this.state,
                                        emailStatus: FIELD_REQUIREMENTS.done,
                                    })
                                }
                                this.props.registrationTextInputChange(
                                    'email',
                                    val
                                )
                            }}
                            value={email}
                            autoCompleteType="email"
                            keyboardType="email-address"
                            returnKeyType="next"
                            disabled={this.props.loading}
                            onBlur={() => this.validateEmail(email)}
                            onSubmitEditing={() => {
                                this.validateEmail(email)
                                this.refs['phone'].focus()
                            }}
                            caption={
                                !this.state.emailStatus ||
                                this.state.emailStatus ==
                                    FIELD_REQUIREMENTS.done
                                    ? ' '
                                    : this.state.emailStatus
                            }
                            status={
                                this.state.emailStatus &&
                                this.state.emailStatus !==
                                    FIELD_REQUIREMENTS.done
                                    ? 'danger'
                                    : 'basic'
                            }
                        />
                        <InputBox
                            key="phone"
                            inputTitle="Phone Number"
                            ref="phone"
                            countryCode={countryCode}
                            placeholder="Your Phone Number"
                            onChangeText={(val) =>
                                this.props.registrationTextInputChange(
                                    'phone',
                                    val
                                )
                            }
                            onCountryCodeSelected={(val) =>
                                this.props.registrationTextInputChange(
                                    'countryCode',
                                    val
                                )
                            }
                            value={phone}
                            autoCompleteType="tel"
                            keyboardType="phone-pad" // iOS specific type
                            optional
                            returnKeyType="next"
                            disabled={this.props.loading}
                            caption=" "
                            onEndEditing={() => this.refs['password'].focus()}
                        />
                        <InputBox
                            key="password"
                            inputTitle="Password"
                            ref="password"
                            placeholder="Password"
                            secureTextEntry
                            onChangeText={(val) => {
                                if (
                                    this.state.passwordStatus !=
                                        FIELD_REQUIREMENTS.done &&
                                    val &&
                                    val.trim().length
                                ) {
                                    this.setState({
                                        ...this.state,
                                        passwordStatus: FIELD_REQUIREMENTS.done,
                                    })
                                }
                                this.props.registrationTextInputChange(
                                    'password',
                                    val
                                )
                            }}
                            value={password}
                            textContentType="newPassword"
                            returnKeyType="done"
                            onBlur={() => {
                                this.validatePassword(password)
                            }}
                            onSubmitEditing={() => {
                                this.validatePassword(password)
                            }}
                            onEndEditing={(event) => {
                                if (event.nativeEvent.text.length === 0) {
                                    this.props.registrationTextInputChange(
                                        'password',
                                        ''
                                    )
                                    this.validatePassword(password)
                                }
                            }}
                            caption={
                                !this.state.passwordStatus ||
                                this.state.passwordStatus ==
                                    FIELD_REQUIREMENTS.done
                                    ? ' '
                                    : this.state.passwordStatus
                            }
                            status={
                                this.state.passwordStatus &&
                                this.state.passwordStatus !==
                                    FIELD_REQUIREMENTS.done
                                    ? 'danger'
                                    : 'basic'
                            }
                            disabled={this.props.loading}
                        />
                        <UserAgreementCheckBox
                            onPress={(val) =>
                                this.setState({
                                    ...this.state,
                                    userAgreementChecked: val,
                                })
                            }
                            checked={this.state.userAgreementChecked}
                        />
                        {this.renderLogin()}
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        )
    }

    render() {
        return (
            <View style={styles.containerStyle}>
                <View style={{ zIndex: 1 }}>
                    <OnboardingHeader />
                </View>
                <View style={{ flex: 1, zIndex: 0 }}>
                    {this.renderInputs()}
                </View>
                <View style={{ marginHorizontal: 16, marginBottom: 30 }}>
                    <OnboardingFooter
                        buttonText="Continue"
                        onButtonPress={this.onNext}
                        disabled={
                            this.props.loading ||
                            this.state.nameStatus !== FIELD_REQUIREMENTS.done ||
                            this.state.emailStatus !==
                                FIELD_REQUIREMENTS.done ||
                            this.state.passwordStatus !==
                                FIELD_REQUIREMENTS.done ||
                            !this.state.userAgreementChecked
                        }
                    />
                    <DelayedButton
                        style={[
                            BUTTON_STYLE.GM_WHITE_BG_GRAY_TEXT.containerStyle,
                        ]}
                        onPress={() => Actions.pop()}
                    >
                        <Text
                            style={[
                                BUTTON_STYLE.GM_WHITE_BG_GRAY_TEXT.textStyle,
                            ]}
                        >
                            Cancel
                        </Text>
                    </DelayedButton>
                </View>
                {/* As documented in the header, this is for phone verification method 2
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
        password,
        email,
        error,
        loading,
        countryCode,
        phone,
        registerErrMsg,
    } = state.registration

    return {
        name,
        email,
        password,
        error,
        loading,
        countryCode,
        phone,
        registerErrMsg,
    }
}

export default connect(mapStateToProps, {
    registrationLogin,
    registerAccount,
    validatePhoneCode,
    registrationTextInputChange,
    onVerifyPhoneNumber,
    cancelRegistration,
})(RegistrationAccount)
