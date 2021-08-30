/** @format */

import React from 'react'
import { View, Text } from 'react-native'
import { RightArrowIcon } from '../../Utils/Icons'

const Button = (props) => {
    const containerStyle = { ...styles.containerStyle }
    const textStyle = { ...styles.textStyle }

    if (props.arrow) {
        containerStyle.backgroundColor = '#ffffff'
        textStyle.color = '#34c0dd'
        textStyle.fontWeight = '600'

        return (
            <View
                style={[containerStyle, { opacity: props.disabled ? 0.6 : 1 }]}
            >
                <Text style={textStyle}>{props.text}</Text>
                <RightArrowIcon
                    iconStyle={{
                        ...styles.iconStyle,
                        height: 15,
                        width: 20,
                        tintColor: '#34c0dd',
                    }}
                />
                {/**
           <Icon
          name='ios-arrow-round-forward'
          type='ionicon'
          color='#34c0dd'
          iconStyle={styles.iconStyle}
        />
         */}
            </View>
        )
    }
    return (
        <View
            style={[
                styles.containerStyle,
                { opacity: props.disabled ? 0.6 : 1 },
            ]}
        >
            <Text style={styles.textStyle}>{props.text}</Text>
        </View>
    )
}

const styles = {
    containerStyle: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 16,
        marginBottom: 8,
        marginLeft: 18,
        marginRight: 18,
        height: 41,
        justifyContent: 'center',
        backgroundColor: '#45C9F6',
    },
    textStyle: {
        fontSize: 15,
        fontWeight: '800',
        color: '#ffffff',
        alignSelf: 'center',
    },
    iconStyle: {
        alignSelf: 'center',
        fontSize: 26,
        marginLeft: 5,
        marginTop: 3,
    },
}

export default Button
