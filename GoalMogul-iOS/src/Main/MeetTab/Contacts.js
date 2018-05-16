import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { connect } from 'react-redux';

// Components
import MeetFilterBar from './MeetFilterBar';

// actions
import {
  handleRefresh
} from '../../actions';

// tab key
const key = 'contacts';

/* TODO: delete the test data */
const testData = [
  {
    name: 'Jia Zeng'
  }
];

class Contacts extends Component {

  _keyExtractor = (item) => item.id

  handleRefresh = () => {
    console.log('Refreshing tab: ', key);
    this.props.handleRefresh(key);
  }

  renderItem = item => {
    // TODO: render item
  }

  renderSyncContact() {
    if (this.props.data === undefined || this.props.data.length === 0) {
      return (
        ''
      );
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MeetFilterBar />
          <View style={{ flex: 1 }}>
            <FlatList
              data={this.props.data}
              renderItem={this.renderItem}
              keyExtractor={this._keyExtractor}
              onRefresh={this.handleRefresh.bind()}
              refreshing={this.props.refreshing}
            />
          </View>
        {/*
          onEndReached={this.onLoadMore}
        */}
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { contacts } = state.meet;
  const { data, refreshing } = contacts;

  return {
    contacts,
    data,
    refreshing
  };
};

export default connect(
  mapStateToProps,
  {
    handleRefresh
  }
)(Contacts);
