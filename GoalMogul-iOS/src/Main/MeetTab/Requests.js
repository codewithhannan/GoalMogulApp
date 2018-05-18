import React, { Component } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text
} from 'react-native';
import { connect } from 'react-redux';

// Components
import MeetCard from './MeetCard';

// actions
import {
  handleRefresh,
  requestsSelectTab,
} from '../../actions';

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

/* TODO: delete the test data */
const testDataOutgoing = [
  {
    id: 12,
    name: 'Jia Zeng',
    profile: {
      occupation: 'Student'
    }
  }
];

class Requests extends Component {

  onLoadMore = () => {
    console.log('loading more data for tab: ', routes[this.props.selectedTab]);
  }

  selectTab = tabKey => {
    this.props.requestsSelectTab(tabKey);
  }

  handleRefresh = () => {
    const route = routes[this.props.selectedTab];
    console.log('Refreshing tab: ', route);
    this.props.handleRefresh(route);
  }

  _keyExtractor = (item) => item.id;

  renderItem = ({ item }) => {
    return <MeetCard item={item} />;
  }

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
          />
        </View>
        {/*

          onEndReached={this.onLoadMore}
        */}
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
        newOutgoing.data = testDataOutgoing;
        return newOutgoing;
        // return suggested
      }

      case 'incoming':
        return incoming;
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
    requestsSelectTab
  }
)(Requests);
