import React, { Component } from 'react';
import { View, TouchableWithoutFeedback, ActionSheetIOS } from 'react-native';

/* Action sheet specific */
//TODO: abstract out as util function
const BUTTONS = ['Taking Pictures', 'Camera Roll', 'Cancel'];
const TAKING_PICTURE_INDEX = 0;
const CAMERA_ROLL_INDEX = 1;
const CANCEL_INDEX = 2;

class AddingProfilePicture extends Component {

  handleTakingPicture() {

  }

  handleCameraRoll() {

  }

  handlePictureOnPressed() {
    ActionSheetIOS.showActionSheetWithOptions({
      options: BUTTONS,
      cancelButtonIndex: CANCEL_INDEX,
    },
    (buttonIndex) => {
      console.log('button clicked', BUTTONS[buttonIndex]);
      switch (buttonIndex) {
        case TAKING_PICTURE_INDEX:
          this.handleTakingPicture();
          break;
        case CAMERA_ROLL_INDEX:
          this.handleCameraRoll();
          break;
        default:
          return;
      }
    });
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.handlePictureOnPressed.bind(this)}>
        <View style={styles.profilePicStyle} />
      </TouchableWithoutFeedback>
    );
  }
}

const styles = {
  profilePicStyle: {
    height: 200,
    width: 200,
    alignSelf: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  }
};

export default AddingProfilePicture;
