// This is a tab for General search
import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { connect } from 'react-redux';

// Components
import TribeSearchCard from './TribeSearchCard';
import EmptyResult from '../../Common/Text/EmptyResult';

// actions
import {
  refreshSearchResult,
  onLoadMore
} from '../../../redux/modules/search/SearchActions';

// tab key
const key = 'tribe';
const DEBUG_KEY = '[ Component TribeSearch ]';

/* TODO: delete the test data */
const testDataSuggested = [
  {
    _id: '10827309872',
    name: 'Welcome home Jia',
  },
  {
    _id: '12790872342',
    name: 'Randome Crazy Tribe',
  }
];

class TribeSearch extends Component {
  _keyExtractor = (item) => item._id;

  handleRefresh = () => {
    console.log(`${DEBUG_KEY} Refreshing search`);
    this.props.refreshSearchResult(key);
  }

  handleOnLoadMore = () => {
    console.log(`${DEBUG_KEY} Loading more for search`);
    this.props.onLoadMore(key);
  }

  renderItem = ({ item }) => {
    return <TribeSearchCard item={item} />;
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        {
          (this.props.data.length === 0 && this.props.searchContent && !this.props.loading) ?
            <EmptyResult text={'No Results'} />
          :
            <FlatList
              data={testDataSuggested}
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
  const { tribe, searchContent } = state.search;
  const { data, refreshing, loading } = tribe;

  return {
    tribe,
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
)(TribeSearch);
