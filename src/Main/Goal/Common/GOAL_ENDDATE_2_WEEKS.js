/** @format */

import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native'
// import LottieView from 'lottie-react-native'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import { connect } from 'react-redux'
import Modal from 'react-native-modal'
import { GM_BLUE } from '../../../styles/basic/color'
import { Entypo } from '@expo/vector-icons'
import * as text from '../../../styles/basic/text'
import { default_style } from '../../../styles/basic'

import DelayedButton from '../../../Main/Common/Button/DelayedButton'

// import SILVER_BADGE from '../../asset/popup_animation/p5.json'
// import GOLD_BADGE from '../../asset/popup_animation/p6.json'
// import GREEN_BADGE from '../../asset/popup_animation/p2-v2.json'
// import BRONZE_BADGE from '../../asset/popup_animation/p3.json'
// import FIRST_GOAL from '../../asset/popup_animation/p1.json'
// import SEVEN_GOALS from '../../asset/popup_animation/p4-v2.json'
// import STREAK from '../../asset/popup_animation/p7.json'
// import STREAK_MISSED from '../../asset/popup_animation/p8.json'
// import POPUP_BLUE from '../../asset/popup_animation/popupBlue.png'
import Goal2week from '../../../asset/image/Goal2week.png'
import Goal1week from '../../../asset/image/Goal1week.png'
import GoalToday from '../../../asset/image/GoalToday.png'

// import * as Helper from '../../Utils/HelperMethods'

const GOAL_ENDDATE_2_WEEKS = ({ isVisible, closeModal, week = 2 }) => {
    return (
        <Modal isVisible={isVisible}>
            <View style={styles.container(week)}>
                <TouchableOpacity onPress={closeModal} style={styles.closeBtn}>
                    <Entypo name="cross" size={28} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>Goal Update</Text>
                <Image
                    source={
                        week === 1
                            ? Goal1week
                            : week === 0
                            ? GoalToday
                            : Goal2week
                    }
                    style={styles.img}
                />

                <Text style={styles.d2}>
                    Your goal's End Date is{' '}
                    {week === 0
                        ? 'today'
                        : `coming up in ${week} ${
                              week === 1 ? 'week' : 'weeks'
                          }`}
                    :
                </Text>
                <Text style={styles.goal}>GOAL TITLE COMES HERE</Text>
                {/* </ImageBackground> */}
                <View style={{ position: 'absolute', bottom: 30 }}>
                    {week === 0 ? (
                        <DelayedButton
                            style={[
                                {
                                    paddingVertical: 5,
                                    width: 220,
                                    alignItems: 'center',
                                    backgroundColor: GM_BLUE,
                                    borderRadius: 5,
                                    marginTop: 10,
                                },
                            ]}
                            onPress={() => console.log('1ST BUTTON')}
                        >
                            <Text
                                style={[
                                    default_style.subTitleText_1,
                                    {
                                        fontFamily: text.FONT_FAMILY.SEMI_BOLD,
                                        color: 'white',
                                    },
                                ]}
                            >
                                Mark as Complete
                            </Text>
                        </DelayedButton>
                    ) : (
                        <></>
                    )}
                    <DelayedButton
                        style={[
                            {
                                paddingVertical: 5,
                                width: 220,
                                alignItems: 'center',
                                backgroundColor: GM_BLUE,
                                borderRadius: 5,
                                marginTop: 10,
                            },
                        ]}
                        onPress={() => console.log('1ST BUTTON')}
                    >
                        <Text
                            style={[
                                default_style.subTitleText_1,
                                {
                                    fontFamily: text.FONT_FAMILY.SEMI_BOLD,
                                    color: 'white',
                                },
                            ]}
                        >
                            Seek Help
                        </Text>
                    </DelayedButton>
                    <DelayedButton
                        style={[
                            {
                                paddingVertical: 5,
                                width: 220,
                                alignItems: 'center',
                                backgroundColor: GM_BLUE,
                                borderRadius: 5,
                                marginTop: 10,
                            },
                        ]}
                        onPress={() => console.log('1ST BUTTON')}
                    >
                        <Text
                            style={[
                                default_style.subTitleText_1,
                                {
                                    fontFamily: text.FONT_FAMILY.SEMI_BOLD,
                                    color: 'white',
                                },
                            ]}
                        >
                            Share an Update
                        </Text>
                    </DelayedButton>
                    {week === 0 ? (
                        <DelayedButton
                            style={[
                                {
                                    paddingVertical: 5,
                                    width: 220,
                                    alignItems: 'center',
                                    backgroundColor: 'white',
                                    borderRadius: 5,
                                    marginTop: 10,
                                    borderWidth: 1,
                                    borderColor: GM_BLUE,
                                },
                            ]}
                            onPress={() => console.log('1ST BUTTON')}
                        >
                            <Text
                                style={[
                                    default_style.subTitleText_1,
                                    {
                                        fontFamily: text.FONT_FAMILY.SEMI_BOLD,
                                        color: GM_BLUE,
                                    },
                                ]}
                            >
                                Extend End Date by 1 Week
                            </Text>
                        </DelayedButton>
                    ) : (
                        <></>
                    )}
                    <DelayedButton
                        style={[
                            {
                                paddingVertical: 5,
                                width: 220,
                                alignItems: 'center',
                                backgroundColor: 'white',
                                borderRadius: 5,
                                marginTop: 10,
                                borderWidth: 1,
                                borderColor: GM_BLUE,
                            },
                        ]}
                        onPress={() => console.log('1ST BUTTON')}
                    >
                        <Text
                            style={[
                                default_style.subTitleText_1,
                                {
                                    fontFamily: text.FONT_FAMILY.SEMI_BOLD,
                                    color: GM_BLUE,
                                },
                            ]}
                        >
                            Modify End Date
                        </Text>
                    </DelayedButton>
                </View>
            </View>
        </Modal>
    )
}

// const mapStateToProps = (state, ownProps) => {
//     const user = state.user
//     const { popupName, isVisible, closeModal } = ownProps
//     return {
//         user,
//         popupName,
//         isVisible,
//         closeModal,
//     }
// }

const styles = StyleSheet.create({
    container: (week) => ({
        paddingHorizontal: wp(4),
        paddingVertical: hp(2),
        alignItems: 'center',
        backgroundColor: '#ffffff',
        alignSelf: 'center',
        height: week === 0 ? hp(83) : hp(78),
        width: wp(90),
        borderRadius: wp(2),
    }),
    title: {
        paddingTop: hp(0.5),
        fontFamily: text.FONT_FAMILY.BOLD,
        width: wp(76),
        textAlign: 'center',
        fontSize: hp(2.3),
        color: 'black',
        paddingBottom: 10,
    },
    d2: {
        fontSize: hp(1.75),
        marginTop: hp(3.4),
        fontWeight: '400',
        width: wp(77),
        textAlign: 'center',
        // fontFamily: text.FONT_FAMILY.REGULAR,
    },
    goal: {
        // fontFamily: text.FONT_FAMILY.SEMI_BOLD,
        fontSize: hp(1.7),
        fontWeight: '600',
        marginTop: hp(1.9),
        width: wp(77),
        color: GM_BLUE,
    },
    closeBtn: {
        alignSelf: 'flex-end',
    },
    img: {
        height: hp(20),
        width: wp(80),
        resizeMode: 'contain',
    },
})

export default connect(null, null)(GOAL_ENDDATE_2_WEEKS)
