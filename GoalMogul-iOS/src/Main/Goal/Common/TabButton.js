/** @format */

import React from 'react'
import { TouchableOpacity, Image, Text, View } from 'react-native'
import { DotIcon } from '../../../Utils/Icons'

import { color } from '../../../styles/basic'

const defaultStyle = {
    selected: {
        backgroundColor: color.GM_BLUE,
        tintColor: 'white',
        color: 'white',
        fontWeight: '700',
    },
    unselected: {
        backgroundColor: 'white',
        tintColor: '#616161',
        color: '#616161',
        fontWeight: '600',
    },
}

const TabButton = (props) => {
    const buttonStyle = props.buttonStyle || defaultStyle
    const {
        backgroundColor,
        tintColor,
        color,
        fontWeight,
        borderColor,
    } = props.selected ? buttonStyle.selected : buttonStyle.unselected

    // Tab icon
    const image = props.iconSource ? (
        <Image
            source={props.iconSource}
            style={{ ...styles.iconStyle, ...props.iconStyle, tintColor }}
        />
    ) : null

    const stat = !props.count ? null : (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <DotIcon
                iconStyle={{
                    tintColor: color,
                    width: 4,
                    height: 4,
                    marginLeft: 4,
                    marginRight: 4,
                }}
            />
            {/* <Icon name='dot-single' type='entypo' color={color} size={20} /> */}
            <Text style={{ ...styles.countTextStyle, color }}>
                {props.count}
            </Text>
        </View>
    )

    // divider if not the first button
    const divider = props.hasDivider
        ? {
              borderColor: borderColor || '#e5e5e5',
              borderLeftWidth: 0.5,
          }
        : {}

    return (
        <TouchableOpacity
            activeOpacity={0.6}
            style={{ ...styles.containerStyle, backgroundColor, ...divider }}
            onPress={props.onPress}
        >
            {image}
            <Text
                style={{
                    ...styles.textStyle,
                    ...props.textStyle,
                    color,
                    fontWeight,
                }}
            >
                {props.text}
            </Text>
            {stat}
        </TouchableOpacity>
    )
}

const styles = {
    containerStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        height: 38,
    },
    iconStyle: {
        height: 26,
        width: 26,
    },
    textStyle: {
        fontSize: 11,
        marginLeft: 8,
    },
    countTextStyle: {
        fontSize: 11,
    },
}

export default TabButton
