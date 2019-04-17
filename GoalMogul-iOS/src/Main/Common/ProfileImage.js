import React from 'react';
import {
  Image,
  View,
  TouchableWithoutFeedback
} from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';

// default profile picture
import profilePic from '../../asset/utils/defaultUserProfile.png';

// actions
import {
  openProfile
} from '../../actions';

// Constants
import {
  IMAGE_BASE_URL
} from '../../Utils/Constants';

const styles = {
  imageContainerStyle: {

  },
  imageStyle: {
    height: 54,
    width: 54,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'white'
  },
};

const DEBUG_KEY = '[ UI ProfileImage ]';
/*
 * props: imageUrl, resizeMode, imageContainerStyle, imageStyle
 */
class ProfileImage extends React.Component {

  shouldComponentUpdate(nextProps) {
    if (this.props.imageUrl !== nextProps.imageUrl) {
      return true;
    }
    return false;
  }

  handleProfileImageOnPress = () => {
    const { userId, disabled } = this.props;
    if (!userId || _.isEmpty(userId) || disabled) return;
    this.props.openProfile(userId);
  }

  render() {
    let { imageUrl } = this.props;
    const { imageContainerStyle, imageStyle, defaultImageSource, rounded } = this.props;
    const resizeMode = setValue(this.props.resizeMode).withDefaultCase('cover');

    let defaultImageStyle;
    if (this.props.defaultImageStyle) {
      defaultImageStyle = { ...this.props.defaultImageStyle };
    } else if (imageStyle) {
      defaultImageStyle = { ...imageStyle };
    } else {
      defaultImageStyle = { ...styles.imageStyle };
    }

    if (rounded) {
      defaultImageStyle = _.set(defaultImageStyle, 'borderRadius', 5);
    }

    const defaultImageContainerStyle = this.props.defaultImageContainerStyle || imageContainerStyle;

    let profileImage = (
      <TouchableWithoutFeedback onPress={this.handleProfileImageOnPress}>
        <View
          style={[defaultImageContainerStyle || styles.imageContainerStyle]}
        >
          <Image
            style={defaultImageStyle}
            resizeMode={resizeMode}
            source={defaultImageSource || profilePic}
          />
        </View>
      </TouchableWithoutFeedback>
    );
    if (imageUrl) {
      imageUrl = typeof imageUrl == "string" && imageUrl.indexOf('https://') != 0 ? `${IMAGE_BASE_URL}${imageUrl}` : imageUrl;
      profileImage = (
        <TouchableWithoutFeedback onPress={this.handleProfileImageOnPress}>
          <View
            style={imageContainerStyle || styles.imageContainerStyle}
          >
            <Image
              style={imageStyle || styles.imageStyle}
              source={{ uri: imageUrl }}
              resizeMode={resizeMode}
            />
          </View>
        </TouchableWithoutFeedback>
      );
    }
    return profileImage;
  }
}

const setValue = (value) => ({
  withDefaultCase(defaultValue) {
    return value === undefined ? defaultValue : value;
  }
});

export default connect(
  null,
  {
    openProfile
  }
)(ProfileImage);
