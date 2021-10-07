/** @format */

import React, { Component } from 'react'
import { View, Text } from 'react-native'

import Divider from './Divider'

class TabButtonGroup extends Component {
    constructor(props) {
        super(props)
    }

    renderButton() {
        return this.props.children.map((b, index) => {
            if (index !== 0) {
                // console.log('hi I am number 1');
                return (
                    <View
                        key={Math.random().toString(36).substr(2, 9)}
                        style={styles.dividerContainerStyle}
                    >
                        <Divider />
                        {b}
                    </View>
                )
            }
            return b
        })
    }

    render() {
        // console.log(this.props.children);
        return <View style={styles.containerStyle}>{this.renderButton()}</View>
    }
}

const styles = {
    containerStyle: {
        display: 'flex',
        height: 32,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
    },
    dividerContainerStyle: {
        flexDirection: 'row',
        flex: 1,
    },
}

export default TabButtonGroup
