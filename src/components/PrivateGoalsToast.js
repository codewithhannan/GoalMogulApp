/** @format */

import React, { Component } from 'react'
import { View, Image, Text } from 'react-native'
import { color, default_style } from '../styles/basic'
import PrivateGoal from '../asset/image/Private_Goal.png'
import LottieView from 'lottie-react-native'
import PRIVATE_GOAL_LOTTIE from '../asset/toast_popup_lotties/All_your goals set to private/All_your goals set to private.json'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'

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
                    <LottieView
                        style={{ height: hp(19) }}
                        source={PRIVATE_GOAL_LOTTIE}
                        autoPlay
                        loop
                    />

                    <View
                        style={{
                            width: '60%',
                        }}
                    >
                        <Text
                            style={{
                                fontStyle: 'SFProDisplay-Bold',
                                fontSize: 15,
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
