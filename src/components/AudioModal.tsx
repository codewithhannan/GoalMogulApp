/** @format */

import React from 'react'
import {
    Dimensions,
    Image,
    Slider,
    StyleSheet,
    Text,
    Modal,
    TouchableHighlight,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    ActivityIndicator,
} from 'react-native'
import { Audio, AVPlaybackStatus } from 'expo-av'
import { Icon } from '@ui-kitten/components'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import { connect } from 'react-redux'

import DelayedButton from '../Main/Common/Button/DelayedButton'
import OnboardingStyles, { getCardBottomOffset } from '../styles/Onboarding'
const { text: textStyle, button: buttonStyle } = OnboardingStyles
import { GM_BLUE } from '../styles/basic/color'
import { GOALS_STYLE } from '../styles/Goal'
import * as text from '../styles/basic/text'
const play = require('../../src/asset/icons/play.png')
const crossIcon = require('../asset/icons/cross.png')

//Utils

import { sendVoiceMessage } from '../redux/modules/feed/comment/CommentActions'
import { openGoalDetail } from '../redux/modules/home/mastermind/actions'
import { changeMessageVoiceRef } from '../redux/modules/chat/ChatRoomActions'

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window')
const BACKGROUND_COLOR = '#FFF8ED'
const LIVE_COLOR = '#FF0000'
const DISABLED_OPACITY = 0.5
const RATE_SCALE = 3.0

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

type Props = {
    pageId: string
    goalDetail: {
        goalRef: { _id: string | null }
        commentRef: { _id: string | null }
    }
    newCommentDetail: {}
    onClose: () => void
    openGoalDetail: (goalRef: {}, propsToPass: {}) => void
    sendVoiceMessage: (
        voiceUri: string | null,
        pageId: string | null,
        _id: string | null,
        callback: (res: {}) => void
    ) => void
    commentType: string | null
    chatType: string | null
    chatUser: {}
    chatRoom: {}
    chatMessages: []
    changeMessageVoiceRef: (voiceUri: string | null) => void
}

type State = {
    haveRecordingPermissions: boolean
    loading: boolean
    isLoading: boolean
    loadingModal: boolean
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
    reRecordModal: boolean
    selected: string | null
}

class AudioModal extends React.Component<Props, State> {
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
            loading: false,
            isLoading: false,
            loadingModal: false,
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
            reRecordModal: false,
            selected: null,
        }
        this.recordingSettings = {
            android: {
                extension: '.m4a',
                outputFormat:
                    Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
                audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
                sampleRate: 44100,
                numberOfChannels: 2,
                bitRate: 128000,
            },
            ios: {
                extension: '.m4a',
                outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
                audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MEDIUM,
                sampleRate: 44100,
                numberOfChannels: 2,
                bitRate: 128000,
                linearPCMBitDepth: 16,
                linearPCMIsBigEndian: false,
                linearPCMIsFloat: false,
            },
        }

        // UNCOMMENT THIS TO TEST maxFileSize:
        //      this.recordingSettings = {
        //   ...this.recordingSettings,
        //   android: {
        //     ...this.recordingSettings.android,
        //     maxFileSize: 12000,
        //   },
        // };
    }

    componentDidMount() {
        ;(async () => {
            this.setState({ fontLoaded: true })
        })()
        this._askForPermissions()
    }

    componentWillUnmount() {
        const unloaded = async () => {
            return await this.recording?.stopAndUnloadAsync()
        }
        unloaded()
    }

    private _askForPermissions = async () => {
        const response = await Audio.requestPermissionsAsync()
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
            return `${this._getMMSSFromMillis(this.state.soundPosition)} `
        }
        return ''
    }

    private _getRecordingTimestamp() {
        if (this.state.recordingDuration != null) {
            return `${this._getMMSSFromMillis(this.state.recordingDuration)}`
        }
        return `${this._getMMSSFromMillis(0)}`
    }

    private _closeModal = () => {
        this.setState({ reRecordModal: false })
    }

    private _changeColor = (value: string) => {
        this.setState({ selected: value })
    }

    render() {
        const { chatMessages } = this.props
        const { soundDuration } = this.state
        return (
            <>
                <View style={styles.emptyContainer}>
                    {this.props.chatType ? (
                        <TouchableOpacity
                            onPress={this.props.onClose}
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                paddingRight: 10,
                            }}
                        >
                            <Image
                                source={crossIcon}
                                style={{
                                    width: 25,
                                    height: 25,
                                    resizeMode: 'contain',
                                }}
                            />
                        </TouchableOpacity>
                    ) : (
                        <View
                            style={{
                                flexDirection: 'row',
                                // marginHorizontal: 10,
                                // paddingRight: 10,
                                width: '90%',
                                alignItems: 'center',
                                alignSelf: 'center',
                            }}
                        >
                            {privacyOptions.map((options, index) => {
                                return (
                                    <TouchableOpacity
                                        key={Math.random()
                                            .toString(36)
                                            .substr(2, 9)}
                                        onPress={() => {
                                            this._changeColor(options.value)
                                        }}
                                        disabled={
                                            this.state.selected ===
                                            options.value
                                        }
                                    >
                                        <View
                                            style={[
                                                GOALS_STYLE.commonPillContainer,
                                                {
                                                    height: 35,
                                                    borderColor:
                                                        this.state.selected ===
                                                        options.value
                                                            ? '#828282'
                                                            : 'lightgray',
                                                    borderWidth: 0.3,
                                                    left: 10,
                                                    width: 80,
                                                    marginHorizontal: 3,
                                                    backgroundColor: 'white',
                                                },
                                            ]}
                                        >
                                            <Icon
                                                pack="material-community"
                                                name={options.iconName}
                                                style={{
                                                    height: 12,
                                                    width: 12,
                                                    tintColor: '#828282',
                                                    opacity:
                                                        this.state.selected ===
                                                        options.value
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
                                                        this.state.selected ===
                                                        options.value
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

                            <TouchableOpacity
                                onPress={this.props.onClose}
                                style={{
                                    position: 'absolute',
                                    // flexDirection: 'row',
                                    // justifyContent: 'flex-end',
                                    right: 0,
                                }}
                            >
                                <Image
                                    source={crossIcon}
                                    style={{
                                        width: 25,
                                        height: 25,
                                        resizeMode: 'contain',
                                    }}
                                />
                            </TouchableOpacity>
                        </View>
                    )}

                    <Text
                        style={{
                            color: soundDuration > 0 ? '#535353' : 'gray',
                            fontSize: 70,
                            marginVertical: 5,
                            textAlign: 'center',
                        }}
                    >
                        {this._getRecordingTimestamp()}
                    </Text>
                    {this.state.isPlaybackAllowed ? (
                        <View style={{ flex: 1 }}>
                            <View style={styles.playerContainer}>
                                <TouchableOpacity
                                    activeOpacity={0.6}
                                    onPress={
                                        this.state.isPlaying
                                            ? this._onPausePressed
                                            : this._onPlayPausePressed
                                    }
                                >
                                    <Image
                                        source={play}
                                        resizeMode="contain"
                                        style={styles.image}
                                    />
                                </TouchableOpacity>
                                <Slider
                                    style={styles.playbackSlider}
                                    value={this._getSeekSliderPosition()}
                                    onValueChange={
                                        this._onSeekSliderValueChange
                                    }
                                    // onSlidingComplete={ this._onSeekSliderSlidingComplete}
                                />
                            </View>
                            <View style={styles.playbackTimestamp}>
                                <Text
                                    style={{ position: 'absolute', right: 0 }}
                                >
                                    {this._getPlaybackTimestamp()}
                                </Text>
                            </View>
                        </View>
                    ) : null}
                    <View style={{ paddingVertical: 25 }}>
                        {this.state.isRecording ? (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignSelf: 'center',
                                }}
                            >
                                <DelayedButton
                                    style={[
                                        buttonStyle.GM_WHITE_BG_BLUE_TEXT
                                            .containerStyle,
                                        ,
                                        {
                                            width: wp('90%'),
                                            height: 50,
                                            alignSelf: 'center',
                                            marginVertical: 20,
                                        },
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
                            </View>
                        ) : soundDuration ? (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignSelf: 'center',
                                }}
                            >
                                <DelayedButton
                                    style={[
                                        buttonStyle.GM_WHITE_BG_BLUE_TEXT
                                            .containerStyle,
                                        ,
                                        {
                                            width: wp('45%'),
                                            backgroundColor: '#D3F2FF',
                                            borderColor: '#D3F2FF',
                                        },
                                    ]}
                                    onPress={() =>
                                        this.setState({
                                            reRecordModal: true,
                                        })
                                    }
                                >
                                    <Text
                                        style={[
                                            buttonStyle.GM_WHITE_BG_GRAY_TEXT
                                                .textStyle,
                                        ]}
                                    >
                                        Re-Record
                                    </Text>
                                </DelayedButton>
                                <View style={{ width: 20 }} />
                                <DelayedButton
                                    onPress={() => {
                                        // this.props.onClose()
                                        this.setState({ loadingModal: true })
                                        this.setState({ loading: true })
                                        if (this.props.commentType) {
                                            const {
                                                goalRef,
                                                commentRef,
                                            } = this.props.goalDetail

                                            this.props.sendVoiceMessage(
                                                this.state.record,
                                                this.props.pageId,
                                                goalRef._id,
                                                () => {
                                                    this.setState({
                                                        loadingModal: false,
                                                    })
                                                    this.props.onClose()
                                                    this.setState({
                                                        loading: false,
                                                    })
                                                    this.props.openGoalDetail(
                                                        goalRef,
                                                        {
                                                            focusType:
                                                                'comment',
                                                            initialShowSuggestionModal: false,
                                                            initialFocusCommentBox: false,
                                                        }
                                                    )
                                                }
                                            )
                                        }
                                        if (this.props.chatType) {
                                            this.props.changeMessageVoiceRef(
                                                this.state.record
                                            )
                                            this.setState({
                                                loadingModal: false,
                                            })
                                            this.props.onClose()
                                            this.setState({
                                                loading: false,
                                            })
                                        }
                                    }}
                                    style={[
                                        buttonStyle.GM_BLUE_BG_WHITE_BOLD_TEXT
                                            .containerStyle,
                                        ,
                                        { width: wp('45%') },
                                    ]}
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
                        ) : (
                            <DelayedButton
                                style={[
                                    buttonStyle.GM_BLUE_BG_WHITE_BOLD_TEXT
                                        .containerStyle,
                                    ,
                                    {
                                        width: wp('90%'),
                                        height: 50,
                                        alignSelf: 'center',
                                        marginVertical: 20,
                                    },
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
                    <Modal
                        transparent={true}
                        visible={this.state.reRecordModal}
                        onDismiss={() =>
                            this.setState({ reRecordModal: false })
                        }
                    >
                        <View
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            }}
                        >
                            <View
                                style={{
                                    height: 175,
                                    width: '90%',
                                    backgroundColor: 'white',
                                    padding: 15,
                                    borderRadius: 5,
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 20,
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        Record a new clip
                                    </Text>
                                    <TouchableOpacity
                                        onPress={this._closeModal}
                                    >
                                        <Image
                                            source={crossIcon}
                                            style={{
                                                width: 25,
                                                height: 25,
                                                resizeMode: 'contain',
                                                // marginLeft: 120,
                                            }}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ marginVertical: 10 }}>
                                    <Text style={{ lineHeight: 30 }}>
                                        This will overwrite the recording you
                                        just made. Are you sure?
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <TouchableWithoutFeedback
                                        onPress={() => {
                                            this._closeModal()
                                            this._onRecordPressed()
                                        }}
                                    >
                                        <View style={styles.btnContainer2}>
                                            <Text style={styles.btnText2}>
                                                YES
                                            </Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                    <TouchableWithoutFeedback
                                        onPress={this._closeModal}
                                    >
                                        <View style={styles.btnContainer1}>
                                            <Text style={styles.btnText1}>
                                                NO
                                            </Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    <Modal visible={this.state.loadingModal} transparent={true}>
                        <View
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                // justifyContent: 'center',
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            }}
                        >
                            {this.state.loading && (
                                <ActivityIndicator
                                    animating
                                    size="large"
                                    color="white"
                                    style={{
                                        top: '45%',
                                        position: 'absolute',
                                        alignSelf: 'center',
                                    }}
                                />
                            )}
                        </View>
                    </Modal>
                </View>
            </>
        )
    }
}

export default connect(null, {
    sendVoiceMessage,
    openGoalDetail,
    changeMessageVoiceRef,
})(AudioModal)

const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    playerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
    },
    playbackSlider: {
        width: '80%',
        alignSelf: 'center',
    },
    playbackTimestamp: {
        // position: 'absolute',
        // right: 25,
        // top: 25,
        alignSelf: 'center',
        // justifyContent: 'flex-end',
        backgroundColor: 'red',
        width: '73%',
    },
    image: {
        width: 30,
        height: 30,
        marginHorizontal: 5,
    },
    playStopContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnContainer1: {
        backgroundColor: GM_BLUE,
        width: wp(25.33),
        height: hp(5.09),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: wp(1),
        marginHorizontal: wp(1.5),
    },
    btnContainer2: {
        backgroundColor: '#ffffff',
        width: wp(25.33),
        height: hp(5.09),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: wp(1),
        borderColor: GM_BLUE,
        borderWidth: wp(0.3),
        marginHorizontal: wp(1.5),
    },
    btnText1: {
        color: '#ffffff',
        fontFamily: text.FONT_FAMILY.SEMI_BOLD,
        fontSize: hp(1.95),
    },
    btnText2: {
        color: GM_BLUE,
        fontFamily: text.FONT_FAMILY.SEMI_BOLD,
        fontSize: hp(1.95),
    },
})
