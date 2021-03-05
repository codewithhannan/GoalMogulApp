/** @format */

import React, { Component } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native'

import { connect } from 'react-redux'
import { onTabPress } from '../../actions'

class Button extends Component {
    onPress() {
        this.props.onTabPress(this.props.tabId)
    }

    render() {
        const buttonContainerStyle = { ...styles.buttonContainerStyle }
        const selected = this.props.selectedTab === this.props.tabId
        if (selected) {
            buttonContainerStyle.borderBottomWidth = 2
            buttonContainerStyle.borderBottomColor = '#17B3EC'
        }
        return (
            <TouchableWithoutFeedback onPress={this.onPress.bind(this)}>
                <View style={buttonContainerStyle}>
                    <Text style={styles.textStyle}>{this.props.title}</Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

const styles = {
    textStyle: {
        paddingTop: 10,
        paddingBottom: 10,
        fontSize: 15,
    },
    buttonContainerStyle: {
        marginLeft: 5,
        marginRight: 5,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
}

const mapStateToProps = (state) => {
    const { selectedTab } = state.setting

    return {
        selectedTab,
    }
}

export default connect(mapStateToProps, { onTabPress })(Button)
