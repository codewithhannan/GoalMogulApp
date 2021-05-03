/** @format */

import React, { Component } from 'react'
import { View, Image, Text } from 'react-native'
import { color, default_style } from '../styles/basic'
import VisibleGoals from '../asset/image/Goal_Visible.png'

class FriendsGoals extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { name } = this.props
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
                            source={VisibleGoals}
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
                            paddingLeft: 10,
                        }}
                    >
                        <Text
                            style={{
                                ...default_style.titleText_1,
                            }}
                        >
                            Help {name} with your unbridled enthusiasm.
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

export default FriendsGoals
