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

// Selector
import { 
  makeGetUserNeeds,
  makeGetUserPageInfoByType
} from '../../redux/modules/User/Selector';

// tab key
const key = 'needs';
const DEBUG_KEY = '[ UI Profile Needs ]';

class MyNeeds extends Component {
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
    // Pass down the pageId from Profile component to ProfileNeedCard
    return <ProfileNeedCard item={item} pageId={this.props.pageId} />;
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
            onRefresh={this.handleRefresh}
            onEndReached={this.handleOnLoadMore}
            onEndReachedThreshold={0}
            refreshing={refreshing}
            ListFooterComponent={this.renderListFooter()}
          />
        </View>
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

const makeMapStateToProps = () => {
  const getUserNeeds = makeGetUserNeeds();
  const getPageInfo = makeGetUserPageInfoByType();

  const mapStateToProps = (state, props) => {
    const { userId, pageId } = props;
    const data = getUserNeeds(state, userId, pageId);
    const { 
      loading, refreshing, filter, selectedTab 
    } = getPageInfo(state, userId, pageId, 'needs');

    // console.log(`${DEBUG_KEY}: user needs composed: `, userNeeds.length);
  
    return {
      selectedTab,
      data,
      loading,
      filter,
      refreshing
    };
  };

  return mapStateToProps;
};


export default connect(
  makeMapStateToProps,
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
