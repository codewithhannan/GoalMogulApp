/** @format */

import React from 'react'
import PropTypes from 'prop-types'
import {
    View,
    KeyboardAvoidingView,
    Modal,
    TouchableOpacity,
    Animated,
    PanResponder,
    Platform,
    Dimensions,
    Keyboard,
} from 'react-native'
import { IS_SMALL_PHONE } from '../../../styles'

const PADDING_TOP = IS_SMALL_PHONE ? 20 : 40
const WINDOW_HEIGHT = Dimensions.get('window').height - PADDING_TOP
const SUPPORTED_ORIENTATIONS = ['portrait', 'portrait-upside-down']

const AnimatedKeyboardAvoidingView = Animated.createAnimatedComponent(
    KeyboardAvoidingView
)

/**
 * This bottom sheet uses https://github.com/nysamnang/react-native-raw-bottom-sheet#readme
 * and follows the pattern https://developer.apple.com/design/human-interface-guidelines/ios/app-architecture/modality/
 */
class BottomSheet extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            isFullScreen: false,
            hasModalMoved: false,
        }
        ;(this.pan = new Animated.ValueXY({ x: 0, y: props.height })),
            (this.animatedHeight = new Animated.Value(props.height)),
            (this.animatedOpacity = new Animated.Value(0)),
            (this.childernAnimatedProps = props.children
                ? props.children.map((item) =>
                      item &&
                      item.props &&
                      item.props.fadeInOnFullScreen &&
                      item.props.style &&
                      item.props.style.height
                          ? {
                                height: new Animated.Value(0),
                                opacity: new Animated.Value(0),
                            }
                          : null
                  )
                : []),
            this.createPanResponder(props)
    }

    fadeAnimations = (duration, fadeIn) =>
        this.childernAnimatedProps
            .map((val, i) => {
                if (!val) return null
                const animations = [
                    Animated.timing(val.height, {
                        useNativeDriver: false,
                        toValue: fadeIn
                            ? this.props.children[i].props.style.height
                            : 0,
                        duration: duration / 2,
                    }),
                    Animated.timing(val.opacity, {
                        useNativeDriver: false,
                        toValue: fadeIn ? 1 : 0,
                        duration: duration / 2,
                    }),
                ]
                return Animated.sequence(
                    fadeIn ? animations : animations.reverse()
                )
            })
            .filter((val) => val !== null)

    fullScreen() {
        const { openDuration } = this.props
        Animated.parallel([
            Animated.timing(this.animatedHeight, {
                toValue: WINDOW_HEIGHT,
                duration: openDuration,
                useNativeDriver: false,
            }),
            this.resetPanAnimation(openDuration),
            ...this.fadeAnimations(openDuration, true),
        ]).start(() => this.setState({ isFullScreen: true }))
    }

    minimize() {
        const { closeDuration } = this.props
        Animated.parallel([
            Animated.timing(this.animatedHeight, {
                toValue: this.props.height,
                duration: closeDuration,
                useNativeDriver: false,
            }),
            this.resetPanAnimation(closeDuration),
            ...this.fadeAnimations(closeDuration, false),
        ]).start(() => this.setState({ isFullScreen: false }))
    }

    resetPanAnimation = (duration) =>
        Animated.timing(this.pan, {
            useNativeDriver: false,
            toValue: { x: 0, y: 0 },
            duration,
        })

    setModalVisible(visible, props) {
        const {
            height,
            openDuration,
            closeDuration,
            onClose,
            onOpen,
        } = this.props
        if (visible) {
            this.setState({ modalVisible: visible })
            Animated.parallel([
                Animated.timing(this.pan, {
                    useNativeDriver: false,
                    toValue: { x: 0, y: 0 },
                    duration: openDuration,
                }),
                Animated.timing(this.animatedOpacity, {
                    useNativeDriver: false,
                    toValue: 1,
                    duration: openDuration,
                }),
            ]).start(() => {
                if (typeof onOpen === 'function') onOpen(props)
            })
        } else {
            Animated.parallel([
                Animated.timing(this.pan, {
                    useNativeDriver: false,
                    toValue: { x: 0, y: height },
                    duration: closeDuration,
                }),
                Animated.timing(this.animatedOpacity, {
                    useNativeDriver: false,
                    toValue: 0,
                    duration: closeDuration,
                }),
            ]).start(() => {
                this.setState({
                    modalVisible: visible,
                    isFullScreen: false,
                })
                if (typeof onClose === 'function') onClose(props)
            })
        }
    }

    createPanResponder(props) {
        const {
            fullScreenGesturesEnabled,
            swipeToCloseGestureEnabled,
            height,
            swipeGestureSenstivity,
        } = props
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () =>
                swipeToCloseGestureEnabled || fullScreenGesturesEnabled,
            onPanResponderMove: (e, gestureState) => {
                const { isFullScreen, hasModalMoved } = this.state

                if (gestureState.dy > 0)
                    Animated.event([null, { dy: this.pan.y }], {
                        useNativeDriver: false,
                    })(e, gestureState)
                else if (!isFullScreen)
                    Animated.timing(this.animatedHeight, {
                        useNativeDriver: false,
                        toValue: height - gestureState.dy,
                        duration: 1,
                    }).start()
                else return

                if (!hasModalMoved) this.setState({ hasModalMoved: true })
            },
            onPanResponderRelease: (e, gestureState) => {
                const { isFullScreen, hasModalMoved } = this.state
                // Close/fullscreen/minimize when gesture velocity or distance hits the thereashold
                if (
                    swipeToCloseGestureEnabled &&
                    ((!isFullScreen &&
                        (height - gestureState.dy < height / 2 ||
                            gestureState.vy > 1.5 * swipeGestureSenstivity)) ||
                        (isFullScreen &&
                            (WINDOW_HEIGHT - gestureState.dy < height / 2 ||
                                gestureState.vy > 3 * swipeGestureSenstivity)))
                ) {
                    this.setModalVisible(false)
                } else if (
                    fullScreenGesturesEnabled &&
                    !isFullScreen &&
                    (gestureState.dy < -this.modalHeight / 2 ||
                        gestureState.dy < -this.maskHeight / 2 ||
                        gestureState.vy < -1.5 * swipeGestureSenstivity)
                ) {
                    this.fullScreen()
                } else if (
                    fullScreenGesturesEnabled &&
                    isFullScreen &&
                    (gestureState.dy > this.modalHeight / 2 ||
                        gestureState.dy > (WINDOW_HEIGHT - height) / 2 ||
                        gestureState.vy > 0.75 * swipeGestureSenstivity)
                ) {
                    this.minimize()
                } else if (hasModalMoved) {
                    Animated.parallel([
                        Animated.spring(this.pan, {
                            toValue: { x: 0, y: 0 },
                            useNativeDriver: false,
                        }),
                        Animated.spring(this.animatedHeight, {
                            toValue: isFullScreen ? WINDOW_HEIGHT : height,
                            useNativeDriver: false,
                        }),
                    ]).start()
                } else {
                    // Only dismiss keyboard if user is not trying to resize the modal
                    Keyboard.dismiss()
                }
                this.setState({ hasModalMoved: false })
            },
        })
    }

    open(props) {
        this.setModalVisible(true, props)
    }

    close(props) {
        this.setModalVisible(false, props)
    }

    render() {
        const {
            animationType,
            swipeToCloseGestureEnabled,
            dragFromTopOnly,
            closeOnPressMask,
            closeOnPressBack,
            children,
            customStyles,
        } = this.props
        const { modalVisible } = this.state
        return (
            <Modal
                transparent
                animationType={animationType}
                visible={modalVisible}
                supportedOrientations={SUPPORTED_ORIENTATIONS}
                onRequestClose={() => {
                    if (closeOnPressBack) this.setModalVisible(false)
                }}
            >
                <AnimatedKeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={[
                        styles.wrapper,
                        customStyles.wrapper,
                        { opacity: this.animatedOpacity },
                    ]}
                >
                    <TouchableOpacity
                        onLayout={(event) => {
                            this.maskHeight = event.nativeEvent.layout.height
                        }}
                        style={styles.mask}
                        activeOpacity={1}
                        onPress={() => (closeOnPressMask ? this.close() : null)}
                    />
                    <Animated.View
                        {...(!dragFromTopOnly && this.panResponder.panHandlers)}
                        onLayout={(event) => {
                            this.modalHeight = event.nativeEvent.layout.height
                        }}
                        style={[
                            styles.container,
                            {
                                height: this.animatedHeight,
                                transform: this.pan.getTranslateTransform(),
                            },
                            customStyles.container,
                        ]}
                    >
                        {swipeToCloseGestureEnabled && (
                            <View
                                {...(dragFromTopOnly &&
                                    this.panResponder.panHandlers)}
                                style={styles.draggableContainer}
                            >
                                <View
                                    style={[
                                        styles.draggableIcon,
                                        customStyles.draggableIcon,
                                    ]}
                                />
                            </View>
                        )}
                        {children.map((item, i) =>
                            item &&
                            item.props &&
                            item.props.fadeInOnFullScreen &&
                            this.childernAnimatedProps[i] ? (
                                <Animated.View
                                    style={{
                                        height: this.childernAnimatedProps[i]
                                            .height,
                                        opacity: this.childernAnimatedProps[i]
                                            .opacity,
                                    }}
                                >
                                    {item}
                                </Animated.View>
                            ) : (
                                item
                            )
                        )}
                    </Animated.View>
                </AnimatedKeyboardAvoidingView>
            </Modal>
        )
    }
}

const styles = {
    wrapper: {
        flex: 1,
        backgroundColor: '#00000077',
        paddingTop: PADDING_TOP,
    },
    mask: {
        flex: 1,
    },
    container: {
        backgroundColor: '#fff',
        width: '100%',
        height: 0,
        overflow: 'hidden',
    },
    draggableContainer: {
        width: '100%',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    draggableIcon: {
        width: 35,
        height: 5,
        borderRadius: 5,
        margin: 10,
        backgroundColor: '#ccc',
    },
}

export default BottomSheet

BottomSheet.propTypes = {
    animationType: PropTypes.oneOf(['none', 'slide', 'fade']),
    height: PropTypes.number,
    swipeGestureSenstivity: PropTypes.number,
    openDuration: PropTypes.number,
    closeDuration: PropTypes.number,
    fullScreenGesturesEnabled: PropTypes.bool,
    swipeToCloseGestureEnabled: PropTypes.bool,
    closeOnPressMask: PropTypes.bool,
    dragFromTopOnly: PropTypes.bool,
    closeOnPressBack: PropTypes.bool,
    customStyles: PropTypes.objectOf(PropTypes.object),
    onClose: PropTypes.func,
    onOpen: PropTypes.func,
    children: PropTypes.node,
}

BottomSheet.defaultProps = {
    animationType: 'none',
    height: 150,
    swipeGestureSenstivity: 1,
    openDuration: 400,
    closeDuration: 250,
    fullScreenGesturesEnabled: false,
    swipeToCloseGestureEnabled: true,
    dragFromTopOnly: false,
    closeOnPressMask: true,
    closeOnPressBack: true,
    customStyles: {
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
        paddingHorizontal: 16,
    },
    onClose: null,
    onOpen: null,
    children: <View />,
}
