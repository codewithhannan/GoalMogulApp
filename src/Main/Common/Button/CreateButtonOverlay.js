/**
 * ********************************************************
 * FILENAME: CreateButtonOverlay.js    TYPE: Component
 *
 * DESCRIPTION:
 *      Render a menu of buttons.
 *
 * NOTE:
 * 			This component is an abstraction of CreateGoalButtonOverlay.
 * By passing in two sets of icons and texts and corresponding functions,
 * it will render an overlay of selection buttons.
 *
 * AUTHOR: Jia Zeng
 * EDITED: Yanxiang Lan			NOTE: Style updates.
 * *********************************************************
 *
 * @format
 */

import { Button, List, Text, withStyles } from '@ui-kitten/components'
import React, { Component } from 'react'
import {
    Animated,
    Image,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
/* asset */
import cancel from '../../../asset/utils/cancel_no_background.png'
/* actions */
import { closeCreateOverlay } from '../../../redux/modules/home/mastermind/actions'
import { color } from '../../../styles/basic'
import {
    DEVICE_MODEL,
    IPHONE_MODELS_2,
    IPHONE_MODELS_3,
} from '../../../Utils/Constants'
import DelayedButton from './DelayedButton'

const BUTTON_GROUP_BOTTOM_OFFSET = IPHONE_MODELS_3.includes(DEVICE_MODEL)
    ? 106
    : IPHONE_MODELS_2.includes(DEVICE_MODEL)
    ? 106
    : 71

class CreateButtonOverlay extends Component {
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
        const { onCancel } = this.props
        if (onCancel) {
            onCancel()
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

    handleActionSelect = (selectedButtonName) => {
        // remove overlay
        Actions.pop()
        const { onActionSelect } = this.props
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
            if (onActionSelect) {
                onActionSelect(selectedButtonName)
            }
        })
    }

    renderCancelButton(cancelButtonStyle, onPress) {
        return (
            <Animated.View
                style={{
                    transform: [
                        {
                            rotate: this.spinAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0deg', '180deg'],
                            }),
                        },
                    ],
                    opacity: this.fadeAnim,
                    alignSelf: 'flex-end',
                }}
            >
                <TouchableWithoutFeedback
                    activeOpacity={0.85}
                    style={{
                        ...styles.iconContainer,
                        backgroundColor: 'transparent',
                    }}
                    onPress={this.handleCancel}
                >
                    <DelayedButton
                        onPress={onPress}
                        style={[cancelButtonStyle, styles.cancelButton]}
                    >
                        <Animated.Image style={styles.icon} source={cancel} />
                    </DelayedButton>
                </TouchableWithoutFeedback>
            </Animated.View>
        )
    }

    renderActionButtons() {
        const { buttons } = this.props

        return (
            <Animated.View
                style={{
                    opacity: this.fadeAnim,
                    marginBottom: 12,
                }}
            >
                <List
                    style={styles.menuContainer}
                    data={buttons}
                    renderItem={this.renderActionButton()}
                />
            </Animated.View>
        )
    }

    renderActionButton = () => (info) => {
        const { name, iconSource, text, onPress } = info.item

        return (
            <Animated.View
                style={{
                    opacity: this.fadeAnim,
                    position: 'relative',
                    // transform: [
                    //   {
                    //     translateY: this.fadeAnim.interpolate({
                    //       inputRange: [0, 1],
                    //       outputRange: [itemCount - info.index * 30, 0],
                    //     }),
                    //   },
                    // ],
                }}
                key={Math.random().toString(36).substr(2, 9)}
            >
                <Button
                    accessoryLeft={this.renderIcon(
                        iconSource,
                        styles.actionButtonIcon
                    )}
                    style={styles.actionButton}
                    status="basic"
                    onPress={() => {
                        this.handleActionSelect(name)
                        onPress()
                    }}
                >
                    {text}
                </Button>
            </Animated.View>
        )
    }

    /**
     * Return a function which returns an image corresponding to iconSource.
     * @param {String} iconSource source of icon
     */
    renderIcon = (iconSource, style) => () => {
        return <Image style={style} source={iconSource} />
    }

    render() {
        const { eva } = this.props

        return (
            <View style={{ ...styles.wrapper }}>
                <TouchableWithoutFeedback onPress={this.handleCancel}>
                    <Animated.View
                        style={[
                            styles.fullscreen,
                            {
                                opacity: this.fadeAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, 0.3],
                                }),
                                backgroundColor: '#000',
                            },
                        ]}
                    ></Animated.View>
                </TouchableWithoutFeedback>
                <View style={styles.container}>
                    {this.renderActionButtons()}
                    {this.renderCancelButton(
                        eva.style.cancelButtonBackground,
                        this.handleCancel
                    )}
                </View>
            </View>
        )
    }
}

/**
 * @deprecated
 * @param {*} props
 */
const ActionButton = (props) => {
    const { text, source, style, onPress } = props
    const { containerStyle, iconStyle, textStyle } = actionButtonStyles
    return (
        <TouchableOpacity
            activeOpacity={0.6}
            style={{ ...containerStyle, ...style.customContainerStyle }}
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

/**
 * @deprecated
 */
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

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    container: {
        position: 'absolute',
        bottom: BUTTON_GROUP_BOTTOM_OFFSET,
        right: 29,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 2,
        alignItems: 'center',
    },
    menuContainer: {
        flexGrow: 0,
        borderRadius: 5,
    },
    iconContainer: {
        height: 54,
        width: 54,
        borderRadius: 27,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#17B3EC',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 2,
    },
    icon: {
        height: 20,
        width: 20,
        tintColor: 'white',
    },
    actionButtonIcon: {
        height: 20,
        width: 20,
        tintColor: 'black',
    },
    actionButton: {
        borderRadius: 0,
    },
    cancelButton: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 180,
    },
    fullscreen: {
        opacity: 0,
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
})

/**
 * Map application theme variables into style objects
 * @param {JSON} theme
 */
const mapThemeToStyles = (theme) =>
    StyleSheet.create({
        cancelButtonBackground: {
            backgroundColor: theme['color-danger-500'],
        },
    })

export default connect(null, { closeCreateOverlay })(
    withStyles(CreateButtonOverlay, mapThemeToStyles)
)
