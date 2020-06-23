/** @format */

import React, { Component } from 'react'
import { View, Text, Keyboard } from 'react-native'
import { connect } from 'react-redux'
import { Field, reduxForm, SubmissionError } from 'redux-form'
import { Actions } from 'react-native-router-flux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

/* Components */
import Header from './Common/Header'
import Button from './Common/Button'
import Divider from './Common/Divider'
import Input from './Common/Input'
import DelayedButton from '../Main/Common/Button/DelayedButton'

/* Styles */
import Styles from './Styles'

/* Actions */
import {
    registrationLogin,
    registrationNextAddProfile,
    handleOnFormChange,
} from '../actions'

/* Refactor validation as a separate module */
const validateInput = (value) =>
    value &&
    !(
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ||
        /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,3})|(\(?\d{2,3}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/i.test(
            value
        )
    )
        ? 'Invalid input'
        : undefined

const minLength = (min) => (value) =>
    value && value.length < min
        ? `Must be ${min} characters or more`
        : undefined

const minLength8 = minLength(8)

const validate = (values) => {
    const errors = {}
    if (!values.name) {
        errors.name = 'Required'
    }
    if (!values.email) {
        errors.email = 'Required'
    }
    if (!values.password) {
        errors.password = 'Required'
    }
    return errors
}

class Account extends Component {
    handleContainerOnPressed() {
        Keyboard.dismiss()
    }

    handleLogInPressed() {
        console.log('login pressed')
        Actions.push('login')
    }

    handleNextPressed = (values) => {
        console.log('next pressed: with values', values)
        const errors = validate(values)
        if (
            !(Object.keys(errors).length === 0 && errors.constructor === Object)
        ) {
            throw new SubmissionError(errors)
        }
        const { name, email, password } = values

        Keyboard.dismiss()
        return this.props.registrationNextAddProfile({ name, email, password })
    }

    renderSplitter() {
        return null
        // return (
        //   <View style={styles.splitterStyle}>
        //     <Divider horizontal width={80} />
        //     <Text style={styles.splitterTextStyle}>OR</Text>
        //     <Divider horizontal width={80} />
        //   </View>
        // );
    }

    renderError(error) {
        return error ? (
            <View style={{ height: 29 }}>
                <Text style={styles.errorStyle}>{error}</Text>
            </View>
        ) : null
    }

    renderLogIn() {
        return null
        // return (
        //   <TouchableOpacity activeOpacity={0.6} onPress={this.handleLogInPressed.bind(this)}>
        //     <View>
        //       <Button text='Log In to your account' arrow />
        //     </View>
        //   </TouchableOpacity>
        // );
    }

    render() {
        const { handleSubmit, error } = this.props
        return (
            <KeyboardAwareScrollView
                bounces={false}
                innerRef={(ref) => {
                    this.scrollview = ref
                }}
                style={styles.scroll}
                contentContainerStyle={{
                    backgroundColor: 'white',
                    flexGrow: 1, // this will fix scrollview scroll issue by passing parent view width and height to it
                }}
            >
                <View style={Styles.containerStyle}>
                    <Header canBack={!this.props.loading} />
                    <View style={Styles.bodyContainerStyle}>
                        <Text style={styles.titleTextStyle}>Get Started!</Text>
                        {this.renderError(error)}
                        <Field
                            name="name"
                            label="Full Name"
                            withRef
                            component={Input}
                            disabled={this.props.loading}
                            returnKeyType="next"
                            onSubmitEditing={() => {
                                this.refs['email']
                                    .getRenderedComponent()
                                    .focus()
                            }}
                        />
                        <Field
                            ref="email"
                            name="email"
                            label="Email or Phone Number"
                            withRef
                            title="Please specify your country code, e.g. +1 for US"
                            returnKeyType="next"
                            component={Input}
                            validate={validateInput}
                            disabled={this.props.loading}
                            onSubmitEditing={() => {
                                this.refs['password']
                                    .getRenderedComponent()
                                    .focus()
                                // this._scrollToInput(findNodeHandle(this._occupation));
                            }}
                        />
                        <Field
                            ref="password"
                            name="password"
                            label="Password"
                            withRef
                            component={Input}
                            returnKeyType="done"
                            secure
                            validate={minLength8}
                            disabled={this.props.loading}
                            onSubmitEditing={handleSubmit(
                                this.handleNextPressed
                            )}
                            textContentType="newPassword"
                        />

                        <DelayedButton
                            activeOpacity={0.6}
                            onPress={handleSubmit(this.handleNextPressed)}
                        >
                            <View>
                                <Button text="Next" />
                            </View>
                        </DelayedButton>
                        {this.renderSplitter()}
                        {this.renderLogIn()}
                    </View>
                </View>
            </KeyboardAwareScrollView>
        )

        // return (
        //   <KeyboardAvoidingView
        //     behavior='padding'
        //     style={{ flex: 1 }}
        //   >
        //     <ScrollView
        //       contentContainerStyle={{ flexGrow: 1 }}
        //       keyboardDismissMode='interactive'
        //       keyboardShouldPersistTaps='never'
        //       overScrollMode='never'
        //       bounces={false}
        //     >
        //       <TouchableWithoutFeedback onPress={this.handleContainerOnPressed.bind(this)}>
        //         <View style={Styles.containerStyle}>
        //           <Header />
        //           <View style={Styles.bodyContainerStyle}>
        //             <Text style={styles.titleTextStyle}>Get Started!</Text>
        //             {this.renderError(error)}
        //             <Field
        //               name='name'
        //               label='Full name'
        //               withRef
        //               component={Input}
        //               disabled={this.props.loading}
        //               returnKeyType='next'
        //               onNextPress={() => {
        //                 this.refs['email'].getRenderedComponent().focus();
        //               }}
        //             />
        //             <Field
        //               ref='email'
        //               name='email'
        //               label='Email or Phone number'
        //               withRef
        //               title='Please specify your country code, e.g. +1 for US'
        //               returnKeyType='next'
        //               component={Input}
        //               validate={validateInput}
        //               disabled={this.props.loading}
        //               onNextPress={() => {
        //                 this.refs['password'].getRenderedComponent().focus();
        //                 // this._scrollToInput(findNodeHandle(this._occupation));
        //               }}
        //             />
        //             <Field
        //               ref='password'
        //               name='password'
        //               label='Password'
        //               withRef
        //               component={Input}
        //               returnKeyType='done'
        //               secure
        //               validate={minLength8}
        //               disabled={this.props.loading}
        //               onDonePress={handleSubmit(this.handleNextPressed)}
        //             />
        //
        //             <TouchableOpacity activeOpacity={0.6} onPress={handleSubmit(this.handleNextPressed)}>
        //               <View>
        //                 <Button text='Next' />
        //               </View>
        //             </TouchableOpacity>
        //             {this.renderSplitter()}
        //             {this.renderLogIn()}
        //           </View>
        //         </View>
        //       </TouchableWithoutFeedback>
        //     </ScrollView>
        //   </KeyboardAvoidingView>
        // );
    }
}

const styles = {
    titleTextStyle: {
        fontSize: 25,
        fontWeight: '700',
        color: '#646464',
        alignSelf: 'center',
        marginTop: 20,
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
    errorStyle: {
        marginTop: 5,
        color: '#ff0033',
        justifyContent: 'center',
        alignSelf: 'center',
    },
}

Account = reduxForm({
    form: 'accountRegistrationForm',
})(Account)

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
