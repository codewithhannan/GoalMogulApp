import React, { Component } from 'react';
import Expo from 'expo';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActionSheetIOS
} from 'react-native';
import { connect } from 'react-redux';

// Components
import Name from '../../Common/Name';

// Assets
import defaultUserProfile from '../../../asset/utils/defaultUserProfile.png';
import badge from '../../../asset/utils/badge.png';
import addUser from '../../../asset/utils/addUser.png';
import check from '../../../asset/utils/check.png';

// Actions
import { updateFriendship } from '../../../actions';

const FRIENDSHIP_BUTTONS = ['Withdraw request', 'Cancel'];
const WITHDRAW_INDEX = 0;
const CANCEL_INDEX = 1;

class SearchUserCard extends Component {
  state = {
    requested: false,
  }

  onButtonClicked = (_id) => {
    if (this.props.item.status === 'Invited' || this.state.requested) {
      ActionSheetIOS.showActionSheetWithOptions({
        options: FRIENDSHIP_BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
      },
      (buttonIndex) => {
        console.log('button clicked', FRIENDSHIP_BUTTONS[buttonIndex]);
        switch (buttonIndex) {
          case WITHDRAW_INDEX:
            this.props.updateFriendship(
              '5aebd3fa6eed042e6be297ec',
              'deleteFriend',
              'requests.outgoing',
              () => {
                this.setState({ requested: false });
              }
            );
            break;
          default:
            return;
        }
      });
    }
    return this.props.updateFriendship(
      '5aebd3fa6eed042e6be297ec',
      'requesteFriend',
      'suggested',
      () => {
        this.setState({ requested: true });
      }
    );
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
    if (this.props.item.status === 'Invited' || this.state.requested) {
      return (
        <View style={styles.iconContainerStyle}>
        <TouchableOpacity
          onPress={this.onButtonClicked.bind(this, _id)}
          style={{ padding: 15 }}
        >
          <Image
            source={check}
            style={{ width: 25, height: 18 }}
          />
        </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.iconContainerStyle}>
      <TouchableOpacity
        onPress={this.onButtonClicked.bind(this, _id)}
        style={{ padding: 15 }}
      >
        <Image
          source={addUser}
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
      <View style={styles.containerStyle}>
        {this.renderProfileImage()}

        <View style={styles.bodyContainerStyle}>
          {this.renderInfo()}
          {this.renderOccupation()}
        </View>
        {this.renderButton(_id)}
      </View>
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
    paddingRight: 25,
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
    width: 26
  }
};

export default connect(null, {
  updateFriendship
})(SearchUserCard);
