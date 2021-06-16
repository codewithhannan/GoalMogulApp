/** @format */

import React, { Component } from 'react'
import {
    Text,
    View,
    Image,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Dimensions,
} from 'react-native'
import Modal from 'react-native-modal'
import { Entypo } from '@expo/vector-icons'
import { color, default_style } from '../styles/basic'
import OnboardingStyles from '../styles/Onboarding'
import { addNudge, NUDGE_TYPES } from '../actions/NudgeActions'
import { connect } from 'react-redux'
import LottieView from 'lottie-react-native'
import NO_GOAL_LOTTIE from '../asset/toast_popup_lotties/help_friend/help_friend.json'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'

import GoalVisible from '../asset/image/Goalmogul_illustration.png'

const { text: textStyle, button: buttonStyle } = OnboardingStyles
const MODAL_WIDTH = Dimensions.get('screen').width
const MODAL_HEIGHT = Dimensions.get('screen').height

class ModalTester extends Component {
    constructor(props) {
        super(props)
    }

    renderYesButton() {
        const { visitedUser, token } = this.props
        return (
            <>
                <TouchableWithoutFeedback onPress={this.props.onClose}>
                    <View
                        style={{
                            width: '30%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 38,
                            borderColor: '#42C0F5',
                            borderWidth: 2,
                            borderRadius: 3,
                            right: 13,
                        }}
                    >
                        <Text
                            style={{
                                color: '#42C0F5',
                                fontWeight: '600',
                                fontSize: 15,
                            }}
                        >
                            No
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            </>
        )
    }

    renderNoButton() {
        const { visitedUser, token } = this.props
        return (
            <>
                <TouchableWithoutFeedback
                    onPress={() => {
                        this.props.addNudge(
                            visitedUser,
                            token,
                            NUDGE_TYPES.createFirstGoal
                        )
                        this.props.onClose()
                    }}
                >
                    <View
                        style={{
                            backgroundColor: '#42C0F5',
                            width: '30%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 38,
                            borderColor: '#42C0F5',
                            borderWidth: 2,
                            borderRadius: 3,
                            left: 13,
                        }}
                    >
                        <Text
                            style={{
                                color: 'white',
                                fontWeight: '600',
                                fontSize: 15,
                            }}
                        >
                            Yes
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            </>
        )
    }

    render() {
        const { name } = this.props

        return (
            <>
                <Modal
                    backdropOpacity={0.5}
                    isVisible={this.props.isVisible}
                    style={{
                        borderRadius: 20,
                    }}
                    animationIn="zoomInUp"
                    animationInTiming={400}
                >
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <View
                            style={{
                                // height: '0%',
                                width: '100%',

                                borderRadius: 8,
                                backgroundColor: color.GV_MODAL,
                                height: MODAL_HEIGHT * 0.357,
                            }}
                        >
                            <View
                                style={{
                                    justifyContent: 'space-between',
                                    flexDirection: 'row',
                                    marginTop: 10,
                                    marginHorizontal: 25,
                                }}
                            >
                                <Text style={{ ...default_style.titleText_1 }}>
                                    Help {name}
                                </Text>
                                <TouchableOpacity
                                    onPress={this.props.onClose}
                                    style={{ bottom: 5 }}
                                >
                                    <Entypo
                                        name="cross"
                                        size={27}
                                        color="#4F4F4F"
                                    />
                                </TouchableOpacity>
                            </View>
                            <LottieView
                                style={{
                                    height: hp(16),
                                    marginTop: 2,
                                    alignSelf: 'center',
                                }}
                                source={NO_GOAL_LOTTIE}
                                autoPlay
                                loop
                            />

                            <Text
                                style={{
                                    fontWeight: '400',
                                    fontSize: 15,
                                    textAlign: 'center',
                                    marginTop: 12,
                                }}
                            >
                                Your friend {name} has not set any goals yet.
                            </Text>

                            <View
                                style={{
                                    marginTop: 8,

                                    alignSelf: 'center',
                                }}
                            >
                                <Text
                                    style={{ fontWeight: '400', fontSize: 15 }}
                                >
                                    Do you want to send a nudge?
                                </Text>
                            </View>

                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'space-evenly',
                                    marginTop: 20,

                                    // paddingleft: 10,
                                    // padding: 15,
                                    // marginLeft: 20,
                                }}
                            >
                                {this.renderNoButton()}
                                {this.renderYesButton()}
                            </View>
                        </View>
                    </View>
                </Modal>
            </>
        )
    }
}

const mapStateToProps = (state, props) => {
    const visitedUser = state.profile.userId.userId
    const { token } = state.auth.user

    return {
        visitedUser,
        token,
    }
}

export default connect(mapStateToProps, {
    addNudge,
})(ModalTester)
