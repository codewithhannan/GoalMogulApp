/** @format */

import React, { Component } from 'react'
import {
    View,
    Image,
    Text,
    TouchableWithoutFeedback,
    Dimensions,
} from 'react-native'
import { color, default_style } from '../styles/basic'
import MissingProfile from '../asset/image/Goals_Nudge.png'
import { addNudge, NUDGE_TYPES } from '../actions/NudgeActions'
import { connect } from 'react-redux'
import * as text from '../styles/basic/text'

const windowHeight = Dimensions.get('window').height

class PrivateGoalsNudge extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    renderNudgeButton() {
        const { visitedUser, token } = this.props
        return (
            <>
                <TouchableWithoutFeedback
                    onPress={() => {
                        this.props.addNudge(
                            visitedUser,
                            token,
                            NUDGE_TYPES.makeGoalsPublic
                        )
                        this.props.onClose()
                    }}
                >
                    <View
                        style={{
                            backgroundColor: '#42C0F5',
                            width: '90%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 52,
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
        const { hideNudge } = this.state
        return (
            <>
                <View
                    style={{
                        backgroundColor: 'white',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 5,
                        width: '100%',
                        height: windowHeight * 0.45,
                    }}
                >
                    <View
                        style={{
                            width: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Image
                            source={MissingProfile}
                            style={{
                                height: 170,
                                width: '100%',
                                resizeMode: 'contain',
                            }}
                        />
                    </View>
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
                            {this.props.name}'s goals are all set to Private.
                            Nudge him to make some goals visible to Friends.
                        </Text>
                    </View>
                    {this.renderNudgeButton()}
                </View>
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
})(PrivateGoalsNudge)
