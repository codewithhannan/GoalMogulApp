import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { connect } from 'react-redux';

// Components
import ActivityCard from '../Activity/ActivityCard';

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
    return <ActivityCard item={item} />
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
  const { loading } = state.home.activityfeed;

  const data = testData;

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

const testData = [
  // Test creating a post
  {
    created: new Date(),
    lastUpdated: new Date(),
    owner: {
      name: 'Jia Zeng',
      profile: ''
    },
    privacy: 'Public',
    content: {
      text: '',
      tags: [],
      links: []
    },
    // ["General", "ShareUser", "SharePost", "ShareGoal", "ShareNeed"]
    postType: 'General',
    mediaRef: 'akdf;laskdf',
    userRef: undefined,
    postRef: undefined,
    goalRef: undefined,
    needRef: undefined, // pair with goal ref
    belongsToTribe: undefined,
    belongsToEvent: undefined,
  },
  // Test creating a comment
  {
    created: new Date(),
    lastUpdated: new Date(),
    owner: {
      name: 'Jia Zeng',
      profile: ''
    },
    privacy: 'Public',
    content: {
      text: '',
      tags: [],
      links: []
    },
    // ["General", "ShareUser", "SharePost", "ShareGoal", "ShareNeed"]
    postType: 'General',
    mediaRef: 'akdf;laskdf',
    userRef: undefined,
    postRef: undefined,
    goalRef: undefined,
    needRef: undefined, // pair with goal ref
    belongsToTribe: undefined,
    belongsToEvent: undefined,
  },

  // Test creating a post
  {
    _id: '5b5677e2e2f7ceccddb56069',
    created: '2018-07-24T00:50:42.632Z',
    actor: {
      _id: '5b172a82e64f7e001a2ade23',
      name: 'John Doe',
      headline: 'Your friendly boi',
      profile: {
        views: 0,
        pointsEarned: 0,
        image: 'ProfileImage/5e339201-31bf-4a00-b0e9-1c5cc1d20236'
      }
    },
    action: 'Create',
    actedWith: 'Post',
    actedUponEntityOwnerId: '5b172a82e64f7e001a2ade23',
    actedUponEntityType: 'Post',
    actedUponEntityId: '5b5677e2e2f7ceccddb56068',
    postRef: {
      _id: '5b5677e2e2f7ceccddb56068',
      created: '2018-07-24T00:50:42.534Z',
      lastUpdated: '2018-07-24T00:50:42.534Z',
      owner: {
          _id: '5b17781ebec96d001a409960',
          name: 'jia zeng',
          profile: {
              views: 0,
              pointsEarned: 0,
              elevatorPitch: '',
              occupation: 'test'
          }
      },
      postType: 'General',
      privacy: 'friends',
      __v: 0,
      content: {
        text: 'test 4!',
        links: [],
        tags: []
      }
    },
    __v: 0
  },

  // Test sharing a need
  {
    _id: '5b5677e2e2f7ceccddb56069',
    created: '2018-07-24T00:50:42.632Z',
    actor: {
      _id: '5b172a82e64f7e001a2ade23',
      name: 'John Doe',
      headline: 'Your friendly boi',
      profile: {
        views: 0,
        pointsEarned: 0,
        image: 'ProfileImage/5e339201-31bf-4a00-b0e9-1c5cc1d20236'
      }
    },
    action: 'Create',
    actedWith: 'Post',
    actedUponEntityOwnerId: '5b172a82e64f7e001a2ade23',
    actedUponEntityType: 'Post',
    actedUponEntityId: '5b5677e2e2f7ceccddb56068',
    postRef: {
      _id: '5b5677e2e2f7ceccddb56068',
      created: '2018-07-24T00:50:42.534Z',
      lastUpdated: '2018-07-24T00:50:42.534Z',
      owner: {
          _id: '5b17781ebec96d001a409960',
          name: 'jia zeng',
          profile: {
              views: 0,
              pointsEarned: 0,
              elevatorPitch: '',
              occupation: 'test'
          }
      },
      postType: 'ShareNeed',
      privacy: 'friends',
      __v: 0,
      content: {
        text: 'This is a test need that should be shared by John Doe',
        links: [],
        tags: []
      },
      needRef: {

      }
    },
    __v: 0
  }
];
