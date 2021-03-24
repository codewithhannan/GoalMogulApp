/** @format */

import React, { Component } from 'react'
import { View, Image, Text, TouchableWithoutFeedback } from 'react-native'
import { color, default_style } from '../styles/basic'
import MissingProfile from '../asset/image/Goals_Nudge.png'
import { openProfileDetailEditForm, refreshProfileData } from '../actions'
import { connect } from 'react-redux'
import * as text from '../styles/basic/text'

class MissingProfileToast extends Component {
    constructor(props) {
        super(props)
    }

    renderNudgeButton() {
        return (
            <>
                <TouchableWithoutFeedback style={{}}>
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
        return (
            <>
                <View
                    style={{
                        backgroundColor: 'white',

                        // marginHorizontal: 10,
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        // paddingHorizontal: 96,
                        // paddingVertical: 10,
                        // marginBottom: 10,
                        // paddingRight: 10,
                        borderRadius: 5,

                        width: '100%',
                        height: 330,
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
                                // fontFamily: text.FONT_FAMILY.REGULAR,

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

// const mapStateToProps = (state) => {
//     const { userId } = state.user

//     return {
//         userId,
//     }
// }

export default MissingProfileToast
