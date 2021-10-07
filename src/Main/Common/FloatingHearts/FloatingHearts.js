/** @format */

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Animated, StyleSheet, View, ViewPropTypes } from 'react-native'
import HeartShape from './HeartShape'

const ANIMATION_VERTCAL_SCALE = 0.3
const ANIMATION_DURATION = 2000

/**
 * @class FloatingHearts
 * This basically animates in a floating heart each time @prop count is incremented
 * Basis taken from here and extended: https://github.com/underscopeio/react-native-floating-hearts/blob/master/FloatingHearts.js
 * Fairly straightforward setup - basically this component is laid out over a fixed box. The hearts will animate over the height of this box.
 * The horizontal position of the heart is determined by @prop leftOffset
 * If @prop leftOffset is not provided, it will pick a random left offset from 50-150
 */

class FloatingHearts extends Component {
    state = {
        hearts: [],
        height: null,
    }

    createHeart = (index) => {
        return {
            id: index,
            left: this.props.leftOffset
                ? this.props.leftOffset
                : getRandomNumber(50, 150),
        }
    }

    removeHeart(id) {
        this.setState({
            hearts: this.state.hearts.filter((heart) => heart.id !== id),
        })
    }

    shouldComponentUpdate(nextProps) {
        const oldCount = this.props.count
        const newCount = nextProps.count
        const numHearts = newCount - oldCount

        if (numHearts <= 0) {
            return false
        }

        const items = Array(numHearts).fill()
        const newHearts = items
            .map((item, i) => oldCount + i)
            .map(this.createHeart)

        this.setState({ hearts: this.state.hearts.concat(newHearts) })
        return true
    }

    handleOnLayout = (e) => {
        const height = e.nativeEvent.layout.height

        this.setState({ height })
    }

    render() {
        const { height } = this.state
        const { color, renderCustomShape } = this.props
        const isReady = height !== null

        let heartProps = {}
        if (color !== null) {
            heartProps.color = color
        }

        return (
            <View
                style={[styles.container, this.props.style]}
                onLayout={this.handleOnLayout}
                pointerEvents="none"
            >
                {isReady &&
                    this.state.hearts.map(({ id, left }) => (
                        <AnimatedShape
                            key={Math.random().toString(36).substr(2, 9)}
                            height={height}
                            style={{ left }}
                            onComplete={this.removeHeart.bind(this, id)}
                        >
                            {renderCustomShape ? (
                                renderCustomShape(id)
                            ) : (
                                <HeartShape {...heartProps} />
                            )}
                        </AnimatedShape>
                    ))}
            </View>
        )
    }
}

/**
 * @prop count - is used to render a heart that floats away. Each time the count is incremented, a heart will be rendered...
 * ... You can increment counts rapidly to render multiple floating hearts
 * @prop leftOffset - lets you override a fixed left offset on the rendered box (animation area) for a floating heart to render in from.
 */
FloatingHearts.propTypes = {
    style: ViewPropTypes.style,
    count: PropTypes.number,
    leftOffset: PropTypes.number,
    color: PropTypes.string,
    renderCustomShape: PropTypes.func,
}

FloatingHearts.defaultProps = {
    count: -1,
}

/**
 * @class AnimatedShape
 */

class AnimatedShape extends Component {
    constructor(props) {
        super(props)

        this.state = {
            position: new Animated.Value(0),
            shapeHeight: null,
            enabled: false,
            animationsReady: false,
        }
    }

    componentDidMount() {
        Animated.timing(this.state.position, {
            duration: ANIMATION_DURATION,
            useNativeDriver: true,
            toValue: this.props.height * -1,
        }).start(this.props.onComplete)
    }

    getAnimationStyle() {
        if (!this.state.animationsReady) {
            return { opacity: 0 }
        }

        return {
            transform: [
                { translateY: this.state.position },
                // { translateX: this.xAnimation },
                { scale: this.scaleAnimation },
                { rotate: this.rotateAnimation },
            ],
            opacity: this.opacityAnimation,
        }
    }

    /**
     * As soon as the box is laid out, the height of the box is taken to initialize the heart animations.
     * Since the animation interpolates over the height of the box, we need to wait for layout before initializing them.
     */
    handleOnLayout = (e) => {
        if (this.rendered) {
            return null
        }

        this.rendered = true

        const height = Math.ceil(this.props.height)
        const negativeHeight = height * -1
        const shapeHeight = e.nativeEvent.layout.height

        this.yAnimation = this.state.position.interpolate({
            inputRange: [negativeHeight, 0],
            outputRange: [height, 0],
        })

        this.opacityAnimation = this.yAnimation.interpolate({
            inputRange: [0, (height - shapeHeight) * ANIMATION_VERTCAL_SCALE],
            outputRange: [1, 0],
        })

        this.scaleAnimation = this.yAnimation.interpolate({
            inputRange: [0, 15, 30, height],
            outputRange: [0.2, 1.6, 1.2, 2],
        })

        this.xAnimation = this.yAnimation.interpolate({
            inputRange: [0, height / 2, height],
            outputRange: [0, 15, 0],
        })

        this.rotateAnimation = this.yAnimation.interpolate({
            inputRange: [0, height / 8, height / 4, height / 2, height],
            outputRange: ['0deg', '-2deg', '0deg', '2deg', '0deg'],
        })

        setTimeout(() => this.setState({ animationsReady: true }), 16)
    }

    render() {
        return (
            <Animated.View
                style={[
                    styles.shapeWrapper,
                    this.getAnimationStyle(),
                    this.props.style,
                ]}
                onLayout={this.handleOnLayout}
            >
                {this.props.children}
            </Animated.View>
        )
    }
}

AnimatedShape.propTypes = {
    height: PropTypes.number.isRequired,
    onComplete: PropTypes.func.isRequired,
    style: ViewPropTypes.style,
    children: PropTypes.node.isRequired,
}

AnimatedShape.defaultProps = {
    onComplete: () => {},
}

/**
 * Styles
 */

const styles = StyleSheet.create({
    container: {
        top: 0,
        left: 0,
        left: 0,
        bottom: 0,
        position: 'absolute',
    },

    shapeWrapper: {
        position: 'absolute',
        bottom: 6,
        backgroundColor: 'transparent',
    },
})

/**
 * Helpers
 */

const getRandomNumber = (min, max) => Math.random() * (max - min) + min

/**
 * Exports
 */

export default FloatingHearts
