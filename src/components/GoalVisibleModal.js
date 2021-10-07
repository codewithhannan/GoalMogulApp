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
import LottieView from 'lottie-react-native'
import PRIVATE_GOAL_LOTTIE from '../asset/toast_popup_lotties/Goal-visibility/Goal-visibilty.json'
import YES_LOTTIE from '../asset/toast_popup_lotties/yes-button/yes_button.json'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import GoalVisible from '../asset/image/Goal_Visible.png'

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
                            width: 85,
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 35,
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
                            justifyContent: 'center',
                            alignItems: 'center',
                            bottom: 3,
                        }}
                    >
                        <Text
                            style={{
                                position: 'absolute',
                                zIndex: 1,
                                padding: 10,

                                alignSelf: 'center',
                                color: 'white',
                                fontFamily: 'SFProDisplay-Semibold',
                            }}
                        >
                            Yes
                        </Text>
                        <LottieView
                            style={{ height: 40 }}
                            source={YES_LOTTIE}
                            autoPlay
                            loop
                        />
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
                    animationIn="zoomInUp"
                    animationInTiming={400}
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

                                borderRadius: 8,
                                backgroundColor: color.GM_BACKGROUND,
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
                                        fontFamily: 'SFProDisplay-Bold',
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
                                    style={{ bottom: 3 }}
                                >
                                    <Entypo
                                        name="cross"
                                        size={27}
                                        color="#4F4F4F"
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* <Image
                                    source={GoalVisible}
                                    style={{
                                        height: 170,
                                        width: '100%',
                                        resizeMode: 'contain',
                                    }}
                                /> */}
                            <View style={{ alignSelf: 'center' }}>
                                <LottieView
                                    style={{ height: 190 }}
                                    source={PRIVATE_GOAL_LOTTIE}
                                    autoPlay
                                    loop
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
                                        fontFamily: 'SFProDisplay-Regular',
                                        fontSize: 17,
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
                                        fontFamily: 'SFProDisplay-Semibold',
                                        fontSize: 17,
                                        lineHeight: 24,
                                        marginTop: 20,

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
