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

/* Components */
import SearchBarHeader from '../../Common/Header/SearchBarHeader'
import Button from '../Button'

/* Styles */
import Styles from '../Styles'

/* Actions */
/* TODO: update actions needed */
import { onUpdateEmailSubmit } from '../../../actions'

// Selector
import { getUserData } from '../../../redux/modules/User/Selector'
import { SCREENS, wrapAnalytics } from '../../../monitoring/segment'

const validateEmail = (value) =>
    value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
        ? 'Invalid email address'
        : undefined

class EditEmailForm extends Component {
    handleOnSubmitPress = (values) => {
        // TODO: send code and show
        // update actions imported and used in connect()
        console.log('values are: ', values)
        return this.props.onUpdateEmailSubmit(values, (message) =>
            alert(message)
        )
    }

    /* Refactor error function out */
    renderError(error) {
        return error ? (
            <View style={{ marginTop: 16, paddingHorizontal: 20 }}>
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
                    keyboardType="email-address"
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
                    title="Email addresses"
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
                            Update your email address
                        </Text>
                        <Text style={{ paddingBottom: 10 }}>
                            We'll send a verification code to this email
                            address.
                        </Text>
                    </View>
                    {this.renderError(error)}
                    <Field
                        name="email"
                        label="Email address"
                        component={this.renderInput}
                        validate={validateEmail}
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
        color: '#ff0033',
        justifyContent: 'center',
        alignSelf: 'center',
        fontSize: 15,
    },
}

const mapStateToProps = (state, props) => {
    const { userId } = props
    const user = getUserData(state, userId, 'user')
    const { email } = user

    return {
        email,
    }
}

const AnalyticsWrapper = wrapAnalytics(EditEmailForm, SCREENS.EDIT_EMAIL_FORM)

const ReduxWrapper = reduxForm({
    form: 'addPhoneNumberForm',
    enableReinitialize: true,
})(AnalyticsWrapper)

export default connect(mapStateToProps, { onUpdateEmailSubmit })(ReduxWrapper)
