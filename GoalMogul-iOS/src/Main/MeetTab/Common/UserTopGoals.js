import React from 'react';
import {
    View,
    Text,
} from 'react-native';
import DelayedButton from '../../Common/Button/DelayedButton';
import { GM_BLUE, DEFAULT_STYLE } from '../../../styles';

class UserTopGoals extends React.PureComponent {
    render() {
        const { user } = this.props;
        if (!user) {
            return null;
        }
        const { topGoals } = user;

        let topGoalText = 'None shared';
        if (topGoals && topGoals.length !== 0) topGoalText = topGoals[0];

        return (
            <View style={styles.goalContainerStyle}>
                <Text numberOfLines={2} ellipsizeMode='tail' style={[DEFAULT_STYLE.normalText_1, { marginBottom: 2 }]}>
                    <Text style={{ fontWeight: "bold", color: GM_BLUE }}>Top Goal: </Text>
                    {topGoalText}
                </Text>
            </View>
        );
    }
}

const styles = {
    goalContainerStyle: {
        flexDirection: 'row',
        flex: 1,
        marginTop: 8,
        marginBottom: 9
    }
}

export default UserTopGoals;