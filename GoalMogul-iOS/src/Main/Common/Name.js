/** @format */

import React from 'react'
import { Text } from 'react-native'
import { DEFAULT_STYLE } from '../../styles'

const styles = {
    containerStyle: {
        ...DEFAULT_STYLE.titleText_2,
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
