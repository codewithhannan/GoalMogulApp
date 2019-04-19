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
const key = 'tribes';
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
    // Only refresh if there is content
    if (this.props.searchContent && this.props.searchContent.trim() !== '') {
      this.props.refreshSearchResult(key);
    }
  }

  handleOnLoadMore = () => {
    this.props.onLoadMore(key);
  }

  renderItem = ({ item }) => {
    return <TribeSearchCard item={item} type={this.props.type} callback={this.props.callback} />;
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
  const { tribes, searchContent } = state.search;
  const { data, refreshing, loading } = tribes;

  return {
    tribes,
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
