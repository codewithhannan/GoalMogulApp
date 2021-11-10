/** @format */

import React, { PureComponent } from 'react'
import {
    TouchableOpacity,
    Animated,
    PanResponder,
    Dimensions,
    View,
    Text,
    Image,
    Easing,
} from 'react-native'
import { Video } from 'expo-av'
import Modal from 'react-native-modal'
// import Modal from 'react-native-modalbox'
import VideoPlayer from 'expo-video-player'
import PlayIcon from '../asset/icons/playicon.png'
import { color } from '../styles/basic'

const TRACK_SIZE = 4
const THUMB_SIZE = 20

const { width, height } = Dimensions.get('window')

export default class AudioSlider extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            playing: false,
            isVisible: false,
            currentTime: 0, // miliseconds; value interpolated by animation.
            duration: 0,
            trackLayout: {},
            dotOffset: new Animated.ValueXY(),
            xDotOffsetAtAnimationStart: 0,
        }

        // Important:
        // this.state.dotOffset.x is the actual offset
        // this.state.dotOffset.x._value is the offset from the point where the animation started
        // However, since this.state.dotOffset.x is an object and not a value, it is difficult
        // to compare it with other numbers. Therefore, the const currentOffsetX is used.
        // To print all attributes of the object see https://stackoverflow.com/questions/9209747/printing-all-the-hidden-properties-of-an-object
        this._panResponder = PanResponder.create({
            onMoveShouldSetResponderCapture: () => true,
            onMoveShouldSetPanResponderCapture: () => true,
            onPanResponderGrant: async (e, gestureState) => {
                if (this.state.playing) {
                    await this.pause()
                }
                await this.setState({
                    xDotOffsetAtAnimationStart: this.state.dotOffset.x._value,
                })
                await this.state.dotOffset.setOffset({
                    x: this.state.dotOffset.x._value,
                })
                await this.state.dotOffset.setValue({ x: 0, y: 0 })
            },
            onPanResponderMove: (e, gestureState) => {
                Animated.event([
                    null,
                    { dx: this.state.dotOffset.x, dy: this.state.dotOffset.y },
                ])(e, gestureState)
            },
            onPanResponderTerminationRequest: () => false,
            onPanResponderTerminate: async (evt, gestureState) => {
                // Another component has become the responder, so this gesture is cancelled.

                const currentOffsetX =
                    this.state.xDotOffsetAtAnimationStart +
                    this.state.dotOffset.x._value
                if (
                    currentOffsetX < 0 ||
                    currentOffsetX > this.state.trackLayout.width
                ) {
                    await this.state.dotOffset.setValue({
                        x: -this.state.xDotOffsetAtAnimationStart,
                        y: 0,
                    })
                }
                await this.state.dotOffset.flattenOffset()
                await this.mapAudioToCurrentTime()
            },
            onPanResponderRelease: async (e, { vx }) => {
                const currentOffsetX =
                    this.state.xDotOffsetAtAnimationStart +
                    this.state.dotOffset.x._value
                if (
                    currentOffsetX < 0 ||
                    currentOffsetX > this.state.trackLayout.width
                ) {
                    await this.state.dotOffset.setValue({
                        x: -this.state.xDotOffsetAtAnimationStart,
                        y: 0,
                    })
                }
                await this.state.dotOffset.flattenOffset()
                await this.mapAudioToCurrentTime()
            },
        })
    }

    mapAudioToCurrentTime = async () => {
        await this.soundObject.setPositionAsync(this.state.currentTime)
    }

    onPressPlayPause = async () => {
        if (this.state.playing) {
            await this.pause()
            return
        }
        await this.play()
    }

    play = async () => {
        await this.soundObject.playAsync()
        this.setState({ playing: true }) // This is for the play-button to go to play
        this.startMovingDot()
    }

    pause = async () => {
        await this.soundObject.pauseAsync()
        this.setState({ playing: false }) // This is for the play-button to go to pause
        Animated.timing(this.state.dotOffset).stop() // Will also call animationPausedOrStopped()
    }

    startMovingDot = async () => {
        const status = await this.soundObject.getStatusAsync()
        const durationLeft = status['durationMillis'] - status['positionMillis']

        Animated.timing(this.state.dotOffset, {
            toValue: { x: this.state.trackLayout.width, y: 0 },
            duration: durationLeft,
            easing: Easing.linear,
        }).start(() => this.animationPausedOrStopped())
    }

    animationPausedOrStopped = async () => {
        if (!this.state.playing) {
            // Audio has been paused
            return
        }
        // Animation-duration is over (reset Animation and Audio):
        await sleep(200) // In case animation has finished, but audio has not
        this.setState({ playing: false })
        await this.soundObject.pauseAsync()
        await this.state.dotOffset.setValue({ x: 0, y: 0 })
        // this.state.dotOffset.setValue(0);
        await this.soundObject.setPositionAsync(0)
    }

    measureTrack = (event) => {
        this.setState({ trackLayout: event.nativeEvent.layout }) // {x, y, width, height}
    }

    async componentDidMount() {
        this.videoObject = new Video()
        await this.videoObject.loadAsync(this.props.source)
        const status = await this.videoObject.getStatusAsync()
        this.setState({ duration: status['durationMillis'] })
    }

    componentWillUnmount() {
        const unMountAudio = async () => {
            this.videoObject && (await this.videoObject.unloadAsync())
        }
        unMountAudio()
    }

    render() {
        const { source, chatView } = this.props
        const videoRef = React.createRef(null)
        return (
            <>
                {chatView ? (
                    <View
                        style={{
                            height: 250,
                            marginVertical: 10,
                            marginLeft: 0,
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                position: 'absolute',
                                bottom: 110,
                                left: 80,
                                zIndex: 5,
                            }}
                            onPress={() => this.setState({ isVisible: true })}
                        >
                            <Image
                                source={PlayIcon}
                                resizeMode="contain"
                                style={{
                                    width: 40,
                                    height: 40,
                                }}
                            />
                        </TouchableOpacity>
                        <Video
                            ref={videoRef}
                            source={{ uri: source }}
                            style={{
                                height: 250,
                                width: 200,
                            }}
                            resizeMode="cover"
                            onPlaybackStatusUpdate={(status) =>
                                this.setState({ status })
                            }
                        />
                    </View>
                ) : (
                    <View
                        style={{
                            height: 150,
                            width: 310,
                            marginVertical: 10,
                            marginLeft: 0,
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                position: 'absolute',
                                bottom: 60,
                                left: 140,
                                zIndex: 5,
                            }}
                            onPress={() => this.setState({ isVisible: true })}
                        >
                            <Image
                                source={PlayIcon}
                                resizeMode="contain"
                                style={{
                                    width: 40,
                                    height: 40,
                                }}
                            />
                        </TouchableOpacity>
                        <Video
                            ref={videoRef}
                            source={{ uri: source }}
                            style={{
                                height: 150,
                                width: 310,
                                borderRadius: 5,
                            }}
                            resizeMode="cover"
                            onPlaybackStatusUpdate={(status) =>
                                this.setState({ status })
                            }
                        />
                    </View>
                )}
                <Modal
                    backdropColor={'transparent'}
                    isVisible={this.state.isVisible}
                    backdropOpacity={1}
                    animationIn="fadeIn"
                    animationInTiming={600}
                    onSwipeComplete={() => this.setState({ isVisible: false })}
                    swipeDirection="down"
                    deviceWidth={width}
                    style={{
                        padding: 0,
                        margin: 0,
                    }}
                >
                    <View style={{ flex: 1 }}>
                        <VideoPlayer
                            videoProps={{
                                shouldPlay: true,
                                resizeMode: Video.RESIZE_MODE_CONTAIN,
                                source: {
                                    uri: source,
                                },
                            }}
                            style={{
                                // videoBackgroundColor: 'transparent',
                                // controlsBackgroundColor: 'transparent',
                                flex: 0.8,
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
                </Modal>
            </>
        )
    }
}
