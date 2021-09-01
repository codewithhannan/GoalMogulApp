/** @format */

import React from 'react'
import { View, Text, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import DelayedButton from '../Common/Button/DelayedButton'
import { text, color, default_style } from '../../styles/basic'
import UserCardHeader from './Common/UserCardHeader'
import UserTopGoals from '../Common/Card/CardComponent/UserTopGoals'
import { updateFriendship, openProfile, blockUser } from '../../actions'
import BottomButtonsSheet from '../Common/Modal/BottomButtonsSheet'
import AnimatedCardWrapper from '../Common/Card/AnimatedCardWrapper'
import { createReport } from '../../redux/modules/report/ReportActions'
import Icons from '../../asset/base64/Icons'
import { getBottomSpace } from 'react-native-iphone-x-helper'
import { getButtonBottomSheetHeight } from '../../styles'

const { width } = Dimensions.get('window')

const DATA = []
for (let i = 0; i < 10; i++) {
    DATA.push(i)
}

/**
 * People you may know card to display user information
 *
 * TODO: this can later be refactored to be FriendCard where buttons have multiple functions depends on the state of user
 * Improvement: when PYMK is request, we can hide this card by filtering the data that is requests.outgoing
 */
class PYMKCard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // When this card is initially displayed, there is no friendship request.
            // If friendship is sent, then in the next refresh, the card won't exist.
            invited: false,
            invitedCount: 0,
        }
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

    closeOptionModal = () => this.bottomSheetRef.close()

    openOptionModal = () => this.bottomSheetRef.open()

    makeFriendCardOptions = (userDoc) => {
        const { _id } = userDoc

        return [
            {
                text: 'Report',
                textStyle: { color: 'black' },
                icon: { name: 'account-alert', pack: 'material-community' },
                iconStyle: { height: 24, color: 'black' },
                imageStyle: { tintColor: 'black' },
                onPress: () => {
                    this.closeOptionModal()
                    this.props.createReport(_id, undefined, 'User')
                },
            },
            {
                text: 'Block',
                image: Icons.AccountCancel,
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
        const options = this.makeFriendCardOptions(userDoc)
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

    renderButton = (userId) => {
        let button
        if (this.state.invited) {
            button = this.renderInvitedButton(userId)
        } else {
            button = this.renderInviteButton(userId)
        }

        return (
            <View
                style={{ flexDirection: 'row', marginLeft: 49, marginTop: 10 }}
            >
                {button}
                <View style={{ flex: 1 }} />
            </View>
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

    renderTopGoal = (user) => {
        const { topGoals } = user

        let topGoalText = 'None shared'
        if (
            topGoals !== null &&
            topGoals !== undefined &&
            topGoals.length !== 0
        ) {
            topGoalText = ''
            topGoals.forEach((g, index) => {
                if (index !== 0) {
                    topGoalText = `${topGoalText}, ${g}`
                } else {
                    topGoalText = `${g}`
                }
            })
        }

        return (
            <View style={styles.infoContainerStyle}>
                <View style={{ flex: 1 }}>
                    <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={styles.topGoalTextStyle}
                    >
                        <Text style={{ color: color }}>Top Goal: </Text>
                        <Text>{topGoalText}</Text>
                    </Text>
                </View>
            </View>
        )
    }

    render() {
        const { user, ...otherProps } = this.props
        if (!user) {
            return null
        }
        console.log('PYMK', user)

        return (
            <AnimatedCardWrapper {...otherProps}>
                <DelayedButton
                    style={[styles.containerStyle, { padding: 20 }]}
                    activeOpacity={0.8}
                    onPress={() => this.props.openProfile(user._id)}
                >
                    <UserCardHeader
                        user={user}
                        optionsOnPress={this.openOptionModal}
                        hideOptions
                    />
                    <UserTopGoals user={user} />
                    {this.renderButton(user._id)}
                    {this.renderBottomSheet(user)}
                </DelayedButton>
            </AnimatedCardWrapper>
        )
    }
}

const styles = {
    containerStyle: { width: '100%', backgroundColor: 'white' },
    imageContainerStyle: {
        width: width * 0.14,
        height: width * 0.14,
        borderRadius: width * 0.07,
    },
    imageStyle: {
        width: width * 0.14,
        height: width * 0.14,
        borderRadius: width * 0.07,
    },
    topGoalTextStyle: {
        fontSize: text.TEXT_FONT_SIZE.FONT_1,
        lineHeight: text.TEXT_LINE_HEIGHT.FONT_2,
        fontFamily: text.FONT_FAMILY.REGULAR,
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

export default connect(null, {
    updateFriendship,
    openProfile,
    blockUser,
    createReport,
})(PYMKCard)
