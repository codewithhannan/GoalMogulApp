/** @format */

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
    FONT_FAMILY_3,
    FONT_FAMILY_1,
    BUTTON_STYLE,
} from '../../styles'
import { registrationLogin } from '../../actions'
import {
    registrationTextInputChange,
    registerAccount,
    validatePhoneCode,
} from '../../redux/modules/registration/RegistrationActions'
import PhoneVerificationMoal from './PhoneVerificationModal'

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

/**
 * Onboarding flow account registration page.
 * Inputs are: Full Name, Email, Phone number, Password
 * Additional actions are: Log In or Next
 *
 * @link https://www.figma.com/file/T1ZgWm5TKDA4gtBS5gSjtc/GoalMogul-App?node-id=24%3A195
 */
class RegistrationAccount extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isModalOpen: false,
            emailStatus: undefined,
            nameStatus: undefined,
            phoneStatus: undefined,
            passwordStatus: undefined,
        }
    }

    componentWillUnmount() {
        this.props.registrationTextInputChange('name', undefined)
        this.props.registrationTextInputChange('email', undefined)
        this.props.registrationTextInputChange('phone', undefined)
        this.props.registrationTextInputChange('password', undefined)
    }

    nextStep = () => {
        Actions.replace(NEXT_STEP)
    }

    // Open phone verification modal
    openModal() {
        this.setState({ ...this.state, isModalOpen: true })
    }

    // Close phone verification modal
    closeModal() {
        this.setState({ ...this.state, isModalOpen: false })
    }

    // Invoked by the modal
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
            if (phone) {
                this.openModal()
                return
            }
            this.nextStep()
        }
        // return this.props.registerAccount(onSuccess);
        onSuccess()
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

    renderInputs() {
        const { phone, email, password, name, countryCode } = this.props
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
                            paddingBottom: 20,
                        }}
                    >
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
                <View style={{ marginHorizontal: 16, marginBottom: 10 }}>
                    <OnboardingFooter
                        buttonText="Continue"
                        onButtonPress={this.onNext}
                        disabled={
                            this.props.loading ||
                            (this.state.nameStatus !==
                                FIELD_REQUIREMENTS.done &&
                                this.state.emailStatus !==
                                    FIELD_REQUIREMENTS.done &&
                                this.state.passwordStatus !==
                                    FIELD_REQUIREMENTS.done)
                        }
                    />
                    <DelayedButton
                        style={[
                            BUTTON_STYLE.GM_WHITE_BG_GRAY_TEXT.containerStyle,
                            { marginBottom: 20 },
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

                <PhoneVerificationMoal
                    isOpen={this.state.isModalOpen}
                    phoneVerify={(code) => this.phoneVerify(code)}
                    phoneVerifyCancel={() => this.phoneVerifyCancel()}
                    phoneVerifyPass={() => this.phoneVerifyPass()}
                />
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
    } = state.registration

    return {
        name,
        email,
        password,
        error,
        loading,
        countryCode,
        phone,
    }
}

export default connect(mapStateToProps, {
    registrationLogin,
    registerAccount,
    validatePhoneCode,
    registrationTextInputChange,
})(RegistrationAccount)
