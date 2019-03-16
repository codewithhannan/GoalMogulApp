import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';

// Components
import Name from '../../Common/Name';
import ProfileImage from '../../Common/ProfileImage';

// Assets
import defaultUserProfile from '../../../asset/utils/defaultUserProfile.png';

// Actions
import {
  updateFriendship,
  blockUser,
  openProfile
} from '../../../actions';

// Styles
import {
  cardBoxShadow
} from '../../../styles';

const FRIENDSHIP_BUTTONS = ['Block', 'Unfriend', 'Cancel'];
const BLOCK_INDEX = 0;
const UNFRIEND_INDEX = 1;
const CANCEL_INDEX = 2;
const TAB_KEY = 'friends';
const DEBUG_KEY = '[ UI FriendCard ]';

class FriendCard extends Component {
  state = {
    requested: false,
    accpeted: false
  }

  // onButtonClicked = (friendshipId) => {
  //   ActionSheetIOS.showActionSheetWithOptions({
  //     options: FRIENDSHIP_BUTTONS,
  //     cancelButtonIndex: CANCEL_INDEX,
  //   },
  //   (buttonIndex) => {
  //     console.log('button clicked', FRIENDSHIP_BUTTONS[buttonIndex]);
  //     switch (buttonIndex) {
  //       case BLOCK_INDEX:
  //         // User chose to block user with id: _id
  //         console.log('User blocks _id: ', friendshipId);
  //         this.props.blockUser(friendshipId);
  //         break;
  //
  //       case UNFRIEND_INDEX:
  //         // User chose to unfriend
  //         this.props.updateFriendship('', friendshipId, 'deleteFriend', TAB_KEY, () => {
  //           console.log('Successfully delete friend with friendshipId: ', friendshipId);
  //           this.setState({ requested: false });
  //         });
  //         break;
  //       default:
  //         return;
  //     }
  //   });
  // }

  handleOnOpenProfile = (item) => {
    const { _id } = item;
    if (_id) {
      // return this.props.openProfile(_id);
    }
    // TODO: showToast
  }

  renderProfileImage(item) {
    const { profile, _id } = item;
    
    // let profileImage = (
    //   <Image style={styles.imageStyle} resizeMode='contain' source={defaultUserProfile} />
    // );
    // if (image) {
    //   const imageUrl = `https://s3.us-west-2.amazonaws.com/goalmogul-v1/${image}`;
    //   profileImage = <Image style={styles.imageStyle} source={{ uri: imageUrl }} />;
    // }
    // return profileImage;
    return (
      <ProfileImage 
        imageStyle={styles.imageStyle}
        imageUrl={profile && profile.image ? profile.image : undefined}
        imageContainerStyle={styles.imageContainerStyle}
        userId={_id}
      />
    )
  }

  /**
   * NOTE: friends card doesn't have any button. only on profile page
   */
  renderButton(_id) {
    return null;
    // return (
    //   <TouchableOpacity activeOpacity={0.85} onPress={this.onButtonClicked.bind(this, _id)}>
    //     <Image source={meetSetting} style={styles.settingIconStyle} />
    //   </TouchableOpacity>
    // );
  }

  renderInfo(item) {
    const { name } = item;
    return (
      <View style={styles.infoContainerStyle}>
        <View style={{ flex: 1, flexDirection: 'row', marginRight: 6, alignItems: 'center' }}>
          <Name text={name} />
        </View>

        <View style={styles.buttonContainerStyle}>
          {this.renderButton()}
        </View>
      </View>
    );
  }

  /**
   * Render user top goals and needs
   * @param {} item 
   */
  renderGoals(item) {
    const { topGoals, topNeeds } = item;

    let topGoalText = 'None shared';
    if (topGoals !== null && topGoals !== undefined && topGoals.length !== 0) {
      topGoalText = '';
      topGoals.forEach((g, index) => {
        if (index !== 0) {
          topGoalText = `${topGoalText}, ${g}`; 
        } else {
          topGoalText = `${g}`; 
        }
      });
    }

    let topNeedText = 'None shared';
    if (topNeeds !== null && topNeeds !== undefined && topNeeds.length !== 0) {
      topNeedText = '';
      topNeeds.forEach((n, index) => {
        if (index !== 0) {
          topNeedText = `${topNeedText}, ${n}`; 
        } else {
          topNeedText = `${n}`; 
        }
      });
    }

    return (
      <View style={styles.infoContainerStyle}>
        <View style={{ flex: 1, marginRight: 6 }}>
          <Text numberOfLines={1} ellipsizeMode='tail' style={{ marginBottom: 2 }}>
            <Text style={styles.subTitleTextStyle}>Goals: </Text>
            <Text style={styles.bodyTextStyle}>{topGoalText}</Text>
          </Text>
          <Text numberOfLines={1} ellipsizeMode='tail'>
            <Text style={styles.subTitleTextStyle}>Needs: </Text>
            <Text style={styles.bodyTextStyle}>{topNeedText}</Text>
          </Text>
        </View>
      </View>
    );
  }

  renderHeadline(item) {
    const { headline } = item;
    return (
      <Text
        style={styles.jobTitleTextStyle}
        numberOfLines={1}
        ellipsizeMode='tail'
      >
        {headline}
      </Text>
    );
  }

  renderOccupation(item) {
    // console.log(`${DEBUG_KEY}: item is: `, item);
    const { profile } = item;
    if (profile && profile.occupation) {
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
    return;
  }

  render() {
    const { item } = this.props;
    if (!item) return null;

    const { headline } = item;
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={[styles.containerStyle, cardBoxShadow]}
        onPress={() => this.handleOnOpenProfile(item)}
      >
        {this.renderProfileImage(item)}

        <View style={styles.bodyContainerStyle}>
          {this.renderInfo(item)}
          {/* 
            {this.renderOccupation(item)}
            {this.renderHeadline(item)}
          */}
          {this.renderGoals(item)}
        </View>
      </TouchableOpacity>
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
  imageContainerStyle: {
    borderWidth: 0.5,
    padding: 0.5,
    borderColor: 'lightgray',
    alignItems: 'center',
    borderRadius: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'white'
  },
  buttonContainerStyle: {
    marginLeft: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  settingIconStyle: {
    height: 20,
    width: 20
  },
  // Top goals and needs text style
  subTitleTextStyle: {
    color: '#17B3EC',
    fontSize: 12,
    fontWeight: '600'
  },
  bodyTextStyle: {
    fontSize: 12,
    color: '#9B9B9B'
  },
  titleTextStyle: {
    color: '#17B3EC',
    fontSize: 11,
    paddingTop: 1,
    paddingBottom: 1
  },
  detailTextStyle: {
    color: '#000000',
    paddingLeft: 3
  },
  jobTitleTextStyle: {
    color: '#17B3EC',
    fontSize: 11,
    fontWeight: '800',
    paddingTop: 5,
    paddingBottom: 3
  }
};

export default connect(null, {
  updateFriendship,
  blockUser,
  openProfile
})(FriendCard);
