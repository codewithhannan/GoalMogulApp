// This component provides search for suggestion for Tribe, Event, User, Friend,
// and Chat room
import React from 'react';
import {
  View,
  FlatList,
  Animated
} from 'react-native';
import { connect } from 'react-redux';
import { SearchBar } from 'react-native-elements';
import _ from 'lodash';

import {
  switchCaseF
} from '../../../../redux/middleware/utils';

// Components
import TribeCard from './TribeCard';
import UserCard from './UserCard';
import EventCard from './EventCard';

// Actions
import {
  handleSearch,
  clearSearchState,
  refreshSearchResult,
  onLoadMore,
} from '../../../../redux/modules/feed/comment/SuggestionSearchActions';

import {
  onSuggestionItemSelect
} from '../../../../redux/modules/feed/comment/CommentActions';

import {
  getNewCommentByTab
} from '../../../../redux/modules/feed/comment/CommentSelector';

class SearchSuggestion extends React.Component {
  state = {
    query: ''
  }

  // Search Query handler
  handleSearchCancel = () => {
    this.handleQueryChange('');
    this.props.clearSearchState();
  };
  handleSearchClear = () => this.handleQueryChange('');

  handleQueryChange = query => {
    // this.setState(state => ({ ...state, query: query || '' }));
    if (query === undefined) {
      return;
    }
    if (query === '') {
      this.props.clearSearchState(this.props.selectedTab);
    }
    this.props.debouncedSearch(query.trim(), this.props.selectedTab);
  }

  renderItem = ({ item }) => {
    const { selectedItem, pageId } = this.props;
    const selected = selectedItem && selectedItem._id === item._id;

    return switchCaseF({
      User: (
        <UserCard
          item={item}
          onCardPress={(val) => this.props.onSuggestionItemSelect(val, pageId)}
          selected={selected}
        />
      ),
      Tribe: (
        <TribeCard
          item={item}
          onCardPress={(val) => this.props.onSuggestionItemSelect(val, pageId)}
          selected={selected}
        />
      ),
      Event: (
        <EventCard
          item={item}
          onCardPress={(val) => this.props.onSuggestionItemSelect(val, pageId)}
          selected={selected}
        />
      ),
      Friend: (
        <UserCard
          item={item}
          onCardPress={(val) => this.props.onSuggestionItemSelect(val, pageId)}
          selected={selected}
        />
      ),
      Default: <View />
    })('Default')(this.props.suggestionType);
  }

  renderSearch() {
    const { suggestionType } = this.props;
    const placeholder = suggestionType === 'ChatConvoRoom'
      ? 'Search Chatroom'
      : `Search ${this.props.suggestionType}`;
    return (
      <SearchBar
        platform='ios'
        round
        autoFocus={false}
        inputStyle={styles.searchInputStyle}
        inputContainerStyle={styles.searchInputContainerStyle}
        containerStyle={styles.searchContainerStyle}
        placeholder={placeholder}
        cancelButtonTitle='Cancel'
        onCancel={this.handleSearchCancel}
        onChangeText={this.handleQueryChange}
        cancelButtonProps={{ color: '#45C9F6' }}
        showLoading={this.props.loading}
        onClear={this.handleSearchClear}
        value={this.props.searchContent}
      />
    );
  }

  render() {
    const { opacity } = this.props;
    return (
      <Animated.View style={{ opacity }}>
        {this.renderSearch()}
        <View style={{ flex: 1, marginTop: 0.5, backgroundColor: 'white' }}>
          <FlatList
            data={[...this.props.data, ...testData[this.props.suggestionType]]}
            renderItem={this.renderItem}
            keyExtractor={(item) => item._id}
            onEndReached={() => this.props.onLoadMore()}
            onEndReachedThreshold={0}
            onRefresh={() => this.props.refreshSearchResult()}
            refreshing={this.props.loading}
          />
        </View>
      </Animated.View>
    );
    // onRefresh={this.handleRefresh}
    // refreshing={this.props.refreshing}
    // ListEmptyComponent={<EmptyResult text={'You haven\'t added any friends'} />}
  }
}

const styles = {
  // search related styles
  searchContainerStyle: {
    padding: 0,
    marginRight: 3,
    marginTop: 0.5,
    backgroundColor: '#ffffff',
    // backgroundColor: '#45C9F6',
    borderTopColor: '#ffffff',
    borderBottomColor: '#ffffff',
    alignItems: 'center',
  },
  searchInputContainerStyle: {
    backgroundColor: '#f3f4f6',
    // backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInputStyle: {
    fontSize: 15,
  },
  searchIconStyle: {
    top: 15,
    fontSize: 13
  },
};

const testData = {
  User: [
    {
      name: 'Jia Zeng',
      headline: 'Students at Duke University',
      request: false,
      _id: '120937109287091',
      profile: {
        about: 'this is about for jia zeng',
      }
    },
    {
      name: 'Peter Kushner',
      headline: 'CEO at start industries',
      request: false,
      _id: '019280980248303',
      profile: {
        about: 'this is about for jia zeng',
      }
    }
  ],
  Friend: [
    {
      name: 'Jia Zeng',
      headline: 'Students at Duke University',
      request: false,
      _id: '120937109287091',
      profile: {
        about: 'this is about for jia zeng',
      }
    },
    {
      name: 'Peter Kushner',
      headline: 'CEO at start industries',
      request: false,
      _id: '019280980248303',
      profile: {
        about: 'this is about for jia zeng',
      }
    }
  ],
  Tribe: [
    {
      _id: '123170293817024',
      created: '',
      name: 'SoHo Artists',
      membersCanInvite: true,
      isPubliclyVisible: true,
      membershipLimit: 100,
      description: 'This group is for all artists currently living in or working out of ' +
      'SoHo, NY. We exchange ideas, get feedback from each other and help each other ' +
      'organize exhiits for our work!',
      picture: '',
      members: [
        {
          _id: '1203798700',
          name: 'Jia Zeng',
          profile: {
            image: undefined
          }
        }
      ],
      memberCount: 10,
    },
    {
      _id: '123170293817023',
      created: '',
      name: 'Comic fans',
      membersCanInvite: true,
      isPubliclyVisible: true,
      membershipLimit: 20,
      description: 'This group is dedicated to the fan of comics in LA!',
      picture: '',
      members: [
        {
          _id: '1203798705',
          name: 'Super Andy',
          profile: {
            image: undefined
          }
        }
      ],
      memberCount: 19,
    }
  ],
  Event: [
    {
      _id: '980987230941',
      created: '2018-09-03T05:46:44.038Z',
      creator: {
        // User ref
        name: 'Jia Zeng'
      },
      title: 'Jay\'s end of internship party',
      start: '2018-09-05T05:46:44.038Z',
      durationHours: 2,
      participantsCanInvite: true,
      isInviteOnly: true,
      participantLimit: 100,
      location: '100 event ave, NY',
      description: 'Let\'s get together to celebrate Jay\'s birthday',
      picture: '',
      participants: [
        {
          _id: '123698172691',
          name: 'Super Andy',
          profile: {
            image: undefined
          }
        },
        {
          _id: '123698172692',
          name: 'Mike Gai',
          profile: {
            image: undefined
          }
        }
      ],
      participantCount: 2,
    },
    {
      _id: '980987230942',
      created: '2018-6-03T05:46:44.038Z',
      creator: {
        // User ref
        name: 'David Bogger'
      },
      title: 'Back to school party',
      start: '2018-09-10T05:46:44.038Z',
      durationHours: 3,
      participantsCanInvite: false,
      isInviteOnly: true,
      participantLimit: 30,
      location: 'TBD',
      description: 'We do nothing and simple enjoy life',
      picture: '',
      participants: [
        {
          _id: '123698172693',
          name: 'Batman',
          profile: {
            image: undefined
          }
        },
        {
          _id: '123698172694',
          name: 'Captain America',
          profile: {
            image: undefined
          }
        }
      ],
      participantCount: 2,
    }
  ],
  ChatConvoRoom: []
};

const mapDispatchToProps = (dispatch) => {
  const debouncedSearch = _.debounce((value, type) => dispatch(handleSearch(value, type)), 400);

  return ({
    debouncedSearch,
    clearSearchState: clearSearchState(dispatch),
    refreshSearchResult: () => dispatch(refreshSearchResult()),
    onLoadMore: () => dispatch(onLoadMore()),
    onSuggestionItemSelect: (val, pageId) => dispatch(onSuggestionItemSelect(val, pageId))
  });
};

const mapStateToProps = (state, props) => {
  const { suggestionType, selectedItem } = getNewCommentByTab(state, props.pageId).tmpSuggestion;
  const { searchRes, searchContent } = state.suggestionSearch;
  const { data, loading } = searchRes;

  return {
    suggestionType,
    data,
    loading,
    searchContent,
    selectedItem
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchSuggestion);
