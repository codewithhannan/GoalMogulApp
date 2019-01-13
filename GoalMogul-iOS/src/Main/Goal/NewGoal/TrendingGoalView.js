import React from 'react';
import {
    View
} from 'react-native';
import { connect } from 'react-redux';

const DEBUG_KEY = '[ UI TrendingGOalView ]';

class TrendingGoalView extends React.PureComponent {
    componentDidMount() {
        console.log(`${DEBUG_KEY}: component did mount`);
    }

    render() {
        return (
            <View style={{ height: 100, width: 100, backgroundColor: 'blue' }} />
        );
    }
}

export default connect(
    null,
    null
)(TrendingGoalView);
