/** @format */

import React, { Component } from 'react'
import {
    View,
    Image,
    Text,
    TouchableWithoutFeedback,
    Dimensions,
    ImageBackground,
} from 'react-native'
import { color } from '../styles/basic'
import { connect } from 'react-redux'

class ToastCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showInviteFriendModal: false,
        }
    }

    renderButtons(item) {
        return (
            <>
                <TouchableWithoutFeedback onPress={item.handleButtonPress}>
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
                            marginTop: item.marginButtonTop,
                        }}
                    >
                        <Text
                            style={{
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: 14,
                            }}
                        >
                            {item.buttonText}
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            </>
        )
    }

    render() {
        const { item } = this.props

        return (
            <>
                <View
                    style={{
                        backgroundColor: color.PG_BACKGROUND,
                        marginHorizontal: 10,
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                        paddingHorizontal: 10,
                        paddingVertical: 17,
                        height: 162,
                        // width: '100%',
                        borderRadius: 8,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            width: '35%',
                        }}
                    >
                        <ImageBackground
                            source={item.image}
                            style={{
                                height: 140,
                                width: '100%',
                            }}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={item.mainHeadingView}>
                        <Text
                            style={{
                                fontFamily: 'SFProDisplay-Bold',
                                fontWeight: '700',
                                fontSize: item.mainHeading.fontSize,
                                lineHeight: item.mainHeading.lineheight,
                                marginTop:
                                    item.mainHeading.marginTop != undefined
                                        ? item.mainHeading.marginTop
                                        : 0,
                            }}
                        >
                            {item.mainHeading.title}
                        </Text>

                        {item.smallHeading != undefined ? (
                            <Text
                                style={{
                                    fontFamily: 'SFProDisplay-Regular',
                                    fontSize: item.smallHeading.fontSize,
                                    lineHeight: item.smallHeading.lineheight,
                                    marginTop:
                                        item.smallHeading.marginTop != undefined
                                            ? item.smallHeading.marginTop
                                            : 0,
                                }}
                            >
                                {item.smallHeading.title}
                            </Text>
                        ) : null}
                        {item.thirdText != undefined ? (
                            <Text
                                style={{
                                    fontFamily: 'SFProDisplay-Regular',
                                    fontSize: 15,
                                    lineHeight: 18,
                                }}
                            >
                                {item.thirdText}
                            </Text>
                        ) : null}

                        {item.renderButton ? this.renderButtons(item) : null}
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

export default connect(mapStateToProps, null)(ToastCard)
