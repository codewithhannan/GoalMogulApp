/**
 * This view is a central hub for incoming and outgoing request for a user
 */
import React, { Component } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text
} from 'react-native';
import { connect } from 'react-redux';

// Components
import FriendRequestCardView from '../FriendRequestCardView';
import SearchBarHeader from '../../../Common/Header/SearchBarHeader';

// actions
import {
  handleRefresh,
  requestsSelectTab,
} from '../../../../actions';

import {
  loadMoreRequest
} from '../../../../redux/modules/meet/MeetActions';

// Selectors
import {
  getOutgoingUserFromFriendship,
  getIncomingUserFromFriendship
} from '../../../../redux/modules/meet/selector';

// Styles
import {
  BACKGROUND_COLOR
} from '../../../../styles';

// Test Data
import { testFriendRequests } from '../../../../Test/TestObjects';

// tab key
const routes = {
  outgoing: 'requests.outgoing',
  incoming: 'requests.incoming'
};

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

const DEBUG_KEY = '[Component Requests]';

class RequestTabView extends Component {
  componentWillMount() {
    this.props.handleRefresh('requests.incoming');
    this.props.handleRefresh('requests.outgoing');
  }

  selectTab = tabKey => {
    this.props.requestsSelectTab(tabKey);
  }

  handleRefresh = () => {
    const route = routes[this.props.selectedTab];
    console.log(`${DEBUG_KEY} Refreshing tab: `, route);
    this.props.handleRefresh(route);
  }

  handleOnLoadMore = () => {
    const route = routes[this.props.selectedTab];
    this.props.loadMoreRequest(route);
  }

  keyExtractor = (item) => item._id;

  renderItem = ({ item }) => <FriendRequestCardView item={item} />;

  renderTabs() {
    return Tabs.map((t, index) => {
      let buttonContainerStyle = { ...styles.buttonContainerStyle };
      let buttonTextStyle = { ...styles.buttonTextStyle };

      if (t.key === this.props.selectedTab) {
        buttonContainerStyle.backgroundColor = '#1aa0dd';
      } else {
        buttonContainerStyle.backgroundColor = 'white';
        buttonTextStyle.color = '#696969';
      }
      return (
        <View style={buttonContainerStyle} key={index}>
          <TouchableOpacity activeOpacity={0.85} onPress={this.selectTab.bind(this, t.key)}>
            <Text style={buttonTextStyle}>{t.name}</Text>
          </TouchableOpacity>
        </View>
      );
    });
  }

  render() {
    const modalTitle = 'Friend Requests';
    return (
      <View style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}>
        <SearchBarHeader backButton title={modalTitle} />
        <View style={{ flexDirection: 'row' }}>
          {this.renderTabs()}
        </View>
        <View style={{ flex: 1 }}>
          <FlatList
            data={[...testFriendRequests, ...this.props.data]}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
            onRefresh={this.handleRefresh.bind(this)}
            refreshing={this.props.refreshing}
            onEndReached={this.handleOnLoadMore}
            onEndReachedThreshold={0}
          />
        </View>
      </View>
    );
  }
}

const styles = {
  buttonContainerStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonTextStyle: {
    color: '#ffffff',
    padding: 10,
    fontWeight: '700'
  }
};

const mapStateToProps = state => {
  const { requests } = state.meet;
  const { outgoing, incoming, selectedTab } = requests;
  const { user } = state.user;

  const tab = ((id) => {
    switch (id) {
      case 'outgoing': {
        let newOutgoing = { ...outgoing };
        newOutgoing.data = getOutgoingUserFromFriendship(state);
        return newOutgoing;
        // return suggested
      }

      case 'incoming': {
        let newIncoming = { ...incoming };
        newIncoming.data = getIncomingUserFromFriendship(state);
        return newIncoming;
      }

      default:
        return outgoing;
    }
  })(selectedTab);

  const { data, refreshing } = tab;

  return {
    selectedTab,
    requests,
    data,
    tab,
    refreshing,
    user
  };
};

export default connect(
  mapStateToProps,
  {
    handleRefresh,
    requestsSelectTab,
    loadMoreRequest
  }
)(RequestTabView);
