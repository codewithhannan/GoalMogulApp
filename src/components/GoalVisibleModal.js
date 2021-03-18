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

import GoalVisible from '../asset/image/Goal_Visible.png'

const { text: textStyle, button: buttonStyle } = OnboardingStyles

class ModalTester extends Component {
    constructor(props) {
        super(props)
        this.state = { isModalVisible: false }
    }

    toggleModal = () => {
        this.setState({ isModalVisible: true })
    }
    newToggleModal = () => {
        this.setState({ isModalVisible: false })
    }

    renderNoButton() {
        return (
            <>
                <TouchableWithoutFeedback
                    onPress={() => this.props.closeModal()}
                >
                    <View
                        style={{
                            width: '30%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 40,
                            borderColor: '#42C0F5',
                            borderWidth: 2,
                            borderRadius: 3,
                        }}
                    >
                        <Text
                            style={{
                                color: '#42C0F5',

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

    renderPublicButton() {
        return (
            <>
                <TouchableWithoutFeedback
                    onPress={() => this.props.handleYes()}
                >
                    <View
                        style={{
                            backgroundColor: '#42C0F5',
                            width: '60%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 40,
                            borderColor: '#42C0F5',
                            borderWidth: 2,
                            borderRadius: 3,
                        }}
                    >
                        <Text
                            style={{
                                color: 'white',

                                fontSize: 15,
                            }}
                        >
                            Yes, make it public
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            </>
        )
    }

    render() {
        return (
            <>
                <Modal
                    backdropOpacity={0.5}
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
                                    Goal Visibility
                                </Text>
                                <TouchableOpacity
                                    onPress={() => this.props.handleClose()}
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
                                        height: 160,
                                        width: '100%',
                                        resizeMode: 'contain',
                                    }}
                                />
                            </View>
                            <View
                                style={{
                                    // justifyContent: 'center',
                                    // alignItems: 'center',
                                    marginHorizontal: 15,
                                    width: '90%',
                                }}
                            >
                                <View
                                    style={{
                                        marginTop: 8,
                                        // marginHorizontal: 5,
                                        width: '100%',
                                    }}
                                >
                                    <Text
                                        style={{
                                            ...default_style.subTitleText_1,
                                            texAlign: 'center',
                                        }}
                                    >
                                        We strongly suggest making your 1st goal
                                        visible to Friends.
                                    </Text>
                                </View>

                                <View
                                    style={{
                                        marginTop: 8,

                                        width: '100%',
                                    }}
                                >
                                    <Text
                                        style={{
                                            ...default_style.subTitleText_1,
                                            texAlign: 'center',
                                        }}
                                    >
                                        Otherwise, your Friends will see an
                                        empty page when viewing your goals.
                                    </Text>
                                </View>

                                <View
                                    style={{
                                        marginTop: 8,

                                        width: '100%',
                                    }}
                                >
                                    <Text
                                        style={{
                                            ...default_style.subTitleText_1,
                                            texAlign: 'center',
                                        }}
                                    >
                                        Do you want to make this goal visible to
                                        Friends?
                                    </Text>
                                </View>
                            </View>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginTop: 10,
                                    padding: 15,
                                }}
                            >
                                {this.renderNoButton()}
                                {this.renderPublicButton()}
                            </View>
                        </View>
                    </View>
                </Modal>
            </>
        )
    }
}

export default ModalTester
