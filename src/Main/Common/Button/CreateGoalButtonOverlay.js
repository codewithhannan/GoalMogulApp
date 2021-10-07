/** @format */

import React, { Component } from 'react'
import {
    Animated,
    Image,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import goal from '../../../asset/header/logo.png'
/* asset */
import cancel from '../../../asset/utils/cancel_no_background.png'
import post from '../../../asset/utils/post.png'
/* actions */
import { closeCreateOverlay } from '../../../redux/modules/home/mastermind/actions'
import { color } from '../../../styles/basic'
import {
    DEVICE_MODEL,
    IPHONE_MODELS_2,
    IPHONE_MODELS_3,
} from '../../../Utils/Constants'

const BUTTON_GROUP_BOTTOM_OFFSET = IPHONE_MODELS_3.includes(DEVICE_MODEL)
    ? 119
    : IPHONE_MODELS_2.includes(DEVICE_MODEL)
    ? 119
    : 84

const DEBUG_KEY = '[ UI CreateGoalButtonOverlay ]'

class CreateGoalButtonOverlay extends Component {
    constructor(...args) {
        super(...args)
        this.fadeAnim = new Animated.Value(0)
        this.spinAnim = new Animated.Value(0)
    }

    componentDidMount() {
        Animated.parallel([
            Animated.timing(this.fadeAnim, {
                duration: 400,
                toValue: 1,
                useNativeDriver: true,
            }),
            Animated.timing(this.spinAnim, {
                toValue: 0.5,
                duration: 400,
                useNativeDriver: true,
            }),
        ]).start()
    }

    handleCancel = () => {
        if (this.props.onClose) {
            this.props.onClose()
        } else {
            this.props.closeCreateOverlay(this.props.tab)
        }
        Animated.parallel([
            Animated.timing(this.fadeAnim, {
                duration: 400,
                toValue: 0,
                useNativeDriver: true,
            }),
            Animated.timing(this.spinAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
        ]).start(() => {
            Actions.pop()
        })
    }

    handleCreatePost = () => {
        if (this.props.onClose) {
            this.props.onClose()
        } else {
            this.props.closeCreateOverlay(this.props.tab)
        }
        Animated.parallel([
            Animated.timing(this.fadeAnim, {
                duration: 400,
                toValue: 0,
                useNativeDriver: true,
            }),
            Animated.timing(this.spinAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
        ]).start(() => {
            Actions.pop()
            // This is a temp hack, createGoalButtonOverlay is being depricated
            this.props.openCreatePost()
        })
    }

    handleCreateGoal = () => {
        if (this.props.onClose) {
            this.props.onClose()
        } else {
            this.props.closeCreateOverlay(this.props.tab)
        }
        console.log('User trying to create goal')
        Animated.parallel([
            Animated.timing(this.fadeAnim, {
                duration: 400,
                toValue: 0,
                useNativeDriver: true,
            }),
            Animated.timing(this.spinAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
        ]).start(() => {
            Actions.pop()
            Actions.createGoalModal({
                onCreate: this.props.onCreate,
                onClose: this.props.onClose,
                openProfile: this.props.openProfile,
                pageId: this.props.pageId,
            })
        })
    }

    renderCancelButton() {
        return (
            <TouchableWithoutFeedback
                style={{
                    ...styles.iconContainerStyle,
                    backgroundColor: 'transparent',
                }}
                onPress={this.handleCancel}
            >
                <Animated.Image
                    style={{
                        ...styles.iconStyle,
                        transform: [
                            {
                                rotate: this.spinAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0deg', '180deg'],
                                }),
                            },
                        ],
                        opacity: this.fadeAnim,
                    }}
                    source={cancel}
                />
            </TouchableWithoutFeedback>
        )
    }

    render() {
        return (
            <View style={styles.wrapperStyle}>
                <TouchableWithoutFeedback onPress={this.handleCancel}>
                    <Animated.View
                        style={[
                            styles.fullscreen,
                            {
                                backgroundColor: '#000',
                                opacity: this.fadeAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, 0.3],
                                }),
                            },
                        ]}
                    />
                </TouchableWithoutFeedback>
                <View style={styles.containerStyle}>
                    <Animated.View
                        style={{
                            opacity: this.fadeAnim,
                            position: 'relative',
                            transform: [
                                {
                                    translateY: this.fadeAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [72, 0],
                                    }),
                                },
                            ],
                            right: 18,
                        }}
                    >
                        <ActionButton
                            text="Post"
                            source={post}
                            style={{
                                iconStyle: {
                                    height: 18,
                                    width: 18,
                                    marginLeft: 3,
                                },
                                textStyle: { marginLeft: 5 },
                            }}
                            onPress={this.handleCreatePost}
                            key={Math.random().toString(36).substr(2, 9)}
                        />
                    </Animated.View>
                    <Animated.View
                        style={{
                            opacity: this.fadeAnim,
                            position: 'relative',
                            transform: [
                                {
                                    translateY: this.fadeAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [30, 0],
                                    }),
                                },
                            ],
                            right: 18,
                        }}
                    >
                        <ActionButton
                            text="Goal"
                            source={goal}
                            style={{
                                iconStyle: { height: 25, width: 25 },
                                textStyle: { marginLeft: 5, marginRight: 3 },
                            }}
                            onPress={this.handleCreateGoal}
                            key={Math.random().toString(36).substr(2, 9)}
                        />
                    </Animated.View>
                    {this.renderCancelButton()}
                </View>
            </View>
        )
    }
}

const ActionButton = (props) => {
    const { text, source, style, onPress } = props
    const { containerStyle, iconStyle, textStyle } = actionButtonStyles
    return (
        <TouchableOpacity
            activeOpacity={0.6}
            style={containerStyle}
            onPress={onPress}
        >
            <Image
                style={{ ...iconStyle, ...style.iconStyle }}
                source={source}
            />
            <Text style={{ ...textStyle, ...style.textStyle }}>{text}</Text>
        </TouchableOpacity>
    )
}

const actionButtonStyles = {
    containerStyle: {
        backgroundColor: color.GM_BLUE,
        height: 35,
        width: 80,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 2,
    },
    iconStyle: {
        height: 20,
        width: 20,
        tintColor: 'white',
    },
    textStyle: {
        fontSize: 12,
        color: 'white',
        marginLeft: 6,
    },
}

const styles = {
    wrapperStyle: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    containerStyle: {
        position: 'absolute',
        bottom: BUTTON_GROUP_BOTTOM_OFFSET,
        right: 15,
        alignItems: 'center',
    },
    iconContainerStyle: {
        height: 40,
        width: 40,
        borderRadius: 20,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#17B3EC',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 2,
    },
    iconStyle: {
        height: 20,
        width: 20,
        tintColor: 'white',
    },
    fullscreen: {
        opacity: 0,
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
}

export default connect(null, { closeCreateOverlay })(CreateGoalButtonOverlay)
