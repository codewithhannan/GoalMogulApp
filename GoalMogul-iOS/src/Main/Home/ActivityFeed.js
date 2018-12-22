import React, { Component } from 'react';
import {
  View,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

// Components
import ActivityCard from '../Activity/ActivityCard';
import EmptyResult from '../Common/Text/EmptyResult';

// Assets
import plus from '../../asset/utils/plus.png';

// actions
import {
  loadMoreFeed,
  refreshFeed
} from '../../redux/modules/home/feed/actions';

import {
  openPostDetail
} from '../../redux/modules/feed/post/PostActions';

import { APP_DEEP_BLUE } from '../../styles';

const TAB_KEY = 'activityfeed';
const DEBUG_KEY = '[ UI ActivityFeed ]';

class ActivityFeed extends Component {
  handleOnLoadMore = () => this.props.loadMoreFeed();

  handleOnRefresh = () => this.props.refreshFeed();

  /**
   * @param type: ['sortBy', 'orderBy', 'categories', 'priorities']
   */
  handleOnMenuChange = (type, value) => {
    this.props.changeFilter(TAB_KEY, type, value);
  }


  _keyExtractor = (item) => item._id

  renderItem = ({ item }) => {
    // TODO: render item
    return (
      <ActivityCard
        item={item}
        onPress={(curItem) => {
          this.props.openPostDetail(curItem);
        }}
      />
    );
  }

  renderListFooter() {
    const { loadingMore, data } = this.props;
    // console.log(`${DEBUG_KEY}: loading is: ${loadingMore}, data length is: ${data.length}`);
    if (loadingMore && data.length > 4) {
      return (
        <View
          style={{
            paddingVertical: 20
          }}
        >
          <ActivityIndicator size='large' />
        </View>
      );
    }
  }

  /**
   * NOTE: currently Activity Feed has no filter
   */
  renderListHeader() {
    // return (
    //   <GoalFilterBar
    //     filter={this.props.filter}
    //     onMenuChange={this.handleOnMenuChange}
    //   />
    // );
    return '';
  }

  renderPlus() {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.iconContainerStyle}
        onPress={() => Actions.createPostModal()}
      >
        <Image style={styles.iconStyle} source={plus} />
      </TouchableOpacity>
    );
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
          ListHeaderComponent={this.renderListHeader()}
          ListEmptyComponent={
            this.props.loading ? '' :
            <EmptyResult text={'No Activity'} />
          }
          ListFooterComponent={this.renderListFooter()}
          onEndThreshold={0}
        />
        {this.renderPlus()}
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { loading, loadingMore, filter, data } = state.home.activityfeed;

  // const data = testData;

  return {
    data,
    loading,
    filter,
    loadingMore // For footer indicator
  };
};

const styles = {
  iconContainerStyle: {
    position: 'absolute',
    bottom: 20,
    right: 15,
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
    // backgroundColor: '#17B3EC',
    backgroundColor: APP_DEEP_BLUE,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },
  iconStyle: {
    height: 26,
    width: 26,
    tintColor: 'white',
  },
};

export default connect(
  mapStateToProps,
  {
    loadMoreFeed,
    refreshFeed,
    openPostDetail
  }
)(ActivityFeed);

const testData = [
  // Test creating a post
  {
    // Test creating a post
    _id: '5b5677e2e2f7cecasdddb56069',
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
    },
    __v: 0

  },
  // Test creating a comment
  {
    _id: '0179283701928470192',
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
    actedWith: 'Comment',
    actedUponEntityOwnerId: '5b172a82e64f7e001a2ade23',
    actedUponEntityType: 'Post',
    actedUponEntityId: '5b5677e2e2f7ceccddb56068',
    postRef: {
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
    __v: 0
  },

  // Test creating a post
  {
    _id: '5b5677e2e2f7cecc1231256069',
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
    _id: '5b5677e2e2f7ceccddb56123',
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
  },
  {
    _id: '01792837010alkjsh192',
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
    actedWith: 'Goal',
    actedUponEntityOwnerId: '5b172a82e64f7e001a2ade23',
    actedUponEntityType: 'Goal',
    actedUponEntityId: '5b5677e2e2f7ceccddb56068',
    goalRef: {
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
    },
    __v: 0
  },
];
