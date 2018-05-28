import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { connect } from 'react-redux';

// Components
import FriendsFilterBar from './Friends/FriendsFilterBar';

// actions
import {
  handleRefresh,
  meetOnLoadMore
} from '../../actions';

// tab key
const key = 'friends';
const DEBUG_KEY = '[ Component Friends ]';

/* TODO: delete the test data */
const testData = [
  {
    name: 'Jia Zeng',
    _id: 1
  }
];

class Friends extends Component {
  _keyExtractor = (item) => item.id

  handleRefresh = () => {
    console.log(`${DEBUG_KEY} Refreshing tab: `, key);
    this.props.handleRefresh(key);
  }

  handleOnLoadMore = () => {
    console.log(`${DEBUG_KEY} Loading more for tab: `, key);
    this.props.meetOnLoadMore(key);
  }

  renderItem = item => {
    // TODO: render item
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <FriendsFilterBar />
        <View style={{ flex: 1 }}>
          <FlatList
            data={this.props.data}
            renderItem={this.renderItem}
            keyExtractor={this._keyExtractor}
            onRefresh={this.handleRefresh.bind()}
            refreshing={this.props.refreshing}
            onEndReached={this.handleOnLoadMore}
            onEndReachedThreshold={0.5}
          />
        </View>
        {/*
          onEndReached={this.onLoadMore}
        */}
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { friends } = state.meet;
  const { data, refreshing } = friends;

  return {
    friends,
    data,
    refreshing
  };
};

export default connect(
  mapStateToProps,
  {
    handleRefresh,
    meetOnLoadMore
  }
)(Friends);
