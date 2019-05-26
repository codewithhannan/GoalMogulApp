import React from 'react';
import { Constants } from 'expo';
import {
	View,
	FlatList,
	ActivityIndicator,
	Dimensions,
	Platform,
	Text
} from 'react-native';
import { connect } from 'react-redux';
import { SearchBar } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';

// Components
import ChatRoomCard from './ChatRoomCard';

import MessageStorageService from '../../../services/chat/MessageStorageService';

// Actions
import {
	refreshChatRooms,
	loadMoreChatRooms,
	searchQueryUpdated,
	createOrGetDirectMessage,
	updateCurrentChatRoomsList,
} from '../../../redux/modules/chat/ChatActions';

import {
	SearchIcon
  } from '../../../Utils/Icons';

import { IPHONE_MODELS } from '../../../Utils/Constants';
import { Actions } from 'react-native-router-flux';

const CHATROOM_AUTO_SEARCH_DELAY_MS = 500;
const CHATROOM_LIST_REFRESH_INTERVAL = 3000; // ms

const SEARCHBAR_HEIGHT = Platform.OS === 'ios' &&
      IPHONE_MODELS.includes(Constants.platform.ios.model.toLowerCase())
      ? 30 : 40;

const SCREEN_HEIGHT = Dimensions.get('window').height;
const BODY_HEIGHT = SCREEN_HEIGHT - 48.5 - SEARCHBAR_HEIGHT - 150;
const DEBUG_KEY = '[ UI ChatRoomTab ]';

class ChatRoomTab extends React.Component {

	_keyExtractor = (item) => item._id;

	componentDidMount() {
		this.props.refreshChatRooms(this.props.currentTabKey, this.props.limit, '');

		// try to update the chat room list every time a new message comes in our application
		const listenerKey = `ChatRoomTab:${this.props.currentTabKey}`;
		const listener = (incomingMessageInfo) => this.props.updateCurrentChatRoomsList(
			this.props.currentTabKey,
			this.props.data,
			this.props.limit,
			this.props.searchQuery
		);
		MessageStorageService.onIncomingMessageStored(listenerKey, listener);
		MessageStorageService.onPulledMessageStored(listenerKey, listener);
		this._refreshOnInterval();
	}
	_refreshOnInterval() {
		this.refreshInterval = setInterval(() => !this.props.searchQuery.trim().length && this.props.updateCurrentChatRoomsList(
			this.props.currentTabKey,
			this.props.data,
			this.props.limit,
			this.props.searchQuery
		), CHATROOM_LIST_REFRESH_INTERVAL);
	}

	componentWillUnmount() {
		const listenerKey = `ChatRoomTab:${this.props.currentTabKey}`;
		MessageStorageService.offIncomingMessageStored(listenerKey);
		MessageStorageService.offPulledMessageStored(listenerKey);
		clearInterval(this.refreshInterval);
	}

	handleOnRefresh = (maybeQuery) => {
		const query = typeof maybeQuery == "string" ? maybeQuery : this.props.searchQuery;
		this.props.refreshChatRooms(this.props.currentTabKey, this.props.limit, query);
	}

	handleOnLoadMore = () => {
		if (!this.props.hasNextPage) return;
		this.props.loadMoreChatRooms(this.props.currentTabKey, this.props.limit, this.props.skip, this.props.searchQuery);
	}

	handleItemSelect = (item) => {
		if (item.isFriend) {
			this.props.createOrGetDirectMessage(item._id);
			this.search.clear();
		} else {
			Actions.push('chatRoomConversation', { chatRoomId: item._id });
		};
	}

	renderItem = ({ item }) => {
		return (
			<ChatRoomCard item={item} onItemSelect={this.handleItemSelect} />
		);
	}

	handleSearchUpdate = (newText='') => {
		if (this.chatroomSearchTimer) {
			clearInterval(this.chatroomSearchTimer);
		};
		this.props.searchQueryUpdated(this.props.currentTabKey, newText);
		if (newText.trim().length) {
			this.chatroomSearchTimer = setTimeout(this.handleOnRefresh.bind(this), CHATROOM_AUTO_SEARCH_DELAY_MS);
		} else {
			this.handleOnRefresh('');
		}
	}

	renderListHeader = () => {
		const { searchQuery } = this.props;
		return (
			<SearchBar
				ref={search => this.search = search}
				platform="default"
				clearIcon={null/*<MaterialIcons
					name="clear"
					color="#777"
					size={21}
				/>*/}
				containerStyle={{
					backgroundColor: '#EEE',
					padding: 6,
					borderColor: 'transparent',
				}}
				inputContainerStyle={{
					backgroundColor: '#FAFAFA',
				}}
				inputStyle={{
					fontSize: 15
				}}
				placeholder={`Search...`}
				onChangeText={this.handleSearchUpdate.bind(this)}
				onClear={this.handleSearchUpdate}
				searchIcon={<SearchIcon 
					iconContainerStyle={{ marginBottom: 3, marginTop: 1 }} 
					iconStyle={{ tintColor: '#777', height: 15, width: 15 }}
				  />}
				value={searchQuery}
				lightTheme={true}
			/>
		);
	}

	renderListFooter() {
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

	renderListEmptyState() {
		if (!this.props.loading && !this.props.refreshing) {
			return (
				<View
					style={{
						justifyContent: "center",
						alignItems: "center",
						height: BODY_HEIGHT,
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
						Tap the + button to start a conversation.
					</Text>
				</View>
			);
		};
		return null;
	}

	render() {
		return (
			<View style={{ flex: 1 }}>
				<FlatList
					data={[...this.props.data]}
					renderItem={this.renderItem.bind(this)}
					numColumns={1}
					keyExtractor={this._keyExtractor}
					refreshing={this.props.refreshing}
					onRefresh={this.handleOnRefresh.bind(this)}
					ListHeaderComponent={this.renderListHeader}
					ListFooterComponent={this.renderListFooter.bind(this)}
					ListEmptyComponent={this.renderListEmptyState.bind(this)}
					onEndThreshold={0}
					onEndReached={this.handleOnLoadMore.bind(this)}
				/>
			</View>
		);
	}
}

const mapStateToProps = (state, props) => {
	const { navigationState } = state.chat;
	// const currentTabKey = navigationState.routes[navigationState.index].key;
	// TODO: make tabKey as a required props
	const currentTabKey = props.tabKey;
	const { loading, refreshing, limit, skip, hasNextPage, data, searchQuery } = state.chat[currentTabKey];

	return {
		loading,
		refreshing,
		limit,
		skip,
		hasNextPage,
		data,
		searchQuery,
		currentTabKey,
	};
};

export default connect(
	mapStateToProps,
	{
		refreshChatRooms,
		loadMoreChatRooms,
		searchQueryUpdated,
		createOrGetDirectMessage,
		updateCurrentChatRoomsList,
	}
)(ChatRoomTab);
