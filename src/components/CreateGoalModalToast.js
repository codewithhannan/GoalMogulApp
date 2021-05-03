/** @format */

import React, { Component } from 'react'
import { View, Image, Text } from 'react-native'
import { color, default_style } from '../styles/basic'
import CreateGoal from '../asset/image/CreateGoalLion.png'

class PrivateGoalsToast extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { firstText, randomText } = this.props

        return (
            <>
                {/* <View
                    style={{
                        backgroundColor: color.PG_BACKGROUND,
                        // width: '100%',
                        borderRadius: 8,
                    }}
                > */}
                <View
                    style={{
                        flexDirection: 'row',
                    }}
                >
                    <Image
                        source={CreateGoal}
                        style={{
                            height: 80,
                            width: 40,

                            resizeMode: 'contain',
                        }}
                    />

                    <View
                        style={{
                            marginHorizontal: 20,
                            justifyContent: 'center',
                            // flexWrap: 'nowrap',
                        }}
                    >
                        {randomText && (
                            <Text style={{ width: '50%', flexShrink: 1 }}>
                                {randomText}
                            </Text>
                        )}
                    </View>
                </View>
            </>
        )
    }
}

export default PrivateGoalsToast
