/**
 * This view is a central hub for incoming and outgoing request for a user
 */
import React, { Component } from 'react';
import {
  View,
  FlatList
} from 'react-native';
import { connect } from 'react-redux';

// Components
import FriendRequestCardView from '../FriendRequestCardView';

// actions
import {
  handleRefresh,
} from '../../../../actions';

import {
  loadMoreRequest
} from '../../../../redux/modules/meet/MeetActions';

// Selectors
import {
  getOutgoingUserFromFriendship,
} from '../../../../redux/modules/meet/selector';

// Styles
import {
  BACKGROUND_COLOR
} from '../../../../styles';

// Test Data
import { testFriendRequests } from '../../../../Test/TestObjects';

// tab key
const routes = {
  outgoing: 'requests.outgoing',
  incoming: 'requests.incoming'
};
const route = routes.outgoing;

const Tabs = [
  {
    name: 'Incoming',
    key: 'incoming'
  },
  {
    name: 'Outgoing',
    key: 'outgoing'
  }
];

const DEBUG_KEY = '[ UI OutgoingRequestTabView ]';

class OutgoingRequestTabView extends Component {
    componentDidMount() {
        const { data } = this.props;
        if (!data || data.length === 0) {
            this.props.handleRefresh('requests.outgoing');
        }
    }

    handleRefresh = () => {
        console.log(`${DEBUG_KEY} Refreshing tab: `, route);
        this.props.handleRefresh(route);
    }

    handleOnLoadMore = () => {
        this.props.loadMoreRequest(route);
    }

    keyExtractor = (item) => item._id;

    renderItem = ({ item }) => <FriendRequestCardView item={item} />;

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}>
                <FlatList
                    data={[...testFriendRequests, ...this.props.data]}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                    onRefresh={this.handleRefresh.bind(this)}
                    refreshing={this.props.refreshing}
                    onEndReached={this.handleOnLoadMore}
                    onEndReachedThreshold={0}
                />
            </View>
        );
    }
}

const mapStateToProps = state => {
    const { requests } = state.meet;
    const { outgoing } = requests;
    const { user } = state.user;
  
    return {
      requests,
      data: getOutgoingUserFromFriendship(state),
      refreshing: outgoing.refreshing,
      user
    };
};

export default connect(
  mapStateToProps,
  {
    handleRefresh,
    loadMoreRequest
  }
)(OutgoingRequestTabView);
