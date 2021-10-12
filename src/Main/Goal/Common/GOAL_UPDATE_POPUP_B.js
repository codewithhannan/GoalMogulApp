/** @format */

import React, { useState, useEffect } from 'react'
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
    SafeAreaView,
} from 'react-native'
// import LottieView from 'lottie-react-native'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import { connect } from 'react-redux'
import Modal from 'react-native-modal'
import { GM_BLUE } from '../../../styles/basic/color'
import { MaterialIcons } from '@expo/vector-icons'
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
import GoalUpdateA from '../../../asset/image/GoalUpdateA.png'

// import * as Helper from '../../Utils/HelperMethods'

const GOAL_UPDATE_POPUP_B = ({ isVisible, closeModal, user }) => {
    return (
        <Modal isVisible={isVisible}>
            <SafeAreaView style={styles.container}>
                <View
                    style={{
                        height: '100%',
                        width: '100%',
                        backgroundColor: '#ffffff',
                        alignItems: 'center',
                    }}
                >
                    <View
                        style={{
                            width: '100%',
                            height: 55,
                            backgroundColor: GM_BLUE,
                            flexDirection: 'row',
                        }}
                    >
                        <TouchableOpacity
                            onPress={closeModal}
                            style={styles.closeBtn}
                        >
                            <MaterialIcons
                                name="arrow-back-ios"
                                size={20}
                                color="white"
                            />
                        </TouchableOpacity>
                        <Text style={styles.title}>Seek Help</Text>
                    </View>
                    {/* <Image source={GoalUpdateA} style={styles.img} /> */}

                    <Text style={styles.d2}>
                        Specify what you would like help with:
                    </Text>
                    <Text style={styles.goal}>GOAL TITLE COMES HERE</Text>
                    {/* </ImageBackground> */}
                </View>
            </SafeAreaView>
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
    container: {
        alignItems: 'center',
        backgroundColor: GM_BLUE,
        alignSelf: 'center',
        height: '105%',
        width: '110%',
    },
    title: {
        paddingTop: hp(2.2),
        // fontFamily: text.FONT_FAMILY.MEDIUM,
        marginLeft: wp(12),
        width: wp(76),
        textAlign: 'center',
        fontSize: hp(2),
        color: 'white',
    },
    d2: {
        fontSize: hp(1.75),
        marginTop: hp(3.4),
        fontWeight: '600',
        width: wp(90),
        // fontFamily: text.FONT_FAMILY.REGULAR,
    },
    goal: {
        // fontFamily: text.FONT_FAMILY.SEMI_BOLD,
        fontSize: hp(1.7),
        fontWeight: '600',
        marginTop: hp(1.9),
        width: wp(90),
        color: GM_BLUE,
    },
    closeBtn: {
        alignSelf: 'flex-start',
        top: 20,
        left: 20,
    },
    img: {
        height: hp(20),
        width: wp(80),
        resizeMode: 'contain',
    },
})

export default connect(null, null)(GOAL_UPDATE_POPUP_B)
