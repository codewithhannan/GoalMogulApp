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
import Name from '../../Common/Name';
import ProfileImage from '../../Common/ProfileImage';

// Actions
import {
  updateFriendship,
  blockUser,
  openProfile,
  UserBanner
} from '../../../actions';

const FRIENDSHIP_BUTTONS = ['Withdraw request', 'Cancel'];
const WITHDRAW_INDEX = 0;
const CANCEL_INDEX = 1;

const ACCEPT_BUTTONS = ['Accept', 'Remove', 'Cancel'];
const ACCPET_INDEX = 0;
const ACCPET_REMOVE_INDEX = 1;
const ACCEPT_CANCEL_INDEX = 2;

const TAB_KEY_OUTGOING = 'requests.outgoing';
const TAB_KEY_INCOMING = 'requests.incoming';
const DEBUG_KEY = '[ UI FriendRequestCardView ]';

class FriendRequestCardView extends React.PureComponent {
    state = {
        requested: false,
        accpeted: false
    }

    onRespondClicked = (item) => {
        const { friendshipId } = item;
        ActionSheetIOS.showActionSheetWithOptions({
            options: ACCEPT_BUTTONS,
            cancelButtonIndex: ACCEPT_CANCEL_INDEX,
        },
        (buttonIndex) => {
            console.log('button clicked', ACCEPT_BUTTONS[buttonIndex]);
            switch (buttonIndex) {
            case ACCPET_INDEX:
                this.props.updateFriendship(
                    undefined, 
                    friendshipId, 
                    'acceptFriend', 
                    TAB_KEY_INCOMING, 
                    null
                );
                break;
            case ACCPET_REMOVE_INDEX:
                this.props.updateFriendship(
                    undefined, 
                    friendshipId, 
                    'deleteFriend', 
                    TAB_KEY_INCOMING, 
                    null
                );
                break;
            default:
                return;
            }
        });
    }

    onInvitedClicked = (item) => {
        const { friendshipId } = item;
        ActionSheetIOS.showActionSheetWithOptions({
            options: FRIENDSHIP_BUTTONS,
            cancelButtonIndex: CANCEL_INDEX,
        },
        (buttonIndex) => {
            console.log('button clicked', FRIENDSHIP_BUTTONS[buttonIndex]);
            switch (buttonIndex) {
            case WITHDRAW_INDEX:
                this.props.updateFriendship(
                    undefined,
                    friendshipId,
                    'deleteFriend',
                    TAB_KEY_OUTGOING,
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

    handleButtonOnPress = (item) => {
        if (item.type === 'incoming') {
            return this.onRespondClicked(item);
        }

        if (item.type === 'outgoing') {
            return this.onInvitedClicked(item);
        }

        console.log(`${DEBUG_KEY}: unknown type when button pressed: `, item);
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
                imageStyle={{ height: 40, width: 40, borderRadius: 5 }}
                defaultImageStyle={{ height: 40, width: 37, borderRadius: 5, marginLeft: 1, marginRight: 1 }}
                imageContainerStyle={{ marginTop: 5 }}
                imageUrl={item && item.profile ? item.profile.image : undefined}
                imageContainerStyle={styles.imageContainerStyle}
                userId={item._id}
            />
        );
    }

  renderButton(item) {
    const buttonText = item.type === 'outgoing' ? 'Cancel' : 'Respond';
    return (
        <TouchableOpacity 
            onPress={() => this.handleButtonOnPress(item)}
            activeOpacity={0.85}
            style={styles.buttonContainerStyle}
        >
            <View style={styles.buttonTextContainerStyle}>
                <Text style={{ fontSize: 11, color: '#868686' }}>{buttonText}</Text>
            </View>
        </TouchableOpacity>
    );
  }

  renderProfile(item) {
    const { user } = item;
    const { name, profile, headline } = user;
    console.log(`${DEBUG_KEY}: item is: `, item);
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
        <TouchableOpacity 
            activeOpacity={0.85}
            style={[styles.containerStyle, styles.shadow]}
            onPress={this.handleOnOpenProfile}
        >
            {this.renderProfileImage(item)}
            {this.renderProfile(item)}
            <View style={{ borderLeftWidth: 1, borderColor: '#efefef', height: 35 }} />
            {this.renderButton(item)}
        </TouchableOpacity>
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
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 12,
        paddingRight: 12,
        borderRadius: 5, 
        backgroundColor: '#f9f9f9', 
        borderColor: '#dedede',
        borderWidth: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
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
})(FriendRequestCardView);
