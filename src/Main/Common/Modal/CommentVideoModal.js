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
} from 'react-native'

import Modal from 'react-native-modal'
import { Icon } from '@ui-kitten/components'
import { Entypo } from '@expo/vector-icons'

import { connect } from 'react-redux'
import { color, text } from '../../../styles/basic'
import OnboardingStyles from '../../../styles/Onboarding'
import VideoPlayer from 'expo-video-player'
import { Video } from 'expo-av'
import { GOALS_STYLE } from '../../../styles/Goal'
import DelayedButton from '../Button/DelayedButton'
import { backToInitialState } from '../../../reducers/ProfileGoalSwipeReducer'

const { text: textStyle, button: buttonStyle } = OnboardingStyles

const MODAL_WIDTH = Dimensions.get('screen').width
const MODAL_HEIGHT = Dimensions.get('screen').height

const privacyOptions = [
    // {
    //     text: 'Friends',
    //     title: 'Friends',
    //     iconName: 'account-multiple',
    //     value: 'friends',
    // },
    // {
    //     text: 'Close Friends',
    //     title: 'Close Friends',
    //     iconName: 'heart',
    //     value: 'close-friends',
    // },
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
            selected: '',
            isLoading: true,
        }
    }

    async componentDidMount() {}

    async componentDidUpdate(prevProps, prevState) {}

    changeColor = (id) => {
        this.setState({ selected: id })
    }

    render() {
        const { videoUri } = this.props

        return (
            <>
                <Modal
                    isVisible={this.props.isVisible}
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

                                backgroundColor: color.GV_MODAL,
                                height: MODAL_HEIGHT * 0.5,
                                borderRadius: 5,
                            }}
                        >
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
                                        <>
                                            <TouchableOpacity
                                                key={options.title + index}
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
                                                                    ? 0.23
                                                                    : 0.3,
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
                                                                    ? 0.3
                                                                    : 1,
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
                                                                    ? 0.3
                                                                    : 1,
                                                        }}
                                                    >
                                                        {options.title}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        </>
                                    )
                                })}
                            </View>
                            <View
                                style={{
                                    marginTop: 10,
                                }}
                            >
                                <Text
                                    style={{
                                        padding: 5,
                                        marginHorizontal: 5,
                                        color: '#333333',
                                        fontSize: 12,
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
                                />
                            </View>
                            <View
                                style={{
                                    marginTop: 15,
                                }}
                            >
                                {/* <Video
                                    ref={this.state.video}
                                    source={{
                                        uri:
                                            'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
                                        'file:///var/mobile/Containers/Data/Application/DB0E429C-1C64-4902-A008-74081503A97A/Library/Caches/ExponentExperienceData/%2540abdulhannan96%252Fgoalmogul/ImagePicker/113BBD27-8D9F-4444-B929-12053F3ED6C7.mov',
                                    }}
                                    style={{
                                        height: MODAL_HEIGHT * 0.3,
                                        width: MODAL_WIDTH * 0.83,
                                        borderRadius: 5,
                                        alignSelf: 'center',
                                    }}
                                    resizeMode="contain"
                                    onPlaybackStatusUpdate={(status) =>
                                        this.setState({ status })
                                    }
                                    shouldPlay
                                    shouldCorrectPitch
                                    shouldRasterizeIOS
                                /> */}

                                <VideoPlayer
                                    videoProps={{
                                        shouldPlay: true,
                                        resizeMode: Video.RESIZE_MODE_CONTAIN,
                                        source: {
                                            uri: videoUri,
                                        },
                                    }}
                                    style={{
                                        // videoBackgroundColor: 'transparent',
                                        // controlsBackgroundColor: 'transparent',
                                        height: 200,
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
                                            width: 110,
                                            marginTop: 20,
                                            backgroundColor:
                                                'rgba(66, 192, 245, 0.22)',
                                            borderColor:
                                                'rgba(66, 192, 245, 0.22)',
                                            height: 40,
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
                                            buttonStyle.GM_WHITE_BG_GRAY_TEXT
                                                .textStyle,
                                            { color: '#535353' },
                                        ]}
                                    >
                                        Record
                                    </Text>
                                </DelayedButton>
                                <View style={{ width: 20 }} />
                                <DelayedButton
                                    style={[
                                        buttonStyle.GM_BLUE_BG_WHITE_BOLD_TEXT
                                            .containerStyle,
                                        ,
                                        {
                                            width: 110,
                                            marginTop: 20,
                                            height: 40,
                                        },
                                    ]}
                                    // onPress={}
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
})(CommentVideoModal)
