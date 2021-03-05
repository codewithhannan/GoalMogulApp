/** @format */

import React from 'react'
import { Image, View } from 'react-native'

import search_icon from '../asset/utils/search.png'
import right_arrow_icon from '../asset/utils/right_arrow.png'
import dot_icon from '../asset/utils/dot.png'
import BackButton from '../asset/utils/back.png'
import Icons from '../asset/base64/Icons'

const { CheckIcon: check_icon } = Icons

export const SearchIcon = (props) => {
    const { iconContainerStyle, iconStyle } = props

    return (
        <View style={iconContainerStyle}>
            <Image source={search_icon} style={iconStyle} />
        </View>
    )
}

export const RightArrowIcon = (props) => {
    const { iconContainerStyle, iconStyle } = props

    return (
        <View style={iconContainerStyle}>
            <Image source={right_arrow_icon} style={iconStyle} />
        </View>
    )
}

export const DotIcon = (props) => {
    const { iconContainerStyle, iconStyle } = props

    return (
        <View style={iconContainerStyle}>
            <Image source={dot_icon} style={iconStyle} />
        </View>
    )
}

export const BackIcon = (props) => {
    const { iconContainerStyle, iconStyle } = props
    const defaultIconStyle = {
        height: 25,
        width: 25,
    }

    return (
        <View style={iconContainerStyle}>
            <Image
                source={BackButton}
                style={{ ...defaultIconStyle, ...iconStyle }}
            />
        </View>
    )
}

export const CheckIcon = (props) => {
    const { iconContainerStyle, iconStyle } = props
    const defaultIconStyle = {
        height: 15,
        width: 15,
    }

    return (
        <View style={iconContainerStyle}>
            <Image
                source={check_icon}
                style={{ ...defaultIconStyle, ...iconStyle }}
            />
        </View>
    )
}
