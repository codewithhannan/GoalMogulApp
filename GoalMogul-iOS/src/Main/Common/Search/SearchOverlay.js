import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList
} from 'react-native';
import { connect } from 'react-redux';
import { SearchBar, Icon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { MenuProvider } from 'react-native-popup-menu';
import _ from 'lodash';

// Component
import BaseOverlay from './BaseOverlay';
import SearchFilterBar from './SearchFilterBar';

import {
  refreshSearchResult,
  handleSearch
} from '../../../redux/modules/search/SearchActions';

const DEBUG_KEY = '[ Component Search ]';

const testDataSearch = [
  {
    name: 'Jia Zeng',
    _id: '120379187290381'
  }
];

class SearchOverlay extends Component {
  // Search bar functions
  handleCancel = () => {
    //TODO: potentially clear search state
    Actions.pop();
  }

  handleChangeText = (value) => {
    this.props.debouncedSearch(value.trim());
  }

  // FlatList renderer functions
  handleRefresh = () => {
    console.log(`${DEBUG_KEY} refresh result`);
    this.props.refreshSearchResult();
  }

  _keyExtractor = (item) => item._id;

  handleOnLoadMore = () => {
    console.log(`${DEBUG_KEY}: loading more`);
  }

  searchIcon = () => (
    <View style={{ flexDirection: 'row' }}>
      <Icon
        type='font-awesome'
        name='search'
        style={styles.searchIconStyle}
      />
      <Text>Search GoalMogul</Text>
    </View>
  );

  renderItem = ({ item }) => {
    // TODO: render search result
  }

  render() {
    let dataToRender = testDataSearch.concat(this.props.data);

    return (
      <BaseOverlay verticalPercent={1} horizontalPercent={1}>
        <MenuProvider>
          <View style={styles.headerContainerStyle}>
            <SearchBar
              platform='ios'
              round
              autoFocus
              inputStyle={styles.searchInputStyle}
              inputContainerStyle={styles.searchInputContainerStyle}
              containerStyle={styles.searchContainerStyle}
              placeholder='Search GoalMogul'
              cancelButtonTitle='Cancel'
              onCancel={this.handleCancel}
              onChangeText={this.handleChangeText}
              clearIcon={null}
              cancelButtonProps={{ color: '#45C9F6' }}
              showLoading={this.props.loading}
            />
          </View>
          <SearchFilterBar />
          <FlatList
            data={dataToRender}
            renderItem={this.renderItem}
            keyExtractor={this._keyExtractor}
            onEndReached={this.handleOnLoadMore}
            onEndReachedThreshold={0.5}
          />
        {/*refreshing={this.props.loading}
          onRefresh={this.handleRefresh}*/}
        </MenuProvider>
      </BaseOverlay>
    );
  }
}

const styles = {
  searchContainerStyle: {
    padding: 0,
    marginRight: 3,
    backgroundColor: '#ffffff',
    borderTopColor: '#ffffff',
    borderBottomColor: '#ffffff',
    alignItems: 'center',

  },
  searchInputContainerStyle: {
    backgroundColor: '#f3f4f6',
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
  headerContainerStyle: {
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center'
  }
};

const mapStateToProps = state => {
  const { data, loading } = state.search;

  return {
    data,
    loading
  };
};

const mapDispatchToProps = dispatch => {
  const debouncedSearch = _.debounce(value => dispatch(handleSearch(value)), 400);
  return ({
    debouncedSearch,
    refreshSearchResult
  });
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchOverlay);
