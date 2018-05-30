import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActionSheetIOS
} from 'react-native';
import { connect } from 'react-redux';
import { Button, Icon } from 'react-native-elements';

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
    accpeted: false
  }

  onButtonClicked = (_id) => {
    if (this.state.requested) {
      ActionSheetIOS.showActionSheetWithOptions({
        options: FRIENDSHIP_BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
      },
      (buttonIndex) => {
        console.log('button clicked', FRIENDSHIP_BUTTONS[buttonIndex]);
        switch (buttonIndex) {
          case WITHDRAW_INDEX:
            this.props.updateFriendship(_id, 'deleteFriend', () => {
              this.setState({ requested: false });
            });
            break;
          default:
            return;
        }
      });
    }
    return this.props.updateFriendship(_id, 'requesteFriend', () => {
      this.setState({ requested: true });
    });
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
    if (this.props.item.status === 'Invited') {
      return (
        <View style={styles.iconContainerStyle}>
        <TouchableOpacity
          onPress={this.onButtonClicked.bind(this, _id)}
        >
          <Image
            source={addUser}
            style={styles.iconStyle}
          />
        </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.iconContainerStyle}>
      <TouchableOpacity
        style={styles.iconContainerStyle}
        onPress={this.onButtonClicked.bind(this, _id)}
      >
        <Image
          source={check}
          style={{ width: 25, height: 18 }}
        />
      </TouchableOpacity>
      </View>
    );
  }

  renderInfo() {
    const { name } = this.props.item;
    return (
      <View style={styles.infoContainerStyle}>
        <View style={{ flex: 1, flexDirection: 'row', marginRight: 6, alignItems: 'center' }}>
          <Name text={name} />
        </View>
      </View>
    );
  }

  // TODO: decide the final UI for additional info
  renderAdditionalInfo() {
    return '';
    // const { profile } = this.props.item;
    // let content = '';
    // if (profile.elevatorPitch) {
    //   content = profile.elevatorPitch;
    // } else if (profile.about) {
    //   content = profile.about;
    // }
    // return (
    //   <View style={{ flex: 1 }}>
    //     <Text
    //       style={styles.titleTextStyle}
    //       numberOfLines={1}
    //       ellipsizeMode='tail'
    //     >
    //       <Text style={styles.detailTextStyle}>
    //         {content}
    //       </Text>
    //     </Text>
    //   </View>
    // );
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
    flex: 1
  },
  imageStyle: {
    height: 48,
    width: 48,
    borderRadius: 5,
  },
  buttonContainerStyle: {
    marginLeft: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  buttonStyle: {
    width: 70,
    height: 26,
    borderWidth: 1,
    borderColor: '#45C9F6',
    borderRadius: 13,
  },
  buttonTextStyle: {
    color: '#45C9F6',
    fontSize: 11,
    fontWeight: '700',
    paddingLeft: 1,
    padding: 0,
    alignSelf: 'center'
  },
  buttonIconStyle: {
    marginTop: 1
  },
  titleTextStyle: {
    color: '#45C9F6',
    fontSize: 11,
    paddingTop: 1,
    paddingBottom: 1
  },
  detailTextStyle: {
    color: '#000000',
    paddingLeft: 3
  },
  jobTitleTextStyle: {
    color: '#45C9F6',
    fontSize: 11,
    fontWeight: '800',
    paddingTop: 5,
    paddingBottom: 3
  },
  friendTextStyle: {
    paddingLeft: 10,
    color: '#45C9F6',
    fontSize: 9,
    fontWeight: '800',
    maxWidth: 120
  },
  iconContainerStyle: {
    marginLeft: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  iconStyle: {
    height: 25,
    width: 25
  }
};

export default connect(null, {
  updateFriendship
})(SearchUserCard);
