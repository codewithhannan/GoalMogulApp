import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';

/* Components */
import SearchBarHeader from '../Common/SearchBarHeader';
import MeetFilterBar from './MeetFilterBar';
import MeetCard from './MeetCard';

// actions
import {
  selectTab,
  preloadMeet,
  handleRefresh
} from '../../actions';

const Tabs = [
  {
    name: 'SUGGESTED'
  },
  {
    name: 'REQUESTS'
  },
  {
    name: 'FRIENDS'
  },
  {
    name: 'CONTACTS'
  }
];

const testDataSuggested = [
  {
    id: 1,
    name: 'Jia Zeng',
    profile: {
      occupation: 'SR. ACCOUNTANT'
    }

  }
];

class MeetTab extends Component {

  componentWillMount() {
    this.props.preloadMeet();
  }

  selectTab = id => {
    this.props.selectTab(id);
  }

  handleRefresh = () => {
    this.props.handleRefresh(this.props.selectedTab.toLowerCase());
  }

  keyExtractor = (item) => item.id;

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
          <TouchableOpacity onPress={this.selectTab.bind(this, t.name)}>
            <Text style={buttonTextStyle}>{t.name}</Text>
          </TouchableOpacity>
        </View>
      );
    });
  }

  renderItem = ({ item }) => {
    return <MeetCard item={item} />;
  }

  renderActivityIndicator() {
    if (this.props.tab.loading) {
      return <ActivityIndicator size="small" color="#0000ff" />;
    }
  }

  render() {
    console.log('tab is: ', this.props.tab.refreshing);
    return (
      <View style={{ flex: 1 }}>
        <SearchBarHeader rightIcon='menu' />
        <View>
          <ScrollView horizontal>
            {this.renderTabs()}
          </ScrollView>
        </View>

        <MeetFilterBar />
        <View style={{ flex: 1 }}>
          <FlatList
            data={this.props.tab.data}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
            refreshing={this.props.tab.refreshing}
            onRefresh={this.handleRefresh.bind()}
          />
        </View>
      </View>
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
  }
};


const mapStateToProps = state => {
  const { selectedTab, suggested, requests, friends, contacts } = state.meet;

  const tab = ((id) => {
    switch (id) {
      case 'SUGGESTED': {
        let newSuggested = { ...suggested };
        newSuggested.data = testDataSuggested;
        return newSuggested;
        // return suggested
      }

      case 'REQUESTS':
        return requests;
      case 'FRIENDS':
        return friends;
      case 'CONTACTS':
        return contacts;
      default:
        return suggested;
    }
  })(selectedTab);

  return {
    selectedTab,
    tab
  };
};

export default connect(
  mapStateToProps, {
    selectTab,
    preloadMeet,
    handleRefresh
  })(MeetTab);
