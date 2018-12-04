import React, { Component } from 'react';
import {
  View
} from 'react-native';
import { connect } from 'react-redux';
import { TabView, SceneMap } from 'react-native-tab-view';
import { MenuProvider } from 'react-native-popup-menu';

/* Components */
import Suggested from './Suggested';
import Contacts from './Contacts';
import Friends from './Friends';
import Requests from './Requests';

import SearchBarHeader from '../Common/Header/SearchBarHeader';
import MeetFilterBar from './MeetFilterBar';
import MeetCard from './MeetCard';
import TabButtonGroup from '../Common/TabButtonGroup';

// actions
import {
  selectTab,
  preloadMeet,
} from '../../actions';

class MeetTab extends Component {

  componentWillMount() {
    this.props.preloadMeet();
  }

  _handleIndexChange = (index) => {
    this.props.selectTab(index);
  };

  _renderHeader = props => {
    return (
      <TabButtonGroup buttons={props} />
    );
  };

  _renderScene = SceneMap({
    suggested: Suggested,
    friends: Friends,
    contacts: Contacts,
    requests: Requests,
  });

  /*
  NOTE: this method is deprecated since we move to swiping mode between tabs

  selectTab = id => {
    this.props.selectTab(id);
  }

  keyExtractor = (item) => item.id;

  renderItem = ({ item }) => {
    return <MeetCard item={item} />;
  }

  renderTabs() {
    return Tabs.map((t, index) => {
      let buttonContainerStyle = { ...styles.buttonContainerStyle };
      let buttonTextStyle = { ...styles.buttonTextStyle };

      if (t.name === this.props.selectedTab) {
        buttonContainerStyle.backgroundColor = '#1379a7';
      } else {
        buttonContainerStyle.backgroundColor = '#1aa0dd';
      }
      return (
        <View style={buttonContainerStyle} key={index}>
          <TouchableOpacity activeOpacity={0.85} onPress={this.selectTab.bind(this, t.name)}>
            <Text style={buttonTextStyle}>{t.name}</Text>
          </TouchableOpacity>
        </View>
      );
    });
  }
  */

  /*
  Note: This is a good practice for activityIndicator rendering

  renderActivityIndicator() {
    if (this.props.tab.loading) {
      return <ActivityIndicator size="small" color="#0000ff" />;
    }
  }
  */

  render() {
    return (
      <MenuProvider customStyles={{ backdrop: styles.backdrop }}>
        <View style={{ flex: 1 }}>
          <SearchBarHeader rightIcon='menu' />
          <TabView
            navigationState={this.props.navigationState}
            renderScene={this._renderScene}
            renderTabBar={this._renderHeader}
            onIndexChange={this._handleIndexChange}
            useNativeDriver
          />
          <View style={{ height: 3 }} />
        </View>
      </MenuProvider>
    );
  }
}

const styles = {
  buttonContainerStyle: {

  },
  buttonTextStyle: {
    color: '#ffffff',
    padding: 10,
    fontWeight: '700'
  },
  backdrop: {
    backgroundColor: 'gray',
    opacity: 0.7,
  }
};


const mapStateToProps = state => {
  const { selectedTab, navigationState } = state.meet;

  return {
    selectedTab,
    navigationState
  };
};

export default connect(
  mapStateToProps, {
    selectTab,
    preloadMeet
  })(MeetTab);
