/** @format */

import React, { Component } from 'react'
import { View, Image, Text, TouchableWithoutFeedback } from 'react-native'
import { color, default_style } from '../styles/basic'
import * as text from '../styles/basic/text'
import NoGoal from '../asset/image/NoGoal_Toast.png'
import { openProfileDetailEditForm, refreshProfileData } from '../actions'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import LottieView from 'lottie-react-native'
import NO_GOAL_LOTTIE from '../asset/toast_popup_lotties/You_have no_goals/You_have no_ goals.json'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'

class NoGoalToast extends Component {
    constructor(props) {
        super(props)
    }

    renderEditProfileButton() {
        return (
            <>
                <TouchableWithoutFeedback
                    onPress={() =>
                        Actions.createGoalModal({
                            openProfile: false,
                            pageId: this.props.pageId,
                        })
                    }
                >
                    <View
                        style={{
                            backgroundColor: '#42C0F5',

                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 35,
                            borderColor: '#42C0F5',
                            borderWidth: 2,
                            borderRadius: 3,
                            marginTop: 20,
                            marginHorizontal: 14,

                            width: '93%',
                        }}
                    >
                        <Text
                            style={{
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: 16,
                            }}
                        >
                            Create New Goal
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            </>
        )
    }

    render() {
        return (
            <>
                <View
                    style={{
                        backgroundColor: 'white',
                        height: 235,
                        flex: 1,

                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <View
                        style={{
                            backgroundColor: color.PG_BACKGROUND,

                            marginHorizontal: 10,

                            // paddingHorizontal: 96,

                            // marginBottom: 10,

                            borderRadius: 10,

                            width: '92%',
                            height: 200,
                        }}
                    >
                        <View style={{ flexDirection: 'row' }}>
                            <LottieView
                                style={{
                                    height: hp(14),

                                    left: 5,
                                    top: 2,
                                }}
                                source={NO_GOAL_LOTTIE}
                                autoPlay
                                loop
                            />
                            <View
                                style={{
                                    width: '55%',
                                    marginTop: 30,

                                    marginHorizontal: 22,
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: text.FONT_FAMILY.BOLD,
                                        fontSize: 17,
                                        color: color.TEXT_COLOR.DARK,
                                        fontWeight: 'bold',
                                        lineHeight: 19,
                                    }}
                                >
                                    You have no goals.
                                </Text>
                                <Text
                                    style={{
                                        ...default_style.normalText_1,
                                        marginTop: 10,
                                        fontSize: 16,
                                    }}
                                >
                                    Set some new goals so your friends can
                                    delight in helping you!
                                </Text>
                            </View>
                        </View>
                        {this.renderEditProfileButton()}
                    </View>
                </View>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    const { userId } = state.user

    return {
        userId,
    }
}

export default connect(mapStateToProps, {
    openProfileDetailEditForm,
    refreshProfileData,
})(NoGoalToast)
