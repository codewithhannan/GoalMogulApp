/** @format */

import _ from 'lodash'
import React from 'react'
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Platform,
    Text,
    Alert,
    View,
} from 'react-native'
import { CopilotStep, walkthroughable } from 'react-native-copilot-gm'
import { SearchBar } from 'react-native-elements'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
// Actions
import {
    createOrGetDirectMessage,
    loadMoreChatRooms,
    refreshChatRooms,
    searchQueryUpdated,
    updateCurrentChatRoomsList,
} from '../../../redux/modules/chat/ChatActions'
import MessageStorageService from '../../../services/chat/MessageStorageService'
import { DEVICE_MODEL, IPHONE_MODELS } from '../../../Utils/Constants'
import { SearchIcon } from '../../../Utils/Icons'
// Components
import ChatRoomCard from './ChatRoomCard'

const CHATROOM_AUTO_SEARCH_DELAY_MS = 500
const CHATROOM_LIST_REFRESH_INTERVAL = 3000 // ms

const SEARCHBAR_HEIGHT =
    Platform.OS === 'ios' && IPHONE_MODELS.includes(DEVICE_MODEL) ? 30 : 40

const SCREEN_HEIGHT = Dimensions.get('window').height
const BODY_HEIGHT = SCREEN_HEIGHT - 48.5 - 150 // - SEARCHBAR_HEIGHT
const DEBUG_KEY = '[ UI ChatRoomList ]'
const WalkableView = walkthroughable(View)

class ChatRoomList extends React.Component {
    _keyExtractor = (item) => item._id

    componentDidMount() {
        this.props.refreshChatRooms(
            this.props.currentTabKey,
            this.props.limit,
            ''
        )

        // try to update the chat room list every time a new message comes in our application
        const listenerKey = `ChatRoomList:${this.props.currentTabKey}`
        const listener = (incomingMessageInfo) =>
            this.props.updateCurrentChatRoomsList(
                this.props.currentTabKey,
                this.props.data,
                this.props.limit,
                this.props.searchQuery
            )
        MessageStorageService.onIncomingMessageStored(listenerKey, listener)
        MessageStorageService.onPulledMessageStored(listenerKey, listener)
        this._refreshOnInterval()
    }
    _refreshOnInterval() {
        this.refreshInterval = setInterval(
            () =>
                !this.props.searchQuery.trim().length &&
                this.props.updateCurrentChatRoomsList(
                    this.props.currentTabKey,
                    this.props.data,
                    this.props.limit,
                    this.props.searchQuery
                ),
            CHATROOM_LIST_REFRESH_INTERVAL
        )
    }

    /**
     * Only update the component when chat room list is updated
     * @param {*} nextProps
     * @param {*} nextState
     */
    shouldComponentUpdate(nextProps, nextState) {
        return (
            !_.isEqual(this.props.data, nextProps.data) ||
            !_.isEqual(this.props.refreshing, nextProps.refreshing) ||
            !_.isEqual(this.props.loading, nextProps.loading)
        )
    }

    componentWillUnmount() {
        const listenerKey = `ChatRoomList:${this.props.currentTabKey}`
        MessageStorageService.offIncomingMessageStored(listenerKey)
        MessageStorageService.offPulledMessageStored(listenerKey)
        clearInterval(this.refreshInterval)
    }

    handleOnRefresh = (maybeQuery) => {
        const query =
            typeof maybeQuery == 'string' ? maybeQuery : this.props.searchQuery
        this.props.refreshChatRooms(
            this.props.currentTabKey,
            this.props.limit,
            query
        )
    }

    handleOnLoadMore = () => {
        if (!this.props.hasNextPage) return
        this.props.loadMoreChatRooms(
            this.props.currentTabKey,
            this.props.limit,
            this.props.skip,
            this.props.searchQuery
        )
    }

    handleItemSelect = (item) => {
        if (item.isFriend) {
            this.props.createOrGetDirectMessage(item._id)
            this.search.clear()
        } else {
            Actions.push('chatRoomConversation', { chatRoomId: item._id })
        }
    }

    renderItem = ({ item }) => {
        const { chatBotState } = item
        const { tutorialOn } = this.props
        if (chatBotState && !_.isEmpty(chatBotState) && tutorialOn) {
            const { chatBot } = tutorialOn
            const { tutorialText, order, name } = chatBot
            return (
                <CopilotStep text={tutorialText} order={order} name={name}>
                    <WalkableView>
                        <ChatRoomCard
                            item={item}
                            onItemSelect={this.handleItemSelect}
                        />
                    </WalkableView>
                </CopilotStep>
            )
        }
        return <ChatRoomCard item={item} onItemSelect={this.handleItemSelect} />
    }

    handleSearchUpdate = (newText = '') => {
        if (this.chatroomSearchTimer) {
            clearInterval(this.chatroomSearchTimer)
        }
        this.props.searchQueryUpdated(this.props.currentTabKey, newText)
        if (newText.trim().length) {
            this.chatroomSearchTimer = setTimeout(
                this.handleOnRefresh.bind(this),
                CHATROOM_AUTO_SEARCH_DELAY_MS
            )
        } else {
            this.handleOnRefresh('')
        }
    }

    renderListHeader = () => {
        return null
        // TODO
        const { searchQuery } = this.props
        return (
            <SearchBar
                ref={(search) => (this.search = search)}
                platform="default"
                clearIcon={
                    null /*<MaterialIcons
					name="clear"
					color="#777"
					size={21}
				/>*/
                }
                containerStyle={{
                    backgroundColor: '#EEE',
                    padding: 6,
                    borderColor: 'transparent',
                }}
                inputContainerStyle={{
                    backgroundColor: '#FAFAFA',
                }}
                inputStyle={{
                    fontSize: 15,
                }}
                placeholder={`Search...`}
                onChangeText={this.handleSearchUpdate.bind(this)}
                onClear={this.handleSearchUpdate}
                searchIcon={
                    <SearchIcon
                        iconContainerStyle={{ marginBottom: 3, marginTop: 1 }}
                        iconStyle={{ tintColor: '#777', height: 15, width: 15 }}
                    />
                }
                value={searchQuery}
                lightTheme={true}
            />
        )
    }

    renderListFooter() {
        if (!this.props.loading) return null
        return (
            <View
                style={{
                    paddingVertical: 20,
                    borderTopWidth: 1,
                    borderColor: '#CED0CE',
                }}
            >
                <ActivityIndicator animating size="small" />
            </View>
        )
    }

    renderListEmptyState() {
        if (!this.props.loading && !this.props.refreshing) {
            return (
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: BODY_HEIGHT,
                    }}
                >
                    <Text
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: 18,
                            color: '#999',
                        }}
                    >
                        Tap the + button to start a conversation.
                    </Text>
                </View>
            )
        }
        return null
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    data={this.props.data}
                    renderItem={this.renderItem.bind(this)}
                    numColumns={1}
                    keyExtractor={this._keyExtractor}
                    refreshing={this.props.refreshing}
                    onRefresh={this.handleOnRefresh.bind(this)}
                    ListHeaderComponent={this.renderListHeader}
                    ListFooterComponent={this.renderListFooter.bind(this)}
                    ListEmptyComponent={this.renderListEmptyState.bind(this)}
                    onEndThreshold={0}
                    noBorder={true}
                    onEndReached={this.handleOnLoadMore.bind(this)}
                />
            </View>
        )
    }
}

const mapStateToProps = (state, props) => {
    const { navigationState } = state.chat
    // const currentTabKey = navigationState.routes[navigationState.index].key;
    // TODO: make tabKey as a required props
    const currentTabKey = props.tabKey
    const {
        loading,
        refreshing,
        limit,
        skip,
        hasNextPage,
        data,
        searchQuery,
    } = state.chat[currentTabKey]

    return {
        loading,
        refreshing,
        limit,
        skip,
        hasNextPage,
        data,
        searchQuery,
        currentTabKey,
    }
}

export default connect(mapStateToProps, {
    refreshChatRooms,
    loadMoreChatRooms,
    searchQueryUpdated,
    createOrGetDirectMessage,
    updateCurrentChatRoomsList,
})(ChatRoomList)
