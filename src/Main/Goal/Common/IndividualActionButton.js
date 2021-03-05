/** @format */

import React from 'react'
import { TouchableOpacity, View, Image, Text } from 'react-native'

const IndividualActionButton = (props) => {
    const {
        buttonName,
        iconSource,
        iconStyle,
        textStyle,
        containerStyle,
        onPress,
    } = props

    return (
        <TouchableOpacity
            activeOpacity={0.6}
            style={{ ...styles.containerDefaultStyle, ...containerStyle }}
            onPress={onPress}
        >
            <Image
                source={iconSource}
                style={{ ...styles.iconDefaultStyle, ...iconStyle }}
            />
            <Text style={{ ...styles.textDefaultStyle, ...textStyle }}>
                {buttonName}
            </Text>
        </TouchableOpacity>
    )
}

const styles = {
    containerDefaultStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
        height: 30,
    },
    textDefaultStyle: {
        fontSize: 12,
        color: '#3f3f3f',
    },
    iconDefaultStyle: {
        height: 15,
        width: 15,
        marginRight: 5,
    },
}

export default IndividualActionButton
