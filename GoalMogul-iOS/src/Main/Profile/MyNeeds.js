import React, { Component } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';

// Components
import GoalFilterBar from '../Common/GoalFilterBar';
import ProfileNeedCard from '../Goal/NeedCard/ProfileNeedCard';

// actions
import {
  handleTabRefresh,
  handleProfileTabOnLoadMore,
  changeFilter
} from '../../actions';

// tab key
const key = 'needs';

class MyNeeds extends Component {

  _keyExtractor = (item) => item._id

  handleRefresh = () => {
    console.log('Refreshing tab: ', key);
    this.props.handleTabRefresh(key);
  }

  handleOnLoadMore = () => {
    this.props.handleProfileTabOnLoadMore(key);
  }

  /**
   * @param type: ['sortBy', 'orderBy', 'categories', 'priorities']
   */
  handleOnMenuChange = (type, value) => {
    this.props.changeFilter(key, type, value);
  }

  renderListFooter() {
    const { loading, data } = this.props;
    // console.log(`${DEBUG_KEY}: loading is: ${loadingMore}, data length is: ${data.length}`);
    if (loading && data.length >= 20) {
      return (
        <View
          style={{
            paddingVertical: 0
          }}
        >
          <ActivityIndicator size='large' />
        </View>
      );
    }
  }

  renderItem = ({ item }) => {
    // TODO: render item
    return <ProfileNeedCard item={item} />;
  }

  render() {
    const { refreshing, data } = this.props;
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
            onRefresh={this.handleRefresh.bind()}
            onEndReached={this.handleOnLoadMore}
            onEndReachedThreshold={0}
            refreshing={refreshing}
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
  const { selectedTab, needs } = state.profile;
  const { data, loading, filter, refreshing } = needs;

  return {
    selectedTab,
    data,
    loading,
    filter,
    refreshing
  };
};

export default connect(
  mapStateToProps,
  {
    handleTabRefresh,
    handleProfileTabOnLoadMore,
    changeFilter
  }
)(MyNeeds);

// TODO: delete
const testData = [{
  __v: 0,
  _id: '5b502211e500e3001afd1e20',
  category: 'General',
  created: '2018-07-19T05:30:57.531Z',
  details: {
    tags: [],
    text: 'This is detail'
  },
  feedInfo: {
    _id: '5b502211e500e3001afd1e18',
    publishDate: '2018-07-19T05:30:57.531Z',
  },
  lastUpdated: '2018-07-19T05:30:57.531Z',
  needs: [{
    created: '2018-07-19T05:30:57.531Z',
    description: 'introduction to someone from the Bill and Melinda Gates Foundation',
    isCompleted: false,
    order: 0,
  },
  {
    created: '2018-07-19T05:30:57.531Z',
    description: 'Get in contact with Nuclear experts',
    isCompleted: false,
    order: 1,
  },
  {
    created: '2018-07-19T05:30:57.531Z',
    description: 'Legal & Safety experts who have worked with the United States',
    isCompleted: false,
    order: 2,
  }],
  owner: {
    _id: '5b17781ebec96d001a409960',
    name: 'jia zeng',
    profile: {
      elevatorPitch: 'This is my elevatorPitch',
      occupation: 'Software Engineer',
      pointsEarned: 10,
      views: 0,
    },
  },
  priority: 3,
  privacy: 'friends',
  steps: [],
  title: 'Establish a LMFBR near Westport, Connecticut by 2020',
}];
