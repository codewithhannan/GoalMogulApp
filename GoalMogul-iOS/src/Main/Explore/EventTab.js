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
  _keyExtractor = (item, index) => index;

  handleOnRefresh = () => this.props.refreshEvent();

  handleOnLoadMore = () => this.props.loadMoreEvent();

  renderItem = ({ item }) => {
    console.log('item to render in Event tab is: ', item);
    return <View style={{ height: 20, backgroundColor: 'red', marginTop: 2 }} />;
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
    // {
    //   created: '',
    //   creator: {
    //     // User ref
    //   },
    //   title: 'Cele',
    //   start: {
    //       type: Date,
    //       required: true,
    //   },
    //   durationHours: {
    //       type: Number,
    //       required: true,
    //   },
    //   participantsCanInvite: {
    //       type: Boolean,
    //       required: true,
    //   },
    //   isInviteOnly: {
    //       type: Boolean,
    //       required: true,
    //   },
    //   participantLimit: {
    //       type: Number,
    //       required: true,
    //       min: 2,
    //       max: 10000,
    //   },
    //   location: String,
    //   description: String,
    //   picture: String,
    //   participants: [{
    //       type: eventParticipants,
    //   }],
    //   participantCount: {
    //       type: Number,
    //       required: true,
    //   },
    // }
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
