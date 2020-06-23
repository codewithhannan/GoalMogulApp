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

const Name = (props) => {
    const style = props.textStyle
        ? { ...styles.containerStyle, ...props.textStyle }
        : { ...styles.containerStyle }
    return (
        <Text style={style} numberOfLines={1} ellipsizeMode="tail">
            {props.text}
        </Text>
    )
}

export default Name
