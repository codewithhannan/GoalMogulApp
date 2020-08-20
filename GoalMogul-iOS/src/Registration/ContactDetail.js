/** @format */

import React, { Component } from 'react'
import {
    View,
    Text,
    Image,
    ActionSheetIOS,
    ActivityIndicator,
} from 'react-native'
import { connect } from 'react-redux'

// Components
import ProfileImage from '../Main/Common/ProfileImage'
import DelayedButton from '../Main/Common/Button/DelayedButton'

// Assets
import badge from '../asset/utils/badge.png'
import Icons from '../asset/base64/Icons'

// Actions
import { updateFriendship, openProfile, UserBanner } from '../actions'
import Name from '../Main/Common/Name'
import { getProfileImageOrDefaultFromUser } from '../redux/middleware/utils'

const { CheckIcon: check, AddUser: addUser } = Icons
const checkIconColor = '#2dca4a'
const FRIENDSHIP_BUTTONS = ['Withdraw request', 'Cancel']
const WITHDRAW_INDEX = 0
const CANCEL_INDEX = 1
const TAB_KEY = 'contacts'

class ContactDetail extends Component {
    state = {
        requested: false,
        updating: false,
    }

    onFriendRequest = (_id, maybeInvitationType, maybeInvitationId) => {
        if (this.state.requested || maybeInvitationType === 'outgoing') {
            // Currently we don't allow user to withdraw invitation on this page
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    options: FRIENDSHIP_BUTTONS,
                    cancelButtonIndex: CANCEL_INDEX,
                },
                (buttonIndex) => {
                    switch (buttonIndex) {
                        case WITHDRAW_INDEX:
                            // Send request to withdraw request
                            this.setState({
                                ...this.state,
                                updating: true,
                            })
                            const callback = () =>
                                this.setState({
                                    ...this.state,
                                    requested: false,
                                    updating: false,
                                })
                            this.props.updateFriendship(
                                _id,
                                maybeInvitationId,
                                'deleteFriend',
                                TAB_KEY,
                                callback
                            )
                            break
                        default:
                            return
                    }
                }
            )
            return
        }

        this.setState({
            ...this.state,
            updating: true,
        })
        const callback = () =>
            this.setState({ ...this.state, requested: true, updating: false })
        this.props.updateFriendship(_id, '', 'requestFriend', TAB_KEY, callback)
    }

    renderButton(maybeInvitationType) {
        // When it's updating
        if (this.state.updating) {
            return (
                <View style={{ height: 30, width: 30 }}>
                    <ActivityIndicator size="small" />
                </View>
            )
        }

        if (
            this.state.requested ||
            (maybeInvitationType && maybeInvitationType === 'outgoing')
        ) {
            return (
                <View style={styles.checkIconContainerStyle}>
                    <Image
                        source={check}
                        style={{
                            height: 16,
                            width: 20,
                            tintColor: checkIconColor,
                        }}
                    />
                </View>
            )
        }
        return (
            <View style={styles.addUserIconContainerStyle}>
                <Image
                    source={addUser}
                    style={{ ...styles.iconStyle, tintColor: 'white' }}
                />
            </View>
        )
    }

    render() {
        const { item } = this.props
        if (!item) return null
        const {
            name,
            headline,
            _id,
            maybeInvitationType,
            maybeInvitationId,
        } = this.props.item
        return (
            <View style={styles.containerStyle}>
                <ProfileImage
                    imageStyle={{ height: 55, width: 55 }}
                    imageUrl={getProfileImageOrDefaultFromUser(item)}
                    imageContainerStyle={styles.imageContainerStyle}
                />
                {/* <View
          style={{
            ...styles.addUserIconContainerStyle,
            backgroundColor: '#d8d8d8',
            borderWidth: 0
          }}
        /> */}
                <DelayedButton
                    style={styles.bodyContainerStyle}
                    activeOpacity={0.6}
                    onPress={() => this.props.openProfile(_id)}
                >
                    {/* Name and banner  */}
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 3,
                        }}
                    >
                        <Name text={name} />
                        <UserBanner
                            user={item}
                            iconStyle={{
                                marginTop: 1,
                                marginLeft: 5,
                                height: 18,
                                width: 15,
                            }}
                        />
                    </View>

                    {/* Headline */}
                    <Text
                        style={styles.titleTextStyle}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {headline}
                    </Text>
                </DelayedButton>
                <View
                    style={{ justifyContent: 'flex-end', flexDirection: 'row' }}
                >
                    <DelayedButton
                        activeOpacity={0.6}
                        onPress={this.onFriendRequest.bind(
                            this,
                            _id,
                            maybeInvitationType,
                            maybeInvitationId
                        )}
                    >
                        {this.renderButton(maybeInvitationType)}
                    </DelayedButton>
                </View>
            </View>
        )
    }
}

const styles = {
    containerStyle: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 15,
        marginRight: 15,
        marginTop: 10,
        marginBottom: 10,
    },
    bodyContainerStyle: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flex: 1,
        marginLeft: 8,
        marginRight: 8,
    },

    titleTextStyle: {
        flex: 1,
        flexWrap: 'wrap',
    },
    imageStyle: {
        marginRight: 3,
    },
    addUserIconContainerStyle: {
        height: 36,
        width: 36,
        borderRadius: 18,
        borderWidth: 0,
        backgroundColor: '#17B3EC',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainerStyle: {
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'white',
    },
    checkIconContainerStyle: {
        height: 30,
        width: 30,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: checkIconColor,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconStyle: {
        height: 20,
        width: 20,
    },
}

export default connect(null, {
    updateFriendship,
    openProfile,
})(ContactDetail)
