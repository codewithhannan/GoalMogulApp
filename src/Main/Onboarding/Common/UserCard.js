/** @format */

import React from 'react'
import _ from 'lodash'
import { View, Text, ActivityIndicator } from 'react-native'
import ProfileImage from '../../Common/ProfileImage'
import {
    getPhoneNumber,
    getEmail,
    getProfileImageOrDefaultFromUser,
} from '../../../redux/middleware/utils'
import { color, text } from '../../../styles/basic'
import DelayedButton from '../../Common/Button/DelayedButton'

/**
 * Sync Contact related user card. This card has two modes.
 * 1. User already on GM
 * 2. User
 *
 * @link https://www.figma.com/file/T1ZgWm5TKDA4gtBS5gSjtc/GoalMogul-App?node-id=24%3A195
 */
class UserCard extends React.Component {
    /** Render user already on GoalMogul */
    renderAddButton(item, callback) {
        const { invited, inviting } = item
        if (inviting) {
            // Spinner on the add button to indicate request is being sent
            return (
                <View
                    style={[
                        styles.buttonStyle.containerStyle,
                        styles.inviteButtonContainerStyle,
                    ]}
                >
                    <ActivityIndicator animating={inviting} size="small" />
                </View>
            )
        }
        if (invited) {
            // user has already invited
            return (
                <DelayedButton
                    style={[
                        styles.buttonStyle.containerStyle,
                        styles.addedButtonContainerStyle,
                    ]}
                    disabled
                >
                    <Text
                        style={[
                            styles.buttonStyle.textStyle,
                            styles.addedTextStyle,
                        ]}
                    >
                        Added
                    </Text>
                </DelayedButton>
            )
        }
        return (
            <DelayedButton
                onPress={() => callback(item)}
                style={[
                    styles.buttonStyle.containerStyle,
                    styles.addButtonContainerStyle,
                ]}
            >
                <Text
                    style={[
                        styles.buttonStyle.textStyle,
                        styles.addButtonTextStyle,
                    ]}
                >
                    Add
                </Text>
            </DelayedButton>
        )
    }

    renderUserInfo(item) {
        const { name } = item
        return (
            <View
                style={{
                    flex: 1,
                    paddingLeft: 20,
                    paddingRight: 20,
                    justifyContent: 'space-evenly',
                }}
            >
                <Text
                    style={{
                        fontSize: text.TEXT_FONT_SIZE.FONT_3,
                        fontFamily: text.FONT_FAMILY.REGULAR,
                    }}
                >
                    {name}
                </Text>
            </View>
        )
    }

    /** Render contact info */
    renderInviteContactButton(item, callback) {
        return (
            <DelayedButton
                onPress={() => callback(item)}
                style={[
                    styles.buttonStyle.containerStyle,
                    styles.inviteButtonContainerStyle,
                ]}
            >
                <Text
                    style={[
                        styles.buttonStyle.textStyle,
                        styles.inviteButtonTextStyle,
                    ]}
                >
                    Invite
                </Text>
            </DelayedButton>
        )
    }

    renderContactInfo(item) {
        let infoToDisplay
        const name = item.name
        const email = getEmail(item)
        if (email) {
            infoToDisplay = email
        }
        const phoneNumber = getPhoneNumber(item)
        if (phoneNumber) {
            infoToDisplay = phoneNumber
        }

        return (
            <View
                style={{
                    flex: 1,
                    paddingLeft: 20,
                    paddingRight: 20,
                    justifyContent: 'space-evenly',
                }}
            >
                <Text
                    style={{
                        fontSize: text.TEXT_FONT_SIZE.FONT_2,
                        fontFamily: text.FONT_FAMILY.REGULAR,
                    }}
                >
                    {name}
                </Text>
                <Text
                    style={{
                        fontSize: 12,
                        fontFamily: text.FONT_FAMILY.REGULAR,
                    }}
                >
                    {infoToDisplay}
                </Text>
            </View>
        )
    }

    render() {
        const { item, type, callback } = this.props
        if (!item) {
            return null
        }

        const isMatchedContacts = type == 'matchedContacts'
        return (
            <View style={styles.containerStyle}>
                <ProfileImage
                    imageStyle={styles.imageStyle}
                    imageUrl={getProfileImageOrDefaultFromUser(item)}
                    imageContainerStyle={styles.imageContainerStyle}
                />
                {isMatchedContacts
                    ? this.renderUserInfo(item)
                    : this.renderContactInfo(item)}
                {isMatchedContacts
                    ? this.renderAddButton(item, callback)
                    : this.renderInviteContactButton(item, callback)}
            </View>
        )
    }
}

const styles = {
    containerStyle: {
        flex: 1,
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 20,
        paddingVertical: 15,
        backgroundColor: 'white',
        marginVertical: 0.5,
    },
    imageContainerStyle: {
        height: 38,
        width: 38,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageStyle: {
        height: 36,
        width: 36,
    },
    // General button style
    buttonStyle: {
        containerStyle: {
            height: 36,
            width: 75,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 3,
        },
        textStyle: {
            fontSize: text.TEXT_FONT_SIZE.FONT_1,
            fontWeight: 'bold',
            fontFamily: text.FONT_FAMILY.SEMI_BOLD,
        },
    },
    inviteButtonContainerStyle: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: color.GM_BLUE,
    },
    inviteButtonTextStyle: { color: color.GM_BLUE },
    addButtonContainerStyle: { backgroundColor: color.GM_BLUE },
    addButtonTextStyle: { color: 'white' },
    addedButtonContainerStyle: { backgroundColor: '#BDBDBD' },
    addedTextStyle: { color: '#F2F2F2' },
}

export default UserCard
