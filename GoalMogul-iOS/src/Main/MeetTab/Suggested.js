import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { connect } from 'react-redux';

// Components
import MeetFilterBar from './MeetFilterBar';
import MeetCard from './MeetCard';

// actions
import {
  handleRefresh,
  meetOnLoadMore
} from '../../actions';

// tab key
const key = 'suggested';
const DEBUG_KEY = '[ Component Suggested ]';

/* TODO: delete the test data */
const testDataSuggested = [
  {
    id: 1,
    name: 'Jia Zeng',
    profile: {
      occupation: 'student'
    }
  },
  {
    id: 1,
    name: 'Jay Patel',
    profile: {

    }
  }
];

class Suggested extends Component {

  _keyExtractor = (item, index) => index

  handleRefresh = () => {
    console.log(`${DEBUG_KEY} Refreshing tab: `, key);
    this.props.handleRefresh(key);
  }

  handleOnLoadMore = () => {
    console.log(`${DEBUG_KEY} Loading more for tab: `, key);
    this.props.meetOnLoadMore(key);
  }

  renderItem = ({ item }) => {
    return <MeetCard item={item} />;
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={testDataSuggested}
          renderItem={this.renderItem}
          keyExtractor={this._keyExtractor}
          onRefresh={this.handleRefresh.bind()}
          refreshing={this.props.loading}
          onEndReached={this.handleOnLoadMore}
          onEndReachedThreshold={0.5}
        />
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
    meetOnLoadMore
  }
)(Suggested);
