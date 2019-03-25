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

// Actions
import {
	refreshChatRooms,
	loadMoreChatRooms,
	searchQueryUpdated
} from '../../../redux/modules/chat/ChatActions';

import {
	SearchIcon
  } from '../../../Utils/Icons';

import { IPHONE_MODELS } from '../../../Utils/Constants';


const CHATROOM_AUTO_SEARCH_DELAY_MS = 500;

const SEARCHBAR_HEIGHT = Platform.OS === 'ios' &&
      IPHONE_MODELS.includes(Constants.platform.ios.model.toLowerCase())
      ? 30 : 40;

const SCREEN_HEIGHT = Dimensions.get('window').height;
const BODY_HEIGHT = SCREEN_HEIGHT - 48.5 - SEARCHBAR_HEIGHT - 150;


class ChatRoomTab extends React.Component {

	_keyExtractor = (item) => item._id;

	componentDidMount() {
		this.props.refreshChatRooms(this.props.currentTabKey, this.props.limit, '');
	}

	handleOnRefresh = () => {
		this.props.refreshChatRooms(this.props.currentTabKey, this.props.limit, this.props.searchQuery);
	}

	handleOnLoadMore = () => {
		if (!this.props.hasNextPage) return;
		this.props.loadMoreChatRooms(this.props.currentTabKey, this.props.limit, this.props.skip, this.props.searchQuery);
	}

	renderItem = ({ item }) => {
		return (
			<ChatRoomCard item={item} />
		);
	}

	handleSearchUpdate(newText) {
		if (this.chatroomSearchTimer) {
			clearInterval(this.chatroomSearchTimer);
		};
		if (newText.trim().length) {
			this.chatroomSearchTimer = setTimeout(this.handleOnRefresh.bind(this), CHATROOM_AUTO_SEARCH_DELAY_MS);
		} else {
			this.handleOnRefresh();
		}
		this.props.searchQueryUpdated(this.props.currentTabKey, newText);
	}

	renderListHeader = () => {
		const { searchQuery } = this.props;
		return (
			<SearchBar
				platform="default"
				clearIcon={<MaterialIcons
					name="clear"
					color="#777"
					size={21}
				/>}
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
				<ActivityIndicator animating size="large" />
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

const mapStateToProps = state => {
	const { navigationState } = state.chat;
	const currentTabKey = navigationState.routes[navigationState.index].key;
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
	}
)(ChatRoomTab);
