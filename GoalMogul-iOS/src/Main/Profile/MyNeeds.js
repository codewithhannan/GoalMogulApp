import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';

// Components
import GoalFilterBar from '../Common/GoalFilterBar';
import MyGoalCard from '../Common/MyGoalCard';

// actions
import {
  handleRefresh
} from '../../actions';

// tab key
const key = 'myneeds';

/* TODO: delete the test data */
const testData = [
  {
    name: 'Jia Zeng',
    id: '1'
  }
];

class MyNeeds extends Component {

  _keyExtractor = (item) => item.id

  handleRefresh = () => {
    console.log('Refreshing tab: ', key);
    // this.props.handleRefresh(key);
  }

  renderItem = item => {
    // TODO: render item
    return <MyGoalCard />
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <GoalFilterBar selectedTab={this.props.selectedTab} />
        <View style={{ flex: 1 }}>
          <FlatList
            data={testData}
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

const styles = {
  // Extract label color out
  labelContainerStyle: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    justifyContent: 'center'
  },
  labelTextStyle: {
    fontWeight: '600',
    color: '#969696',
    fontSize: 11
  },
  buttonTextStyle: {
    marginLeft: 5,
    color: '#45C9F6',
    fontSize: 11
  }
};

const mapStateToProps = state => {
  const { contacts } = state.meet;
  const { selectedTab } = state.profile;
  const { data, refreshing } = contacts;

  return {
    selectedTab,
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
)(MyNeeds);
