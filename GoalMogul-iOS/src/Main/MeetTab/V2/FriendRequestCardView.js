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
import Name from '../../Common/Name';
import ProfileImage from '../../Common/ProfileImage';
import DelayedButton from '../../Common/Button/DelayedButton';

// Actions
import {
  updateFriendship,
  blockUser,
  openProfile,
  UserBanner
} from '../../../actions';

import {
    handleRefresh
} from '../../../redux/modules/meet/MeetActions';
import UserCardHeader from '../Common/UserCardHeader';
import { DEFAULT_STYLE, GM_BLUE } from '../../../styles';
import { SentryRequestBuilder } from '../../../monitoring/sentry';
import { SENTRY_MESSAGE_LEVEL, SENTRY_MESSAGE_TYPE, SENTRY_TAGS, SENTRY_TAG_VALUE } from '../../../monitoring/sentry/Constants';
import UserTopGoals from '../Common/UserTopGoals';

// Assets
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
        accepted: false
    }

    onRespondClicked = (item) => {
        const { friendshipId, user } = item;
        const userId = user._id;
        ActionSheetIOS.showActionSheetWithOptions({
            options: ACCEPT_BUTTONS,
            cancelButtonIndex: ACCEPT_CANCEL_INDEX,
        },
        (buttonIndex) => {
            console.log('button clicked', ACCEPT_BUTTONS[buttonIndex]);
            switch (buttonIndex) {
            case ACCPET_INDEX:
                this.props.updateFriendship(
                    userId, 
                    friendshipId, 
                    'acceptFriend', 
                    TAB_KEY_INCOMING, 
                    () => this.props.handleRefresh()
                );
                break;
            case ACCPET_REMOVE_INDEX:
                this.props.updateFriendship(
                    userId, 
                    friendshipId, 
                    'deleteFriend', 
                    TAB_KEY_INCOMING, 
                    () => this.props.handleRefresh()
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

    handleWithdrawInvite = (item) => {
        const { friendshipId } = item;
        this.props.updateFriendship(
            undefined,
            friendshipId,
            'deleteFriend',
            TAB_KEY_OUTGOING,
            () => {
                this.setState({ requested: false });
            }
        );
    }

    handleAcceptFriendRequest = (userId, friendshipId) => {
        this.props.updateFriendship(userId, friendshipId, 'acceptFriend', TAB_KEY_INCOMING, () => this.props.handleRefresh());
    }

    handleDeleteFriendRequest = (userId, friendshipId) => {
        this.props.updateFriendship(userId, friendshipId, 'deleteFriend', TAB_KEY_INCOMING, () => this.props.handleRefresh());
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
        const { user } = this.props.item;
        if (user && user._id) {
            return this.props.openProfile(user._id);
        }
    }

    renderButton(item) {
        if (!item.user || item.type === 'info') return null;
        if (item.type === 'outgoing') {
            return this.renderButtonOutgoing(item);
        }

        if (item.type === 'incoming') {
            return this.renderButtonIncoming(item);
        }
        
        console.warn(`${DEBUG_KEY}: undefined item type: `, item.type);
        return null;
    }

    renderButtonOutgoing(item) {
        return (
            <View style={{ flex: 1, flexDirection: "row" }}>
                <DelayedButton onPress={() => this.handleWithdrawInvite(item)} activeOpacity={0.6} style={[styles.buttonTextContainerStyle, { backgroundColor: '#E0E0E0' }]}>
                    <Text style={[DEFAULT_STYLE.buttonText_2]}>Withdraw</Text>
                </DelayedButton>
                <View style={{ flex: 1 }} />
            </View>
        );
    }

    renderButtonIncoming(item) {
        const { friendshipId, user } = item;
        const userId = user._id;
        return (
            <View style={{ flex: 1, flexDirection: "row" }}>
                <DelayedButton 
                    onPress={() => this.handleAcceptFriendRequest(userId, friendshipId)} 
                    activeOpacity={0.6} 
                    style={[styles.buttonTextContainerStyle, { backgroundColor: GM_BLUE }]}
                >
                    <Text style={[DEFAULT_STYLE.buttonText_2, { color: "white" }]}>Accept</Text>
                </DelayedButton>
                <DelayedButton 
                    onPress={() => this.handleDeleteFriendRequest(userId, friendshipId)} 
                    activeOpacity={0.6} 
                    style={[styles.buttonTextContainerStyle, { backgroundColor: '#E0E0E0' }]}
                >
                    <Text style={[DEFAULT_STYLE.buttonText_2]}>Delete</Text>
                </DelayedButton>
                <View style={{ flex: 1 }} />
            </View>
        );
    }

    render() {
        const { item } = this.props;
        if (!item) return null;

        // console.log(`${DEBUG_KEY}: item is: `, item);
        return (
            <DelayedButton 
                activeOpacity={0.6}
                style={[styles.containerStyle, styles.shadow]}
                onPress={this.handleOnOpenProfile}
            >
                <UserCardHeader user={item.user} />
                <UserTopGoals user={item.user} />
                {this.renderButton(item)}
            </DelayedButton>
        );
    }
}

const styles = {
    containerStyle: {
        flex: 1,
        padding: 16,
        backgroundColor: 'white'
    },
    // Button styles
    buttonContainerStyle: {
        width: 90,
        alignItems: 'center',
        justifyContent: 'center',
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
    openProfile,
    handleRefresh
})(FriendRequestCardView);
