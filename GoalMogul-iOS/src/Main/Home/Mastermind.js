import React, { Component } from 'react';
import {
  View,
  Image,
  FlatList,
  TouchableOpacity
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { GestureHandler } from 'expo';

// Components
import GoalFilterBar from '../Common/GoalFilterBar';
import GoalFeedFilterBar from '../Common/GoalFeedFilterBar';
import NeedCard from '../Goal/NeedCard/NeedCard';
import GoalCard from '../Goal/GoalCard/GoalCard';
import GoalFilter from './GoalFilter';
import EmptyResult from '../Common/Text/EmptyResult';

// asset
import plus from '../../asset/utils/plus.png';

// actions
import {
  openCreateOverlay,
  closeCreateOverlay,
  loadMoreGoals,
  refreshGoals,
  openGoalDetail,
  changeFilter
} from '../../redux/modules/home/mastermind/actions';

const TAB_KEY = 'mastermind';

class Mastermind extends Component {

  handleCreateGoal = () => {
    this.props.openCreateOverlay();
    Actions.createGoalButtonOverlay({ tab: TAB_KEY });
  }

  handleOnLoadMore = () => this.props.loadMoreGoals();

  handleOnRefresh = () => this.props.refreshGoals();

  /**
   * @param type: ['sortBy', 'orderBy', 'categories', 'priorities']
   */
  handleOnMenuChange = (type, value) => {
    this.props.changeFilter(TAB_KEY, type, value);
  }

  _keyExtractor = (item) => item._id

  renderItem = ({ item }) => {
    // TODO: render item
    // console.log('item rendering in Mastermind is: ', item);
    // mastermind currently renders goals and needs
    // TODO: add NeedCard
    return (
      <GoalCard
        item={item}
        onPress={(curItem) => {
          this.props.openGoalDetail(curItem);
        }}
      />
    );
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

  renderListHeader() {
    return '';
    // return (
    //   <GoalFeedFilterBar
    //     selectedTab={this.props.selectedTab}
    //     filter={this.props.filter}
    //     onMenuChange={this.handleOnMenuChange}
    //   />
    // );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          ref='flatlist'
          data={this.props.data}
          renderItem={this.renderItem}
          numColumns={1}
          keyExtractor={this._keyExtractor}
          refreshing={this.props.loading}
          onRefresh={this.handleOnRefresh}
          onEndReached={this.handleOnLoadMore}
          ListHeaderComponent={this.renderListHeader()}
          ListEmptyComponent={
            this.props.loading ? '' :
            <EmptyResult
              text={'No Goals have been shared'}
              textStyle={{ paddingTop: 100 }}
            />
          }
          onEndThreshold={0}
        />
        {this.renderPlus()}
      </View>
    );
  }
}
// onScrollBeginDrag={() => {
//   this.refs['flatlist'].scrollToIndex({ animated: true, index: 2 });
//   console.log('drag begin');
// }}

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
    // backgroundColor: '#46C8F5',
    backgroundColor: '#4096c6',
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
  backdrop: {
    backgroundColor: 'gray',
    opacity: 0.7,
  }
};

const mapStateToProps = state => {
  const { showPlus, data, loading, filter } = state.home.mastermind;

  return {
    showPlus,
    data,
    loading,
    filter
  };
};

export default connect(
  mapStateToProps,
  {
    openCreateOverlay,
    closeCreateOverlay,
    loadMoreGoals,
    refreshGoals,
    openGoalDetail,
    changeFilter
  }
)(Mastermind);
