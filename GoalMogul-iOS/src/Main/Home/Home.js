import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { TabViewAnimated, SceneMap } from 'react-native-tab-view';
import { MenuProvider } from 'react-native-popup-menu';

/* Components */
import TabButtonGroup from '../Common/TabButtonGroup';
import SearchBarHeader from '../Common/Header/SearchBarHeader';

import Mastermind from './Mastermind';
import ActivityFeed from './ActivityFeed';

// Actions
import { homeSwitchTab } from '../../actions';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        { key: 'goals', title: 'GOALS' },
        { key: 'activity', title: 'ACTIVITY' },
      ],
    };
  }

  _handleIndexChange = index => {
    this.setState({ index });
    this.props.homeSwitchTab(index);
  };

  _renderHeader = props => {
    return (
      <TabButtonGroup buttons={props} />
    );
  };

  _renderScene = SceneMap({
    goals: Mastermind,
    activity: ActivityFeed,
  });

  _keyExtractor = (item, index) => index;

  render() {
    /*
      TODO:
      1. use flatlist instead of scrollview
      2. assign key on for TabButton
    */
    return (
      <MenuProvider customStyles={{ backdrop: styles.backdrop }}>
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
      </MenuProvider>
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
  },
  backdrop: {
    backgroundColor: 'gray',
    opacity: 0.5,
  }
};

export default connect(
  null,
  {
    homeSwitchTab
  }
)(Home);
