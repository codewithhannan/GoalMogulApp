/** @format */

import React from 'react'
import { View } from 'react-native'
import _ from 'lodash'
import { default_style } from '../../styles/basic'

const LOW_PRIORITY_COLOR = '#f3d94e'
const MEDIAM_PRIORITY_COLOR = '#ef8258'
const HIGH_PRIORITY_COLOR = '#e7665a'

const getColor = (priority) => {
    if (priority < 4) return LOW_PRIORITY_COLOR
    if (priority > 7) return HIGH_PRIORITY_COLOR
    return MEDIAM_PRIORITY_COLOR
}

const PriorityBar = (props) => {
    const { priority } = props
    const backgroundColor = getColor(parseInt(priority, 10))

    const views = Array.from(Array(10)).map((a, index) => {
        let style = { ...default_style.priortyBar, ...styles.defaultStyle }
        if (index >= 10 - priority) {
            style = _.set(style, 'backgroundColor', backgroundColor)
        }
        return (
            <View style={style} key={Math.random().toString(36).substr(2, 9)} />
        )
    })

    return <View>{views}</View>
}

const styles = {
    defaultStyle: {
        backgroundColor: '#f2f2f2',
    },
}

export default PriorityBar
