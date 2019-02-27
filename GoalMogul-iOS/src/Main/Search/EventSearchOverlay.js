// This component is used for search for only event
// This component is a search overlay for three tabs, people, event and tribe
import React, { Component } from 'react';
import {
  View,
  Text
} from 'react-native';
import { connect } from 'react-redux';
import { SearchBar, Icon } from 'react-native-elements';
import { MenuProvider } from 'react-native-popup-menu';
import _ from 'lodash';

// Component
import BaseOverlay from './BaseOverlay';
import EventSearch from './Event/EventSearch';
import { SearchIcon } from '../../Utils/Icons';

import {
  handleSearch,
  clearSearchState
} from '../../redux/modules/search/SearchActions';

const DEBUG_KEY = '[ Event Search ]';
const SEARCH_TYPE = 'events';

class EventSearchOverlay extends Component {
  // Search bar functions
  handleCancel = () => {
    //TODO: potentially clear search state
    console.log(`${DEBUG_KEY} handle cancel`);
    this.props.clearSearchState();
    // Actions.pop();
    this.refs.baseOverlay.closeModal();
  }

  handleChangeText = (value) => {
    if (value === undefined) {
      return;
    }
    if (value === '') {
      this.props.clearSearchState(this.props.selectedTab);
    }
    this.props.debouncedSearch(value.trim(), SEARCH_TYPE);
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

  render() {
    const searchPlaceHolder = this.props.searchPlaceHolder
      ? this.props.searchPlaceHolder
      : 'Search an event';
    return (
      <BaseOverlay verticalPercent={1} horizontalPercent={1} ref='baseOverlay'>
        <MenuProvider customStyles={{ backdrop: styles.backdrop }}>
          <View style={styles.headerContainerStyle}>
            <SearchBar
              platform='ios'
              round
              autoFocus
              inputStyle={styles.searchInputStyle}
              inputContainerStyle={styles.searchInputContainerStyle}
              containerStyle={styles.searchContainerStyle}
              placeholder={searchPlaceHolder}
              cancelButtonTitle='Cancel'
              onCancel={this.handleCancel}
              onChangeText={this.handleChangeText}
              clearIcon={null}
              cancelButtonProps={{ color: '#17B3EC' }}
              showLoading={this.props.loading}
              searchIcon={() => (
                <SearchIcon 
                  iconContainerStyle={{ marginBottom: 1, marginTop: 1 }} 
                  iconStyle={{ tintColor: '#4ec9f3', height: 15, width: 15 }}
                />
              )}
            />
          </View>
          <EventSearch callback={this.props.callback} />
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
  },
  backdrop: {
    backgroundColor: 'gray',
    opacity: 0.7,
  }
};

const mapStateToProps = state => {
  const { selectedTab, navigationState } = state.search;
  const { loading } = state.search[selectedTab];

  return {
    selectedTab,
    navigationState,
    loading
  };
};

const mapDispatchToProps = (dispatch) => {
  const debouncedSearch = _.debounce((value, type) => dispatch(handleSearch(value, type)), 400);
  return ({
    debouncedSearch,
    clearSearchState: clearSearchState(dispatch)
  });
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventSearchOverlay);
