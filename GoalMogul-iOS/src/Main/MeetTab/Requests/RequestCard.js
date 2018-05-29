import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  ActionSheetIOS
} from 'react-native';
import { connect } from 'react-redux';
import { Button, Icon } from 'react-native-elements';

// Components
import Name from '../../Common/Name';

// Assets
import defaultUserProfile from '../../../asset/utils/defaultUserProfile.png';

// Actions
import { updateFriendship } from '../../../actions';

const FRIENDSHIP_BUTTONS = ['Withdraw request', 'Cancel'];
const WITHDRAW_INDEX = 0;
const CANCEL_INDEX = 1;

const ACCEPT_BUTTONS = ['Accept', 'Remove', 'Cancel'];
const ACCPET_INDEX = 0;
const ACCPET_REMOVE_INDEX = 0;
const ACCEPT_CANCEL_INDEX = 2;

class RequestCard extends Component {
  state = {
    requested: true,
  }

  componentWillReceiveProps(props) {
    console.log('new props for meet card are: ', props);
  }

  onAcceptClicked = (_id) => {
    ActionSheetIOS.showActionSheetWithOptions({
      options: ACCEPT_BUTTONS,
      cancelButtonIndex: ACCEPT_CANCEL_INDEX,
    },
    (buttonIndex) => {
      console.log('button clicked', ACCEPT_BUTTONS[buttonIndex]);
      switch (buttonIndex) {
        case ACCPET_INDEX:
          this.props.updateFriendship(_id, 'acceptFriend', null);
          break;
        case ACCPET_REMOVE_INDEX:
          this.props.updateFriendship(_id, 'deleteFriend', null);
          break;
        default:
          return;
      }
    });
  }

  onButtonClicked = (_id) => {
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
    switch (this.props.type) {
      case 'outgoing': {
        return (
          <Button
            title='Invited'
            titleStyle={styles.buttonTextStyle}
            clear
            buttonStyle={styles.buttonStyle}
            onPress={this.onButtonClicked.bind(this, _id)}
          />
        );
      }
      case 'incoming': {
        return (
          <Button
            title='Respond'
            titleStyle={styles.buttonTextStyle}
            clear
            buttonStyle={styles.buttonStyle}
            onPress={this.onAcceptClicked.bind(this, _id)}
          />
        );
      }

      default:
        return '';
    }
  }

  renderInfo() {
    const { name, _id } = this.props.item;
    return (
      <View style={styles.infoContainerStyle}>
        <View style={{ flex: 1, flexDirection: 'row', marginRight: 6, alignItems: 'center' }}>
          <Name text={name} />
        </View>

        <View style={styles.buttonContainerStyle}>
          {this.renderButton(_id)}
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
    return (
      <View style={styles.containerStyle}>
        {this.renderProfileImage()}

        <View style={styles.bodyContainerStyle}>
          {this.renderInfo()}
          {this.renderOccupation()}
          <Text
            style={styles.jobTitleTextStyle}
            numberOfLines={1}
            ellipsizeMode='tail'
          >
            380 MUTUAL FRIENDS
          </Text>
          {this.renderAdditionalInfo()}
        </View>
      </View>
    );
  }
}

const styles = {
  containerStyle: {
    flexDirection: 'row',
    marginTop: 5,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 8,
    paddingBottom: 8,
    alignItems: 'center',
    backgroundColor: '#ffffff'
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
  needContainerStyle: {

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
  }
};

export default connect(null, {
  updateFriendship
})(RequestCard);
