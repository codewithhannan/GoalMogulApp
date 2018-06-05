import React, { Component } from 'react';
import {
  View,
  Modal,
  FlatList
} from 'react-native';
import { connect } from 'react-redux';

import SearchBarHeader from '../Common/Header/SearchBarHeader';

class MutualFriends extends Component {

  handleRefresh = () => {

  }

  handleOnLoadMore = () => {

  }

  _keyExtractor = (item) => item._id;

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.modalVisible}
        onRequestClose={() => {
          alert('Modal has been closed.');
        }}
      >
        <SearchBarHeader />
        <FlatList
          data={this.props.data}
          renderItem={this.renderItem}
          keyExtractor={this._keyExtractor}
          onRefresh={this.handleRefresh.bind()}
          refreshing={this.props.refreshing}
          onEndReached={this.handleOnLoadMore}
          onEndReachedThreshold={0.5}
        />
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  const { mutualFriends } = state.profile;

  return {
    mutualFriends,
    data: mutualFriends.data
  };
};

export default connect(
  mapStateToProps,
  null
)(MutualFriends);
