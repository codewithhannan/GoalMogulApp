/** @format */

import React, { Component } from 'react'
import {
    Button,
    Text,
    View,
    Image,
    TouchableWithoutFeedback,
    TouchableOpacity,
    TouchableHighlight,
    Dimensions,
} from 'react-native'
import Modal from 'react-native-modal'

import { Entypo } from '@expo/vector-icons'

import { color, default_style } from '../styles/basic'

import { addNudge, NUDGE_TYPES } from '../actions/NudgeActions'

import { connect } from 'react-redux'

import { getUserData } from '../redux/modules/User/Selector'

import NoGoalPromptImage from '../asset/image/NoGoalPrompt.png'
import NoGoalPromptQuestions from './NoGoalPromptQuestions'
import DelayedButton from '../Main/Common/Button/DelayedButton'

const MODAL_WIDTH = Dimensions.get('window').width
const MODAL_HEIGHT = Dimensions.get('window').height

class NoGoalPrompt extends Component {
    constructor(props) {
        super(props)

        this.state = {
            imageUrl: undefined,
            randomQuestions: [
                "What's a goal you'd be more likely to achieve if your friends held you accountable?",
                'What exciting achievement would you throw a party to celebrate?',
                'What life experience can make you feel truly alive?',
                'What future travel experience would you be excited to have with your friends?',
                'With more time and energy, what fun activity would you want to do with friends?',
                'What goal can you achieve together with your friends?',
                'What relaxing activity could you start to plan so that you can see your friends more often?',
                `What's an interesting class or course you could enjoy taking with friends?`,
                'What do you need to pursue to feel like you are living your HIGHEST PURPOSE?',
                'If you had a few extra hours every week, how would you want to spend the additional time with your family or friends?',
                'What do you regret not doing last year that you still want to do?',
            ],
        }
    }

    async componentDidMount() {
        const randomQuestions = this.state.randomQuestions.sort(
            () => Math.random() - 0.5
        )

        this.setState({ randomQuestions })
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {}

    render() {
        const { image } = this.props

        // let ImageSource = { currentImage: require(image) }
        // console.log('IMAFGE SOURCE', ImageSource)
        return (
            <>
                <Modal backdropOpacity={0.8} isVisible={true}>
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <View
                            style={{
                                width: MODAL_WIDTH * 0.9,

                                backgroundColor: color.GV_MODAL,
                                height: MODAL_HEIGHT * 0.55,
                                backgroundColor: '#FAFAFA',
                                borderRadius: 5,
                            }}
                        >
                            <Entypo
                                name="cross"
                                size={22}
                                color="#4F4F4F"
                                style={{
                                    position: 'absolute',
                                    right: 9,
                                    top: 9,
                                }}
                            />
                            <Text
                                style={{
                                    fontSize: 18,
                                    padding: 20,
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    fontFamily: 'SFProDisplay-Bold',
                                }}
                            >
                                Help Shunsuke achieve more!
                            </Text>

                            <Image
                                source={NoGoalPromptImage}
                                resizeMode="contain"
                                style={{
                                    height: 179,
                                    width: 340,
                                    position: 'absolute',
                                    top: 76,
                                    left: 20,
                                }}
                            />
                            <Text
                                style={{
                                    fontSize: 16,

                                    fontWeight: 'normal',
                                    fontFamily: 'SFProDisplay-Regular',
                                    position: 'absolute',
                                    top: 271,
                                    width: 295,
                                    left: 30,
                                    lineHeight: 24,
                                    color: '#333333',
                                }}
                            >
                                Ask Shunshuke a question that can inspire him to
                                set his first goal.
                            </Text>

                            <NoGoalPromptQuestions
                                randomQuestions={this.state.randomQuestions}
                            />
                            <DelayedButton
                                activeOpacity={0.6}
                                onPress={() =>
                                    addNudge(
                                        visitedUser,
                                        token,
                                        NUDGE_TYPES.createFirstGoal
                                    )
                                }
                                style={{
                                    height: 35,
                                    width: 171,
                                    backgroundColor: color.GM_BLUE,
                                    borderRadius: 3,
                                    alignItems: 'center',
                                    justifyContent: 'center',

                                    position: 'aboslute',
                                    top: 380,
                                    alignSelf: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        color: 'white',
                                        fontSize: 14,
                                        fontWeight: '600',
                                        lineHeight: 14,
                                        fontFamily: 'SFProDisplay-Semibold',
                                    }}
                                >
                                    Comfirm
                                </Text>
                            </DelayedButton>
                        </View>
                    </View>
                </Modal>
            </>
        )
    }
}

const mapStateToProps = (state, props) => {
    const visitedUser = state.profile.userId.userId
    const { token } = state.auth.user
    const { profile } = state.profile.user
    const { userId } = props

    const userObject = getUserData(state, userId, '')
    const { user } = userObject

    return {
        visitedUser,
        token,

        user,
    }
}

export default connect(mapStateToProps, {
    addNudge,
})(NoGoalPrompt)
