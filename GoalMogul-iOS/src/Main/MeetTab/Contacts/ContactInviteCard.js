/**
 * NOTE: this is the contact invite card at the step 2 of contact sync
 */
import React from 'react';
import {
    View,
    Text
} from 'react-native';
import { connect } from 'react-redux';
import DelayedButton from '../../Common/Button/DelayedButton';
import { 
    inviteUser,
    getPhoneNumber,
    getEmail
} from '../../../redux/modules/User/ContactSync/ContactSyncActions';
import Name from '../../Common/Name';

const DEBUG_KEY = '[ UI ContactInviteCard ]';
class ContactInviteCard extends React.PureComponent {

    getName = (contact) => {
        if (!contact.name) {
            console.warn(`${DEBUG_KEY}: contact has no name: `, contact);
            return null;
        }
        return contact.name;
    }

    infoToDisplay = (contact) => {
        const phoneNumber = getPhoneNumber(contact);
        if (phoneNumber) return phoneNumber;
        
        const email = getEmail(contact);
        if (email) return email;
        return null;
    }

    render() {
        const { contact } = this.props;
        if (!contact) return null;
        const name = this.getName(contact);
        const infoText = this.infoToDisplay(contact);

        // We don't display card without email or phone number
        if (!infoText) return null;

        return (
            <DelayedButton
                activeOpacity={0.6}
                onPress={() => this.props.inviteUser(contact)}
                style={{ minHeight: 60, padding: 15 }}
            >
                <Name text={name} />
                <Text style={{ color: '#999' }} >{infoText}</Text>
            </DelayedButton>
        );
    }
}

const styles = {
    infoTextStyle: {
        flex: 1,
    }
};

export default connect(
    null,
    {
        inviteUser,
        getPhoneNumber,
        getEmail
    }
)(ContactInviteCard);
