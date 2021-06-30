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
import Constants from 'expo-constants'
import { connect } from 'react-redux'
import { color, text } from '../../../styles/basic'
import OnboardingStyles from '../../../styles/Onboarding'
import InputBox from '../../Onboarding/Common/InputBox'
import { PRIVACY_OPTIONS } from '../../../Utils/Constants'
import { Video } from 'expo-av'
import { GOALS_STYLE } from '../../../styles/Goal'
import DelayedButton from '../Button/DelayedButton'

const { text: textStyle, button: buttonStyle } = OnboardingStyles

const MODAL_WIDTH = Dimensions.get('window').width
const MODAL_HEIGHT = Dimensions.get('window').height

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
        }
    }

    async componentDidMount() {}

    async componentDidUpdate(prevProps, prevState) {}

    changeColor = (id) => {
        console.log('IDDD', id)
        this.setState({ selected: id })
    }
    renderPrivacyControl() {
        return (
            <View style={{ padding: 10 }}>
                <InputBox
                    privacyOptions={PRIVACY_OPTIONS}
                    required={false}
                    inputTitle={'Privacy'}
                    selectedValue={this.props.privacy}
                    onChangeText={(value) => {
                        this.props.change('privacy', value)
                    }}
                />
            </View>
        )
    }

    render() {
        return (
            <>
                <Modal
                    isVisible={true}
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
                                height: MODAL_HEIGHT * 0.55,
                                borderRadius: 5,
                            }}
                        >
                            <View
                                style={{
                                    padding: 13,
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => this.props.onClose()}
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
                                    flex: 1,
                                }}
                            >
                                <Video
                                    ref={this.state.video}
                                    source={{
                                        uri:
                                            'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
                                    }}
                                    style={{
                                        height: MODAL_HEIGHT * 0.3,
                                        width: MODAL_WIDTH * 0.83,
                                        borderRadius: 5,
                                        alignSelf: 'center',
                                    }}
                                    shouldPlay
                                    resizeMode="stretch"
                                    isLooping
                                    onPlaybackStatusUpdate={(status) =>
                                        this.setState({ status })
                                    }
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
                                        },
                                    ]}
                                    onPress={this._onRecordPressed}
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
    return {}
}

export default connect(mapStateToProps, {})(CommentVideoModal)
