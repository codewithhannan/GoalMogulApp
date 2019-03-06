// This component provides search for suggestion for Tribe, Event, User, Friend,
// and Chat room
import React from 'react';
import {
  View,
  FlatList,
  Animated,
  TouchableWithoutFeedback,
  Keyboard
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
import {
  SearchIcon
} from '../../../../Utils/Icons';
import EmptyResult from '../../../Common/Text/EmptyResult';

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

// Constants
import {
  SUGGESTION_SEARCH_LIMIT
} from '../../../../redux/modules/feed/comment/SuggestionSearchReducers';

const DEBUG_KEY = '[ UI SearchSuggestion ]';

class SearchSuggestion extends React.Component {
  state = {
    query: ''
  }

  // Search Query handler
  handleSearchCancel = () => {
    console.log(`${DEBUG_KEY}: search cancel`);
    this.handleQueryChange('');
    this.props.clearSearchState();

    // This is a hacky way to work around SearchBar bug
    // We have to trigger focus again before calling blur
    this.searchBar.focus();
    this.searchBar.blur();
  };

  handleSearchClear = () => this.handleQueryChange('');

  handleQueryChange = query => {
    // this.setState(state => ({ ...state, query: query || '' }));
    if (query === undefined) {
      return;
    }
    if (query === '') {
      this.props.clearSearchState(this.props.selectedTab);
      return;
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
          onCardPress={(val) => {
            this.props.onSuggestionItemSelect(val, pageId);
            if (this.props.onSelect) {
              this.props.onSelect();
            }
          }}
          selected={selected}
        />
      ),
      Tribe: (
        <TribeCard
          item={item}
          onCardPress={(val) => {
            this.props.onSuggestionItemSelect(val, pageId);
            if (this.props.onSelect) {
              this.props.onSelect();
            }
          }}
          selected={selected}
        />
      ),
      Event: (
        <EventCard
          item={item}
          onCardPress={(val) => {
            this.props.onSuggestionItemSelect(val, pageId);
            if (this.props.onSelect) {
              this.props.onSelect();
            }
          }}
          selected={selected}
        />
      ),
      Friend: (
        <UserCard
          item={item}
          onCardPress={(val) => {
            this.props.onSuggestionItemSelect(val, pageId);
            if (this.props.onSelect) {
              this.props.onSelect();
            }
          }}
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
        ref={(ref) => { this.searchBar = ref; }}
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
        cancelButtonProps={{ color: '#17B3EC' }}
        showLoading={this.props.loading}
        onClear={this.handleSearchClear}
        value={this.props.searchContent}
        clearIcon={null}
        searchIcon={() => (
          <SearchIcon 
            iconContainerStyle={{ marginBottom: 3, marginTop: 1 }} 
            iconStyle={{ tintColor: '#4ec9f3', height: 15, width: 15 }}
          />
        )}
      />
    );
  }

  renderListFooter() {
    const { loading, data } = this.props;
    // console.log(`${DEBUG_KEY}: loading is: ${loadingMore}, data length is: ${data.length}`);
    if (loading && data.length >= SUGGESTION_SEARCH_LIMIT) {
      return (
        <View
          style={{
            paddingVertical: 20
          }}
        >
          <ActivityIndicator size='small' />
        </View>
      );
    }
  }

  render() {
    const { opacity } = this.props;
    return (
      <Animated.View style={{ opacity }}>
        {this.renderSearch()}
        <View style={{ flex: 1, marginTop: 0.5, backgroundColor: 'white' }}>
          <FlatList
            data={this.props.data}
            renderItem={this.renderItem}
            keyExtractor={(item) => item._id}
            onEndReached={() => this.props.onLoadMore()}
            onEndReachedThreshold={0}
            onRefresh={() => this.props.refreshSearchResult()}
            refreshing={this.props.refreshing}
            ListFooterComponent={this.renderListFooter()}
            ListEmptyComponent={
              this.props.refreshing ? null :
              <EmptyResult text={'No found'} textStyle={{ paddingTop: 130 }} />
            }
          />
        </View>
      </Animated.View>
    );
  }
}

const styles = {
  // search related styles
  searchContainerStyle: {
    padding: 0,
    marginRight: 3,
    marginTop: 0.5,
    backgroundColor: '#ffffff',
    // backgroundColor: '#17B3EC',
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
  const { data, loading, refreshing } = searchRes;

  return {
    suggestionType,
    data,
    loading,
    refreshing,
    searchContent,
    selectedItem
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchSuggestion);
