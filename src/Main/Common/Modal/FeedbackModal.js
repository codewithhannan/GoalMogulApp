/** @format */

import React, { useState } from 'react'
import { Button, Text, View, Image, TouchableOpacity } from 'react-native'
import Modal from 'react-native-modal'
import { Dimensions } from 'react-native'
import { Actions } from 'react-native-router-flux'
import LottieView from 'lottie-react-native'
import THANKYOU_LOTTIE from '../../../asset/toast_popup_lotties/thank_you/thank_you.json'
import CROSS from '../../../asset/icons/cross.png'
import { Entypo } from '@expo/vector-icons'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import { color, default_style } from '../../../styles/basic'

function FeedbackModal(props) {
    const height = Dimensions.get('screen').height

    return (
        <Modal backdropOpacity={0.5} isVisible={props.isVisible}>
            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <View
                    style={{
                        borderRadius: 8,
                        backgroundColor: color.GV_MODAL,
                        width: wp('90%'),
                        height: hp('35%'),
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            marginTop: 10,
                            justifyContent: 'center',
                        }}
                    >
                        <Text style={{ ...default_style.titleText_1 }}>
                            Thank You!
                        </Text>
                    </View>

                    <View
                        style={{
                            position: 'absolute',
                            right: 15,
                            top: 5,
                        }}
                    >
                        <TouchableOpacity onPress={() => props.isClose()}>
                            <Entypo
                                name="cross"
                                size={27}
                                color="#4F4F4F"
                                style={{ alignSelf: 'flex-end' }}
                            />
                        </TouchableOpacity>
                    </View>

                    <LottieView
                        style={{
                            height: hp(25),
                            marginTop: 2,
                            alignSelf: 'center',
                        }}
                        source={THANKYOU_LOTTIE}
                        autoPlay
                        loop
                    />

                    <Text
                        style={{
                            fontWeight: '400',
                            fontSize: 16,
                            lineHeight: 23,
                            width: '100%',
                            marginBottom: 20,
                            marginTop: 15,
                            textAlign: 'center',
                        }}
                    >
                        {`We will be in touch.`}
                    </Text>
                </View>
            </View>
        </Modal>
    )
}

export default FeedbackModal
