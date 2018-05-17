import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';

// Components
import GoalFilterBar from '../Common/GoalFilterBar';

/* TODO: delete the test data */
const testData = [
  {
    name: 'Jia Zeng'
  }
];

class Mastermind extends Component {

  _keyExtractor = (item) => item.id

  renderItem = item => {
    // TODO: render item
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          enableEmptySections
          data={testData}
          renderItem={(item) => this.renderItem(item)}
          numColumns={1}
          keyExtractor={this._keyExtractor}
          onEndThreshold={0}
        />
        {/*
          refreshing={this.props.refreshing}
          onEndReached={this.onLoadMore}
        */}
      </View>
    );
  }
}

export default Mastermind;
