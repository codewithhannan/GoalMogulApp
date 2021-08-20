/**
 * ********************************************************
 * FILENAME: OnboardingAddPhoto.js    TYPE: Component
 *
 * DESCRIPTION:
 *      Prompt user to add a profile photo.
 *
 * NOTES:
 *      This component serves as one of the steps in the
 *    onboarding process. See Goal Mogul Docs for detailed
 *    explanation on this.
 *
 * AUTHER: Yanxiang Lan     START DATE: 11 May 20
 * *********************************************************
 *
 * @format
 */

import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'

import OnboardingHeader from './Common/OnboardingHeader'
import DelayedButton from '../Common/Button/DelayedButton'
import ImagePicker from './Common/ImagePicker'

import { color } from '../../styles/basic'
import OnboardingStyles, { getCardBottomOffset } from '../../styles/Onboarding'

import { openCamera, openCameraRoll } from '../../actions'
import { registrationAddProfilePhoto } from '../../redux/modules/registration/RegistrationActions'
import {
    trackWithProperties,
    EVENT as E,
    wrapAnalytics,
    SCREENS,
} from '../../monitoring/segment'
import { identifyWithTraits } from 'expo-analytics-segment'

const { text: textStyle, button: buttonStyle } = OnboardingStyles

class OnboardingAddPhotos extends Component {
    /**Navigate to next step. */
    onSkip = () => {
        trackWithProperties(E.ONBOARDING_STEP_COMPLETED, {
            onboardingStep: 'upload_photo',
            photo_uploaded: false,
        })
        identifyWithTraits(this.props.userId, {
            profilePhoto: false,
        })

        Actions.push('registration_people_know')
    }

    onContinue = () => {
        // Screen transition first
        Actions.push('registration_people_know')

        // Upload image
        this.props.registrationAddProfilePhoto()

        trackWithProperties(E.ONBOARDING_STEP_COMPLETED, {
            onboardingStep: 'upload_photo',
            photo_uploaded: true,
        })
    }

    openCamera = () => {
        const trackOpenCamera = () =>
            trackWithProperties(E.REG_CAMERA, {
                UserId: this.props.userId,
            })

        const trackImageAttached = () =>
            trackWithProperties(E.REG_ADD_PHOTO_ATTACHED, {
                UserId: this.props.userId,
            })

        this.props.openCamera(null, trackOpenCamera, trackImageAttached)
    }

    openCameraRoll = () => {
        // const trackOpenCameraRoll = () =>
        //     trackWithProperties(E.REG_CAMROLL, {
        //         UserId: this.props.userId,
        //     })

        const trackImageAttached = () =>
            identifyWithTraits(this.props.userId, {
                profilePhoto: true,
            })

        this.props.openCameraRoll(
            null,
            null,
            // trackOpenCameraRoll,
            trackImageAttached
        )
    }

    render() {
        const { openCamera, openCameraRoll, profilePic } = this.props

        return (
            <View
                style={[
                    OnboardingStyles.container.page,
                    { paddingBottom: getCardBottomOffset() },
                ]}
            >
                <OnboardingHeader />
                <View style={[OnboardingStyles.container.card]}>
                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexGrow: 1,
                            paddingBottom: 68,
                        }}
                    >
                        <ImagePicker
                            handleTakingPicture={this.openCamera}
                            handleCameraRoll={this.openCameraRoll}
                            imageUri={profilePic}
                            style={styles.imagePickerStyles}
                            bordered
                            rounded
                        />
                        <Text
                            style={
                                ([textStyle.title],
                                { fontSize: 22, fontWeight: '700', bottom: 10 })
                            }
                        >
                            Now, add a photo
                        </Text>
                        <Text
                            style={[
                                textStyle.paragraph,
                                { textAlign: 'center' },
                            ]}
                        >
                            This way friends will recognize you
                        </Text>
                    </View>
                    <DelayedButton
                        style={[
                            buttonStyle.GM_BLUE_BG_WHITE_BOLD_TEXT
                                .containerStyle,
                            {
                                marginBottom: 8,
                                backgroundColor:
                                    profilePic == undefined
                                        ? color.GM_BLUE_LIGHT
                                        : color.GM_BLUE,
                            },
                        ]}
                        onPress={this.onContinue}
                        disabled={profilePic == undefined}
                    >
                        <Text
                            style={
                                buttonStyle.GM_BLUE_BG_WHITE_BOLD_TEXT.textStyle
                            }
                        >
                            Add Photo
                        </Text>
                    </DelayedButton>
                    <DelayedButton
                        style={[
                            buttonStyle.GM_WHITE_BG_GRAY_TEXT.containerStyle,
                        ]}
                        onPress={this.onSkip}
                    >
                        <Text
                            style={buttonStyle.GM_WHITE_BG_GRAY_TEXT.textStyle}
                        >
                            Skip
                        </Text>
                    </DelayedButton>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    imagePickerStyles: {
        marginVertical: 60,
    },
})

const mapStateToProps = (state) => {
    const { profilePic } = state.registration
    const { userId } = state.user

    return { profilePic, userId }
}

const AnalyticsWrapper = wrapAnalytics(
    OnboardingAddPhotos,
    SCREENS.REG_ADD_PHOTO
)

export default connect(mapStateToProps, {
    openCamera,
    openCameraRoll,
    registrationAddProfilePhoto,
})(AnalyticsWrapper)
