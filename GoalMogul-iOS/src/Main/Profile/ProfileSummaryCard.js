import React, { Component } from 'react';
import {
  View,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ActionSheetIOS
} from 'react-native';
import { connect } from 'react-redux';

/* Asset To Delete */
import addUser from '../../asset/utils/addUser.png';
import check from '../../asset/utils/check.png';
import defaultUserProfile from '../../asset/utils/defaultUserProfile.png';

/* Actions */
import { openProfileDetail } from '../../actions';

/* Components */
import Name from '../Common/Name';
import Position from '../Common/Position';
import Stats from '../Common/Text/Stats';

const FRIENDSHIP_BUTTONS = ['Withdraw request', 'Cancel'];
const WITHDRAW_INDEX = 0;
const CANCEL_INDEX = 1;

class ProfileSummaryCard extends Component {
  state = {
    requested: false
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
              _id,
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
      _id,
      'requesteFriend',
      'suggested',
      () => {
        this.setState({ requested: true });
      }
    );
  }

  handleOpenProfileDetail() {
    this.props.openProfileDetail();
  }

  renderStats() {
    const data = this.props.isSelf ?
      { Friends: '100K' } :
      { 'Mutual Friends': this.props.mutualFriends.count };
    return <Stats data={data} />;
  }

  renderButton(_id) {
    if (this.props.isSelf) {
      return '';
    }

    if (this.state.requested) {
      return (
        <TouchableOpacity onPress={this.onButtonClicked.bind(this, _id)}>
          <Image source={check} style={{ height: 16, width: 21 }} />
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity onPress={this.onButtonClicked.bind(this, _id)}>
        <Image source={addUser} style={{ height: 22, width: 23 }} />
      </TouchableOpacity>
    );
  }

  render() {
    const name = this.props.user.name;
    let imageUrl = this.props.user.profile.image;
    let profileImage = <Image style={styles.imageStyle} source={defaultUserProfile} />;
    if (imageUrl) {
      imageUrl = `https://s3.us-west-2.amazonaws.com/goalmogul-v1/${imageUrl}`;
      profileImage = <Image style={styles.imageStyle} source={{ uri: imageUrl }} />;
    }
    // Style 1:
    // const addFriendButton = !this.props.isSelf ? (
    //   <Button
    //     title='Friend'
    //     titleStyle={styles.buttonTextStyle}
    //     clear
    //     icon={
    //       <Icon
    //         type='octicon'
    //         name='plus-small'
    //         width={10}
    //         size={21}
    //         color='#45C9F6'
    //         iconStyle={styles.buttonIconStyle}
    //       />
    //     }
    //     iconLeft
    //     buttonStyle={styles.buttonStyle}
    //   />
    // ) : '';

    return (
      <TouchableWithoutFeedback onPress={this.handleOpenProfileDetail.bind(this)}>
        <View style={styles.containerStyle}>
          <View style={{ flex: 5, flexDirection: 'row' }}>
            {profileImage}

            <View style={styles.bodyStyle}>
              <Name text={name} />
              <Position text='Sr. UI/UX designer & developer' />
              {this.renderStats()}
            </View>
          </View>
          <View style={styles.buttonContainerStyle}>
            {this.renderButton()}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = {
  containerStyle: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 8,
    paddingBottom: 8,
    maxHeight: 70
  },
  bodyStyle: {
    flex: 3,
    display: 'flex',
    marginLeft: 5,
    marginRight: 5,
    justifyContent: 'space-between'
  },
  buttonContainerStyle: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center'
  },
  imageStyle: {
    height: 54,
    width: 54,
    borderRadius: 5,
  },
  buttonStyle: {
    width: 80,
    height: 26,
    borderWidth: 1,
    borderColor: '#45C9F6',
    borderRadius: 13,
  },
  buttonTextStyle: {
    color: '#45C9F6',
    fontSize: 13,
    fontWeight: '700',
    padding: 0,
    alignSelf: 'center'
  },
  buttonIconStyle: {
    marginTop: 2,
  }
};

const mapStateToProps = state => {
  const { userId, user, mutualFriends } = state.profile;
  const isSelf = state.profile.userId.toString() === state.user.userId.toString();

  return {
    userId,
    user,
    isSelf,
    mutualFriends
  };
};

export default connect(mapStateToProps, { openProfileDetail })(ProfileSummaryCard);
