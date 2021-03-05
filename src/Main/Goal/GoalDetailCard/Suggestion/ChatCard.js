/**
 * This chat card is UI for Search Suggestion
 *
 * @format
 */

import React from 'react'
import { View, Text } from 'react-native'
import timeago from 'timeago.js'
import { connect } from 'react-redux'

// Components
import Check from '../../../Common/Check'
import ProfileImage from '../../../Common/ProfileImage'
import DelayedButton from '../../../Common/Button/DelayedButton'

// Constants
import { GROUP_CHAT_DEFAULT_ICON_URL } from '../../../../Utils/Constants'

const DEBUG_KEY = '[ UI SearchSuggestion.ChatCard ] '

class ChatCard extends React.Component {
    onCardPress = () => {
        const { onCardPress, item } = this.props
        onCardPress(item)
    }

    renderTimeStamp(item) {
        const { created } = item
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

    renderImage(item) {
        // If no tribe image, render a default one
        const { picture } = item
        let imageUrl
        if (picture && picture.length > 0) {
            imageUrl = picture
        } else {
            imageUrl = GROUP_CHAT_DEFAULT_ICON_URL
        }
        // Render the corresponding event image
        return (
            <ProfileImage
                resizeMode="cover"
                imageContainerStyle={styles.imageContainerStyle}
                imageStyle={styles.imageStyle}
                imageUrl={imageUrl}
            />
        )
    }

    renderName(item) {
        const { name } = item
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
    renderInfo(item) {
        const { memberCount } = item
        const member = memberCount > 1 ? ' Members' : ' Member'

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
        const { item, selected } = this.props
        if (!item) return null
        return (
            <DelayedButton activeOpacity={0.6} onPress={this.onCardPress}>
                <View style={styles.containerStyle}>
                    <Check selected={selected} />
                    {this.renderImage(item)}
                    {this.renderTimeStamp(item)}
                    <View style={styles.detailContainerStyle}>
                        {this.renderName(item)}
                        {this.renderDescription(item)}
                        {this.renderInfo(item)}
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
        borderWidth: 0.5,
        padding: 1.5,
        borderColor: 'lightgray',
        alignItems: 'center',
        borderRadius: 6,
        alignSelf: 'center',
        marginLeft: 15,
    },
    imageStyle: {
        width: ProfileImageWidth,
        height: ProfileImageWidth,
        borderRadius: 5,
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

export default connect(null, {})(ChatCard)
