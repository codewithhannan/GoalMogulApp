/** @format */

import React from 'react'
import { View, Image, Text, TouchableWithoutFeedback } from 'react-native'
import timeago from 'timeago.js'
import { connect } from 'react-redux'

// Assets
// TODO: set default tribe picture
import tribeDefaultIcon from '../../asset/explore/tribe.png'

// Actions
import { tribeDetailOpen } from '../../redux/modules/tribe/MyTribeActions'
import DelayedButton from '../Common/Button/DelayedButton'
import { IMAGE_BASE_URL } from '../../Utils/Constants'

const DEBUG_KEY = '[UI Tribe Card] '

class TribeCard extends React.Component {
    onCardPress = () => {
        console.log(`${DEBUG_KEY} open Tribe Detail`)
        this.props.tribeDetailOpen(this.props.item)
    }

    renderTimeStamp() {
        const { created } = this.props.item
        const timeStamp =
            created === undefined || created.length === 0 ? new Date() : created
        const { timeStampContainerStyle, timeStampTextStyle } = styles

        return (
            <View style={timeStampContainerStyle}>
                <Text style={timeStampTextStyle}>
                    {timeago().format(timeStamp)}
                </Text>
            </View>
        )
    }

    renderTribeImage() {
        // If no tribe image, render a default one
        const { picture } = this.props.item
        if (picture && picture.length > 0) {
            // Render the corresponding image
            const imageUrl = `${IMAGE_BASE_URL}${picture}`
            return (
                <View style={styles.imageContainerStyle}>
                    <Image
                        style={styles.imageStyle}
                        source={{ uri: imageUrl }}
                        resizeMode="contain"
                    />
                </View>
            )
        }

        // Render default image
        return (
            <View style={styles.imageContainerStyle}>
                <Image
                    style={styles.imageStyle}
                    source={tribeDefaultIcon}
                    resizeMode="contain"
                />
            </View>
        )
    }

    renderTribeTitle() {
        const { name } = this.props.item
        return (
            <View style={{ flexDirection: 'row' }}>
                <Text
                    style={styles.titleTextStyle}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {name}
                </Text>
            </View>
        )
    }

    renderDescription() {
        const { description } = this.props.item
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
    renderTribeInfo() {
        const { memberCount } = this.props.item
        const member = ' Member'

        return (
            <View>
                <Text style={styles.memberInfoTextStyle}>
                    <Text>{memberCount}</Text>
                    {member}
                </Text>
            </View>
        )
    }

    render() {
        return (
            <DelayedButton onPress={this.onCardPress} touchableWithoutFeedback>
                <View style={styles.containerStyle}>
                    {this.renderTribeImage()}
                    {this.renderTimeStamp()}
                    <View style={styles.detailContainerStyle}>
                        {this.renderTribeTitle()}
                        {this.renderDescription()}
                        {this.renderTribeInfo()}
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
    // Tribe detail related style
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
    tribeDetailOpen,
})(TribeCard)
