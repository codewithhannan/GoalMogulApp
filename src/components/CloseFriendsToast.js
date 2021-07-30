/** @format */

import React, { Component } from 'react'
import { View, Image, Text, TouchableWithoutFeedback } from 'react-native'
import { color, default_style } from '../styles/basic'
import FriendsView from '../asset/image/Friend_View.png'
import { openProfile } from '../actions'
import { connect } from 'react-redux'
import { getFirstName } from '../Utils/HelperMethods'

class GreenBadgeToast extends Component {
    constructor(props) {
        super(props)
    }

    renderOpenProfileButton() {
        const { _id } = this.props.friend
        return (
            <>
                <TouchableWithoutFeedback
                    onPress={() => this.props.openProfile(_id)}
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
                            View Profile
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            </>
        )
    }

    render() {
        const { name } = this.props.friend
        let firstName
        if (name) {
            firstName = getFirstName(name)
        }

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
                            source={FriendsView}
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
                            You haven’t checked out {firstName}’s goals in a
                            while.
                        </Text>
                        <Text
                            style={{
                                ...default_style.normalText_1,
                                marginTop: 4,
                            }}
                        >
                            Leave a thoughtful comment to supercharge your
                            friendship!
                        </Text>
                        {this.renderOpenProfileButton()}
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
    openProfile,
})(GreenBadgeToast)
