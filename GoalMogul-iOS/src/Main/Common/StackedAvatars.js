import React from 'react';
import {
  View,
  Image,
  Dimensions,
  Text
} from 'react-native';

/* This is a simple logic to render stacked avatars.
 * Could be refactored to user
 */
const StackedAvatars = (props) => {
  const count = '102';
  const { imageSource } = props;
  return (
    <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 5, alignSelf: 'center' }}>
      <View style={styles.memberPicturesContainerStyle}>
        <View style={styles.bottomPictureContainerStyle}>
          <Image source={imageSource} style={styles.pictureStyle} />
        </View>

        <View style={styles.topPictureContainerStyle}>
          <Image
            source={imageSource}
            style={styles.pictureStyle}
          />
        </View>

      </View>
    </View>
  );
};

const PictureDimension = 24;
const styles = {
  // Style for member pictures
  memberPicturesContainerStyle: {
    height: 25,
    width: 50
  },
  topPictureContainerStyle: {
    height: PictureDimension + 2,
    width: PictureDimension + 2,
    borderRadius: (PictureDimension / 2) + 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 2
  },
  bottomPictureContainerStyle: {
    height: PictureDimension + 2,
    width: PictureDimension + 2,
    borderRadius: (PictureDimension / 2) + 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15
  },
  pictureStyle: {
    height: PictureDimension,
    width: PictureDimension,
    borderRadius: PictureDimension / 2
  }
};

export default StackedAvatars;
