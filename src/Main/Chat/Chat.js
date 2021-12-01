/** @format */

import React from 'react'
import { Alert, AsyncStorage, View } from 'react-native'
import { copilot } from 'react-native-copilot-gm'
import { MenuProvider } from 'react-native-popup-menu'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import direct_message_image from '../../asset/utils/direct_message.png'
import next from '../../asset/utils/next.png'
import profile_people_image from '../../asset/utils/profile_people.png'
import { trackWithProperties, EVENT as E } from '../../monitoring/segment'
// Actions
import {
    createOrGetDirectMessage,
    plusPressed,
    plusUnpressed,
    refreshUnreadCountForTabs,
    selectChatTab,
} from '../../redux/modules/chat/ChatActions'
import {
    pauseTutorial,
    resetTutorial,
    showNextTutorialPage,
    startTutorial,
    updateNextStepNumber,
} from '../../redux/modules/User/TutorialActions'
import { color } from '../../styles/basic'
import PlusButton from '../Common/Button/PlusButton'
import SearchBarHeader from '../Common/Header/SearchBarHeader'
/* Components */
import TabButtonGroup from '../Common/TabButtonGroup'
import Tooltip from '../Tutorial/Tooltip'
import { svgMaskPath } from '../Tutorial/Utils'
import ChatRoomList from './ChatRoomList/ChatRoomList'
import ChatRoomTab from './ChatRoomList/ChatRoomTab'

export const CHAT_TAB_LAST_INDEX = 'chat_tab_last_index'
const DEBUG_KEY = '[ UI ChatTab ]'
const UNREAD_BADGE_COUNT_REFRESH_INTERVAL_MS = 3000

class ChatTab extends React.Component {
    componentDidUpdate(prevProps) {
        if (!prevProps.showTutorial && this.props.showTutorial === true) {
            if (Actions.currentScene === 'chat') {
                console.log(`${DEBUG_KEY}: [ componentDidUpdate ]: [ start ]`)
                this.props.start()
            } else {
                // Current scene is not meet thus reseting the showTutorial state
                this.props.pauseTutorial('chat_tab_flow', 'chat_tab', 0)
            }
        }
    }

    componentDidMount() {
        // refresh badge count
        this._refreshUnreadBadgeCount()
        this.unreadBadgeRefreshInterval = setInterval(
            this._refreshUnreadBadgeCount,
            UNREAD_BADGE_COUNT_REFRESH_INTERVAL_MS
        )

        setTimeout(() => {
            trackWithProperties(E.DEEPLINK_CLICKED, {
                FunnelName: this.props.funnel,
            })
        }, 2000)

        AsyncStorage.getItem(CHAT_TAB_LAST_INDEX).then((maybeLastIndex) => {
            if (parseInt(maybeLastIndex)) {
                setTimeout(() => {
                    this.props.selectChatTab(parseInt(maybeLastIndex))
                }, 400)
            }
        })

        // Tutorial related
        this.props.copilotEvents.on('stop', () => {
            console.log(`${DEBUG_KEY}: [ componentDidMount ]: tutorial stop.`)
            this.props.showNextTutorialPage('chat_tab_flow', 'chat_tab')

            // Right now we don't need to have conditions here
            this.props.resetTutorial('chat_tab_flow', 'chat_tab')
        })

        this.props.copilotEvents.on('stepChange', (step) => {
            const { name, order, visible, target, wrapper } = step
            console.log(
                `${DEBUG_KEY}: [ onStepChange ]: step order: ${order}, step visible: ${name} `
            )

            // We showing current order. SO the next step should be order + 1
            this.props.updateNextStepNumber(
                'chat_tab_flow',
                'chat_tab',
                order + 1
            )
        })

        // Focus listener
        this.didFocusListener = this.props.navigation.addListener(
            'didFocus',
            () => {
                // We always fire this event since it's only stored locally
                if (!this.props.hasShown) {
                    // Force private message tab
                    this.props.selectChatTab(0)
                    /*
                    NOTE: We're removing the tutorial for now since it bugs out and needs to be overhauled
                    setTimeout(() => {
                        console.log(
                            `${DEBUG_KEY}: [ onFocus ]: [ startTutorial ]`
                        )
                        this.props.startTutorial('chat_tab_flow', 'chat_tab')
                    }, 300)
                    */
                }
            }
        )
    }
    componentWillUnmount() {
        clearInterval(this.unreadBadgeRefreshInterval)

        // Tutorial related
        this.props.copilotEvents.off('stop')
        this.props.copilotEvents.off('stepChange')
    }

    _refreshUnreadBadgeCount = () => {
        this.props.refreshUnreadCountForTabs()
    }
    _renderHeader = (props) => {
        const tabNotificationMap = {
            directMessages: {
                hasNotification: this.props.directMessagesUnread,
                style: {
                    backgroundColor: '#fa5052',
                    height: 8,
                    width: 8,
                    borderRadius: 4,
                },
                selectedStyle: {
                    backgroundColor: '#fff',
                },
                containerStyle: {
                    marginLeft: 5,
                },
                selectedContainerStyle: {},
            },
            chatRooms: {
                hasNotification: this.props.chatRoomsUnread,
                style: {
                    backgroundColor: '#fa5052',
                    height: 8,
                    width: 8,
                    borderRadius: 4,
                },
                selectedStyle: {
                    backgroundColor: '#fff',
                },
                containerStyle: {
                    marginLeft: 5,
                },
                selectedContainerStyle: {},
            },
        }

        return (
            <TabButtonGroup
                buttons={props}
                tabNotificationMap={tabNotificationMap}
            />
        )
    }

    renderScene() {
        return (
            <ChatRoomList
                tabKey="allChats"
                tutorialOn={{
                    chatBot: {
                        tutorialText: this.props.tutorialText[1],
                        order: 1,
                        name: 'chat_tab_flow_chat_tab_bot',
                    },
                }}
            />
        )
    }
    /**
     * @deprecated
     */
    _renderScene = ({ route }) => {
        switch (route.key) {
            case 'directMessages': {
                return (
                    <ChatRoomTab
                        tabKey="directMessages"
                        tutorialOn={{
                            chatBot: {
                                tutorialText: this.props.tutorialText[1],
                                order: 1,
                                name: 'chat_tab_flow_chat_tab_bot',
                            },
                        }}
                    />
                )
            }

            case 'chatRooms': {
                return <ChatRoomTab tabKey="chatRooms" />
            }

            default:
                return null
        }
    }

    openCreateChatMenu() {
        this.props.plusPressed()
        Actions.push('createButtonOverlay', {
            onCancel: () => this.props.plusUnpressed(),
            onActionSelect: () => this.props.plusUnpressed(),
            buttons: [
                {
                    name: 'createDirectMessage',
                    iconStyle: { height: 18, width: 18, marginLeft: 3 },
                    textStyle: { marginLeft: 5 },
                    iconSource: direct_message_image,
                    text: 'Direct',
                    onPress: () => {
                        const searchFor = {
                            type: 'directChat',
                        }
                        const cardIconStyle = { tintColor: color.GM_BLUE }
                        const cardIconSource = next
                        const callback = (selectedUserId) => {
                            this.props.createOrGetDirectMessage(selectedUserId)
                        }
                        Actions.push('searchPeopleLightBox', {
                            searchFor,
                            cardIconSource,
                            cardIconStyle,
                            callback,
                        })
                    },
                },
                {
                    name: 'createChatRoom',
                    iconStyle: { height: 18, width: 18, marginLeft: 3 },
                    textStyle: { marginLeft: 5 },
                    iconSource: profile_people_image,
                    text: 'Group',
                    onPress: () => {
                        Actions.push('createChatRoomStack')
                    },
                },
            ],
        })
    }

    renderPlus() {
        return (
            <PlusButton
                onPress={this.openCreateChatMenu.bind(this)}
                plusActivated={this.props.showPlus}
                tutorial={{
                    tutorialText: this.props.tutorialText[0],
                    order: 0,
                    name: 'chat_tab_flow_chat_tab_plus_button',
                }}
            />
        )
    }

    render() {
        return (
            <MenuProvider
                skipInstanceCheck={true}
                customStyles={{ backdrop: styles.backdrop }}
            >
                <View style={styles.homeContainerStyle}>
                    <SearchBarHeader rightIcon="menu" />
                    {this.renderScene()}
                    {/* <TabView
                        navigationState={this.props.navigationState}
                        renderScene={this._renderScene}
                        renderTabBar={this._renderHeader}
                        onIndexChange={this.props.selectChatTab}
                        useNativeDriver
                    /> */}
                    {this.renderPlus()}
                </View>
            </MenuProvider>
        )
    }
}

const mapStateToProps = (state) => {
    const { navigationState, showPlus, directMessages, chatRooms } = state.chat
    const { chat_tab_flow } = state.tutorials
    const { chat_tab } = chat_tab_flow
    const { tutorialText, showTutorial, hasShown } = chat_tab

    return {
        navigationState,
        showPlus,
        directMessagesUnread: directMessages.unreadCount,
        chatRoomsUnread: chatRooms.unreadCount,
        // Tutorial related
        tutorialText,
        showTutorial,
        hasShown,
    }
}

const styles = {
    homeContainerStyle: {
        backgroundColor: '#f8f8f8',
        flex: 1,
    },
    textStyle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#696969',
    },
    onSelectTextStyle: {
        fontSize: 12,
        fontWeight: '600',
        color: 'white',
    },
    backdrop: {
        backgroundColor: 'gray',
        opacity: 0.5,
    },

    // Styles for plus icon
    iconContainerStyle: {
        position: 'absolute',
        bottom: 20,
        right: 15,
        height: 54,
        width: 54,
        borderRadius: 27,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: color.GM_BLUE,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 2,
    },
    iconStyle: {
        height: 26,
        width: 26,
        tintColor: 'white',
    },
}

const ChatTabExplained = copilot({
    overlay: 'svg', // or 'view'
    animated: true, // or false
    stepNumberComponent: () => <View />,
    tooltipComponent: Tooltip,
    svgMaskPath: svgMaskPath,
})(ChatTab)

export default connect(mapStateToProps, {
    selectChatTab,
    plusPressed,
    plusUnpressed,
    createOrGetDirectMessage,
    refreshUnreadCountForTabs,
    // Tutorial related
    pauseTutorial,
    showNextTutorialPage,
    resetTutorial,
    updateNextStepNumber,
    startTutorial,
})(ChatTabExplained)
