import React, { Component } from 'react';
import { View, TouchableOpacity, Image, AppState } from 'react-native';
import { connect } from 'react-redux';
import { TabView } from 'react-native-tab-view';
import { MenuProvider } from 'react-native-popup-menu';
import { Actions } from 'react-native-router-flux';
import _ from 'lodash';

/* Components */
import TabButtonGroup from '../Common/TabButtonGroup';
import SearchBarHeader from '../Common/Header/SearchBarHeader';
import Report from '../Report/Report';

import Mastermind from './Mastermind';
import ActivityFeed from './ActivityFeed';

// Actions
import { homeSwitchTab, fetchAppUserProfile } from '../../actions';
import {
  openCreateOverlay,
  refreshGoals
} from '../../redux/modules/home/mastermind/actions';

import { refreshFeed } from '../../redux/modules/home/feed/actions';

import { 
  subscribeNotification, 
  saveUnreadNotification 
} from '../../redux/modules/notification/NotificationActions';

// Assets
import Logo from '../../asset/header/logo.png';
import Activity from '../../asset/utils/activity.png';
import plus from '../../asset/utils/plus.png';

// Styles
import { APP_DEEP_BLUE } from '../../styles';

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

const DEBUG_KEY = '[ UI Home ]';

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
      },
      appState: AppState.currentState
    };
    this.scrollToTop = this.scrollToTop.bind(this);
    this._renderScene = this._renderScene.bind(this);
    this.setTimer = this.setTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
  }


  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);

    // Set timer to fetch profile again if previously failed
    this.setTimer();
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
    
    // Remove timer in case app crash
    this.stopTimer();
  }

  setTimer() {
    this.stopTimer(); // Clear the previous timer if there is one

    console.log(`${DEBUG_KEY}: [ Setting New Timer ] for fetching profile after 5s`);
    this.timer = setTimeout(() => {
      console.log(`${DEBUG_KEY}: [ Timer firing ] fetching profile again.`);
      this.props.fetchProfile();
    }, 5000);
  }

  stopTimer() {
    if (this.timer !== undefined) {
      console.log(`${DEBUG_KEY}: [ Timer clearing ] for fetching profile 5s after mounted`);
      clearInterval(this.timer);
    }
  }

  scrollToTop = () => {
    const { navigationState } = this.state;
    const { index, routes } = navigationState;
    if (routes[index].key === 'goals') {
      return this.mastermind.getWrappedInstance().scrollToTop();
    }
    if (routes[index].key === 'activity') {
      return this.activityFeed.getWrappedInstance().scrollToTop();
    }
  }

  handleCreateGoal = () => {
    this.props.openCreateOverlay();
    // As we move the create option here, we no longer need to care about the tab
    Actions.createGoalButtonOverlay({ tab: 'mastermind' });
  }

  handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log(`${DEBUG_KEY}: [handleAppStateChange] App has become active!`);

      const { needRefreshActivity, needRefreshMastermind, user } = this.props;
      if (user === undefined || _.isEmpty(user) || !user.profile) {
        this.props.fetchAppUserProfile({ navigate: false });
      }

      if (needRefreshMastermind) {
        this.props.refreshGoals();
      }

      if (needRefreshActivity) {
        this.props.refreshFeed();
      }
    }

    if (this.state.appState === 'active' && nextAppState === 'inactive') {
      console.log(`${DEBUG_KEY}: [handleAppStateChange] App has become inactive!`);
      this.props.saveUnreadNotification();
    }

    this.setState({
      appState: nextAppState
    });
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
      <TabButtonGroup
        buttons={props} 
        noBorder
        tabIconMap={TabIconMap} 
        buttonStyle={{
          selected: {
            backgroundColor: APP_DEEP_BLUE,
            tintColor: 'white',
            color: 'white',
            fontWeight: '700'
          },
          unselected: {
            backgroundColor: 'white',
            tintColor: '#616161',
            color: '#616161',
            fontWeight: '600'
          }
        }}  
      />
    );
  };

  _renderScene = ({ route }) => {
    switch (route.key) {
      case 'goals': 
        return <Mastermind ref={m => (this.mastermind = m)} />;

      case 'activity': 
        return <ActivityFeed ref={a => (this.activityFeed = a)} />;

      default: 
        return null;
    }
  };

  _keyExtractor = (item, index) => index;

  renderPlus() {
    if (this.props.showPlus) {
      return (
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.iconContainerStyle}
          onPress={this.handleCreateGoal}
        >
          <Image style={styles.iconStyle} source={plus} />
        </TouchableOpacity>
      );
    }
    return '';
  }

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
          <TabView
            ref={ref => (this.tab = ref)}
            navigationState={this.state.navigationState}
            renderScene={this._renderScene}
            renderTabBar={this._renderHeader}
            onIndexChange={this._handleIndexChange}
            useNativeDriver
          />
          {this.renderPlus()}
        </View>
      </MenuProvider>
    );
  }
}

const mapStateToProps = state => {
  const { showingModal } = state.report;
  const { showPlus, data } = state.home.mastermind;
  const needRefreshMastermind = _.isEmpty(state.home.mastermind.data);
  const needRefreshActivity = _.isEmpty(state.home.activityfeed.data);
  const { user } = state.user;

  return {
    showingModal,
    showPlus,
    user,
    needRefreshActivity,
    needRefreshMastermind
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
  },
  iconContainerStyle: {
    position: 'absolute',
    bottom: 20,
    right: 15,
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
    // backgroundColor: '#17B3EC',
    backgroundColor: APP_DEEP_BLUE,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },
  iconStyle: {
    height: 26,
    width: 26,
    tintColor: 'white',
  }
};

export default connect(
  mapStateToProps,
  {
    fetchAppUserProfile,
    homeSwitchTab,
    openCreateOverlay,
    subscribeNotification,
    saveUnreadNotification,
    refreshGoals,
    refreshFeed
  },
  null,
  { withRef: true }
)(Home);
