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
    verifyPhoneNumberSuccess,
    onAddVerifyPhone,
} from '../../../actions'

// Selector
import { getUserData } from '../../../redux/modules/User/Selector'
import { wrapAnalytics, SCREENS } from '../../../monitoring/segment'

class AddPhoneNumberForm extends Component {
    handleOnAddPress = (values) => {
        // TODO: validate phone number
        // update actions imported and used in connect()
        console.log('phone number is: ', values)
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

    /* Refactor error function out */
    renderError(error) {
        return error ? (
            <View style={{ paddingHorizontal: 20 }}>
                <Text style={styles.errorStyle}>{error}</Text>
            </View>
        ) : null
    }

    render() {
        const { handleSubmit, error } = this.props

        return (
            <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                <SearchBarHeader
                    backButton
                    rightIcon="empty"
                    title="Phone numbers"
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
                            Add a new phone number
                        </Text>
                        <Text style={{ paddingBottom: 10 }}>
                            We'll send a verification code to this number.
                            You'll need it for the next step.
                        </Text>
                    </View>
                    {this.renderError(error)}

                    <Field
                        name="phone"
                        label="Phone number"
                        keyboardType="phone-pad"
                        component={this.renderInput}
                    />
                    <Field
                        name="password"
                        label="Password"
                        component={this.renderInput}
                        secureTextEntry
                    />
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={handleSubmit(this.handleOnAddPress)}
                    >
                        <Button text="Add" />
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
        paddingLeft: 20,
        paddingRight: 20,
        marginBottom: 5,
    },
    errorStyle: {
        marginTop: 15,
        color: '#ff0033',
        justifyContent: 'center',
        marginBottom: 4,
        alignSelf: 'center',
    },
}

const mapStateToProps = (state, props) => {
    // const { userId } = props;
    // const user = getUserData(state, userId, 'user');
    // const { email } = user;

    return {
        // email
    }
}

// Analytics must be the inner most wrapper
const AnalyticsWrapper = wrapAnalytics(
    AddPhoneNumberForm,
    SCREENS.ADD_PHONE_NUMBER
)

const ReduxWrapper = reduxForm({
    form: 'addPhoneNumberForm',
    enableReinitialize: true,
})(AnalyticsWrapper)

export default connect(mapStateToProps, {
    onUpdatePhoneNumberSubmit,
    verifyPhoneNumberSuccess,
    onAddVerifyPhone,
})(ReduxWrapper)
