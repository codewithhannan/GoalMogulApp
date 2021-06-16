/** @format */

import React, { Component } from 'react'
import { View, Image, Text } from 'react-native'
import { color, default_style } from '../styles/basic'
import LionMascot from '../asset/image/LionMascot_shadow.png'
import LottieView from 'lottie-react-native'
import NO_GOALS_LOTTIE from '../asset/toast_popup_lotties/TribeNoGoal/tribeNoGoal.json'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'

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
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flex: 1,
                        // paddingHorizontal: 96,
                        paddingVertical: 10,
                        marginBottom: 10,
                        paddingRight: 10,
                        borderRadius: 5,
                        height: 198,
                    }}
                >
                    {/* <View
                        style={{
                            flexDirection: 'row',
                            width: '30%',
                        }}
                    >
                        <Image
                            source={image}
                            style={{
                                height: 130,
                                width: '100%',
                                resizeMode: 'contain',
                                left: 15,
                            }}
                        />
                    </View> */}
                    <LottieView
                        style={{ height: hp(19), left: 5 }}
                        source={NO_GOALS_LOTTIE}
                        autoPlay
                        loop
                    />
                    <View
                        style={{
                            width: '70%',
                            right: 5,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'SFProDisplay-Bold',
                                fontWeight: '400',
                                fontSize: 14,
                                width: '75%',
                                lineHeight: 17,

                                marginHorizontal: 25,
                            }}
                        >
                            {heading}
                        </Text>
                        <Text
                            style={{
                                fontFamily: 'SFProDisplay-Regular',
                                fontWeight: '400',
                                fontSize: 14,
                                lineHeight: 17,
                                width: '95%',
                                marginHorizontal: 25,
                                marginTop: 10,
                            }}
                        >
                            {text1}
                        </Text>
                        <Text
                            style={{
                                fontFamily: 'SFProDisplay-Regular',
                                fontWeight: '400',
                                fontSize: 14,
                                lineHeight: 17,
                                width: '75%',

                                marginHorizontal: 25,
                                marginTop: 10,
                            }}
                        >
                            {text2}
                        </Text>

                        {text3 ? (
                            <Text
                                style={{
                                    fontFamily: 'SFProDisplay-Regular',
                                    fontWeight: '700',
                                    fontSize: 14,
                                    lineHeight: 17,
                                    width: '75%',

                                    marginHorizontal: 25,
                                    marginTop: 10,
                                    lineHeight: 17,
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
