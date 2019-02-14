import React from 'react';
import {
	View,
	FlatList,
	ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';

// Components
import ChatRoomCard from './ChatRoomCard';

// Actions
import {
	refreshChatRooms,
	loadMoreChatRooms,
	loadChatRooms,
} from '../../../redux/modules/chat/ChatActions';


class ChatRoomTab extends React.Component {
	_keyExtractor = (item) => item._id;

	componentDidMount() {
		this.props.loadChatRooms(this.props.route.key, this.props.limit);
	}

	handleOnRefresh = () => this.props.refreshChatRooms(this.props.route.key, this.props.limit, this.props.searchQuery);

	handleOnLoadMore = () => {
		if (!this.props.hasNextPage) return;
		this.props.loadMoreChatRooms(this.props.route.key, this.props.limit, this.props.skip, this.props.searchQuery);
	}

	renderItem = ({ item }) => {
		return <ChatRoomCard item={item} />;
	}

	renderListHeader() {
		/* TODO: Add a chatroom filter here */
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

	renderEmptyState() {
		if (!this.props.loading && !this.props.refreshing && !this.props.data.length) {
			/* TODO: Render empty state text */
		};
		return '';
	}

	render() {
		return (
			<View style={{ flex: 1 }}>
				<FlatList
					data={[...this.props.data]}
					renderItem={this.renderItem}
					numColumns={1}
					keyExtractor={this._keyExtractor}
					refreshing={this.props.refreshing}
					onRefresh={this.handleOnRefresh}
					ListHeaderComponent={this.renderListHeader}
					ListFooterComponent={this.renderListFooter}
					onEndThreshold={0}
					onEndReached={this.handleOnLoadMore}
				/>
				{this.renderEmptyState()}
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
