/** @format */

import { Icon } from '@ui-kitten/components'
import React from 'react'
import { Image, Text, View } from 'react-native'
import Icons from '../../../asset/base64/Icons'
import { default_style, color } from '../../../styles/basic'
import { GOALS_STYLE } from '../../../styles/Goal'
import { PRIVACY_OPTIONS } from '../../../Utils/Constants'
import { DotIcon } from '../../../Utils/Icons'

const { ViewCountIcon } = Icons

const Timestamp = (props) => {
    // TODO: format time
    const {
        time,
        viewCount,
        priority,
        isCompleted,
        textStyles,
        privacy,
    } = props
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
            <Text
                style={{
                    ...default_style.smallText_1,
                    color: color.TEXT_COLOR.OFF_DARK,
                    marginLeft: 3,
                }}
            >
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

    const privacyObj = PRIVACY_OPTIONS.find(({ value }) => value === privacy)

    const privacyIcon = privacy ? (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon
                pack="material-community"
                name={privacyObj.materialCommunityIconName}
                style={[
                    GOALS_STYLE.commonPillIcon,
                    { tintColor: color.TEXT_COLOR.OFF_DARK },
                ]}
            />
            <DotIcon
                iconStyle={{
                    tintColor: '#818181',
                    width: 3,
                    height: 3,
                    marginLeft: 4,
                    marginRight: 5,
                }}
            />
        </View>
    ) : null

    const textStylesProp = textStyles || {}

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {privacyIcon}
            <Text style={[default_style.smallText_1, textStylesProp]}>
                {time}
            </Text>
            {priorityComponent}
            {viewCountComponent}
        </View>
    )
}

export default Timestamp
