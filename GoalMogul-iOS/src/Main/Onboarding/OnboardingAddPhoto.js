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

import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActionSheetIOS,
  StyleSheet
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import OnboardingHeader from './Common/OnboardingHeader';
import DelayedButton from '../Common/Button/DelayedButton';

import {
  TEXT_STYLE as textStyle,
  BUTTON_STYLE as buttonStyle,
  GM_DOT_GRAY
} from '../../styles';


// Resources
const TAKE_PIC_ICON = require('../../asset/image/takePictureIcon.png');


class OnboardingAddPhotos extends Component {
  /**Navigate to next step. */
  onNext = () => {
    Actions.push("");
  };
  
  /**Navigate to previous step. */
  onBack = () => {
    Actions.pop();
  };

  /**Prompt user for an image selection */
  onAddImagePressed = () => {
    console.log("onAddImagePressed");
  }

  render() {
    return (
      <View style={styles.containerStyles}>
        <OnboardingHeader />
        <View style={styles.containerStyles}>
          <View>
            <TouchableOpacity
              style={styles.roundedButtonStyles}
              onPress={this.onAddImagePressed}
            >
              <Image
                style={styles.iconStyles}
                source={TAKE_PIC_ICON}
              />
            </TouchableOpacity>
            <Text style={[textStyle.onboardingTitleTextStyle, styles.titleStyles]}>
              Now, add a photo
            </Text>
            <Text style={textStyle.onboardingPharagraphTextStyle}>
              This way, people will recgonize you
            </Text>
          </View>
          <View style={styles.buttonContainerStyles}>
            <DelayedButton
              style={[buttonStyle.GM_BLUE_BG_WHITE_BOLD_TEXT.containerStyle, styles.buttonPrimaryStyles]}
            >
              <Text style={buttonStyle.GM_BLUE_BG_WHITE_BOLD_TEXT.textStyle}>
                Continue
              </Text>
            </DelayedButton>
            <DelayedButton
              style={[buttonStyle.GM_WHITE_BG_GRAY_TEXT.containerStyle]}
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
    backgroundColor: 'white',
    justifyContent: 'space-between',
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
  roundedButtonStyles: {
    width: 150,
    height: 150,
    marginTop: 40,
    marginBottom: 40,
    borderWidth: 2,
    borderRadius: 180,
    borderColor: GM_DOT_GRAY,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconStyles: {
  }
});


const mapStateToProps = (state) => {
  return {};
};


export default connect(
  mapStateToProps,
  {}
)(OnboardingAddPhotos);
