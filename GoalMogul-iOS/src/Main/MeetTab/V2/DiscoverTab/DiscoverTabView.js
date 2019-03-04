/**
 * This component provides an entry point for user to discover new friends. This view might be 
 * duplicate to Suggested.
 */
import React, { Component } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';

// Components
import SuggestedCard from '../../Suggested/SuggestedCard';
import EmptyResult from '../../../Common/Text/EmptyResult';
import SearchBarHeader from '../../../Common/Header/SearchBarHeader';

// actions
import {
  handleRefresh
} from '../../../../actions';

import {
    loadMoreRequest
} from '../../../../redux/modules/meet/MeetActions';

// Styles
import {
    BACKGROUND_COLOR
} from '../../../../styles';

// Constants
import {
  MEET_REQUEST_LIMIT
} from '../../../../reducers/MeetReducers';

// tab key
const key = 'suggested';
const DEBUG_KEY = '[ Component DiscoverTabView ]';

class DiscoverTabView extends Component {
  constructor(props) {
    super(props);
    this.handleRefresh = this.handleRefresh.bind(this);
  }

  componentDidMount() {
    this.handleRefresh();
  }

  _keyExtractor = (item) => item._id;

  handleRefresh = () => {
    console.log(`${DEBUG_KEY} Refreshing tab: `, key);
    this.props.handleRefresh(key);
  }

  handleOnLoadMore = () => {
    console.log(`${DEBUG_KEY} Loading more for tab: `, key);
    this.props.loadMoreRequest(key);
  }

  renderItem = ({ item }) => <SuggestedCard item={item} />;

  renderListFooter() {
    const { loading, data } = this.props;
    // console.log(`${DEBUG_KEY}: loading is: ${loadingMore}, data length is: ${data.length}`);
    if (loading && data.length >= MEET_REQUEST_LIMIT) {
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
      <View style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}>
        <SearchBarHeader backButton title='Discover Friends' />
        <FlatList
          data={this.props.data}
          renderItem={this.renderItem}
          keyExtractor={this._keyExtractor}
          onEndReached={this.handleOnLoadMore}
          onEndReachedThreshold={0}
          onRefresh={this.handleRefresh}
          refreshing={this.props.refreshing}
          ListEmptyComponent={
            this.props.loading || this.props.refreshing ? null :
            <EmptyResult text={'No Recommendations'} textStyle={{ paddingTop: 230 }} />
          }
          ListFooterComponent={this.renderListFooter()}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { suggested } = state.meet;
  const { data, refreshing, loading } = suggested;


  return {
    suggested,
    data,
    refreshing,
    loading
  };
};

export default connect(
  mapStateToProps,
  {
    handleRefresh,
    loadMoreRequest
  }
)(DiscoverTabView);
