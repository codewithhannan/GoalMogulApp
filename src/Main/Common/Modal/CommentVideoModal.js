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
    TextInput,
    ActivityIndicator,
} from 'react-native'

import Modal from 'react-native-modal'
import { Icon } from '@ui-kitten/components'
import { Entypo } from '@expo/vector-icons'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import { connect } from 'react-redux'
import { color, text } from '../../../styles/basic'
import OnboardingStyles from '../../../styles/Onboarding'
import VideoPlayer from 'expo-video-player'
import { Video } from 'expo-av'
import { GOALS_STYLE } from '../../../styles/Goal'
import DelayedButton from '../Button/DelayedButton'
import { backToInitialState } from '../../../reducers/ProfileGoalSwipeReducer'
import { sendVideoMessage } from '../../../redux/modules/feed/comment/CommentActions'
import { openGoalDetail } from '../../../redux/modules/home/mastermind/actions'

const { text: textStyle, button: buttonStyle } = OnboardingStyles

const MODAL_WIDTH = Dimensions.get('screen').width
const MODAL_HEIGHT = Dimensions.get('screen').height

const privacyOptions = [
    {
        id: 1,
        text: 'Public',
        title: 'Public',
        iconName: 'earth',
        value: 'public',
    },
    {
        id: 2,
        text: 'Only Me',
        title: 'Private',
        iconName: 'lock',
        value: 'self',
    },
]

class CommentVideoModal extends Component {
    constructor(props) {
        super(props)

        this.state = {
            video: '',
            status: {},
            videoName: '',
            selected: '',
            isLoading: true,
            loadingModal: false,
            loading: false,
        }
    }

    async componentDidMount() {}

    async componentDidUpdate(prevProps, prevState) {}

    changeColor = (id) => {
        this.setState({ selected: id })
    }

    render() {
        const { videoUri, pageId, goalDetail } = this.props

        return (
            <>
                <Modal
                    isVisible={this.props.isVisible}
                    animationIn="slideInUp"
                    onSwipeComplete={() => {
                        this.props.onClose()
                        this.props.backToInitialState()
                    }}
                    swipeDirection="down"
                    animationInTiming={400}
                    // coverScreen={true}
                >
                    {this.state.loading ? (
                        <View
                            style={{
                                // flex: 1,
                                // alignItems: 'center',
                                // justifyContent: 'center',
                                // zIndex: 5,
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            }}
                        >
                            <ActivityIndicator
                                animating
                                size="large"
                                color="white"
                                style={{
                                    zIndex: 5,
                                    top: '45%',
                                    position: 'absolute',
                                    alignSelf: 'center',
                                }}
                            />
                        </View>
                    ) : (
                        <View
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                // justifyContent: 'center',
                            }}
                        >
                            <View
                                style={{
                                    width: wp('100%'),

                                    backgroundColor: color.GV_MODAL,
                                    // height: hp('50%'),
                                    borderRadius: 5,
                                    position: 'absolute',
                                    bottom: 0,
                                }}
                            >
                                <View
                                    style={{
                                        marginVertical: 5,
                                        width: 35,
                                        height: 3.5,
                                        borderRadius: 5,
                                        alignSelf: 'center',
                                        backgroundColor: 'lightgray',
                                    }}
                                />
                                <View
                                    style={{
                                        padding: 13,
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.props.onClose()
                                            this.props.backToInitialState()
                                        }}
                                        style={{
                                            position: 'absolute',
                                            right: 10,
                                            top: 10,
                                        }}
                                    >
                                        <Entypo
                                            name="cross"
                                            size={25}
                                            color="#4F4F4F"
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}
                                >
                                    {privacyOptions.map((options, index) => {
                                        return (
                                            <TouchableOpacity
                                                key={Math.random()
                                                    .toString(36)
                                                    .substr(2, 9)}
                                                onPress={() => {
                                                    this.changeColor(options.id)
                                                }}
                                                disabled={
                                                    this.state.selected ===
                                                    options.id
                                                }
                                            >
                                                <View
                                                    style={[
                                                        GOALS_STYLE.commonPillContainer,
                                                        {
                                                            height: 35,
                                                            borderColor:
                                                                '#828282',
                                                            borderWidth:
                                                                this.state
                                                                    .selected ===
                                                                options.id
                                                                    ? 0.3
                                                                    : 0.23,
                                                            left: 10,
                                                            width: 80,
                                                            marginHorizontal: 3,
                                                            backgroundColor:
                                                                'white',
                                                        },
                                                    ]}
                                                >
                                                    <Icon
                                                        pack="material-community"
                                                        name={options.iconName}
                                                        style={{
                                                            height: 12,
                                                            width: 12,
                                                            tintColor:
                                                                '#828282',
                                                            opacity:
                                                                this.state
                                                                    .selected ===
                                                                options.id
                                                                    ? 1
                                                                    : 0.3,
                                                        }}
                                                    />

                                                    <Text
                                                        style={{
                                                            fontFamily:
                                                                text.FONT_FAMILY
                                                                    .SEMI_BOLD,
                                                            fontSize: 14,
                                                            color: '#828282',
                                                            marginLeft: 5,
                                                            opacity:
                                                                this.state
                                                                    .selected ===
                                                                options.id
                                                                    ? 1
                                                                    : 0.3,
                                                        }}
                                                    >
                                                        {options.title}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    })}
                                </View>
                                <View
                                    style={
                                        {
                                            // marginTop: 10,
                                        }
                                    }
                                >
                                    <Text
                                        style={{
                                            padding: 5,
                                            marginHorizontal: 12,
                                            color: '#333333',
                                            fontWeight: 'bold',
                                            fontSize: 14,
                                        }}
                                    >
                                        Video name:
                                    </Text>
                                    <TextInput
                                        style={{
                                            width: '92%',
                                            height: 34,
                                            borderColor: 'black',
                                            borderWidth: 1,
                                            alignSelf: 'center',
                                            padding: 5,
                                            borderRadius: 3,
                                            borderColor: '#828282',
                                        }}
                                        placeholder="Video name"
                                        onChangeText={(value) =>
                                            this.setState({ videoName: value })
                                        }
                                    />
                                </View>
                                <View
                                    style={{
                                        marginTop: 15,
                                        alignItems: 'center',
                                    }}
                                >
                                    <VideoPlayer
                                        videoProps={{
                                            shouldPlay: true,
                                            resizeMode: Video.RESIZE_MODE_COVER,
                                            source: {
                                                uri: videoUri,
                                            },
                                        }}
                                        style={{
                                            // videoBackgroundColor: 'transparent',
                                            // controlsBackgroundColor: 'transparent',
                                            height: hp('40%'),
                                            width: wp('100%'),
                                        }}
                                        fullscreen={{
                                            visible: false,
                                        }}
                                        activityIndicator={{
                                            color: color.GM_BLUE,
                                            size: 'large',
                                        }}
                                    />
                                </View>

                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        marginBottom: 15,
                                    }}
                                >
                                    <DelayedButton
                                        style={[
                                            buttonStyle.GM_WHITE_BG_BLUE_TEXT
                                                .containerStyle,
                                            ,
                                            {
                                                width: wp('45%'),
                                                marginTop: 20,
                                                backgroundColor:
                                                    'rgba(66, 192, 245, 0.22)',
                                                borderColor:
                                                    'rgba(66, 192, 245, 0.22)',
                                                height: 45,
                                            },
                                        ]}
                                        onPress={() => {
                                            this.props.onClose()
                                            setTimeout(() => {
                                                this.props.onRecordPress()
                                            }, 500)
                                        }}
                                    >
                                        <Text
                                            style={[
                                                buttonStyle
                                                    .GM_WHITE_BG_GRAY_TEXT
                                                    .textStyle,
                                                { color: '#535353' },
                                            ]}
                                        >
                                            Record
                                        </Text>
                                    </DelayedButton>
                                    <View style={{ width: 10 }} />
                                    <DelayedButton
                                        style={[
                                            buttonStyle
                                                .GM_BLUE_BG_WHITE_BOLD_TEXT
                                                .containerStyle,
                                            ,
                                            {
                                                width: wp('45%'),
                                                marginTop: 20,
                                                height: 45,
                                            },
                                        ]}
                                        onPress={() => {
                                            this.setState({ loading: true })

                                            this.props.sendVideoMessage(
                                                videoUri,
                                                this.state.videoName,
                                                pageId,
                                                goalDetail.goalRef._id,
                                                () => {
                                                    this.props.onClose()
                                                    this.setState({
                                                        loading: false,
                                                    })
                                                    this.props.openGoalDetail(
                                                        goalDetail.goalRef,
                                                        {
                                                            focusType:
                                                                'comment',
                                                            initialShowSuggestionModal: false,
                                                            initialFocusCommentBox: false,
                                                        }
                                                    )
                                                }
                                            )
                                        }}
                                    >
                                        <Text
                                            style={[
                                                buttonStyle
                                                    .GM_BLUE_BG_WHITE_BOLD_TEXT
                                                    .textStyle,
                                            ]}
                                        >
                                            Send
                                        </Text>
                                    </DelayedButton>
                                </View>
                            </View>
                        </View>
                    )}
                </Modal>
            </>
        )
    }
}

const mapStateToProps = (state, props) => {
    const { goalSwiper } = state
    const { videoUri } = goalSwiper

    return {
        videoUri,
    }
}

export default connect(mapStateToProps, {
    backToInitialState,
    sendVideoMessage,
    openGoalDetail,
})(CommentVideoModal)
