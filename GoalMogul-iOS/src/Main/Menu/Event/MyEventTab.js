import React from 'react';
import {
  View,
  Modal,
  FlatList
} from 'react-native';
import { connect } from 'react-redux';

// Actions
import {
  refreshEvent,
  loadMoreEvent,
  closeMyEventTab
} from '../../../redux/modules/event/MyEventTabActions';

// Components
import MyEventCard from './MyEventCard';
import ModalHeader from '../../Common/Header/ModalHeader';

class MyEventTab extends React.Component {

  _keyExtractor = (item) => item._id;

  handleOnRefresh = () => this.props.refreshEvent();

  handleOnLoadMore = () => this.props.loadMoreEvent();

  renderItem = ({ item }) => {
    return <MyEventCard item={item} />;
  }

  renderListHeader() {
    return '';
  }

  render() {
    return (
      <Modal style={{ flex: 1 }} animationType='fade'>
        <ModalHeader
          title='My Events'
          actionText='Close'
          onCancel={() => console.log('User closed event modal')}
          onAction={() => this.props.closeMyEventTab()}
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
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  const { showModal } = state.myEventTab;

  const loading = false;
  const data = [
    {
      _id: '980987230941',
      created: '2018-09-03T05:46:44.038Z',
      creator: {
        // User ref
        name: 'Jia Zeng'
      },
      title: 'Jay\'s end of internship party',
      start: '2018-09-05T05:46:44.038Z',
      durationHours: 2,
      participantsCanInvite: true,
      isInviteOnly: true,
      participantLimit: 100,
      location: '100 event ave, NY',
      description: 'Let\'s get together to celebrate Jay\'s birthday',
      picture: '',
      participants: [
        {
          _id: '123698172691',
          name: 'Super Andy',
          profile: {
            image: undefined
          }
        },
        {
          _id: '123698172692',
          name: 'Mike Gai',
          profile: {
            image: undefined
          }
        }
      ],
      participantCount: 2,
    },
    {
      _id: '980987230942',
      created: '2018-6-03T05:46:44.038Z',
      creator: {
        // User ref
        name: 'David Bogger'
      },
      title: 'Back to school party',
      start: '2018-09-10T05:46:44.038Z',
      durationHours: 3,
      participantsCanInvite: false,
      isInviteOnly: true,
      participantLimit: 30,
      location: 'TBD',
      description: 'We do nothing and simple enjoy life',
      picture: '',
      participants: [
        {
          _id: '123698172693',
          name: 'Batman',
          profile: {
            image: undefined
          }
        },
        {
          _id: '123698172694',
          name: 'Captain America',
          profile: {
            image: undefined
          }
        }
      ],
      participantCount: 2,
    }
  ];

  return {
    data,
    loading,
    showModal
  };
};

export default connect(
  mapStateToProps,
  {
    refreshEvent,
    loadMoreEvent,
    closeMyEventTab
  }
)(MyEventTab);
