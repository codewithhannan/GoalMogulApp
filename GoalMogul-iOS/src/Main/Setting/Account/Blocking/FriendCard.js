/** @format */

import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'

// Components
import ProfileImage from '../../../Common/ProfileImage'

// Styles
import Styles from './Styles'

// Actions
import { unblockUser, getBlockedUsers } from '../../../../actions'

class FriendCard extends Component {
    onUnBlocked = (blockId) => {
        console.log('[ Unblock user ]: ', blockId)
        this.props.unblockUser(blockId, () => {
            // Refresh blocked users
            this.props.getBlockedUsers(true)
            alert(
                `You have successfully unblock ${this.props.item.user.name}. Please pull to refresh.`
            )
        })
    }

    renderProfileImage = (url) => {
        return (
            <ProfileImage
                imageStyle={Styles.imageStyle}
                imageUrl={url}
                imageContainerStyle={styles.imageContainerStyle}
            />
        )
    }

    renderButton = (blockId) => {
        return (
            <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => this.onUnBlocked(blockId)}
                style={[
                    Styles.buttonStyle,
                    { justifyContent: 'center', alignSelf: 'center' },
                ]}
            >
                <Text style={Styles.buttonTextStyle}>Unblock</Text>
            </TouchableOpacity>
        )
    }

    render() {
        const { item } = this.props
        const { user, blockId } = item
        // console.log('item is: ', item);
        if (user) {
            const { name, profile } = user
            return (
                <View style={{ height: 60, flex: 1 }}>
                    <View style={{ flexDirection: 'row', padding: 10 }}>
                        {this.renderProfileImage(profile.image)}
                        <View
                            style={{ flex: 1, marginLeft: 10, marginRight: 10 }}
                        >
                            <Text ellipsizeMode="tail" numberOfLines={1}>
                                {name}
                            </Text>
                        </View>

                        {this.renderButton(blockId)}
                    </View>
                </View>
            )
        }
        return null
    }
}

const styles = {
    imageContainerStyle: {
        borderWidth: 0.5,
        padding: 0.5,
        borderColor: 'lightgray',
        alignItems: 'center',
        borderRadius: 6,
        alignSelf: 'flex-start',
        backgroundColor: 'white',
    },
}

export default connect(null, {
    unblockUser,
    getBlockedUsers,
})(FriendCard)
