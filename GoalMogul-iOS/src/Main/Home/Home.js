import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { TabViewAnimated, SceneMap } from 'react-native-tab-view';
import { MenuProvider } from 'react-native-popup-menu';

/* Components */
import TabButtonGroup from '../Common/TabButtonGroup';
import SearchBarHeader from '../Common/Header/SearchBarHeader';
import Report from '../Report/Report';

import Mastermind from './Mastermind';
import ActivityFeed from './ActivityFeed';

// Actions
import { homeSwitchTab } from '../../actions';

// Assets
import Logo from '../../asset/header/logo.png';
import Activity from '../../asset/utils/activity.png';

const TabIconMap = {
  goals: {
    iconSource: Logo,
    iconStyle: {
      height: 17,
      width: 17
    }
  },
  activity: {
    iconSource: Activity,
    iconStyle: {
      height: 15,
      width: 15
    }
  }
};

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navigationState: {
        index: 0,
        routes: [
          { key: 'goals', title: 'GOALS' },
          { key: 'activity', title: 'ACTIVITY' },
        ],
      }
    };
  }

  _handleIndexChange = index => {
    this.setState({
      ...this.state,
      navigationState: {
        ...this.state.navigationState,
        index,
      }
    });
    this.props.homeSwitchTab(index);
  };

  _renderHeader = props => {
    return (
      <TabButtonGroup buttons={props} tabIconMap={TabIconMap} />
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
          <Report showing={this.props.showingModal} />
          <SearchBarHeader rightIcon='menu' />
          <TabViewAnimated
            navigationState={this.state.navigationState}
            renderScene={this._renderScene}
            renderHeader={this._renderHeader}
            onIndexChange={this._handleIndexChange}
            useNativeDriver
          />
        </View>
      </MenuProvider>
    );
  }
}

const mapStateToProps = state => {
  const { showingModal } = state.report;

  return {
    showingModal
  };
};

const styles = {
  homeContainerStyle: {
    backgroundColor: '#f8f8f8',
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
  mapStateToProps,
  {
    homeSwitchTab
  }
)(Home);
