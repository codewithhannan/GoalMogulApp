/**
 * This component is card wrapper to animate fade out up when disappear
 * @format
 */

import React, { PureComponent } from 'react'
import * as Animatable from 'react-native-animatable'

class AnimatedCardWrapper extends PureComponent {
    componenetWillUnmount() {
        this.animatedView.fadeOutUp(100)
    }

    render() {
        const { index, ...rest } = this.props
        return (
            <Animatable.View
                ref={(r) => (this.animatedView = r)}
                useNativeDriver
                {...rest}
            />
        )
    }
}

export default AnimatedCardWrapper
