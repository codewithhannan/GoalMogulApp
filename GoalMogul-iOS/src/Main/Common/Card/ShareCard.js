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
import { openProfile } from '../../../actions'
import { chat_style } from '../../../styles/Chat'
import { openGoalDetailById } from '../../../redux/modules/home/mastermind/actions'

const { width } = Dimensions.get('window')

class ShareCard extends React.Component {
    handleCardOnPress = () => {
        const { user, goal } = this.props
        if (user) {
            return this.props.openProfile(user._id)
        }

        if (goal && goal._id) {
            return this.props.openGoalDetailById(goal._id)
        }
    }

    getHeaderFromProps() {
        if (this.props.user) {
            return CARD_INFO.user
        }

        if (this.props.goal) {
            return CARD_INFO.goal
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
        let { user, goal, tribe } = this.props
        let content = null
        let containerStyleOverride = {}
        if (user) {
            // render user
            content = <UserCardHeader user={this.props.user} />
            containerStyleOverride = { ...styles.container }
        }

        if (goal && goal.title) {
            // Render goal title
            content = (
                <Text style={chat_style.chatMessageTextStyle} numberOfLines={2}>
                    {goal.title}
                </Text>
            )
        }

        // TODO: tribe
        // return (
        //     <View style={{ marginTop: 12 }}>
        //         <Text>

        //         </Text>
        //         {/* TODO: render image */}
        //     </View>
        // )

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
        // TODO
    },
}

export default connect(null, {
    openProfile,
    openGoalDetailById,
})(ShareCard)
