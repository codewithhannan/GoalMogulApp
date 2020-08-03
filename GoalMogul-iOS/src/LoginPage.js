/** @format */

import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableWithoutFeedback,
    Keyboard,
    TouchableOpacity,
    Linking,
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

/* Components */
import Header from './Registration/Common/Header'

/* Styles */
import Styles from './Registration/Styles'

/* Actions */
import { registerUser, loginUser } from './actions'

import { RESET_PASSWORD_URL } from './Utils/Constants'
import Recaptcha from './Main/Common/Recaptcha'
import { SCREENS, wrapAnalytics } from './monitoring/segment'
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

class LoginPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showRecaptcha: false,
            numFailLoginAttempt: 0,
            username: undefined,
            password: undefined,
            errMsg: undefined,
            // Disable user agreement
            // userAgreementChecked: false,
        }
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

    handleContainerOnPressed() {
        Keyboard.dismiss()
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
                            color: '#828282',
                            fontWeight: '700',
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
        const { handleSubmit, username, password } = this.props
        return (
            <View style={[OnboardingStyles.container.page]}>
                <OnboardingHeader />
                <KeyboardAwareScrollView
                    bounces={false}
                    innerRef={(ref) => {
                        this.scrollview = ref
                    }}
                    extraScrollHeight={13}
                    contentContainerStyle={[
                        {
                            backgroundColor: color.GM_CARD_BACKGROUND,
                            flexGrow: 1, // this will fix scrollview scroll issue by passing parent view width and height to it
                        },
                    ]}
                >
                    <TouchableWithoutFeedback
                        onPress={this.handleContainerOnPressed.bind(this)}
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
                                        this.refs['password']
                                            .getRenderedComponent()
                                            .focus()
                                    }}
                                    textContentType="username"
                                    caption=" "
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
                                <View style={{ height: 40 }} />
                            </View>
                            <View
                                style={{
                                    // height: 150,
                                    justifyContent: 'flex-start',
                                }}
                            >
                                <DelayedButton
                                    activeOpacity={0.6}
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
                                    disabled={
                                        this.props.loading
                                        // Disable user agreement check
                                        // || !this.state.userAgreementChecked
                                    }
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
                    </TouchableWithoutFeedback>
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
    const selector = formValueSelector('createChatRoomModal')
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
