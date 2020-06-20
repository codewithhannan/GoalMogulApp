/** @format */

import React from 'react'
import { View } from 'react-native'

const Divider = (props) => {
    let style = { ...styles.containerStyle }
    if (props.horizontal) {
        style = { ...style, width: props.width }
    } else if (props.orthogonal) {
        style = { ...style, height: props.height }
    }
    if (props.color) {
        style = { ...style, borderColor: props.color }
    }
    return <View style={style} />
}

const styles = {
    containerStyle: {
        borderColor: '#dcdcdc',
        borderWidth: 0.5,
    },
}

export default Divider
