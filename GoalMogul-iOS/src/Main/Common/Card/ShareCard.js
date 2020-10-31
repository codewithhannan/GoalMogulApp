/**
 * This component is for any share cards
 * Currently it's used in Chat Message.
 *
 * @format
 */

import React from 'react'
import { View, Text, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import { Icon } from '@ui-kitten/components'
import DelayedButton from '../Button/DelayedButton'
import {
    GM_LIGHT_GRAY,
    GM_CARD_BACKGROUND,
    GM_BLUE,
} from '../../../styles/basic/color'
import UserCardHeader from '../../MeetTab/Common/UserCardHeader'
import { FONT_FAMILY } from '../../../styles/basic/text'
import { openProfile, fetchUserProfile } from '../../../actions'
import { chat_style } from '../../../styles/Chat'
import { openGoalDetail } from '../../../redux/modules/home/mastermind/actions'
import ProfileImage from '../ProfileImage'
import { myTribeDetailOpenWithId } from '../../../redux/modules/tribe/MyTribeActions'
import { default_style } from '../../../styles/basic'
import { getChatroomSharedEntity } from '../../../redux/modules/chat/ChatSelector'
import { refreshGoalDetailById } from '../../../redux/modules/goal/GoalDetailActions'

const { width } = Dimensions.get('window')
const SHARE_CARD_PAGE_ID = 'share_card'

/**
 * @param {String} tribeRef (optional) tribeId
 * @param {String} goalRef (optional)  goalId
 * @param {String} userRef (optional)  userId
 */
class ShareCard extends React.Component {
    componentDidMount() {
        // Load entity into redux
        const { userRef, goalRef, tribeRef } = this.props

        if (userRef) {
            this.props.fetchUserProfile(userRef, SHARE_CARD_PAGE_ID, true)
        }

        if (goalRef) {
            this.props.refreshGoalDetailById(
                goalRef,
                SHARE_CARD_PAGE_ID,
                null,
                true,
                { disableNotFoundAlert: true }
            )
        }

        if (tribeRef) {
            // TODO: fetch tribe detail by id
        }
    }

    handleCardOnPress = () => {
        const { userRef, goalRef, tribeRef, entity } = this.props
        if (userRef) {
            return this.props.openProfile(userRef)
        }

        if (goalRef && entity._id) {
            return this.props.openGoalDetail(entity)
        }

        if (tribeRef) {
            return this.props.myTribeDetailOpenWithId(tribeRef)
        }
    }

    getHeaderFromProps() {
        if (this.props.userRef) {
            return CARD_INFO.user
        }

        if (this.props.goalRef) {
            return CARD_INFO.goal
        }

        if (this.props.tribeRef) {
            return CARD_INFO.tribe
        }

        return null
    }

    renderHeader = () => {
        const headerProps = this.getHeaderFromProps()
        if (!headerProps) return null

        const { icon, title } = headerProps
        const { name, pack, style, iconContainerStyle } = icon
        return (
            <View
                style={{
                    flexDirection: 'row',
                    width: '100%',
                    alignItems: 'center',
                }}
            >
                <View style={iconContainerStyle}>
                    <Icon name={name} pack={pack} style={style} />
                </View>
                <Text
                    style={{
                        fontFamily: FONT_FAMILY.REGULAR,
                        color: '#828282',
                    }}
                >
                    {title}
                </Text>
            </View>
        )
    }

    renderContent = () => {
        let { userRef, goalRef, tribeRef, entity } = this.props
        let content = null
        let containerStyleOverride = {}
        if (userRef) {
            if (entity) {
                // render user
                content = <UserCardHeader user={entity} />
                containerStyleOverride = {
                    ...styles.container,
                    marginBottom: 0,
                }
            } else {
                // default content
            }
        }

        if (goalRef) {
            if (
                entity &&
                typeof entity.title === 'string' &&
                entity.title.trim().length > 0
            ) {
                // Render goal title
                content = (
                    <Text
                        style={chat_style.chatMessageTextStyle}
                        numberOfLines={2}
                    >
                        {entity.title}
                    </Text>
                )
            } else if (!entity.loading) {
                // render default content
                content = (
                    <Text style={chat_style.chatMessageTextStyle}>
                        NOT FOUND
                    </Text>
                )
            }
        }

        if (tribeRef) {
            if (entity) {
                // render tribe
                containerStyleOverride = {
                    ...styles.container,
                    marginBottom: 0,
                }
                content = <TribeCompactCard item={entity} />
            } else {
                // render default content
            }
        }

        return (
            <View style={{ marginTop: 8, ...containerStyleOverride }}>
                {content}
            </View>
        )
    }

    render() {
        return (
            <DelayedButton
                onPress={this.handleCardOnPress}
                style={[
                    styles.container,
                    { width: width - 72, minHeight: 60 },
                    this.props.containerStyle,
                ]}
                activeOpacity={0.8}
            >
                {this.renderHeader()}
                {this.renderContent()}
            </DelayedButton>
        )
    }
}

/**
 * Render tribe compact card.
 * TODO: migrate to become an independent component
 * @param {*} tribeDoc
 */
const TribeCompactCard = (props) => {
    const { item } = props
    const { name, memberCount, picture } = item

    return (
        <View style={{ flexDirection: 'row' }}>
            <ProfileImage
                imageUrl={picture}
                icon={
                    picture ? undefined : (
                        <Icon
                            name="flag"
                            pack="material-community"
                            style={{
                                height: 16,
                                width: 16,
                                tintColor: '#4F4F4F',
                            }}
                        />
                    )
                }
                imageContainerStyle={{
                    height: 40,
                    width: 40,
                    backgroundColor: GM_LIGHT_GRAY,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            />
            <View style={{ marginLeft: 8, justifyContent: 'space-evenly' }}>
                <Text style={default_style.titleText_2}>{name}</Text>
                <Text style={[default_style.smallText_1, { color: '#555555' }]}>
                    {memberCount} {memberCount > 1 ? 'members' : 'member'}
                </Text>
            </View>
        </View>
    )
}

const styles = {
    container: {
        borderColor: GM_LIGHT_GRAY,
        borderWidth: 1,
        borderRadius: 3,
        padding: 8,
        marginVertical: 5,
    },
}

const CARD_INFO = {
    goal: {
        icon: {
            name: 'bullseye-arrow',
            pack: 'material-community',
            style: { height: 12, tintColor: GM_CARD_BACKGROUND },
            iconContainerStyle: {
                padding: 4,
                backgroundColor: '#27AE60',
                borderRadius: 3,
                marginRight: 8,
            },
        },
        title: 'GOAL',
    },
    update: {
        icon: {
            name: 'feather',
            pack: 'material-community',
            style: { height: 12, tintColor: GM_CARD_BACKGROUND },
            iconContainerStyle: {
                padding: 4,
                backgroundColor: GM_BLUE,
                borderRadius: 3,
                marginRight: 8,
            },
        },
        title: 'UPDATE',
    },
    user: {
        icon: {
            name: 'account',
            pack: 'material-community',
            style: { height: 12, tintColor: GM_CARD_BACKGROUND },
            iconContainerStyle: {
                padding: 4,
                backgroundColor: '#2F80ED',
                borderRadius: 3,
                marginRight: 8,
            },
        },
        title: 'USER',
    },
    tribe: {
        icon: {
            name: 'flag',
            pack: 'material-community',
            style: { height: 12, tintColor: GM_CARD_BACKGROUND },
            iconContainerStyle: {
                padding: 4,
                backgroundColor: '#4F4F4F',
                borderRadius: 3,
                marginRight: 8,
            },
        },
        title: 'TRIBE',
    },
}

const mapStateToProps = (state, props) => {
    // props should contain one of userRef, goalRef, tribeRef
    const entity = getChatroomSharedEntity(state, props, SHARE_CARD_PAGE_ID)

    return {
        entity,
    }
}

export default connect(mapStateToProps, {
    openProfile,
    openGoalDetail,
    myTribeDetailOpenWithId,
    refreshGoalDetailById,
    fetchUserProfile,
})(ShareCard)
