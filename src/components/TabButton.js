/** @format */

import React from 'react'
import { View, Text } from 'react-native'

const TabButton = (props) => {
    if (props.onSelect) {
        return (
            <View style={styles.onSelectContainerStyle}>
                <Text style={styles.onSelectTextStyle}>{props.text}</Text>
            </View>
        )
    }
    return (
        <View style={styles.containerStyle}>
            <Text style={styles.textStyle}>{props.text}</Text>
        </View>
    )
}

const styles = {
    containerStyle: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    onSelectContainerStyle: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderColor: '#1fb6dd',
    },
    textStyle: {
        fontSize: 9,
        fontWeight: '600',
        color: '#33495f',
    },
    onSelectTextStyle: {
        fontSize: 9,
        fontWeight: '600',
        color: '#1fb6dd',
    },
}

export default TabButton
