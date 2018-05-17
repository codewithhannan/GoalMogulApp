import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
import { TabViewAnimated, SceneMap } from 'react-native-tab-view';
import { connect } from 'react-redux';

/* Components */
import SearchBarHeader from '../Common/SearchBarHeader';
import ProfileSummaryCard from './ProfileSummaryCard';
import TabButtonGroup from '../Common/TabButtonGroup';

import MyGoals from './MyGoals';
import MyNeeds from './MyNeeds';
import MyPosts from './MyPosts';

/* Actions */
import {
  selectProfileTab
} from '../../actions';

const testData = {
  goal: {
    text: 'MY GOALS',
    number: '10'
  },
  post: {
    text: 'MY POSTS',
    number: '2'
  },
  need: {
    text: 'MY NEEDS',
    number: '21'
  }
};

class Profile extends Component {

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

  render() {
    return (
      <MenuProvider>
        <View style={styles.containerStyle}>
          <SearchBarHeader backButton rightIcon='menu' />
          <ProfileSummaryCard />
          <TabViewAnimated
            navigationState={this.props.navigationState}
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

const styles = {
  containerStyle: {
    flex: 1
  },
  tabContainerStyle: {
    display: 'flex',
    height: 35,
    flexDirection: 'row'
  }
};

const mapStateToProps = state => {
  const { selectedTab, navigationState } = state.profile;

  return {
    selectedTab,
    navigationState
  };
};

export default connect(
  mapStateToProps,
  {
    selectProfileTab
  }
)(Profile);
