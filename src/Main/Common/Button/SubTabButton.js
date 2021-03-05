/** @format */

import React from 'react'
import { View, Text, Animated, Image } from 'react-native'

const SubTabButton = (props) => {
    const {
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
        height: 12,
        width: 12,
        alignSelf: 'center',
        justifyContent: 'center',
        tintColor: '#1998c9',
        marginRight: 9,
    },
}

export default SubTabButton
