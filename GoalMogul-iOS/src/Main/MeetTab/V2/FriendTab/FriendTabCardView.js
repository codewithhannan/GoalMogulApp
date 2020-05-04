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
    ActionSheetIOS
} from 'react-native';
import { connect } from 'react-redux';

// Components
import Name from '../../../Common/Name';
import ProfileImage from '../../../Common/ProfileImage';
import DelayedButton from '../../../Common/Button/DelayedButton';

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
        accepted: false
    }

    handleUpdateFriendship = (item) => {
        const { maybeFriendshipRef } = item;

        const friendUserId = getFriendUserId(maybeFriendshipRef, this.props.userId);
        const friendshipId = maybeFriendshipRef._id;
        ActionSheetIOS.showActionSheetWithOptions({
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
                imageStyle={{ height: 40, width: 40, borderRadius: 20 }}
                defaultImageStyle={{ width: 20, height: 20, margin: 20 }}
                imageUrl={item && item.profile ? item.profile.image : undefined}
                imageContainerStyle={styles.imageContainerStyle}
                userId={item._id}
            />
        );
    }

    renderButton(item) {
        return (
            <DelayedButton
                onPress={() => this.handleUpdateFriendship(item)}
                activeOpacity={0.6}
                style={styles.buttonContainerStyle}
            >
                <View style={styles.buttonTextContainerStyle}>
                    <Text style={{ fontSize: 11, color: '#868686' }}>Friend</Text>
                </View>
            </DelayedButton>
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

                {/* 
            // Disabled this detailText and replaced it with top goals and needs
                <View style={{ flexWrap: 'wrap', marginTop: 4 }}>
                    <Text 
                        style={styles.infoTextStyle}
                        numberOfLines={2}
                        ellipsizeMode='tail'
                    >
                        {detailText}
                    </Text>
                </View> 
            */}
                {this.renderGoals(item)}
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

    render() {
        const { item } = this.props;
        if (!item) return null;

        // console.log(`${DEBUG_KEY}: item is: `, item);
        return (
            <DelayedButton
                style={[styles.containerStyle, styles.shadow]}
                onPress={() => this.props.openProfile(item._id)}
                activeOpacity={0.6}
            >
                {this.renderProfileImage(item)}
                {this.renderProfile(item)}
                <View style={{ borderLeftWidth: 1, borderColor: '#efefef', height: 35 }} />
                {this.renderButton(item)}
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
        if (p.users_id !== userId) {
            ret = p.users_id;
        }
    });
    return ret;
};

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
        justifyContent: 'center'
    },
    // ProfileImage
    imageContainerStyle: {
        borderWidth: 0.5,
        borderColor: 'lightgray',
        alignItems: 'center',
        borderRadius: 30,
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
    // Top goals and need related styles
    infoContainerStyle: {
        flexDirection: 'row',
        flex: 1,
        marginTop: 2
    },
    subTitleTextStyle: {
        color: '#17B3EC',
        fontSize: 12,
        fontWeight: '600'
    },
    bodyTextStyle: {
        fontSize: 12,
        color: '#9B9B9B'
    },
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
