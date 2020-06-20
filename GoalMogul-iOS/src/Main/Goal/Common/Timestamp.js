/** @format */

import React from 'react'
import { Image, Text, View } from 'react-native'
import Icons from '../../../asset/base64/Icons'
import { DotIcon } from '../../../Utils/Icons'
import { DEFAULT_STYLE } from '../../../styles'

const { ViewCountIcon } = Icons

const Timestamp = (props) => {
    // TODO: format time
    const { time, viewCount, priority, isCompleted } = props
    const viewCountComponent = viewCount ? (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <DotIcon
                iconStyle={{
                    tintColor: '#818181',
                    width: 3,
                    height: 3,
                    marginLeft: 4,
                    marginRight: 5,
                    marginTop: 1,
                }}
            />
            <Image
                source={ViewCountIcon}
                style={{
                    height: 7,
                    width: 11,
                    marginTop: 1,
                    tintColor: '#636363',
                }}
            />
            <Text style={{ ...DEFAULT_STYLE.smallText_1, marginLeft: 3 }}>
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
                    marginTop: 1,
                }}
            />
            <Text style={DEFAULT_STYLE.smallText_1}>{priorityText}</Text>
        </View>
    ) : null

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={DEFAULT_STYLE.smallText_1}>{time}</Text>
            {priorityComponent}
            {viewCountComponent}
        </View>
    )
}

export default Timestamp
