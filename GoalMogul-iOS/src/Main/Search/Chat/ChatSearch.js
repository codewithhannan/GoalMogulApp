// This is a tab for General search
import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

// Components
import EmptyResult from '../../Common/Text/EmptyResult';
import ChatRoomCard from '../../Chat/ChatRoomList/ChatRoomCard';

// actions
import {
  refreshSearchResult,
  onLoadMore
} from '../../../redux/modules/search/SearchActions';
import { componentKeyByTab } from '../../../redux/middleware/utils';

// tab key
const key = 'chatRooms';
const DEBUG_KEY = '[ UI ChatSearch ]';

class ChatSearch extends Component {
  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
  }

  _keyExtractor = (item) => item._id;

  handleRefresh = () => {
    console.log(`${DEBUG_KEY} Refreshing search: `, key);
    // Only refresh if there is content
    if (this.props.searchContent && this.props.searchContent.trim() !== '') {
      this.props.refreshSearchResult(key);
    }
  }

  handleItemSelect = (item) => {
    const { userId, tab } = this.props;
    if (!item) {
        console.warn(`${DEBUG_KEY}: [ handleItemSelect ]: Invalid item: `, item);
    }

    if (item.roomType === 'Direct') {
        Actions.push('chatRoomConversation', { chatRoomId: item._id, });
        return;
    }

    const isMember = item.members && 
      item.members.find(memberDoc => 
        memberDoc.memberRef._id == userId && (memberDoc.status == 'Admin' || memberDoc.status == 'Member'));
    if (isMember) {
        Actions.push('chatRoomConversation', { chatRoomId: item._id, });
        return;
    }

    // User is a non-member. Open ChatRoomPublicView
    const componentKey = componentKeyByTab(tab, 'chatRoomPublicView');
    Actions.push(`${componentKey}`, { chatRoomId: item._id, path: 'search.chatRooms.data' });
  }

  handleOnLoadMore = () => {
    console.log(`${DEBUG_KEY} Loading more for search: `, key);
    this.props.onLoadMore(key);
  }

  renderItem = ({ item }) => {
    // TODO: add ChatSearchCard here
    return (
      <ChatRoomCard item={item} onItemSelect={this.handleItemSelect} renderDescription />
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {
          (this.props.data.length === 0 && this.props.searchContent && !this.props.loading) ?
            <EmptyResult text={'No Results'} />
           :
            <FlatList
              data={this.props.data}
              renderItem={this.renderItem}
              keyExtractor={this._keyExtractor}
              onEndReached={this.handleOnLoadMore}
              onEndReachedThreshold={0.5}
              onRefresh={this.handleRefresh}
              refreshing={this.props.loading}
            />
        }
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { chatRooms, searchContent } = state.search;
  const { tab } = state.navigation;
  const { data, refreshing, loading } = chatRooms;

  return {
    chatRooms,
    data,
    refreshing,
    loading,
    searchContent,
    tab
  };
};

export default connect(
  mapStateToProps,
  {
    refreshSearchResult,
    onLoadMore
  }
)(ChatSearch);
