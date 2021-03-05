/**
 * NOTE: this is the contact invite card at the step 2 of contact sync
 *
 * @format
 */

import React from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'
import DelayedButton from '../../Common/Button/DelayedButton'
import { inviteUser } from '../../../redux/modules/User/ContactSync/ContactSyncActions'
import Name from '../../Common/Name'
import { getPhoneNumber, getEmail } from '../../../redux/middleware/utils'

const DEBUG_KEY = '[ UI ContactInviteCard ]'
class ContactInviteCard extends React.PureComponent {
    renderButton(contact) {
        return (
            <DelayedButton
                activeOpacity={0.6}
                onPress={() => this.props.inviteUser(contact)}
                style={styles.buttonContainerStyle}
            >
                <View style={styles.buttonTextContainerStyle}>
                    <Text style={{ fontSize: 11, color: '#868686' }}>
                        Invite
                    </Text>
                </View>
            </DelayedButton>
        )
    }

    getName = (contact) => {
        if (!contact.name) {
            console.warn(`${DEBUG_KEY}: contact has no name: `, contact)
            return null
        }
        return contact.name
    }

    infoToDisplay = (contact) => {
        const phoneNumber = getPhoneNumber(contact)
        if (phoneNumber) return phoneNumber

        const email = getEmail(contact)
        if (email) return email
        return null
    }

    render() {
        const { contact } = this.props
        if (!contact) return null
        const name = this.getName(contact)
        const infoText = this.infoToDisplay(contact)

        // We don't display card without email or phone number
        if (!infoText) return null

        return (
            <View
                style={{
                    minHeight: 60,
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >
                <View style={{ flex: 1, padding: 15 }}>
                    <Name text={name} />
                    <Text style={{ color: '#999' }}>{infoText}</Text>
                </View>
                <View
                    style={{
                        borderLeftWidth: 1,
                        borderColor: '#efefef',
                        height: '65%',
                    }}
                />
                {this.renderButton(contact)}
            </View>
        )
    }
}

const styles = {
    infoTextStyle: {
        flex: 1,
    },
    // Button styles
    buttonContainerStyle: {
        width: 90,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonTextContainerStyle: {
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 12,
        paddingRight: 12,
        borderRadius: 5,
        backgroundColor: '#f9f9f9',
        borderColor: '#dedede',
        borderWidth: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
}

export default connect(null, {
    inviteUser,
    getPhoneNumber,
    getEmail,
})(ContactInviteCard)
