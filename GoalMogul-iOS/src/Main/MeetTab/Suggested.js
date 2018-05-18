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
    name: 'Jia Zeng aldjl;fajskl;djfla;jskd;as',
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
  console.log('state meet is: ', state.meet);
  console.log('suggested is: ', suggested);

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
