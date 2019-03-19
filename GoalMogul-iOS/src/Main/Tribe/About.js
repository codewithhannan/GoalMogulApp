import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions,
  Image
} from 'react-native';

// Component
import Divider from '../Common/Divider';
import ProfileImage from '../Common/ProfileImage';

// Asset
import Calendar from '../../asset/utils/calendar.png';

const { width } = Dimensions.get('window');
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

class About extends Component {

  renderMemberStatus(item) {
    const { members, memberCount } = item;
    const count = memberCount || 0;
    const memberPicturesWidth = count < 2 ? 45 : 50;
    const memberPictures = members
      .filter((member) => member.category === 'Admin' || member.category === 'Member')
      .map((member, index) => {
        if (index > 1) return null;
        const { memberRef } = member;
        return (
          <ProfileImage
            key={index}
            imageContainerStyle={{
              ...styles.bottomPictureContainerStyle,
              left: ((index * 13))
            }}
            imageUrl={memberRef.profile.image}
            imageStyle={{ ...styles.pictureStyle }}
          />
        );
      });
    return (
      <View style={{ flexDirection: 'row', marginTop: 8, marginBottom: 5 }}>
        <View style={{ ...styles.memberPicturesContainerStyle, width: memberPicturesWidth }}>
          {memberPictures}
        </View>
        <Text style={{ alignSelf: 'center' }}>
          <Text style={styles.boldTextStyle}>{count} </Text>
          members
        </Text>
      </View>
    );
  }

  renderCreated(item) {
    const newDate = item.created ? new Date(item.created) : new Date();
    const date = `${months[newDate.getMonth() - 1]} ${newDate.getDate()}, ${newDate.getFullYear()}`;

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

  renderDescription(item) {
    const description = item.description
      ? item.description
      : 'Currently this event has no decription.';

    return (
      <View style={{ padding: 10 }}>
        <Text
          style={{ ...styles.subtitleTextStyle, marginTop: 5 }}
        >
          Description
        </Text>
        <Text style={styles.descriptionTextStyle}>
          {description}
        </Text>
      </View>
    );
  }

  render() {
    const { item } = this.props;
    if (!item) return <View />;

    return (
      <View style={{ flex: 1, margin: 25, marginTop: 15 }}>
        {this.renderMemberStatus(item)}
        {this.renderCreated(item)}
        <Divider horizontal width={0.8 * width} borderColor='gray' />
        {this.renderDescription(item)}
      </View>
    );
  }
}

const PictureDimension = 24;
const styles = {
  iconContainerStyle: {
    height: 30,
    width: 40,
    alignItems: 'flex-start',
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
