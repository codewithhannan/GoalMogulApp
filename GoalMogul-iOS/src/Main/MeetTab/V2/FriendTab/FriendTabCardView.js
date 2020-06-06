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
    ActionSheetIOS,
    Image
} from 'react-native';
import { connect } from 'react-redux';

// Components
import DelayedButton from '../../../Common/Button/DelayedButton';

/* Assets */


/* Actions */
import {
    updateFriendship,
    blockUser,
    openProfile
} from '../../../../actions';
import { DEFAULT_STYLE } from '../../../../styles';
import UserCardHeader from '../../Common/UserCardHeader';
import UserTopGoals from '../../Common/UserTopGoals';

const FRIENDSHIP_BUTTONS = ['Block', 'Unfriend', 'Cancel'];
const BLOCK_INDEX = 0;
const UNFRIEND_INDEX = 1;
const CANCEL_INDEX = 2;
const TAB_KEY = 'friends';
const DEBUG_KEY = '[ UI FriendTabCardView ]';

class FriendTabCardView extends React.PureComponent {
    state = {
        requested: false,
        accepted: false
    }

    // This is no longer used. Replaced by separate handler functions
    handleUpdateFriendship = (item) => {
        const { maybeFriendshipRef } = item;

        const friendUserId = getFriendUserId(maybeFriendshipRef, this.props.userId);
        const friendshipId = maybeFriendshipRef._id;
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: FRIENDSHIP_BUTTONS,
                cancelButtonIndex: CANCEL_INDEX,
            },
            (buttonIndex) => {
                console.log('button clicked', FRIENDSHIP_BUTTONS[buttonIndex]);
                switch (buttonIndex) {
                    case BLOCK_INDEX:
                        // User chose to block user with id: _id
                        console.log(`${DEBUG_KEY}: User blocks friend with id ${friendUserId}, 
                    friendshipId: ${friendshipId}`);
                        this.props.blockUser(friendUserId);
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
            }
        );
    }

    handleBlockFriend = (friendUserId) => {
        this.props.blockUser(friendUserId);
    }

    handleDeleteFriend = (friendshipId) => {
        this.props.updateFriendship('', friendshipId, 'deleteFriend', TAB_KEY, () => {
            console.log('Successfully delete friend with friendshipId: ', friendshipId);
            this.setState({ requested: false });
        });
    }

    handleOnOpenProfile = () => {
        const { _id } = this.props.item;
        if (_id) {
            return this.props.openProfile(_id);
        }
    }

    renderButtons(item) {
        const { maybeFriendshipRef } = item;

        const friendUserId = getFriendUserId(maybeFriendshipRef, this.props.userId);
        const friendshipId = maybeFriendshipRef._id;
        return (
            <View style={styles.buttonsContainerStyle}>
                <DelayedButton onPress={() => this.handleDeleteFriend(friendshipId)} activeOpacity={0.6}>
                    <View style={[styles.buttonTextContainerStyle, { backgroundColor: '#E0E0E0' }]}>
                        <Text style={[DEFAULT_STYLE.buttonText_2]}>Unfriend</Text>
                    </View>
                </DelayedButton >
                <DelayedButton onPress={() => this.handleBlockFriend(friendUserId)} activeOpacity={0.6}>
                    <View style={[styles.buttonTextContainerStyle, { paddingTop: 7, paddingBottom: 7, borderColor: '#EB5757', borderWidth: 1 }]}>
                        <Text style={[DEFAULT_STYLE.buttonText_2, { color: "#EB5757" }]}>Block</Text>
                    </View>
                </DelayedButton>
            </View>
        );
    }

    render() {
        const { item } = this.props;
        if (!item) return null;

        // console.log(`${DEBUG_KEY}: item is: `, item);
        return (
            <DelayedButton
                style={styles.containerStyle}
                onPress={() => this.props.openProfile(item._id)}
                activeOpacity={0.6}
            >
                <UserCardHeader user={item} />
                <UserTopGoals user={item} />
                {this.renderButtons(item)}
            </DelayedButton>
        );
    }
}

/**
 * Get current user's friend's userId from friendship object
 * @param {*} maybeFriendshipRef friendship object
 * @param {*} userId current userId
 */
const getFriendUserId = (maybeFriendshipRef, userId) => {
    const { participants } = maybeFriendshipRef;
    let ret;
    participants.forEach((p) => {
        if (p.users_id !== userId) ret = p.users_id;
    });
    return ret;
};

const styles = {
    containerStyle: {
        padding: 16,
        backgroundColor: 'white',
        borderWidth: 0.5,
        borderColor: '#F2F2F2'
    },
    // Button styles
    buttonsContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonTextContainerStyle: {
        marginRight: 8,
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center'
    }
};

const mapStateToProps = state => {
    const { userId } = state.user;
    return {
        userId
    };
};

export default connect(mapStateToProps, {
    updateFriendship,
    blockUser,
    openProfile
})(FriendTabCardView);
