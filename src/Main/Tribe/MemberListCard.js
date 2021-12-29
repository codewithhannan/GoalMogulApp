/** @format */

import R from 'ramda'
import React, { Component } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'

// Assets
import FriendsSettingIcon from '../../asset/utils/friendsSettingIcon.png'
// import meetSetting from '../../../asset/utils/meetSetting.png';
// Utils
import {
    switchCase,
    getProfileImageOrDefaultFromUser,
} from '../../redux/middleware/utils'
// import { getButtonBottomSheetHeight } from '../../styles'
// import BottomButtonsSheet from '../Common/Modal/BottomButtonsSheet'

// Actions
import { updateFriendship, openProfile } from '../../actions'
import { text, color, default_style } from '../../styles/basic'

import { actionSheet, switchByButtonIndex } from '../Common/ActionSheetFactory'
import BottomButtonsSheet from '../Common/Modal/BottomButtonsSheet'
// Components
import Name from '../Common/Name'
import ProfileImage from '../Common/ProfileImage'
import UserTopGoals from '../Common/Card/CardComponent/UserTopGoals'
import DelayedButton from '../Common/Button/DelayedButton'
import { getButtonBottomSheetHeight } from '../../styles'

// import { updateFriendship, openProfile, blockUser } from '../../actions'

// Constants
const DEBUG_KEY = '[ UI MemberListCard ]'

class MemberListCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            // When this card is initially displayed, there is no friendship request.
            // If friendship is sent, then in the next refresh, the card won't exist.
            invited:
                this.props.isRequested !== undefined
                    ? this.props.isRequested
                    : false,
            invitedCount: 0,
        }
    }

    closeOptionModal = () => this.bottomSheetRef.close()

    openOptionModal = () => this.bottomSheetRef.open()

    adminUpdateUserStatusOptions = () => {
        const {
            onAcceptUser,
            onRemoveUser,
            onPromoteUser,
            onDemoteUser,
            item,
            category,
        } = this.props
        const { _id } = item
        let requestOptions
        if (category === 'Admin') {
            requestOptions = [
                {
                    text: 'Demote Admin',
                    onPress: () => {
                        onDemoteUser(_id)
                        this.closeOptionModal()
                    },
                },
                {
                    text: 'Cancel',
                    onPress: () => this.closeOptionModal(),
                },
            ]
        } else if (category === 'Member') {
            requestOptions = [
                {
                    text: 'Remove User',
                    onPress: () => {
                        onRemoveUser(_id)
                        this.closeOptionModal()
                    },
                },
                {
                    text: 'Promote to Admin',
                    onPress: () => {
                        onPromoteUser(_id)
                        this.closeOptionModal()
                    },
                },
                {
                    text: 'Cancel',
                    onPress: () => this.closeOptionModal(),
                },
            ]
        } else if (category === 'Invitee') {
            requestOptions = [
                {
                    text: 'Withdraw Invitation',
                    onPress: () => {
                        onRemoveUser(_id)
                        this.closeOptionModal()
                    },
                },
                {
                    text: 'Cancel',
                    onPress: () => this.closeOptionModal(),
                },
            ]
        } else {
            requestOptions = [
                {
                    text: 'Accept Request',
                    onPress: () => {
                        onAcceptUser(_id)
                        this.closeOptionModal()
                    },
                },
                {
                    text: 'Reject Request',
                    onPress: () => {
                        onRemoveUser(_id)
                        this.closeOptionModal()
                    },
                },
                {
                    text: 'Cancel',
                    onPress: () => this.closeOptionModal(),
                },
            ]
        }
        return requestOptions
    }

    handleAdminUpdateUserStatus() {
        const {
            onAcceptUser,
            onRemoveUser,
            onPromoteUser,
            onDemoteUser,
            item,
            category,
        } = this.props
        const { _id } = item
        let requestOptions
        if (category === 'Admin') {
            requestOptions = switchByButtonIndex([
                [
                    R.equals(0),
                    () => {
                        console.log(
                            `${DEBUG_KEY} User chooses to remove user from current tribe`
                        )
                        return (
                            onDemoteUser(_id) ||
                            console.log(`${DEBUG_KEY}:
             No remove user function is supplied.`)
                        )
                    },
                ],
                // [R.equals(1), () => {
                //   console.log(`${DEBUG_KEY} User chooses to demote current user to become member`);
                //   return onDemoteUser(_id) || console.log(`${DEBUG_KEY}:
                //      No demote user function is supplied.`);
                // }],
            ])
        } else if (category === 'Member') {
            requestOptions = switchByButtonIndex([
                [
                    R.equals(0),
                    () => {
                        console.log(
                            `${DEBUG_KEY} User chooses to remove user from current tribe`
                        )
                        return (
                            onRemoveUser(_id) ||
                            console.log(`${DEBUG_KEY}:
             No remove user function is supplied.`)
                        )
                    },
                ],
                [
                    R.equals(1),
                    () => {
                        console.log(
                            `${DEBUG_KEY} User chooses to promote current user to become admin`
                        )
                        return (
                            onPromoteUser(_id) ||
                            console.log(`${DEBUG_KEY}:
             No promote user function is supplied.`)
                        )
                    },
                ],
            ])
        } else if (category === 'Invitee') {
            requestOptions = switchByButtonIndex([
                [
                    R.equals(0),
                    () => {
                        console.log(
                            `${DEBUG_KEY} User chooses to withdraw invitiation for user`
                        )
                        return (
                            onRemoveUser(_id) ||
                            console.log(`${DEBUG_KEY}:
             No remove user function is supplied.`)
                        )
                    },
                ],
            ])
        } else {
            requestOptions = switchByButtonIndex([
                [
                    R.equals(0),
                    () => {
                        console.log(
                            `${DEBUG_KEY} User chooses to promote current user to become admin`
                        )
                        return (
                            onAcceptUser(_id) ||
                            console.log(`${DEBUG_KEY}:
             No accept user function is supplied.`)
                        )
                    },
                ],
                [
                    R.equals(1),
                    () => {
                        console.log(
                            `${DEBUG_KEY} User chooses to remove requester from current tribe`
                        )
                        return (
                            onRemoveUser(_id) ||
                            console.log(`${DEBUG_KEY}:
             No remove user function is supplied.`)
                        )
                    },
                ],
            ])
        }

        const { options, cancelIndex } = switchSettingOptions(category)
        const adminActionSheet = actionSheet(
            options,
            cancelIndex,
            requestOptions
        )
        // const renderBottomSheet = () => {
        //     // const options = this.makeProfileCardOptions()
        //     // // Options height + bottom space + bottom sheet handler height
        //     const sheetHeight = getButtonBottomSheetHeight(options.length)
        //     return (
        //         <BottomButtonsSheet
        //             ref={(r) => (this.bottomSheetRef = r)}
        //             buttons={requestOptions}
        //             height={sheetHeight}
        //         />
        //     )
        // }
        adminActionSheet()
    }

    renderButton = (userId) => {
        let button
        if (this.state.invited) {
            button = this.renderInvitedButton(userId)
        } else {
            button = this.renderInviteButton(userId)
        }

        return (
            <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                {button}
                <View style={{ flex: 1 }} />
            </View>
        )
    }

    handleRequestFriend = (userId) => {
        this.setState(
            {
                ...this.state,
                invited: true,
            },
            () =>
                this.props.updateFriendship(
                    userId,
                    '',
                    'requestFriend',
                    'requests.outgoing',
                    undefined
                )
        )
    }

    renderInvitedButton = (userId) => {
        const text = 'Request Sent'
        return (
            <DelayedButton
                style={[
                    styles.buttonTextContainerStyle,
                    { backgroundColor: '#BDBDBD' },
                ]}
                onPress={() => {}}
                disabled
            >
                <Text
                    style={[
                        default_style.buttonText_1,
                        { color: 'white', fontSize: 12 },
                    ]}
                >
                    {text}
                </Text>
            </DelayedButton>
        )
    }

    renderInviteButton = (userId) => {
        const text = 'Add Friend'

        const { index } = this.props

        return (
            <DelayedButton
                style={[
                    styles.buttonTextContainerStyle,
                    { backgroundColor: color.GM_BLUE },
                ]}
                onPress={() => {
                    this.handleRequestFriend(userId)
                }}
                activeOpacity={0.6}
            >
                <Text
                    style={[
                        default_style.buttonText_1,
                        { color: 'white', fontSize: 12 },
                    ]}
                >
                    {text}
                </Text>
            </DelayedButton>
        )
    }

    renderProfileImage(item) {
        return (
            <ProfileImage
                imageUrl={getProfileImageOrDefaultFromUser(item)}
                userId={item._id}
            />
        )
    }

    renderInfo(item) {
        const { name } = item
        return (
            <View
                style={{
                    flexDirection: 'row',
                    marginVertical: 6,
                    alignItems: 'center',
                }}
            >
                <Name text={name} />
            </View>
        )
    }

    renderOccupation(item) {
        const { profile } = item
        if (profile && profile.occupation) {
            return (
                <Text style={default_style.normalText_2}>
                    {profile.occupation}
                </Text>
            )
        }
        return null
    }

    // If user is admin, then he can click to remove / promote a user
    renderSettingIcon() {
        const { isAdmin, isSelf } = this.props
        if (isAdmin && !isSelf) {
            return (
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => this.openOptionModal()}
                    style={{ alignSelf: 'center', justifyContent: 'center' }}
                >
                    <Image
                        style={{ width: 23, height: 19, tintColor: '#21364C' }}
                        source={FriendsSettingIcon}
                    />
                </TouchableOpacity>
            )
        }
        return null
    }

    render() {
        const { item, index } = this.props
        if (!item) return null

        const { headline, _id } = item
        const options = this.adminUpdateUserStatusOptions()
        const sheetHeight = getButtonBottomSheetHeight(options.length)
        console.log('_IDDD', this.props.isFriend)
        return (
            <View style={styles.containerStyle} key={index}>
                {this.renderProfileImage(item)}
                <TouchableOpacity
                    style={styles.bodyContainerStyle}
                    activeOpacity={0.6}
                    onPress={() => this.props.openProfile(_id)}
                >
                    {this.renderInfo(item)}
                    <UserTopGoals
                        user={item}
                        style={{ marginLeft: 0, marginVertical: 4 }}
                    />
                    {this.props.isFriend
                        ? null
                        : this.props.isSelf
                        ? null
                        : this.renderButton(_id)}
                    {/* <TouchableOpacity
                        style={{
                            height: 30,
                            width: 100,
                            backgroundColor: '#42C0F5',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 5,
                            borderRadius: 3,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 12,
                                color: 'white',
                                fontWeight: '600',
                            }}
                        >
                            Add Friend
                        </Text>
                    </TouchableOpacity> */}
                </TouchableOpacity>
                {this.renderSettingIcon()}
                <BottomButtonsSheet
                    ref={(r) => (this.bottomSheetRef = r)}
                    buttons={options}
                    height={sheetHeight}
                />
            </View>
        )
    }
}

const styles = {
    containerStyle: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 20,
        paddingVertical: 10,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F2',
    },
    bodyContainerStyle: {
        flex: 1,
        marginLeft: 8,
    },
    infoContainerStyle: {
        flexDirection: 'row',
    },
    buttonContainerStyle: {
        marginLeft: 8,
        flexDirection: 'row',
    },
    buttonTextContainerStyle: {
        marginRight: 8,
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
}

const switchSettingOptions = (category) =>
    switchCase({
        Admin: {
            options: ['Demote Admin', 'Cancel'],
            cancelIndex: 1,
        },
        Member: {
            options: ['Remove User', 'Promote to Admin', 'Cancel'],
            cancelIndex: 2,
        },
        Invitee: {
            options: ['Withdraw Invitation', 'Cancel'],
            cancelIndex: 1,
        },
        JoinRequester: {
            options: ['Accept Request', 'Reject Request', 'Cancel'],
            cancelIndex: 2,
        },
    })('Admin')(category)

export default connect(null, {
    openProfile,
    updateFriendship,
})(MemberListCard)
