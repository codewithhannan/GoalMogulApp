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
import { IPHONE_MODELS, DEVICE_MODEL } from '../../../Utils/Constants'

const PADDING_TOP =
    Platform.OS === 'ios' && IPHONE_MODELS.includes(DEVICE_MODEL) ? 25 : 40
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
            pan: new Animated.ValueXY(),
        }

        this.createPanResponder(props)
    }

    fullScreen() {
        Animated.timing(this.state.animatedHeight, {
            toValue: FULL_SCREEN_HEIGHT,
            duration: this.props.openDuration,
            useNativeDriver: false,
        }).start()
        this.setState({ isFullScreen: true })
    }

    minimize() {
        Animated.timing(this.state.animatedHeight, {
            toValue: this.props.height,
            duration: this.props.closeDuration,
            useNativeDriver: false,
        }).start()
        this.setState({ isFullScreen: false })
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
        const { animatedHeight, pan } = this.state
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
                pan.setValue({ x: 0, y: 0 })
                this.setState({
                    modalVisible: visible,
                    animatedHeight: new Animated.Value(0),
                })

                if (typeof onClose === 'function') onClose(props)
            })
        }
    }

    createPanResponder(props) {
        const {
            fullScreenEnabled,
            closeOnDragDown,
            height,
            swipeGestureMinLength,
        } = props
        const { pan, animatedHeight } = this.state
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => closeOnDragDown,
            onPanResponderMove: (e, gestureState) => {
                // Swiping down
                if (gestureState.dy > 0) {
                    let toValue = FULL_SCREEN_HEIGHT - gestureState.dy
                    if (!this.state.isFullScreen)
                        toValue = height - gestureState.dy
                    Animated.timing(animatedHeight, {
                        useNativeDriver: false,
                        toValue,
                        duration: 1,
                    }).start()
                }
                // Swiping up: only registered if not full screen
                else if (!this.state.isFullScreen) {
                    Animated.timing(animatedHeight, {
                        useNativeDriver: false,
                        toValue: height - gestureState.dy,
                        duration: 1,
                    }).start()
                }
            },
            onPanResponderRelease: (e, gestureState) => {
                if (
                    gestureState.dy < -swipeGestureMinLength &&
                    fullScreenEnabled &&
                    !this.state.isFullScreen
                ) {
                    this.fullScreen()
                } else if (
                    this.state.isFullScreen &&
                    gestureState.dy > swipeGestureMinLength
                ) {
                    this.minimize()
                } else if (
                    !this.state.isFullScreen &&
                    gestureState.dy > swipeGestureMinLength
                ) {
                    this.setModalVisible(false)
                } else {
                    Animated.spring(animatedHeight, {
                        toValue: height,
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
            closeOnDragDown,
            dragFromTopOnly,
            closeOnPressMask,
            closeOnPressBack,
            children,
            customStyles,
            keyboardAvoidingViewEnabled,
        } = this.props
        const { animatedHeight, pan, modalVisible } = this.state
        const panStyle = {
            transform: pan.getTranslateTransform(),
        }

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
                            panStyle,
                            styles.container,
                            { height: animatedHeight },
                            customStyles.container,
                        ]}
                    >
                        {closeOnDragDown && (
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
    swipeGestureMinLength: PropTypes.number,
    openDuration: PropTypes.number,
    closeDuration: PropTypes.number,
    fullScreenEnabled: PropTypes.bool,
    closeOnDragDown: PropTypes.bool,
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
    swipeGestureMinLength: 150,
    openDuration: 250,
    closeDuration: 250,
    fullScreenEnabled: false,
    closeOnDragDown: true,
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
