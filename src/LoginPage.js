/** @format */

import React, { Component } from 'react'
import {
    View,
    Text,
    Animated,
    Keyboard,
    Linking,
    StatusBar,
} from 'react-native'
import _ from 'lodash'
import { connect } from 'react-redux'
import {
    Field,
    reduxForm,
    SubmissionError,
    formValueSelector,
} from 'redux-form'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ReactMoE from 'react-native-moengage'

/* Actions */
import { registerUser, loginUser } from './actions'

import { RESET_PASSWORD_URL } from './Utils/Constants'
import Recaptcha from './Main/Common/Recaptcha'
import { SCREENS, track, wrapAnalytics, EVENT as E } from './monitoring/segment'
import InputBox from './Main/Onboarding/Common/InputBox'
import { default_style, color, text } from './styles/basic'
import OnboardingStyles from './styles/Onboarding'

import DelayedButton from './Main/Common/Button/DelayedButton'
import {
    isValidEmail,
    isPossiblePhoneNumber,
    isValidPhoneNumber,
} from './redux/middleware/utils'
import OnboardingHeader from './Main/Onboarding/Common/OnboardingHeader'

const FIELD_REQUIREMENT = {
    username: {
        required: 'Email or Phone number is required',
        invalid_username: 'Invalid Email or Phone number',
        invalid_phone_num: 'Invalid Phone number',
    },
    password: {
        required: 'Password is required',
        too_short: 'Password is at least 8 characters',
    },
}

const DEFAULT_SPACE_ABOVE_LOGIN_BUTTON_NO_KEYBOARD = 112
const DEFAULT_SPACE_ABOVE_LOGIN_BUTTON_WITH_KEYBOARD = 24

class LoginPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showRecaptcha: false,
            numFailLoginAttempt: 0,
            spaceAboveLoginButton: new Animated.Value(
                DEFAULT_SPACE_ABOVE_LOGIN_BUTTON_NO_KEYBOARD
            ),
            shouldScrollToLoginButton: false,
            errMsg: undefined,
            // TODO are these still relevant?
            username: undefined,
            password: undefined,
            // Disable user agreement
            // userAgreementChecked: false,
        }
    }
    componentDidMount() {
        Keyboard.addListener('keyboardDidShow', this._keyboardDidShow)
        Keyboard.addListener('keyboardWillShow', this._keyboardWillShow)
        Keyboard.addListener('keyboardWillHide', this._keyboardWillHide)
    }
    componentWillUnmount() {
        Keyboard.removeListener('keyboardDidShow', this._keyboardDidShow)
        Keyboard.removeListener('keyboardWillShow', this._keyboardWillShow)
        Keyboard.removeListener('keyboardWillHide', this._keyboardWillHide)
    }

    _keyboardDidShow = () => {
        if (this.state.shouldScrollToLoginButton) {
            // this.scrollView.props.scrollToFocusedInput(this.loginButton)
            this.setState({
                shouldScrollToLoginButton: false,
            })
        }
    }
    _keyboardWillShow = () => {
        Animated.timing(this.state.spaceAboveLoginButton, {
            useNativeDriver: false,
            toValue: DEFAULT_SPACE_ABOVE_LOGIN_BUTTON_WITH_KEYBOARD,
            duration: 250,
        }).start()
    }
    _keyboardWillHide = () => {
        Animated.timing(this.state.spaceAboveLoginButton, {
            useNativeDriver: false,
            toValue: DEFAULT_SPACE_ABOVE_LOGIN_BUTTON_NO_KEYBOARD,
            duration: 250,
        }).start()
    }

    validate = (values) => {
        const { username, password } = values
        const errors = {}
        errors.username = this.validateUsername(username)
        errors.password = this.validatePassword(password)
        return errors
    }

    /**
     * This validation only checks for if username exists.
     * @param {*} username
     */
    validateUsername = (username) => {
        // Missing username
        if (!username || !username.trim()) {
            return FIELD_REQUIREMENT.username.required
        }

        const possiblePhoneNumber = isPossiblePhoneNumber(username)
        const validPhoneNumber = isValidPhoneNumber(username)
        const validEmail = isValidEmail(username)

        // valid email or valid phone number
        if (validEmail || validPhoneNumber) return undefined // pass email or phone number check

        if (possiblePhoneNumber) {
            return FIELD_REQUIREMENT.username.invalid_phone_num
        }
        return FIELD_REQUIREMENT.username.invalid_username
    }

    validatePassword = (password) => {
        let error
        // Validate password
        if (!password) {
            error = FIELD_REQUIREMENT.password.required
        } else if (password.trim().length < 8) {
            error = FIELD_REQUIREMENT.password.too_short
        }
        return error
    }

    openRecaptcha = () => {
        this.setState({
            ...this.state,
            showRecaptcha: true,
        })
    }

    closeRecaptcha = () => {
        this.setState({
            ...this.state,
            showRecaptcha: false,
            username: undefined,
            password: undefined,
        })
    }

    increaseNumFailLoginAttempt = () => {
        this.setState({
            ...this.state,
            numFailLoginAttempt: this.state.numFailLoginAttempt + 1,
        })
    }

    resetNumFailLoginAttempt = () => {
        this.setState({
            ...this.state,
            numFailLoginAttempt: 0,
        })
    }

    setErrorMessage = (errMsg) => {
        this.setState({
            ...this.state,
            errMsg,
        })
    }

    resetErrorMessage = () => {
        this.setState({
            ...this.state,
            errMsg: undefined,
        })
    }

    handleResetPassword = async () => {
        const canOpen = await Linking.canOpenURL(RESET_PASSWORD_URL)
        if (canOpen) {
            await Linking.openURL(RESET_PASSWORD_URL)
        }
    }

    handleSignUp = () => {
        this.props.registerUser()
        track(E.SPLASH_SCREEN_SIGN_UP)
    }

    handleLoginPressed = (values) => {
        // Disable user agreement
        // if (!this.state.userAgreementChecked) return
        const errors = this.validate(values)

        const hasErrors =
            Object.keys(errors).length &&
            _.filter(
                _.map(Object.keys(errors), (key) => _.get(errors, key)),
                (error) => error !== undefined
            ).length > 0
        if (hasErrors) {
            throw new SubmissionError(errors)
        }
        const { username, password } = values

        Keyboard.dismiss()

        if (this.state.numFailLoginAttempt >= 2) {
            // Show recaptcha for not a robot verification
            this.setState(
                {
                    ...this.state,
                    username,
                    password,
                },
                () => this.openRecaptcha()
            )
        } else {
            this.props.loginUser({
                username,
                password,
                onError: (errMsg, username) => {
                    this.increaseNumFailLoginAttempt()
                    this.setErrorMessage(errMsg)
                    // Set username to the one we applied
                    // This is for phone number when user
                    // doesn't enter country code so that it's
                    // clear which country code we are using / assuming
                    this.props.change('username', username)
                },
                onSuccess: () => {
                    ReactMoE.setUserUniqueID(username)
                    ReactMoE.setUserEmailID(username)
                    this.resetNumFailLoginAttempt()
                    this.resetErrorMessage()
                },
            })
        }
    }

    handleRecaptchaOnSuccess = () => {
        // clear state
        this.closeRecaptcha()
        const { username, password } = this.state

        setTimeout(() => {
            // handle login
            this.props.loginUser({
                username,
                password,
                onError: (errMsg) => {
                    this.increaseNumFailLoginAttempt()
                    this.setErrorMessage(errMsg)
                },
                onSuccess: () => {
                    this.resetNumFailLoginAttempt()
                    this.resetErrorMessage()
                },
            })
        }, 100)
    }

    scrollToLoginButton() {
        this.setState({
            shouldScrollToLoginButton: true,
        })
    }

    renderError(error) {
        return error ? (
            <View
                style={{
                    height: 50,
                    paddingHorizontal: 20,
                    justifyContent: 'center',
                }}
            >
                <Text style={[default_style.normalText_1, styles.errorStyle]}>
                    {error}
                </Text>
            </View>
        ) : (
            <View style={{ height: 50 }} />
        )
    }

    renderRecaptcha() {
        return (
            <Recaptcha
                showRecaptcha={this.state.showRecaptcha}
                closeModal={this.closeRecaptcha}
                onSuccess={this.handleRecaptchaOnSuccess}
            />
        )
    }

    renderSignUp = () => {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    width: '100%',
                    marginTop: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Text
                    style={[
                        default_style.subTitleText_1,
                        {
                            fontFamily: text.FONT_FAMILY.SEMI_BOLD,
                            color: color.GM_MID_GREY,
                        },
                    ]}
                >
                    Don't have an account?
                </Text>
                <DelayedButton
                    style={[{ padding: 12, paddingLeft: 3 }]}
                    onPress={this.handleSignUp}
                >
                    <Text
                        style={[
                            default_style.subTitleText_1,
                            {
                                fontFamily: text.FONT_FAMILY.SEMI_BOLD,
                                color: color.GM_BLUE,
                            },
                        ]}
                    >
                        {' '}
                        Sign Up
                    </Text>
                </DelayedButton>
            </View>
        )
    }

    render() {
        const { handleSubmit } = this.props

        return (
            <View style={[OnboardingStyles.container.page]}>
                <StatusBar
                    animated={true}
                    backgroundColor={color.GM_BLUE}
                    // barStyle={statusBarStyle}
                    // showHideTransition={statusBarTransition}
                />
                <KeyboardAwareScrollView
                    bounces={false}
                    // enableOnAndroid={true}
                    innerRef={(ref) => (this.scrollView = ref)}
                    // keyboardShouldPersistTaps={'handled'}
                >
                    <OnboardingHeader />
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: color.GM_CARD_BACKGROUND,
                        }}
                    >
                        <View style={[OnboardingStyles.container.card]}>
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                }}
                            >
                                {this.renderError(this.state.errMsg)}
                                <Field
                                    name="username"
                                    label="Email or Phone number"
                                    inputTitle="Email or Phone number"
                                    placeholder="Email or Phone number"
                                    component={InputBox}
                                    disabled={this.props.loading}
                                    returnKeyType="next"
                                    onSubmitEditing={() => {
                                        /**
                                         * Most cases the user has filled password and is focussed on user is:
                                         * A. Credentials were autofilled
                                         * B. user needs to fix email/phone and submit again
                                         * Either case, by pressing enter they would expect it to submit
                                         * If they want to correct password, they would just tap the input
                                         */
                                        if (
                                            this.props.password &&
                                            this.props.password.length
                                        ) {
                                            handleSubmit(
                                                this.handleLoginPressed
                                            )
                                        }
                                        // else {
                                        //     this.refs['password']
                                        //         .getRenderedComponent()
                                        //         .focus()
                                        // }
                                    }}
                                    onFocus={this.scrollToLoginButton.bind(
                                        this
                                    )}
                                    textContentType="username"
                                    caption=" "
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    textContentType="emailAddress"
                                />
                                <Field
                                    ref="password"
                                    name="password"
                                    label="Password"
                                    inputTitle="Password"
                                    placeholder="Password"
                                    withRef
                                    component={InputBox}
                                    disabled={this.props.loading}
                                    onSubmitEditing={handleSubmit(
                                        this.handleLoginPressed
                                    )}
                                    onFocus={this.scrollToLoginButton.bind(
                                        this
                                    )}
                                    textContentType="password"
                                    secureTextEntry
                                    caption=" "
                                />
                                <Text
                                    style={[
                                        default_style.smallTitle_1,
                                        {
                                            color: color.GM_BLUE,
                                            padding: 8,
                                            paddingTop: 0,
                                            alignSelf: 'flex-end',
                                        },
                                    ]}
                                    onPress={this.handleResetPassword}
                                >
                                    Forgot password?
                                </Text>
                                {/* 
                                Disable user agreement check
                                <UserAgreementCheckBox
                                    onPress={(val) =>
                                        this.setState({
                                            ...this.state,
                                            userAgreementChecked: val,
                                        })
                                    }
                                    checked={this.state.userAgreementChecked}
                                /> */}
                                {/* Comment below when user agreement check is in use */}
                            </View>
                            <Animated.View
                                style={{
                                    height: this.state.spaceAboveLoginButton,
                                }}
                            />
                            <View
                                style={{
                                    alignItems: 'center',
                                    width: '100%',
                                }}
                            >
                                <DelayedButton
                                    onRef={(ref) => (this.loginButton = ref)}
                                    activeOpacity={0.8}
                                    onPress={handleSubmit(
                                        this.handleLoginPressed
                                    )}
                                    style={[
                                        OnboardingStyles.button
                                            .GM_BLUE_BG_WHITE_BOLD_TEXT
                                            .containerStyle,
                                        {
                                            backgroundColor: this.props.loading
                                                ? // Disable user agreement check
                                                  // || !this.state.userAgreementChecked
                                                  color.GM_BLUE_LIGHT
                                                : color.GM_BLUE,
                                        },
                                    ]}
                                    disabled={this.props.loading}
                                >
                                    <Text
                                        style={[
                                            OnboardingStyles.button
                                                .GM_BLUE_BG_WHITE_BOLD_TEXT
                                                .textStyle,
                                        ]}
                                    >
                                        Log In
                                    </Text>
                                </DelayedButton>
                                {this.renderSignUp()}
                            </View>
                        </View>
                    </View>
                    {this.renderRecaptcha()}
                </KeyboardAwareScrollView>
            </View>
        )
    }
}

const styles = {
    bodyContainerStyle: {
        flex: 1,
        backgroundColor: 'white',
        padding: 16,
    },
    titleTextStyle: {
        fontSize: 25,
        fontWeight: '700',
        color: '#646464',
        alignSelf: 'center',
        marginTop: 25,
    },
    splitterStyle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    splitterTextStyle: {
        fontSize: 15,
        color: '#646464',
        fontWeight: '800',
        marginLeft: 10,
        marginRight: 10,
    },
    errorStyle: {
        color: '#ff0033',
        justifyContent: 'center',
        alignSelf: 'center',
        textAlign: 'center',
    },
}

const mapStateToProps = (state) => {
    const selector = formValueSelector('loginForm')
    const { loading } = state.auth

    return {
        loading,
        username: selector(state, 'username'),
        password: selector(state, 'password'),
    }
}

// Analytics must be the inner most HOC wrapper
const AnalyticsWrapper = wrapAnalytics(LoginPage, SCREENS.LOGIN_PAGE)

const ReduxWrapper = reduxForm({
    form: 'loginForm',
})(AnalyticsWrapper)

export default connect(mapStateToProps, {
    registerUser,
    loginUser,
})(ReduxWrapper)
