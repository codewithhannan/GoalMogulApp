/** @format */

import React from 'react'
import { Text } from 'react-native'
import { default_style } from '../../styles/basic'

const styles = {
    containerStyle: {
        ...default_style.titleText_2,
        maxWidth: 250,
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
