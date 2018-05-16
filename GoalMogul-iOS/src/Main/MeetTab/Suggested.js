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
const key = 'suggested';

/* TODO: delete the test data */
const testData = [
  {
    name: 'Jia Zeng'
  }
];

class Suggested extends Component {

  _keyExtractor = (item) => item.id

  handleRefresh = () => {
    console.log('Refreshing tab: ', key);
    this.props.handleRefresh(key);
  }

  renderItem = item => {
    // TODO: render item
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
  const { suggested } = state.meet;
  const { data, refreshing } = suggested;

  return {
    suggested,
    data,
    refreshing
  };
};

export default connect(
  mapStateToProps,
  {
    handleRefresh
  }
)(Suggested);
