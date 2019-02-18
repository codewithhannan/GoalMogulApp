import React, { Component } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';

// Components
import GoalFilterBar from '../Common/GoalFilterBar';
import ProfileGoalCard from '../Goal/GoalCard/ProfileGoalCard2';

// actions
import {
  handleTabRefresh,
  handleProfileTabOnLoadMore,
  changeFilter
} from '../../actions';

// tab key
const key = 'goals';
const DEBUG_KEY = '[ UI Profile Goals ]';

class MyGoals extends Component {
  constructor(props) {
    super(props);
    this.handleOnLoadMore = this.handleOnLoadMore.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
  }
  
  _keyExtractor = (item) => item._id

  handleRefresh = () => {
    const { userId, pageId } = this.props;
    console.log(`${DEBUG_KEY}: refreshing tab`, key);
    this.props.handleTabRefresh(key, userId, pageId);
  }

  handleOnLoadMore = () => {
    const { userId, pageId } = this.props;
    this.props.handleProfileTabOnLoadMore(key, userId, pageId);
  }

  /**
   * @param type: ['sortBy', 'orderBy', 'categories', 'priorities']
   */
  handleOnMenuChange = (type, value) => {
    const { userId, pageId } = this.props;
    this.props.changeFilter(key, type, value, { userId, pageId });
  }

  renderItem = ({ item }) => {
    // Pass down the pageId from the profile component to the ProfileGoalCard
    return <ProfileGoalCard item={item} pageId={this.props.pageId} />;
  }

  renderListFooter() {
    const { loading, data } = this.props;
    // console.log(`${DEBUG_KEY}: loading is: ${loadingMore}, data length is: ${data.length}`);
    if (loading && data.length >= 10) {
      return (
        <View
          style={{
            paddingVertical: 12
          }}
        >
          <ActivityIndicator size='small' />
        </View>
      );
    }
  }

  render() {
    const { data } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <GoalFilterBar
          selectedTab={this.props.selectedTab}
          filter={this.props.filter}
          onMenuChange={this.handleOnMenuChange}
        />
        <View style={{ flex: 1 }}>
          <FlatList
            data={[...data]}
            renderItem={this.renderItem}
            keyExtractor={this._keyExtractor}
            onRefresh={this.handleRefresh}
            onEndReached={this.handleOnLoadMore}
            onEndReachedThreshold={0}
            refreshing={this.props.refreshing}
            ListFooterComponent={this.renderListFooter()}
          />
        </View>
        {/*
          onEndReached={() => this.props.handleProfileTabOnLoadMore(key)}
        */}
      </View>
    );
  }
}

const styles = {
  // Extract label color out
  labelContainerStyle: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    justifyContent: 'center'
  },
  labelTextStyle: {
    fontWeight: '600',
    color: '#969696',
    fontSize: 11
  },
  buttonTextStyle: {
    marginLeft: 5,
    color: '#17B3EC',
    fontSize: 11
  }
};

const mapStateToProps = state => {
  const { selectedTab, goals } = state.profile;
  const { data, loading, refreshing, filter } = goals;

  return {
    selectedTab,
    data,
    loading,
    filter,
    refreshing
  };
};

// Currently disable test data
const testData = [
  {
    _id: '128039187294',
    owner: {
      _id: '12937109823',
      name: 'Jia Zeng'
    },
    title: 'This is a test goal for Jia',
    category: 'General'
  }
];

export default connect(
  mapStateToProps,
  {
    handleTabRefresh,
    handleProfileTabOnLoadMore,
    changeFilter
  }
)(MyGoals);
