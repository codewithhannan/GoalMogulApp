/***********************************************************
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
 ***********************************************************/

import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";

import OnboardingHeader from "./Common/OnboardingHeader";
import DelayedButton from "../Common/Button/DelayedButton";
import ImagePicker from "./Common/ImagePicker";

import {
  TEXT_STYLE as textStyle,
  BUTTON_STYLE as buttonStyle,
} from "../../styles";
import { openCamera, openCameraRoll } from "../../actions";

class OnboardingAddPhotos extends Component {
  /**Navigate to next step. */
  onSkip = () => {
    Actions.push("registration_contact_sync");
  };

  onContinue = () => {
    // TODO process uploaded image
    Actions.push("registration_contact_sync");
  };

  render() {
    const { openCamera, openCameraRoll, profilePic } = this.props;

    return (
      <View style={styles.containerStyles}>
        <OnboardingHeader />
        <View style={styles.containerStyles}>
          <View>
            <ImagePicker
              handleTakingPicture={openCamera}
              handleCameraRoll={openCameraRoll}
              imageUri={profilePic}
              style={styles.imagePickerStyles}
              bordered
              rounded
            />
            <Text
              style={[textStyle.onboardingTitleTextStyle, styles.titleStyles]}
            >
              Now, add a photo
            </Text>
            <Text style={textStyle.onboardingPharagraphTextStyle}>
              This way, people will recgonize you
            </Text>
          </View>
          <View style={styles.buttonContainerStyles}>
            <DelayedButton
              style={[
                buttonStyle.GM_BLUE_BG_WHITE_BOLD_TEXT.containerStyle,
                styles.buttonPrimaryStyles,
              ]}
              onPress={this.onContinue}
            >
              <Text style={buttonStyle.GM_BLUE_BG_WHITE_BOLD_TEXT.textStyle}>
                Continue
              </Text>
            </DelayedButton>
            <DelayedButton
              style={[buttonStyle.GM_WHITE_BG_GRAY_TEXT.containerStyle]}
              onPress={this.onSkip}
            >
              <Text style={buttonStyle.GM_WHITE_BG_GRAY_TEXT.textStyle}>
                Skip
              </Text>
            </DelayedButton>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerStyles: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "space-between",
  },
  imagePickerStyles: {
    marginVertical: 40,
  },
  buttonContainerStyles: {
    marginBottom: 60,
    paddingHorizontal: 25,
  },
  buttonPrimaryStyles: {
    marginBottom: 15,
  },
  titleStyles: {
    marginBottom: 16,
  },
});

const mapStateToProps = (state) => {
  const { profilePic } = state.registration;

  return { profilePic };
};

export default connect(mapStateToProps, { openCamera, openCameraRoll })(
  OnboardingAddPhotos
);
