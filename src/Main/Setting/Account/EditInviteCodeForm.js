/**
 * Form to update invite link
 *
 * @format
 */

/** @format */

import React, { Component } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    KeyboardAvoidingView,
    ScrollView,
    SafeAreaView,
    TextInput,
    Platform,
} from 'react-native'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import { TextField } from 'react-native-material-textfield-gm'

/* Components */
import SearchBarHeader from '../../Common/Header/SearchBarHeader'
import Button from '../Button'

/* Styles */
import Styles from '../Styles'

/* Actions */
/* TODO: update actions needed */
import { updateInviteCode } from '../../../actions'

// Selector
import { SCREENS, wrapAnalytics } from '../../../monitoring/segment'
import InputBox from '../../Onboarding/Common/InputBox'
import DelayedButton from '../../Common/Button/DelayedButton'

class EditInviteCodeForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            inviteCodeValidationError: undefined,
        }
    }
    componentDidMount() {
        const { initialVal } = this.props
        console.log(
            '[EditInviteCodeForm] [componentDidMount] code is: ',
            initialVal
        )
        if (initialVal) {
            this.props.initialize({
                inviteCode: initialVal,
            })
        }
    }

    handleOnSubmitPress = (values) => {
        return this.props.updateInviteCode(this.props.inviteCode)
    }

    renderError(error) {
        return error ? (
            <View style={{ marginTop: 16, paddingHorizontal: 20 }}>
                <Text style={styles.errorStyle}>hannan</Text>
            </View>
        ) : null
    }

    renderInput = ({
        input: { onChange, value, ...restInput },
        label,
        meta: { error },
        caption,
        status,
        onSubmitEditing,
        ...custom
    }) => {
        return (
            <View style={{ marginHorizontal: 15 }}>
                <InputBox
                    key="inviteCode"
                    inputTitle="Invite code"
                    placeholder="Your customized invite code"
                    onChangeText={(text) => {
                        if (text && text.length) {
                            this.setState({
                                inviteCodeValidationError: undefined,
                            })
                        }
                        onChange(text)
                    }}
                    value={value}
                    // disabled={this.props.updatingInviteCode}
                    returnKeyType="done"
                    caption={caption}
                    status={status}
                    onSubmitEditing={onSubmitEditing}
                />
            </View>
        )
    }

    render() {
        const { handleSubmit, error } = this.props

        console.log('THIS IS ERROR', error)

        const isButtonDisabled =
            this.state.inviteCodeValidationError ||
            this.props.initialVal === this.props.inviteCode ||
            !this.props.inviteCode ||
            !this.props.inviteCode.length
        return (
            <KeyboardAvoidingView
                behavior={Platform.select({
                    ios: 'padding',
                    android: 'height',
                    default: 'padding',
                })}
                style={{ flex: 1 }}
            >
                <SearchBarHeader
                    backButton
                    rightIcon="empty"
                    title="Invite code"
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
                            Customize your invite code
                        </Text>
                    </View>
                    {this.renderError(error)}
                    <Field
                        name="inviteCode"
                        label="Invite code"
                        component={this.renderInput}
                        caption={this.state.inviteCodeValidationError}
                        status={
                            this.state.inviteCodeValidationError
                                ? 'danger'
                                : 'basic'
                        }
                        onSubmitEditing={({ nativeEvent }) => {
                            if (
                                nativeEvent &&
                                (!nativeEvent.text || !nativeEvent.text.length)
                            ) {
                                this.setState({
                                    inviteCodeValidationError:
                                        'Invite code cannot be empty.',
                                })
                            }
                        }}
                    />
                    <DelayedButton
                        activeOpacity={0.6}
                        onPress={handleSubmit(this.handleOnSubmitPress)}
                        // disabled={isButtonDisabled}
                    >
                        <Button
                            text="Update"
                            //  disabled={isButtonDisabled}
                        />
                    </DelayedButton>
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
    errorStyle: {
        color: '#ff0033',
        justifyContent: 'center',
        alignSelf: 'center',
        fontSize: 15,
    },
    inputStyle: {
        paddingTop: 6,
        paddingBottom: 6,
        backgroundColor: 'white',
        borderRadius: 22,
    },
}

const mapStateToProps = (state) => {
    const selector = formValueSelector('editInviteCodeForm')
    const { user, updatingInviteCode } = state.user
    const { inviteCode } = user

    return {
        user,
        initialVal: inviteCode,
        inviteCode: selector(state, 'inviteCode'),
        updatingInviteCode,
    }
}

const AnalyticsWrapper = wrapAnalytics(
    EditInviteCodeForm,
    SCREENS.EDIT_INVITE_CODE_FORM
)

const ReduxWrapper = reduxForm({
    form: 'editInviteCodeForm',
    enableReinitialize: true,
})(AnalyticsWrapper)

export default connect(mapStateToProps, { updateInviteCode })(ReduxWrapper)
