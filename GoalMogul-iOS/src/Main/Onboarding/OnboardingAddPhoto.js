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
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import { TEXT_STYLE as textStyle } from '../../styles';
import OnboardingHeader from './Common/OnboardingHeader';
import OnboardingFooter from './Common/OnboardingFooter';


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
          <TouchableOpacity
            style={styles.roundedButtonStyles}
            onPress={this.onAddImagePressed}
          >
            <Image
              style={styles.iconStyles}
              source={TAKE_PIC_ICON}
            />
          </TouchableOpacity>
          <Text style={textStyle.onboardingTitleTextStyle}>Now, add a photo</Text>
        </View>
        <OnboardingFooter
          totalStep={4}
          currentStep={1}
          onNext={this.onNext}
          onPrev={this.onBack}
        />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  containerStyles: {
    flex: 1,
    backgroundColor: "white",
  },
  roundedButtonStyles: {
    width: 150,
    height: 150,
    marginTop: 40,
    marginBottom: 40,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 180,
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
