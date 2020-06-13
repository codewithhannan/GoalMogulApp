import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';

// Component
import Divider from '../../Common/Divider';
import ProfileImage from '../../Common/ProfileImage';

// Asset
import Calendar from '../../../asset/utils/calendar.png';
import { decode } from '../../../redux/middleware/utils';
import defaultProfilePic from '../../../asset/icons/dots-horizontal-circle.png';

const { width } = Dimensions.get('window');
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DEBUG_KEY = '[ UI MyTribeAbout ]';

class MyTribeAbout extends Component {
  /**
   * Note: Tribe.js has its member pictures moved to StackedAvatars
   * @param {*} item 
   */
  renderMemberStatus(item) {
    const { members, memberCount } = item;
    const count = memberCount || 0;
    const memberPicturesWidth = count < 2 ? 45 : 90;
    const memberPictures = members ? members
      .filter((member) => member.category === 'Admin' || member.category === 'Member')
      .map((member, index) => {
        if (index > 4) return null;
        const { memberRef } = member;
        return (
          <ProfileImage
            key={index}
            imageContainerStyle={{
              ...styles.topPictureContainerStyle,
              left: ((index * 50))
            }}
            imageUrl={memberRef && memberRef.profile ? memberRef.profile.image : undefined}
            imageStyle={{ ...styles.pictureStyle }}
          />
        );
      }) : [];

    return (
      <View style={{ flexDirection: 'row', marginTop: 8, marginBottom: 0, justifyContent: 'flex-start', left: 45 }}>
        <View style={{ ...styles.memberPicturesContainerStyle, width: memberPicturesWidth }}>
          {memberPictures}
          <TouchableOpacity
            onPress={()=> console.log('testtter')}
            style={{ 
              ...styles.topPictureContainerStyle,
              left: ((5 * 50))
              }}
          >
              <Image
                        style={{...styles.pictureStyle, ...styles.pictureStyleMenu}}
                        source={defaultProfilePic}
                    />
          </TouchableOpacity>
        </View>
        {/* <Text style={{ alignSelf: 'center' }}>
          <Text style={styles.boldTextStyle}>{count} </Text>
          members
        </Text> */}
      </View>
    );
  }

  renderCreated(item) {
    const newDate = item.created ? new Date(item.created) : new Date();
    const date = `${months[newDate.getMonth()]} ${newDate.getDate()}, ${newDate.getFullYear()}`;

    return (
      <View
        style={{
          flexDirection: 'row',
          marginTop: 5,
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
          {decode(description)}
        </Text>
      </View>
    );
  }

  render() {
    const { item } = this.props;
    if (!item) return <View />;

    return (
      <View style={{ flex: 1, padding: 25, paddingTop: 15, backgroundColor: 'white' }}>
        {this.renderMemberStatus(item)}
        {/* {this.renderCreated(item)} */}
        {/* <Divider horizontal width={0.8 * width} borderColor='gray' />
        {this.renderDescription(item)} */}
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
    justifyContent: 'center',
    backgroundColor: 'white'
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
    color: '#696969',
    backgroundColor: 'white'
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
    // marginLeft: 15
    position: 'absolute',
    left: 15
  },
  pictureStyle: {
    height: PictureDimension*1.8,
    width: PictureDimension*1.8,
    borderRadius: PictureDimension / 2
  },
  pictureStyleMenu: {
    height: PictureDimension*2.2,
    width: PictureDimension*2.2,
    borderRadius: PictureDimension / 2
  }
};

export default MyTribeAbout;
