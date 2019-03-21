/**
 * This is the file for People tab in discovery tab
 */
import React from 'react';
import {
  View,
  FlatList
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

// Actions
import {
  refreshEvent,
  loadMoreEvent
} from '../../../redux/modules/event/EventTabActions';

// Components
import EmptyResult from '../../Common/Text/EmptyResult';

class PeopleTab extends React.Component {
  componentDidMount() {
    if (!this.props.data || _.isEmpty(this.props.data)) {
      this.handleOnRefresh();
    }
  }
  
  _keyExtractor = (item) => item._id;

  handleOnRefresh = () => this.props.refreshEvent();

  handleOnLoadMore = () => this.props.loadMoreEvent();

  renderItem = ({ item }) => {
    return <View />;
  }

  renderListHeader() {
    // return <EventTabFilterBar value={{ sortBy: this.props.sortBy }}/>;
    return null;
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
          ListHeaderComponent={this.renderListHeader()}
          ListEmptyComponent={
            this.props.loading ? null :
            <EmptyResult text={'No Recommendations'} />
          }
          onEndThreshold={0}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { data, loading, sortBy } = state.eventTab;

  return {
    data,
    loading,
    sortBy
  };
};

export default connect(
  mapStateToProps,
  {
    refreshEvent,
    loadMoreEvent
  }
)(PeopleTab);
