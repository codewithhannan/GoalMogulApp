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
import { Actions } from 'react-native-router-flux';

import { TEXT_STYLE as textStyle } from '../../styles';
import OnboardingHeader from './Common/OnboardingHeader';
import OnboardingFooter from './Common/OnboardingFooter';

class OnboardingAddPhotos extends React.Component {
  onNext = () => {
    Actions.push("registration_tribe_selection");
  };
  
  onBack = () => {
    Actions.pop();
  };

  render() {
    return (
      <View style={styles.containerStyles}>
        <OnboardingHeader />
        <View style={styles.containerStyles}>

        </View>
        <OnboardingFooter totalStep={4} currentStep={1} onNext={this.onNext} onPrev={this.onBack} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerStyles: {
    flex: 1,
    backgroundColor: "white"
  },
});

const mapStateToProps = (state) => {
  return {};
};

export default connect(
  mapStateToProps,
  {}
)(OnboardingAddPhotos);
