// This is a tab for General search
import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { connect } from 'react-redux';

// Components
import EventSearchCard from './EventSearchCard';
import EmptyResult from '../../Common/Text/EmptyResult';

// actions
import {
  refreshSearchResult,
  onLoadMore
} from '../../../redux/modules/search/SearchActions';

// tab key
const key = 'events';
const DEBUG_KEY = '[ Component EventSearch ]';


class EventSearch extends Component {
  _keyExtractor = (item) => item._id;

  handleRefresh = () => {
    console.log(`${DEBUG_KEY} Refreshing search: `, key);
    let keyToUse = key;
    if (this.props.type !== 'GeneralSearch') {
      keyToUse = 'myEvents';
    }
    // Only refresh if there is content
    if (this.props.searchContent && this.props.searchContent.trim() !== '') {
      this.props.refreshSearchResult(keyToUse);
    }
  }

  handleOnLoadMore = () => {
    console.log(`${DEBUG_KEY} Loading more for search: `, key);
    let keyToUse = key;
    if (this.props.type !== 'GeneralSearch') {
      keyToUse = 'myEvents';
    }
    this.props.onLoadMore(keyToUse);
  }

  renderItem = ({ item }) => {
    return <EventSearchCard item={item} type={this.props.type} callback={this.props.callback} />;
  };

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
  const { events, searchContent } = state.search;
  const { data, refreshing, loading } = events;

  return {
    events,
    data,
    refreshing,
    loading,
    searchContent
  };
};

export default connect(
  mapStateToProps,
  {
    refreshSearchResult,
    onLoadMore
  }
)(EventSearch);
