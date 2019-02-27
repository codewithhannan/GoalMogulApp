import React, { Component } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Platform,
  FlatList
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
// This is commented out as we switch back to the old implementation
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
import { APP_DEEP_BLUE, BACKGROUND_COLOR } from '../../styles';

const ITEM_HEIGHT = Platform.OS === 'ios' &&
  IPHONE_MODELS.includes(Constants.platform.ios.model.toLowerCase())
  ? 420 : 450;

const TAB_KEY = 'mastermind';
const DEBUG_KEY = '[ UI Mastermind ]';

class Mastermind extends Component {
  constructor(props) {
    super(props);
    this.state = {
      infoModal: false,
      onListEndReached: false
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

  /**
   * Used by parent to scroll mastermind to top on tab pressed
   */
  scrollToTop = () => {
    this.flatlist.scrollToIndex({
      animated: true,
      index: 0
    });
  }

  handleCreateGoal = () => {
    this.props.openCreateOverlay();
    Actions.createGoalButtonOverlay({ tab: TAB_KEY });
  }

  handleOnLoadMore = () => {
    this.setState({ ...this.state, onListEndReached: true });
    const callback = () => this.setState({ ...this.state, onListEndReached: false });
    this.props.loadMoreGoals(callback);
  };

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
        onPress={(goal, subItem) => {
          // console.log('[ UI Mastermind ]: onPress with subItem: ', subItem);
          if (subItem) {
            this.props.openGoalDetail(
              goal,
              {
                focusType: subItem.type,
                focusRef: subItem._id,
                // commentBox is passed in to GoalDetailCardV3 as initial
                commentBox: true
              }
            );
            return;
          }
          this.props.openGoalDetail(goal);
        }}
        onSectionCardPress={(goal, subItem) => {
          // console.log('[ UI Mastermind ]: onSectionCardPress with subItem: ', subItem);
          this.props.openGoalDetail(
            goal,
            {
              focusType: subItem.type,
              focusRef: subItem._id,
              commentBox: false
            }
          );
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

  // This was used in V2 where user can only create Goal here. But we decide
  // to move this function to Home component so that it won't scroll over
  // renderPlus() {
  //   return (
  //     <TouchableOpacity
  //       activeOpacity={0.85}
  //       style={styles.iconContainerStyle}
  //       onPress={() => Actions.createGoalModal()}
  //     >
  //       <Image style={styles.iconStyle} source={plus} />
  //     </TouchableOpacity>
  //   );
  // }

  /**
   * This method is not used currently as we switch back to the old scrolling pattern
   */
  renderNext() {
    if (this.state.onListEndReached && this.props.loadingMore && this.props.data.length >= 4) {
      return '';
    }
    
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
    if (loadingMore && data.length >= 4) {
      return (
        <View
          style={{
            paddingVertical: 20
          }}
        >
          <ActivityIndicator size='large' />
        </View>
      );
    }
  }

  render() {
    // We are switching back to infinite scroll with flatlist for now
    // return (
    //   <View style={{ flex: 1 }}>
    //     {this.renderInfoHeader()}
    //     {this.renderInfoModal()}
    //     <Carousel
    //       ref={(c) => { this._carousel = c; }}
    //       data={this.props.data}
    //       renderItem={this.renderItem}
    //       sliderHeight={ITEM_HEIGHT}
    //       itemHeight={ITEM_HEIGHT}
    //       keyExtractor={this._keyExtractor}
    //       scrollsToTop
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
    //       ListFooterComponent={this.renderListFooter()}
    //       vertical
    //       removeClippedSubviews
    //       initialNumToRender={4}
    //       inactiveSlideOpacity={0.2}
    //       inactiveSlideScale={0.85}
    //       onEndReachedThreshold={0}
    //     />
    //     {
    //       //this.renderPlus()
    //     }
    //     {this.renderNext()}
    //   </View>
    // );

    // Following is the old implementation
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          ref={f => (this.flatlist = f)}
          data={this.props.data}
          renderItem={this.renderItem}
          numColumns={1}
          keyExtractor={this._keyExtractor}
          refreshing={this.props.loading}
          onRefresh={this.handleOnRefresh}
          onEndReached={this.handleOnLoadMore}
          ListHeaderComponent={this.renderListHeader()}
          ListFooterComponent={this.renderListFooter()}
          ListEmptyComponent={
            this.props.loading ? null :
            <EmptyResult
              text={'No Goals have been shared'}
              textStyle={{ paddingTop: 230 }}
            />
          }
          onEndThreshold={0}
        />
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
  const { showPlus, data, loading, filter, loadingMore, refreshing } = state.home.mastermind;

  return {
    showPlus,
    data,
    loading,
    filter,
    loadingMore,
    refreshing
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
  },
  null,
  { withRef: true }
)(Mastermind);
