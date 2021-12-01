/** @format */

import React from 'react'
import { View, Image, Text, TouchableOpacity } from 'react-native'
import timeago from 'timeago.js'
import { connect } from 'react-redux'

// Assets
import TribeIcon from '../../../../asset/suggestion/flag.png'
import GroupProfile from '../../../../asset/icons/group_profile.png'

// Components
import Check from '../../../Common/Check'
import ProfileImage from '../../../Common/ProfileImage'
import DelayedButton from '../../../Common/Button/DelayedButton'

// Actions

const DEBUG_KEY = '[UI Tribe Card] '

class TribeCard extends React.Component {
    onCardPress = () => {
        const { onCardPress, item } = this.props
        onCardPress(item)
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
            return (
                <ProfileImage
                    resizeMode="cover"
                    imageContainerStyle={styles.imageContainerStyle}
                    imageStyle={styles.imageStyle}
                    imageUrl={picture}
                />
            )
        }

        // Render default image
        return (
            <View
                style={{
                    ...styles.imageContainerStyle,
                    padding: 6,
                }}
            >
                <Image
                    style={{ ...styles.imageStyle, height: 45, width: 45 }}
                    source={TribeIcon}
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
            <View
                style={{
                    flexDirection: 'row',
                    // marginVertical: 5,
                    // width: '99%',
                }}
            >
                <Text
                    style={styles.descriptionTextStyle}
                    numberOfLines={2}
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
        const member = ' members'

        return (
            <View style={{ flexDirection: 'row', marginVertical: 5 }}>
                <Image
                    source={GroupProfile}
                    style={{ width: 13, height: 13, marginRight: 5 }}
                />
                <Text style={styles.memberInfoTextStyle}>
                    <Text>{memberCount}</Text>
                    {member}
                </Text>
            </View>
        )
    }

    renderCheck() {
        const { selected } = this.props
        return <Check selected={selected} />
    }

    render() {
        return (
            <DelayedButton activeOpacity={0.6} onPress={this.onCardPress}>
                <View style={styles.containerStyle}>
                    {this.renderCheck()}
                    {this.renderTribeImage()}
                    {/* {this.renderTimeStamp()} */}
                    <View style={styles.detailContainerStyle}>
                        {this.renderTribeTitle()}
                        {this.renderTribeInfo()}
                        {this.renderDescription()}
                    </View>
                </View>
            </DelayedButton>
        )
    }
}

const ProfileImageWidth = 56
const CardHeight = 120
const styles = {
    containerStyle: {
        flexDirection: 'row',
        marginTop: 1,
        height: CardHeight,
        backgroundColor: 'white',
    },
    // Image related styles
    imageContainerStyle: {
        alignItems: 'center',
        alignSelf: 'center',
        marginLeft: 15,
    },
    imageStyle: {
        width: ProfileImageWidth,
        height: ProfileImageWidth,
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
        fontSize: 14,
        fontWeight: '700',
        marginRight: 80,
    },
    descriptionTextStyle: {
        flex: 1,
        flexWrap: 'wrap',
        fontSize: 14,
        color: 'black',
    },
    memberInfoTextStyle: {
        fontSize: 12,
        color: '#737475',
    },
}

export default connect(null, {})(TribeCard)
