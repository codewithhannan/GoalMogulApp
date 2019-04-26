// This component is a search overlay for three tabs, people, event and tribe
import React, { Component } from 'react';
import {
  View,
  Text,
  Platform,
  Keyboard
} from 'react-native';
import { connect } from 'react-redux';
import { SearchBar, Icon } from 'react-native-elements';
import { MenuProvider } from 'react-native-popup-menu';
import _ from 'lodash';
import { Constants } from 'expo';
import { TabView, SceneMap } from 'react-native-tab-view';

// Component
import BaseOverlay from './BaseOverlay';
// import SearchFilterBar from './SearchFilterBar';
import TabButtonGroup from '../Common/TabButtonGroup';
import PeopleSearch from './People/PeopleSearch';
import EventSearch from './Event/EventSearch';
import TribeSearch from './Tribe/TribeSearch';
import { SearchIcon } from '../../Utils/Icons';

// Actions
import {
  handleSearch,
  searchSwitchTab,
  clearSearchState
} from '../../redux/modules/search/SearchActions';

// Styles
import {
  APP_DEEP_BLUE,
  APP_BLUE
} from '../../styles';

// Constants
import {
  IPHONE_MODELS
} from '../../Utils/Constants';

const DEBUG_KEY = '[ Component Search ]';

class SearchOverlay extends Component {
  constructor(props) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleOnEndSubmitting = this.handleOnEndSubmitting.bind(this);
    this.keyboardWillHide = this.keyboardWillHide.bind(this);
    this.isCanceled = false;
    this.state = {
      // We keep a local copy since debounced search takes a while to fire event to update reducer
      searchContent: undefined,
    };
  }

  componentWillMount() {
    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
  }

  componentWillUnmount() {
    this.keyboardWillHideListener.remove();
  }

  keyboardWillHide() {
    if ((!this.props.searchContent || this.props.searchContent.trim() === '') && 
        (!this.state.searchContent || this.state.searchContent === '' || this.state.searchContent.trim() === '') &&
        !this.isCanceled) {
      this.handleCancel();
    }
  }

  // Search bar functions
  handleCancel = () => {
    //TODO: potentially clear search state
    console.log(`${DEBUG_KEY} handle cancel`);
    this.isCanceled = true;
    this.props.clearSearchState();
    // Actions.pop();
    this.refs.baseOverlay.closeModal();
  }

  handleChangeText = (value) => {
    if (value === undefined) {
      return;
    }
    this.setState({
      ...this.state,
      searchContent: value 
    }, () => {
      if (value === '') {
        this.props.clearSearchState(this.props.selectedTab);
      }
      this.props.debouncedSearch(value.trim(), this.props.selectedTab);
    });
  }

  handleOnEndSubmitting = ({ nativeEvent }) => {
    const { text, eventCount, taget } = nativeEvent;
    // Close the search modal if nothing is entered
    if (text === undefined || text === null || text === '' || text.trim() === '') {
      this.handleCancel();
    }
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
      <TabButtonGroup 
        buttons={props} 
        noBorder
        buttonStyle={{
          selected: {
            backgroundColor: APP_DEEP_BLUE,
            tintColor: 'white',
            color: 'white',
            fontWeight: '700'
          },
          unselected: {
            backgroundColor: '#FCFCFC',
            tintColor: '#616161',
            color: '#616161',
            fontWeight: '600'
          }
        }}   
      />
    );
  };

  _renderScene = SceneMap({
    people: () => <PeopleSearch type='GeneralSearch' />,
    tribes: () => <TribeSearch type='GeneralSearch' />,
    events: () => <EventSearch type='GeneralSearch' />
  });

  render() {
    const marginTop = (
      Platform.OS === 'ios' &&
      IPHONE_MODELS.includes(Constants.platform.ios.model.toLowerCase())
    ) ? 45 : 70;

    return (
      <BaseOverlay verticalPercent={1} horizontalPercent={1} ref='baseOverlay'>
        <MenuProvider customStyles={{ backdrop: styles.backdrop }}>
          <View style={{ ...styles.headerContainerStyle, paddingTop: marginTop }}>
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
              showLoading={this.props.loading}
              placeholderTextColor={APP_BLUE}
              cancelButtonProps={{
                buttonTextStyle: {
                  // color: APP_DEEP_BLUE
                  color: '#33485e'
                }
              }}
              searchIcon={() => (
                <SearchIcon 
                  iconContainerStyle={{ marginBottom: 1, marginTop: 1 }} 
                  iconStyle={{ tintColor: APP_BLUE, height: 15, width: 15 }}
                />
              )}
              onSubmitEditing={this.handleOnEndSubmitting}
            />
          </View>
          <TabView
            navigationState={this.props.navigationState}
            renderScene={this._renderScene}
            renderTabBar={this._renderHeader}
            onIndexChange={this._handleIndexChange}
            useNativeDriver
            swipeEnabled={false}
          />
        </MenuProvider>
      </BaseOverlay>
    );
  }
}

const styles = {
  // searchContainerStyle: {
  //   padding: 0,
  //   marginRight: 3,
  //   backgroundColor: '#ffffff',
  //   borderTopColor: '#ffffff',
  //   borderBottomColor: '#ffffff',
  //   alignItems: 'center',
  // },
  // searchInputContainerStyle: {
  //   backgroundColor: '#f3f4f6',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  // searchInputStyle: {
  //   fontSize: 15,
  // },
  // headerContainerStyle: {
  //   marginTop: 45,
  //   justifyContent: 'center',
  //   alignItems: 'center'
  // },
  headerContainerStyle: {
    paddingTop: 45,
    backgroundColor: APP_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainerStyle: {
    padding: 0,
    marginRight: 3,
    backgroundColor: APP_BLUE,
    borderTopColor: '#ffffff',
    borderBottomColor: '#ffffff',
    alignItems: 'center',
  },
  searchInputContainerStyle: {
    backgroundColor: '#0397CB',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  searchInputStyle: {
    fontSize: 15,
    color: 'white',
  },
  searchIconStyle: {
    top: 15,
    fontSize: 13
  },
  backdrop: {
    backgroundColor: 'gray',
    opacity: 0.7,
  }
};

const mapStateToProps = state => {
  const { selectedTab, navigationState, searchContent } = state.search;
  const { loading } = state.search[selectedTab];

  return {
    selectedTab,
    navigationState,
    loading,
    searchContent
  };
};

const mapDispatchToProps = (dispatch) => {
  const debouncedSearch = _.debounce((value, type) => dispatch(handleSearch(value, type)), 400);
  return ({
    debouncedSearch,
    // searchSwitchTab: searchSwitchTab(dispatch),
    searchSwitchTab: (index) => dispatch(searchSwitchTab(index)),
    clearSearchState: clearSearchState(dispatch)
  });
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchOverlay);
