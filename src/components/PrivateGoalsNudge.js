/** @format */

import React, { Component } from 'react'
import {
    View,
    Image,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Dimensions,
} from 'react-native'

import MissingProfile from '../asset/image/Goals_Nudge.png'
import { addNudge, NUDGE_TYPES } from '../actions/NudgeActions'
import { connect } from 'react-redux'
import * as text from '../styles/basic/text'
import LottieView from 'lottie-react-native'
import NO_GOAL_LOTTIE from '../asset/toast_popup_lotties/Tiger-with-fly/Tiger-with-fly.json'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import { Actions } from 'react-native-router-flux'

const windowHeight = Dimensions.get('window').height

class PrivateGoalsNudge extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showNudge: true,
        }
    }

    renderNudgeButton() {
        const { visitedUser, token } = this.props

        return (
            <>
                <TouchableWithoutFeedback
                    onPress={
                        () => {
                            this.props.addNudge(
                                visitedUser,
                                token,
                                NUDGE_TYPES.makeGoalsPublic
                            )
                            this.setState({ showNudge: false })
                        }

                        // console.log('THIS IS PRESSED')
                    }
                >
                    <View
                        style={{
                            backgroundColor: '#42C0F5',
                            width: '90%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 40,
                            borderColor: '#42C0F5',
                            borderWidth: 2,
                            borderRadius: 3,
                            marginTop: 6,
                        }}
                    >
                        <Text
                            style={{
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: 16,
                            }}
                        >
                            Nudge
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            </>
        )
    }

    render() {
        const { showNudge } = this.state
        return (
            <>
                {showNudge ? (
                    <View
                        style={{
                            backgroundColor: 'white',
                            flexDirection: 'column',

                            alignItems: 'center',
                            borderRadius: 5,
                            width: '100%',
                            height: windowHeight * 0.4,
                        }}
                    >
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 10,
                            }}
                        >
                            <LottieView
                                style={{ height: hp(15) }}
                                source={NO_GOAL_LOTTIE}
                                autoPlay
                                loop
                            />

                            <View
                                style={{
                                    width: '70%',
                                    marginTop: 10,
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: text.FONT_FAMILY.REGULAR,
                                        fontWeight: '600',
                                        fontSize: 18,
                                        textAlign: 'center',
                                    }}
                                >
                                    {this.props.name}'s goals are all set to
                                    Private. Nudge him to make some goals
                                    visible to Friends.
                                </Text>
                            </View>
                        </View>

                        {this.renderNudgeButton()}
                    </View>
                ) : null}
            </>
        )
    }
}

const mapStateToProps = (state, props) => {
    const { token } = state.auth.user

    return {
        token,
    }
}

export default connect(mapStateToProps, {
    addNudge,
})(PrivateGoalsNudge)
