/** @format */

import React from 'react'
import { View, Image, Text } from 'react-native'
import DelayedButton from './DelayedButton'
import { default_style, color } from '../../../styles/basic'
import { Icon } from '@ui-kitten/components'

const DEBUG_KEY = '[ UI ProfileActionButton ]'
const ProfileActionButton = (props) => {
    let image = null
    let icon = null
    const color = props.containerStyle.color || 'black'

    if (props.source) {
        image = (
            <Image
                resizeMode="contain"
                source={props.source}
                style={{
                    height: 15,
                    width: 15,
                    tintColor: color,
                    ...props.iconStyle,
                }}
            />
        )
    }

    if (props.iconName) {
        icon = (
            <Icon
                name={props.iconName}
                pack="material-community"
                style={{
                    ...default_style.buttonIcon_1,
                    tintColor: 'white',
                    marginRight: props.text ? 8 : 0, //only set marginRight if there is text next to it.
                }}
                zIndex={1}
            />
        )
    }

    const textComponent = props.text ? (
        <Text
            style={{
                fontSize: 12,
                fontWeight: 'bold',
                marginLeft: 5,
                color,
                ...props.textStyle,
            }}
        >
            {props.text}
        </Text>
    ) : null

    return (
        <DelayedButton activeOpacity={0.6} onPress={props.onPress}>
            <View
                style={{
                    flexDirection: 'row',
                    padding: 8,
                    paddingLeft: textComponent ? 12 : 8,
                    paddingRight: textComponent ? 12 : 8,
                    ...props.containerStyle,
                }}
            >
                {icon}
                {image}
                {textComponent}
            </View>
        </DelayedButton>
    )
}

export default ProfileActionButton
