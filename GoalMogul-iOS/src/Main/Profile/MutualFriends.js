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
import FriendCard from '../MeetTab/Friends/FriendCard';

// actions
import { fetchMutualFriends } from '../../actions';

// Selectors
import { 
  getUserData,
  getUserDataByPageId
} from '../../redux/modules/User/Selector';

class MutualFriends extends Component {
  state = {
    modalVisible: false
  }

  componentDidMount() {
    this.openModal();
    if (this.props.userId) {
      this.props.fetchMutualFriends(this.props.userId, true);
    }
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

  renderItem = (props) => {
    const { item } = props;
    return <FriendCard item={item} />;
  }

  render() {
    const emptyText = this.props.isSelf ? 'You have no friends.' : 'You have no mutual friends.';
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.modalVisible}
      >
        <ModalHeader
          title={`${this.props.user.name}\'s Friends`}
          actionText=''
          onCancel={() => {
            this.closeModal();
            Actions.pop();
          }}
        />
        <View style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
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
        </View>
      </Modal>
    );
  }
}

const mapStateToProps = (state, props) => {
  const { userId } = props;
  const userObject = getUserData(state, userId, '');
  const { user, mutualFriends } = userObject;
  const { data, loading, count } = mutualFriends;

  const isSelf = userId.toString() === state.user.userId.toString();

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
