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
import * as FileSystem from 'expo-file-system'
import * as Font from 'expo-font'
import * as Permissions from 'expo-permissions'
// import * as Icons from "./components/Icons";

import DelayedButton from '../Main/Common/Button/DelayedButton'
import OnboardingStyles, { getCardBottomOffset } from '../styles/Onboarding'
const { text: textStyle, button: buttonStyle } = OnboardingStyles
const play = require('../../src/asset/icons/play.png')

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window')
const BACKGROUND_COLOR = '#FFF8ED'
const LIVE_COLOR = '#FF0000'
const DISABLED_OPACITY = 0.5
const RATE_SCALE = 3.0

type Props = {}

type State = {
    haveRecordingPermissions: boolean
    isLoading: boolean
    record: string | null
    isPlaybackAllowed: boolean
    muted: boolean
    soundPosition: number | null
    soundDuration: number | null
    recordingDuration: number | null
    shouldPlay: boolean
    isPlaying: boolean
    isRecording: boolean
    fontLoaded: boolean
    shouldCorrectPitch: boolean
    volume: number
    rate: number
}

export default class AudioModal extends React.Component<Props, State> {
    private recording: Audio.Recording | null
    private sound: Audio.Sound | null
    private isSeeking: boolean
    private shouldPlayAtEndOfSeek: boolean
    private readonly recordingSettings: Audio.RecordingOptions

    constructor(props: Props) {
        super(props)
        this.recording = null
        this.sound = null
        this.isSeeking = false
        this.shouldPlayAtEndOfSeek = false
        this.state = {
            haveRecordingPermissions: false,
            isLoading: false,
            record: null,
            isPlaybackAllowed: false,
            muted: false,
            soundPosition: null,
            soundDuration: null,
            recordingDuration: null,
            shouldPlay: false,
            isPlaying: false,
            isRecording: false,
            fontLoaded: false,
            shouldCorrectPitch: true,
            volume: 1.0,
            rate: 1.0,
        }
        this.recordingSettings = Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY

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
        ;(async () => {
            this.setState({ fontLoaded: true })
        })()
        this._askForPermissions()
    }

    private _askForPermissions = async () => {
        const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING)
        this.setState({
            haveRecordingPermissions: response.status === 'granted',
        })
    }

    private _updateScreenForSoundStatus = (status: AVPlaybackStatus) => {
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

    private _updateScreenForRecordingStatus = (
        status: Audio.RecordingStatus
    ) => {
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

    private async _stopPlaybackAndBeginRecording() {
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
        await this.recording.startAsync() // Will call this._updateScreenForRecordingStatus to update the screen.
        this.setState({
            isLoading: false,
        })
    }

    private async _stopRecordingAndEnablePlayback() {
        this.setState({
            isLoading: true,
        })
        if (!this.recording) {
            return
        }
        try {
            await this.recording.stopAndUnloadAsync()
        } catch (error) {
            // Do nothing -- we are already unloaded.
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

    private _onRecordPressed = () => {
        if (this.state.isRecording) {
            this._stopRecordingAndEnablePlayback()
        } else {
            this._stopPlaybackAndBeginRecording()
        }
    }

    private _onPausePressed = () => {
        this.sound?.pauseAsync()
    }

    private _onPlayPausePressed = () => {
        // if (this.sound != null) {
        //     if (this.state.isPlaying) {
        //         this.sound.pauseAsync()
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

    private _onStopPressed = () => {
        if (this.sound != null) {
            this.sound.stopAsync()
        }
    }

    private _onMutePressed = () => {
        if (this.sound != null) {
            this.sound.setIsMutedAsync(!this.state.muted)
        }
    }

    private _onVolumeSliderValueChange = (value: number) => {
        if (this.sound != null) {
            this.sound.setVolumeAsync(value)
        }
    }

    private _trySetRate = async (rate: number, shouldCorrectPitch: boolean) => {
        if (this.sound != null) {
            try {
                await this.sound.setRateAsync(rate, shouldCorrectPitch)
            } catch (error) {
                // Rate changing could not be performed, possibly because the client's Android API is too old.
            }
        }
    }

    private _onRateSliderSlidingComplete = async (value: number) => {
        this._trySetRate(value * RATE_SCALE, this.state.shouldCorrectPitch)
    }

    private _onPitchCorrectionPressed = () => {
        this._trySetRate(this.state.rate, !this.state.shouldCorrectPitch)
    }

    private _onSeekSliderValueChange = (value: number) => {
        if (this.sound != null && !this.isSeeking) {
            this.isSeeking = true
            this.shouldPlayAtEndOfSeek = this.state.shouldPlay
            this.sound.pauseAsync()
        }
    }

    private _onSeekSliderSlidingComplete = async (value: number) => {
        if (this.sound != null) {
            this.isSeeking = false
            const seekPosition = value * (this.state.soundDuration || 0)
            if (this.shouldPlayAtEndOfSeek) {
                this.sound.playFromPositionAsync(seekPosition)
            } else {
                this.sound.setPositionAsync(seekPosition)
            }
        }
    }

    private _getSeekSliderPosition() {
        if (
            this.sound != null &&
            this.state.soundPosition != null &&
            this.state.soundDuration != null
        ) {
            return this.state.soundPosition / this.state.soundDuration
        }
        return 0
    }

    private _getMMSSFromMillis(millis: number) {
        const totalSeconds = millis / 1000
        const seconds = Math.floor(totalSeconds % 60)
        const minutes = Math.floor(totalSeconds / 60)

        const padWithZero = (number: number) => {
            const string = number.toString()
            if (number < 10) {
                return '0' + string
            }
            return string
        }
        return padWithZero(minutes) + ':' + padWithZero(seconds)
    }

    private _getPlaybackTimestamp() {
        if (
            this.sound != null &&
            this.state.soundPosition != null &&
            this.state.soundDuration != null
        ) {
            return `${this._getMMSSFromMillis(
                this.state.soundPosition
            )} / ${this._getMMSSFromMillis(this.state.soundDuration)}`
        }
        return ''
    }

    private _getRecordingTimestamp() {
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
                                    : this._onPlayPausePressed
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
                            {/* <DelayedButton
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
                            </DelayedButton> */}
                        </View>
                    ) : this.state.soundDuration ? (
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
                                // onPress={}
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
