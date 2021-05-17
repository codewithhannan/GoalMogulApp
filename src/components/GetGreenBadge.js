/** @format */

import React, { Component } from 'react'
import { View, Image, Text, TouchableWithoutFeedback } from 'react-native'
import { color, default_style } from '../styles/basic'
import GreenBadge from '../asset/image/Green_Badge.png'
import { openProfileDetailEditForm, refreshProfileData } from '../actions'
import { connect } from 'react-redux'

class GetGreenBadge extends Component {
    constructor(props) {
        super(props)

        // this.handleEditOnPressed = this.handleEditOnPressed.bind(this)
    }

    // handleEditOnPressed(pageId) {
    //     const { userId } = this.props
    //     this.props.openProfileDetailEditForm(userId, pageId)
    // }

    render() {
        return (
            <>
                <View
                    style={{
                        backgroundColor: color.PG_BACKGROUND,

                        marginHorizontal: 10,
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',

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
                            marginHorizontal: 50,
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
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'SFProDisplay-Bold',
                                fontWeight: '700',
                                fontSize: 16,
                                lineHeight: 21,
                                width: '60%',
                                marginHorizontal: 26,
                                marginTop: 20,
                            }}
                        >
                            Get your Green Badge now
                        </Text>
                        <Text
                            style={{
                                fontFamily: 'SFProDisplay-Regular',
                                fontWeight: '700',
                                fontSize: 16,
                                lineHeight: 21,
                                width: '80%',
                                marginHorizontal: 25,
                                marginTop: 5,
                            }}
                        >
                            Simply create your first goal!
                        </Text>
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
})(GetGreenBadge)
