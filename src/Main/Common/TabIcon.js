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
import LottieView from 'lottie-react-native'
import NOTIFICATION_LOTTIE from '../../asset/toast_popup_lotties/notification_icon/Notification.json'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'

const CHAT_COUNT_UPDATE_INTERVAL = 1000
const NOTIFICATION_COUNT_UPDATE_INTERVAL = 10000
const DEBUG_KEY = '[ UI TabIcon ]'
const TUTORIAL_KEY = 'meet_tab_icon'

class TabIcon extends React.PureComponent {
    componentDidUpdate(prevProps) {
        // Tutorial logics
        // componentDidUpdate receive this new props {@showTutorial} for tutorial reducers
        // And it’s navigation.state.key is meet tab, then start tutorial on this guy
        const { token } = prevProps
        if (
            token !== undefined &&
            token.trim().length &&
            (!this.props.token || !this.props.token.length)
        ) {
            this.clearRefreshChatInterval()
            this.clearRefreshNotificationInterval()
        }

        if (
            (!token || !token.trim().length) &&
            this.props.token &&
            this.props.token.length
        ) {
            this.createRefreshChatInterval()
            this.createRefreshNotificationInterval()
        }
    }

    componentDidMount() {
        const { navigation } = this.props
        if (navigation.state.key == 'chatTab') {
            // chat count updater
            this.props.updateChatCount()
            this.createRefreshChatInterval()
        }

        if (navigation.state.key === 'notificationTab') {
            // notification count updater

            this.props.fetchUnreadCount()
            this.createRefreshNotificationInterval()
        }
    }

    componentWillUnmount() {
        this.clearRefreshChatInterval()
        this.clearRefreshNotificationInterval()
    }

    clearRefreshChatInterval = () => {
        if (this.refreshChatInterval) {
            clearInterval(this.refreshChatInterval)
        }
    }

    clearRefreshNotificationInterval = () => {
        if (this.refreshNotificationInterval) {
            clearInterval(this.refreshNotificationInterval)
        }
    }

    createRefreshChatInterval = () => {
        this.clearRefreshChatInterval()
        this.refreshChatInterval = setInterval(() => {
            this.props.updateChatCount()
        }, CHAT_COUNT_UPDATE_INTERVAL)
    }

    createRefreshNotificationInterval = () => {
        this.clearRefreshNotificationInterval()
        this.refreshNotificationInterval = setInterval(() => {
            this.props.fetchUnreadCount()
        }, NOTIFICATION_COUNT_UPDATE_INTERVAL)
    }
    startLottieAnim(anim) {
        console.log('THIS IS ANIMM', anim)
        this.lottieAnim = anim
        if (anim) {
            this.lottieAnim.play()
        }
    }

    render() {
        const {
            navigation,
            focused,
            notificationCount,
            chatCount,
            chatConversationOpen,
            nudgesCount,
        } = this.props
        // if (chatConversationOpen) return null;

        // console.log('NOTIFIFCATION COUNT', notificationCount)
        // console.log('NOTIFIFCATION COUNT 1', nudgesCount)

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
                        {notificationCount && notificationCount > 0 ? (
                            <LottieView
                                style={{
                                    height: hp(3.5),
                                }}
                                loop={false}
                                autoPlay
                                autoSize
                                source={NOTIFICATION_LOTTIE}
                            />
                        ) : (
                            <Icon
                                name="bell"
                                pack="material-community"
                                style={style}
                                zIndex={1}
                            />
                        )}
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

    const { nudgesData } = state.nudges
    const { chatCount } = state.navigationTabBadging

    const { activeChatRoomId } = state.chatRoom
    const { token } = state.user

    // TODO: @Jia Tutorial get showTutorial from tutorial reducer for this TUTORIAL_KEY
    return {
        notificationCount: unreadCount,
        // == undefined
        // ? state.notification.unread.data.length
        // : unreadCount,
        chatCount,
        chatConversationOpen: activeChatRoomId,
        token,
        nudgesCount: nudgesData.length,
    }
}

export default connect(mapStateToProps, {
    updateChatCount,
    fetchUnreadCount,
})(TabIcon)
