import React, { Component } from 'react';
import { View } from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
import { TabViewAnimated, SceneMap } from 'react-native-tab-view';
import { connect } from 'react-redux';

/* Components */
import SearchBarHeader from '../Common/Header/SearchBarHeader';
import ProfileSummaryCard from './ProfileSummaryCard';
import TabButtonGroup from '../Common/TabButtonGroup';

import MyGoals from './MyGoals';
import MyNeeds from './MyNeeds';
import MyPosts from './MyPosts';

/* Actions */
import {
  selectProfileTab
} from '../../actions';

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
      <MenuProvider customStyles={{ backdrop: styles.backdrop }}>
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
  },
  backdrop: {
    backgroundColor: 'gray',
    opacity: 0.7,
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
