/** @format */

import React from 'react'
import { View, Text, Animated, Image } from 'react-native'
import _ from 'lodash'
import { DotIcon } from '../../../Utils/Icons'
import { default_style } from '../../../styles/basic'

const renderNotificationIndicator = (props) => {
    const { tabNotificationMap, tabKey, isSelected } = props
    if (!tabNotificationMap) return null
    if (
        !tabNotificationMap.hasOwnProperty(tabKey) ||
        !_.has(tabNotificationMap, tabKey)
    )
        return null

    const {
        hasNotification,
        style,
        containerStyle,
        selectedStyle,
        selectedContainerStyle,
    } = _.get(tabNotificationMap, tabKey)
    if (!hasNotification) return null
    return (
        <View
            style={{
                ...containerStyle,
                ...(isSelected ? selectedContainerStyle : {}),
            }}
        >
            <View style={{ ...style, ...(isSelected ? selectedStyle : {}) }} />
        </View>
    )
}

const TabButton = (props) => {
    const {
        tabNotificationMap,
        tabKey,
        iconSource,
        iconStyle,
        textStyle,
        containerStyle,
        statTextStyle,
    } = props

    const stat = !props.stat ? null : (
        <View>
            <DotIcon
                iconStyle={{
                    width: 3,
                    height: 3,
                    marginLeft: 4,
                    marginRight: 4,
                    ...iconStyle,
                }}
            />
            <Text style={{ ...styles.textStyle, ...statTextStyle }}>
                {props.stat}
            </Text>
        </View>
    )

    const icon = !iconSource ? null : (
        <Image
            source={iconSource}
            style={{ ...styles.iconStyle, ...iconStyle }}
        />
    )

    return (
        <View
            style={{
                ...styles.containerStyle,
                ...containerStyle,
            }}
        >
            {icon}
            <Animated.Text style={textStyle}>{props.text}</Animated.Text>
            {stat}
            {renderNotificationIndicator({
                tabNotificationMap,
                tabKey,
                isSelected: props.onSelect,
            })}
        </View>
    )
}

const styles = {
    containerStyle: {
        flex: 1,
        flexDirection: 'row',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    textStyle: {
        fontSize: 10,
        color: '#696969',
    },
    iconStyle: {
        ...default_style.smallIcon_1,
        alignSelf: 'center',
        justifyContent: 'center',
        marginRight: 9,
    },
}

export default TabButton
