import React from 'react';
import {
  View,
  FlatList
} from 'react-native';
import { connect } from 'react-redux';

// Components
import ChatRoomCard from './ChatRoomCard';

// Actions
import {
  refreshChatTab,
  loadMoreChatTab
} from '../../../redux/modules/chat/ChatTabActions';

const tab = 'chatrooms';

class ChatRoomTab extends React.Component {
  _keyExtractor = (item) => item._id;

  handleOnRefresh = () => this.props.refreshChatTab(tab);

  handleOnLoadMore = () => this.props.loadMoreChatTab(tab);

  renderItem = ({ item }) => {
    return <ChatRoomCard item={item} />;
  }

  renderListHeader() {
    return null;
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={[...testData, ...this.props.data]}
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

const testData = [
  {
    _id: '0'
  },
  {
    _id: '1'
  }
];

export default connect(
  mapStateToProps,
  {
    refreshChatTab,
    loadMoreChatTab
  }
)(ChatRoomTab);
