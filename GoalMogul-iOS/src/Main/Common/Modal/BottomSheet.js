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
    Keyboard,
    ScrollView,
    SafeAreaView,
} from 'react-native'
import { color } from '../../../styles/basic'

const SUPPORTED_ORIENTATIONS = ['portrait', 'portrait-upside-down']

const AnimatedKeyboardAvoidingView = Animated.createAnimatedComponent(
    KeyboardAvoidingView
)
const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView)

/**
 * Bottom sheet props:
 * @param sheetHeader: fades in on fullscreen, needs a height style to work
 * @param sheetFooter: always visible and sticks to bottom of the sheet
 *
 * BottomSheet supports component fade-in (on switch fullscreen) and fade-out (on switch to half-screen)
 * To apply that to a component that make sure:
 * - it is at root level of Bottom Sheet as this will only work for components at root level
 * - it has a height style attribute
 * - to add the fadeInOnFullScreen as a prop your component
 * @example
 * 'ex1: to use it on this componen like:' <View />
 * 'change it to:' <View fadeInOnFullScreen style={{ height: 10 }} />
 *
 * 'ex2: in the following sceneario:'
 *  <BottomSheet>
 *      <View1 fadeInOnFullScreen style={{ height: 10 }} />
 *      <View2>
 *          <View3 fadeInOnFullScreen style={{ height: 10 }} />
 *      </View>
 *  </BottomSheet>
 * 'fade-in/out animations will only work for View1 not View3 because it is not at root level'
 */
class BottomSheet extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            isFullScreen: false,
            hasModalMoved: false,
        }
        this.pan = new Animated.ValueXY({ x: 0, y: props.height })
        this.animatedHeight = new Animated.Value(props.height)
        this.animatedOpacity = new Animated.Value(0)
        this.headerAnimatedProps = {
            height: new Animated.Value(0),
            opacity: new Animated.Value(0),
        }
        this.childernAnimatedProps = props.children
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
            : []
        this.createPanResponder(props)
    }

    childsAnimations = (fadeIn, duration) =>
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

    headerAnimations = (fadeIn, duration) => {
        const { sheetHeader } = this.props
        if (!sheetHeader || !sheetHeader.props || !sheetHeader.props.style)
            return null
        const animations = [
            Animated.timing(this.headerAnimatedProps.height, {
                useNativeDriver: false,
                toValue: fadeIn ? sheetHeader.props.style.height : 0,
                duration: duration / 2,
            }),
            Animated.timing(this.headerAnimatedProps.opacity, {
                useNativeDriver: false,
                toValue: fadeIn ? 1 : 0,
                duration: duration / 2,
            }),
        ]
        return Animated.sequence(fadeIn ? animations : animations.reverse())
    }

    resetPanAnimation = (duration) =>
        Animated.timing(this.pan, {
            useNativeDriver: false,
            toValue: { x: 0, y: 0 },
            duration,
        })

    getFullScreenHeight = () => this.maodalHeight + this.maskHeight - 25

    fullScreen() {
        const { openDuration, onFullScreen } = this.props
        Animated.parallel([
            Animated.timing(this.animatedHeight, {
                toValue: this.getFullScreenHeight(),
                duration: openDuration,
                useNativeDriver: false,
            }),
            this.resetPanAnimation(openDuration),
            this.headerAnimations(true, openDuration),
            ...this.childsAnimations(true, openDuration),
        ]).start(() => {
            if (typeof onFullScreen === 'function') onFullScreen(props)
            this.setState({ isFullScreen: true })
        })
    }

    minimize() {
        const { closeDuration, onMinimize } = this.props
        Animated.parallel([
            Animated.timing(this.animatedHeight, {
                toValue: this.props.height,
                duration: closeDuration,
                useNativeDriver: false,
            }),
            this.resetPanAnimation(closeDuration),
            this.headerAnimations(false, closeDuration),
            ...this.childsAnimations(false, closeDuration),
        ]).start(() => {
            this.setState({ isFullScreen: false })
            if (typeof onMinimize === 'function') onMinimize(props)
        })
    }

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
        } = props
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () =>
                swipeToCloseGestureEnabled || fullScreenGesturesEnabled,
            onPanResponderMove: (e, gestureState) => {
                const { isFullScreen, hasModalMoved } = this.state
                if (gestureState.dy > 0) {
                    if (!isFullScreen)
                        Animated.event([null, { dy: this.pan.y }], {
                            useNativeDriver: false,
                        })(e, gestureState)
                    else
                        Animated.timing(this.animatedHeight, {
                            useNativeDriver: false,
                            toValue:
                                this.getFullScreenHeight() - gestureState.dy,
                            duration: 1,
                        }).start()
                } else if (!isFullScreen)
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
                    !isFullScreen &&
                    (height - gestureState.dy < height / 2 ||
                        gestureState.vy > 1.5)
                ) {
                    this.setModalVisible(false)
                }
                if (
                    fullScreenGesturesEnabled &&
                    !isFullScreen &&
                    gestureState.dy < -40
                ) {
                    this.fullScreen()
                } else if (
                    fullScreenGesturesEnabled &&
                    isFullScreen &&
                    gestureState.dy > 40
                ) {
                    this.minimize()
                } else if (hasModalMoved) {
                    Animated.parallel([
                        Animated.spring(this.pan, {
                            toValue: { x: 0, y: 0 },
                            useNativeDriver: false,
                        }),
                        Animated.spring(this.animatedHeight, {
                            toValue: isFullScreen
                                ? this.getFullScreenHeight()
                                : height,
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
            closeOnPressMask,
            closeOnPressBack,
            children,
            sheetHeader,
            sheetFooter,
            customStyles,
        } = this.props
        const { modalVisible, isFullScreen } = this.state
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
                    <SafeAreaView style={styles.mask}>
                        <TouchableOpacity
                            style={styles.mask}
                            onLayout={(e) =>
                                (this.maskHeight = e.nativeEvent.layout.height)
                            }
                            activeOpacity={1}
                            onPress={() =>
                                closeOnPressMask ? this.close() : null
                            }
                        />
                    </SafeAreaView>
                    <AnimatedSafeAreaView
                        style={[
                            styles.container,
                            { transform: this.pan.getTranslateTransform() },
                        ]}
                    >
                        <Animated.View
                            onLayout={(e) =>
                                (this.maodalHeight =
                                    e.nativeEvent.layout.height)
                            }
                            style={{
                                height: this.animatedHeight,
                            }}
                        >
                            {swipeToCloseGestureEnabled && (
                                <View
                                    {...this.panResponder.panHandlers}
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
                            <Animated.View
                                style={{
                                    height: this.headerAnimatedProps.height,
                                    opacity: this.headerAnimatedProps.opacity,
                                }}
                            >
                                {sheetHeader}
                            </Animated.View>
                            <ScrollView
                                scrollEnabled={isFullScreen}
                                style={[{ flex: 1 }, customStyles.container]}
                            >
                                {children.map((item, i) =>
                                    item &&
                                    item.props &&
                                    item.props.fadeInOnFullScreen &&
                                    this.childernAnimatedProps[i] ? (
                                        <Animated.View
                                            style={{
                                                height: this
                                                    .childernAnimatedProps[i]
                                                    .height,
                                                opacity: this
                                                    .childernAnimatedProps[i]
                                                    .opacity,
                                            }}
                                        >
                                            {item}
                                        </Animated.View>
                                    ) : (
                                        item
                                    )
                                )}
                            </ScrollView>
                            {sheetFooter}
                        </Animated.View>
                    </AnimatedSafeAreaView>
                </AnimatedKeyboardAvoidingView>
            </Modal>
        )
    }
}

const styles = {
    wrapper: {
        flex: 1,
        backgroundColor: '#00000077',
    },
    mask: {
        flex: 1,
    },
    container: {
        backgroundColor: color.GM_CARD_BACKGROUND,
        overflow: 'hidden',
    },
    draggableContainer: {
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
    fadeDuration: PropTypes.number,
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
    onFullScreen: PropTypes.func,
    onMinimize: PropTypes.func,
    sheetHeader: PropTypes.node,
    children: PropTypes.node,
    sheetFooter: PropTypes.node,
}

BottomSheet.defaultProps = {
    animationType: 'none',
    height: 150,
    openDuration: 400,
    closeDuration: 400,
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
    onFullScreen: null,
    onMinimize: null,
    sheetHeader: <View />,
    children: <View />,
    sheetFooter: <View />,
}
