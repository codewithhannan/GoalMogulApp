/** @format */

import React, { Component } from 'react'
import { View, Image, Text, TouchableWithoutFeedback } from 'react-native'
import { color, default_style } from '../styles/basic'
import SilverBadge from '../asset/image/Silver_Badge.png'
import InviteFriendModal from '../Main/MeetTab/Modal/InviteFriendModal'

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

    openInviteFriendModal = () => {
        this.setState({ showInviteFriendModal: true })
    }

    closeInviteFriendModal = () => {
        this.setState({ showInviteFriendModal: false })
    }

    renderInviteFriendsButton() {
        return (
            <>
                <TouchableWithoutFeedback onPress={this.openInviteFriendModal}>
                    <View
                        style={{
                            backgroundColor: '#42C0F5',
                            width: '50%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 35,
                            borderColor: '#42C0F5',
                            borderWidth: 2,
                            borderRadius: 3,
                            // marginTop: 6,
                        }}
                    >
                        <Text
                            style={{
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: 12,
                            }}
                        >
                            Invite Friends
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
                <InviteFriendModal
                    isVisible={this.state.showInviteFriendModal}
                    closeModal={this.closeInviteFriendModal}
                />
            </>
        )
    }

    render() {
        const { heading, text } = this.props

        return (
            <>
                <View
                    style={{
                        backgroundColor: color.PG_BACKGROUND,

                        marginHorizontal: 10,
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                        // paddingHorizontal: 96,
                        paddingVertical: 10,
                        // marginBottom: 10,

                        borderRadius: 8,

                        marginTop: 7,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            width: '40%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignContent: 'center',
                        }}
                    >
                        <Image
                            source={SilverBadge}
                            style={{
                                height: 140,
                                width: '100%',
                                resizeMode: 'contain',
                            }}
                        />
                    </View>
                    <View
                        style={{
                            width: '70%',
                            justifyContent: 'space-between',
                            marginRight: 5,
                        }}
                    >
                        <Text
                            style={{
                                ...default_style.titleText_1,
                                fontSize: 13,
                            }}
                        >
                            Your account has low activity. Invite more friends
                            to get new suggestions,inspiration, and Likes! 🔥
                        </Text>

                        <Text
                            style={{
                                ...default_style.normalText_1,
                                marginBottom: 4,
                                fontSize: 11,
                            }}
                        >
                            Bring new energy to old friendships by discovering
                            the ambitions that drive each other. 🙌'
                        </Text>

                        {this.renderInviteFriendsButton()}
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
