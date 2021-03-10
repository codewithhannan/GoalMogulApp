/** @format */

import React from 'react'
import { View, Image, Text, TouchableWithoutFeedback } from 'react-native'
import timeago from 'timeago.js'
import { connect } from 'react-redux'

// Assets
// TODO: set default tribe picture
import eventDefaultIcon from '../../asset/suggestion/event.png'

// Actions
import { eventDetailOpen } from '../../redux/modules/event/EventActions'

// Components
import DelayedButton from '../Common/Button/DelayedButton'
import { IMAGE_BASE_URL } from '../../Utils/Constants'

// import {
//   eventDetailOpen
// } from '../../redux/modules/event/MyEventActions';

const DEBUG_KEY = '[UI Event Card] '

class EventCard extends React.Component {
    onCardPress = () => {
        console.log(`${DEBUG_KEY} open Event Detail.`)
        this.props.eventDetailOpen(this.props.item)
    }

    renderTimeStamp(item) {
        const { start } = item
        const timeStamp =
            start === undefined || start.length === 0 ? new Date() : start
        const { timeStampContainerStyle, timeStampTextStyle } = styles

        return (
            <View style={timeStampContainerStyle}>
                <Text style={timeStampTextStyle}>
                    {timeago().format(timeStamp)}
                </Text>
            </View>
        )
    }

    renderEventImage(item) {
        // If no tribe image, render a default one
        const { picture } = item
        if (picture && picture.length > 0) {
            // Render the corresponding image
            const imageUrl = `${IMAGE_BASE_URL}${picture}`
            return (
                <View style={styles.imageContainerStyle}>
                    <Image
                        style={styles.imageStyle}
                        source={{ uri: imageUrl }}
                    />
                </View>
            )
        }

        // Render default image
        return (
            <View style={styles.imageContainerStyle}>
                <Image style={styles.imageStyle} source={eventDefaultIcon} />
            </View>
        )
    }

    renderEventTitle(item) {
        const { title } = item
        return (
            <View style={{ flexDirection: 'row' }}>
                <Text
                    style={styles.titleTextStyle}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {title}
                </Text>
            </View>
        )
    }

    renderDescription(item) {
        const { description } = item
        return (
            <View style={{ flexDirection: 'row' }}>
                <Text
                    style={styles.descriptionTextStyle}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {description}
                </Text>
            </View>
        )
    }

    // Info includes memeber count for now
    renderEventInfo(item) {
        const { participantCount } = item
        const member = participantCount > 1 ? ' Members' : ' Member'

        return (
            <View>
                <Text style={styles.memberInfoTextStyle}>
                    <Text>{participantCount}</Text>
                    {member}
                </Text>
            </View>
        )
    }

    render() {
        const { item } = this.props
        if (!item) return <View />
        return (
            <DelayedButton onPress={this.onCardPress} touchableWithoutFeedback>
                <View style={styles.containerStyle}>
                    {this.renderEventImage(item)}
                    {this.renderTimeStamp(item)}
                    <View style={styles.detailContainerStyle}>
                        {this.renderEventTitle(item)}
                        {this.renderDescription(item)}
                        {this.renderEventInfo(item)}
                    </View>
                </View>
            </DelayedButton>
        )
    }
}

const ProfileImageWidth = 56
const CardHeight = 80
const styles = {
    containerStyle: {
        flexDirection: 'row',
        marginTop: 1,
        height: CardHeight,
        backgroundColor: 'white',
    },
    // Image related styles
    imageContainerStyle: {
        borderWidth: 1,
        borderColor: 'lightgray',
        alignItems: 'center',
        borderRadius: 6,
        alignSelf: 'center',
        marginLeft: 15,
    },
    imageStyle: {
        width: ProfileImageWidth,
        height: ProfileImageWidth,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: 'white',
    },
    // Timestamp style
    timeStampContainerStyle: {
        position: 'absolute',
        top: 0,
        right: 5,
        padding: (CardHeight - ProfileImageWidth + 4) / 2,
    },
    timeStampTextStyle: {
        color: '#28485e',
        fontSize: 9,
        fontWeight: '700',
    },
    // Event detail related style
    detailContainerStyle: {
        justifyContent: 'space-between',
        paddingTop: (CardHeight - ProfileImageWidth) / 2,
        paddingBottom: (CardHeight - ProfileImageWidth) / 2,
        marginLeft: 10,
        marginRight: 10,
        flexDirection: 'column',
        flex: 1,
    },
    titleTextStyle: {
        flex: 1,
        flexWrap: 'wrap',
        fontSize: 13,
        fontWeight: '700',
        marginRight: 80,
    },
    descriptionTextStyle: {
        flex: 1,
        flexWrap: 'wrap',
        fontSize: 13,
        color: '#859199',
    },
    memberInfoTextStyle: {
        fontSize: 10,
        color: '#b3b8b9',
    },
}

export default connect(null, {
    eventDetailOpen,
})(EventCard)
