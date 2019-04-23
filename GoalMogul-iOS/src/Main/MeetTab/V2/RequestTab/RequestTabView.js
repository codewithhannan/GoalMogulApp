/**
 * This view is a central hub for incoming and outgoing request for a user
 */
import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Text
} from 'react-native';
import { connect } from 'react-redux';
import { TabView, SceneMap } from 'react-native-tab-view';

// Components
import SearchBarHeader from '../../../Common/Header/SearchBarHeader';
import TabButtonGroup from '../../../Common/TabButtonGroup';
import IncomingRequestTabView from './IncomingRequestTabView';
import OutgoingRequestTabView from './OutgoingRequestTabView';

// actions
import {
  handleRefresh,
  requestsSelectTab,
} from '../../../../actions';

import {
  loadMoreRequest,
  handleRequestTabSwitchTab
} from '../../../../redux/modules/meet/MeetActions';

// Selectors
import {
  getOutgoingUserFromFriendship,
  getIncomingUserFromFriendship
} from '../../../../redux/modules/meet/selector';

// Styles
import {
  BACKGROUND_COLOR,
  APP_DEEP_BLUE
} from '../../../../styles';

const Tabs = [
  {
    name: 'Incoming',
    key: 'incoming'
  },
  {
    name: 'Outgoing',
    key: 'outgoing'
  }
];

class RequestTabView extends Component {
  handleIndexChange = index => {
    this.props.handleRequestTabSwitchTab(index);
  }

  renderScene = SceneMap({
    incoming: IncomingRequestTabView,
    outgoing: OutgoingRequestTabView,
  });

  renderHeader = props => {
    return (
      <TabButtonGroup 
        buttons={props} 
        noBorder
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

  render() {
    const modalTitle = 'Friend Requests';
    return (
      <View style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}>
        <SearchBarHeader backButton title={modalTitle} />
          <TabView
            navigationState={this.props.navigationState}
            renderScene={this.renderScene}
            renderTabBar={this.renderHeader}
            onIndexChange={this.handleIndexChange.bind(this)}
            useNativeDriver
          />
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { requests } = state.meet;
  const { navigationState } = requests;

  return {
    navigationState
  };
};

export default connect(
  mapStateToProps,
  {
    handleRefresh,
    loadMoreRequest,
    handleRequestTabSwitchTab
  }
)(RequestTabView);
