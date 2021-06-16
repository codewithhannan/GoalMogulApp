/** @format */

import React, { Component } from 'react'
import { View, Image, Text } from 'react-native'
import { color, default_style } from '../styles/basic'
import VisibleGoals from '../asset/image/Friends_Goals.png'
import LottieView from 'lottie-react-native'
import FRIENDS_GOAL_LOTTIE from '../asset/toast_popup_lotties/promt_/promt_.json'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'

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

                        borderRadius: 6,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            width: '40%',
                            alignItems: 'center',
                        }}
                    >
                        {/* <Image
                            source={VisibleGoals}
                            style={{
                                height: 130,
                                width: '100%',
                                resizeMode: 'contain',
                            }}
                        /> */}
                        <LottieView
                            style={{ height: hp(19), bottom: 3 }}
                            source={FRIENDS_GOAL_LOTTIE}
                            autoPlay
                            loop
                        />
                    </View>
                    <View
                        style={{
                            width: '60%',
                            paddingLeft: 15,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'SFProDisplay-Bold',
                                fontWeight: '700',
                                fontSize: 17,
                                lineHeight: 19,
                                width: '85%',
                                bottom: 10,
                                left: 2,
                            }}
                        >
                            Help {name} with your unbridled enthusiasm.
                        </Text>
                        <Text
                            style={{
                                fontFamily: 'SFProDisplay-Regular',
                                fontWeight: '100',
                                fontSize: 16,
                                lineHeight: 18,
                                width: '95%',

                                left: 2,
                            }}
                        >
                            Leave a comment or suggestion on his goals that will
                            make {name} smile!
                        </Text>
                    </View>
                </View>
            </>
        )
    }
}

export default FriendsGoals
