import React, { Component } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text
} from 'react-native';
import { connect } from 'react-redux';

// Components
import RequestCard from './Requests/RequestCard';

// actions
import {
  handleRefresh,
  requestsSelectTab,
  meetOnLoadMore
} from '../../actions';

// Selectors
import {
  getOutgoingUserFromFriendship,
  getIncomingUserFromFriendship
} from '../../redux/modules/meet/selector';

// tab key
const key = 'requests';
const routes = {
  outgoing: 'requests.outgoing',
  incoming: 'requests.incoming'
};

const Tabs = [
  {
    name: 'Outgoing',
    key: 'outgoing'
  },
  {
    name: 'Incoming',
    key: 'incoming'
  }
];

const DEBUG_KEY = '[Component Requests]';

class Requests extends Component {

  selectTab = tabKey => {
    this.props.requestsSelectTab(tabKey);
  }

  handleRefresh = () => {
    const route = routes[this.props.selectedTab];
    console.log(`${DEBUG_KEY} Refreshing tab: `, route);
    this.props.handleRefresh(route);
  }

  handleOnLoadMore = () => {
    const route = [key, this.props.selectedTab];
    console.log(`${DEBUG_KEY} Loading more for tab: `, route);
    this.props.meetOnLoadMore(route);
  }

  _keyExtractor = (item) => item.friendshipId;

  renderItem = ({ item }) => <RequestCard item={item} type={this.props.selectedTab} />;

  renderTabs() {
    return Tabs.map((t, index) => {
      let buttonContainerStyle = { ...styles.buttonContainerStyle };
      let buttonTextStyle = { ...styles.buttonTextStyle };

      if (t.key === this.props.selectedTab) {
        buttonContainerStyle.backgroundColor = '#1379a7';
      } else {
        buttonContainerStyle.backgroundColor = '#1aa0dd';
      }
      return (
        <View style={buttonContainerStyle} key={index}>
          <TouchableOpacity onPress={this.selectTab.bind(this, t.key)}>
            <Text style={buttonTextStyle}>{t.name}</Text>
          </TouchableOpacity>
        </View>
      );
    });
  }

  render() {
    // console.log('data for requests are: ', this.props.data);
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row' }}>
          {this.renderTabs()}
        </View>
        <View style={{ flex: 1 }}>
          <FlatList
            data={this.props.data}
            renderItem={this.renderItem}
            keyExtractor={this._keyExtractor}
            onRefresh={this.handleRefresh.bind()}
            refreshing={this.props.refreshing}
            onEndReached={this.handleOnLoadMore}
            onEndReachedThreshold={0.5}
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
    refreshing
  };
};

export default connect(
  mapStateToProps,
  {
    handleRefresh,
    requestsSelectTab,
    meetOnLoadMore
  }
)(Requests);
