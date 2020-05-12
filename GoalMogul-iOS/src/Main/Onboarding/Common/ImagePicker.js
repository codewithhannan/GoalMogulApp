/***********************************************************
 * FILENAME: ImagePicker.js    TYPE: Component
 * 
 * DESCRIPTION:
 *      Allow user to select a photo from local directory.
 * 
 * AUTHER: Yanxiang Lan     START DATE: 12 May 20
 * CREDIT: Jia Zeng, for partial code written in v1.
 ***********************************************************/

import React, { Component } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActionSheetIOS
} from 'react-native';

import { GM_DOT_GRAY } from '../../../styles';

// Resources
const TAKE_PIC_ICON = require('../../../asset/image/takePictureIcon.png');

// Action sheet specific
//TODO: abstract out as util function
const BUTTONS = ['Take a Picture', 'Camera Roll', 'Cancel'];
const TAKING_PICTURE_INDEX = 0;
const CAMERA_ROLL_INDEX = 1;
const CANCEL_INDEX = 2;


/**
 * REQUIRED PROPS:
 * * void     handleTakingPicture()
 * * void     handleCameraRoll()
 * 
 * OPTIONAL PROPS:
 * * image    imageUri
 * * image    icon
 * * boolean  rounded
 * * boolean  bordered
 * 
 * Please see documentation for details.
 */
class ImagePicker extends Component {
  /**Prompt user for an image selection */
  onAddImagePressed = () => {
    const { handleTakingPicture, handleCameraRoll } = this.props;

    ActionSheetIOS.showActionSheetWithOptions({
      options: BUTTONS,
      cancelButtonIndex: CANCEL_INDEX
    }, buttonIndex => {
      switch (buttonIndex) {
        case TAKING_PICTURE_INDEX:
          handleTakingPicture();
          break;
        case CAMERA_ROLL_INDEX:
          handleCameraRoll();
          break;
        default:
          return;
      }
    })
  }

  renderImage = () => {
    const { imageUri, icon, rounded } = this.props;
    const imageStyle = [styles.imageStyles];
    let imageSource;

    if (rounded) imageStyle.push(styles.roundedImageStyles);

    if (imageUri) {
      imageSource = { uri: imageUri };
    } else if (icon) {
      imageSrouce = icon;
    } else {
      imageSource = TAKE_PIC_ICON;
    }

    return (
      <Image source={imageSource} style={imageStyle} />
    );
  }

  render() {
    const { rounded, bordered } = this.props;
    const buttonStyle = [styles.buttonStyles];

    if (rounded) buttonStyle.push(styles.roundedButtonStyles);
    if (bordered) buttonStyle.push(styles.borderedButtonStyles);

    return (
      <View { ...this.props }>
        <TouchableOpacity
          style={buttonStyle}
          onPress={this.onAddImagePressed}
        >
          { this.renderImage() }
        </TouchableOpacity>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  buttonStyles: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  roundedButtonStyles: {
    borderRadius: 180,
  },
  borderedButtonStyles: {
    borderWidth: 2,
    borderColor: GM_DOT_GRAY
  },
  imageStyles: {
    width: '100%',
    height: '100%',
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center'
  },
  roundedImageStyles: {
    borderRadius: 180,
  }
});


export default ImagePicker;
