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
                    style={{ width: '100%' }}
                >
                    <View
                        style={{
                            backgroundColor: '#42C0F5',
                            width: '182%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 35,
                            borderColor: '#42C0F5',
                            borderWidth: 2,
                            borderRadius: 3,
                            marginTop: 40,
                            marginLeft: -167,
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
                        backgroundColor: color.PG_BACKGROUND,

                        marginHorizontal: 10,
                        flexDirection: 'row',

                        // paddingHorizontal: 96,
                        padding: 10,

                        // marginBottom: 10,

                        borderRadius: 10,
                        marginTop: 5,
                        width: '95%',
                        height: '34%',
                    }}
                >
                    <View
                        style={{
                            width: '45%',
                        }}
                    >
                        <Image
                            source={NoGoal}
                            style={{
                                height: 130,
                                width: '100%',
                                resizeMode: 'contain',
                                marginHorizontal: -5,
                            }}
                        />
                    </View>
                    <View
                        style={{
                            width: '55%',
                            marginTop: 20,
                            marginHorizontal: 2,
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: text.FONT_FAMILY.BOLD,
                                fontSize: 17,
                                color: color.TEXT_COLOR.DARK,
                                fontWeight: 'bold',
                                letterSpacing: text.LETTER_SPACING.WIDE,
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
                            Set some new goals so your friends can delight in
                            helping you!
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
})(NoGoalToast)
