import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';

// Components
import GoalFilterBar from '../Common/GoalFilterBar';

/* TODO: delete the test data */
const testData = [
  {
    name: 'Jia Zeng',
    _id: 1
  }
];

class Mastermind extends Component {

  _keyExtractor = (item) => item._id

  renderItem = item => {
    // TODO: render item
    return <View />;
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={testData}
          renderItem={this.renderItem}
          numColumns={1}
          keyExtractor={this._keyExtractor}
        />
        {/*
          refreshing={this.props.refreshing}
          onEndReached={this.onLoadMore}
          onEndThreshold={0}
        */}
      </View>
    );
  }
}

export default Mastermind;
