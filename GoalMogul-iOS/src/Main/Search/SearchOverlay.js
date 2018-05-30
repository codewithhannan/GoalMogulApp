import React, { Component } from 'react';
import {
  View,
  Text,
} from 'react-native';
import { connect } from 'react-redux';
import { SearchBar, Icon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { MenuProvider } from 'react-native-popup-menu';
import _ from 'lodash';
import { TabViewAnimated, SceneMap } from 'react-native-tab-view';

// Component
import BaseOverlay from './BaseOverlay';
import SearchFilterBar from './SearchFilterBar';
import TabButtonGroup from '../Common/TabButtonGroup';
import PeopleSearch from './People/PeopleSearch';
// import EventSearch from './Event/EventSearch';
// import TribeSearch from './Tribe/TribeSearch';

import {
  handleSearch,
  searchSwitchTab
} from '../../redux/modules/search/SearchActions';

const DEBUG_KEY = '[ Component Search ]';

class SearchOverlay extends Component {
  // Search bar functions
  handleCancel = () => {
    //TODO: potentially clear search state
    Actions.pop();
  }

  handleChangeText = (value) => {
    this.props.debouncedSearch(value.trim());
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

  // Tabs handler functions
  _handleIndexChange = index => {
    console.log(`${DEBUG_KEY}: index changed to ${index}`);
    this.props.searchSwitchTab(index);
  };

  _renderHeader = props => {
    return (
      <TabButtonGroup buttons={props} />
    );
  };

  _renderScene = SceneMap({
    people: PeopleSearch,
    tribes: PeopleSearch,
    events: PeopleSearch
  });

  render() {
    return (
      <BaseOverlay verticalPercent={1} horizontalPercent={1}>
        <MenuProvider customStyles={{ backdrop: styles.backdrop }}>
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
          <TabViewAnimated
            navigationState={this.props.navigationState}
            renderScene={this._renderScene}
            renderHeader={this._renderHeader}
            onIndexChange={this._handleIndexChange}
            useNativeDriver
          />
          <SearchFilterBar />
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

  return {
    selectedTab,
    navigationState
  };
};

const mapDispatchToProps = (dispatch) => {
  const debouncedSearch = _.debounce(value => dispatch(handleSearch(value)), 400);
  return ({
    debouncedSearch,
    searchSwitchTab: searchSwitchTab(dispatch)
  });
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchOverlay);
