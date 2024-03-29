/** @format */

import React, { Component } from 'react'
import { View, Image, Text } from 'react-native'
import { color, default_style } from '../styles/basic'
import PrivateGoal from '../asset/image/NoComments.png'
import { connect } from 'react-redux'
import { getFirstName } from '../Utils/HelperMethods'

class PrivateGoalsToast extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const name = getFirstName(this.props.user.name)
        return (
            <>
                <View
                    style={{
                        backgroundColor: color.PG_BACKGROUND,

                        marginHorizontal: 20,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        // paddingHorizontal: 96,
                        paddingVertical: 10,
                        marginBottom: 10,
                        paddingRight: 10,
                        borderRadius: 6,
                        width: '90%',
                        height: '40%',
                        top: 10,
                    }}
                >
                    <View
                        style={{
                            width: '35%',
                            marginHorizontal: 10,
                        }}
                    >
                        <Image
                            source={PrivateGoal}
                            style={{
                                height: 130,
                                width: '100%',
                                left: 5,

                                resizeMode: 'contain',
                            }}
                        />
                    </View>
                    <View
                        style={{
                            width: '65%',
                            left: 1,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 17,
                                lineHeight: 19,
                                bottom: 10,

                                fontFamily: 'SFProDisplay-Bold',
                            }}
                        >
                            Help {name} to get the first comment on his goal.
                        </Text>

                        <Text
                            style={{
                                fontSize: 15,
                                lineHeight: 19,

                                fontFamily: 'SFProDisplay-Regular',
                            }}
                        >
                            Oh no! No one has commented on Shunshuke's goal yet!
                            Be the first to leave a suggestion or encouragement!
                        </Text>
                    </View>
                </View>
            </>
        )
    }
}

const mapStateToProps = (state, props) => {
    const { userId, user } = state.user

    return {
        user,
        userId,
    }
}

export default connect(mapStateToProps, {})(PrivateGoalsToast)
