import React, { Component } from 'react';
import {
  View,
  TouchableWithoutFeedback,
  ActionSheetIOS,
  Image
} from 'react-native';
import { connect } from 'react-redux';

import ghost from '../../asset/utils/default_profile.png';

/* Actions */
import { openCameraRoll, openCamera } from '../../actions';

/* Action sheet specific */
//TODO: abstract out as util function
const BUTTONS = ['Take a Picture', 'Camera Roll', 'Cancel'];
const TAKING_PICTURE_INDEX = 0;
const CAMERA_ROLL_INDEX = 1;
const CANCEL_INDEX = 2;

class AddingProfilePicture extends Component {

  handleTakingPicture() {
    this.props.openCamera();
  }

  handleCameraRoll() {
    this.props.openCameraRoll();
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

  renderImage() {
    const uri = this.props.profilePic;
    let profilePicStyle = { ...styles.profilePicStyle };
    if (uri !== null && uri !== undefined) {
      return (
        <View style={styles.containerStyle}>
          <Image source={{ uri }} style={profilePicStyle} />
        </View>
      );
    }
    profilePicStyle.tintColor = 'darkgray';
    return (
      <View style={styles.containerStyle}>
        <Image source={ghost} style={profilePicStyle} />
      </View>
    );
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.handlePictureOnPressed.bind(this)}>
        {this.renderImage()}
      </TouchableWithoutFeedback>
    );
  }
}

const mapStateToProps = (state) => {
  const { profilePic } = state.registration;

  return { profilePic };
};

const styles = {
  profilePicStyle: {
    height: 200,
    width: 200,
    alignSelf: 'center'
  },
  containerStyle: {
    height: 200,
    width: 200,
    alignSelf: 'center'
  }
};

export default connect(
  mapStateToProps, {
    openCameraRoll,
    openCamera
  })(AddingProfilePicture);
