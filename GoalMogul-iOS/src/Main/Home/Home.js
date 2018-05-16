import React, { Component } from 'react';
import { View, Text, ScrollView, Animated } from 'react-native';
import {
  Scene,
  Stack,
  Tabs,
  Router
} from 'react-native-router-flux';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';

/* Components */
import PostCard from '../../components/PostCard';
import TabButtonGroup from '../Common/TabButtonGroup';
import SearchBarHeader from '../Common/SearchBarHeader';

import Mastermind from './Mastermind';
import ActivityFeed from './ActivityFeed';

//TODO: delete following imports
import MyGoalCard from '../Common/MyGoalCard';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        { key: 'mastermind', title: 'Mastermind' },
        { key: 'activityfeed', title: 'ActivityFeed' },
      ],
    };
  }

  _handleIndexChange = index => this.setState({ index });

  _renderHeader = props => {
    return (
      <TabButtonGroup buttons={props} />
    );
  };

  _renderScene = SceneMap({
    mastermind: Mastermind,
    activityfeed: ActivityFeed,
  });

  _keyExtractor = (item, index) => index;

  render() {
    /*
      TODO:
      1. use flatlist instead of scrollview
      2. assign key on for TabButton
    */
    return (
      <View style={styles.homeContainerStyle}>
        <SearchBarHeader rightIcon='menu' />
        <TabViewAnimated
          navigationState={this.state}
          renderScene={this._renderScene}
          renderHeader={this._renderHeader}
          onIndexChange={this._handleIndexChange}
          useNativeDriver
        />

        {/*
          <FlatList
            data={this.props.photos}
            renderItem={(item) => this.renderRow(item)}
            numColumns={3}
            keyExtractor={this._keyExtractor}
          />
          */}
      </View>
    );
  }
}

const styles = {
  homeContainerStyle: {
    backgroundColor: '#f3f4f6',
    flex: 1
  },
  textStyle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#696969',

  },
  onSelectTextStyle: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  }
};

export default Home;
