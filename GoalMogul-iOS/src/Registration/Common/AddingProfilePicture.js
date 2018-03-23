import React, { Component } from 'react';
import {
  View,
  TouchableWithoutFeedback,
  ActionSheetIOS,
  Image
} from 'react-native';
import { connect } from 'react-redux';

/* Actions */
import { registrationCameraRollOnOpen, registrationCameraOnOpen } from '../../actions';

/* Action sheet specific */
//TODO: abstract out as util function
const BUTTONS = ['Taking Pictures', 'Camera Roll', 'Cancel'];
const TAKING_PICTURE_INDEX = 0;
const CAMERA_ROLL_INDEX = 1;
const CANCEL_INDEX = 2;

class AddingProfilePicture extends Component {

  handleTakingPicture() {
    this.props.registrationCameraOnOpen();
  }

  handleCameraRoll() {
    this.props.registrationCameraRollOnOpen();
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
    if (uri !== null && uri !== undefined) {
      return (
        <Image source={{ uri }} style={styles.profilePicStyle} />
      );
    }
    return <View style={styles.profilePicStyle} />;
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
    alignSelf: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  }
};

export default connect(
  mapStateToProps, {
    registrationCameraRollOnOpen,
    registrationCameraOnOpen
  })(AddingProfilePicture);
