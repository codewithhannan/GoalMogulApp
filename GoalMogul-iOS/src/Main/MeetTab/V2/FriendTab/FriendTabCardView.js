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
import { GM_FONT_FAMILY_3, GM_FONT_FAMILY_2 } from '../../../../styles';

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

    handleOnOpenProfile = () => {
        const { _id } = this.props.item;
        if (_id) {
            return this.props.openProfile(_id);
        }
    }

    renderHeader(item) {
        const { name, profile, headline } = item;
        const detailText = headline || profile.occupation;
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ProfileImage
                    imageStyle={{ height: 40, width: 40, borderRadius: 20 }}
                    defaultImageStyle={{ width: 20, height: 20, margin: 20 }}
                    imageUrl={profile ? profile.image : undefined}
                    imageContainerStyle={styles.imageContainerStyle}
                    userId={item._id}
                />
                <Name text={name} textStyle={{
                    fontSize: 15,
                    fontFamily: GM_FONT_FAMILY_3,
                    fontWeight: 'bold',
                    color: '#4F4F4F',
                    marginLeft: 7
                }} />
                <UserBanner
                    user={item}
                    iconStyle={{ marginLeft: 7, height: 18, width: 15 }}
                />
                <Text 
                    style={styles.infoTextStyle}
                    numberOfLines={1}
                    ellipsizeMode='tail'
                >
                    {detailText}
                </Text>
            </View>
        );
    }

    renderButtons(item) {
        return (
            <View style={styles.buttonsContainerStyle}>
                <DelayedButton
                    onPress={() => this.handleUpdateFriendship(item)}
                    activeOpacity={0.6}
                >
                    <View style={[styles.buttonTextContainerStyle, { backgroundColor: '#E0E0E0' }]}>
                        <Text style={styles.textStyle}>Delete</Text>
                    </View>
                </DelayedButton >
                <DelayedButton
                    onPress={() => this.handleUpdateFriendship(item)}
                    activeOpacity={0.6}
                >
                    <View style={{
                        ...styles.buttonTextContainerStyle,
                        borderColor: '#EB5757',
                        borderWidth: 1
                    }}>
                        <Text style={{ ...styles.textStyle, color: '#EB5757' }}>Block</Text>
                    </View>
                </DelayedButton>
            </View>
        );
    }

    /**
     * Render user top goals and needs
     * @param {} item 
     */
    renderTopGoal(item) {
        const { topGoals, topNeeds } = item;

        let topGoalText = 'None shared';
        if (topGoals && topGoals.length !== 0) topGoalText = topGoals[0];

        return (
            <View style={styles.goalContainerStyle}>
                <Text numberOfLines={2} ellipsizeMode='tail' style={{ marginBottom: 2 }}>
                    <Text style={styles.subTitleTextStyle}>Top Goal: </Text>
                    <Text style={styles.bodyTextStyle}>{topGoalText}</Text>
                </Text>
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
                {this.renderHeader(item)}
                {this.renderTopGoal(item)}
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
        height: 30,
        marginRight: 8,
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 16,
        paddingRight: 16,
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textStyle: {
        fontSize: 12,
        fontFamily: GM_FONT_FAMILY_2,
        fontWeight: '500',
        color: '#333333'
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
        color: '#9B9B9B',
        fontSize: 11,
        fontFamily: GM_FONT_FAMILY_3,
        marginLeft: 7
    },
    // Top goals and need related styles
    goalContainerStyle: {
        flexDirection: 'row',
        flex: 1,
        marginTop: 7,
        marginBottom: 16
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
