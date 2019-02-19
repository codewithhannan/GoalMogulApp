import React from 'react';
import { Constants } from 'expo';
import { Actions } from 'react-native-router-flux';
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

// Components
import ChatRoomCard from './ChatRoomCard';

// Actions
import {
	refreshChatRooms,
	loadMoreChatRooms,
	loadChatRooms,
} from '../../../redux/modules/chat/ChatActions';

import { IPHONE_MODELS } from '../../../Utils/Constants';


const CHATROOM_AUTO_SEARCH_DELAY_MS = 500;

const SEARCHBAR_HEIGHT = Platform.OS === 'ios' &&
      IPHONE_MODELS.includes(Constants.platform.ios.model.toLowerCase())
      ? 30 : 40;

const SCREEN_HEIGHT = Dimensions.get('window').height;
const BODY_HEIGHT = SCREEN_HEIGHT - 48.5 - SEARCHBAR_HEIGHT;


class ChatRoomTab extends React.Component {
	_keyExtractor = (item) => item._id;

	componentDidMount() {
		this.props.loadChatRooms(Actions.currentScene, this.props.limit);
	}

	handleOnRefresh = () => this.props.refreshChatRooms(Actions.currentScene, this.props.limit, this.props.searchQuery);

	handleOnLoadMore = () => {
		if (!this.props.hasNextPage) return;
		this.props.loadMoreChatRooms(Actions.currentScene, this.props.limit, this.props.skip, this.props.searchQuery);
	}

	renderItem = ({ item }) => {
		return (
			<ChatRoomCard item={item} />
		);
	}

	handleSearchUpdate() {
		if (this.chatroomSearchTimer) {
			clearInterval(this.chatroomSearchTimer);
		};
		this.chatroomSearchTimer = setInterval(this.handleOnRefresh.bind(this), CHATROOM_AUTO_SEARCH_DELAY_MS);
	}

	renderListHeader() {
		const { searchQuery } = this.props;
		return (
			<SearchBar
				placeholder={`Search ${Actions.currentScene == 'chatrooms' ? 'Chat Rooms' : 'Direct Messages'}`}
				onChangeText={this.handleSearchUpdate.bind(this)}
				value={searchQuery}
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
							fontSize: 21
						}}
					>
						Create a Chat Room to get started.
					</Text>
				</View>
			);
		};
		return '';
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
					ListHeaderComponent={this.renderListHeader.bind(this)}
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
	};
};

export default connect(
	mapStateToProps,
	{
		refreshChatRooms,
		loadMoreChatRooms,
		loadChatRooms,
	}
)(ChatRoomTab);
