/** @format */

import React from 'react'
import { Text, View } from 'react-native'
import { DEFAULT_STYLE } from '../../../styles'

const EmptyResult = (props) => {
    const { textStyle, containerStyle } = props
    return (
        <View style={[styles.containerStyle, containerStyle]}>
            <Text style={{ ...styles.textStyle, ...textStyle }}>
                {props.text}
            </Text>
        </View>
    )
}

const styles = {
    containerStyle: {
        alignItems: 'center',
    },
    textStyle: {
        ...DEFAULT_STYLE.subTitleText_1,
        paddingTop: 150,
        color: '#818181',
    },
}

export default EmptyResult
