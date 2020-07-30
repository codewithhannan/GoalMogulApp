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
import OnboardingStyles from '../../styles/Onboarding'

import { openCamera, openCameraRoll } from '../../actions'
import { registrationAddProfilePhoto } from '../../redux/modules/registration/RegistrationActions'

const { text: textStyle, button: buttonStyle } = OnboardingStyles

class OnboardingAddPhotos extends Component {
    /**Navigate to next step. */
    onSkip = () => {
        Actions.push('registration_contact_sync')
    }

    onContinue = () => {
        // Screen transition first
        Actions.push('registration_contact_sync')

        // Upload image
        this.props.registrationAddProfilePhoto()
    }

    render() {
        const { openCamera, openCameraRoll, profilePic } = this.props

        return (
            <View style={[OnboardingStyles.container.page]}>
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
                            handleTakingPicture={openCamera}
                            handleCameraRoll={openCameraRoll}
                            imageUri={profilePic}
                            style={styles.imagePickerStyles}
                            bordered
                            rounded
                        />
                        <Text
                            style={[
                                textStyle.title,
                                { marginBottom: 16, textAlign: 'center' },
                            ]}
                        >
                            Now, add a photo
                        </Text>
                        <Text
                            style={[
                                textStyle.paragraph,
                                { textAlign: 'center' },
                            ]}
                        >
                            This way your friends can recgonize you
                        </Text>
                    </View>
                    <View>
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
                                    buttonStyle.GM_BLUE_BG_WHITE_BOLD_TEXT
                                        .textStyle
                                }
                            >
                                Add Photo
                            </Text>
                        </DelayedButton>
                        <DelayedButton
                            style={[
                                buttonStyle.GM_WHITE_BG_GRAY_TEXT
                                    .containerStyle,
                            ]}
                            onPress={this.onSkip}
                        >
                            <Text
                                style={
                                    buttonStyle.GM_WHITE_BG_GRAY_TEXT.textStyle
                                }
                            >
                                Skip
                            </Text>
                        </DelayedButton>
                    </View>
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

    return { profilePic }
}

export default connect(mapStateToProps, {
    openCamera,
    openCameraRoll,
    registrationAddProfilePhoto,
})(OnboardingAddPhotos)
