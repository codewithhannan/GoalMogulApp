/** @format */

import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    StyleSheet,
    TouchableOpacity,
    Keyboard,
} from 'react-native'
import { color, default_style } from '../../styles/basic'
import { Formik, Field, ErrorMessage } from 'formik'
import InputBox from './Common/InputBox'
import * as yup from 'yup'

import OnboardingHeader from './Common/OnboardingHeader'

import { connect } from 'react-redux'
import { api as API } from '../../redux/middleware/api'
import { Actions } from 'react-native-router-flux'
import { authenticateInvitorCode } from '../../actions'

import DelayedButton from '../Common/Button/DelayedButton'
import ImagePicker from './Common/ImagePicker'

import OnboardingStyles, { getCardBottomOffset } from '../../styles/Onboarding'

import {
    trackWithProperties,
    EVENT as E,
    wrapAnalytics,
    SCREENS,
} from '../../monitoring/segment'

const { text: textStyle, button: buttonStyle } = OnboardingStyles

class OnboardingInviteCode extends Component {
    constructor(props) {
        super(props)
        this.state = {
            errorMessage: false,
        }

        // this.handleEditOnPressed = this.handleEditOnPressed.bind(this)
    }

    // handleEditOnPressed(pageId) {
    //     const { userId } = this.props
    //     this.props.openProfileDetailEditForm(userId, pageId)
    // }

    onError = () => {
        this.setState({ errorMessage: true })
        trackWithProperties(E.REG_INVITE_CODE, {
            result: 'waitlist',
        })
    }

    ReviewSchema = yup.object({
        inviterCode: yup.string().required(),
    })

    onNext = (value) => {
        // User attempts to click next when no fields have been set

        const errorMessage = () => {
            this.onError()
        }
        return this.props.authenticateInvitorCode(value, errorMessage)
    }

    render() {
        return (
            <>
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : ''}
                        style={{ flex: 1 }}
                        focusable
                    >
                        <Formik
                            initialValues={{
                                inviterCode: '',
                            }}
                            validationSchema={this.ReviewSchema}
                            onSubmit={async (value, { setSubmitting }) => {
                                Keyboard.dismiss()
                                this.onNext(value)

                                setSubmitting(false)
                            }}
                            validateOnBlur={true}
                        >
                            {({
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                values,
                                isSubmitting,
                                isValid,
                                dirty,
                            }) => (
                                <>
                                    <View
                                        style={[
                                            OnboardingStyles.container.page,
                                            {
                                                paddingBottom: getCardBottomOffset(),
                                            },
                                        ]}
                                    >
                                        <OnboardingHeader />
                                        <View
                                            style={[
                                                OnboardingStyles.container.card,
                                            ]}
                                        >
                                            <View
                                                style={{
                                                    justifyContent: 'center',

                                                    flexGrow: 1,
                                                    paddingBottom: 68,
                                                }}
                                            >
                                                <Text
                                                    style={
                                                        ([textStyle.title],
                                                        {
                                                            fontSize: 22,
                                                            fontWeight: '700',
                                                        })
                                                    }
                                                >
                                                    We're in private beta
                                                    testing
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontFamily:
                                                            'SFProDisplay-Regular',
                                                        fontSize: 14,
                                                        lineHeight: 17,

                                                        top: 5,

                                                        color: '#828282',
                                                    }}
                                                >
                                                    Enter Invite Code to gain
                                                    instant access
                                                </Text>

                                                <InputBox
                                                    key="inviterCode"
                                                    inputTitle="Invite Code"
                                                    placeholder={`Enter Invite Code`}
                                                    onChangeText={handleChange(
                                                        'inviterCode'
                                                    )}
                                                    onBlur={handleBlur(
                                                        'inviterCode'
                                                    )}
                                                    value={values.inviterCode}
                                                    onSubmitEditing={() => {
                                                        Keyboard.dismiss()
                                                    }}
                                                />
                                                {this.state.errorMessage && (
                                                    <>
                                                        <Text
                                                            style={{
                                                                color:
                                                                    '#F66565',

                                                                bottom: 15,
                                                                fontFamily:
                                                                    'SFProDisplay-Regular',
                                                                fontSize: 12,
                                                            }}
                                                        >
                                                            Invalid Code. Try
                                                            again.
                                                        </Text>
                                                        <View
                                                            style={{
                                                                fontSize: 12,
                                                                width: '90%',
                                                                bottom: 7,
                                                            }}
                                                        >
                                                            <Text
                                                                style={{
                                                                    fontFamily:
                                                                        'SFProDisplay-Regular',
                                                                    fontSize: 12,

                                                                    fontWeight:
                                                                        '500',
                                                                }}
                                                            >
                                                                *Hint: Your Code
                                                                is the GoalMogul
                                                                AccountID of the
                                                                friend who
                                                                invited you.
                                                            </Text>
                                                        </View>
                                                    </>
                                                )}
                                            </View>
                                            <DelayedButton
                                                style={[
                                                    buttonStyle
                                                        .GM_BLUE_BG_WHITE_BOLD_TEXT
                                                        .containerStyle,
                                                    {
                                                        marginBottom: 8,
                                                        backgroundColor:
                                                            !(
                                                                isValid && dirty
                                                            ) || isSubmitting
                                                                ? '#DBDADA'
                                                                : color.GM_BLUE,
                                                    },
                                                ]}
                                                disabled={
                                                    !(isValid && dirty) ||
                                                    isSubmitting
                                                }
                                                onPress={handleSubmit}
                                            >
                                                <Text
                                                    style={
                                                        buttonStyle
                                                            .GM_BLUE_BG_WHITE_BOLD_TEXT
                                                            .textStyle
                                                    }
                                                >
                                                    Submit
                                                </Text>
                                            </DelayedButton>
                                            <DelayedButton
                                                style={[
                                                    buttonStyle
                                                        .GM_WHITE_BG_GRAY_TEXT
                                                        .containerStyle,
                                                ]}
                                                onPress={() =>
                                                    Actions.push(
                                                        'OnBoardingWaitlistNoCode'
                                                    )
                                                }
                                            >
                                                <Text
                                                    style={
                                                        buttonStyle
                                                            .GM_WHITE_BG_GRAY_TEXT
                                                            .textStyle
                                                    }
                                                >
                                                    I don't have a Code
                                                </Text>
                                            </DelayedButton>
                                        </View>
                                    </View>
                                </>
                            )}
                        </Formik>
                    </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
            </>
        )
    }
}

const styles = StyleSheet.create({
    textinput: {
        paddingTop: 10,
        paddingHorizontal: 10,
        padding: 5,
    },
    imagePickerStyles: {
        marginVertical: 60,
    },
})

const mapStateToProps = (state) => {
    const { profilePic } = state.registration
    const { userId } = state.user

    return { profilePic, userId }
}

const AnalyticsWrapper = wrapAnalytics(OnboardingInviteCode)

export default connect(mapStateToProps, {
    authenticateInvitorCode,
})(AnalyticsWrapper)
// export default OnboardingInviteCode
