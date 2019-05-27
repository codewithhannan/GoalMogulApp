import React, { Component } from 'react';
import { View, Animated } from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
import { TabView, SceneMap } from 'react-native-tab-view';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Constants } from 'expo';

/* Components */
import SearchBarHeader from '../Common/Header/SearchBarHeader';
import ProfileDetailCard from './ProfileCard/ProfileDetailCard';
import ProfileSummaryCard from './ProfileSummaryCard';
import TabButtonGroup from '../Common/TabButtonGroup';

import MyGoals from './MyGoals';
import MyNeeds from './MyNeeds';
import MyPosts from './MyPosts';
import About from './About';

/* Actions */
import {
  selectProfileTab,
  closeCreateOverlay,
  openCreateOverlay
} from '../../actions';

import {
  closeProfile
} from '../../actions/ProfileActions';

/* Styles */
import { BACKGROUND_COLOR, APP_DEEP_BLUE } from '../../styles';

/* Assets */
import plus from '../../asset/utils/plus.png';

// Selector
import {
  getUserDataByPageId,
  getUserData
} from '../../redux/modules/User/Selector';
import PlusButton from '../Common/Button/PlusButton';
import { INITIAL_USER_PAGE } from '../../redux/modules/User/Users';

const DEBUG_KEY = '[ UI Profile ]';
const SEARCHBAR_HEIGHT = 70;
const COLLAPSED_HEIGHT = 30 + SEARCHBAR_HEIGHT;
const HEADER_HEIGHT = 284 + 30 + SEARCHBAR_HEIGHT;
const INFO_CARD_HEIGHT = 284;
const DEFAULT_TRANSITION_TIME = 120;

class Profile extends Component {
  constructor(props) {
    super(props);
    this._handleIndexChange = this._handleIndexChange.bind(this);
    this._renderScene = this._renderScene.bind(this);
    this._renderHeader = this._renderHeader.bind(this);
    this.handleOnBackPress = this.handleOnBackPress.bind(this);
    this.state = {
      infoCardHeight: new Animated.Value(INFO_CARD_HEIGHT), // Initial info card height
      infoCardOpacity: new Animated.Value(1)
    }
  }

  componentDidMount() {
    console.log(`${DEBUG_KEY}: mounting Profile with pageId: ${this.props.pageId}`);
  }

  componentWillUnmount() {
    const { pageId, userId } = this.props;
    this.props.closeProfile(userId, pageId);
  }

  handleOnBackPress = () => {
    Actions.pop();
  }

  handleCreateGoal = () => {
    const { userId, pageId } = this.props;
    this.props.openCreateOverlay(userId, pageId);
    // As we move the create option here, we no longer need to care about the tab
    Actions.createGoalButtonOverlay({ 
      tab: 'mastermind', 
      onCreate: () => this.props.openCreateOverlay(userId, pageId),
      onClose: () => this.props.closeCreateOverlay(userId, pageId),
      openProfile: false,
      userId,
      pageId
    });
  }

  _handleIndexChange = (index) => {
    const { pageId, userId, navigationState } = this.props;
    const { routes } = navigationState;

    if (routes[index].key === 'about') {
      // Animated to hide the infoCard if not on about tab
      Animated.parallel([
        Animated.timing(this.state.infoCardHeight, {
          duration: DEFAULT_TRANSITION_TIME,
          toValue: INFO_CARD_HEIGHT,
        }),
        Animated.timing(this.state.infoCardOpacity, {
          duration: DEFAULT_TRANSITION_TIME,
          toValue: 1,
        }),
      ]).start();
    } else {
      // Animated to hide the infoCard if not on about tab
      Animated.parallel([
        Animated.timing(this.state.infoCardHeight, {
          duration: DEFAULT_TRANSITION_TIME,
          toValue: 0,
        }),
        Animated.timing(this.state.infoCardOpacity, {
          duration: DEFAULT_TRANSITION_TIME,
          toValue: 0,
        }),
      ]).start();
    }

    // Update the reducer for index selected
    this.props.selectProfileTab(index, userId, pageId);
  };

  _renderHeader = (props) => {
    return (
      <TabButtonGroup 
        buttons={props}
        onBorder={this.props.selectedTab !== 'about'}
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
          <MyGoals 
            pageId={this.props.pageId} 
            userId={this.props.userId}
          />
        );
      case 'posts':
        return (
          <MyPosts 
            pageId={this.props.pageId} 
            userId={this.props.userId} 
          />
        );
      case 'needs':
        return (
          <MyNeeds 
            pageId={this.props.pageId} 
            userId={this.props.userId} 
          />
        );
      case 'about':
        return (
          <About 
            pageId={this.props.pageId} 
            userId={this.props.userId} 
          />
        );
      default:
        return null;
    }
  }

  renderPlus() {
    if (!this.props.isSelf) {
      return null;
    }
    return (<PlusButton
      onPress={this.handleCreateGoal}
      plusActivated={this.props.showPlus}
    />);
  }

  renderUserInfo({ userId, pageId }) {
    return (
      <Animated.View
        style={{ 
          height: this.state.infoCardHeight,
          opacity: this.state.infoCardOpacity
        }}
      >
        <ProfileDetailCard pageId={pageId} userId={userId} />
      </Animated.View>
    );
  }

  render() {
    const { userId, pageId } = this.props;
    return (
      <MenuProvider customStyles={{ backdrop: styles.backdrop }}>
        <View style={styles.containerStyle}>
          <SearchBarHeader 
            backButton 
            setting 
            onBackPress={this.handleOnBackPress} 
            userId={userId}  
          />
          {/* <ProfileSummaryCard pageId={this.props.pageId} userId={this.props.userId} /> */}
          {this.renderUserInfo({ userId, pageId })}
          <TabView
            style={{ flex: 1 }}
            navigationState={this.props.navigationState}
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

const styles = {
  containerStyle: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  tabContainerStyle: {
    display: 'flex',
    height: 35,
    flexDirection: 'row'
  },
  backdrop: {
    backgroundColor: 'gray',
    opacity: 0.7,
  },
  iconContainerStyle: {
    position: 'absolute',
    bottom: 20,
    right: 29,
    height: 54,
    width: 54,
    borderRadius: 27,
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

const mapStateToProps = (state, props) => {
  const { userId, pageId } = props;

  const user = getUserData(state, userId, 'user');
  let userPage = getUserDataByPageId(state, userId, pageId, '');
  if (!userPage || _.isEmpty(userPage)) {
    userPage = _.cloneDeep(INITIAL_USER_PAGE);
  }
  const { selectedTab, navigationState, showPlus } = userPage;
  
  const appUser = state.user.user;

  return {
    selectedTab,
    navigationState,
    isSelf: user && appUser && userId === appUser._id,
    showPlus
  };
};

export default connect(
  mapStateToProps,
  {
    selectProfileTab,
    closeCreateOverlay,
    openCreateOverlay,
    closeProfile
  }
)(Profile);
