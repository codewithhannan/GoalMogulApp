/**
 * /*
 * NOTE: This file is deprecated. It's replaced by RegistrationAccount.js
 *
 * @format
 */

import React, { Component } from 'react'
import {
    KeyboardAvoidingView,
    View,
    ScrollView,
    Text,
    Keyboard,
} from 'react-native'
import { connect } from 'react-redux'

/* Components */
import Header from './Common/Header'
import Button from './Common/Button'
import Divider from './Common/Divider'
import InputField from './Common/InputField'
import DelayedButton from '../Main/Common/Button/DelayedButton'

/* Styles */
import Styles from './Styles'

/* Actions */
import {
    registrationLogin,
    registrationNextAddProfile,
    handleOnFormChange,
} from '../actions'

class Account extends Component {
    handleContainerOnPressed() {
        Keyboard.dismiss()
    }

    handleLogInPressed() {
        console.log('login pressed')
        this.props.registrationLogin()
    }

    handleNextPressed() {
        console.log('next pressed')
        const name = this.props.name
        const email = this.props.email
        const password = this.props.password
        Keyboard.dismiss()
        this.props.registrationNextAddProfile({ name, email, password })
    }

    handleOnNameChange(name) {
        this.props.handleOnFormChange(name, 'name')
    }

    handleOnEmailChange(email) {
        this.props.handleOnFormChange(email, 'email')
    }

    handleOnPasswordChange(password) {
        this.props.handleOnFormChange(password, 'password')
    }

    renderError() {
        let error = this.props.error.account ? this.props.error.account : ''
        return (
            <View style={{ height: 15 }}>
                <Text style={Styles.errorStyle}>{error}</Text>
            </View>
        )
    }

    renderSplitter() {
        return (
            <View style={styles.splitterStyle}>
                <Divider horizontal width={80} />
                <Text style={styles.splitterTextStyle}>OR</Text>
                <Divider horizontal width={80} />
            </View>
        )
    }

    renderLogIn() {
        return (
            <DelayedButton
                onPress={this.handleLogInPressed.bind(this)}
                touchableWithoutFeedback
            >
                <View>
                    <Button text="Log In to your account" arrow />
                </View>
            </DelayedButton>
        )
    }
    // <KeyboardAvoidingView
    //   behavior='position'
    //   style={{ flex: 1 }}
    //   contentContainerStyle={Styles.containerStyle}
    //   keyboardVerticalOffset={-150}
    // >
    render() {
        return (
            <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardDismissMode="interactive"
                    keyboardShouldPersistTaps="never"
                    overScrollMode="never"
                    bounces={false}
                >
                    <DelayedButton
                        onPress={this.handleContainerOnPressed.bind(this)}
                        touchableWithoutFeedback
                    >
                        <View style={Styles.containerStyle}>
                            <Header />
                            <View style={Styles.bodyContainerStyle}>
                                <Text style={styles.titleTextStyle}>
                                    Get Started!
                                </Text>
                                {this.renderError()}
                                <InputField
                                    placeholder="Full Name"
                                    value={this.props.name}
                                    onChange={this.handleOnNameChange.bind(
                                        this
                                    )}
                                    error={this.props.error.name}
                                />
                                <InputField
                                    placeholder="Email"
                                    value={this.props.email}
                                    onChange={this.handleOnEmailChange.bind(
                                        this
                                    )}
                                    error={this.props.error.email}
                                />
                                <InputField
                                    placeholder="Password"
                                    value={this.props.password}
                                    secureTextEntry
                                    onChange={this.handleOnPasswordChange.bind(
                                        this
                                    )}
                                    error={this.props.error.password}
                                    textContentType="newPassword"
                                />

                                <DelayedButton
                                    onPress={this.handleNextPressed.bind(this)}
                                    touchableWithoutFeedback
                                >
                                    <View>
                                        <Button text="Next" />
                                    </View>
                                </DelayedButton>
                                {this.renderSplitter()}
                                {this.renderLogIn()}
                            </View>
                        </View>
                    </DelayedButton>
                </ScrollView>
            </KeyboardAvoidingView>
        )
    }
}

const styles = {
    titleTextStyle: {
        fontSize: 25,
        fontWeight: '700',
        color: '#646464',
        alignSelf: 'center',
        marginTop: 25,
        marginBottom: 10,
    },
    splitterStyle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 32,
        marginBottom: 10,
    },
    splitterTextStyle: {
        fontSize: 15,
        color: '#646464',
        fontWeight: '800',
        marginLeft: 10,
        marginRight: 10,
    },
    logInContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logInTextStyle: {
        fontSize: 15,
        color: '#34c0dd',
        fontWeight: '600',
    },
}

const mapStateToProps = (state) => {
    const { name, password, email, error, loading } = state.registration

    return {
        name,
        email,
        password,
        error,
        loading,
    }
}

export default connect(mapStateToProps, {
    registrationLogin,
    registrationNextAddProfile,
    handleOnFormChange,
})(Account)
