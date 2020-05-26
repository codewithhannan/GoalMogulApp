/**
 * This view is a central hub for incoming and outgoing request for a user
 */
import React, { Component } from 'react';
import { View } from 'react-native';
import { SceneMap, TabView } from 'react-native-tab-view';
import { connect } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
// actions
import { handleRefresh } from '../../../../actions';
import { handleRequestTabSwitchTab, loadMoreRequest } from '../../../../redux/modules/meet/MeetActions';
// Styles
import { GM_BLUE, FONT_FAMILY_1  } from '../../../../styles';
// Components
import SearchBarHeader from '../../../Common/Header/SearchBarHeader';
import TabButtonGroup from '../../../Common/TabButtonGroup';
import IncomingRequestTabView from './IncomingRequestTabView';
import OutgoingRequestTabView from './OutgoingRequestTabView';
import { SearchBar } from 'react-native-elements';
import { SearchIcon } from '../../../../Utils/Icons';

class RequestTabView extends Component {
  handleIndexChange = index => {
    this.props.handleRequestTabSwitchTab(index);
  }

  handleSearchUpdate = () => {

  }

  renderScene = SceneMap({
    incoming: IncomingRequestTabView,
    outgoing: OutgoingRequestTabView,
  });

  renderHeader = props => {
    return (
      <View style={{ padding: 16, backgroundColor: "white", marginBottom: 8 }}>
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
        <SearchBar 
            ref={searchBar => this.searchBar = searchBar}
            platform="default"
            clearIcon={<MaterialIcons
                name="clear"
                color="#777"
                size={21}
            />}
            containerStyle={{
                backgroundColor: 'transparent',
                padding: 0,
                margin: 0,
                marginTop: 16,
                borderTopWidth: 0,
                borderBottomWidth: 0
            }}
            inputContainerStyle={{ backgroundColor: "white", borderRadius: 3, borderColor: '#E0E0E0', borderWidth: 1, minHeight: 36, borderBottomWidth: 1 }}
            inputStyle={{ fontSize: 16, fontFamily: FONT_FAMILY_1, minHeight: 36 }}
            placeholder="Search"
            onChangeText={this.handleSearchUpdate.bind(this)}
            onClear={this.handleSearchUpdate.bind(this)}
            searchIcon={<SearchIcon 
                iconContainerStyle={{ marginBottom: 3, marginTop: 1, marginLeft: 6 }} 
                iconStyle={{ tintColor: '#777', height: 15, width: 15 }}
                />}
            value={this.props.searchQuery}
            lightTheme={true}
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
    backgroundColor: '#fafafa',
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
