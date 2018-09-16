import React from 'react';
import {
  View,
  Modal,
  FlatList
} from 'react-native';
import { connect } from 'react-redux';
import { MenuProvider } from 'react-native-popup-menu';

// Actions
import {
  refreshTribe,
  loadMoreTribe,
  closeMyTribeTab
} from '../../../redux/modules/tribe/MyTribeTabActions';

// Components
import MyTribeCard from './MyTribeCard';
import ModalHeader from '../../Common/Header/ModalHeader';
import MyTribeFilterBar from './MyTribeFilterBar';

class MyTribeTab extends React.Component {
  _keyExtractor = (item) => item._id;

  handleOnRefresh = () => this.props.refreshTribe();

  handleOnLoadMore = () => this.props.loadMoreTribe();

  renderItem = ({ item }) => {
    return <MyTribeCard item={item} />;
  }

  renderListHeader() {
    return (
      <MyTribeFilterBar />
    );
  }
  // ListHeaderComponent={this.renderListHeader()}

  render() {
    return (
      <Modal style={{ flex: 1 }} animationType='fade'>
        <MenuProvider customStyles={{ backdrop: styles.backdrop }}>
          <ModalHeader
            title='My Tribes'
            actionText='Close'
            onCancel={() => console.log('User closed tribe modal')}
            onAction={() => this.props.closeMyTribeTab()}
          />
          <FlatList
            data={this.props.data}
            renderItem={this.renderItem}
            numColumns={1}
            keyExtractor={this._keyExtractor}
            refreshing={this.props.loading}
            onRefresh={this.handleOnRefresh}
            onEndReached={this.handleOnLoadMore}
            ListHeaderComponent={this.renderListHeader()}
            onEndThreshold={0}
          />
        </MenuProvider>
      </Modal>

    );
  }
}

const mapStateToProps = state => {
  const { showModal } = state.myTribeTab;

  const loading = false;
  const data = [
    {
      _id: '123170293817024',
      created: '',
      name: 'SoHo Artists',
      membersCanInvite: true,
      isPubliclyVisible: true,
      membershipLimit: 100,
      description: 'This group is for all artists currently living in or working out of ' +
      'SoHo, NY. We exchange ideas, get feedback from each other and help each other ' +
      'organize exhiits for our work!',
      picture: '',
      members: [
        {
          _id: '1203798700',
          name: 'Jia Zeng',
          profile: {
            image: undefined
          }
        }
      ],
      memberCount: 10,
    },
    {
      _id: '123170293817023',
      created: '',
      name: 'Comic fans',
      membersCanInvite: true,
      isPubliclyVisible: true,
      membershipLimit: 20,
      description: 'This group is dedicated to the fan of comics in LA!',
      picture: '',
      members: [
        {
          _id: '1203798705',
          name: 'Super Andy',
          profile: {
            image: undefined
          }
        }
      ],
      memberCount: 19,
    }
  ];

  return {
    data,
    loading,
    showModal
  };
};

const styles = {
  backdrop: {
    backgroundColor: 'gray',
    opacity: 0.5,
  }
};

export default connect(
  mapStateToProps,
  {
    refreshTribe,
    loadMoreTribe,
    closeMyTribeTab
  }
)(MyTribeTab);
