/**
 * This is a search overlay for user.
 * Currently, it's used in Invite friends for Tribe and Events
 */
import React, { Component } from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  TextInput,
  Alert
} from 'react-native';
import { connect } from 'react-redux';
import { SearchBar } from 'react-native-elements';
import { MenuProvider } from 'react-native-popup-menu';
import { Constants } from 'expo';
import _ from 'lodash';

// Component
import BaseOverlay from './BaseOverlay';

// Constants
import {
  IPHONE_MODELS
} from '../../Utils/Constants';
import { SearchIcon } from '../../Utils/Icons';
import { FlatList } from 'react-native-gesture-handler';
import SearchUserCard from '../../Search/People/SearchUserCard';
import { shareToChatReset, shareToChatChangeSearchQuery, shareToChatChangeShareMessage, shareToChatChangeSelectedItems, shareToChatSearch, shareToSelectedChats, shareToChatClearSearch } from '../../../redux/modules/chat/ShareToChatActions';

const DEBUG_KEY = '[ ShareToChatModal ]';
const AUTO_SEARCH_DELAY_MS = 500;

class ShareToChatModal extends Component {
    _keyExtractor = (item) => item._id;

    handleChangeSearchText = (searchText) => {
        this.props.shareToChatChangeSearchQuery(searchText);

        clearTimeout(this.searchTimeout);
        if (searchText == '') {
            return this.props.shareToChatClearSearch()
        };
        this.searchTimeout = setTimeout(() => this.props.shareToChatSearch(
            this.props.searchQuery,
            this.props.searchResults,
            5,
            this.props.chatRoomType
        ), AUTO_SEARCH_DELAY_MS);
    }
    handleLoadMore = () => {
        if (!this.props.hasNextPage || this.props.loading) return;
        this.props.shareToChatSearch(
            this.props.searchQuery,
            this.props.searchResults,
            5,
            this.props.chatRoomType
        );
    }
	onSearchResultSelect = (itemId, itemDoc) => {
		let newSelectedItems = _.map(this.props.selectedItems, _.clone);
		if (itemDoc.isSearchResult) {
			let newItemDoc = _.cloneDeep(itemDoc);
			newItemDoc = _.set(newItemDoc, 'isSearchResult', false);
			newSelectedItems.push(newItemDoc);
			this.search.clear();
			this.search.focus();
		} else {
			const indexToRemove = newSelectedItems.findIndex(itemDoc => itemDoc._id == itemId);
			if (indexToRemove > -1) {
				newSelectedItems.splice(indexToRemove, 1);
			} else {
				return;
			};
		};
		this.props.shareToChatChangeSelectedItems(newSelectedItems);
	}

    handleChangeMessage = (newMessage) => {
        this.props.shareToChatChangeShareMessage(newMessage);
    }

    handleSubmit = () => {
        if (this.props.submitting) return;

        const { userToShare, selectedItems, shareMessage, chatRoomType } = this.props;
        if (!selectedItems.length) {
            Alert.alert('Select a conversation to continue');
        };
        this.props.shareToSelectedChats(selectedItems, shareMessage, userToShare, chatRoomType);
    }
    handleClose = () => {
        this.props.shareToChatReset();
        Actions.pop();
    }

	renderListItem = (item) => {
        if (this.props.chatRoomType == 'Direct') {
            return (
                <SearchUserCard
                    item={item.item}
                    onSelect={this.onSearchResultSelect}
                    cardIconSource={item.item.isSearchResult ? plus : times}
                    cardContainerStyles={item.item.isSearchResult ? {} : {backgroundColor: '#D8EDFF'}}
                />
            );
        } else {
            // TODO: Chat room result
            return (
                null
            );
        };
	}
	renderListFooter = () => {
		if (!this.props.loading) return null;
		return (
			<View
				style={{
					paddingVertical: 20,
					borderTopWidth: 1,
					borderColor: "#CED0CE"
				}}
			>
				<ActivityIndicator animating size="small" />
			</View>
		);
	}
	renderListEmptyState = () => {
        if (this.props.loading) return null;

        const searchPlaceHolder = this.props.chatRoomType == 'Direct'
        ? 'Search friends...'
        : 'Search group conversations...';
        return (
            <View
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: 100,
                }}
            >
                <Text
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: 18,
                        color: '#999',
                    }}
                >
                    {this.props.searchQuery.trim().length ? '' : searchPlaceHolder}
                </Text>
            </View>
        );
	}
    render() {
        const searchPlaceHolder = this.props.chatRoomType == 'Direct'
        ? 'Search friends'
        : 'Search group conversations';
        const modalTitle = this.props.chatRoomType == 'Direct'
        ? 'to direct conversations'
        : 'to group conversations';

        return (
			<MenuProvider customStyles={{ backdrop: styles.backdrop }}>
				<KeyboardAvoidingView
					behavior='padding'
					style={{ ...styles.homeContainerStyle, flex: 1, backgroundColor: '#ffffff' }}
				>
					<ModalHeader
						title={`Share profile ${modalTitle}`}
						actionText={'Share'}
						onCancel={this.handleClose}
						onAction={this.handleSubmit}
					/>
					<ScrollView
						style={{ borderTopColor: '#e9e9e9', borderTopWidth: 1 }}
					>
                        <View>
                            <Text>Share {this.props.userToShare.name}'s profile {modalTitle}</Text>
                            <TextInput
                                multiline={true}
                                placeholder={'Enter a message...'}
                                value={this.props.shareMessage}
                                onChangeText={this.props.handleChangeMessage}
                            />
                        </View>
                        <SearchBar
                            ref={search => this.search = search}
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
                                fontSize: 15
                            }}
                            placeholder={searchPlaceHolder}
                            onChangeText={this.handleChangeSearchText}
                            searchIcon={<SearchIcon 
                                iconContainerStyle={{ marginBottom: 3, marginTop: 1 }} 
                                iconStyle={{ tintColor: '#777', height: 15, width: 15 }}
                            />}
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
                            data={this.props.searchResults.map(doc => {
                                doc.isSearchResult = true;
                                return doc;
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
        );
    }
};

const styles = {
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
    alignItems: 'center'
  },
  backdrop: {
    backgroundColor: 'gray',
    opacity: 0.7,
  }
};

const mapStateToProps = (state) => {
    const {
        hasNextPage, loading, pageSize,
        selectedItems, searchResults, searchQuery,
        shareMessage, submitting,
    } = state.shareToChat;

    return {
        hasNextPage,
        loading,
        pageSize,
        selectedItems,
        searchResults,
        searchQuery,
        shareMessage,
        submitting,
    };
};


export default connect(
  mapStateToProps,
  {
    shareToChatReset,
    shareToChatChangeSearchQuery,
    shareToChatChangeShareMessage,
    shareToChatChangeSelectedItems,
    shareToChatSearch,
    shareToSelectedChats,
    shareToChatClearSearch,
  }
)(ShareToChatModal);