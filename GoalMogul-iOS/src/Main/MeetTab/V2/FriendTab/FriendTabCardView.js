/**
 * This component allows user to manage the relationship with this current friend
 */
/**
 * This View is the Friend Card View
 */
import React from 'react';
import {
    ActionSheetIOS, Alert,
} from 'react-native';
import { connect } from 'react-redux';
import DelayedButton from '../../../Common/Button/DelayedButton';
import BottomSheet from '../../../Common/Modal/BottomSheet';
import {
    updateFriendship,
    blockUser,
    openProfile
} from '../../../../actions';
import UserCardHeader from '../../Common/UserCardHeader';
import UserTopGoals from '../../Common/UserTopGoals';
import Icons from '../../../../asset/base64/Icons';

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

    closeOptionModal = () => this.bottomSheetRef.close()

    openOptionModal = () => this.bottomSheetRef.open()

    makeFriendCardOptions = (item) => {
        const { maybeFriendshipRef, name } = item;

        const friendUserId = getFriendUserId(maybeFriendshipRef, this.props.userId);
        const friendshipId = maybeFriendshipRef._id;

        return [
            { text: "Unfriend", image: Icons.AccountRemove, imageStyle: { tintColor:  "black" }, onPress: () => {
                Alert.alert(
                    `Remove ${name} as a friend`,
                    undefined,
                    [
                        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
                        { 
                            text: 'Confirm', 
                            onPress: () => {
                                this.handleDeleteFriend(friendshipId);
                                this.closeOptionModal();
                            }, style: 'default' }
                    ]
                )
            }}, 
            {
                text: "Block", textStyle: { color: "#EB5757" }, image: Icons.AccountCancel, imageStyle: { tintColor:  "#EB5757" }, 
                onPress: () => {
                    Alert.alert(
                        `Block ${name}`,
                        `${name} will no longer receive your updates`,
                        [
                            { text: 'Cancel', onPress: () => {}, style: 'cancel' },
                            { 
                                text: 'Block', 
                                onPress: () => {
                                    this.handleBlockFriend(friendUserId);
                                    this.closeOptionModal();
                                }, 
                                style: 'default' 
                            }
                        ]
                    )
            }}
        ];
    }
    
    renderBottomSheet = (item) => {
        const options = this.makeFriendCardOptions(item);
        return (
            <BottomSheet 
                ref={r => this.bottomSheetRef = r}
                buttons={options}
            />
        )
    }

    renderHeader(item) {
        return (
            <UserCardHeader
                user={item} 
                optionsOnPress={this.openOptionModal}
            />
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
                {this.renderHeader(item)}
                <UserTopGoals user={item} />
                {/* {this.renderButtons(item)} */}
                {this.renderBottomSheet(item)}
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
        justifyContent: 'center',
        backgroundColor: 'transparent'
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
