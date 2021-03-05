/** @format */

import React, { Component } from 'react'
import { TouchableWithoutFeedback, Animated, View } from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { walkthroughable, CopilotStep } from 'react-native-copilot-gm'
import _ from 'lodash'

/* asset */
import plus from '../../../asset/utils/plus.png'
import { color } from '../../../styles/basic'

const DEBUG_KEY = '[ UI PlusButton ]'
const WalkableView = walkthroughable(View)

class PlusButton extends Component {
    constructor(...args) {
        super(...args)
        this.animations = {
            plusFade: new Animated.Value(1),
            plusShrink: new Animated.Value(styles.iconContainerStyle.height),
            plusBottomShift: new Animated.Value(
                styles.iconContainerStyle.bottom
            ),
            plusRightShift: new Animated.Value(styles.iconContainerStyle.right),
            spinAnim: new Animated.Value(0),
        }
    }

    componentDidMount() {}

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.plusActivated && !prevProps.plusActivated) {
            Animated.parallel([
                Animated.timing(this.animations.plusFade, {
                    useNativeDriver: false,
                    toValue: 1,
                    duration: 400,
                }),
                Animated.timing(this.animations.plusShrink, {
                    useNativeDriver: false,
                    toValue: styles.iconContainerStyle.height,
                    duration: 400,
                }),
                Animated.timing(this.animations.plusBottomShift, {
                    useNativeDriver: false,
                    toValue: styles.iconContainerStyle.bottom,
                    duration: 400,
                }),
                Animated.timing(this.animations.plusRightShift, {
                    useNativeDriver: false,
                    toValue: styles.iconContainerStyle.right,
                    duration: 400,
                }),
                Animated.timing(this.animations.spinAnim, {
                    useNativeDriver: false,
                    toValue: 1,
                    duration: 400,
                }),
            ]).start(() => {
                this.animations.spinAnim.setValue(0)
            })
        }
    }

    onPress = () => {
        if (!this.props.plusActivated) return
        Animated.parallel([
            Animated.timing(this.animations.plusFade, {
                useNativeDriver: false,
                toValue: 0,
                duration: 400,
            }),
            Animated.timing(this.animations.plusShrink, {
                useNativeDriver: false,
                toValue: 0,
                duration: 400,
            }),
            Animated.timing(this.animations.plusBottomShift, {
                useNativeDriver: false,
                toValue:
                    styles.iconContainerStyle.bottom +
                    styles.iconContainerStyle.height / 2,
                duration: 400,
            }),
            Animated.timing(this.animations.plusRightShift, {
                useNativeDriver: false,
                toValue:
                    styles.iconContainerStyle.right +
                    styles.iconContainerStyle.height / 2,
                duration: 400,
            }),
            Animated.timing(this.animations.spinAnim, {
                useNativeDriver: false,
                toValue: 0.5,
                duration: 400,
            }),
        ]).start()
        if (this.props.onPress) {
            this.props.onPress()
        }
    }

    render() {
        const { tutorial } = this.props

        const imageComponent =
            tutorial && !_.isEmpty(tutorial) ? (
                <CopilotStep
                    text={tutorial.tutorialText}
                    order={tutorial.order}
                    name={tutorial.name}
                >
                    <WalkableView
                        style={{
                            height: 54,
                            width: 54,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Animated.Image
                            style={[
                                styles.iconStyle,
                                {
                                    transform: [
                                        {
                                            rotate: this.animations.spinAnim.interpolate(
                                                {
                                                    inputRange: [0, 1],
                                                    outputRange: [
                                                        '0deg',
                                                        '180deg',
                                                    ],
                                                }
                                            ),
                                        },
                                    ],
                                },
                            ]}
                            source={plus}
                        />
                    </WalkableView>
                </CopilotStep>
            ) : (
                <Animated.Image
                    style={[
                        styles.iconStyle,
                        {
                            transform: [
                                {
                                    rotate: this.animations.spinAnim.interpolate(
                                        {
                                            inputRange: [0, 1],
                                            outputRange: ['0deg', '180deg'],
                                        }
                                    ),
                                },
                            ],
                        },
                    ]}
                    source={plus}
                />
            )
        return (
            <TouchableWithoutFeedback onPress={this.onPress}>
                <Animated.View
                    style={[
                        styles.iconContainerStyle,
                        {
                            opacity: this.animations.plusFade,
                            height: this.animations.plusShrink,
                            width: this.animations.plusShrink,
                            bottom: this.animations.plusBottomShift,
                            right: this.animations.plusRightShift,
                        },
                    ]}
                >
                    {imageComponent}
                </Animated.View>
            </TouchableWithoutFeedback>
        )
    }
}

const styles = {
    iconContainerStyle: {
        position: 'absolute',
        bottom: 20,
        right: 29,
        height: 54,
        width: 54,
        borderRadius: 27,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3,
        backgroundColor: color.GM_BLUE,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 2,
    },
    iconStyle: {
        height: 26,
        width: 26,
        tintColor: 'white',
    },
}

export default connect(null, {})(PlusButton)

PlusButton.prototypes = {
    plusActivated: PropTypes.bool,
    onPress: PropTypes.func,
}
