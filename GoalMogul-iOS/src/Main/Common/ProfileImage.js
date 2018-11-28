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

/*
 * props: imageUrl, resizeMode, imageContainerStyle, imageStyle
 */
class ProfileImage extends React.PureComponent {

  handleProfileImageOnPress = () => {
    const { userId } = this.props;
    if (!userId || _.isEmpty(userId)) return;
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

    let profileImage = (
      <TouchableWithoutFeedback onPress={this.handleProfileImageOnPress}>
        <View style={imageContainerStyle || styles.imageContainerStyle}>
          <Image
            style={defaultImageStyle}
            resizeMode={resizeMode}
            source={defaultImageSource || profilePic}
          />
        </View>
      </TouchableWithoutFeedback>
    );
    if (imageUrl) {
      imageUrl = `https://s3.us-west-2.amazonaws.com/goalmogul-v1/${imageUrl}`;
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
