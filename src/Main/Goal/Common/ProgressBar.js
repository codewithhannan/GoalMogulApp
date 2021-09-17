/** @format */

import React from 'react'
import { Text, View } from 'react-native'

import { default_style } from '../../../styles/basic'
import DelayedButton from '../../Common/Button/DelayedButton'

const DEBUG_KEY = '[ UI ProgressBar ]'
const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
]

const formatDate = (date) => {
    const month = months[(date || new Date()).getMonth()]
    const year = (date || new Date()).getFullYear()
    return `${month} ${year}`
}

const renderProgressBar = (props) => {
    const { sections, height, percentage, backgroundColor } = props
    const percentagePerBar = 100 / sections

    let progressBar = Array.from(Array(sections)).map((a, index) => {
        const i = index + 1
        const borderRadius = {
            borderTopLeftRadius: i === 1 ? height / 2 : 0,
            borderBottomLeftRadius: i === 1 ? height / 2 : 0,
            borderTopRightRadius: i === sections ? height / 2 : 0,
            borderBottomRightRadius: i === sections ? height / 2 : 0,
        }
        const progressFill = percentagePerBar * i - percentage
        const marginRight =
            (progressFill <= 0
                ? 0
                : progressFill >= percentagePerBar
                ? 100
                : (100 * progressFill) / percentagePerBar) + '%'

        return (
            <View
                style={{
                    flex: 1,
                    height,
                    marginRight: i < sections ? 2.5 : 0,
                    backgroundColor: '#E0E0E0',
                    ...borderRadius,
                }}
                key={Math.random().toString(36).substr(2, 9)}
            >
                <View
                    style={{
                        flex: 1,
                        backgroundColor,
                        marginRight,
                        ...borderRadius,
                    }}
                />
            </View>
        )
    })

    return <View style={styles.barContainerStyle}>{progressBar}</View>
}

/**
 * Return the percentage of progress
 */
const getProgress = (steps, needs, goalRef) => {
    let stepsCompleteCount = 0
    steps.forEach((step) => {
        if (step.isCompleted) ++stepsCompleteCount
    })

    let needsCompleteCount = 0
    needs.forEach((need) => {
        if (need.isCompleted) ++needsCompleteCount
    })

    if (goalRef && goalRef.isCompleted) return 1
    return steps.length === 0 ? 0 : stepsCompleteCount / steps.length
}

const ProgressBar = (props) => {
    const { startTime, endTime, steps, needs, goalRef } = props
    const percentage = getProgress(steps || [], needs || [], goalRef) * 100
    // min sections 3 max 10
    const sections =
        !steps || steps.length < 2 ? 2 : steps.length > 8 ? 8 : steps.length

    const startTimeText =
        startTime instanceof Date
            ? formatDate(startTime)
            : formatDate(new Date(startTime))
    const endTimeText =
        endTime instanceof Date
            ? formatDate(endTime)
            : formatDate(new Date(endTime))

    const startTimeTextView =
        startTimeText === 'undefined NaN' ? null : (
            <Text style={default_style.smallText_2}>{startTimeText}</Text>
        )

    const endTimeTextView =
        endTimeText === 'undefined NaN' ? null : (
            <Text style={default_style.smallText_2}>{endTimeText}</Text>
        )

    return (
        <View>
            {startTimeTextView && endTimeTextView && (
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 10,
                        marginLeft: 2,
                        marginRight: 2,
                    }}
                >
                    {startTimeTextView}
                    {endTimeTextView}
                </View>
            )}
            {renderProgressBar({
                percentage,
                backgroundColor: props.color || '#27AE60',
                height: props.barHeight || 11,
                sections: props.sections || sections,
            })}
        </View>
    )
}

const styles = {
    barContainerStyle: {
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
    },
}

//TODO: validate prop types
export default ProgressBar
