import React from 'react';
import {
    View,
    Text,
    Dimensions
} from 'react-native';
import DelayedButton from '../Common/Button/DelayedButton';
import { BUTTON_STYLE, GM_FONT_SIZE, GM_FONT_FAMILY, GM_FONT_LINE_HEIGHT, GM_BLUE } from '../../styles';
import UserCardHeader from './Common/UserCardHeader';
import UserTopGoals from './Common/UserTopGoals';

const { width } = Dimensions.get('window');

/**
 * People you may know card to display user information
 * 
 * TODO: this can later be refactored to be FriendCard where buttons have multiple functions depends on the state of user
 */
class PYMKCard extends React.Component {

    renderButton = () => {
        // TODO: 
        // 1. Update text to Invited when invitation sent
        // 2. Add other types of buttons
        const text = "Add Friend";
        return (
            <DelayedButton style={[BUTTON_STYLE.GM_BLUE_BG_WHITE_BOLD_TEXT.containerStyle, { width: 110, height: 32 }]}>
                <Text style={[{ paddingTop: 2, fontSize: GM_FONT_SIZE.FONT_1, lineHeight: GM_FONT_LINE_HEIGHT.FONT_2, fontFamily: GM_FONT_FAMILY.GOTHAM, color: "white", fontWeight: "500" }]}>
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

    renderSeparator() {
        return (
            <View style={{ height: 16 }}/>
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
                {this.renderButton()}
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
};

export default PYMKCard;