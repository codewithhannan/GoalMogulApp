/** @format */

import React from 'react'
import { View, Text } from 'react-native'

import { RightArrowIcon } from '../../../Utils/Icons'

const ButtonArrow = (props) => {
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
                        justifyContent: 'center',
                    }}
                    iconStyle={{
                        ...styles.iconStyle,
                        tintColor: '#34c0dd',
                        height: 15,
                        width: 20,
                        marginBottom: 3,
                    }}
                />
                {/**  
          <Icon
          name='ios-arrow-round-forward'
          type='ionicon'
          color='#34c0dd'
          iconStyle={}
        />
         */}
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
        justifyContent: 'center',
        backgroundColor: '#17B3EC',
    },
    textStyle: {
        fontSize: 13,
        fontWeight: '800',
        color: '#ffffff',
        alignSelf: 'center',
    },
    iconStyle: {
        alignSelf: 'center',
        // fontSize: 26,
        marginTop: 3,
    },
}

export default ButtonArrow
