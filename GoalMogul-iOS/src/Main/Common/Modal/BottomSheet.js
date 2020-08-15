/** @format */

import React from 'react'
import PropTypes from 'prop-types'
import {
    View,
    Modal,
    TouchableOpacity,
    Animated,
    PanResponder,
    Keyboard,
    ScrollView,
    SafeAreaView,
} from 'react-native'
import { color } from '../../../styles/basic'
import { MenuProvider } from 'react-native-popup-menu'

const SUPPORTED_ORIENTATIONS = ['portrait', 'portrait-upside-down']
const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView)
const FULL_SCREEN_TOP_OFFSET = 25

/**
 * Bottom sheet props:
 * @param sheetHeader: fades in on fullscreen, needs a height style to work
 * @param sheetFooter: always visible and sticks to bottom of the sheet
 * @param childeren: all components wrapped inside bottomSheet will be passed in as children prop
 *
 * BotomSheet is also wraps its components inside a MenuProvider
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
        this.animatedPaddingBottom = new Animated.Value(0)
        this.animatedOpacity = new Animated.Value(0)
        this.animatedHeaderStyles = {
            height: new Animated.Value(0),
            opacity: new Animated.Value(0),
        }

        const { children } = props
        this.animatedChildrenStyles = !Array.isArray(children)
            ? []
            : children.map((item) => {
                  if (hasFadeAnimationProps(item)) {
                      return {
                          fadeInHeight: item.props.style.height,
                          height: new Animated.Value(0),
                          opacity: new Animated.Value(0),
                      }
                  } else return null
              })

        this.createPanResponder()
        this.close = this.close.bind(this)
        this.keyboardWillShow = this.keyboardWillShow.bind(this)
        this.keyboardWillHide = this.keyboardWillHide.bind(this)
    }

    componentDidMount() {
        this.keyboardWillShowListener = Keyboard.addListener(
            'keyboardWillShow',
            this.keyboardWillShow
        )
        this.keyboardWillHideListener = Keyboard.addListener(
            'keyboardWillHide',
            this.keyboardWillHide
        )
    }

    componentWillUpdate(nextProps) {
        const offset = Math.abs(nextProps.height - this.props.height)
        if (offset > 0 && !this.state.isFullScreen && this.state.modalVisible) {
            Animated.timing(this.animatedHeight, {
                toValue: nextProps.height,
                duration: 1,
                useNativeDriver: false,
            }).start(
                () =>
                    this.props.onPropsHeightChange &&
                    this.props.onPropsHeightChange()
            )
        }
    }

    componentWillUnmount() {
        this.keyboardWillShowListener.remove()
        this.keyboardWillHideListener.remove()
    }

    keyboardWillShow = (e) => {
        const { isFullScreen } = this.state
        const keyBoardHeight = e.endCoordinates.height
        const keyboardAvoidAnimation = Animated.timing(
            this.animatedPaddingBottom,
            {
                useNativeDriver: false,
                toValue: keyBoardHeight,
                duration: e.duration,
            }
        )
        if (isFullScreen) {
            const newHeight = this.modalHeight - keyBoardHeight
            Animated.parallel([
                Animated.timing(this.animatedHeight, {
                    useNativeDriver: false,
                    toValue: newHeight,
                    duration: e.duration,
                }),
                keyboardAvoidAnimation,
            ]).start()
        } else keyboardAvoidAnimation.start()
    }

    keyboardWillHide = (e) => {
        const { isFullScreen } = this.state
        const keyBoardHeight = e.endCoordinates.height
        const keyboardAvoidAnimation = Animated.timing(
            this.animatedPaddingBottom,
            {
                useNativeDriver: false,
                toValue: 0,
                duration: e.duration,
            }
        )
        if (isFullScreen) {
            const newHeight = this.modalHeight + keyBoardHeight
            Animated.parallel([
                Animated.timing(this.animatedHeight, {
                    useNativeDriver: false,
                    toValue: newHeight,
                    duration: e.duration,
                }),
                keyboardAvoidAnimation,
            ]).start()
        } else keyboardAvoidAnimation.start()
    }

    childrenAnimations = (fadeIn, duration) =>
        this.animatedChildrenStyles
            .map((val) => {
                if (!val) return null
                const animations = [
                    Animated.timing(val.height, {
                        useNativeDriver: false,
                        toValue: fadeIn ? val.fadeInHeight : 0,
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

    headerAnimation = (fadeIn, duration) => {
        const { sheetHeader } = this.props
        if (!sheetHeader || !sheetHeader.props || !sheetHeader.props.style)
            return null
        const animations = [
            Animated.timing(this.animatedHeaderStyles.height, {
                useNativeDriver: false,
                toValue: fadeIn ? sheetHeader.props.style.height : 0,
                duration: duration / 2,
            }),
            Animated.timing(this.animatedHeaderStyles.opacity, {
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

    getFullScreenHeight = () =>
        this.modalHeight + this.maskHeight - FULL_SCREEN_TOP_OFFSET

    fullScreen() {
        const { openDuration, onFullScreen } = this.props
        Animated.parallel([
            Animated.timing(this.animatedHeight, {
                toValue: this.getFullScreenHeight(),
                duration: openDuration,
                useNativeDriver: false,
            }),
            this.resetPanAnimation(openDuration),
            this.headerAnimation(true, openDuration),
            ...this.childrenAnimations(true, openDuration),
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
            this.headerAnimation(false, closeDuration),
            ...this.childrenAnimations(false, closeDuration),
        ]).start(() => {
            this.setState({ isFullScreen: false })
            if (typeof onMinimize === 'function') onMinimize(props)
        })
    }

    setModalVisible(visible) {
        const {
            height,
            openDuration,
            closeDuration,
            onClose,
            onOpen,
        } = this.props
        if (visible) {
            this.setState({ modalVisible: true })
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
                if (typeof onOpen === 'function') onOpen()
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
                if (typeof onClose === 'function') {
                    onClose(() =>
                        this.setState({
                            modalVisible: false,
                            isFullScreen: false,
                        })
                    )
                } else {
                    this.setState({
                        modalVisible: false,
                        isFullScreen: false,
                    })
                }
            })
        }
    }

    createPanResponder() {
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => {
                const {
                    fullScreenGesturesEnabled,
                    swipeToCloseGestureEnabled,
                } = this.props
                return swipeToCloseGestureEnabled || fullScreenGesturesEnabled
            },
            onPanResponderMove: (e, gestureState) => {
                const { isFullScreen, hasModalMoved } = this.state
                const { fullScreenGesturesEnabled, height } = this.props
                // Swiping down
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
                }
                // else Swiping up
                else if (!isFullScreen && fullScreenGesturesEnabled)
                    Animated.timing(this.animatedHeight, {
                        useNativeDriver: false,
                        toValue: height - gestureState.dy,
                        duration: 1,
                    }).start()
                else return
                if (!hasModalMoved) this.setState({ hasModalMoved: true })
            },
            onPanResponderRelease: (e, gestureState) => {
                const {
                    fullScreenGesturesEnabled,
                    swipeToCloseGestureEnabled,
                    height,
                } = this.props
                const { isFullScreen, hasModalMoved } = this.state
                // Close/fullscreen/minimize when gesture velocity or distance hits the thereashold
                if (
                    swipeToCloseGestureEnabled &&
                    !isFullScreen &&
                    gestureState.dy > 80
                ) {
                    this.close()
                } else if (
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
                    // Only dismiss keyboard if user is not trying to move the modal
                    Keyboard.dismiss()
                }
                this.setState({ hasModalMoved: false })
            },
        })
    }

    open() {
        this.setModalVisible(true)
    }

    close() {
        this.setModalVisible(false)
    }

    render() {
        const {
            animationType,
            swipeToCloseGestureEnabled,
            fullScreenGesturesEnabled,
            closeOnPressBack,
            children,
            sheetHeader,
            sheetFooter,
            customStyles,
        } = this.props
        const { modalVisible, isFullScreen } = this.state
        const scrollViewContent = !Array.isArray(children)
            ? children
            : children.map((item, i) => {
                  if (this.animatedChildrenStyles[i] !== null) {
                      return (
                          <Animated.View
                              style={{
                                  height: this.animatedChildrenStyles[i].height,
                                  opacity: this.animatedChildrenStyles[i]
                                      .opacity,
                              }}
                          >
                              {item}
                          </Animated.View>
                      )
                  } else return item
              })
        const showDragIcon =
            swipeToCloseGestureEnabled || fullScreenGesturesEnabled

        return (
            <Modal
                transparent
                animationType={animationType}
                visible={modalVisible}
                supportedOrientations={SUPPORTED_ORIENTATIONS}
                onRequestClose={() => {
                    if (closeOnPressBack) this.close()
                }}
            >
                <MenuProvider customStyles={{ backdrop: styles.backdrop }}>
                    <Animated.View
                        style={[
                            styles.wrapper,
                            customStyles.wrapper,
                            {
                                opacity: this.animatedOpacity,
                                paddingBottom: this.animatedPaddingBottom,
                            },
                        ]}
                    >
                        <SafeAreaView style={styles.mask}>
                            <TouchableOpacity
                                style={styles.mask}
                                onLayout={({ nativeEvent }) =>
                                    (this.maskHeight =
                                        nativeEvent.layout.height)
                                }
                                activeOpacity={1}
                                disabled={!closeOnPressBack || isFullScreen}
                                onPress={this.close}
                            />
                        </SafeAreaView>
                        <AnimatedSafeAreaView
                            {...(!isFullScreen &&
                                this.panResponder.panHandlers)}
                            style={[
                                styles.container,
                                { transform: this.pan.getTranslateTransform() },
                            ]}
                        >
                            <Animated.View // Do not set pan handlers on fullScreen because Scroll View is Enabled
                                onLayout={({ nativeEvent }) =>
                                    (this.modalHeight =
                                        nativeEvent.layout.height)
                                }
                                style={{ height: this.animatedHeight }}
                            >
                                <View
                                    // set pan handlers here on fullScreen because Scroll View is Enabled
                                    {...(isFullScreen &&
                                        this.panResponder.panHandlers)}
                                >
                                    {showDragIcon && (
                                        <View style={styles.draggableContainer}>
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
                                            height: this.animatedHeaderStyles
                                                .height,
                                            opacity: this.animatedHeaderStyles
                                                .opacity,
                                        }}
                                    >
                                        {sheetHeader}
                                    </Animated.View>
                                </View>
                                <ScrollView
                                    scrollEnabled={isFullScreen}
                                    style={[
                                        { flex: 1 },
                                        customStyles.container,
                                    ]}
                                >
                                    {scrollViewContent}
                                </ScrollView>
                                {sheetFooter}
                            </Animated.View>
                        </AnimatedSafeAreaView>
                    </Animated.View>
                </MenuProvider>
            </Modal>
        )
    }
}

const styles = {
    backdrop: {
        backgroundColor: 'gray',
        opacity: 0.5,
    },
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

const hasFadeAnimationProps = (item) => {
    return (
        item &&
        item.props &&
        item.props.fadeInOnFullScreen &&
        item.props.style &&
        item.props.style.height
    )
}

export default BottomSheet

BottomSheet.propTypes = {
    animationType: PropTypes.oneOf(['none', 'slide', 'fade']),
    height: PropTypes.number,
    openDuration: PropTypes.number,
    closeDuration: PropTypes.number,
    fullScreenGesturesEnabled: PropTypes.bool,
    swipeToCloseGestureEnabled: PropTypes.bool,
    dragFromTopOnly: PropTypes.bool,
    closeOnPressBack: PropTypes.bool,
    customStyles: PropTypes.objectOf(PropTypes.object),
    onClose: PropTypes.func,
    onOpen: PropTypes.func,
    onFullScreen: PropTypes.func,
    onMinimize: PropTypes.func,
    onPropsHeightChange: PropTypes.func,
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
    onPropsHeightChange: null,
    sheetHeader: <View />,
    children: <View />,
    sheetFooter: <View />,
}
