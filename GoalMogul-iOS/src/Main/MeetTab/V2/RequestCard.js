/** @format */

import React from 'react'
import { View, Text, Dimensions, Image } from 'react-native'
import { connect } from 'react-redux'
import { default_style, color } from '../../../styles/basic'
import DelayedButton from '../../Common/Button/DelayedButton'
import { openProfile, updateFriendship } from '../../../actions'
import { IMAGE_BASE_URL } from '../../../Utils/Constants'
import Icons from '../../../asset/base64/Icons'
import { handleRefresh } from '../../../redux/modules/meet/MeetActions'
import { Icon } from '@ui-kitten/components'

/**
 * Component that display condensed request info in FriendTab
 * Design: https://www.figma.com/file/pbqMYdES3eWbz6bxlrIFP4/Friends?node-id=69%3A460
 */
class RequestCard extends React.PureComponent {
    handleAcceptOnPress = (userId, friendshipId) => {
        this.props.updateFriendship(
            userId,
            friendshipId,
            'acceptFriend',
            'requests.incoming',
            () => this.props.handleRefresh()
        )
    }

    handleDismissOnPress = (userId, friendshipId) => {
        this.props.updateFriendship(
            userId,
            friendshipId,
            'deleteFriend',
            'requests.incoming',
            () => this.props.handleRefresh()
        )
    }

    handleOpenProfile = (userId) => {
        this.props.openProfile(userId)
    }

    getCardWidth = (parentPadding) => {
        const { width } = Dimensions.get('window')
        return (width - parentPadding * 2 - parentPadding * 1.3) / 2
    }

    getDetailText = (user) => {
        const { name, profile, headline } = user
        let detailText
        if (headline) return headline
        if (profile && profile.occupation) return profile.occupation
        return undefined
    }

    renderDismissButton = (user, friendshipId) => {
        return (
            <DelayedButton
                style={[
                    { position: 'absolute', top: 0, right: 0, padding: 10 },
                ]}
                onPress={() =>
                    this.handleDismissOnPress(user._id, friendshipId)
                }
            >
                <Icon
                    name="close"
                    pack="material"
                    style={{ height: 20, width: 20, tintColor: '#333' }}
                />
            </DelayedButton>
        )
    }

    renderProfileImage = (user) => {
        const { profile } = user
        let source = Icons.Account
        const hasProfileImage = profile && profile.image
        if (hasProfileImage) {
            source = { uri: `${IMAGE_BASE_URL}${profile.image}` }
        }

        return (
            <View
                style={{
                    height: 52,
                    width: 52,
                    borderRadius: 26,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 0.5,
                    borderColor: 'lightgray',
                    marginBottom: 8,
                }}
            >
                <Image
                    source={source}
                    style={[
                        { height: 50, width: 50, borderRadius: 25 },
                        { marginBottom: hasProfileImage ? 0 : 3 },
                    ]}
                    resizeMode="cover"
                />
            </View>
        )
    }

    render() {
        const { user, friendshipId } = this.props.user
        if (!user) return null
        const cardWidth = this.getCardWidth(styles.parentPadding)
        const detailText = this.getDetailText(user)
        const { name, mutualFriendCount } = user

        return (
            <DelayedButton
                style={[styles.containerStyle, { width: cardWidth }]}
                onPress={() => this.handleOpenProfile(user._id)}
                activeOpacity={0.9}
            >
                {this.renderDismissButton(user, friendshipId)}
                {this.renderProfileImage(user)}
                <Text numberOfLines={1} style={[default_style.titleText_2]}>
                    {name}
                </Text>
                <Text
                    numberOfLines={1}
                    style={[
                        default_style.smallText_1,
                        { opacity: detailText ? 1 : 0, color: '#9B9B9B' },
                    ]}
                >
                    {detailText}
                </Text>
                <Text
                    numberOfLines={1}
                    style={[default_style.smallText_1, { color: '#555' }]}
                >
                    <Text>{mutualFriendCount}</Text> mutual{' '}
                    {mutualFriendCount > 1 ? 'friends' : 'friend'}
                </Text>
                <DelayedButton
                    onPress={() =>
                        this.handleAcceptOnPress(user._id, friendshipId)
                    }
                    style={{
                        borderRadius: 3,
                        backgroundColor: color.GM_BLUE,
                        borderColor: color.GM_BLUE,
                        borderWidth: 1,
                        width: '100%',
                        alignItems: 'center',
                        padding: 8,
                        marginTop: 10,
                    }}
                >
                    <Text
                        style={[
                            default_style.buttonText_1,
                            { color: color.GM_CARD_BACKGROUND },
                        ]}
                    >
                        Accept
                    </Text>
                </DelayedButton>
            </DelayedButton>
        )
    }
}

const styles = {
    parentPadding: 16,
    containerStyle: {
        padding: 11,
        borderWidth: 1,
        borderColor: '#F2F2F2',
        borderRadius: 3,
        alignItems: 'center',
    },
}

export default connect(null, {
    openProfile,
    handleRefresh,
    updateFriendship,
})(RequestCard)
