/** @format */

import React from 'react'
import {
    View,
    Text,
    Dimensions,
    Platform,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native'
import ReactMoE from 'react-native-moengage'

import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import OnboardingHeader from './Common/OnboardingHeader'
import { Icon } from '@ui-kitten/components'

import { text } from '../../styles/basic'
import OnboardingStyles, { getCardBottomOffset } from '../../styles/Onboarding'

import DelayedButton from '../Common/Button/DelayedButton'
import * as yup from 'yup'

import InputBox from './Common/InputBox'
import { Formik } from 'formik'
import {
    wrapAnalytics,
    SCREENS,
    track,
    trackWithProperties,
    EVENT as E,
} from '../../monitoring/segment'
import { storeData } from '../../store/storage'

import { phoneNumberSent } from '../../redux/modules/auth/phoneVerification'

const { button: buttonStyle, text: textStyle } = OnboardingStyles

class OnboardingPhoneVerification extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            syncContactInfoModalVisible: false,
            loading: true, // test loading param
            errMessage: undefined,
            checked: true,
            cca2: 'US',
            countryCode: {
                cca2: 'US',
                country: {
                    callingCode: ['1'],
                    cca2: 'US',
                    currency: ['USD'],
                    flag: 'flag-us',
                    name: 'United States',
                    region: 'Americas',
                    subregion: 'North America',
                },
            },
            errorMessage: false,
        }
    }

    onNotNow = () => {
        trackWithProperties(E.REG_PHONE_VERIFICATION_SKIP, {
            UserId: this.props.userId,
        })
        const screenTransitionCallback = () => {
            Actions.push('registration_add_photo')
        }
        screenTransitionCallback()
    }

    onError = () => this.setState({ errorMessage: true })

    onNext = (value) => {
        const errorMessage = () => {
            this.onError()
        }
        ReactMoE.setUserContactNumber(value)

        return this.props.phoneNumberSent(value, errorMessage)
    }

    ReviewSchema = yup.object({
        phoneNumber: yup.string().required(),
    })

    componentDidMount() {
        trackWithProperties(E.REG_MOBILE_VERIFICATION_START, {
            verification_method: 'sms',
        })
    }

    render() {
        return (
            <>
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <View
                        style={[
                            OnboardingStyles.container.page,
                            { paddingBottom: getCardBottomOffset() },
                        ]}
                    >
                        <OnboardingHeader />

                        <Formik
                            initialValues={{
                                phoneNumber: '',
                            }}
                            validationSchema={this.ReviewSchema}
                            onSubmit={async (value, { setSubmitting }) => {
                                console.log(
                                    'this isi value',
                                    `+${this.state.countryCode.country.callingCode[0]}${value.phoneNumber}`
                                )

                                const phoneNumber = `+${this.state.countryCode.country.callingCode[0]}${value.phoneNumber}`
                                storeData('PHONE_NUMBER', phoneNumber)
                                this.onNext(phoneNumber)

                                Actions.push('registration_verify_phone')
                                Keyboard.dismiss()
                                setSubmitting(false)
                                track(E.REG_FIELDS_FILL)
                            }}
                            validateOnBlur={true}
                        >
                            {({
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                values,
                                isValid,
                                dirty,
                            }) => (
                                <>
                                    <View
                                        style={[
                                            OnboardingStyles.container.card,
                                        ]}
                                    >
                                        <View
                                            style={{
                                                flexGrow: 1,
                                                alignItems: 'center',
                                                width: '100%',
                                            }}
                                        >
                                            <View
                                                style={{
                                                    width: '100%',
                                                    marginTop: 120,
                                                }}
                                            >
                                                <Text
                                                    style={
                                                        ([textStyle.title],
                                                        {
                                                            fontSize: 22,
                                                            fontWeight: '700',
                                                            textAlign: 'center',
                                                        })
                                                    }
                                                >
                                                    You're in!
                                                </Text>
                                                {/* <Text style={textStyle.title}>use GoalMogul!</Text> */}
                                            </View>
                                            <Text style={styles.noteTextStyle}>
                                                Mobile Phone Verification
                                            </Text>

                                            <InputBox
                                                key="phoneNumber"
                                                inputTitle="Phone Number"
                                                placeholder={`Enter Phone Number`}
                                                onSubmitEditing={() => {
                                                    Keyboard.dismiss()
                                                }}
                                                onChangeText={handleChange(
                                                    'phoneNumber'
                                                )}
                                                onBlur={handleBlur(
                                                    'phoneNumber'
                                                )}
                                                value={values.phoneNumber}
                                                countryCode={
                                                    this.state.countryCode
                                                }
                                                onCountryCodeSelected={(
                                                    value
                                                ) =>
                                                    this.setState({
                                                        countryCode: value,
                                                    })
                                                }
                                            />

                                            <View
                                                style={{
                                                    alignSelf: 'flex-start',
                                                    flexDirection: 'row',
                                                }}
                                            >
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        this.setState({
                                                            checked: !this.state
                                                                .checked,
                                                        })
                                                    }
                                                    style={{ width: '15%' }}
                                                >
                                                    <View
                                                        style={{
                                                            height: 16,
                                                            width: 16,
                                                            borderRadius: 2,
                                                            borderWidth: 0.3,
                                                            backgroundColor: this
                                                                .state.checked
                                                                ? '#45C9F6'
                                                                : 'transparent',
                                                            borderColor: this
                                                                .state.checked
                                                                ? 'transparent'
                                                                : 'grey',
                                                        }}
                                                    />
                                                    <Icon
                                                        name="done"
                                                        pack="material"
                                                        style={{
                                                            height: 12,
                                                            position:
                                                                'absolute',
                                                            bottom: 2,
                                                            left: 2,
                                                            tintColor: this
                                                                .state.checked
                                                                ? 'white'
                                                                : 'transparent',
                                                        }}
                                                    />
                                                </TouchableOpacity>
                                                <Text
                                                    style={{
                                                        fontSize: 14,
                                                        lineHeight: 16.71,
                                                        width: '85%',
                                                        fontFamily:
                                                            'SFProDisplay-Regular',
                                                        bottom: 1,
                                                        right: 30,
                                                        color: '#828282',
                                                    }}
                                                >
                                                    (Recommended) Occasionally
                                                    text me about opportunities
                                                    to win cash and other cool
                                                    prizes by helping others
                                                    achieve their goals.
                                                    Standard text and data rates
                                                    may apply. Text 'Stop'
                                                    anytime.
                                                </Text>
                                            </View>
                                        </View>
                                        <View
                                            style={{
                                                width: '100%',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <DelayedButton
                                                disabled={!(isValid && dirty)}
                                                onPress={
                                                    // Actions.push(
                                                    //     'registration_verify_phone'
                                                    // )
                                                    handleSubmit
                                                }
                                                style={
                                                    !(isValid && dirty)
                                                        ? {
                                                              height: 45,
                                                              width: '100%',
                                                              backgroundColor:
                                                                  '#DBDADA',
                                                              borderRadius: 3,
                                                              alignItems:
                                                                  'center',
                                                              justifyContent:
                                                                  'center',
                                                              borderRadius: 5,
                                                          }
                                                        : buttonStyle
                                                              .GM_BLUE_BG_WHITE_BOLD_TEXT
                                                              .containerStyle
                                                }
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
                                                onPress={this.onNotNow}
                                                style={[
                                                    buttonStyle
                                                        .GM_WHITE_BG_GRAY_TEXT
                                                        .containerStyle,
                                                    { marginTop: 8 },
                                                ]}
                                            >
                                                <Text
                                                    style={
                                                        buttonStyle
                                                            .GM_WHITE_BG_GRAY_TEXT
                                                            .textStyle
                                                    }
                                                >
                                                    Skip
                                                </Text>
                                            </DelayedButton>
                                        </View>
                                    </View>
                                </>
                            )}
                        </Formik>
                    </View>
                </TouchableWithoutFeedback>
            </>
        )
    }
}

const styles = {
    noteTextStyle: {
        fontSize: text.TEXT_FONT_SIZE.FONT_1,
        lineHeight: text.TEXT_LINE_HEIGHT.FONT_3_5,
        fontFamily: text.FONT_FAMILY.REGULAR,
        color: '#828282',
        alignSelf: 'flex-start',
        marginTop: 15,
        textAlign: 'center',
        top: 7,
    },
}

const mapStateToProps = (state) => {
    const { userId } = state.user
    return { userId }
}

const AnalyticsWrapper = wrapAnalytics(
    OnboardingPhoneVerification,
    SCREENS.REG_ENTER_PHONE
)

export default connect(mapStateToProps, { phoneNumberSent })(AnalyticsWrapper)
