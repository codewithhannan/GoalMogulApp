/** @format */

import React, { Component } from 'react'
import {
    View,
    Image,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
} from 'react-native'
import { color, default_style } from '../styles/basic'
import GreenBadge from '../asset/image/Green_Badge.png'
import { openProfileDetailEditForm, refreshProfileData } from '../actions'
import { connect } from 'react-redux'

class GreenBadgeToast extends Component {
    constructor(props) {
        super(props)

        // this.handleEditOnPressed = this.handleEditOnPressed.bind(this)
    }

    // handleEditOnPressed(pageId) {
    //     const { userId } = this.props
    //     this.props.openProfileDetailEditForm(userId, pageId)
    // }

    renderEditProfileButton() {
        return (
            <>
                <TouchableOpacity
                    onPress={() =>
                        this.props.openProfileDetailEditForm(
                            this.props.userId,
                            this.props.pageId
                        )
                    }
                    style={{
                        backgroundColor: '#42C0F5',
                        width: 133,
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 30,
                        borderColor: '#42C0F5',

                        borderRadius: 3,
                        marginHorizontal: 26,
                        marginTop: 10,
                    }}
                >
                    <View style={{}}>
                        <Text
                            style={{
                                color: 'white',
                                fontFamily: 'SFProDisplay-Bold',
                                fontSize: 14,

                                lineHeight: 16.71,
                            }}
                        >
                            Edit Profile
                        </Text>
                    </View>
                </TouchableOpacity>
            </>
        )
    }

    render() {
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
                            width: '20%',
                            marginBottom: 10,
                            marginHorizontal: 20,
                        }}
                    >
                        <Image
                            source={GreenBadge}
                            style={{
                                height: 124,
                                width: 93,
                                resizeMode: 'contain',
                            }}
                        />
                    </View>

                    <View
                        style={{
                            width: '80%',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'SFProDisplay-Bold',
                                fontWeight: '700',
                                fontSize: 16,
                                lineHeight: 21,
                                width: '80%',
                                marginHorizontal: 25,
                            }}
                        >
                            To earn your Green Badge, simply complete your
                            Profile and add your 1st goal!
                        </Text>
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

export default GreenBadgeToast
