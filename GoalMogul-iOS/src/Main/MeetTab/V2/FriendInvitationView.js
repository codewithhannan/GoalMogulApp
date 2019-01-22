/**
 * User can choose to either copy invitation code or choose sharing options
 */
import React from 'react';
import {
    View,
    ScrollView,
    Clipboard,
    Share,
    Alert
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

// Assets
import SettingIcon from '../../../asset/utils/friendsSettingIcon.png';
import ClipboardIcon from '../../../asset/utils/clipboard.png';

// Constants
const DEBUG_KEY = '[ UI FriendInvitationView ]';

class FriendInvitationView extends React.PureComponent {

    handleCopyOnClick = () => {
        const inviteLink = generateInvitationLink(this.props.inviteCode);
        console.log(`${DEBUG_KEY}: invite link generated is: `, inviteLink);
        Clipboard.setString(inviteLink);
        // TOOD: show message bar message
        Alert.alert('Copied', 'Invitation link is copied to clipboard');
    }

    handleMoreOptions = () => {
        console.log(`${DEBUG_KEY}: user chooses to see more options`);
        const { user, inviteCode } = this.props;
        console.log(`${DEBUG_KEY}: user is: `, user);
        const { name } = user;
        const inviteLink = generateInvitationLink(inviteCode);
        const title = `Your friend ${name} is asking you to help achieve his goals on GoalMogul`;
        const message = `I’m trying to better myself and get accomplish more. 
            Can you check out this link and suggest some ideas to help me reach my goals faster?`;
        Share.share({ title, message, url: inviteLink }, {});
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
                        icon={ClipboardIcon}
                        iconStyle={{
                            height: 20,
                            width: 20,
                            marginRight: 7,
                            marginLeft: 2
                        }}
                    />
                    <SettingCard
                        title="More options"
                        key="more_options"
                        explanation="See more ways to share the invitation link"
                        onPress={() => this.handleMoreOptions()}
                        icon={SettingIcon}
                        iconStyle={{
                            height: 20,
                            width: 23,
                            marginRight: 7,
                            marginLeft: 2
                        }}
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
        inviteCode,
        user
    };
};

export default connect(
    mapStateToProps,
    null
)(FriendInvitationView);
