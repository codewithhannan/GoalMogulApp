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

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import { TEXT_STYLE as textStyle } from '../../styles';

const OnboardingAddPhotos = () => {
  return (
    <View style={styles.containerStyles}>
      <Text style={[textStyle.onboardingPharagraphTextStyle, styles.firstTextStyles]}>OnboardingAddPhotos</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyles: {
    flex: 1,
    backgroundColor: "white"
  },
  firstTextStyles: {
    marginTop: 50,
  }
});

const mapStateToProps = (state) => {
  return {};
};

export default connect(
  mapStateToProps,
  {}
)(OnboardingAddPhotos);
