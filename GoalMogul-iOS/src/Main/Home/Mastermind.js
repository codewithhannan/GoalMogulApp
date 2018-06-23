import React, { Component } from 'react';
import {
  View,
  Image,
  FlatList,
  TouchableOpacity
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

// Components
import NeedCard from '../Goal/NeedCard/NeedCard';
import GoalCard from '../Goal/GoalCard/GoalCard';

// asset
import plus from '../../asset/utils/plus.png';

// actions
import {
  openCreateOverlay,
  closeCreateOverlay
} from '../../redux/modules/home/mastermind/actions';

/* TODO: delete the test data */
const testData = [
  {
    name: 'Jia Zeng',
    _id: 1
  }
];

const TAB_KEY = 'mastermind';

class Mastermind extends Component {

  handleCreateGoal = () => {
    this.props.openCreateOverlay();
    Actions.createGoalButtonOverlay({ tab: TAB_KEY });
  }

  _keyExtractor = (item) => item._id

  renderItem = item => {
    // TODO: render item
    return <View />;
  }

  renderPlus() {
    if (this.props.showPlus) {
      return (
        <TouchableOpacity style={styles.iconContainerStyle} onPress={this.handleCreateGoal}>
          <Image style={styles.iconStyle} source={plus} />
        </TouchableOpacity>
      );
    }
    return '';
  }

  render() {
    console.log('navigation props: ', this.props.navigation);
    return (
      <View style={{ flex: 1 }}>
        <GoalCard />
        {/*
          <FlatList
            data={testData}
            renderItem={this.renderItem}
            numColumns={1}
            keyExtractor={this._keyExtractor}
          />
        */}

        {/*
          refreshing={this.props.refreshing}
          onEndReached={this.onLoadMore}
          onEndThreshold={0}
        */}
        {this.renderPlus()}
      </View>
    );
  }
}

const styles = {
  iconContainerStyle: {
    position: 'absolute',
    bottom: 20,
    right: 15,
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#45C9F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },
  iconStyle: {
    height: 26,
    width: 26,
    tintColor: 'white',
  },
};

const mapStateToProps = state => {
  const { showPlus } = state.home.mastermind;

  return {
    showPlus
  };
};

export default connect(
  mapStateToProps,
  {
    openCreateOverlay,
    closeCreateOverlay
  }
)(Mastermind);
