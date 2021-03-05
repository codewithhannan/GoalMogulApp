/** @format */

import React, { Component } from 'react'
import { View, Image, Text, TouchableWithoutFeedback } from 'react-native'
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
                <TouchableWithoutFeedback
                    onPress={() =>
                        this.props.openProfileDetailEditForm(
                            this.props.userId,
                            this.props.pageId
                        )
                    }
                >
                    <View
                        style={{
                            backgroundColor: '#42C0F5',
                            width: '70%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 35,
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
                            Edit Profile
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
                        marginTop: 5,
                        width: '95%',
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            width: '35%',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Image
                            source={GreenBadge}
                            style={{
                                height: 130,
                                width: '100%',
                                resizeMode: 'contain',
                            }}
                        />
                    </View>
                    <View
                        style={{
                            width: '60%',
                        }}
                    >
                        <Text
                            style={{
                                ...default_style.titleText_1,
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

export default connect(mapStateToProps, {
    openProfileDetailEditForm,
    refreshProfileData,
})(GreenBadgeToast)
