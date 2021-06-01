/** @format */

import React from 'react'
import { View, Animated, StyleSheet } from 'react-native'

class ProgressBar extends React.Component {
    constructor(props) {
        super(props)
        this.animation = new Animated.Value(0)
    }

    componentDidMount() {
        this.animation = new Animated.Value(this.props.progress)
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.progress !== this.props.progress) {
            Animated.timing(this.animation, {
                toValue: this.props.progress,
                duration: this.props.duration,
                useNativeDriver: false,
            }).start()
        }
    }

    render() {
        const { height, fillColor, barColor } = this.props

        const widthInterpolated = this.props.progress.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
            extrapolate: 'clamp',
        })

        return (
            <View style={{ flex: 1, flexDirection: 'row', height }}>
                <View style={{ flex: 1 }}>
                    <View
                        style={[
                            StyleSheet.absoluteFill,
                            {
                                backgroundColor: fillColor,
                            },
                        ]}
                    />
                    <Animated.View
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                            backgroundColor: barColor,
                            width: widthInterpolated,
                        }}
                    />
                </View>
            </View>
        )
    }
}

ProgressBar.defaultPros = {
    height: 10,
    fillColor: '#0297ce',
    barColor: '#055c7a',
    duration: 100,
}

export default ProgressBar
