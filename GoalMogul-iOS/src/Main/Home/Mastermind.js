import React, { Component } from 'react';
import {
  View,
  Image,
  FlatList,
  Modal,
  TouchableOpacity,
  Text
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Carousel from 'react-native-snap-carousel';

// Components
// import GoalFilterBar from '../Common/GoalFilterBar';
// import GoalFeedFilterBar from '../Common/GoalFeedFilterBar';
import NeedCard from '../Goal/NeedCard/NeedCard';
import GoalCard from '../Goal/GoalCard/GoalCard';
// import GoalFilter from './GoalFilter';
import EmptyResult from '../Common/Text/EmptyResult';
import NextButton from '../Goal/Common/NextButton';

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
        <Modal
          animation="fade"
          visible={this.state.infoModal}
          transparent
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'gray',
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
              }}
              opacity={0.4}
            />
            <TouchableOpacity
              style={{ height: 100, width: '100%', backgroundColor: 'green', marginTop: 100 }}
              onPress={this.closeInfoModal}
            />
          </View>
        </Modal>
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
          What is the 'Goal' Tab
        </Text>
      </TouchableOpacity>
    );
  }

  renderPlus() {
    if (this.props.showPlus) {
      return (
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.iconContainerStyle}
          onPress={this.handleCreateGoal}
        >
          <Image style={styles.iconStyle} source={plus} />
        </TouchableOpacity>
      );
    }
    return '';
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

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.renderInfoHeader()}
        {this.renderInfoModal()}
        <Carousel
          ref={(c) => { this._carousel = c; }}
          data={this.props.data}
          renderItem={this.renderItem}
          sliderHeight={450}
          itemHeight={450}
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
          vertical
          removeClippedSubviews
          initialNumToRender={4}
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
  },
  nextIconContainerStyle: {
    position: 'absolute',
    bottom: 5,
    right: 0,
    left: 0,
    alignItems: 'center'
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
