import React, { Component } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

/* Components */
import SearchBarHeader from '../../../Common/Header/SearchBarHeader';
import FriendCard from './FriendCard';
import EmptyResult from '../../../Common/Text/EmptyResult';

// Actions
import { getBlockedUsers } from '../../../../actions';

// selectors
import { getBlockees } from '../../../../redux/modules/setting/selector';

const DEBUG_KEY = '[ Component FriendsBlocked ]';

class FriendsBlocked extends Component {
  constructor(props) {
    super(props);
    this.handleRefresh = this.handleRefresh.bind(this);
  }

  componentDidMount() {
    // Refresh on mounting
    this.handleRefresh();
  }

  handleOnLoadMore = () => {
    console.log(`${DEBUG_KEY} load more`);
    this.props.getBlockedUsers(false);
  }

  handleRefresh = () => {
    console.log(`${DEBUG_KEY} refresh`);
    this.props.getBlockedUsers(true);
  }

  _keyExtractor = (item) => item.blockId;

  renderItem = ({ item }) => <FriendCard item={item} />;

  renderListFooter() {
    const { loading, data } = this.props;
    if (loading && data.length >= 10) {
      return (
        <View
          style={{
            paddingVertical: 20
          }}
        >
          <ActivityIndicator size='small' />
        </View>
      );
    }
  }

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
          data={this.props.data}
          renderItem={this.renderItem}
          keyExtractor={this._keyExtractor}
          onRefresh={this.handleRefresh.bind()}
          refreshing={this.props.refreshing}
          ListEmptyComponent={
            this.props.refreshing ? null :
            <EmptyResult text={'No blocked users'} textStyle={{ paddingTop: 200 }} />
          }
          ListFooterComponent={this.renderListFooter()}
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
    refreshing,
    data: getBlockees(state)
  };
};

export default connect(mapStateToProps, {
  getBlockedUsers
})(FriendsBlocked);
