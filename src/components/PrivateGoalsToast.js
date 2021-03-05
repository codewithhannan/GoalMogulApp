/** @format */

import React, { Component } from 'react'
import { View, Image, Text } from 'react-native'
import { color, default_style } from '../styles/basic'
import PrivateGoal from '../asset/image/Private_Goal.png'

class PrivateGoalsToast extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <>
                <View
                    style={{
                        backgroundColor: color.PG_BACKGROUND,

                        marginHorizontal: 20,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        // paddingHorizontal: 96,
                        paddingVertical: 10,
                        marginBottom: 10,
                        paddingRight: 10,
                        borderRadius: 5,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            width: '35%',
                            alignItems: 'center',
                        }}
                    >
                        <Image
                            source={PrivateGoal}
                            style={{
                                height: 130,
                                width: '100%',
                                resizeMode: 'contain',
                            }}
                        />
                    </View>
                    <View
                        style={{
                            width: '60%',
                        }}
                    >
                        <Text
                            style={{
                                ...default_style.titleText_1,
                            }}
                        >
                            All your goals are set to Private.
                        </Text>
                        <Text
                            style={{
                                ...default_style.normalText_1,
                                marginTop: 4,
                            }}
                        >
                            Friends can't see your goals when viewing your
                            Profile.
                        </Text>
                        <Text
                            style={{
                                ...default_style.normalText_1,
                                marginTop: 4,
                            }}
                        >
                            We strongly suggest making some goals visible to
                            Friends.
                        </Text>
                    </View>
                </View>
            </>
        )
    }
}

export default PrivateGoalsToast
