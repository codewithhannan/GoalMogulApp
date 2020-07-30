/** @format */

import React from 'react'
import { Image, Text, View } from 'react-native'
import Icons from '../../../asset/base64/Icons'
import { default_style } from '../../../styles/basic'
import { DotIcon } from '../../../Utils/Icons'

const { ViewCountIcon } = Icons

const Timestamp = (props) => {
    // TODO: format time
    const { time, viewCount, priority, isCompleted, textStyles } = props
    const viewCountComponent = viewCount ? (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <DotIcon
                iconStyle={{
                    tintColor: '#818181',
                    width: 3,
                    height: 3,
                    marginLeft: 4,
                    marginRight: 5,
                }}
            />
            <Image
                source={ViewCountIcon}
                style={{
                    height: 7,
                    width: 11,
                    tintColor: '#636363',
                }}
            />
            <Text style={{ ...default_style.smallText_1, marginLeft: 3 }}>
                {viewCount}
            </Text>
        </View>
    ) : null

    let priorityText
    if (priority) {
        if (priority <= 3) {
            priorityText = 'Low priority'
        } else if (priority <= 6) {
            priorityText = 'Medium priority'
        } else {
            priorityText = 'High priority'
        }
    }

    if (isCompleted) {
        priorityText = 'Completed'
    }

    const priorityComponent = priorityText ? (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <DotIcon
                iconStyle={{
                    tintColor: '#818181',
                    width: 3,
                    height: 3,
                    marginLeft: 4,
                    marginRight: 5,
                }}
            />
            <Text style={default_style.smallText_1}>{priorityText}</Text>
        </View>
    ) : null

    const textStylesProp = textStyles || {}

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ ...default_style.smallText_1, ...textStylesProp }}>
                {time}
            </Text>
            {priorityComponent}
            {viewCountComponent}
        </View>
    )
}

export default Timestamp
