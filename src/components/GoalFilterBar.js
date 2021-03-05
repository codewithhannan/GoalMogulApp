/** @format */

import React, { Component } from 'react'
import { View, Text, Image } from 'react-native'

/* asset */
import dropDown from '../asset/utils/dropDown.png'

class GoalFilterBar extends Component {
    render() {
        const {
            containerStyle,
            textStyle,
            detailContainerStyle,
            standardTextStyle,
            caretStyle,
        } = styles
        return (
            <View style={containerStyle}>
                <View style={detailContainerStyle}>
                    <Text style={textStyle}>MOST IMPORTANT</Text>
                    <Image style={caretStyle} source={dropDown} />
                </View>

                <View style={detailContainerStyle}>
                    <Text style={textStyle}>
                        CATEGORY
                        <Text style={standardTextStyle}> (ALL)</Text>
                    </Text>
                    <Image style={caretStyle} source={dropDown} />
                </View>
            </View>
        )
    }
}

const styles = {
    containerStyle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 12,
    },
    detailContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
        marginLeft: 15,
    },
    textStyle: {
        fontSize: 9,
        color: '#1fb6dd',
        fontWeight: '600',
    },
    standardTextStyle: {
        fontSize: 9,
        color: 'black',
    },
    caretStyle: {
        tintColor: '#20485f',
        marginLeft: 5,
    },
}

export default GoalFilterBar
