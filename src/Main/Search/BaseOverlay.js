/** @format */

import React, { Component } from 'react'
import { View, StyleSheet, Animated, Dimensions } from 'react-native'
import { Actions } from 'react-native-router-flux'

const { height: deviceHeight, width: deviceWidth } = Dimensions.get('window')

export default class BaseLightbox extends Component {
    constructor(props) {
        super(props)

        this.state = {
            opacity: new Animated.Value(0),
        }
    }

    componentDidMount() {
        const { opacity } = this.props
        const value = opacity !== undefined ? opacity : 1
        Animated.timing(this.state.opacity, {
            useNativeDriver: true,
            duration: 100,
            toValue: value,
        }).start()
    }

    closeModal = () => {
        Animated.timing(this.state.opacity, {
            useNativeDriver: true,
            duration: 60,
            toValue: 0.7,
        }).start(Actions.pop)
    }

    _renderLightBox = () => {
        const {
            children,
            horizontalPercent = 1,
            verticalPercent = 1,
        } = this.props
        // Right now, we don't need to set height since
        // most of the usecase is for full screen
        const height = verticalPercent
            ? deviceHeight * verticalPercent
            : deviceHeight
        const width = horizontalPercent
            ? deviceWidth * horizontalPercent
            : deviceWidth
        return (
            <View
                style={{
                    width,
                    flex: 1,
                    backgroundColor: 'white',
                }}
            >
                {children}
            </View>
        )
    }

    render() {
        return (
            <Animated.View
                style={[styles.container, { opacity: this.state.opacity }]}
            >
                {this._renderLightBox()}
            </Animated.View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(52,52,52,0.5)',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
})
