/**
 * User can choose to either copy invitation code or choose sharing options
 */
import React from 'react';
import {
    View,
    ScrollView,
    Clipboard,
    Share
} from 'react-native';
import { connect } from 'react-redux';

// Components
import SearchBarHeader from '../../Common/Header/SearchBarHeader';
import SettingCard from '../../Setting/SettingCard';

// Actions

// Styles
import { BACKGROUND_COLOR } from '../../../styles';

// Utils
import { generateInvitationLink } from '../../../redux/middleware/utils';

// Constants
const DEBUG_KEY = '[ UI FriendInvitationView ]';

class FriendInvitationView extends React.PureComponent {

    handleCopyOnClick = () => {
        const inviteLink = generateInvitationLink(this.props.inviteCode);
        console.log(`${DEBUG_KEY}: invite link generated is: `, inviteLink);
        Clipboard.setString(inviteLink);
        // TOOD: show message bar message
    }

    handleMoreOptions = () => {
        console.log(`${DEBUG_KEY}: user chooses to see more options`);
        const inviteLink = generateInvitationLink(this.props.inviteCode);
        Share.share({ title: 'Test title', message: 'This is a message', url: inviteLink }, {});
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}>
                <SearchBarHeader backButton title='Invite Friends' />
                <ScrollView>
                <SettingCard
                    title="Copy invitation link"
                    key="copy_link"
                    explanation="Click to copy invitation link"
                    onPress={() => this.handleCopyOnClick()}
                />
                <SettingCard
                    title="More options"
                    key="more_options"
                    explanation="See more options to share the invitation link"
                    onPress={() => this.handleMoreOptions()}
                />
                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = state => {
    const { user } = state.user;
    const { inviteCode } = user;

    return {
        inviteCode
    };
};

export default connect(
    mapStateToProps,
    null
)(FriendInvitationView);
