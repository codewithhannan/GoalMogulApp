// This is the view for a TrendingGoalCard
import React from 'react';
import {
    View,
    TouchableOpacity,
    Image,
    Text
} from 'react-native';
import { connect } from 'react-redux';

// Actions
import {
    selectTrendingGoals
} from '../../../redux/modules/goal/CreateGoalActions';

// Assets
import plus from '../../../asset/utils/plus.png';

// Utils
import { nFormatter } from '../../../redux/middleware/utils';

// Styles
import { APP_BLUE_BRIGHT } from '../../../styles';

class TrendingGoalCard extends React.PureComponent {
    onPress = (title) => {
        this.props.selectTrendingGoals(title);
    }

    renderStats(item) {
        const { frequency, title } = item;
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: APP_BLUE_BRIGHT }}>
                    <Text style={{ fontWeight: '600' }}>
                        {nFormatter(frequency)}
                    </Text>{' '}IN COMMON
                </Text>
                <TouchableOpacity
                    style={styles.plusIconContainerStyle}
                    onPress={() => this.onPress(title)}
                >
                    <Image source={plus} style={{ width: 15, height: 15, tintColor: 'white' }} />
                </TouchableOpacity>
            </View>
        );
    }

    renderTitle(item) {
        const { title } = item;
        return (
            <View style={{ flexWrap: 'wrap', flex: 1, paddingTop: 10, paddingBottom: 10 }}>
                <Text
                    style={{ color: 'darkgray', fontSize: 12 }}
                    ellipsizeMode='tail'
                    numberOfLines={3}
                >
                    {title}
                </Text>
            </View>
        );
    }

    renderRank(item, index) {
        return (
            <View style={{ padding: 15 }}>
                <Text>#{index}</Text>
            </View>
        );
    }

    render() {
        const { item, index } = this.props;
        if (!item) return;
        return (
            <View style={styles.containerStyle}>
                {this.renderRank(item, index)}
                {this.renderTitle(item)}
                {this.renderStats(item)}
            </View>
        );
    }
}

const styles = {
    containerStyle: {
        flex: 1, 
        backgroundColor: 'white', 
        flexDirection: 'row', 
        alignItems: 'center'
    },
    plusIconContainerStyle: {
        backgroundColor: APP_BLUE_BRIGHT, 
        margin: 10, 
        borderRadius: 15, 
        height: 30, 
        width: 30,
        alignItems: 'center',
        justifyContent: 'center'
    }
};

export default connect(
    null,
    {
        selectTrendingGoals
    }
)(TrendingGoalCard);
