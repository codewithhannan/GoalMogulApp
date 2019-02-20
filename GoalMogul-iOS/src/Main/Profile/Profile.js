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

const DEBUG_KEY = '[ UI Profile ]';

class Profile extends Component {
  constructor(props) {
    super(props);
    this._handleIndexChange = this._handleIndexChange.bind(this);
    this.handleOnBackPress = this.handleOnBackPress.bind(this);
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
    const { pageId, userId } = this.props;
    this.props.selectProfileTab(index, userId, pageId);
  };

  _renderHeader = props => {
    return (
      <TabButtonGroup buttons={props} />
    );
  };

  _renderScene = ({ route }) => {
    switch (route.key) {
      case 'goals':
        return <MyGoals pageId={this.props.pageId} userId={this.props.userId} />;
      case 'posts':
        return <MyPosts pageId={this.props.pageId} userId={this.props.userId} />;
      case 'needs':
        return <MyNeeds pageId={this.props.pageId} userId={this.props.userId} />;
      default:
        return null;
    }
  }

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
          <SearchBarHeader 
            backButton 
            setting 
            onBackPress={this.handleOnBackPress} 
            userId={this.props.userId}  
          />
          <ProfileSummaryCard pageId={this.props.pageId} userId={this.props.userId} />
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

const mapStateToProps = (state, props) => {
  const { userId, pageId } = props;

  const user = getUserData(state, userId, 'user');
  const userPage = getUserDataByPageId(state, userId, pageId, '');
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
