import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions,
  Image
} from 'react-native';

// Component
import Divider from '../Common/Divider';

// Asset
import Calendar from '../../asset/utils/calendar.png';
import DefaultUserProfile from '../../asset/test-profile-pic.png';

const { width } = Dimensions.get('window');

class About extends Component {

  renderMemberStatus() {
    const count = '102';
    return (
      <View style={{ flexDirection: 'row', marginTop: 8, marginBottom: 5 }}>
        <View style={styles.memberPicturesContainerStyle}>
          <View style={styles.bottomPictureContainerStyle}>
            <Image source={DefaultUserProfile} style={styles.pictureStyle} />
          </View>

          <View style={styles.topPictureContainerStyle}>
            <Image
              source={DefaultUserProfile}
              style={styles.pictureStyle}
            />
          </View>

        </View>
        <Text style={{ alignSelf: 'center' }}>
          <Text style={styles.boldTextStyle}>{count} </Text>
          members
        </Text>
      </View>
    );
  }

  renderCreated() {
    const date = 'January 12, 2017';

    return (
      <View
        style={{
          flexDirection: 'row',
          marginTop: 5,
          marginBottom: 10,
          alignItems: 'center'
        }}
      >
        <View style={styles.iconContainerStyle}>
          <Image source={Calendar} style={styles.iconStyle} />
        </View>

        <View style={{ padding: 5 }}>
          <Text style={styles.subtitleTextStyle}>Created</Text>
          <Text style={styles.boldTextStyle}>{date}</Text>
        </View>
      </View>
    );
  }

  renderDescription() {
    return (
      <View style={{ padding: 10 }}>
        <Text
          style={{ ...styles.subtitleTextStyle, marginTop: 5 }}
        >
          Description
        </Text>
        <Text style={styles.descriptionTextStyle}>
          This is a group for all artists currently living in or working out
          of SOHo, NY. We exchange ideas, get feedback from each other and
          help each other organize exhibits for our work.
        </Text>
      </View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1, margin: 25, marginTop: 15 }}>
        {this.renderMemberStatus()}
        {this.renderCreated()}
        <Divider horizontal width={0.8 * width} borderColor='gray' />
        {this.renderDescription()}
      </View>
    );
  }
}

const PictureDimension = 24;
const styles = {
  iconContainerStyle: {
    height: 30,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconStyle: {
    height: 28,
    width: 28
  },
  subtitleTextStyle: {
    fontStyle: 'italic',
    fontSize: 10,
    color: '#696969'
  },
  boldTextStyle: {
    fontSize: 13,
    fontWeight: '700'
  },
  descriptionTextStyle: {
    fontSize: 13,
    fontWeight: '300',
    marginTop: 8,
    color: '#696969'
  },
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

export default About;
