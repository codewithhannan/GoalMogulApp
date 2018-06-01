import React, { Component } from 'react';
import Expo from 'expo';
import {
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native';
import { connect } from 'react-redux';

// Components
import Name from '../../Common/Name';

// Assets
import defaultUserProfile from '../../../asset/utils/defaultUserProfile.png';
import badge from '../../../asset/utils/badge.png';
import back from '../../../asset/utils/back.png';

// Actions
import { updateFriendship, openProfile } from '../../../actions';

const DEBUG_KEY = '[ Component SearchUserCard ]';

class SearchUserCard extends Component {

  onButtonClicked = (_id) => {
    console.log(`${DEBUG_KEY} open profile with id: `, _id);
    this.props.openProfile(_id);
  }

  openProfile = (_id) => {
    // TODO: open profile
    console.log(`${DEBUG_KEY} open profile with id: `, _id);
    this.props.openProfile(_id);
  }

  renderProfileImage() {
    const { image } = this.props.item.profile;
    let profileImage = <Image style={styles.imageStyle} source={defaultUserProfile} />;
    if (image) {
      const imageUrl = `https://s3.us-west-2.amazonaws.com/goalmogul-v1/${image}`;
      profileImage = <Image style={styles.imageStyle} source={{ uri: imageUrl }} />;
    }
    return profileImage;
  }

  renderButton(_id) {
    return (
      <View style={styles.iconContainerStyle}>
        <TouchableOpacity
          onPress={this.onButtonClicked.bind(this, _id)}
          style={{ padding: 15 }}
        >
          <Image
            source={back}
            style={styles.iconStyle}
          />
        </TouchableOpacity>
      </View>
    );
  }

  renderInfo() {
    const { name } = this.props.item;
    return (
      <View style={styles.infoContainerStyle}>
        <Name text={name} textStyle={{ color: '#4F4F4F' }} />
      </View>
    );
  }

  renderOccupation() {
    const { profile } = this.props.item;
    if (profile.occupation) {
      return (
        <Text
          style={styles.titleTextStyle}
          numberOfLines={1}
          ellipsizeMode='tail'
        >
          <Text style={styles.detailTextStyle}>{profile.occupation}</Text>
        </Text>
      );
    }
    return '';
  }

  render() {
    const { _id } = this.props.item;
    return (
      <TouchableOpacity onPress={this.openProfile.bind(this, _id)}>
        <View style={styles.containerStyle}>
          {this.renderProfileImage()}

          <View style={styles.bodyContainerStyle}>
            {this.renderInfo()}
            {this.renderOccupation()}
          </View>
          {this.renderButton(_id)}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = {
  containerStyle: {
    flexDirection: 'row',
    marginTop: 7,
    marginLeft: 4,
    marginRight: 4,
    paddingLeft: 10,
    paddingRight: 5,
    paddingTop: 8,
    paddingBottom: 8,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    shadowColor: 'gray',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  bodyContainerStyle: {
    marginLeft: 8,
    flex: 1,
  },
  infoContainerStyle: {
    flexDirection: 'row',
    height: 25,
  },
  imageStyle: {
    height: 48,
    width: 48,
    borderRadius: 5,
  },
  titleTextStyle: {
    color: '#45C9F6',
    fontSize: 11,
    paddingTop: 1,
    paddingBottom: 1
  },
  detailTextStyle: {
    color: '#9B9B9B',
    paddingLeft: 3,
    fontFamily: 'gotham-pro',
  },
  iconContainerStyle: {
    marginLeft: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  iconStyle: {
    height: 25,
    width: 26,
    transform: [{ rotateY: '180deg' }],
    tintColor: '#45C9F6'
  }
};

export default connect(null, {
  updateFriendship,
  openProfile
})(SearchUserCard);
