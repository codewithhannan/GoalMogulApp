/**
 * This view is a central hub for incoming and outgoing request for a user
 */
import React, { Component } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text
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
  getIncomingUserFromFriendship
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
const route = routes.incoming;

const DEBUG_KEY = '[ UI IncomingRequestsTabView ]';

class IncomingRequestTabView extends Component {
    componentDidMount() {
        const { data } = this.props;
        if (!data || data.length === 0) {
            this.props.handleRefresh('requests.incoming');
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
                    data={this.props.data}
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
  const { incoming } = requests;
  const { user } = state.user;

  return {
    requests,
    data: getIncomingUserFromFriendship(state),
    refreshing: incoming.refreshing,
    user
  };
};

export default connect(
  mapStateToProps,
  {
    handleRefresh,
    loadMoreRequest
  }
)(IncomingRequestTabView);
