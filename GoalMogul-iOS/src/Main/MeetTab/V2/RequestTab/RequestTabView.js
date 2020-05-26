/**
 * This view is a central hub for incoming and outgoing request for a user
 */
import React, { Component } from 'react';
import { View } from 'react-native';
import { SceneMap, TabView } from 'react-native-tab-view';
import { connect } from 'react-redux';
// actions
import { handleRefresh } from '../../../../actions';
import { handleRequestTabSwitchTab, loadMoreRequest } from '../../../../redux/modules/meet/MeetActions';
// Styles
import { APP_DEEP_BLUE, BACKGROUND_COLOR, GM_BLUE } from '../../../../styles';
// Components
import SearchBarHeader from '../../../Common/Header/SearchBarHeader';
import TabButtonGroup from '../../../Common/TabButtonGroup';
import IncomingRequestTabView from './IncomingRequestTabView';
import OutgoingRequestTabView from './OutgoingRequestTabView';

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
      <View style={{ padding: 16, backgroundColor: "white" }}>
        <TabButtonGroup 
          buttons={props} 
          noBorder
          buttonStyle={{
            selected: {
              backgroundColor: GM_BLUE,
              tintColor: 'white',
              color: 'white',
              fontWeight: '700'
            },
            unselected: {
              backgroundColor: '#F2F2F2',
              tintColor: '#616161',
              color: '#616161',
              fontWeight: '600'
            }
          }}
          borderRadius={3}
        />
      </View>
    );
  };

  render() {
    const modalTitle = 'Invitations';
    return (
      <View style={styles.containerStyle}>
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

const styles = {
  containerStyle: {
    flex: 1, 
    backgroundColor: BACKGROUND_COLOR,
    backgroundColor: '#f8f8f8',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.3,
    // shadowRadius: 6,
  },
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
