import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  FlatList
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

/* Components */
import SearchBarHeader from '../../../Common/SearchBarHeader';
import FriendCard from './FriendCard';

// Actions
import { getBlockedUsers } from '../../../../actions';

const DEBUG_KEY = '[ Component FriendsBlocked ]';

const testData = [
  {
    name: 'Qiongjia Xu',
    status: 'blocked',
    _id: '1928301970191'
  },
  {
    name: 'David Zheng alsd;jafl;ksjdfl;kajsl;dkfjl;kjl;kjl;j;lkj',
    status: 'friend',
    _id: '1928301970192'
  },
  {
    name: 'Alice Yang',
    status: 'blocked',
    _id: '1928301970193'
  }
];

class FriendsBlocked extends Component {
  componentWillMount() {
    this.props.getBlockedUsers();
  }

  handleOnLoadMore = () => {
    console.log(`${DEBUG_KEY} load more`);
  }

  handleRefresh = () => {
    console.log(`${DEBUG_KEY} refresh`);
  }

  _keyExtractor = (item) => item._id;

  renderItem = (item) => <FriendCard item={item} />;

  render() {
    return (
      <View style={{ flex: 1 }}>
        <SearchBarHeader
          backButton
          rightIcon='empty'
          title="Block"
          onBackPress={() => Actions.pop()}
        />
        <FlatList
          data={testData}
          renderItem={this.renderItem}
          keyExtractor={this._keyExtractor}
          onRefresh={this.handleRefresh.bind()}
          refreshing={this.props.refreshing}
          onEndReached={this.handleOnLoadMore}
          onEndReachedThreshold={0.5}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { block } = state.setting;
  const { refreshing } = block;

  return {
    block,
    refreshing
  };
};

export default connect(mapStateToProps, {
  getBlockedUsers
})(FriendsBlocked);
