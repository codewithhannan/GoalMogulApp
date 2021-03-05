/** @format */

import React, { Component } from 'react'
import { View, Image, Text, TouchableWithoutFeedback } from 'react-native'
import { color, default_style } from '../styles/basic'
import GoldBadge from '../asset/image/Gold_Badge.png'
// import InviteFriendModal from '../Main/MeetTab/Modal/InviteFriendModal'

// import * as text from '../styles/basic/text'
import { connect } from 'react-redux'
// import * as newColor from '../styles/basic/color'

// import { UI_SCALE } from '..'

class BronzeBadge extends Component {
    constructor(props) {
        super(props)

        this.state = {
            showInviteFriendModal: false,
        }

        // this.handleEditOnPressed = this.handleEditOnPressed.bind(this)
    }

    render() {
        const { count } = this.props

        return (
            <>
                <View
                    style={{
                        backgroundColor: color.PG_BACKGROUND,

                        marginHorizontal: 10,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        // paddingHorizontal: 96,
                        paddingVertical: 10,
                        // marginBottom: 10,
                        paddingRight: 10,
                        borderRadius: 5,
                        // marginTop: ,
                        width: '95%',
                        flex: 1,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            width: '35%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignContent: 'center',
                        }}
                    >
                        <Image
                            source={GoldBadge}
                            style={{
                                height: 120,
                                width: '100%',
                                resizeMode: 'contain',
                            }}
                        />
                    </View>
                    <View
                        style={{
                            width: '70%',
                        }}
                    >
                        <Text
                            style={{
                                ...default_style.titleText_1,
                                fontSize: 13,
                            }}
                        >
                            You know what would look great next to your name?
                        </Text>

                        <Text
                            style={{
                                ...default_style.normalText_1,

                                fontSize: 11,
                            }}
                        >
                            The shining Gold Badge!
                        </Text>
                        <Text
                            style={{
                                ...default_style.normalText_1,

                                fontSize: 11,
                            }}
                        >
                            You only need {10 - count} more friends with Bronze
                            Badges to earn your Gold Badge.
                        </Text>
                    </View>
                </View>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    const { user } = state.user
    const { inviteCode } = user
    const { tab } = state.navigation

    return {
        user,
        inviteCode,
        tab,
    }
}

export default connect(mapStateToProps, null)(BronzeBadge)
