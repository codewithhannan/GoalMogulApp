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
                            borderRadius: 4,
                            marginRight: 15,
                        }}
                    >
                        <Text
                            style={{
                                ...default_style.buttonText_1,
                                color: '#42C0F5',
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
                            width: '30%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 40,
                            borderColor: '#42C0F5',
                            borderWidth: 4,
                            borderRadius: 3,
                        }}
                    >
                        <Text
                            style={{
                                ...default_style.buttonText_1,
                                color: 'white',
                            }}
                        >
                            Yes
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
                                <Text
                                    style={{
                                        fontStyle: 'SFProDisplay-Bold',
                                        fontSize: 18,
                                        lineHeight: 18,
                                        fontWeight: 'bold',
                                        padding: 5,
                                    }}
                                >
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
                                    marginTop: 10,
                                }}
                            >
                                <Image
                                    source={GoalVisible}
                                    style={{
                                        height: 170,
                                        width: '100%',
                                        resizeMode: 'contain',
                                    }}
                                />
                            </View>
                            <View
                                style={
                                    {
                                        // justifyContent: 'center',
                                        // alignItems: 'center',
                                    }
                                }
                            >
                                <Text
                                    style={{
                                        fontStyle: 'SFProDisplay-Regular',
                                        fontSize: 16,
                                        lineHeight: 24,
                                        marginTop: 6,

                                        width: '90%',

                                        alignSelf: 'center',
                                    }}
                                >
                                    We strongly suggest making your first goal
                                    visible to Friends. Or else, your Friends
                                    will see a blank page.
                                </Text>

                                <Text
                                    style={{
                                        fontStyle: 'SFProDisplay-Semibold',
                                        fontSize: 16,
                                        lineHeight: 24,
                                        marginTop: 30,

                                        width: '90%',
                                        fontWeight: '500',

                                        alignSelf: 'center',
                                    }}
                                >
                                    Do you want to make this goal visible to
                                    Friends?
                                </Text>
                            </View>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
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
