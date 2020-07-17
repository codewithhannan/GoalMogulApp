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
import {
    DEFAULT_STYLE,
    GM_BLUE,
    BUTTON_STYLE,
    FONT_FAMILY_3,
    GM_BLUE_LIGHT,
} from './styles'
import DelayedButton from './Main/Common/Button/DelayedButton'
import UserAgreementCheckBox from './Main/Onboarding/UserAgreementCheckBox'

const FIELD_REQUIREMENT = {
    username: {
        required: 'Email is required',
        invalid: 'Invalid Email',
    },
    password: {
        required: 'Password is required',
        too_short: 'Password is at least 8 characters',
    },
}

const isValidEmail = (email) => {
    const isValid = (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return re.test(String(email).toLowerCase())
    }
    return isValid(email)
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
            userAgreementChecked: false,
        }
    }

    validate = (values) => {
        const { username, password } = values
        const errors = {}
        errors.username = this.validateUsername(username)
        errors.password = this.validatePassword(password)
        return errors
    }

    validateUsername = (username) => {
        let error
        // Validate email
        if (!username) {
            error = FIELD_REQUIREMENT.username.required
        } else if (!isValidEmail(username)) {
            error = FIELD_REQUIREMENT.username.invalid
        }
        return error
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
                onError: (errMsg) => {
                    this.increaseNumFailLoginAttempt()
                    this.setErrorMessage(errMsg)
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
            <View style={{ height: 29 }}>
                <Text style={styles.errorStyle}>{error}</Text>
            </View>
        ) : (
            <View style={{ height: 29 }} />
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
                    marginTop: 15,
                    marginBottom: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Text
                    style={[
                        DEFAULT_STYLE.subTitleText_1,
                        {
                            fontFamily: FONT_FAMILY_3,
                            color: '#828282',
                            fontWeight: '600',
                        },
                    ]}
                >
                    Don't have an account?
                </Text>
                <DelayedButton
                    style={[{ padding: 10 }]}
                    onPress={this.handleSignUp}
                >
                    <Text
                        style={[
                            DEFAULT_STYLE.subTitleText_1,
                            { fontFamily: FONT_FAMILY_3, color: GM_BLUE },
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
            <KeyboardAwareScrollView
                bounces={false}
                innerRef={(ref) => {
                    this.scrollview = ref
                }}
                style={styles.scroll}
                extraScrollHeight={13}
                contentContainerStyle={{
                    backgroundColor: 'white',
                    flexGrow: 1, // this will fix scrollview scroll issue by passing parent view width and height to it
                }}
            >
                <TouchableWithoutFeedback
                    onPress={this.handleContainerOnPressed.bind(this)}
                >
                    <View style={Styles.containerStyle}>
                        <Header
                            canBack={!this.props.loading}
                            hasBackButton={false}
                        />
                        <View style={styles.bodyContainerStyle}>
                            {this.renderError(this.state.errMsg)}
                            {/* <Text style={styles.titleTextStyle}>Get Started!</Text> */}

                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: 'flex-start',
                                }}
                            >
                                <Field
                                    name="username"
                                    label="Email"
                                    inputTitle="Email"
                                    placeholder="Email"
                                    keyboardType="email-address"
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
                                        DEFAULT_STYLE.smallTitle_1,
                                        {
                                            fontSize: 14,
                                            color: GM_BLUE,
                                            padding: 8,
                                            alignSelf: 'flex-end',
                                        },
                                    ]}
                                    onPress={this.handleResetPassword}
                                >
                                    Forgot password?
                                </Text>
                                <UserAgreementCheckBox
                                    onPress={(val) =>
                                        this.setState({
                                            ...this.state,
                                            userAgreementChecked: val,
                                        })
                                    }
                                    checked={this.state.userAgreementChecked}
                                />
                            </View>
                            <TouchableOpacity
                                activeOpacity={0.6}
                                onPress={handleSubmit(this.handleLoginPressed)}
                                style={[
                                    BUTTON_STYLE.GM_BLUE_BG_WHITE_BOLD_TEXT
                                        .containerStyle,
                                    {
                                        backgroundColor:
                                            this.props.loading ||
                                            !this.state.userAgreementChecked
                                                ? GM_BLUE_LIGHT
                                                : GM_BLUE,
                                    },
                                ]}
                                disabled={
                                    this.props.loading ||
                                    !this.state.userAgreementChecked
                                }
                            >
                                <Text
                                    style={[
                                        BUTTON_STYLE.GM_BLUE_BG_WHITE_BOLD_TEXT
                                            .textStyle,
                                    ]}
                                >
                                    Log In
                                </Text>
                            </TouchableOpacity>
                            {this.renderSignUp()}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                {this.renderRecaptcha()}
            </KeyboardAwareScrollView>
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
        paddingTop: 12,
        color: '#ff0033',
        justifyContent: 'center',
        alignSelf: 'center',
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
