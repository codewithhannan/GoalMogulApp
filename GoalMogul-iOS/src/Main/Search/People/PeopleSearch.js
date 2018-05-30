import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { connect } from 'react-redux';

// Components
import SearchUserCard from './SearchUserCard';

// actions
import {
  handleRefresh,
  meetOnLoadMore,
  refreshSearchResult
} from '../../../actions';

// tab key
const key = 'people';
const DEBUG_KEY = '[ Component PeopleSearch ]';

/* TODO: delete the test data */
const testDataSuggested = [
  {
    _id: 1,
    name: 'Jia Zeng',
    profile: {
      occupation: 'student'
    },
    status: 'Invited'
  },
  {
    _id: 3,
    name: 'Jay Patel',
    profile: {
      occupaton: 'Typist at Typeform.com'
    },
    status: 'Accepted'
  }
];

class PeopleSearch extends Component {
  _keyExtractor = (item) => item._id;

  handleRefresh = () => {
    console.log(`${DEBUG_KEY} Refreshing tab: `, key);
    // this.props.handleRefresh(key);
    // this.props.refreshSearchResult();
  }

  handleOnLoadMore = () => {
    console.log(`${DEBUG_KEY} Loading more for tab: `, key);
    // this.props.meetOnLoadMore(key);
  }

  renderItem = ({ item }) => {
    console.log('rendering item: ', item);
    return <SearchUserCard item={item} />;
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={testDataSuggested}
          renderItem={this.renderItem}
          keyExtractor={this._keyExtractor}
          onEndReached={this.handleOnLoadMore}
          onEndReachedThreshold={0.5}
        />
        {/*onRefresh={this.handleRefresh.bind()}
        refreshing={this.props.loading}*/}
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { suggested } = state.meet;
  const { data, refreshing, loading } = suggested;


  return {
    suggested,
    data,
    refreshing,
    loading
  };
};

export default connect(
  mapStateToProps,
  {
    handleRefresh,
    meetOnLoadMore,
    refreshSearchResult
  }
)(PeopleSearch);
