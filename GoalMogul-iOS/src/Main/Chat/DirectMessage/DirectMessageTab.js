import React from 'react';
import {
	View,
	FlatList
} from 'react-native';
import { connect } from 'react-redux';

// Components
import DirectMessageCard from './DirectMessageCard';

// Actions
import {
	refreshChatTab,
	loadMoreChatTab
} from '../../../redux/modules/chat/ChatTabActions';

const tab = 'directmessages';

class ChatRoomTab extends React.Component {
	_keyExtractor = (item) => item._id;

	handleOnRefresh = () => this.props.refreshChatTab(tab);

	handleOnLoadMore = () => this.props.loadMoreChatTab(tab);

	renderItem = ({ item }) => {
		return <DirectMessageCard chatRoom={item} />;
	}

	renderListHeader() {
		return null;
	}

	render() {
		return (
			<View style={{ flex: 1 }}>
				<FlatList
					data={[...this.props.data]}
					renderItem={this.renderItem}
					numColumns={1}
					keyExtractor={this._keyExtractor}
					refreshing={this.props.loading}
					onRefresh={this.handleOnRefresh}
					onEndReached={this.handleOnLoadMore}
					ListHeaderComponent={this.renderListHeader()}
					onEndThreshold={0}
				/>
			</View>
		);
	}
}

const mapStateToProps = state => {
	const { loading, data } = state.chat.chatrooms;

	return {
		loading,
		data
	};
};

export default connect(
	mapStateToProps,
	{
		refreshChatTab,
		loadMoreChatTab
	}
)(ChatRoomTab);
