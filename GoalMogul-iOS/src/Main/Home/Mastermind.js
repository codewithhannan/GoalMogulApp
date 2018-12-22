import React, { Component } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Platform
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Carousel from 'react-native-snap-carousel';
import { Constants } from 'expo';

// Components
// import GoalFilterBar from '../Common/GoalFilterBar';
// import GoalFeedFilterBar from '../Common/GoalFeedFilterBar';
import NeedCard from '../Goal/NeedCard/NeedCard';
import GoalCard from '../Goal/GoalCard/GoalCard';
// import GoalFilter from './GoalFilter';
import EmptyResult from '../Common/Text/EmptyResult';
import NextButton from '../Goal/Common/NextButton';
import GoalFeedInfoModal from './GoalFeedInfoModal';

// asset
import plus from '../../asset/utils/plus.png';
import informationIconBlack from '../../asset/utils/info.png';

// actions
import {
  openCreateOverlay,
  closeCreateOverlay,
  loadMoreGoals,
  refreshGoals,
  openGoalDetail,
  changeFilter
} from '../../redux/modules/home/mastermind/actions';

import { IPHONE_MODELS } from '../../Utils/Constants';
import { APP_DEEP_BLUE } from '../../styles';

const ITEM_HEIGHT = Platform.OS === 'ios' &&
  IPHONE_MODELS.includes(Constants.platform.ios.model.toLowerCase())
  ? 450 : 410;

const TAB_KEY = 'mastermind';

class Mastermind extends Component {
  constructor(props) {
    super(props);
    this.state = {
      infoModal: false
    };
  }

  componentWillUnmount() {

  }

  closeInfoModal = () => {
    this.setState({
      ...this.state,
      infoModal: false
    });
  }

  openInfoModal = () => {
    this.setState({
      ...this.state,
      infoModal: true
    });
  }

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

  renderInfoModal() {
    if (this.state.infoModal) {
      return (
        <GoalFeedInfoModal
          infoModal={this.state.infoModal}
          onClose={this.closeInfoModal}
          onAction={() => Actions.createGoalModal()}
        />
      );
    }
    return '';
  }

  renderInfoHeader() {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 12
        }}
        activeOpacity={0.85}
        onPress={this.openInfoModal}
      >
        <Image
          source={informationIconBlack}
          style={{ width: 13, height: 13, tintColor: '#969696', marginRight: 4, marginLeft: 4 }}
        />
        <Text
          style={{ color: '#969696', fontSize: 10, fontWeight: '600' }}
        >
          What is the ‘Goals’ feed?
        </Text>
      </TouchableOpacity>
    );
  }

  // This was used in V1 where user can choose either to create goal or post
  // in goal feed. But now, they can only create goal in goal feed
  // and post in activity feed
  // renderPlus() {
  //   if (this.props.showPlus) {
  //     return (
  //       <TouchableOpacity
  //         activeOpacity={0.85}
  //         style={styles.iconContainerStyle}
  //         onPress={this.handleCreateGoal}
  //       >
  //         <Image style={styles.iconStyle} source={plus} />
  //       </TouchableOpacity>
  //     );
  //   }
  //   return '';
  // }

  renderPlus() {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.iconContainerStyle}
        onPress={() => Actions.createGoalModal()}
      >
        <Image style={styles.iconStyle} source={plus} />
      </TouchableOpacity>
    );
  }

  renderNext() {
    return (
      <View style={styles.nextIconContainerStyle}>
        <NextButton
          onPress={() => {
            this._carousel.snapToNext();
          }}
        />
      </View>
    );
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

  renderListFooter() {
    const { loadingMore, data } = this.props;
    // console.log(`${DEBUG_KEY}: loading is: ${loadingMore}, data length is: ${data.length}`);
    if (loadingMore && data.length > 4) {
      return (
        <View
          style={{
            paddingVertical: 0
          }}
        >
          <ActivityIndicator size='large' />
        </View>
      );
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.renderInfoHeader()}
        {this.renderInfoModal()}
        <Carousel
          ref={(c) => { this._carousel = c; }}
          data={this.props.data}
          renderItem={this.renderItem}
          sliderHeight={ITEM_HEIGHT}
          itemHeight={ITEM_HEIGHT}
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
          ListFooterComponent={this.renderListFooter()}
          vertical
          removeClippedSubviews
          initialNumToRender={4}
          inactiveSlideOpacity={0.2}
          inactiveSlideScale={0.85}
          onEndReachedThreshold={0.2}
        />
        {this.renderPlus()}
        {this.renderNext()}
      </View>
    );
    // Following is the old implementation
    // return (
    //   <View style={{ flex: 1 }}>
    //     <FlatList
    //       ref='flatlist'
    //       data={this.props.data}
    //       renderItem={this.renderItem}
    //       numColumns={1}
    //       keyExtractor={this._keyExtractor}
    //       refreshing={this.props.loading}
    //       onRefresh={this.handleOnRefresh}
    //       onEndReached={this.handleOnLoadMore}
    //       ListHeaderComponent={this.renderListHeader()}
    //       ListEmptyComponent={
    //         this.props.loading ? '' :
    //         <EmptyResult
    //           text={'No Goals have been shared'}
    //           textStyle={{ paddingTop: 100 }}
    //         />
    //       }
    //       onEndThreshold={0}
    //     />
    //     {this.renderPlus()}
    //   </View>
    // );
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
    zIndex: 3,
    // backgroundColor: '#17B3EC',
    backgroundColor: APP_DEEP_BLUE,
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
  },
  nextIconContainerStyle: {
    position: 'absolute',
    bottom: 0,
    right: 50,
    left: 50,
    alignItems: 'center'
  }
};

const mapStateToProps = state => {
  const { showPlus, data, loading, filter, loadingMore } = state.home.mastermind;

  return {
    showPlus,
    data,
    loading,
    filter,
    loadingMore
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
