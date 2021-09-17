/** @format */

import React, { Component } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    KeyboardAvoidingView,
    ScrollView,
} from 'react-native'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { TextField } from 'react-native-material-textfield-gm'
import Expo, { WebBrowser } from 'expo'
import * as Linking from 'expo-linking'

/* Components */
import SearchBarHeader from '../../Common/Header/SearchBarHeader'
import Button from '../Button'

/* Styles */
import Styles from '../Styles'

/* Actions */
/* TODO: update actions needed */
import {
    onUpdatePhoneNumberSubmit,
    onAddVerifyPhone,
    verifyPhoneNumberSuccess,
} from '../../../actions'
import { wrapAnalytics, SCREENS } from '../../../monitoring/segment'

const validatePhone = (value) =>
    value && /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value)
        ? 'Invalid phone number'
        : undefined

class EditPhoneNumberForm extends Component {
    handleOnSubmitPress = (values) => {
        // TODO: send code and show
        // update actions imported and used in connect()
        console.log('values are: ', values)
        return this.props.onUpdatePhoneNumberSubmit(values, () =>
            this.handleOnVerifyPress()
        )
    }

    handleOnVerifyPress = async () => {
        console.log('user trying to verify phone number')
        alert('Please check your message for a 6 digit verification code.')

        this.props.onAddVerifyPhone(this.handleRedirect)
    }

    handleRedirect = (event) => {
        WebBrowser.dismissBrowser()
        // TODO: parse url and determine verification states
        const { path, queryParams } = Linking.parse(event.url)

        if (path === 'status=fail') {
            // TODO: error handling, verification failed
            return
        }
        this.props.verifyPhoneNumberSuccess()
        alert('You have successfully verified your phone number.')
    }

    /* Refactor error function out */
    renderError(error) {
        return error ? (
            <View style={{ marginTop: 5 }}>
                {/* <View style={{ height: 20 }}> */}
                <Text style={styles.errorStyle}>{error}</Text>
            </View>
        ) : null
    }

    renderInput = ({
        input: { onChange, ...restInput },
        label,
        meta: { error },
        ...custom
    }) => {
        return (
            <View style={styles.inputContainerStyle}>
                <TextField
                    label={label}
                    title={custom.title}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    onChangeText={onChange}
                    error={error}
                    enablesReturnKeyAutomatically={false}
                    returnKeyType="done"
                    {...custom}
                    {...restInput}
                />
            </View>
        )
    }

    render() {
        const { handleSubmit, error } = this.props

        return (
            <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                <SearchBarHeader
                    backButton
                    rightIcon="empty"
                    title="Phone number"
                />
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
                            Update your phone number
                        </Text>
                        <Text style={{ paddingBottom: 10 }}>
                            It's important to protect your account.
                        </Text>
                    </View>
                    {this.renderError(error)}
                    <Field
                        name="phone"
                        label="Phone number"
                        component={this.renderInput}
                        keyboardType="phone-pad"
                    />
                    <Field
                        name="password"
                        label="Password"
                        component={this.renderInput}
                        secureTextEntry
                    />
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={handleSubmit(this.handleOnSubmitPress)}
                    >
                        <Button text="Submit" />
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        )
    }
}

const styles = {
    contentContainer: {
        flexGrow: 1,
        paddingTop: 10,
    },
    inputContainerStyle: {
        paddingTop: 10,
        paddingLeft: 20,
        paddingRight: 20,
        marginBottom: 5,
    },
    errorStyle: {
        marginTop: 15,
        color: '#ff0033',
        justifyContent: 'center',
        // marginBottom: 4,
        alignSelf: 'center',
    },
}

// Analytics must be the inner most wrapper
const AnalyticsWrapper = wrapAnalytics(
    EditPhoneNumberForm,
    SCREENS.EDIT_PHONE_NUMBER
)

const ReduxWrapper = reduxForm({
    form: 'editPhoneNumberForm',
    enableReinitialize: true,
})(AnalyticsWrapper)

export default connect(null, {
    onUpdatePhoneNumberSubmit,
    onAddVerifyPhone,
    verifyPhoneNumberSuccess,
})(ReduxWrapper)
