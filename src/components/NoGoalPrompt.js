/** @format */

import React, { Component } from 'react'
import {
    Button,
    Text,
    View,
    Image,
    TouchableOpacity,
    Dimensions,
} from 'react-native'
import Modal from 'react-native-modal'

import { Entypo } from '@expo/vector-icons'

import { color } from '../styles/basic'

import { addNudge, NUDGE_TYPES } from '../actions/NudgeActions'
import YES_LOTTIE from '../asset/toast_popup_lotties/yes-button/yes_button.json'

import { connect } from 'react-redux'

import { getUserData } from '../redux/modules/User/Selector'
import Carousel from 'react-native-snap-carousel' // Version can be specified in package.json

import DelayedButton from '../Main/Common/Button/DelayedButton'
import LottieView from 'lottie-react-native'
import NO_GOAL_LOTTIE from '../asset/toast_popup_lotties/ask_question/ask_question.json'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'

const MODAL_WIDTH = Dimensions.get('window').width
const MODAL_HEIGHT = Dimensions.get('window').height

const SLIDER_WIDTH = Dimensions.get('window').width
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7)

class NoGoalPrompt extends Component {
    constructor(props) {
        super(props)

        this._renderItem = this._renderItem.bind(this)

        this.state = {
            imageUrl: undefined,
            currentPage: '',
            activeIndex: 0,
            selected: '',
            selectedText: '',
            randomQuestions: [
                {
                    id: 1,
                    title:
                        "What's a goal you'd be more likely to achieve if your friends held you accountable?",
                },

                {
                    id: 2,
                    title:
                        'What exciting achievement would you throw a party to celebrate?',
                },

                {
                    id: 3,
                    title:
                        'What life experience can make you feel truly alive?',
                },

                {
                    id: 4,

                    title:
                        'What future travel experience would you be excited to have with your friends?',
                },
                {
                    id: 5,
                    title:
                        'With more time and energy, what fun activity would you want to do with friends?',
                },

                {
                    id: 6,

                    title:
                        'What goal can you achieve together with your friends?',
                },

                {
                    id: 7,
                    title:
                        'What relaxing activity could you start to plan so that you can see your friends more often?',
                },

                {
                    id: 8,
                    title: `What's an interesting class or course you could enjoy taking with friends?`,
                },

                {
                    id: 9,
                    title:
                        'What do you need to pursue to feel like you are living your HIGHEST PURPOSE?',
                },

                {
                    id: 10,
                    title:
                        'If you had a few extra hours every week, how would you want to spend the additional time with your family or friends?',
                },

                {
                    id: 11,
                    title:
                        'What do you regret not doing last year that you still want to do?',
                },
            ],
        }
    }

    async componentDidMount() {
        const randomQuestions = this.state.randomQuestions.sort(
            () => Math.random() - 0.5
        )
        this.setState({ randomQuestions })
    }

    changeColor = (index, id) => {
        this.setState({ activeIndex: index, selected: id })
    }

    _renderItem({ item, index }) {
        return (
            <View
                style={{
                    backgroundColor:
                        this.state.selected == index
                            ? color.GM_BLUE_LIGHT_LIGHT
                            : '#E7E7E7',
                    borderRadius: 5,
                    height: 80,
                    width: ITEM_WIDTH * 1.109,

                    marginLeft: 30,
                    flex: 1,
                    justifyContent: 'center',
                }}
            >
                <Text
                    style={{
                        fontSize: 16,
                        color: '#333333',
                        fontWeight: 'normal',
                        lineHeight: 18,
                        width: ITEM_WIDTH * 1.035,
                        position: 'absolute',
                        left: 16,

                        fontFamily: 'SFProDisplay-Regular',
                    }}
                >
                    {item.title}
                </Text>
            </View>
        )
    }

    render() {
        const { name, visitedUser, token, isVisible } = this.props
        return (
            <>
                <Modal
                    backdropOpacity={0.8}
                    isVisible={isVisible}
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
                                width: MODAL_WIDTH * 0.9,
                                height: 430,

                                backgroundColor: color.GV_MODAL,

                                backgroundColor: '#FAFAFA',
                                borderRadius: 5,
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.onClose()
                                }}
                                style={{
                                    alignSelf: 'flex-end',
                                    right: 10,
                                    top: 9,
                                }}
                            >
                                <Entypo
                                    name="cross"
                                    size={22}
                                    color="#4F4F4F"
                                />
                            </TouchableOpacity>

                            <Text
                                style={{
                                    fontSize: 18,
                                    // padding: 20,

                                    fontWeight: 'bold',
                                    fontFamily: 'SFProDisplay-Bold',
                                    // position: 'absolute',
                                    // top: 5,

                                    alignSelf: 'center',
                                }}
                            >
                                Help {name} achieve more!
                            </Text>

                            {/* <Image
                                source={NoGoalPromptImage}
                                resizeMode="contain"
                                style={{
                                    height: 179,
                                    width: 340,
                                    position: 'absolute',
                                    top: 76,
                                    left: 20,
                                }}
                            /> */}
                            <View style={{ marginTop: 12 }}>
                                <LottieView
                                    style={{
                                        height: 170,

                                        alignSelf: 'center',
                                    }}
                                    source={NO_GOAL_LOTTIE}
                                    autoPlay
                                    loop
                                />
                            </View>

                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: 'normal',
                                    fontFamily: 'SFProDisplay-Regular',
                                    marginHorizontal: 30,
                                    lineHeight: 24,
                                    width: '80%',
                                    color: '#333333',
                                }}
                            >
                                Ask {name} a question that can inspire them to
                                set their first goal.
                            </Text>

                            {/* <NoGoalPromptQuestions
                                carouselRef
                                snapCallback={this.onSnap}
                                randomQuestions={this.state.randomQuestions}
                            /> */}

                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    bottom: 65,
                                    position: 'absolute',
                                    width: '100%',
                                }}
                            >
                                <Carousel
                                    layout={'default'}
                                    ref={(ref) => (this.carousel = ref)}
                                    data={this.state.randomQuestions}
                                    sliderWidth={ITEM_WIDTH * 1.085}
                                    itemWidth={ITEM_WIDTH * 1.085}
                                    renderItem={this._renderItem}
                                    onSnapToItem={(index) => {
                                        this.setState({
                                            selectedText: this.state
                                                .randomQuestions[index].title,
                                        })
                                        this.changeColor(index, index)
                                    }}
                                    useScrollView
                                    initialScrollIndex={0}
                                    activeSlideOffset={0}
                                    hasParallaxImages={true}
                                />
                            </View>

                            <DelayedButton
                                activeOpacity={0.6}
                                onPress={() => {
                                    let questionToSend =
                                        this.state.selectedText === ''
                                            ? this.state.randomQuestions[0]
                                                  .title
                                            : this.state.selectedText

                                    this.props.addNudge(
                                        visitedUser,
                                        token,
                                        NUDGE_TYPES.inviteeGoalCheck,
                                        questionToSend
                                    )
                                    this.props.onClose()
                                }}
                                style={{
                                    height: 35,
                                    width: 171,
                                    backgroundColor: color.GM_BLUE,
                                    borderRadius: 3,
                                    alignItems: 'center',
                                    justifyContent: 'center',

                                    // position: 'absolute',
                                    top: 100,
                                    alignSelf: 'center',
                                }}
                            >
                                {/* <View
                                    style={{
                                        borderRadius: 3,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'aboslute',
                                        top: 110,
                                        alignSelf: 'center',
                                    }}
                                >
                                    <Text
                                        style={{
                                            position: 'absolute',
                                            zIndex: 1,
                                            padding: 10,
                                            alignSelf: 'center',
                                            marginTop: 4,
                                            color: 'white',
                                            fontFamily: 'SFProDisplay-Semibold',
                                        }}
                                    >
                                        Confirm
                                    </Text>
                                    <LottieView
                                        style={{
                                            height: hp(5),
                                            width: 1000,
                                        }}
                                        source={YES_LOTTIE}
                                        autoPlay
                                        loop
                                    />
                                </View> */}
                                <Text
                                    style={{
                                        color: 'white',
                                        fontSize: 14,
                                        fontWeight: '600',
                                        lineHeight: 14,
                                        fontFamily: 'SFProDisplay-Semibold',
                                    }}
                                >
                                    Confirm
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
