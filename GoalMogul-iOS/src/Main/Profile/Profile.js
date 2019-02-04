import React, { Component } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
import { TabView, SceneMap } from 'react-native-tab-view';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

/* Components */
import SearchBarHeader from '../Common/Header/SearchBarHeader';
import ProfileSummaryCard from './ProfileSummaryCard';
import TabButtonGroup from '../Common/TabButtonGroup';

import MyGoals from './MyGoals';
import MyNeeds from './MyNeeds';
import MyPosts from './MyPosts';

/* Actions */
import {
  selectProfileTab,
  closeCreateOverlay,
  openCreateOverlay
} from '../../actions';

/* Styles */
import { BACKGROUND_COLOR, APP_DEEP_BLUE } from '../../styles';

/* Assets */
import plus from '../../asset/utils/plus.png';

const DEBUG_KEY = '[ UI Profile ]';

class Profile extends Component {
  componentDidMount() {
    console.log(`${DEBUG_KEY}: mounting Profile`);
  }

  handleCreateGoal = () => {
    this.props.openCreateOverlay();
    // As we move the create option here, we no longer need to care about the tab
    Actions.createGoalButtonOverlay({ 
      tab: 'mastermind', 
      onCreate: () => this.props.openCreateOverlay(),
      onClose: () => this.props.closeCreateOverlay(),
      openProfile: false
    });
  }

  _handleIndexChange = (index) => {
    this.props.selectProfileTab(index);
  };

  _renderHeader = props => {
    return (
      <TabButtonGroup buttons={props} />
    );
  };

  _renderScene = SceneMap({
    goals: MyGoals,
    posts: MyPosts,
    needs: MyNeeds,
  });

  renderPlus() {
    if (this.props.showPlus && this.props.isSelf) {
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
    return (
      <MenuProvider customStyles={{ backdrop: styles.backdrop }}>
        <View style={styles.containerStyle}>
          <SearchBarHeader backButton setting />
          <ProfileSummaryCard />
          <TabView
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
    backgroundColor: BACKGROUND_COLOR
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

const mapStateToProps = state => {
  const { selectedTab, navigationState, user, showPlus } = state.profile;
  const appUser = state.user.user;

  return {
    selectedTab,
    navigationState,
    isSelf: user && appUser && user._id === appUser._id,
    showPlus
  };
};

export default connect(
  mapStateToProps,
  {
    selectProfileTab,
    closeCreateOverlay,
    openCreateOverlay
  }
)(Profile);
