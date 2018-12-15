import React from 'react';
import {
  View,
  Image
} from 'react-native';
import ProfileImage from './ProfileImage';

// Assets
import DefaultUserProfile from '../../asset/utils/defaultUserProfile.png';

/* This is a simple logic to render stacked avatars.
 * Could be refactored to user
 */
const StackedAvatars = (props) => {
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

export const StackedAvatarsV2 = (props) => {
  const { participants } = props;
  if (!participants) return '';
  const participantPictures = participants
    .filter((participant) => participant.rsvp === 'Going' || participant.rsvp === 'Interested')
    .map((participant, index) => {
      if (index > 1) return '';
      const { participantRef } = participant;
      return (
        <ProfileImage
          key={index}
          imageContainerStyle={{
            ...styles.bottomPictureContainerStyle,
            left: ((index * 13))
          }}
          imageUrl={participantRef.profile.image}
          imageStyle={{ ...styles.pictureStyle }}
          defaultImageSource={DefaultUserProfile}
        />
      );
    });

  const count = participantPictures.length;
  const participantPicturesWidth = count < 2 ? 45 : 50;
  return (
    <View style={{ ...styles.memberPicturesContainerStyle, width: participantPicturesWidth }}>
      {participantPictures}
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
