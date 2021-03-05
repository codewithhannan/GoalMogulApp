/** @format */

import React, { Component } from 'react'
import { View, Text, Dimensions, Image } from 'react-native'

// Component
import Divider from '../Common/Divider'

// Asset
import Calendar from '../../asset/utils/calendar.png'
import LocationIcon from '../../asset/utils/location.png'

const { width } = Dimensions.get('window')
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

class About extends Component {
    renderLocation(item) {
        const location = item.location || 'The Mirage -- Brooklyn, New York'
        const {
            rowContainerStyle,
            iconContainerStyle,
            iconStyle,
            contentTextStyle,
        } = styles
        return (
            <View style={rowContainerStyle}>
                <View style={iconContainerStyle}>
                    <Image source={LocationIcon} style={iconStyle} />
                </View>

                <Text style={contentTextStyle}>{location}</Text>
            </View>
        )
    }

    // For event, it's rendering the start time and duration of the event
    renderCreated(item) {
        const { start, durationHours } = item
        const startDate = start ? new Date(start) : new Date()
        const date =
            `${months[startDate.getMonth()]} ${startDate.getDate()}, ` +
            `${startDate.getFullYear()}`

        const startTime = `${startDate.toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        })}`

        const endDate = durationHours
            ? new Date(startDate.getTime() + 1000 * 60 * 60 * durationHours)
            : new Date(startDate.getTime() + 1000 * 60 * 60 * 2)
        const endTime = `${endDate.toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        })}`
        const {
            rowContainerStyle,
            iconContainerStyle,
            iconStyle,
            contentTextStyle,
            boldTextStyle,
        } = styles
        return (
            <View style={rowContainerStyle}>
                <View style={iconContainerStyle}>
                    <Image source={Calendar} style={iconStyle} />
                </View>

                <Text style={contentTextStyle}>
                    {date}
                    <Text style={{ fontWeight: '700' }}>
                        {' '}
                        {startTime} - {endTime}
                    </Text>
                </Text>
            </View>
        )
    }

    renderDescription(item) {
        const description = item.description
            ? item.description
            : 'Currently this event has no decription.'

        return (
            <View style={{ padding: 10 }}>
                <Text style={{ ...styles.subtitleTextStyle, marginTop: 5 }}>
                    Description
                </Text>
                <Text style={styles.descriptionTextStyle}>{description}</Text>
            </View>
        )
    }

    render() {
        const { item } = this.props
        if (!item) return <View />

        return (
            <View
                style={{ flex: 1, margin: 25, marginTop: 15, paddingTop: 10 }}
            >
                {this.renderLocation(item)}
                {this.renderCreated(item)}
                <Divider horizontal width={0.8 * width} borderColor="gray" />
                {this.renderDescription(item)}
            </View>
        )
    }
}

const PictureDimension = 24
const styles = {
    iconContainerStyle: {
        height: 30,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconStyle: {
        height: 26,
        width: 26,
    },
    subtitleTextStyle: {
        fontStyle: 'italic',
        fontSize: 10,
        color: '#696969',
    },
    // text style for row content
    contentTextStyle: {
        fontSize: 14,
        fontWeight: '300',
        // color: '#696969',
        color: 'black',
        marginLeft: 8,
    },
    boldTextStyle: {
        fontSize: 13,
        fontWeight: '700',
    },
    descriptionTextStyle: {
        fontSize: 13,
        fontWeight: '300',
        marginTop: 8,
        color: '#696969',
    },
    rowContainerStyle: {
        flexDirection: 'row',
        marginTop: 5,
        marginBottom: 10,
        alignItems: 'center',
    },
}

export default About
