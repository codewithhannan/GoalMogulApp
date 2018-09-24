import React, { Component } from 'react';
import {
  View,
  FlatList,
} from 'react-native';
import { connect } from 'react-redux';

// Components
import GoalFilterBar from '../Common/GoalFilterBar';
import ProfileGoalCard from '../Goal/GoalCard/ProfileGoalCard';

// actions
import {
  handleTabRefresh,
  handleProfileTabOnLoadMore
} from '../../actions';

// tab key
const key = 'goals';

class MyGoals extends Component {
  _keyExtractor = (item) => item.id

  handleRefresh = () => {
    console.log('Refreshing tab: ', key);
    this.props.handleTabRefresh(key);
  }

  renderItem = ({ item }) => {
    // TODO: render item
    return <ProfileGoalCard item={item} />;
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <GoalFilterBar selectedTab={this.props.selectedTab} />
        <View style={{ flex: 1 }}>
          <FlatList
            data={testData}
            renderItem={this.renderItem}
            keyExtractor={this._keyExtractor}
            onRefresh={this.handleRefresh.bind()}
            refreshing={this.props.refreshing || this.props.loading}
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
    color: '#45C9F6',
    fontSize: 11
  }
};

const mapStateToProps = state => {
  const { selectedTab, goals } = state.profile;
  const { data, loading } = goals;

  return {
    selectedTab,
    data,
    loading
  };
};

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
    handleProfileTabOnLoadMore
  }
)(MyGoals);
