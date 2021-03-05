/** @format */

import React from 'react'
import { View } from 'react-native'

const Divider = (props) => {
    let dividerStyle = { ...styles.containerStyle }

    if (props.width) {
        dividerStyle.width = props.width
    }

    if (props.height) {
        dividerStyle.height = props.height
    }

    if (props.color) {
        dividerStyle.borderColor = props.color
    }

    if (props.flex) {
        dividerStyle.width = undefined
        dividerStyle.flex = props.flex
    }

    if (props.horizontal) {
        if (props.borderBottomWidth) {
            dividerStyle.borderBottomWidth = props.borderBottomWidth
        } else {
            dividerStyle.borderBottomWidth = 2
        }
        return <View style={dividerStyle} />
    }

    dividerStyle.borderLeftWidth = 1
    return <View style={dividerStyle} />
}

const styles = {
    containerStyle: {
        borderColor: '#dcdcdc',
        width: 1,
        height: 1,
    },
}

export default Divider
