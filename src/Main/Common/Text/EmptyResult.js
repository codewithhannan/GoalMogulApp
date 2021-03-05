/** @format */

import React from 'react'
import { Text, View } from 'react-native'
import { default_style, color } from '../../../styles/basic'

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
        ...default_style.subTitleText_1,
        paddingTop: 150,
        color: '#828282',
    },
}

export default EmptyResult
