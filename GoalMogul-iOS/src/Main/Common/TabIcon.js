/** @format */

import React from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'
import { Icon } from '@ui-kitten/components'

/* Actions */
import { updateChatCount } from '../../redux/modules/navigation/TabIconActions'
import { fetchUnreadCount } from '../../redux/modules/notification/NotificationTabActions'

/* Utils */
import { Logger } from '../../redux/middleware/utils/Logger'
import { color } from '../../styles/basic'

const CHAT_COUNT_UPDATE_INTERVAL = 1000
const NOTIFICATION_COUNT_UPDATE_INTERVAL = 10000
const DEBUG_KEY = '[ UI TabIcon ]'
const TUTORIAL_KEY = 'meet_tab_icon'

class TabIcon extends React.PureComponent {
    componentDidUpdate(prevProps) {
        // Tutorial logics
        // componentDidUpdate receive this new props {@showTutorial} for tutorial reducers
        // And it’s navigation.state.key is meet tab, then start tutorial on this guy
    }

    componentDidMount() {
        const { navigation } = this.props
        if (navigation.state.key == 'chatTab') {
            // chat count updater
            this.props.updateChatCount()
            this.refreshChatInterval = setInterval(() => {
                this.props.updateChatCount()
            }, CHAT_COUNT_UPDATE_INTERVAL)
        }

        if (navigation.state.key === 'notificationTab') {
            // notification count updater
            this.props.fetchUnreadCount()
            this.refreshNotificationInterval = setInterval(() => {
                Logger.log(
                    `${DEBUG_KEY}: [ Timer firing ] Fetching unread count.`,
                    '',
                    4
                )
                this.props.fetchUnreadCount()
            }, NOTIFICATION_COUNT_UPDATE_INTERVAL)
        }
    }

    componentWillUnmount() {
        clearInterval(this.refreshChatInterval)

        // Clearn notification refresh interval
        if (this.refreshNotificationInterval !== undefined) {
            Logger.log(
                `${DEBUG_KEY}: [ Notification timer clearing ]`,
                undefined,
                3
            )
            clearInterval(this.refreshNotificationInterval)
        }
    }

    render() {
        const {
            navigation,
            focused,
            notificationCount,
            chatCount,
            chatConversationOpen,
        } = this.props
        // if (chatConversationOpen) return null;

        const tintColor = focused ? color.GM_BLUE : '#BDBDBD'
        const style = {
            tintColor,
            height: 25,
            width: 35,
        }

        switch (navigation.state.key) {
            case 'homeTab':
                return (
                    <View style={styles.iconContainerStyle}>
                        <Icon
                            name="home"
                            pack="material-community"
                            style={style}
                        />
                    </View>
                )
            case 'profileTab':
                return (
                    <View style={styles.iconContainerStyle}>
                        <Icon
                            name="account"
                            pack="material-community"
                            style={style}
                        />
                    </View>
                )
            case 'notificationTab':
                return (
                    <View style={styles.iconContainerStyle}>
                        {notificationCount && notificationCount > 0 ? (
                            <View
                                style={styles.notificationCountContainerStyle}
                                zIndex={2}
                            >
                                <Text style={styles.notificationCountTextStyle}>
                                    {notificationCount}
                                </Text>
                            </View>
                        ) : null}
                        <Icon
                            name="bell"
                            pack="material-community"
                            style={style}
                            zIndex={1}
                        />
                    </View>
                )
            case 'chatTab':
                return (
                    <View style={styles.iconContainerStyle}>
                        {chatCount && chatCount > 0 ? (
                            <View
                                style={styles.notificationCountContainerStyle}
                                zIndex={2}
                            >
                                <Text style={styles.notificationCountTextStyle}>
                                    {chatCount}
                                </Text>
                            </View>
                        ) : null}
                        <Icon
                            name="chat-processing"
                            pack="material-community"
                            style={style}
                            zIndex={1}
                        />
                    </View>
                )
            case 'exploreTab':
                return (
                    <View style={styles.iconContainerStyle}>
                        <Icon
                            name="flag"
                            pack="material-community"
                            style={style}
                        />
                    </View>
                )
            default:
                return (
                    <Icon name="home" pack="material-community" style={style} />
                )
        }
    }
}

const styles = {
    iconContainerStyle: {
        height: 48,
        width: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    notificationCountContainerStyle: {
        backgroundColor: '#FF2B2C',
        height: 16,
        minWidth: 16,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 6,
        right: 8,
    },
    notificationCountTextStyle: {
        fontSize: 10,
        color: 'white',
        marginLeft: 4,
        marginRight: 3,
        alignSelf: 'center',
    },
}

const mapStateToProps = (state) => {
    const { unreadCount } = state.notification.unread
    const { chatCount } = state.navigationTabBadging
    const { activeChatRoomId } = state.chatRoom

    // TODO: @Jia Tutorial get showTutorial from tutorial reducer for this TUTORIAL_KEY
    return {
        notificationCount: unreadCount,
        chatCount,
        chatConversationOpen: activeChatRoomId,
    }
}

export default connect(mapStateToProps, {
    updateChatCount,
    fetchUnreadCount,
})(TabIcon)
