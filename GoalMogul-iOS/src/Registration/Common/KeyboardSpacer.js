/** @format */

import React, { Component } from 'react'
import { View } from 'react-native'

/*
This file is created to implement adaptive keyboard
but is no longer being used
*/
class KeyboardSpacer extends Component {
    render() {
        console.log('height is :', this.props.height)
        return <View style={{ height: this.props.height }} />
    }
}

export default KeyboardSpacer
