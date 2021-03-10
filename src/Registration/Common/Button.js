/** @format */

import React from 'react'
import { View, Text } from 'react-native'

import { RightArrowIcon } from '../../Utils/Icons'

const Button = (props) => {
    const containerStyle = { ...styles.containerStyle }
    const textStyle = { ...styles.textStyle }

    if (props.arrow) {
        containerStyle.backgroundColor = '#ffffff'
        textStyle.color = '#17B3EC'
        textStyle.fontWeight = '600'

        return (
            <View style={containerStyle}>
                <Text style={textStyle}>{props.text}</Text>
                <RightArrowIcon
                    iconContainerStyle={{
                        alignSelf: 'center',
                        alignItems: 'center',
                    }}
                    iconStyle={{
                        tintColor: '#34c0dd',
                        ...styles.iconStyle,
                        height: 15,
                        width: 20,
                    }}
                />
            </View>
        )
    }

    if (props.onlyText) {
        containerStyle.backgroundColor = '#ffffff'
        textStyle.color = '#17B3EC'
        textStyle.fontWeight = '600'

        return (
            <View style={containerStyle}>
                <Text style={textStyle}>{props.text}</Text>
            </View>
        )
    }

    return (
        <View style={styles.containerStyle}>
            <Text style={styles.textStyle}>{props.text}</Text>
        </View>
    )
}

const styles = {
    containerStyle: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 8,
        marginLeft: 18,
        marginRight: 18,
        height: 41,
        justifyContent: 'center',
        backgroundColor: '#17B3EC',
    },
    textStyle: {
        fontSize: 15,
        fontWeight: '800',
        color: '#ffffff',
        alignSelf: 'center',
    },
    iconStyle: {
        alignSelf: 'center',
        // fontSize: 26,
        marginLeft: 5,
    },
}

export default Button
