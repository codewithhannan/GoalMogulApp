/** @format */

import React from 'react'
import { View, Text, TouchableWithoutFeedback } from 'react-native'
import { default_style } from '../../../styles/basic'

const styles = {
    containerStyle: {
        ...default_style.titleText_1,
        maxWidth: 150 * default_style.uiScale,
    },
}

const Name = (props) => {
    const style = props.textStyle
        ? { ...styles.containerStyle, ...props.textStyle }
        : { ...styles.containerStyle }
    const { onPress } = props
    if (!props.text) return null
    let text = props.text || ''
    let arr = text.split(' ')
    while (text.length > 18 && arr.length > 1) {
        arr.pop()
        text = arr.join(' ')
    }

    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View>
                <Text style={style} numberOfLines={1} ellipsizeMode="tail">
                    {text}
                </Text>
            </View>
        </TouchableWithoutFeedback>
    )
}

export default Name
