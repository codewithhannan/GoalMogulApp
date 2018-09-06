import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { connect } from 'react-redux';

// Components
import GoalFilterBar from '../Common/GoalFilterBar';
import GoalCard from '../Goal/GoalCard/GoalCard';
import NeedCard from '../Goal/NeedCard/NeedCard';

// actions
import {
  loadMoreFeed,
  refreshFeed
} from '../../redux/modules/home/feed/actions';

class ActivityFeed extends Component {
  handleOnLoadMore = () => this.props.loadMoreFeed();

  handleOnRefresh = () => this.props.refreshFeed();

  _keyExtractor = (item) => item._id

  renderItem = ({ item }) => {
    // TODO: render item
    if (item.type === 'need') {
      return <NeedCard item={item} />;
    } else if (item.type === 'goal') {
      return <GoalCard item={item} />;
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
