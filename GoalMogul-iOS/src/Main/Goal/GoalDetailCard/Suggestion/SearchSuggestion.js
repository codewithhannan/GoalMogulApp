// This component provides search for suggestion for Tribe, Event, User, Friend,
// and Chat room
import React from 'react';
import {
  View,
  FlatList
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
  onSuggestionItemSelect
} from '../../../../redux/modules/feed/comment/SuggestionSearchActions';

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
    return switchCaseF({
      User: (<UserCard item={item} onCardPress={this.props.onSuggestionItemSelect} />),
      Tribe: (<TribeCard item={item} onCardPress={this.props.onSuggestionItemSelect} />),
      Event: (<EventCard item={item} onCardPress={this.props.onSuggestionItemSelect} />),
      Friend: (<UserCard item={item} onCardPress={this.props.onSuggestionItemSelect} />),
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
    return (
      <View>
        {this.renderSearch()}
        <View style={{ flex: 1, marginTop: 0.5, backgroundColor: 'white' }}>
          <FlatList
            data={[]}
            renderItem={this.renderItem}
            keyExtractor={(item) => item._id}
            onEndReached={() => this.props.onLoadMore()}
            onEndReachedThreshold={0}
            onRefresh={() => this.props.refreshSearchResult()}
            refreshing={this.props.loading}
          />
        </View>
      </View>
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

const testData = [
  {
    name: 'Jia Zeng',
    headline: 'Students at Duke University',
    request: false,
    _id: '120937109287091'
  },
  {
    name: 'Peter Kushner',
    headline: 'CEO at start industries',
    request: false,
    _id: '019280980248303'
  }
];

const mapDispatchToProps = (dispatch, getState) => {
  const debouncedSearch = _.debounce((value, type) => dispatch(handleSearch(value, type)), 400);
  return ({
    debouncedSearch,
    clearSearchState: clearSearchState(dispatch),
    refreshSearchResult,
    onLoadMore,
    onSuggestionItemSelect
  });
};

const mapStateToProps = state => {
  const { suggestionType } = state.newComment.tmpSuggestion;
  const { searchRes, searchContent } = state.suggestionSearch;
  const { data, loading } = searchRes;

  return {
    suggestionType,
    data,
    loading,
    searchContent
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchSuggestion);
