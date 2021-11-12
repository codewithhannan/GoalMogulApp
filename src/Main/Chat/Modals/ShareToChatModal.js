/**
 * This is a search overlay for user.
 * Currently, it's used in Invite friends for Tribe and Events
 *
 * @format
 */

import React, { Component } from 'react'
import {
    View,
    ActivityIndicator,
    KeyboardAvoidingView,
    ScrollView,
    Text,
    TextInput,
    Alert,
    Image,
} from 'react-native'
import { connect } from 'react-redux'
import { SearchBar } from 'react-native-elements'
import { MenuProvider } from 'react-native-popup-menu'
import _ from 'lodash'
import plus from '../../../asset/utils/plus.png'
import times from '../../../asset/utils/times.png'
import ModalHeader from '../../Common/Header/ModalHeader'
import ProfileImage from '../../Common/ProfileImage'

import { SearchIcon } from '../../../Utils/Icons'
import { FlatList } from 'react-native-gesture-handler'
import SearchUserCard from '../../Search/People/SearchUserCard'
import {
    shareToChatReset,
    shareToChatChangeSearchQuery,
    shareToChatChangeShareMessage,
    shareToChatChangeSelectedItems,
    shareToChatSearch,
    shareToSelectedChats,
    shareToChatClearSearch,
} from '../../../redux/modules/chat/ShareToChatActions'
import { GROUP_CHAT_DEFAULT_ICON_URL } from '../../../Utils/Constants'
import DelayedButton from '../../Common/Button/DelayedButton'
import { Actions } from 'react-native-router-flux'

const DEBUG_KEY = '[ ShareToChatModal ]'
const AUTO_SEARCH_DELAY_MS = 500

class ShareToChatModal extends Component {
    _keyExtractor = (item) => item._id

    handleChangeSearchText = (searchText) => {
        this.props.shareToChatChangeSearchQuery(searchText)

        clearTimeout(this.searchTimeout)
        if (!searchText.trim().length) {
            return this.props.shareToChatClearSearch()
        }
        this.searchTimeout = setTimeout(
            () =>
                this.props.shareToChatSearch(
                    this.props.searchQuery,
                    [],
                    5,
                    this.props.chatRoomType
                ),
            AUTO_SEARCH_DELAY_MS
        )
    }
    handleLoadMore = () => {
        if (
            !this.props.hasNextPage ||
            this.props.loading ||
            !this.props.searchQuery.length
        )
            return
        this.props.shareToChatSearch(
            this.props.searchQuery,
            this.props.searchResults,
            5,
            this.props.chatRoomType
        )
    }
    onSearchResultSelect = (itemId, itemDoc) => {
        let newSelectedItems = _.map(this.props.selectedItems, _.clone)
        if (itemDoc.isSearchResult) {
            let newItemDoc = _.cloneDeep(itemDoc)
            newItemDoc = _.set(newItemDoc, 'isSearchResult', false)
            newSelectedItems.push(newItemDoc)
            this.search.clear()
            this.search.focus()
        } else {
            const indexToRemove = newSelectedItems.findIndex(
                (itemDoc) => itemDoc._id == itemId
            )
            if (indexToRemove > -1) {
                newSelectedItems.splice(indexToRemove, 1)
            } else {
                return
            }
        }
        this.props.shareToChatChangeSelectedItems(newSelectedItems)
    }

    handleChangeMessage = (newMessage) => {
        this.props.shareToChatChangeShareMessage(newMessage)
    }

    handleSubmit = () => {
        if (this.props.submitting) return

        const {
            userToShare,
            selectedItems,
            shareMessage,
            chatRoomType,
        } = this.props
        if (!selectedItems.length) {
            return Alert.alert('Select a conversation to continue')
        }
        this.props.shareToSelectedChats(
            selectedItems,
            shareMessage,
            userToShare,
            chatRoomType
        )
    }
    handleClose = () => {
        this.props.shareToChatReset()
        Actions.pop()
    }

    renderListItem = (item) => {
        if (this.props.chatRoomType == 'Direct') {
            // User Card
            return (
                <SearchUserCard
                    item={item.item}
                    onSelect={this.onSearchResultSelect}
                    cardIconSource={item.item.isSearchResult ? plus : times}
                    cardContainerStyles={
                        item.item.isSearchResult
                            ? {}
                            : { backgroundColor: '#D8EDFF' }
                    }
                />
            )
        } else {
            // Chat Room Card
            const doc = item.item
            if (!doc) return null
            const cardImage = doc.picture || GROUP_CHAT_DEFAULT_ICON_URL

            return (
                <View
                    style={{
                        ...styles.cardContainerStyle,
                        backgroundColor: doc.isSearchResult
                            ? 'white'
                            : '#D8EDFF',
                    }}
                >
                    {/* Image */}
                    <ProfileImage
                        imageStyle={{ height: 55, width: 55, borderRadius: 5 }}
                        imageUrl={cardImage}
                        rounded
                        imageContainerStyle={styles.imageContainerStyle}
                    />
                    {/* Title */}
                    <View
                        style={{
                            marginLeft: 10,
                            marginTop: 2,
                            flexGrow: 1,
                            height: 55,
                            alignItems: 'center',
                            flexDirection: 'row',
                        }}
                    >
                        <Text
                            style={{
                                flex: 1,
                                flexWrap: 'wrap',
                                color: 'black',
                                fontSize: 21,
                                fontWeight: '300',
                            }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {doc.name}
                        </Text>
                    </View>
                    {/* Action */}
                    <DelayedButton
                        style={{
                            marginLeft: 6,
                            marginRight: 12,
                            width: 30,
                            height: 30,
                        }}
                        onPress={() => this.onSearchResultSelect(doc._id, doc)}
                    >
                        <Image
                            source={doc.isSearchResult ? plus : times}
                            style={{
                                height: 30,
                                width: 30,
                                tintColor: '#17B3EC',
                            }}
                        />
                    </DelayedButton>
                </View>
            )
        }
    }
    renderListFooter = () => {
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
    renderListEmptyState = () => {
        if (this.props.loading) return null

        const searchPlaceHolder =
            this.props.chatRoomType == 'Direct'
                ? 'Search friends...'
                : 'Search group conversations...'
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
                        ? ''
                        : searchPlaceHolder}
                </Text>
            </View>
        )
    }
    render() {
        const searchPlaceHolder =
            this.props.chatRoomType == 'Direct'
                ? 'Search friends'
                : 'Search group conversations'
        const modalDescriptionSuffix =
            this.props.chatRoomType == 'Direct'
                ? 'as a direct message'
                : 'to group conversations'
        return (
            <MenuProvider
                customStyles={{ backdrop: styles.backdrop }}
                skipInstanceCheck={true}
            >
                <KeyboardAvoidingView
                    behavior="padding"
                    style={{
                        ...styles.homeContainerStyle,
                        flex: 1,
                        backgroundColor: '#ffffff',
                    }}
                >
                    <ModalHeader
                        title={`Share profile`}
                        actionText={'Share'}
                        onCancel={this.handleClose}
                        onAction={this.handleSubmit}
                    />
                    <ScrollView
                        style={{ borderTopColor: '#e9e9e9', borderTopWidth: 1 }}
                    >
                        <View>
                            <Text
                                style={{
                                    fontSize: 12,
                                    textAlign: 'center',
                                    marginTop: 24,
                                    marginBottom: 24,
                                    color: '#aaa',
                                }}
                            >
                                Share {this.props.userToShare.name}'s profile{' '}
                                {modalDescriptionSuffix}
                            </Text>
                            <TextInput
                                multiline={true}
                                placeholder={'Enter a message...'}
                                value={this.props.shareMessage}
                                onChangeText={this.handleChangeMessage}
                                style={{
                                    height: 81,
                                    padding: 15,
                                    paddingTop: 24,
                                    fontSize: 15,
                                    borderTopColor: '#EEE',
                                    borderTopWidth: 1,
                                }}
                            />
                        </View>
                        <SearchBar
                            ref={(search) => (this.search = search)}
                            platform="default"
                            clearIcon={null}
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
                            placeholder={searchPlaceHolder}
                            onChangeText={this.handleChangeSearchText}
                            searchIcon={
                                <SearchIcon
                                    iconContainerStyle={{
                                        marginBottom: 3,
                                        marginTop: 1,
                                    }}
                                    iconStyle={{
                                        tintColor: '#777',
                                        height: 15,
                                        width: 15,
                                    }}
                                />
                            }
                            value={this.props.searchQuery}
                            lightTheme={true}
                        />
                        <FlatList
                            data={this.props.selectedItems}
                            renderItem={this.renderListItem}
                            numColumns={1}
                            keyExtractor={this._keyExtractor}
                        />
                        {/* Search result items */}
                        <FlatList
                            data={this.props.searchResults.map((doc) => {
                                doc.isSearchResult = true
                                return doc
                            })}
                            renderItem={this.renderListItem}
                            numColumns={1}
                            keyExtractor={this._keyExtractor}
                            refreshing={this.props.loading}
                            ListFooterComponent={this.renderListFooter}
                            ListEmptyComponent={this.renderListEmptyState}
                            onEndThreshold={0}
                            onEndReached={this.handleLoadMore}
                        />
                    </ScrollView>
                </KeyboardAvoidingView>
            </MenuProvider>
        )
    }
}

const styles = {
    cardContainerStyle: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 12,
        paddingRight: 12,
        marginTop: 1,
    },
    imageContainerStyle: {
        borderWidth: 0.5,
        padding: 1.5,
        borderColor: 'lightgray',
        borderRadius: 6,
        backgroundColor: 'white',
    },
    searchContainerStyle: {
        padding: 0,
        marginRight: 3,
        backgroundColor: '#ffffff',
        borderTopColor: '#ffffff',
        borderBottomColor: '#ffffff',
        alignItems: 'center',
    },
    searchInputContainerStyle: {
        backgroundColor: '#f3f4f6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchInputStyle: {
        fontSize: 15,
    },
    headerContainerStyle: {
        marginTop: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdrop: {
        backgroundColor: 'gray',
        opacity: 0.7,
    },
}

const mapStateToProps = (state) => {
    const {
        hasNextPage,
        loading,
        pageSize,
        selectedItems,
        searchResults,
        searchQuery,
        shareMessage,
        submitting,
    } = state.shareToChat

    return {
        hasNextPage,
        loading,
        pageSize,
        selectedItems,
        searchResults,
        searchQuery,
        shareMessage,
        submitting,
    }
}

export default connect(mapStateToProps, {
    shareToChatReset,
    shareToChatChangeSearchQuery,
    shareToChatChangeShareMessage,
    shareToChatChangeSelectedItems,
    shareToChatSearch,
    shareToSelectedChats,
    shareToChatClearSearch,
})(ShareToChatModal)
