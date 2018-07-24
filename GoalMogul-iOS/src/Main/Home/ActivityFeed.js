import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { connect } from 'react-redux';

// Components
import GoalFilterBar from '../Common/GoalFilterBar';

// actions
import {
  loadMoreFeed,
  refreshFeed
} from '../../redux/modules/home/feed/actions';

class ActivityFeed extends Component {
  handleOnLoadMore = () => this.props.loadMoreGoals();

  handleOnRefresh = () => this.props.refreshGoals();

  _keyExtractor = (item) => item._id

  renderItem = ({ item }) => {
    // TODO: render item
    if (item.type === 'need') {
      return <View item={item} />;
    } else if (item.type === 'goal') {
      return <View item={item} />;
    }
    return <View />;
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={this.props.data}
          renderItem={this.renderItem}
          numColumns={1}
          keyExtractor={this._keyExtractor}
          refreshing={this.props.loading}
          onRefresh={this.handleOnRefresh}
          onEndReached={this.handleOnLoadMore}
          onEndThreshold={0}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { data, loading } = state.home.activityfeed;

  return {
    data,
    loading
  };
};

export default connect(
  mapStateToProps,
  {
    loadMoreFeed,
    refreshFeed
  }
)(ActivityFeed);
