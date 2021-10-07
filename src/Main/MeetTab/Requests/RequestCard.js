/** @format */

import React, { Component } from 'react'
import {
    View,
    Text,
    ActionSheetIOS,
    TouchableOpacity,
    Alert,
} from 'react-native'
import { connect } from 'react-redux'
import { Button } from 'react-native-elements'

// Components
import Name from '../../Common/Name'

// Actions
import { updateFriendship, openProfile } from '../../../actions'

// Styles
import { cardBoxShadow } from '../../../styles'
import ProfileImage from '../../Common/ProfileImage'
import { getProfileImageOrDefaultFromUser } from '../../../redux/middleware/utils'

const FRIENDSHIP_BUTTONS = ['Withdraw request', 'Cancel']
const WITHDRAW_INDEX = 0
const CANCEL_INDEX = 1

const ACCEPT_BUTTONS = ['Accept', 'Remove', 'Cancel']
const ACCPET_INDEX = 0
const ACCPET_REMOVE_INDEX = 1
const ACCEPT_CANCEL_INDEX = 2

const TAB_KEY_OUTGOING = 'requests.outgoing'
const TAB_KEY_INCOMING = 'requests.incoming'

class RequestCard extends Component {
    state = {
        requested: true,
    }

    onRespondClicked = (friendshipId, userId) => {
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
                            null
                        )
                        break
                    case ACCPET_REMOVE_INDEX:
                        this.props.updateFriendship(
                            userId,
                            friendshipId,
                            'deleteFriend',
                            TAB_KEY_INCOMING,
                            null
                        )
                        break
                    default:
                        return
                }
            }
        )
    }

    onInvitedClicked = (friendshipId, userId) => {
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: FRIENDSHIP_BUTTONS,
                cancelButtonIndex: CANCEL_INDEX,
            },
            (buttonIndex) => {
                console.log('button clicked', FRIENDSHIP_BUTTONS[buttonIndex])
                switch (buttonIndex) {
                    case WITHDRAW_INDEX:
                        this.props.updateFriendship(
                            userId,
                            friendshipId,
                            'deleteFriend',
                            TAB_KEY_OUTGOING,
                            () => {
                                this.setState({ requested: false })
                            }
                        )
                        break
                    default:
                        return
                }
            }
        )
    }

    renderProfileImage(item) {
        return (
            <ProfileImage
                imageStyle={styles.imageStyle}
                imageUrl={getProfileImageOrDefaultFromUser(item.user)}
            />
        )
    }

    renderButton(item) {
        const { friendshipId, user } = item
        const userId = user._id
        switch (this.props.type) {
            case 'outgoing': {
                return (
                    <Button
                        title="Invited"
                        titleStyle={styles.buttonTextStyle}
                        clear
                        buttonStyle={styles.buttonStyle}
                        onPress={this.onInvitedClicked.bind(
                            this,
                            friendshipId,
                            userId
                        )}
                    />
                )
            }
            case 'incoming': {
                return (
                    <Button
                        title="Respond"
                        titleStyle={styles.buttonTextStyle}
                        clear
                        buttonStyle={styles.buttonStyle}
                        onPress={this.onRespondClicked.bind(
                            this,
                            friendshipId,
                            userId
                        )}
                    />
                )
            }

            default:
                return null
        }
    }

    renderInfo(item) {
        const { user } = item
        const { name } = user
        return (
            <View style={styles.infoContainerStyle}>
                <View
                    style={{
                        flexDirection: 'row',
                        marginRight: 6,
                        alignItems: 'center',
                    }}
                >
                    <Name text={name} />
                </View>
            </View>
        )
    }

    // TODO: decide the final UI for additional info
    renderAdditionalInfo(item) {
        return null
        // const { profile } = this.props.item;
        // let content = '';
        // if (profile.elevatorPitch) {
        //   content = profile.elevatorPitch;
        // } else if (profile.about) {
        //   content = profile.about;
        // }
        // return (
        //   <View style={{ flex: 1 }}>
        //     <Text
        //       style={styles.titleTextStyle}
        //       numberOfLines={1}
        //       ellipsizeMode='tail'
        //     >
        //       <Text style={styles.detailTextStyle}>
        //         {content}
        //       </Text>
        //     </Text>
        //   </View>
        // );
    }

    renderOccupation(item) {
        const { profile } = item.user
        if (profile.occupation) {
            return (
                <View style={{ flex: 1 }}>
                    <Text
                        style={styles.titleTextStyle}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        <Text style={styles.detailTextStyle}>
                            {profile.occupation}
                        </Text>
                    </Text>
                </View>
            )
        }
        return <View style={{ flex: 1 }} />
    }

    render() {
        const { item } = this.props
        if (!item) return null

        const { user } = item
        const { headline } = item
        return (
            <TouchableOpacity
                activeOpacity={1}
                style={[styles.containerStyle, cardBoxShadow]}
                onPress={() => this.props.openProfile(user._id)}
            >
                {this.renderProfileImage(item)}

                <View style={styles.bodyContainerStyle}>
                    {this.renderInfo(item)}
                    {this.renderOccupation(item)}

                    <Text
                        style={styles.jobTitleTextStyle}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {headline}
                    </Text>

                    {this.renderAdditionalInfo(item)}
                </View>
                <View style={styles.buttonContainerStyle}>
                    {this.renderButton(item)}
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = {
    containerStyle: {
        flexDirection: 'row',
        marginTop: 5,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 8,
        paddingBottom: 8,
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    bodyContainerStyle: {
        marginLeft: 8,
        flex: 1,
    },
    infoContainerStyle: {
        flexDirection: 'row',
    },
    imageStyle: {
        height: 48,
        width: 48,
    },
    buttonContainerStyle: {
        marginLeft: 8,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    buttonStyle: {
        width: 70,
        height: 26,
        borderWidth: 1,
        borderColor: '#17B3EC',
        borderRadius: 13,
    },
    buttonTextStyle: {
        color: '#17B3EC',
        fontSize: 11,
        fontWeight: '700',
        paddingLeft: 1,
        padding: 0,
        alignSelf: 'center',
    },
    buttonIconStyle: {
        marginTop: 1,
    },
    needContainerStyle: {},
    titleTextStyle: {
        color: '#17B3EC',
        fontSize: 11,
        paddingTop: 1,
        paddingBottom: 1,
        marginTop: 3,
    },
    detailTextStyle: {
        color: '#000000',
        paddingLeft: 3,
    },
    jobTitleTextStyle: {
        color: '#17B3EC',
        fontSize: 11,
        fontWeight: '800',
        paddingTop: 5,
        paddingBottom: 3,
    },
    friendTextStyle: {
        paddingLeft: 10,
        color: '#17B3EC',
        fontSize: 9,
        fontWeight: '800',
        maxWidth: 120,
    },
}

const mapStateToProps = (state) => {
    const { userId } = state.user

    return {
        userId,
    }
}

export default connect(mapStateToProps, {
    updateFriendship,
    openProfile,
})(RequestCard)
