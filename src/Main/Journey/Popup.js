/** @format */

import React, { Component } from 'react'
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import Modal from 'react-native-modal'
import { GM_BLUE } from '../../styles/basic/color'
import { Entypo } from '@expo/vector-icons'
import * as text from '../../styles/basic/text'
import { openPopup } from '../../actions'

import SILVER_BADGE from '../../asset/image/popups/SILVER_BADGE.png'
import GOLD_BADGE from '../../asset/image/popups/GOLD_BADGE.png'
import GREEN_BADGE from '../../asset/image/popups/GREEN_BADGE.png'
import BRONZE_BADGE from '../../asset/image/popups/BRONZE_BADGE.png'
import FIRST_GOAL from '../../asset/image/popups/FIRST_GOAL.png'
import SEVEN_GOALS from '../../asset/image/popups/SEVEN_GOALS.png'
import STREAK from '../../asset/image/popups/STREAK.png'
import STREAK_MISSED from '../../asset/image/popups/STREAK_MISSED.png'

import * as Helper from '../../Utils/HelperMethods'

const POPUP_DETAILS = {
    FIRST_GOAL: {
        title: `You added your 1st goal!`,
        img: FIRST_GOAL,
        d1: `WELL DONE!`,
        d2: `Feeling joy and excitement is inevitable when you make progress!`,
        d3: ``,
    },
    SEVEN_GOALS: {
        title: `You created 7 goals!`,
        img: SEVEN_GOALS,
        d1: `You’re on FIRE!`,
        d2: `You’re more than halfway to earning your Silver Badge!`,
        d3: `Your bonuses are waiting for you!`,
    },
    SILVER_BADGE: {
        title: `Silver badge earned!`,
        img: SILVER_BADGE,
        d1: `CRUSHIN' IT LIKE A BOSS, {{firstNameCaps}}!`,
        d2: `Now check your email for your bonuses!`,
        d3: ``,
    },
    GOLD_BADGE: {
        title: `You earned your Gold Badge!`,
        img: GOLD_BADGE,
        d1: `BREAKING NEWS:`,
        d2: `You’re AWESOME and everyone knows it!`,
        d3: `Stay tuned for more Challenge invitations…`,
    },
    GREEN_BADGE: {
        title: `You earned your Green Badge!`,
        img: GREEN_BADGE,
        d1: `GREAT JOB!`,
        d2: `Now just invite 1 friend to earn the Bronze Badge!`,
        d3: `The best way to move forward is to let go of things that are holding you back.`,
    },
    BRONZE_BADGE: {
        title: `You earned your Bronze Badge!`,
        img: BRONZE_BADGE,
        d1: `YOU'RE HEATING UP`,
        d2: `Next up, Silver Badge: Get it and unlock new features and bonuses!`,
        d3: ``,
    },
    STREAK: {
        title: `You are on a streak for: {{sentenceFragment}}`,
        img: STREAK,
        d1: ``,
        d2: `You checked it off as completed 4 times in a row.`,
        d3: `Can you keep it going long enough to break your own record?`,
    },
    STREAK_MISSED: {
        title: `Your habit streak has ended for: {{sentenceFragment}}`,
        img: STREAK_MISSED,
        d1: `GET YOUR STREAK BACK ON!`,
        d2: `See you at your next check-in!`,
        d3: ``,
    },
}

class Popup extends Component {
    constructor(props) {
        super(props)
    }
    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible })
    }

    render() {
        const { popupName } = this.props
        if (popupName) {
            this.props.openPopup(popupName)
            return (
                <Modal isVisible={this.props.isVisible}>
                    <View style={styles.container}>
                        <TouchableOpacity
                            onPress={this.props.closeModal}
                            style={styles.closeBtn}
                        >
                            <Entypo name="cross" size={25} color="#4F4F4F" />
                        </TouchableOpacity>
                        <Text style={styles.title}>
                            {POPUP_DETAILS[popupName].title}
                        </Text>
                        <Image
                            style={styles.img}
                            source={POPUP_DETAILS[popupName].img}
                        />
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
        paddingHorizontal: 15,
        paddingTop: '3%',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        height: '90%',
        borderRadius: 8,
    },
    title: {
        paddingTop: 20,
        fontFamily: text.FONT_FAMILY.BOLD,
        fontSize: 20,
        color: GM_BLUE,
    },
    img: {
        marginVertical: '10%',
    },
    d1: {
        fontFamily: text.FONT_FAMILY.BOLD,
        fontSize: 24,
        textAlign: 'center',
        marginTop: 15,
        width: '85%',
    },
    d2: {
        fontFamily: text.FONT_FAMILY.MEDIUM,
        fontSize: 18,
        textAlign: 'center',
        marginTop: 15,
        width: '85%',
    },
    d3: {
        fontFamily: text.FONT_FAMILY.REGULAR,
        fontSize: 16,
        textAlign: 'center',
        marginTop: 15,
        width: '85%',
    },
    closeBtn: {
        alignSelf: 'flex-end',
    },
})

export default connect(mapStateToProps, {
    openPopup,
})(Popup)
