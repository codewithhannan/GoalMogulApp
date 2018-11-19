import React, { Component } from 'react';
import {
  View,
  Modal,
  FlatList
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

// Component
import ModalHeader from '../Common/Header/ModalHeader';
import EmptyResult from '../Common/Text/EmptyResult';

// actions
import { fetchMutualFriends } from '../../actions';

class MutualFriends extends Component {
  state = {
    modalVisible: false
  }

  componentWillMount() {
    this.openModal();
  }

  openModal() {
    this.setState({ modalVisible: true });
  }

  closeModal() {
    this.setState({ modalVisible: false });
  }

  handleRefresh = () => {
    this.props.fetchMutualFriends(this.props.userId, true);
  }

  handleOnLoadMore = () => {
    this.props.fetchMutualFriends(this.props.userId, false);
  }

  _keyExtractor = (item) => item._id;

  render() {
    const emptyText = this.props.isSelf ? 'You have no friends.' : 'You have no mutual friends.';
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.modalVisible}
      >
        <ModalHeader
          title={`${this.props.user.name}\'s friends`}
          actionText=''
          onCancel={() => {
            this.closeModal();
            Actions.pop();
          }}
        />
        <FlatList
          data={this.props.data}
          renderItem={this.renderItem}
          keyExtractor={this._keyExtractor}
          onRefresh={this.handleRefresh.bind()}
          refreshing={this.props.loading}
          onEndReached={this.handleOnLoadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            this.props.loading ? '' :
            <EmptyResult text={emptyText} />
          }
        />
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  const { mutualFriends, userId, user } = state.profile;
  const { data, loading, count } = mutualFriends;
  const isSelf = state.profile.userId.toString() === state.user.userId.toString();

  return {
    count,
    data,
    loading,
    userId,
    isSelf,
    user
  };
};

export default connect(
  mapStateToProps,
  {
    fetchMutualFriends
  }
)(MutualFriends);
