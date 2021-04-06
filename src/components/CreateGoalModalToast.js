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
                <View
                    style={{
                        backgroundColor: color.PG_BACKGROUND,

                        width: '90%',
                        marginHorizontal: 20,
                        paddingHorizontal: 20,
                    }}
                >
                    <View
                        style={{
                            height: 80,
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
                                marginHorizontal: 30,
                                justifyContent: 'center',
                            }}
                        >
                            {firstText && (
                                <Text style={{ ...default_style.normalText_1 }}>
                                    {firstText}
                                </Text>
                            )}
                            {randomText && (
                                <Text style={{ ...default_style.normalText_1 }}>
                                    {randomText}
                                </Text>
                            )}
                        </View>
                    </View>
                </View>
            </>
        )
    }
}

export default PrivateGoalsToast
