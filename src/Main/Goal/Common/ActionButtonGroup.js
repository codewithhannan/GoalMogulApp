/** @format */

import React from 'react'
import { View } from 'react-native'

const ActionButtonGroup = (props) => {
    const { containerStyle } = props
    return (
        <View style={{ ...styles.containerStyle, ...containerStyle }}>
            {props.children}
        </View>
    )
}

const styles = {
    containerStyle: {
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row',
        padding: 10,
    },
}

export default ActionButtonGroup
