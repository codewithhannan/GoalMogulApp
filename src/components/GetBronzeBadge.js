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
import { color, default_style } from '../styles/basic'
import BronzeBadge from '../asset/image/Bronze_Badge.png'
import InviteFriendModal from '../Main/MeetTab/Modal/InviteFriendModal'

// import * as text from '../styles/basic/text'
import { connect } from 'react-redux'
const ITEM_WIDTH = Dimensions.get('window').width
const ITEM_HEIGHT = Dimensions.get('window').height

class GetBronzeBadge extends Component {
    constructor(props) {
        super(props)

        this.state = {
            showInviteFriendModal: false,
        }

        // this.handleEditOnPressed = this.handleEditOnPressed.bind(this)
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
                        // marginBottom: 10,
                        // width: 373,
                        height: 162,

                        borderRadius: 8,

                        // marginTop: 7,
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
                                    item.mainHeading.marginTop != undefined &&
                                    item.mainHeading.marginTop,
                            }}
                        >
                            {item.mainHeading.title}
                        </Text>

                        {item.smallHeading != undefined ? (
                            <Text
                                style={{
                                    fontFamily: 'SFProDisplay-Regular',
                                    // fontWeight: '700',
                                    fontSize: item.smallHeading.fontSize,
                                    lineHeight: item.smallHeading.lineheight,
                                    marginTop:
                                        item.smallHeading.marginTop !=
                                            undefined &&
                                        item.smallHeading.marginTop,
                                }}
                            >
                                {item.smallHeading.title}
                            </Text>
                        ) : null}
                        {item.thirdText != undefined ? (
                            <Text
                                style={{
                                    fontFamily: 'SFProDisplay-Regular',
                                    // fontWeight: '700',
                                    fontSize: 15,
                                    lineHeight: 18,
                                }}
                            >
                                You only need 6 more friends with Bronze Badges
                                to earn your Gold Badge.
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

export default connect(mapStateToProps, null)(GetBronzeBadge)
