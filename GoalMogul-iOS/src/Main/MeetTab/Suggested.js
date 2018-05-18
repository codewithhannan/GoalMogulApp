import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { connect } from 'react-redux';

// Components
import MeetFilterBar from './MeetFilterBar';
import MeetCard from './MeetCard';

// actions
import {
  handleRefresh
} from '../../actions';

// tab key
const key = 'suggested';

/* TODO: delete the test data */
const testDataSuggested = [
  {
    id: 1,
    name: 'Jia Zeng',
    profile: {
      occupation: 'student'
    }
  },
  {
    id: 1,
    name: 'Jay Patel',
    profile: {

    }
  }
];

class Suggested extends Component {

  _keyExtractor = (item, index) => index

  handleRefresh = () => {
    console.log('Refreshing tab: ', key);
    this.props.handleRefresh(key);
  }

  renderItem = ({ item }) => {
    return <MeetCard item={item} />;
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <FlatList
            data={testDataSuggested}
            renderItem={this.renderItem}
            keyExtractor={this._keyExtractor}
            onRefresh={this.handleRefresh.bind()}
            refreshing={this.props.loading}
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
    handleRefresh
  }
)(Suggested);
