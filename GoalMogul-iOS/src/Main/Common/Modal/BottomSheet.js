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
} from 'react-native'
import { IS_SMALL_PHONE } from '../../../styles'

const PADDING_TOP = IS_SMALL_PHONE ? 20 : 40
const FULL_SCREEN_HEIGHT = Dimensions.get('window').height - PADDING_TOP
const SUPPORTED_ORIENTATIONS = ['portrait', 'portrait-upside-down']

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
            animatedHeight: new Animated.Value(0),
        }

        this.createPanResponder(props)
    }

    fullScreen() {
        Animated.timing(this.state.animatedHeight, {
            toValue: FULL_SCREEN_HEIGHT,
            duration: this.props.openDuration,
            useNativeDriver: false,
        }).start(() => this.setState({ isFullScreen: true }))
    }

    minimize() {
        Animated.timing(this.state.animatedHeight, {
            toValue: this.props.height,
            duration: this.props.closeDuration,
            useNativeDriver: false,
        }).start(() => this.setState({ isFullScreen: false }))
    }

    setModalVisible(visible, props) {
        const {
            height,
            minClosingHeight,
            openDuration,
            closeDuration,
            onClose,
            onOpen,
        } = this.props
        const { animatedHeight } = this.state
        if (visible) {
            this.setState({ modalVisible: visible })
            if (typeof onOpen === 'function') onOpen(props)
            Animated.timing(animatedHeight, {
                useNativeDriver: false,
                toValue: height,
                duration: openDuration,
            }).start()
        } else {
            Animated.timing(animatedHeight, {
                useNativeDriver: false,
                toValue: minClosingHeight,
                duration: closeDuration,
            }).start(() => {
                this.setState({
                    modalVisible: visible,
                    animatedHeight: new Animated.Value(0),
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
                let { isFullScreen, animatedHeight } = this.state
                // Swiping down
                if (gestureState.dy > 0) {
                    let toValue = FULL_SCREEN_HEIGHT - gestureState.dy
                    if (!isFullScreen) toValue = height - gestureState.dy
                    Animated.timing(animatedHeight, {
                        useNativeDriver: false,
                        toValue,
                        duration: 1,
                    }).start()
                }
                // Swiping up: only registered if not full screen
                else if (!isFullScreen) {
                    Animated.timing(animatedHeight, {
                        useNativeDriver: false,
                        toValue: height - gestureState.dy,
                        duration: 1,
                    }).start()
                }
            },
            onPanResponderRelease: (e, gestureState) => {
                let { isFullScreen, animatedHeight } = this.state
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
                } else {
                    Animated.spring(animatedHeight, {
                        toValue: isFullScreen ? FULL_SCREEN_HEIGHT : height,
                        useNativeDriver: false,
                    }).start()
                }
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
            keyboardAvoidingViewEnabled,
        } = this.props
        const { animatedHeight, modalVisible } = this.state

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
                    enabled={keyboardAvoidingViewEnabled}
                    behavior="padding"
                    style={[styles.wrapper, customStyles.wrapper]}
                >
                    <TouchableOpacity
                        style={styles.mask}
                        activeOpacity={1}
                        onPress={() => (closeOnPressMask ? this.close() : null)}
                    />
                    <Animated.View
                        {...(!dragFromTopOnly && this.panResponder.panHandlers)}
                        style={[
                            styles.container,
                            { height: animatedHeight },
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
        backgroundColor: '#00000077',
    },
    mask: {
        flex: 1,
        backgroundColor: 'transparent',
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
    minClosingHeight: PropTypes.number,
    swipeGestureSenstivity: PropTypes.number,
    openDuration: PropTypes.number,
    closeDuration: PropTypes.number,
    fullScreenGesturesEnabled: PropTypes.bool,
    swipeToCloseGestureEnabled: PropTypes.bool,
    closeOnPressMask: PropTypes.bool,
    dragFromTopOnly: PropTypes.bool,
    closeOnPressBack: PropTypes.bool,
    keyboardAvoidingViewEnabled: PropTypes.bool,
    customStyles: PropTypes.objectOf(PropTypes.object),
    onClose: PropTypes.func,
    onOpen: PropTypes.func,
    children: PropTypes.node,
}

BottomSheet.defaultProps = {
    animationType: 'none',
    height: 150,
    minClosingHeight: 0,
    swipeGestureSenstivity: 1,
    openDuration: 250,
    closeDuration: 250,
    fullScreenGesturesEnabled: false,
    swipeToCloseGestureEnabled: true,
    dragFromTopOnly: false,
    closeOnPressMask: true,
    closeOnPressBack: true,
    keyboardAvoidingViewEnabled: Platform.OS === 'ios',
    customStyles: {
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
        paddingHorizontal: 16,
    },
    onClose: null,
    onOpen: null,
    children: <View />,
}
