/**
 * This component allows user to manage the relationship with this current friend
 */
/**
 * This View is the Friend Card View
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActionSheetIOS
} from 'react-native';
import { connect } from 'react-redux';

// Components
import Name from '../../../Common/Name';
import ProfileImage from '../../../Common/ProfileImage';

/* Assets */


/* Actions */
import {
  updateFriendship,
  blockUser,
  openProfile,
  UserBanner
} from '../../../../actions';

const FRIENDSHIP_BUTTONS = ['Block', 'Unfriend', 'Cancel'];
const BLOCK_INDEX = 0;
const UNFRIEND_INDEX = 1;
const CANCEL_INDEX = 2;
const TAB_KEY = 'friends';
const DEBUG_KEY = '[ UI FriendTabCardView ]';

class FriendTabCardView extends React.PureComponent {
  state = {
    requested: false,
    accpeted: false
  }

  handleUpdateFriendship = () => {
    const friendshipId = '';
    ActionSheetIOS.showActionSheetWithOptions({
        options: FRIENDSHIP_BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
    },
    (buttonIndex) => {
        console.log('button clicked', FRIENDSHIP_BUTTONS[buttonIndex]);
        switch (buttonIndex) {
            case BLOCK_INDEX:
                // User chose to block user with id: _id
                console.log('User blocks _id: ', friendshipId);
                this.props.blockUser(friendshipId);
                break;

            case UNFRIEND_INDEX:
                // User chose to unfriend
                this.props.updateFriendship('', friendshipId, 'deleteFriend', TAB_KEY, () => {
                    console.log('Successfully delete friend with friendshipId: ', friendshipId);
                    this.setState({ requested: false });
                });
                break;
            default:
                return;
        }
    });
  }

  handleOnOpenProfile = () => {
    const { _id } = this.props.item;
    if (_id) {
      return this.props.openProfile(_id);
    }
  }

  renderProfileImage(item) {
    return (
        <ProfileImage
          imageStyle={{ height: 40, width: 40, borderRadius: 3 }}
          imageContainerStyle={{ marginTop: 5 }}
          imageUrl={item && item.profile ? item.profile.image : undefined}
          imageContainerStyle={styles.imageContainerStyle}
          userId={item._id}
        />
    );
  }

  renderButton(item) {
    return (
        <TouchableOpacity 
            onPress={() => this.handleUpdateFriendship(item._id)}
            activeOpacity={0.85}
            style={styles.buttonContainerStyle}
        >   
            <View style={styles.buttonTextContainerStyle}>
                <Text style={{ fontSize: 11, color: '#868686' }}>Friend</Text>
            </View>
        </TouchableOpacity>
    );
  }

  renderProfile(item) {
    const { name, profile, headline } = item;
    const detailText = headline || profile.occupation;
    return (
        <View style={{ flex: 1, marginLeft: 13 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Name text={name} />
                <UserBanner 
                    user={item} 
                    iconStyle={{ marginTop: 1, marginLeft: 7, height: 18, width: 15 }} 
                />
            </View>
            <View style={{ flexWrap: 'wrap', marginTop: 4 }}>
                <Text 
                    style={styles.infoTextStyle}
                    numberOfLines={2}
                    ellipsizeMode='tail'
                >
                    {detailText}
                </Text>
            </View>
            
        </View>
    );
  }

  render() {
    const { item } = this.props;
    if (!item) return '';

    return (
      <View style={[styles.containerStyle, styles.shadow]}>
        {this.renderProfileImage(item)}
        {this.renderProfile(item)}
        <View style={{ borderLeftWidth: 1, borderColor: '#efefef', height: 35 }} />
        {this.renderButton(item)}
      </View>
    );
  }
}

const styles = {
    containerStyle: {
        flexDirection: 'row',
        paddingLeft: 13,
        paddingTop: 8,
        paddingBottom: 8,
        alignItems: 'center',
        backgroundColor: 'white'
    },
    // Button styles
    buttonContainerStyle: {
        width: 90,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonTextContainerStyle: {
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 12,
        paddingRight: 12,
        borderRadius: 5, 
        backgroundColor: '#f9f9f9', 
        borderColor: '#dedede',
        borderWidth: 0.5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    // ProfileImage
    imageContainerStyle: {
        borderWidth: 0.5,
        padding: 1.5,
        borderColor: 'lightgray',
        alignItems: 'center',
        borderRadius: 6,
        alignSelf: 'flex-start',
        backgroundColor: 'white'
    },
    infoTextStyle: {
        color: '#9c9c9c',
        fontSize: 11
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
};

export default connect(null, {
  updateFriendship,
  blockUser,
  openProfile
})(FriendTabCardView);
