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
    return (
      <View style={{ flex: 1 }}>
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
    bottom: 70,
    right: 30,
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#45C9F6'
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
