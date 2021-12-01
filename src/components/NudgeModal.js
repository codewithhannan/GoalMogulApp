/** @format */

import React, { Component } from 'react'
import { Text, View, TouchableWithoutFeedback } from 'react-native'
import Modal from 'react-native-modal'
import { color, default_style } from '../styles/basic'
import { addNudge, NUDGE_TYPES } from '../actions/NudgeActions'
import { connect } from 'react-redux'
import LottieView from 'lottie-react-native'
import NO_GOAL_LOTTIE from '../asset/toast_popup_lotties/help_friend/help_friend.json'
import YES_LOTTIE from '../asset/toast_popup_lotties/yes-button/yes_button.json'

import { heightPercentageToDP as hp } from 'react-native-responsive-screen'

class NudgeModal extends Component {
    constructor(props) {
        super(props)
    }

    renderNoButton() {
        return (
            <>
                <TouchableWithoutFeedback onPress={this.props.onClose}>
                    <View
                        style={{
                            width: 75,
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 31,
                            borderColor: '#42C0F5',
                            borderWidth: 2,
                            borderRadius: 3,
                            marginBottom: 15,
                        }}
                    >
                        <Text
                            style={{
                                color: '#42C0F5',
                                fontWeight: '600',
                                fontSize: 15,
                                fontFamily: 'SFProDisplay-Semibold',
                            }}
                        >
                            No
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            </>
        )
    }

    renderYesButton() {
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
                    <View style={{ marginBottom: 16 }}>
                        <Text
                            style={{
                                position: 'absolute',
                                zIndex: 1,
                                padding: 5,

                                alignSelf: 'center',
                                color: 'white',
                                fontFamily: 'SFProDisplay-Semibold',
                            }}
                        >
                            Yes
                        </Text>
                        <LottieView
                            style={{ height: 35 }}
                            source={YES_LOTTIE}
                            autoPlay
                            loop
                        />
                    </View>
                </TouchableWithoutFeedback>
            </>
        )
    }

    render() {
        const { name, isVisible } = this.props

        return (
            <>
                <Modal
                    backdropOpacity={0.5}
                    isVisible={isVisible}
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
                                {/* <TouchableOpacity
                                    onPress={this.props.onClose}
                                    style={{ bottom: 5 }}
                                >
                                    <Entypo
                                        name="cross"
                                        size={27}
                                        color="#4F4F4F"
                                    />
                                </TouchableOpacity> */}
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

                                    marginTop: 12,
                                    lineHeight: 25,
                                    width: '90%',
                                    alignSelf: 'center',
                                }}
                            >
                                {`Your friend ${name} has not set any goals yet. Do you want to send a nudge?`}
                            </Text>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: 15,
                                    alignItems: 'center',
                                }}
                            >
                                {this.renderYesButton()}
                                <View style={{ width: 10 }} />
                                {this.renderNoButton()}
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
})(NudgeModal)
