/** @format */

import React from 'react'
import {
    Dimensions,
    Image,
    Slider,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
} from 'react-native'
import { Audio, AVPlaybackStatus } from 'expo-av'
import * as Permissions from 'expo-permissions'
import DelayedButton from '../Main/Common/Button/DelayedButton'
import OnboardingStyles, { getCardBottomOffset } from '../styles/Onboarding'

const play = require('../../src/asset/icons/play.png')

const { text: textStyle, button: buttonStyle } = OnboardingStyles
const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window')
const BACKGROUND_COLOR = '#FFF8ED'

export default class App extends React.Component {
    constructor(props) {
        super(props)
        this.recording = null
        this.sound = null
        this.isSeeking = false
        this.shouldPlayAtEndOfSeek = false
        this.state = {
            record: null,
            haveRecordingPermissions: false,
            isLoading: false,
            isPlaybackAllowed: false,
            muted: false,
            soundPosition: null,
            soundDuration: null,
            recordingDuration: null,
            shouldPlay: false,
            isPlaying: false,
            isRecording: false,
            shouldCorrectPitch: true,
            volume: 1.0,
            rate: 1.0,
        }
        this.recordingSettings = JSON.parse(
            JSON.stringify(Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY)
        )

        // UNCOMMENT THIS TO TEST maxFileSize:
        /* this.recordingSettings = {
          ...this.recordingSettings,
          android: {
            ...this.recordingSettings.android,
            maxFileSize: 12000,
          },
        };*/
    }

    componentDidMount() {
        this._askForPermissions()
        this.setup()
    }

    _askForPermissions = async () => {
        const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING)
        this.setState({
            haveRecordingPermissions: response.status === 'granted',
        })
    }

    setup = async () => {
        await TrackPlayer.setupPlayer({})
        await TrackPlayer.updateOptions({
            stopWithApp: true,
            capabilities: [
                TrackPlayer.CAPABILITY_PLAY,
                TrackPlayer.CAPABILITY_PAUSE,
                TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
                TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
                TrackPlayer.CAPABILITY_STOP,
            ],
            compactCapabilities: [
                TrackPlayer.CAPABILITY_PLAY,
                TrackPlayer.CAPABILITY_PAUSE,
            ],
        })
    }

    _updateScreenForSoundStatus = (status) => {
        if (status.isLoaded) {
            this.setState({
                soundDuration: status.durationMillis || null,
                soundPosition: status.positionMillis,
                shouldPlay: status.shouldPlay,
                isPlaying: status.isPlaying,
                rate: status.rate,
                muted: status.isMuted,
                volume: status.volume,
                shouldCorrectPitch: status.shouldCorrectPitch,
                isPlaybackAllowed: true,
            })
        } else {
            this.setState({
                soundDuration: null,
                soundPosition: null,
                isPlaybackAllowed: false,
            })
            if (status.error) {
                console.log(`FATAL PLAYER ERROR: ${status.error}`)
            }
        }
    }

    _updateScreenForRecordingStatus = (status) => {
        if (status.canRecord) {
            this.setState({
                isRecording: status.isRecording,
                recordingDuration: status.durationMillis,
            })
        } else if (status.isDoneRecording) {
            this.setState({
                isRecording: false,
                recordingDuration: status.durationMillis,
            })
            if (!this.state.isLoading) {
                this._stopRecordingAndEnablePlayback()
            }
        }
    }

    async _stopPlaybackAndBeginRecording() {
        this.setState({
            isLoading: true,
        })
        if (this.sound !== null) {
            await this.sound.unloadAsync()
            this.sound.setOnPlaybackStatusUpdate(null)
            this.sound = null
        }
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
            playThroughEarpieceAndroid: false,
            staysActiveInBackground: true,
        })
        if (this.recording !== null) {
            this.recording.setOnRecordingStatusUpdate(null)
            this.recording = null
        }

        const recording = new Audio.Recording()
        await recording.prepareToRecordAsync(this.recordingSettings)
        recording.setOnRecordingStatusUpdate(
            this._updateScreenForRecordingStatus
        )

        this.recording = recording
        this.setState({
            record: recording._uri,
        })
        this.props.voice(recording._uri)
        await this.recording.startAsync() // Will call this._updateScreenForRecordingStatus to update the screen.
        this.setState({
            isLoading: false,
        })
    }

    async _stopRecordingAndEnablePlayback() {
        this.setState({
            isLoading: true,
        })
        if (!this.recording) {
            return
        }
        try {
            await this.recording.stopAndUnloadAsync()
        } catch (error) {
            // On Android, calling stop before any data has been collected results in
            // an E_AUDIO_NODATA error. This means no audio data has been written to
            // the output file is invalid.
            if (error.code === 'E_AUDIO_NODATA') {
                console.log(
                    `Stop was called too quickly, no data has yet been received (${error.message})`
                )
            } else {
                console.log(
                    'STOP ERROR: ',
                    error.code,
                    error.name,
                    error.message
                )
            }
            this.setState({
                isLoading: false,
            })
            return
        }
        // const info = await FileSystem.getInfoAsync(this.recording.getURI() || "");
        // console.log(`FILE INFO: ${JSON.stringify(info)}`);
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
            playThroughEarpieceAndroid: false,
            staysActiveInBackground: true,
        })
        const {
            sound,
            status,
        } = await this.recording.createNewLoadedSoundAsync(
            {
                // isLooping: true,
                isMuted: this.state.muted,
                volume: this.state.volume,
                rate: this.state.rate,
                shouldCorrectPitch: this.state.shouldCorrectPitch,
            },
            this._updateScreenForSoundStatus
        )
        this.sound = sound
        this.setState({
            isLoading: false,
        })
    }

    _onRecordPressed = () => {
        if (this.state.isRecording) {
            this._stopRecordingAndEnablePlayback()
        } else {
            this._stopPlaybackAndBeginRecording()
        }
    }

    _onPausePressed = () => {
        this.sound?.pauseAsync()
    }

    _onPlayPressed = () => {
        // if (this.sound != null) {
        //     if (this.state.isPlaying) {
        //         this.sound.pauseAsync().then(() => {
        //             this.sound.playAsync()
        //         })
        //     } else {
        //         this.sound.playAsync()
        //     }
        // }
        if (this.sound != null) {
            if (this.state.soundPosition === this.state.soundDuration) {
                this.sound.stopAsync().then(() => {
                    this.sound.playAsync()
                })
            } else {
                // just play from wherever we are
                this.sound.playAsync().catch((err) => {
                    console.warn(`Player.js onPlayPress error: ${err}`)
                })
            }
        }
    }

    _onSeekSliderValueChange = (value) => {
        if (this.sound != null && !this.isSeeking) {
            this.isSeeking = true
            this.shouldPlayAtEndOfSeek = this.state.shouldPlay
            this.sound.pauseAsync()
        }
    }

    _onSeekSliderSlidingComplete = async (value) => {
        // if (this.sound != null) {
        //     this.isSeeking = false;
        //     const seekPosition = value * (this.state.soundDuration || 0);
        //     if (this.shouldPlayAtEndOfSeek) {
        //         this.sound.playFromPositionAsync(seekPosition);
        //     } else {
        //         this.sound.setPositionAsync(seekPosition);
        //     }
        // }
    }

    _getSeekSliderPosition() {
        if (
            this.sound != null &&
            this.state.soundPosition != null &&
            this.state.soundDuration != null
        ) {
            return this.state.soundPosition / this.state.soundDuration
        }
        return 0
    }

    _getMMSSFromMillis(millis) {
        const totalSeconds = millis / 1000
        const seconds = Math.floor(totalSeconds % 60)
        const minutes = Math.floor(totalSeconds / 60)

        const padWithZero = (number) => {
            const string = number.toString()
            if (number < 10) {
                return '0' + string
            }
            return string
        }
        return padWithZero(minutes) + ':' + padWithZero(seconds)
    }

    _getPlaybackTimestamp() {
        if (
            this.sound != null &&
            this.state.soundPosition != null &&
            this.state.soundDuration != null
        ) {
            return `${this._getMMSSFromMillis(this.state.soundPosition)}`
        }
        return ''
    }

    _getRecordingTimestamp() {
        if (this.state.recordingDuration != null) {
            return `${this._getMMSSFromMillis(this.state.recordingDuration)}`
        }
        return `${this._getMMSSFromMillis(0)}`
    }

    render() {
        return (
            <View style={styles.emptyContainer}>
                <Text style={{ color: 'gray', fontSize: 70 }}>
                    {this._getRecordingTimestamp()}
                </Text>
                {this.state.isPlaybackAllowed ? (
                    <View style={styles.playerContainer}>
                        <TouchableHighlight
                            onPress={
                                this.state.isPlaying
                                    ? this._onPausePressed
                                    : this._onPlayPressed
                            }
                        >
                            <Image
                                source={play}
                                resizeMode="center"
                                style={styles.image}
                            />
                        </TouchableHighlight>
                        <Slider
                            style={styles.playbackSlider}
                            value={this._getSeekSliderPosition()}
                            onValueChange={this._onSeekSliderValueChange}
                            // onSlidingComplete={ this._onSeekSliderSlidingComplete}
                        />
                        <Text style={[styles.playbackTimestamp]}>
                            {this._getPlaybackTimestamp()}
                        </Text>
                    </View>
                ) : null}
                <View style={{ paddingVertical: 25 }}>
                    {this.state.isRecording ? (
                        <View style={{ flexDirection: 'row' }}>
                            <DelayedButton
                                style={[
                                    buttonStyle.GM_WHITE_BG_BLUE_TEXT
                                        .containerStyle,
                                    ,
                                    { width: 150 },
                                ]}
                                onPress={this._onRecordPressed}
                            >
                                <Text
                                    style={[
                                        buttonStyle.GM_WHITE_BG_GRAY_TEXT
                                            .textStyle,
                                    ]}
                                >
                                    Stop
                                </Text>
                            </DelayedButton>
                            <View style={{ width: 20 }} />
                            <DelayedButton
                                style={[
                                    buttonStyle.GM_BLUE_BG_WHITE_BOLD_TEXT
                                        .containerStyle,
                                    ,
                                    { width: 150 },
                                ]}
                                // onPress={this._onRecordPressed}
                            >
                                <Text
                                    style={[
                                        buttonStyle.GM_BLUE_BG_WHITE_BOLD_TEXT
                                            .textStyle,
                                    ]}
                                >
                                    Send
                                </Text>
                            </DelayedButton>
                        </View>
                    ) : this.state.record ? (
                        <View style={{ flexDirection: 'row' }}>
                            <DelayedButton
                                style={[
                                    buttonStyle.GM_WHITE_BG_BLUE_TEXT
                                        .containerStyle,
                                    ,
                                    { width: 150 },
                                ]}
                                onPress={this._onRecordPressed}
                            >
                                <Text
                                    style={[
                                        buttonStyle.GM_WHITE_BG_GRAY_TEXT
                                            .textStyle,
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
                                    { width: 150 },
                                ]}
                                // onPress={this._onRecordPressed}
                            >
                                <Text
                                    style={[
                                        buttonStyle.GM_BLUE_BG_WHITE_BOLD_TEXT
                                            .textStyle,
                                    ]}
                                >
                                    Send
                                </Text>
                            </DelayedButton>
                        </View>
                    ) : (
                        <DelayedButton
                            style={[
                                buttonStyle.GM_BLUE_BG_WHITE_BOLD_TEXT
                                    .containerStyle,
                                ,
                                { width: 330 },
                            ]}
                            onPress={this._onRecordPressed}
                        >
                            <Text
                                style={[
                                    buttonStyle.GM_BLUE_BG_WHITE_BOLD_TEXT
                                        .textStyle,
                                ]}
                            >
                                Record
                            </Text>
                        </DelayedButton>
                    )}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    playerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'gray'
    },
    playbackSlider: {
        width: 250,
    },
    playbackTimestamp: {
        left: -40,
        top: 25,
    },
    image: {
        // marginHorizontal: 5
    },
    playStopContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
})
