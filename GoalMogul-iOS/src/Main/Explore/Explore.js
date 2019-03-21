import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { TabView, SceneMap } from 'react-native-tab-view';
import { MenuProvider } from 'react-native-popup-menu';

/* Components */
import TabButtonGroup from '../Common/TabButtonGroup';
import SearchBarHeader from '../Common/Header/SearchBarHeader';

import TribeTab from './TribeTab';
import EventTab from './EventTab';
import PeopleTab from './People/PeopleTab';

// Actions
import { exploreSelectTab } from '../../redux/modules/explore/ExploreActions';

// Assets
import TribeIcon from '../../asset/explore/tribe.png';
import EventIcon from '../../asset/suggestion/event.png';

const TabIconMap = {
  events: {
    iconSource: EventIcon,
    iconStyle: {
      height: 17,
      width: 17
    }
  },
  tribes: {
    iconSource: TribeIcon,
    iconStyle: {
      height: 15,
      width: 15
    }
  }
};

class Explore extends Component {
  _renderHeader = props => {
    return (
      <TabButtonGroup buttons={props} tabIconMap={TabIconMap} />
    );
  };

  _renderScene = SceneMap({
    tribes: TribeTab,
    events: EventTab,
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
          <TabView
            navigationState={this.props.navigationState}
            renderScene={this._renderScene}
            renderTabBar={this._renderHeader}
            onIndexChange={this.props.exploreSelectTab}
            useNativeDriver
          />
        </View>
      </MenuProvider>
    );
  }
}

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

const mapStateToProps = state => {
  const { navigationState } = state.explore;

  return {
    navigationState
  };
};

export default connect(
  mapStateToProps,
  {
    exploreSelectTab
  }
)(Explore);
