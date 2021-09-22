/** @format */

import React, { Component } from 'react'
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    ImageBackground,
} from 'react-native'
import LottieView from 'lottie-react-native'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import { connect } from 'react-redux'
import Modal from 'react-native-modal'
import { GM_BLUE } from '../../styles/basic/color'
import { Entypo } from '@expo/vector-icons'
import * as text from '../../styles/basic/text'
import { openPopup } from '../../actions'

import SILVER_BADGE from '../../asset/popup_animation/p5.json'
import GOLD_BADGE from '../../asset/popup_animation/p6.json'
import GREEN_BADGE from '../../asset/popup_animation/p2-v2.json'
import BRONZE_BADGE from '../../asset/popup_animation/p3.json'
import FIRST_GOAL from '../../asset/popup_animation/p1.json'
import SEVEN_GOALS from '../../asset/popup_animation/p4-v2.json'
import STREAK from '../../asset/popup_animation/p7.json'
import STREAK_MISSED from '../../asset/popup_animation/p8.json'
import POPUP_BLUE from '../../asset/popup_animation/popupBlue.png'

import * as Helper from '../../Utils/HelperMethods'

const POPUP_DETAILS = {
    FIRST_GOAL: {
        title: `You added your 1st goal!`,
        anm: FIRST_GOAL,
        d1: `WELL DONE!`,
        d2: `Feeling joy and excitement is inevitable when you make progress!`,
        d3: ``,
    },
    SEVEN_GOALS: {
        title: `You created 7 goals!`,
        anm: SEVEN_GOALS,
        d1: `You’re on FIRE!`,
        d2: `You’re more than halfway to earning your Silver Badge!`,
        d3: `Your bonuses are waiting for you!`,
    },
    SILVER_BADGE: {
        title: `Silver badge earned!`,
        anm: SILVER_BADGE,
        d1: `CRUSHIN' IT LIKE A BOSS, {{firstNameCaps}}!`,
        d2: `Now check your email for your bonuses!`,
        d3: ``,
    },
    GOLD_BADGE: {
        title: `You earned your Gold Badge!`,
        anm: GOLD_BADGE,
        d1: `BREAKING NEWS:`,
        d2: `You’re AWESOME and everyone knows it!`,
        d3: `Stay tuned for more Challenge invitations…`,
    },
    GREEN_BADGE: {
        title: `You earned your Green Badge!`,
        anm: GREEN_BADGE,
        d1: `GREAT JOB!`,
        d2: `Now just invite 1 friend to earn the Bronze Badge!`,
        d3: `The best way to move forward is to let go of things that are holding you back.`,
    },
    BRONZE_BADGE: {
        title: `You earned your Bronze Badge!`,
        anm: BRONZE_BADGE,
        d1: `YOU'RE HEATING UP`,
        d2: `Next up, Silver Badge: Get it and unlock new features and bonuses!`,
        d3: ``,
    },
    STREAK: {
        title: `You are on a streak for: {{sentenceFragment}}`,
        anm: STREAK,
        d1: ``,
        d2: `You checked it off as completed 4 times in a row.`,
        d3: `Can you keep it going long enough to break your own record?`,
    },
    STREAK_MISSED: {
        title: `Your habit streak has ended for: {{sentenceFragment}}`,
        anm: STREAK_MISSED,
        d1: `GET YOUR STREAK BACK ON!`,
        d2: `See you at your next check-in!`,
        d3: ``,
    },
}

class Popup extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { popupName } = this.props
        if (popupName) {
            // this.props.openPopup(popupName)
            return (
                <Modal isVisible={this.props.isVisible}>
                    <View style={styles.container}>
                        <TouchableOpacity
                            onPress={this.props.closeModal}
                            style={styles.closeBtn}
                        >
                            <Entypo name="cross" size={28} color="black" />
                        </TouchableOpacity>
                        <Text style={styles.title}>
                            {POPUP_DETAILS[popupName].title}
                        </Text>
                        <LottieView
                            style={styles.anm}
                            source={POPUP_DETAILS[popupName].anm}
                            autoPlay
                            loop
                        />
                        {/* <Image
                            style={styles.img}
                            source={POPUP_DETAILS[popupName].img}
                        /> */}
                        {/* <ImageBackground
                            source={POPUP_BLUE}
                            resizeMode="cover"
                            style={{ height: 100, width: 100 }}
                        > */}
                        <Text style={styles.d1}>
                            {Helper.parseExpressionAndEval(
                                POPUP_DETAILS[popupName].d1,
                                this.props.user
                            )}
                        </Text>
                        <Text style={styles.d2}>
                            {POPUP_DETAILS[popupName].d2}
                        </Text>
                        <Text style={styles.d3}>
                            {POPUP_DETAILS[popupName].d3}
                        </Text>
                        {/* </ImageBackground> */}
                    </View>
                </Modal>
            )
        } else return null
    }
}

const mapStateToProps = (state, ownProps) => {
    const user = state.user
    const { popupName, isVisible, closeModal } = ownProps
    return {
        user,
        popupName,
        isVisible,
        closeModal,
    }
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: wp(4),
        paddingVertical: hp(2),
        alignItems: 'center',
        backgroundColor: '#ffffff',
        alignSelf: 'center',
        height: hp(85),
        width: wp(90),
        borderRadius: wp(2),
    },
    title: {
        paddingTop: hp(2),
        fontFamily: text.FONT_FAMILY.BOLD,
        width: wp(76),
        textAlign: 'center',
        fontSize: hp(2.99),
        color: GM_BLUE,
    },
    anm: {
        height: hp(42),
        width: wp(40),
    },
    d1: {
        fontFamily: text.FONT_FAMILY.BOLD,
        fontSize: hp(3.59),
        textAlign: 'center',
        width: wp(76),
    },
    d2: {
        fontFamily: text.FONT_FAMILY.MEDIUM,
        fontSize: hp(2.59),
        textAlign: 'center',
        marginTop: hp(1.94),
        width: wp(76),
    },
    d3: {
        fontFamily: text.FONT_FAMILY.REGULAR,
        fontSize: hp(2.29),
        textAlign: 'center',
        marginTop: hp(1.94),
        width: wp(76),
    },
    closeBtn: {
        alignSelf: 'flex-end',
    },
})

export default connect(mapStateToProps, {
    openPopup,
})(Popup)
