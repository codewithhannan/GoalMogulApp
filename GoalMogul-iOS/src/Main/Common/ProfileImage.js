import React from 'react';
import {
  Image,
  View
} from 'react-native';

// default profile picture
import profilePic from '../../asset/utils/defaultUserProfile.png';

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
const ProfileImage = (props) => {
  let { imageUrl } = props;
  const { imageContainerStyle, imageStyle, defaultImageSource } = props;
  const resizeMode = setValue(props.resizeMode).withDefaultCase('contain');

  let profileImage = (
    <View style={imageContainerStyle || styles.imageContainerStyle}>
      <Image
        style={imageStyle || styles.imageStyle}
        resizeMode={resizeMode}
        source={defaultImageSource || profilePic}
      />
    </View>
  );
  if (imageUrl) {
    imageUrl = `https://s3.us-west-2.amazonaws.com/goalmogul-v1/${imageUrl}`;
    profileImage = (
      <View
        style={imageContainerStyle || styles.imageContainerStyle}
      >
        <Image
          style={imageStyle || styles.imageStyle}
          source={{ uri: imageUrl }}
          resizeMode={resizeMode}
        />
      </View>
    );
  }
  return profileImage;
};

const setValue = (value) => ({
  withDefaultCase(defaultValue) {
    return value === undefined ? defaultValue : value;
  }
});

export default ProfileImage;
