/** @format */

import React, { Component } from 'react'
import {
    Button,
    Text,
    View,
    Image,
    TouchableWithoutFeedback,
    TouchableOpacity,
} from 'react-native'
import Modal from 'react-native-modal'
import { Entypo } from '@expo/vector-icons'
import Constants from 'expo-constants'
import { color, default_style } from '../styles/basic'
import OnboardingStyles from '../styles/Onboarding'

import GoalVisible from '../asset/image/Goalmogul_illustration.png'

const { text: textStyle, button: buttonStyle } = OnboardingStyles

class ModalTester extends Component {
    constructor(props) {
        super(props)
    }

    renderYesButton() {
        return (
            <>
                <TouchableWithoutFeedback>
                    <View
                        style={{
                            width: '30%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 40,
                            borderColor: '#42C0F5',
                            borderWidth: 2,
                            borderRadius: 3,
                            right: 10,
                        }}
                    >
                        <Text
                            style={{
                                color: '#42C0F5',
                                fontWeight: 600,
                                fontSize: 15,
                            }}
                        >
                            Yes
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            </>
        )
    }

    renderNoButton() {
        return (
            <>
                <TouchableWithoutFeedback onPress={this.props.onClose}>
                    <View
                        style={{
                            backgroundColor: '#42C0F5',
                            width: '30%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 40,
                            borderColor: '#42C0F5',
                            borderWidth: 2,
                            borderRadius: 3,
                            left: 20,
                        }}
                    >
                        <Text
                            style={{
                                color: 'white',
                                fontWeight: 600,
                                fontSize: 15,
                            }}
                        >
                            No
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            </>
        )
    }

    render() {
        const { name } = this.props

        return (
            <>
                <Modal
                    backdropOpacity={0}
                    isVisible={this.props.isVisible}
                    style={{
                        borderRadius: 20,
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <View
                            style={{
                                // height: '0%',
                                width: '100%',
                                backgroundColor: 'green',
                                borderRadius: 8,
                                backgroundColor: color.GV_MODAL,
                                height: 350,
                            }}
                        >
                            <View
                                style={{
                                    margin: 15,

                                    justifyContent: 'space-between',
                                    flexDirection: 'row',
                                }}
                            >
                                <Text style={{ ...default_style.titleText_1 }}>
                                    Help {name}
                                </Text>
                                <TouchableOpacity
                                    onPress={this.props.onClose}
                                    style={{ marginTop: -2 }}
                                >
                                    <Entypo
                                        name="cross"
                                        size={27}
                                        color="#4F4F4F"
                                    />
                                </TouchableOpacity>
                            </View>
                            <View
                                style={{
                                    width: '100%',
                                }}
                            >
                                <Image
                                    source={GoalVisible}
                                    style={{
                                        height: 140,
                                        width: '100%',
                                        resizeMode: 'contain',
                                    }}
                                />
                            </View>

                            <View
                                style={{
                                    marginTop: 8,

                                    alignItems: 'center',
                                    marginRight: 10,
                                }}
                            >
                                <Text
                                    style={{
                                        fontWeight: 40,
                                        fontSize: 15,
                                    }}
                                >
                                    Your friend {name} has not set any goals
                                    yet.
                                </Text>
                            </View>

                            <View
                                style={{
                                    marginTop: 8,
                                    width: '90%',
                                    alignItems: 'center',
                                    marginHorizontal: 10,
                                }}
                            >
                                <Text style={{ fontWeight: 40, fontSize: 15 }}>
                                    Do you want to nudge him?
                                </Text>
                            </View>

                            <View
                                style={{
                                    marginTop: 8,
                                    width: '90%',
                                    alignItems: 'center',
                                    marginHorizontal: 3,
                                }}
                            ></View>

                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'space-evenly',
                                    // marginTop: 20,
                                    margin: 20,
                                    // paddingleft: 10,
                                    // padding: 15,
                                    // marginLeft: 20,
                                }}
                            >
                                {this.renderNoButton()}
                                {this.renderYesButton()}
                            </View>
                        </View>
                    </View>
                </Modal>
            </>
        )
    }
}

export default ModalTester
