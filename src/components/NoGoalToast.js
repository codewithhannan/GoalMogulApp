/** @format */

import React, { Component } from 'react'
import { View, Image, Text, TouchableWithoutFeedback } from 'react-native'
import { color, default_style } from '../styles/basic'
import * as text from '../styles/basic/text'
import NoGoal from '../asset/image/NoGoal_Toast.png'
import { openProfileDetailEditForm, refreshProfileData } from '../actions'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'

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
                            <View
                                style={{
                                    width: '45%',
                                    marginTop: 10,
                                }}
                            >
                                <Image
                                    source={NoGoal}
                                    style={{
                                        height: 120,
                                        width: '100%',
                                        resizeMode: 'contain',
                                        top: 5,
                                        right: 3,
                                    }}
                                />
                            </View>
                            <View
                                style={{
                                    width: '55%',
                                    marginTop: 30,
                                    right: 8,
                                    marginHorizontal: 2,
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
