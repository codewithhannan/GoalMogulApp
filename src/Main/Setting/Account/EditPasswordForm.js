/** @format */

import React, { Component } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    KeyboardAvoidingView,
    ScrollView,
    Keyboard,
} from 'react-native'
import { connect } from 'react-redux'
import { Field, reduxForm, SubmissionError } from 'redux-form'
import { DotIndicator } from 'react-native-indicators'

/* Components */
import SearchBarHeader from '../../Common/Header/SearchBarHeader'
import Input from '../../Common/Text/Input'
import LoadingModal from '../../Common/Modal/LoadingModal'

/* Styles */
import Styles from '../Styles'

/* Actions */
import { handleUpdatePassword } from '../../../actions'
import { wrapAnalytics, SCREENS } from '../../../monitoring/segment'

/* TODO: abstract this validation fuction */
const DEBUG_KEY = '[ UI EditPasswordForm ]'
const minLength = (min) => (value) =>
    value && value.length < min
        ? `Must be ${min} characters or more`
        : undefined

const minLength8 = minLength(8)

const validate = (values) => {
    const errors = {}
    if (!values.oldPassword) {
        errors.oldPassword = 'Required'
    }
    if (!values.newPassword) {
        errors.newPassword = 'Required'
    }
    if (!values.confirmPassword) {
        errors.confirmPassword = 'Required'
    }

    return errors
}

class EditPasswordForm extends Component {
    handleOnSendPress = (values) => {
        Keyboard.dismiss()
        const errors = validate(values)
        if (
            !(Object.keys(errors).length === 0 && errors.constructor === Object)
        ) {
            console.log('submission error: ', errors)
            throw new SubmissionError(errors)
        }
        console.log('user tries to Reset password with values: ', values)
        // this.props.onResendEmailPress();
        return this.props.handleUpdatePassword(values)
    }

    renderPasswordForm() {
        return (
            <View>
                <Field
                    name="oldPassword"
                    label="Old password"
                    component={Input}
                    secure
                />
                <Field
                    name="newPassword"
                    label="New password"
                    component={Input}
                    validate={minLength8}
                    secure
                />
                <Field
                    name="confirmPassword"
                    label="Confirm new password"
                    component={Input}
                    secure
                />
            </View>
        )
    }

    /* Refactor error function out */
    renderError(error) {
        return error ? (
            <View style={{ marginTop: 15, marginBottom: 10 }}>
                <Text style={styles.errorStyle}>{error}</Text>
            </View>
        ) : null
    }

    renderButton(handleSubmit) {
        return (
            <TouchableOpacity
                activeOpacity={0.6}
                onPress={handleSubmit(this.handleOnSendPress)}
            >
                <View style={Styles.buttonContainerStyle}>
                    <Text style={Styles.buttonTextStyle}>Update</Text>
                </View>
            </TouchableOpacity>
        )
    }

    renderEmail() {
        if (this.props.email.address) {
            return (
                <Text style={Styles.detailTextStyle}>
                    {this.props.email.address}
                </Text>
            )
        }
        return null
    }

    render() {
        const { handleSubmit, error } = this.props

        return (
            <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
                <LoadingModal
                    visible={this.props.updatingPassword}
                    customIndicator={<DotIndicator size={12} color="white" />}
                />
                <SearchBarHeader
                    backButton
                    rightIcon="empty"
                    title="Password"
                />
                <KeyboardAvoidingView
                    behavior="padding"
                    style={{ flex: 1, backgroundColor: '#ffffff' }}
                >
                    <ScrollView
                        style={styles.scroll}
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{
                            flexGrow: 1,
                            backgroundColor: '#ffffff',
                        }}
                    >
                        <View style={Styles.titleSectionStyle}>
                            <Text style={Styles.titleTextStyle}>
                                Update password
                            </Text>
                        </View>
                        {this.renderError(error)}
                        {this.renderPasswordForm()}
                        {this.renderButton(handleSubmit)}
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        )
    }
}

const styles = {
    errorStyle: {
        color: '#ff0033',
        justifyContent: 'center',
        alignSelf: 'center',
        fontSize: 15,
    },
}

const mapStateToProps = (state) => {
    const { email } = state.setting
    const { updatingPassword } = state.user

    return {
        email,
        updatingPassword,
    }
}

// Make sure AnalyticsWrapper is the inner most wrapper
const AnalyticsWrapper = wrapAnalytics(EditPasswordForm, SCREENS.EDIT_PWD_FORM)

const ReduxWrapper = reduxForm({
    form: 'passwordEditForm',
})(AnalyticsWrapper)

export default connect(mapStateToProps, {
    handleUpdatePassword,
})(ReduxWrapper)
