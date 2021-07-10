/**
 * This View is the Friend Card View
 *
 * @format
 */

import React from 'react'
import { View, Text, ActionSheetIOS } from 'react-native'
import { connect } from 'react-redux'

// Components
import DelayedButton from '../../Common/Button/DelayedButton'

// Actions
import { updateFriendship, blockUser, openProfile } from '../../../actions'

import { handleRefresh } from '../../../redux/modules/meet/MeetActions'
import UserCardHeader from '../Common/UserCardHeader'
import { default_style, color } from '../../../styles/basic'
import UserTopGoals from '../../Common/Card/CardComponent/UserTopGoals'
import { createReport } from '../../../redux/modules/report/ReportActions'
import BottomButtonsSheet from '../../Common/Modal/BottomButtonsSheet'
import Icons from '../../../asset/base64/Icons'
import { getBottomSpace } from 'react-native-iphone-x-helper'
import { getButtonBottomSheetHeight } from '../../../styles'

// Assets
const FRIENDSHIP_BUTTONS = ['Withdraw request', 'Cancel']
const WITHDRAW_INDEX = 0
const CANCEL_INDEX = 1

const ACCEPT_BUTTONS = ['Accept', 'Remove', 'Cancel']
const ACCPET_INDEX = 0
const ACCPET_REMOVE_INDEX = 1
const ACCEPT_CANCEL_INDEX = 2

const TAB_KEY_OUTGOING = 'requests.outgoing'
const TAB_KEY_INCOMING = 'requests.incoming'
const DEBUG_KEY = '[ UI FriendRequestCardView ]'

class FriendRequestCardView extends React.PureComponent {
    state = {
        requested: false,
        accepted: false,
    }

    /* This is deprecated and replaced by individual handlers */
    onRespondClicked = (item) => {
        const { friendshipId, user } = item
        const userId = user._id
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ACCEPT_BUTTONS,
                cancelButtonIndex: ACCEPT_CANCEL_INDEX,
            },
            (buttonIndex) => {
                console.log('button clicked', ACCEPT_BUTTONS[buttonIndex])
                switch (buttonIndex) {
                    case ACCPET_INDEX:
                        this.props.updateFriendship(
                            userId,
                            friendshipId,
                            'acceptFriend',
                            TAB_KEY_INCOMING,
                            () => this.props.handleRefresh()
                        )
                        break
                    case ACCPET_REMOVE_INDEX:
                        this.props.updateFriendship(
                            userId,
                            friendshipId,
                            'deleteFriend',
                            TAB_KEY_INCOMING,
                            () => this.props.handleRefresh()
                        )
                        break
                    default:
                        return
                }
            }
        )
    }

    handleWithdrawInvite = (item) => {
        const { friendshipId } = item
        this.props.updateFriendship(
            undefined,
            friendshipId,
            'deleteFriend',
            TAB_KEY_OUTGOING,
            () => {
                this.setState({ requested: false })
            }
        )
    }

    handleAcceptFriendRequest = (userId, friendshipId) => {
        this.props.updateFriendship(
            userId,
            friendshipId,
            'acceptFriend',
            TAB_KEY_INCOMING,
            () => this.props.handleRefresh()
        )
    }

    handleDeleteFriendRequest = (userId, friendshipId) => {
        this.props.updateFriendship(
            userId,
            friendshipId,
            'deleteFriend',
            TAB_KEY_INCOMING,
            () => this.props.handleRefresh()
        )
    }

    handleOnOpenProfile = () => {
        const { user } = this.props.item
        if (user && user._id) {
            return this.props.openProfile(user._id)
        }
    }

    closeOptionModal = () => this.bottomSheetRef.close()

    openOptionModal = () => this.bottomSheetRef.open()

    makeRequestCardOptions = (userDoc) => {
        const { _id } = userDoc

        return [
            {
                text: 'Report',
                textStyle: { color: 'black' },
                icon: { name: 'account-alert', pack: 'material-community' },
                iconStyle: { height: 24, color: 'black' },
                onPress: () => {
                    this.closeOptionModal()
                    this.props.createReport(_id, undefined, 'User')
                },
            },
            {
                text: 'Block',
                image: Icons.AccountRemove,
                imageStyle: { tintColor: 'black' },
                onPress: () => {
                    // close bottom sheet
                    this.closeOptionModal()

                    // Wait for bottom sheet to close
                    // before showing confirmation alert
                    setTimeout(() => {
                        this.props.blockUser(_id, undefined, userDoc)
                    }, 500)
                },
            },
        ]
    }

    renderBottomSheet = (userDoc) => {
        const options = this.makeRequestCardOptions(userDoc)
        // Options height + bottom space + bottom sheet handler height
        const sheetHeight = getButtonBottomSheetHeight(options.length)
        return (
            <BottomButtonsSheet
                ref={(r) => (this.bottomSheetRef = r)}
                buttons={options}
                height={sheetHeight}
            />
        )
    }

    renderButton(item) {
        if (!item.user || item.type === 'info') return null
        if (item.type === 'outgoing') {
            return this.renderButtonOutgoing(item)
        }

        if (item.type === 'incoming') {
            return this.renderButtonIncoming(item)
        }

        console.warn(`${DEBUG_KEY}: undefined item type: `, item.type)
        return null
    }

    renderButtonOutgoing(item) {
        return (
            <View
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    marginLeft: 49,
                    marginTop: 10,
                }}
            >
                <DelayedButton
                    onPress={() => this.handleWithdrawInvite(item)}
                    activeOpacity={0.6}
                    style={[
                        styles.buttonTextContainerStyle,
                        { backgroundColor: '#F2F2F2' },
                    ]}
                >
                    <Text
                        style={[default_style.buttonText_1, { fontSize: 12 }]}
                    >
                        Withdraw
                    </Text>
                </DelayedButton>
                <View style={{ flex: 1 }} />
            </View>
        )
    }

    renderButtonIncoming(item) {
        const { friendshipId, user } = item
        const userId = user._id
        return (
            <View
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    marginLeft: 49,
                    marginTop: 10,
                }}
            >
                <DelayedButton
                    onPress={() =>
                        this.handleAcceptFriendRequest(userId, friendshipId)
                    }
                    activeOpacity={1}
                    style={[
                        styles.buttonTextContainerStyle,
                        { backgroundColor: color.GM_BLUE },
                    ]}
                >
                    <Text
                        style={[
                            default_style.buttonText_1,
                            { color: 'white', fontSize: 12 },
                        ]}
                    >
                        Accept
                    </Text>
                </DelayedButton>
                <DelayedButton
                    onPress={() =>
                        this.handleDeleteFriendRequest(userId, friendshipId)
                    }
                    activeOpacity={1}
                    style={[
                        styles.buttonTextContainerStyle,
                        { backgroundColor: '#F2F2F2' },
                    ]}
                >
                    <Text
                        style={[default_style.buttonText_1, { fontSize: 12 }]}
                    >
                        Ignore
                    </Text>
                </DelayedButton>
                <View style={{ flex: 1 }} />
            </View>
        )
    }

    render() {
        const { item } = this.props
        if (!item) return null

        return (
            <DelayedButton
                activeOpacity={0.8}
                style={[styles.containerStyle, styles.shadow]}
                onPress={this.handleOnOpenProfile}
            >
                <UserCardHeader
                    user={item.user}
                    optionsOnPress={this.openOptionModal}
                />
                <UserTopGoals user={item.user} />
                {this.renderButton(item)}
                {this.renderBottomSheet(item.user)}
            </DelayedButton>
        )
    }
}

const styles = {
    containerStyle: {
        flex: 1,
        padding: 16,
        backgroundColor: 'white',
    },
    // Button styles
    buttonContainerStyle: {
        width: 90,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonTextContainerStyle: {
        marginRight: 8,
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 16,
        paddingRight: 16,
        borderRadius: 3,
        width: 112,
        alignItems: 'center',
        justifyContent: 'center',
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
}

export default connect(null, {
    updateFriendship,
    blockUser,
    openProfile,
    handleRefresh,
    createReport,
})(FriendRequestCardView)
