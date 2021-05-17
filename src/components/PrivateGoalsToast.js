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
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                        // paddingHorizontal: 96,

                        marginBottom: 10,

                        padding: 10,
                        borderRadius: 8,
                        height: 165,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            width: '35%',
                            marginHorizontal: 10,
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
                                fontStyle: 'SFProDisplay-Bold',
                                fontSize: 16,
                                fontWeight: 'bold',
                            }}
                        >
                            All your goals are set to Private.
                        </Text>
                        <Text
                            style={{
                                ...default_style.normalText_1,
                                marginTop: 6,
                            }}
                        >
                            Friends can't see your goals when viewing your
                            Profile.
                        </Text>
                        <Text
                            style={{
                                ...default_style.normalText_1,
                                marginTop: 6,
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
