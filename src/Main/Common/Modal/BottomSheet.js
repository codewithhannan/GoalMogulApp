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
    Platform,
} from 'react-native'
import { color } from '../../../styles/basic'
import { MenuProvider } from 'react-native-popup-menu'
import { IS_SMALL_PHONE } from '../../../styles'

const SUPPORTED_ORIENTATIONS = ['portrait', 'portrait-upside-down']

const FULL_SCREEN_TOP_OFFSET = 25
const PADDING_TOP = IS_SMALL_PHONE ? 20 : 40
const PADDING_BOTTOM = IS_SMALL_PHONE ? 0 : 40

/**
 * Bottom sheet props:
 * @param onOpen: Called right before open animation
 * @param onClose: Called right after close animation
 * @param sheetHeader: fades in on fullscreen, needs a height style to work
 * @param sheetFooter: always visible and sticks to bottom of the sheet
 * @param childeren: all components wrapped inside bottomSheet will be passed in as children prop
 * @param keyboardShouldPersistTaps: "never": closes keyboard on tap,
 *                                   "always": never closes keyboard on tap,
 *                                   "handled": closes keyboard on tap if tap is not being handled by a child component
 *
 * BotomSheet also wraps its components inside a MenuProvider from 'react-native-popup-menu' library
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
class BottomSheet extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            isFullScreen: false,
        }
        this.keyBoardHeight = 0
        this.pan = new Animated.ValueXY({ x: 0, y: props.height })
        this.animatedHeight = new Animated.Value(props.height + PADDING_BOTTOM)
        this.animatedPaddingBottom = new Animated.Value(PADDING_BOTTOM)
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

    shouldComponentUpdate(nextProps) {
        // in cases the height props is changed dynamically this will re adjust the view's height
        // Fullscreen animations are done by changing modal's height,
        // whereas modal open close animations are done by moving the whole modal
        // Hence we check if modal is inFullScreen state
        if (nextProps.height != this.props.height && !this.state.isFullScreen) {
            this.props.onPropsHeightChange && this.props.onPropsHeightChange()
            const newHeight =
                this.getMiniModalHeight() - this.props.height + nextProps.height
            this.animatedHeight = new Animated.Value(newHeight)
        }
        return true
    }

    componentWillUnmount() {
        this.keyboardWillShowListener.remove()
        this.keyboardWillHideListener.remove()
    }

    keyboardWillShow = (e) => {
        const { isFullScreen } = this.state
        this.keyBoardHeight = e.endCoordinates.height
        const keyboardAvoidAnimation = Animated.timing(
            this.animatedPaddingBottom,
            {
                useNativeDriver: false,
                toValue: this.keyBoardHeight,
                duration: e.duration,
            }
        )
        if (!isFullScreen) {
            Animated.parallel([
                Animated.timing(this.animatedHeight, {
                    useNativeDriver: false,
                    toValue: this.getMiniModalHeight(),
                    duration: e.duration,
                }),
                keyboardAvoidAnimation,
            ]).start()
        } else keyboardAvoidAnimation.start()
    }

    keyboardWillHide = (e) => {
        const { isFullScreen } = this.state
        this.keyBoardHeight = 0
        const keyboardAvoidAnimation = Animated.timing(
            this.animatedPaddingBottom,
            {
                useNativeDriver: false,
                toValue: PADDING_BOTTOM,
                duration: e.duration,
            }
        )
        if (!isFullScreen) {
            Animated.parallel([
                Animated.timing(this.animatedHeight, {
                    useNativeDriver: false,
                    toValue: this.getMiniModalHeight(),
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
        this.modalHeight +
        this.maskHeight -
        FULL_SCREEN_TOP_OFFSET -
        PADDING_TOP

    getMiniModalHeight = () =>
        this.props.height + (this.keyBoardHeight || PADDING_BOTTOM)

    fullScreen() {
        const { openDuration, onFullScreen } = this.props
        this.setState({ isFullScreen: true })
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
        })
    }

    minimize() {
        const { closeDuration, onMinimize } = this.props
        this.setState({ isFullScreen: false })
        Animated.parallel([
            Animated.timing(this.animatedHeight, {
                toValue: this.getMiniModalHeight(),
                duration: closeDuration,
                useNativeDriver: false,
            }),
            this.resetPanAnimation(closeDuration),
            this.headerAnimation(false, closeDuration),
            ...this.childrenAnimations(false, closeDuration),
        ]).start(() => {
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
            // for the refs to get initialized
            if (typeof onOpen === 'function') onOpen()
            Animated.sequence([
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
                ]),
            ]).start()
        } else {
            Keyboard.dismiss()
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
            onStartShouldSetPanResponder: () =>
                this.props.swipeToCloseGestureEnabled ||
                this.props.fullScreenGesturesEnabled,
            onMoveShouldSetPanResponder: () =>
                this.props.swipeToCloseGestureEnabled ||
                this.props.fullScreenGesturesEnabled,

            onPanResponderMove: (e, gestureState) => {
                const { isFullScreen } = this.state
                const { fullScreenGesturesEnabled } = this.props
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
                        toValue: this.getMiniModalHeight() - gestureState.dy,
                        duration: 1,
                    }).start()
                else return
            },
            onPanResponderRelease: (e, gestureState) => {
                const {
                    fullScreenGesturesEnabled,
                    swipeToCloseGestureEnabled,
                } = this.props
                const { isFullScreen } = this.state
                // Close/fullscreen/minimize when gesture distance hits the thereashold
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
                } else {
                    Animated.parallel([
                        Animated.spring(this.pan, {
                            toValue: { x: 0, y: 0 },
                            useNativeDriver: false,
                        }),
                        Animated.spring(this.animatedHeight, {
                            toValue: isFullScreen
                                ? this.getFullScreenHeight()
                                : this.getMiniModalHeight(),
                            useNativeDriver: false,
                        }),
                    ]).start()
                }
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
        // old: add pan handlers on full sheet ONLY when Scroll View is Enabled or when platform is android
        // new: never add pan handlers on full sheet to avoid weired race conditions
        const addPanResponderToWholeScreen = false
        // !isFullScreen && Platform.OS !== 'android'

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
                <MenuProvider
                    skipInstanceCheck={true}
                    customStyles={{ backdrop: styles.backdrop }}
                >
                    <Animated.View
                        style={[
                            styles.wrapper,
                            customStyles.wrapper,
                            {
                                opacity: this.animatedOpacity,
                            },
                        ]}
                    >
                        <TouchableOpacity
                            style={styles.mask}
                            onLayout={({ nativeEvent }) =>
                                (this.maskHeight = nativeEvent.layout.height)
                            }
                            activeOpacity={1}
                            disabled={!closeOnPressBack || isFullScreen}
                            onPress={this.close}
                        />
                        <Animated.View
                            {...(addPanResponderToWholeScreen &&
                                this.panResponder.panHandlers)}
                            onLayout={({ nativeEvent }) =>
                                (this.modalHeight = nativeEvent.layout.height)
                            }
                            style={[
                                styles.container,
                                {
                                    transform: this.pan.getTranslateTransform(),
                                    height: this.animatedHeight,
                                    paddingBottom: this.animatedPaddingBottom,
                                },
                            ]}
                        >
                            <View
                                {...(!addPanResponderToWholeScreen &&
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
                                keyboardShouldPersistTaps={
                                    this.props.keyboardShouldPersistTaps
                                }
                                scrollEnabled={isFullScreen}
                                style={[{ flex: 1 }, customStyles.container]}
                            >
                                {scrollViewContent}
                            </ScrollView>
                            {sheetFooter}
                        </Animated.View>
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
        paddingTop: PADDING_TOP,
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
    keyboardShouldPersistTaps: PropTypes.string,
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
    openDuration: 100,
    closeDuration: 100,
    fullScreenGesturesEnabled: false,
    swipeToCloseGestureEnabled: true,
    dragFromTopOnly: false,
    closeOnPressBack: true,
    keyboardShouldPersistTaps: 'handled',
    customStyles: {
        // borderTopRightRadius: 5,
        // borderTopLeftRadius: 5,
        // paddingHorizontal: 16,
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
