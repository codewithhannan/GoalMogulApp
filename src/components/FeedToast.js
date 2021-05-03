/** @format */

import React, { Component } from 'react'
import { View, Image, Text } from 'react-native'
import { color, default_style } from '../styles/basic'
import LionMascot from '../asset/image/LionMascot_shadow.png'

class PrivateGoalsToast extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { heading, text1, text2, text3, image, height } = this.props

        return (
            <>
                <View
                    style={{
                        backgroundColor: color.PG_BACKGROUND,

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
                            source={image}
                            style={{
                                height: height,
                                width: '100%',
                                resizeMode: 'contain',
                            }}
                        />
                    </View>
                    <View
                        style={{
                            width: '65%',
                        }}
                    >
                        <Text
                            style={{
                                ...default_style.titleText_1,
                            }}
                        >
                            {heading}
                        </Text>
                        <Text
                            style={{
                                ...default_style.normalText_1,
                                marginTop: 6,
                            }}
                        >
                            {text1}
                        </Text>
                        <Text
                            style={{
                                ...default_style.normalText_1,
                                marginTop: 6,
                            }}
                        >
                            {text2}
                        </Text>

                        {text3 ? (
                            <Text
                                style={{
                                    ...default_style.normalText_1,
                                    marginTop: 6,
                                }}
                            >
                                {text3}
                            </Text>
                        ) : null}
                    </View>
                </View>
            </>
        )
    }
}

export default PrivateGoalsToast
