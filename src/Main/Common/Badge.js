/** @format */

import React from 'react'
import { Text } from 'react-native'

const styles = {
    containerStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        maxWidth: 150,
    },
}

// TODO: given a point number and return a colored badge
const Badge = (props) => {
    const style = props.textStyle
        ? { ...styles.containerStyle, ...props.textStyle }
        : { ...styles.containerStyle }
    return (
        <Text style={style} numberOfLines={1} ellipsizeMode="tail">
            {props.text}
        </Text>
    )
}

export default Badge
