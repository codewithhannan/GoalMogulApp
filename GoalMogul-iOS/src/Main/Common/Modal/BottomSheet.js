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
const FULL_SCREEN_HEIGHT = Dimensions.get('window').height
const SUPPORTED_ORIENTATIONS = ['portrait', 'portrait-upside-down']

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(
    TouchableOpacity
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
            animatedHeight: new Animated.Value(FULL_SCREEN_HEIGHT),
            animatedOpacity: new Animated.Value(0),
            springBackAnimationEnabled: false,
        }
        this.createPanResponder(props)
    }

    fullScreen() {
        Animated.timing(this.state.animatedHeight, {
            toValue: PADDING_TOP,
            duration: this.props.openDuration,
            useNativeDriver: false,
        }).start(() => this.setState({ isFullScreen: true }))
    }

    minimize() {
        Animated.timing(this.state.animatedHeight, {
            toValue: FULL_SCREEN_HEIGHT - this.props.height,
            duration: this.props.closeDuration,
            useNativeDriver: false,
        }).start(() => this.setState({ isFullScreen: false }))
    }

    setModalVisible(visible, props) {
        const {
            height,
            openDuration,
            closeDuration,
            onClose,
            onOpen,
        } = this.props
        const { animatedHeight, animatedOpacity } = this.state
        if (visible) {
            this.setState({ modalVisible: visible })
            Animated.parallel([
                Animated.timing(animatedHeight, {
                    useNativeDriver: false,
                    toValue: FULL_SCREEN_HEIGHT - height,
                    duration: openDuration,
                }),
                Animated.timing(animatedOpacity, {
                    useNativeDriver: false,
                    toValue: 1,
                    duration: openDuration,
                }),
            ]).start(() => {
                if (typeof onOpen === 'function') onOpen(props)
            })
        } else {
            Animated.timing(animatedHeight, {
                useNativeDriver: false,
                toValue: FULL_SCREEN_HEIGHT,
                duration: closeDuration,
            }).start(() => {
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
            onPanResponderMove: Animated.event(
                [null, { moveY: this.state.animatedHeight }],
                !this.state.springBackAnimationEnabled
                    ? {
                          listener: () =>
                              this.setState({
                                  springBackAnimationEnabled: true,
                              }),
                      }
                    : null
            ),
            onPanResponderRelease: (e, gestureState) => {
                let {
                    isFullScreen,
                    animatedHeight,
                    springBackAnimationEnabled,
                } = this.state
                // Close/fullscreen/minimize when gesture velocity or distance hits the thereashold
                if (
                    swipeToCloseGestureEnabled &&
                    ((!isFullScreen &&
                        (height - gestureState.dy < height / 2 ||
                            gestureState.vy > 1.5 * swipeGestureSenstivity)) ||
                        (isFullScreen &&
                            (FULL_SCREEN_HEIGHT - gestureState.dy <
                                height / 2 ||
                                gestureState.vy > 3 * swipeGestureSenstivity)))
                ) {
                    this.setModalVisible(false)
                } else if (
                    fullScreenGesturesEnabled &&
                    !isFullScreen &&
                    (gestureState.dy < -height / 2 ||
                        gestureState.dy < -(FULL_SCREEN_HEIGHT - height) / 2 ||
                        gestureState.vy < -1.5 * swipeGestureSenstivity)
                ) {
                    this.fullScreen()
                } else if (
                    fullScreenGesturesEnabled &&
                    isFullScreen &&
                    (gestureState.dy > height / 2 ||
                        gestureState.dy > (FULL_SCREEN_HEIGHT - height) / 2 ||
                        gestureState.vy > 0.75 * swipeGestureSenstivity)
                ) {
                    this.minimize()
                } else if (springBackAnimationEnabled) {
                    Animated.spring(animatedHeight, {
                        toValue: isFullScreen
                            ? PADDING_TOP
                            : FULL_SCREEN_HEIGHT - height,
                        useNativeDriver: false,
                    }).start()
                } else {
                    // Only dismiss keyboard if user is not trying to resize the modal
                    Keyboard.dismiss()
                }
                this.setState({ springBackAnimationEnabled: false })
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
        const { animatedHeight, animatedOpacity, modalVisible } = this.state
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
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={[styles.wrapper, customStyles.wrapper]}
                >
                    <AnimatedTouchableOpacity
                        style={[styles.mask, { opacity: animatedOpacity }]}
                        activeOpacity={1}
                        onPress={() => (closeOnPressMask ? this.close() : null)}
                    />
                    <Animated.View
                        {...(!dragFromTopOnly && this.panResponder.panHandlers)}
                        style={[
                            styles.container,
                            {
                                height: animatedHeight.interpolate({
                                    inputRange: [0, FULL_SCREEN_HEIGHT],
                                    outputRange: [FULL_SCREEN_HEIGHT, 0],
                                }),
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
                        {children}
                    </Animated.View>
                </KeyboardAvoidingView>
            </Modal>
        )
    }
}

const styles = {
    wrapper: {
        flex: 1,
    },
    mask: {
        flex: 1,
        backgroundColor: '#00000077',
        paddingTop: PADDING_TOP,
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
