/**
 * NOTE: with the new step by step tutorial, this is not used any more.
 * User can choose to either copy invitation code or choose sharing options
 *
 * @format
 */

import React from 'react'
import { Alert, Clipboard, ScrollView, Share, View } from 'react-native'
import { connect } from 'react-redux'
import ClipboardIcon from '../../../asset/utils/clipboard.png'
// Assets
import SettingIcon from '../../../asset/utils/friendsSettingIcon.png'
// Utils
import { generateInvitationLink } from '../../../redux/middleware/utils'
// Actions
// Styles
import { color } from '../../../styles/basic'
// Components
import SearchBarHeader from '../../Common/Header/SearchBarHeader'
import SettingCard from '../../Setting/SettingCard'
import { SCREENS, wrapAnalytics } from '../../../monitoring/segment'

// Constants
const DEBUG_KEY = '[ UI FriendInvitationView ]'

class FriendInvitationView extends React.PureComponent {
    handleCopyOnClick = () => {
        const inviteLink = generateInvitationLink(this.props.inviteCode)
        console.log(`${DEBUG_KEY}: invite link generated is: `, inviteLink)
        Clipboard.setString(inviteLink)
        // TOOD: show message bar message
        Alert.alert('Copied', 'Invitation link is copied to clipboard')
    }

    handleMoreOptions = () => {
        console.log(`${DEBUG_KEY}: user chooses to see more options`)
        const { user, inviteCode } = this.props
        console.log(`${DEBUG_KEY}: user is: `, user)
        const { name } = user
        const inviteLink = generateInvitationLink(inviteCode)
        // const title = `Your friend ${name} is asking you to help achieve his goals on GoalMogul`;
        const message =
            'Hey, I’m using GoalMogul to get more stuff done and better myself. ' +
            'Can you check out this link and suggest ways to help me achieve my goals faster? Thanks! \n'

        Share.share({ title: undefined, message, url: inviteLink }, {})
    }

    render() {
        return (
            <View style={styles.containerStyle}>
                <SearchBarHeader backButton title="Invite Friends" />
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
                            marginLeft: 2,
                        }}
                    />
                    <SettingCard
                        title="Send invitation via..."
                        key="more_options"
                        explanation="See more ways to share the invitation link"
                        onPress={() => this.handleMoreOptions()}
                        icon={SettingIcon}
                        iconStyle={{
                            height: 20,
                            width: 23,
                            marginRight: 7,
                            marginLeft: 2,
                        }}
                    />
                </ScrollView>
            </View>
        )
    }
}

const styles = {
    containerStyle: {
        flex: 1,
        backgroundColor: color.GM_CARD_BACKGROUND,
        backgroundColor: '#f8f8f8',
        //   shadowColor: '#000',
        //   shadowOffset: { width: 0, height: 1 },
        //   shadowOpacity: 0.3,
        //   shadowRadius: 6,
    },
}

const mapStateToProps = (state) => {
    const { user } = state.user
    const { inviteCode } = user

    return {
        inviteCode,
        user,
    }
}

export default connect(
    mapStateToProps,
    null
)(wrapAnalytics(FriendInvitationView, SCREENS.FRIEND_INVITATION_VIEW))
