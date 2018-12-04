import React from 'react';
import {
  View
} from 'react-native';
import { connect } from 'react-redux';
import { TabView, SceneMap } from 'react-native-tab-view';
import { MenuProvider } from 'react-native-popup-menu';

/* Components */
import TabButtonGroup from '../Common/TabButtonGroup';
import SearchBarHeader from '../Common/Header/SearchBarHeader';
import ChatRoomTab from './ChatRoom/ChatRoomTab';

// Actions
import {
  chatTabSelectTab
} from '../../redux/modules/chat/ChatTabActions';

class ChatTab extends React.Component {

  _renderHeader = props => {
    return (
      <TabButtonGroup buttons={props} />
    );
  };

  _renderScene = SceneMap({
    messages: ChatRoomTab,
    chatrooms: ChatRoomTab,
  });

  render() {
    return (
      <MenuProvider customStyles={{ backdrop: styles.backdrop }}>
        <View style={styles.homeContainerStyle}>
          <SearchBarHeader rightIcon='menu' />
          <TabView
            navigationState={this.props.navigationState}
            renderScene={this._renderScene}
            renderTabBar={this._renderHeader}
            onIndexChange={this.props.chatTabSelectTab}
            useNativeDriver
          />
        </View>
      </MenuProvider>
    );
  }
}

const mapStateToProps = state => {
  const { navigationState } = state.chat;

  return {
    navigationState
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
  }
};

export default connect(
  mapStateToProps,
  {
    chatTabSelectTab
  }
)(ChatTab);
