import React, { Component } from 'react';
import { View, AppState } from 'react-native';
import { connect } from 'react-redux';
import { TabView } from 'react-native-tab-view';
import { MenuProvider } from 'react-native-popup-menu';
import { Actions } from 'react-native-router-flux';
import _ from 'lodash';
import { Notifications } from 'expo';
import { copilot } from 'react-native-copilot-gm';

/* Components */
import TabButtonGroup from '../Common/TabButtonGroup';
import SearchBarHeader from '../Common/Header/SearchBarHeader';

import Mastermind from './Mastermind';
import ActivityFeed from './ActivityFeed';

// Actions
import { homeSwitchTab, fetchAppUserProfile, fetchProfile, checkIfNewlyCreated } from '../../actions';
import {
  openCreateOverlay,
  refreshGoals,
  closeCreateOverlay
} from '../../redux/modules/home/mastermind/actions';

import { refreshFeed } from '../../redux/modules/home/feed/actions';

import { 
  subscribeNotification, 
  saveUnreadNotification,
  handlePushNotification
} from '../../redux/modules/notification/NotificationActions';

import {
  showNextTutorialPage,
  startTutorial,
  saveTutorialState,
  updateNextStepNumber,
  pauseTutorial,
  markUserAsOnboarded,
  resetTutorial
} from '../../redux/modules/User/TutorialActions';

import { saveRemoteMatches } from '../../actions/MeetActions';

// Assets
import Logo from '../../asset/header/logo.png';
import Activity from '../../asset/utils/activity.png';

// Styles
import { APP_DEEP_BLUE } from '../../styles';

// Utils
import { Logger } from '../../redux/middleware/utils/Logger';
import PlusButton from '../Common/Button/PlusButton';
import Tooltip from '../Tutorial/Tooltip';
import { svgMaskPath } from '../Tutorial/Utils';

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
      appState: AppState.currentState,
    };
    this.scrollToTop = this.scrollToTop.bind(this);
    this._renderScene = this._renderScene.bind(this);
    this.setTimer = this.setTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this._handleNotification = this._handleNotification.bind(this);
    this._notificationSubscription = undefined;
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.showTutorial && this.props.showTutorial === true) {
      console.log(`${DEBUG_KEY}: [ componentDidUpdate ]: tutorial start: `, this.props.nextStepNumber);
      this.props.start();
    }

    if (!_.isEqual(prevProps.user, this.props.user)) {
      console.log(`${DEBUG_KEY}: [ componentDidUpdate ]: prev user: `, prevProps.user);
      console.log(`${DEBUG_KEY}: [ componentDidUpdate ]: now user: `, this.props.user);
    }

    if (!_.isEqual(prevProps.user, this.props.user) && this.props.user.isOnBoarded === false) {
      setTimeout(() => {
        console.log(`${DEBUG_KEY}: [ componentDidUpdate ]: startTutorial: create_goal, page: home`);
        // TODO: @Jia Tutorial uncomment
        this.props.startTutorial('create_goal', 'home');
      }, 1100);
    }
  }


  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
    this._notificationSubscription = Notifications.addListener(this._handleNotification);

    // Set timer to fetch profile again if previously failed
    this.setTimer();
    this.props.checkIfNewlyCreated();

    this.props.copilotEvents.on('stop', () => {
      console.log(`${DEBUG_KEY}: [ componentDidMount ]: [ copilotEvents ] 
        tutorial stop. show next page. Next step number is: `, this.props.nextStepNumber);

      if (this.props.nextStepNumber === 1) {
        Actions.createGoalModal();
        this.props.pauseTutorial('create_goal', 'home', 1);
        setTimeout(() => {
          this.props.showNextTutorialPage('create_goal', 'home');
        }, 600);
        return;
      }

      if (this.props.nextStepNumber === 2) {
        this.props.updateNextStepNumber('create_goal', 'home', 2);
        this.props.showNextTutorialPage('create_goal', 'home');

        console.log(`${DEBUG_KEY}: [ componentDidMount ]: [ copilotEvents ]: markUserAsOnboarded`);
        this.props.markUserAsOnboarded();
        this.props.resetTutorial('create_goal');
      }
    });

    this.props.copilotEvents.on('stepChange', (step) => {
      const { order, name } = step;
      console.log(`${DEBUG_KEY}: [ onStepChange ]: step order: ${order}, step visible: ${name} `);
      // console.log(`${DEBUG_KEY}: [ componentDidMount ]: [ stepChange ]: step change to ${step.order}`);
      // TODO: if later we have more steps in between, change here
      // This is called before changing to a new step
      this.props.updateNextStepNumber('create_goal', 'home', order + 1);
    });
  }

  componentWillUnmount() {
    console.log(`${DEBUG_KEY}: [ componentWillUnmount ]`);

    // Remove tutorial listener
    this.props.copilotEvents.off('stop');
    this.props.copilotEvents.off('stepChange');

    AppState.removeEventListener('change', this.handleAppStateChange);
    this._notificationSubscription.remove();
    // Remove timer in case app crash
    this.stopTimer();
  }

  setTimer() {
    this.stopTimer(); // Clear the previous timer if there is one

    console.log(`${DEBUG_KEY}: [ Setting New Timer ] for fetching profile after 5s`);
    this.timer = setTimeout(() => {
      console.log(`${DEBUG_KEY}: [ Timer firing ] fetching profile again.`);
      this.props.fetchProfile(this.props.userId);
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

  _handleNotification(notification) {
    this.props.handlePushNotification(notification);
  }

  handleCreateGoal = () => {
    this.props.openCreateOverlay();
    // As we move the create option here, we no longer need to care about the tab
    Actions.createGoalButtonOverlay({ tab: 'mastermind', onClose: () => {
      this.props.closeCreateOverlay('mastermind');
    }});
  }

  handleAppStateChange = async (nextAppState) => {
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
      await this.props.saveUnreadNotification();
      await this.props.saveTutorialState();
      // await this.props.saveRemoteMatches();
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

  // style 1 currently used
  // buttonStyle={{
  //   selected: {
  //     backgroundColor: APP_DEEP_BLUE,
  //     tintColor: 'white',
  //     color: 'white',
  //     fontWeight: '700'
  //   },
  //   unselected: {
  //     backgroundColor: 'white',
  //     tintColor: '#616161',
  //     color: '#616161',
  //     fontWeight: '600'
  //   }
  // }}  

  // Style 2
  // buttonStyle={{
  //   selected: {
  //     backgroundColor: '#f8f8f8',
  //     tintColor: '#1998c9',
  //     color: '#1998c9',
  //     fontWeight: '600'
  //   },
  //   unselected: {
  //     backgroundColor: 'white',
  //     tintColor: '#696969',
  //     color: '#696969',
  //     fontWeight: '600'
  //   }
  // }}    
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
            backgroundColor: '#FCFCFC',
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
        return (
          <Mastermind 
            ref={m => (this.mastermind = m)} 
            tutorialText={this.props.tutorialText[0]}
            nextStepNumber={this.props.nextStepNumber}
            order={0}
            name='create_goal_home_0'
          />
        );

      case 'activity': 
        return <ActivityFeed ref={a => (this.activityFeed = a)} />;

      default: 
        return null;
    }
  };

  _keyExtractor = (item, index) => index;

  // Starting version 0.4.2, we change back to each screen has one plus button
  renderPlus() {
    return (
      <PlusButton
        plusActivated={this.props.showPlus}
        onPress={this.handleCreateGoal}
      />
    );
  }

  render() {
    /*
      TODO:
      1. use flatlist instead of scrollview
      2. assign key on for TabButton
    */
    const tutorialOn = this.props.nextStepNumber >= 2
      ? {
        rightIcon: {
          iconType: 'menu',
          tutorialText: this.props.tutorialText[1],
          order: 1,
          name: 'create_goal_home_menu'
        }
      } : undefined;
    return (
      <MenuProvider customStyles={{ backdrop: styles.backdrop }}>
        <View style={styles.homeContainerStyle}>
          <SearchBarHeader 
            rightIcon='menu' 
            tutorialOn={tutorialOn}
          />
          <TabView
            ref={ref => (this.tab = ref)}
            navigationState={this.state.navigationState}
            renderScene={this._renderScene}
            renderTabBar={this._renderHeader}
            onIndexChange={this._handleIndexChange}
          />
          {/* {this.renderPlus()} */}
        </View>
      </MenuProvider>
    );
  }
}

const mapStateToProps = state => {
  const { userId } = state.user;
  const { showingModal } = state.report;
  const { showPlus, data } = state.home.mastermind;
  const needRefreshMastermind = _.isEmpty(state.home.mastermind.data);
  const needRefreshActivity = _.isEmpty(state.home.activityfeed.data);
  const { user } = state.user;

  // Tutorial related
  const { create_goal } = state.tutorials;
  const { home } = create_goal;
  const { hasShown, showTutorial, tutorialText, nextStepNumber } = home;

  return {
    showingModal,
    showPlus,
    user,
    needRefreshActivity,
    needRefreshMastermind,
    userId,
    // Tutorial related
    hasShown,
    showTutorial,
    tutorialText,
    nextStepNumber
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
    right: 29,
    height: 54,
    width: 54,
    borderRadius: 28,
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

const HomeExplained = copilot({
  overlay: 'svg', // or 'view'
  animated: true, // or false
  stepNumberComponent: () => <View />,
  tooltipComponent: Tooltip,
  svgMaskPath: svgMaskPath
})(Home);

export default connect(
  mapStateToProps,
  {
    fetchAppUserProfile,
    homeSwitchTab,
    openCreateOverlay,
    /* Notification related */
    subscribeNotification,
    saveUnreadNotification,
    handlePushNotification,
    /* Feed related */
    refreshGoals,
    refreshFeed,
    fetchProfile,
    checkIfNewlyCreated,
    closeCreateOverlay,
    /* Tutorial related */
    showNextTutorialPage,
    startTutorial,
    saveTutorialState,
    updateNextStepNumber,
    pauseTutorial,
    markUserAsOnboarded,
    resetTutorial,
    /* Contact sync related */ 
    saveRemoteMatches
  },
  null,
  { withRef: true }
)(HomeExplained);
