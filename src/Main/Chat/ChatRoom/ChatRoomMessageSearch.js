/**
 * /*
 *     On load we need to:
 *     - subscribe to messages service for new message info
 *     - connect to live chat service for typing indicator
 *     - fetch the full chat document with members populated
 *
 * @format
 */

import { MaterialIcons } from '@expo/vector-icons'
import moment from 'moment'
import React from 'react'
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    TouchableOpacity,
    View,
} from 'react-native'
import { SearchBar, Text } from 'react-native-elements'
import { MenuProvider } from 'react-native-popup-menu'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
// Actions
import {} from '../../../redux/modules/chat/ChatRoomActions'
import {
    refreshChatMessageSearch,
    searchQueryUpdated,
} from '../../../redux/modules/chat/ChatRoomMessageSearchActions'
import { color } from '../../../styles/basic'
import { SearchIcon } from '../../../Utils/Icons'
import ModalHeader from '../../Common/Header/ModalHeader'
import ProfileImage from '../../Common/ProfileImage'

const MESSAGE_SEARCH_AUTO_SEARCH_DELAY_MS = 500

const DEBUG_KEY = '[ UI ChatRoomMessageSearch ]'
const LISTENER_KEY = 'ChatRoomMessageSearch'
class ChatRoomMessageSearch extends React.Component {
    state = {
        pageSize: 10,
    }
    constructor(props) {
        super(props)
    }
    _keyExtractor = (item) => item._id

    componentWillUnmount() {
        this.handleOnRefresh('')
        this.searchBar.clear()
    }

    closeSearch = () => {
        Actions.pop()
    }
    onSearchResultSelect = (messageDoc) => {
        Actions.push('chatMessageSnapshotModal', { mountedMessage: messageDoc })
    }
    handleOnRefresh = (maybeQuery) => {
        const { searchQuery, chatRoom, chatRoomMembersMap } = this.props
        const query = typeof maybeQuery == 'string' ? maybeQuery : searchQuery
        this.props.refreshChatMessageSearch(
            chatRoom._id,
            query,
            chatRoomMembersMap
        )
        this.setState({
            pageSize: 10,
        })
    }
    handleOnLoadMore = () => {
        if (this.state.pageSize > this.props.searchResults) return
        this.setState({
            pageSize: this.state.pageSize + 10,
        })
    }
    handleSearchUpdate(newText = '') {
        if (this.messageSearchTimer) {
            clearInterval(this.messageSearchTimer)
        }
        this.props.searchQueryUpdated(newText)
        if (newText.trim().length) {
            this.messageSearchTimer = setTimeout(
                this.handleOnRefresh.bind(this),
                MESSAGE_SEARCH_AUTO_SEARCH_DELAY_MS
            )
        } else {
            this.handleOnRefresh('')
        }
    }
    renderSearchResult = (item) => {
        const resultMessage = item.item
        const userDocument = resultMessage.creator
        if (!userDocument) return null

        return (
            <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => this.onSearchResultSelect(resultMessage)}
                style={{
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    flexDirection: 'row',
                    height: 60,
                    marginTop: 9,
                    marginBottom: 9,
                }}
            >
                <ProfileImage
                    userId={userDocument._id}
                    imageContainerStyle={{
                        ...styles.imageContainerStyle,
                        order: 1,
                    }}
                    imageStyle={{ height: 35, width: 35, borderRadius: 5 }}
                    imageUrl={
                        userDocument.profile && userDocument.profile.image
                    }
                />
                <View
                    style={{
                        flexGrow: 1,
                        order: 2,
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                    }}
                >
                    <Text
                        style={{
                            fontSize: 15,
                            fontWeight: '600',
                        }}
                    >
                        {userDocument.name}
                    </Text>
                    <View
                        style={{
                            marginTop: 3,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 13,
                            }}
                        >
                            {resultMessage.content.message}
                        </Text>
                        <Text
                            style={{
                                fontSize: 11,
                                color: '#CCC',
                            }}
                        >
                            {moment(resultMessage.created).format(
                                'h:mm a, MMM Do YYYY'
                            )}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    renderListHeader = () => {
        return (
            <SearchBar
                ref={(searchBar) => (this.searchBar = searchBar)}
                autoFocus={true}
                platform="default"
                clearIcon={
                    <MaterialIcons name="clear" color="#777" size={21} />
                }
                containerStyle={{
                    backgroundColor: 'transparent',
                    padding: 6,
                    borderColor: 'white',
                    borderWidth: 0,
                }}
                inputContainerStyle={{
                    backgroundColor: '#FAFAFA',
                }}
                inputStyle={{
                    fontSize: 15,
                }}
                placeholder={`Search ${this.props.chatRoomName}...`}
                onChangeText={this.handleSearchUpdate.bind(this)}
                onClear={this.handleSearchUpdate.bind(this)}
                searchIcon={
                    <SearchIcon
                        iconContainerStyle={{ marginBottom: 3, marginTop: 1 }}
                        iconStyle={{ tintColor: '#777', height: 15, width: 15 }}
                    />
                }
                value={this.props.searchQuery}
                lightTheme={true}
            />
        )
    }
    renderListFooter() {
        if (!this.props.searching) return null
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
        if (!this.props.searching) {
            return (
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 100,
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
                        {this.props.searchQuery.trim().length
                            ? 'No messages found'
                            : 'Search Messages'}
                    </Text>
                </View>
            )
        }
        return null
    }
    render() {
        const { chatRoom, chatRoomName, searchQuery } = this.props
        if (!chatRoom) {
            return null
        }
        return (
            <MenuProvider
                customStyles={{ backdrop: styles.backdrop }}
                skipInstanceCheck={true}
            >
                <KeyboardAvoidingView
                    behavior="padding"
                    style={{ flex: 1, backgroundColor: '#ffffff' }}
                >
                    <ModalHeader
                        title={
                            searchQuery.trim().length
                                ? `Searching for "${searchQuery}"`
                                : `Search ${chatRoomName}`
                        }
                        onCancel={() => this.closeSearch()}
                        back={true}
                        actionDisabled={true}
                        actionHidden={true}
                        containerStyles={{
                            backgroundColor: color.GM_BLUE,
                        }}
                        backButtonStyle={{
                            tintColor: '#21364C',
                        }}
                        titleTextStyle={{
                            color: '#21364C',
                        }}
                    />
                    <FlatList
                        data={this.props.searchResults.slice(
                            0,
                            this.state.pageSize
                        )}
                        renderItem={this.renderSearchResult}
                        numColumns={1}
                        keyExtractor={this._keyExtractor}
                        refreshing={this.props.searching}
                        ListHeaderComponent={this.renderListHeader}
                        ListFooterComponent={this.renderListFooter.bind(this)}
                        ListEmptyComponent={this.renderListEmptyState.bind(
                            this
                        )}
                        onEndThreshold={0}
                        onEndReached={this.handleOnLoadMore}
                    />
                </KeyboardAvoidingView>
            </MenuProvider>
        )
    }
}

const mapStateToProps = (state, props) => {
    const { user, userId } = state.user
    const {
        chatRoomsMap,
        activeChatRoomId,
        searchResults,
        searching,
        searchQuery,
    } = state.chatRoom

    let chatRoom = chatRoomsMap[activeChatRoomId]

    // extract details from the chat room
    let chatRoomName = 'Loading...'
    let chatRoomMembersMap = {}
    if (chatRoom) {
        chatRoom.members =
            chatRoom.members &&
            chatRoom.members.filter((memberDoc) => memberDoc.memberRef)
        if (chatRoom.roomType == 'Direct') {
            let otherUser =
                chatRoom.members &&
                chatRoom.members.find(
                    (memberDoc) => memberDoc.memberRef._id != userId
                )
            if (otherUser) {
                otherUser = otherUser.memberRef
                chatRoomName = otherUser.name
            }
        } else {
            chatRoomName = chatRoom.name
        }
        chatRoomMembersMap = chatRoom.members
            ? chatRoom.members.reduce((map, memberDoc) => {
                  map[memberDoc.memberRef._id] = memberDoc.memberRef
                  return map
              }, {})
            : chatRoomMembersMap
    }

    return {
        chatRoom,
        chatRoomName,
        chatRoomMembersMap,
        searchResults,
        searching,
        searchQuery,
        user,
    }
}

export default connect(mapStateToProps, {
    refreshChatMessageSearch,
    searchQueryUpdated,
})(ChatRoomMessageSearch)

const styles = {
    homeContainerStyle: {
        backgroundColor: '#f8f8f8',
        flex: 1,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 1 },
        // shadowOpacity: 0.3,
        // shadowRadius: 6,
    },
    imageContainerStyle: {
        height: 35,
        width: 35,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#f4f4f4',
        padding: 2,
        marginRight: 12,
        marginLeft: 12,
    },
}
