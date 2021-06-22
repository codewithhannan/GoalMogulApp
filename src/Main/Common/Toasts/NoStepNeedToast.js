/** @format */

import React, { Component } from 'react'
import { View, Image, Text } from 'react-native'

import { connect } from 'react-redux'
import LottieView from 'lottie-react-native'
import NO_STEP_LOTTIE from '../../../asset/toast_popup_lotties/NoStepsNeeds/NoStepsNeeds.json'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import { color } from '../../../styles/basic'

class NoStepNeedToast extends Component {
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

                        justifyContent: 'center',
                        alignItems: 'center',
                        // paddingHorizontal: 96,
                        paddingVertical: 10,
                        marginBottom: 10,
                        paddingRight: 10,
                        borderRadius: 6,
                        width: '90%',
                        height: '40%',
                        top: 10,
                    }}
                >
                    <View
                        style={{
                            width: '35%',
                            marginHorizontal: 10,
                        }}
                    >
                        {/* <Image
                            source={PrivateGoal}
                            style={{
                                height: 130,
                                width: '100%',
                                left: 5,

                                resizeMode: 'contain',
                            }}
                        /> */}
                        <LottieView
                            style={{ height: hp(16) }}
                            source={NO_STEP_LOTTIE}
                            autoPlay
                            loop
                        />
                    </View>
                    <View
                        style={{
                            width: '65%',
                            left: 1,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 17,
                                lineHeight: 19,
                                bottom: 10,

                                fontFamily: 'SFProDisplay-Bold',
                            }}
                        >
                            This goal has currently no Steps and Needs
                        </Text>
                    </View>
                </View>
            </>
        )
    }
}

const mapStateToProps = (state, props) => {
    const { userId, user } = state.user

    return {
        user,
        userId,
    }
}

export default connect(mapStateToProps, {})(NoStepNeedToast)
