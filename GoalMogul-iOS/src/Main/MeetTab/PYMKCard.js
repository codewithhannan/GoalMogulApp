import React from 'react';
import {
    View,
    Text,
    Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import DelayedButton from '../Common/Button/DelayedButton';
import { BUTTON_STYLE, GM_FONT_SIZE, GM_FONT_FAMILY, GM_FONT_LINE_HEIGHT, GM_BLUE, DEFAULT_STYLE } from '../../styles';
import UserCardHeader from './Common/UserCardHeader';
import UserTopGoals from './Common/UserTopGoals';
import { updateFriendship } from '../../actions';

const { width } = Dimensions.get('window');

/**
 * People you may know card to display user information
 * 
 * TODO: this can later be refactored to be FriendCard where buttons have multiple functions depends on the state of user
 * Improvement: when PYMK is request, we can hide this card by filtering the data that is requests.outgoing
 */
class PYMKCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // When this card is initially displayed, there is no friendship request.
            // If friendship is sent, then in the next refresh, the card won't exist.
            invited: false
        };
    }

    handleRequestFriend = (userId) => {
        this.setState({
            ...this.state, invited: true
        }, () => this.props.updateFriendship(userId, '', 'requestFriend', 'requests.outgoing', undefined));
    }

    renderButton = (userId) => {
        let button;
        if (this.state.invited) {
            button = this.renderInvitedButton(userId);
        } else {
            button = this.renderInviteButton(userId);
        }

        return (
            <View style={{ flexDirection: "row" }}>
                {button}
                <View style={{ flex: 1 }} />
            </View>
        );
    }

    renderInvitedButton = (userId) => {
        const text = "Added";
        return (
            <DelayedButton style={[styles.buttonTextContainerStyle, { backgroundColor: "#BDBDBD" }]} onPress={() => {}} disabled>
                <Text style={[DEFAULT_STYLE.buttonText_1, { color: "white", fontWeight: "500" }]}>
                    {text}
                </Text>
            </DelayedButton>
        );
    }

    renderInviteButton = (userId) => {
        const text = "Add Friend";
        return (
            <DelayedButton style={[styles.buttonTextContainerStyle, { backgroundColor: GM_BLUE }]} onPress={() => this.handleRequestFriend(userId)} activeOpacity={0.6}>
                <Text style={[DEFAULT_STYLE.buttonText_1, { color: "white", fontWeight: "500" }]}>
                    {text}
                </Text>
            </DelayedButton>
        );
    }

    renderTopGoal = (user) => {
        const { topGoals } = user;

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

        return (
        <View style={styles.infoContainerStyle}>
            <View style={{ flex: 1 }}>
                <Text numberOfLines={2} ellipsizeMode='tail' style={styles.topGoalTextStyle}>
                    <Text style={{ color: GM_BLUE }}>Top Goal: </Text>
                    <Text>{topGoalText}</Text>
                </Text>
            </View>
        </View>
        );
    }

    render() {
        const { user } = this.props;
        if (!user) {
            return null;
        }

        return (
            <View style={[styles.containerStyle, { padding: 20 }]}>
                <UserCardHeader user={user} />
                <UserTopGoals user={user} />
                {this.renderButton(user._id)}
            </View>
        )
    }
}

const styles = {
    containerStyle: { width: "100%", backgroundColor: "white" },
    imageContainerStyle: {
        width: width * 0.14,
        height: width * 0.14,
        borderRadius: width * 0.07,
    },
    imageStyle: {
        width: width * 0.14,
        height: width * 0.14,
        borderRadius: width * 0.07
    },
    topGoalTextStyle: {
        fontSize: GM_FONT_SIZE.FONT_1,
        lineHeight: GM_FONT_LINE_HEIGHT.FONT_2,
        fontFamily: GM_FONT_FAMILY.GOTHAM
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
};

export default connect(
    null,
    {
        updateFriendship
    }
)(PYMKCard);