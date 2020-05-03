import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { GM_CONTAINER_BACKGROUND } from '../../styles/basic/color';

/**
 * Friend tab page for GM main tabs
 * 
 * @link https://www.figma.com/file/T1ZgWm5TKDA4gtBS5gSjtc/GoalMogul-App?node-id=24%3A195
 */
class FriendTab extends React.Component {

    render() {
        return (
            <View style={styles.containerStyle}>
                
            </View>
        );
    }
}

const styles = {
    containerStyle: {
        backgroundColor: GM_CONTAINER_BACKGROUND,
        flex: 1
    }
};

const mapStateToProps = (state) => {
    return {

    };
}

export default connect(
    mapStateToProps,
    {

    }
)(FriendTab);