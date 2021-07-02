/** @format */

import React from 'react'
import { View, Image } from 'react-native'
import Icons from '../../asset/base64/Icons'
const { CheckIcon: check } = Icons

const Check = ({ selected }) => {
    const checkIconContainerStyle = selected
        ? {
              ...styles.checkIconContainerStyle,
              backgroundColor: '#42C0F5',
              borderColor: '#42C0F5',
          }
        : { ...styles.checkIconContainerStyle, backgroundColor: 'white' }

    const checkIconStyle = selected
        ? { ...styles.checkIconStyle, tintColor: 'white' }
        : { ...styles.checkIconStyle, tintColor: '#999' }

    return (
        <View style={checkIconContainerStyle}>
            <Image
                source={selected ? check : null}
                resizeMode="contain"
                style={checkIconStyle}
            />
        </View>
    )
}

const styles = {
    checkIconContainerStyle: {
        marginLeft: 8,
        height: 24,
        width: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: 'gray',
        alignSelf: 'center',
    },
    checkIconStyle: {
        width: 16,
        height: 14,
    },
}

export default Check
