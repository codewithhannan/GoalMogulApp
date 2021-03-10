/** @format */

import React from 'react'
import { Animated, Image } from 'react-native'

const LOADING_RIPPLE_URL = 'https://i.imgur.com/EhwxDDf.gif'

export default class ChatRoomLoaderOverlay extends React.Component {
    state = {
        hideLoader: false,
    }

    componentDidMount() {
        this.opacityAnim = new Animated.Value(1)
        setTimeout(() => {
            Animated.timing(this.opacityAnim, {
                useNativeDriver: false,
                toValue: 0,
                duration: 1000,
            }).start(() =>
                this.setState({
                    hideLoader: true,
                })
            )
        }, 1000)
    }

    render() {
        if (this.state.hideLoader) return null
        return (
            <Animated.View
                style={{
                    position: 'absolute',
                    height: '100%',
                    width: '100%',
                    top: 0,
                    left: 0,
                    zIndex: 500,
                    backgroundColor: 'white',
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity: this.opacityAnim,
                }}
            >
                <Image
                    source={{ uri: LOADING_RIPPLE_URL }}
                    style={{
                        height: 120,
                        width: 120,
                    }}
                />
            </Animated.View>
        )
    }
}
