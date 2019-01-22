import React, { Component } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import { TabView, SceneMap } from 'react-native-tab-view';
import { MenuProvider } from 'react-native-popup-menu';
import { Actions } from 'react-native-router-flux';

/* Components */
import TabButtonGroup from '../Common/TabButtonGroup';
import SearchBarHeader from '../Common/Header/SearchBarHeader';
import Report from '../Report/Report';

import Mastermind from './Mastermind';
import ActivityFeed from './ActivityFeed';

// Actions
import { homeSwitchTab } from '../../actions';
import {
  openCreateOverlay
} from '../../redux/modules/home/mastermind/actions';
import {
  subscribeNotification
} from '../../redux/modules/notification/NotificationActions';

// Assets
import Logo from '../../asset/header/logo.png';
import Activity from '../../asset/utils/activity.png';
import plus from '../../asset/utils/plus.png';

// Styles
import { APP_DEEP_BLUE, APP_BLUE } from '../../styles';

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

  handleCreateGoal = () => {
    this.props.openCreateOverlay();
    // As we move the create option here, we no longer need to care about the tab
    Actions.createGoalButtonOverlay({ tab: 'mastermind' });
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

  _renderScene = SceneMap({
    goals: Mastermind,
    activity: ActivityFeed,
  });

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
  const { showPlus } = state.home.mastermind;

  return {
    showingModal,
    showPlus
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
    homeSwitchTab,
    openCreateOverlay,
    subscribeNotification
  }
)(Home);
