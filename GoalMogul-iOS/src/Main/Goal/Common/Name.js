/** @format */

import React from 'react'
import { View, Text, TouchableWithoutFeedback } from 'react-native'
import { DEFAULT_STYLE } from '../../../styles'

const styles = {
    containerStyle: DEFAULT_STYLE.titleText_1,
}

const Name = (props) => {
    const style = props.textStyle
        ? { ...styles.containerStyle, ...props.textStyle }
        : { ...styles.containerStyle }
    const { onPress } = props
    if (!props.text) return null
    let text = props.text
    while (text.length > 18) {
        let arr = text.split(' ')
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
