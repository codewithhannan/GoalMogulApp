import React, { Component } from 'react';
import {
  View,
  FlatList,
} from 'react-native';
import { connect } from 'react-redux';

// Components
import GoalFilterBar from '../Common/GoalFilterBar';
import ProfileNeedCard from '../Goal/NeedCard/ProfileNeedCard';

// actions
import {
  handleTabRefresh,
  handleProfileTabOnLoadMore
} from '../../actions';

// tab key
const key = 'needs';

class MyNeeds extends Component {

  _keyExtractor = (item) => item.id

  handleRefresh = () => {
    console.log('Refreshing tab: ', key);
    this.props.handleTabRefresh(key);
  }

  renderItem = ({ item }) => {
    // TODO: render item
    return <ProfileNeedCard item={item} />;
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
            refreshing={this.props.loading}
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
  const { selectedTab, needs } = state.profile;
  const { data, loading } = needs;

  return {
    selectedTab,
    data,
    loading
  };
};

export default connect(
  mapStateToProps,
  {
    handleTabRefresh,
    handleProfileTabOnLoadMore
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
