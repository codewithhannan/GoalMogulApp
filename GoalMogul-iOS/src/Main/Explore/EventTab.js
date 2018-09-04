import React from 'react';
import {
  View,
  FlatList
} from 'react-native';
import { connect } from 'react-redux';

// Actions
import {
  refreshEvent,
  loadMoreEvent
} from '../../redux/modules/event/EventTabActions';

// Components
import EventCard from './EventCard';

class EventTab extends React.Component {
  _keyExtractor = (item) => item._id;

  handleOnRefresh = () => this.props.refreshEvent();

  handleOnLoadMore = () => this.props.loadMoreEvent();

  renderItem = ({ item }) => {
    return <EventCard item={item} />;
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={this.props.data}
          renderItem={this.renderItem}
          numColumns={1}
          keyExtractor={this._keyExtractor}
          refreshing={this.props.loading}
          onRefresh={this.handleOnRefresh}
          onEndReached={this.handleOnLoadMore}
          onEndThreshold={0}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  // const { data, loading } = state.eventTab;

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
          name: 'Super Andy'
        },
        {
          name: 'Mike Gai'
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
          name: 'Batman'
        },
        {
          name: 'Captain America'
        }
      ],
      participantCount: 2,
    }
  ];

  return {
    data,
    loading
  };
};

export default connect(
  mapStateToProps,
  {
    refreshEvent,
    loadMoreEvent
  }
)(EventTab);
