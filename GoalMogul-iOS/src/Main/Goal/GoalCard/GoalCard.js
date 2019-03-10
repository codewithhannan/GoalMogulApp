import React, { Component } from 'react';
import {
  View,
  Text,
  // MaskedViewIOS,
  Dimensions,
  TouchableOpacity,
  Platform
} from 'react-native';
import { connect } from 'react-redux';
import { Constants } from 'expo';
// import {
//   FlingGestureHandler,
//   Directions,
//   State
// } from 'react-native-gesture-handler';
import { TabView, SceneMap } from 'react-native-tab-view';
import timeago from 'timeago.js';
import R from 'ramda';
import _ from 'lodash';
import Decode from 'unescape';

// Actions
import {
  createReport
} from '../../../redux/modules/report/ReportActions';

import {
  likeGoal,
  unLikeGoal
} from '../../../redux/modules/like/LikeActions';

import {
  chooseShareDest
} from '../../../redux/modules/feed/post/ShareActions';

import {
  deleteGoal,
} from '../../../actions';

import { PAGE_TYPE_MAP } from '../../../redux/middleware/utils';

import {
  subscribeEntityNotification,
  unsubscribeEntityNotification
} from '../../../redux/modules/notification/NotificationActions';

// Components
import Headline from '../Common/Headline';
import Timestamp from '../Common/Timestamp';
import ActionButton from '../Common/ActionButton';
import ActionButtonGroup from '../Common/ActionButtonGroup';
import TabButtonGroup from '../Common/TabButtonGroup';
import ProgressBar from '../Common/ProgressBar';
import NeedTab from './NeedTab';
import StepTab from './StepTab';
import { actionSheet, switchByButtonIndex } from '../../Common/ActionSheetFactory';
import ProfileImage from '../../Common/ProfileImage';
import GoalCardHeader from '../Common/GoalCardHeader';
import {
  RightArrowIcon
} from '../../../Utils/Icons';

// Asset
import LoveIcon from '../../../asset/utils/love.png';
// import BulbIcon from '../../../asset/utils/bulb.png';
import CommentIcon from '../../../asset/utils/comment.png';
import ShareIcon from '../../../asset/utils/forward.png';
import HelpIcon from '../../../asset/utils/help.png';
import StepIcon from '../../../asset/utils/steps.png';
import ProgressBarLarge from '../../../asset/utils/progressBar_large.png';
import ProgressBarLargeCounter from '../../../asset/utils/progressBar_counter_large.png';

// Constants
import { IPHONE_MODELS } from '../../../Utils/Constants';

const { height } = Dimensions.get('window');
const CardHeight = height * 0.7;
const ITEM_COUNT = Platform.OS === 'ios' &&
  IPHONE_MODELS.includes(Constants.platform.ios.model.toLowerCase())
  ? 2 : 3;

const TabIconMap = {
  steps: {
    iconSource: StepIcon,
    iconStyle: { height: 20, width: 20 }
  },
  needs: {
    iconSource: HelpIcon,
    iconStyle: { height: 20, width: 20 }
  }
};

const DEBUG_KEY = '[ UI GoalCard ]';
const SHARE_TO_MENU_OPTTIONS = ['Share to Feed', 'Share to an Event', 'Share to a Tribe', 'Cancel'];
const CANCEL_INDEX = 3;

class GoalCard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      navigationState: {
        index: 0,
        routes: [
          { key: 'steps', title: 'Steps' },
          { key: 'needs', title: 'Needs' },
        ],
      }
    };
    this.updateRoutes = this.updateRoutes.bind(this);
  }

  componentDidMount() {
    const { item } = this.props;
    this.updateRoutes(item);
  }

  updateRoutes(item) {
    if (item && !_.isEmpty(item)) {
      const { steps, needs } = item;
      if (_.isEmpty(steps) && _.isEmpty(needs)) return;
      let newRoutes = [];
      let newNavigationState = {
        index: 0,
      };
      if (steps && steps.length > 0 && !_.isEmpty(steps)) {
        newRoutes = [...newRoutes, { key: 'steps', title: 'Steps' }];
      }

      if (needs && needs.length > 0 && !_.isEmpty(needs)) {
        newRoutes = [...newRoutes, { key: 'needs', title: 'Needs' }];
      }
      newNavigationState = _.set(newNavigationState, 'routes', newRoutes);
      this.setState({
        ...this.state,
        navigationState: { ...newNavigationState }
      });
    }
  }

  handleShareOnClick = () => {
    const { item } = this.props;
    const { _id } = item;

    const shareToSwitchCases = switchByButtonIndex([
      [R.equals(0), () => {
        // User choose to share to feed
        console.log(`${DEBUG_KEY} User choose destination: Feed `);
        this.props.chooseShareDest('ShareGoal', _id, 'feed', item);
        // TODO: update reducer state
      }],
      [R.equals(1), () => {
        // User choose to share to an event
        console.log(`${DEBUG_KEY} User choose destination: Event `);
        this.props.chooseShareDest('ShareGoal', _id, 'event', item);
      }],
      [R.equals(2), () => {
        // User choose to share to a tribe
        console.log(`${DEBUG_KEY} User choose destination: Tribe `);
        this.props.chooseShareDest('ShareGoal', _id, 'tribe', item);
      }],
    ]);

    const shareToActionSheet = actionSheet(
      SHARE_TO_MENU_OPTTIONS,
      CANCEL_INDEX,
      shareToSwitchCases
    );
    return shareToActionSheet();
  };

  // Tab related handlers
  _handleIndexChange = index => {
    this.setState({
      ...this.state,
      navigationState: {
        ...this.state.navigationState,
        index,
      }
    });
  };

  _renderHeader = props => {
    return (
      <TabButtonGroup 
        buttons={props} 
        tabIconMap={TabIconMap} 
        buttonStyle={{
          selected: {
            backgroundColor: '#f8f8f8',
            tintColor: '#1998c9',
            color: '#1998c9',
            fontWeight: '600'
          },
          unselected: {
            backgroundColor: 'white',
            tintColor: '#696969',
            color: '#696969',
            fontWeight: '600'
          }
        }}  
      />
    );
  };

  _renderScene = ({ route }) => {
    switch (route.key) {
      case 'needs': {
        return (
          <NeedTab
            item={this.props.item.needs}
            onPress={(need) => this.props.onPress(this.props.item, need)}
            onCardPress={(need) => this.props.onSectionCardPress(this.props.item, need)}
            goalRef={this.props.item}
            itemCount={ITEM_COUNT}
          />
        ); 
      }
      case 'steps': {
        return (
          <StepTab
            item={this.props.item.steps}
            onPress={(step) => this.props.onPress(this.props.item, step)}
            onCardPress={(step) => this.props.onSectionCardPress(this.props.item, step)}
            goalRef={this.props.item}
            itemCount={ITEM_COUNT}
          />
        );
      }
      default:
        return null;
    }
  };

  renderTabs() {
    return (
      <TabView
        navigationState={this.state.navigationState}
        renderScene={this._renderScene}
        renderTabBar={this._renderHeader}
        onIndexChange={this._handleIndexChange}
        useNativeDriver
      />
    );
  }

  // Card central content. Progressbar for goal card
  renderCardContent(item) {
    const { start, end, needs, steps } = item;
    const startDate = start || new Date();
    const endDate = end || new Date();

    return (
      <View style={{ marginTop: 16 }}>
        <ProgressBar
          startTime={startDate}
          endTime={endDate}
          steps={steps}
          needs={needs}
          goalRef={item}
          iconSource={ProgressBarLarge}
          edgeIconSource={ProgressBarLargeCounter}
          height={13}
          width={268}
        />
      </View>
    );
  }

  // user basic information
  renderUserDetail(item) {
    const { title, owner, category, _id, created, maybeIsSubscribed } = item;
    const timeStamp = (created === undefined || created.length === 0)
      ? new Date() : created;

    const pageId = _.get(PAGE_TYPE_MAP, 'goalFeed');

    const caret = {
      self: {
        options: [{ option: 'Delete' }],
        onPress: () => {
          return this.props.deleteGoal(_id, pageId);
        },
        shouldExtendOptionLength: false
      },
      others: {
        options: [
          { option: 'Report' }, 
          { option: maybeIsSubscribed ? 'Unsubscribe' : 'Subscribe' }
        ],
        onPress: (key) => {
          if (key === 'Report') {
            return this.props.createReport(_id, 'goal', 'Goal');
          }
          if (key === 'Unsubscribe') {
            return this.props.unsubscribeEntityNotification(_id, 'Goal');
          }
          if (key === 'Subscribe') {
            return this.props.subscribeEntityNotification(_id, 'Goal');
          }
        },
        shouldExtendOptionLength: false
      }
    };

    return (
      <View style={{ flexDirection: 'row' }}>
        <ProfileImage
          imageStyle={{ height: 60, width: 60, borderRadius: 5 }}
          imageContainerStyle={{ marginTop: 5 }}
          imageUrl={owner && owner.profile ? owner.profile.image : undefined}
          imageContainerStyle={styles.imageContainerStyle}
          userId={owner._id}
        />
        <View style={{ marginLeft: 15, flex: 1 }}>
          <Headline
            name={owner.name}
            category={category}
            user={owner}
            isSelf={owner._id === this.props.userId}
            caret={caret}
          />
          <Timestamp time={timeago().format(timeStamp)} />
          <View style={{ flexDirection: 'row', marginTop: 5 }}>
            <Text
              style={{ flex: 1, flexWrap: 'wrap', color: 'black', fontSize: 18 }}
              numberOfLines={2}
              ellipsizeMode='tail'
            >
              {Decode(title)}
            </Text>
          </View>

        </View>
      </View>
    );
  }

  // Note: deprecated
  renderViewGoal() {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 10,
          position: 'absolute',
          bottom: 70,
          left: 0,
          right: 0
        }}
        onPress={() => this.props.onPress}
      >
        <Text style={styles.viewGoalTextStyle}>View Goal</Text>
        <RightArrowIcon 
          iconContainerStyle={{ alignSelf: 'center', alignItems: 'center' }}
          iconStyle={{ tintColor: '#17B3EC', ...styles.iconStyle, height: 15, width: 18 }}
        />
        {/**
          <View style={{ alignSelf: 'center', alignItems: 'center' }}>
          <Icon
            name='ios-arrow-round-forward'
            type='ionicon'
            color='#17B3EC'
            iconStyle={styles.iconStyle}
          />
        </View>
         */}
      </TouchableOpacity>
    );
  }

  renderActionButtons(item) {
    const { maybeLikeRef, _id } = item;

    const likeCount = item.likeCount ? item.likeCount : 0;
    const commentCount = item.commentCount ? item.commentCount : 0;
    const shareCount = item.shareCount ? item.shareCount : 0;

    const likeButtonContainerStyle = maybeLikeRef && maybeLikeRef.length > 0
      ? { backgroundColor: '#FAD6C8' }
      : { backgroundColor: 'white' };

    return (
      <ActionButtonGroup>
        <ActionButton
          iconSource={LoveIcon}
          count={likeCount}
          iconContainerStyle={likeButtonContainerStyle}
          textStyle={{ color: '#f15860' }}
          iconStyle={{ tintColor: '#f15860', borderRadius: 5, height: 20, width: 22 }}
          onPress={() => {
            console.log(`${DEBUG_KEY}: user clicks Like Icon.`);
            if (maybeLikeRef && maybeLikeRef.length > 0 && maybeLikeRef !== 'testId') {
              return this.props.unLikeGoal('goal', _id, maybeLikeRef);
            }
            this.props.likeGoal('goal', _id);
          }}
        />
        <ActionButton
          iconSource={ShareIcon}
          count={shareCount}
          textStyle={{ color: '#a8e1a0' }}
          iconStyle={{ tintColor: '#a8e1a0', height: 32, width: 32 }}
          onPress={() => this.handleShareOnClick()}
        />
        <ActionButton
          iconSource={CommentIcon}
          count={commentCount}
          textStyle={{ color: '#FBDD0D' }}
          iconStyle={{ tintColor: '#FBDD0D', height: 26, width: 26 }}
          onPress={() => {
            console.log(`${DEBUG_KEY}: user clicks comment icon`);
            this.props.onPress(
              this.props.item, 
              { 
                type: 'comment', 
                _id: undefined,
                initialShowSuggestionModal: false
              }
            );
          }}
        />
      </ActionButtonGroup>
    );
  }
  // Original color picked for comment icon
  // #FBDD0D

  render() {
    const { item } = this.props;
    if (!item) return;

    const { steps, needs } = item;
    const tabHeight = getTabHeight(this.state.navigationState, item);
    return (
      <View style={{ marginTop: 10 }}>
        <View style={{ backgroundColor: '#f8f8f8', ...styles.borderShadow }}>
          <GoalCardHeader item={item} />
          <View style={{ backgroundColor: '#e5e5e5' }}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.containerStyle}
              onPress={() => this.props.onPress(this.props.item)}
            >
              <View style={{ marginTop: 14, marginBottom: 15, marginRight: 12, marginLeft: 12 }}>
                {this.renderUserDetail(item)}
                {this.renderCardContent(item)}
              </View>
            </TouchableOpacity>
            { // Disable tabs if neither needs or steps
              _.isEmpty(steps) && _.isEmpty(needs)
              ? ''
              : (
                <View style={{ height: tabHeight }}>
                  {this.renderTabs()}
                </View>
              )
            }
            <View style={styles.containerStyle}>
              {this.renderActionButtons(item)}
            </View>
          </View>
        </View>
        {/* <NextButton onPress={() => console.log('next item')} /> */}
      </View>
    );
  }
}

const TAB_HEADER_HEIGHT = 38;
const SECTION_CARD_HEIGHT = 66;
const VIEW_GOAL_HEIGHT = 40.5;
const getTabHeight = (navigationState, item) => {
  const { routes, index } = navigationState;
  const tab = routes[index].key;
  const dataToRender = _.get(item, `${tab}`);
  if (!dataToRender || dataToRender.length === 0 || dataToRender.length === 1) {
    return SECTION_CARD_HEIGHT + VIEW_GOAL_HEIGHT + TAB_HEADER_HEIGHT;
  }
  // if (dataToRender.length < 3) {
  //   return ((dataToRender.length * SECTION_CARD_HEIGHT) + VIEW_GOAL_HEIGHT + TAB_HEADER_HEIGHT);
  // }
  if (dataToRender.length < ITEM_COUNT || ITEM_COUNT < 3) {
    return ((Math.min(dataToRender.length, ITEM_COUNT) * SECTION_CARD_HEIGHT)
      + VIEW_GOAL_HEIGHT);
  }

  if (dataToRender.length >= ITEM_COUNT && ITEM_COUNT > 2) {
    return (ITEM_COUNT * SECTION_CARD_HEIGHT) + VIEW_GOAL_HEIGHT;
  }
  return CardHeight * 0.51;
};

const styles = {
  containerStyle: {
    backgroundColor: 'white'
  },
  viewGoalTextStyle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#17B3EC',
    alignSelf: 'center'
  },
  iconStyle: {
    alignSelf: 'center',
    fontSize: 20,
    marginLeft: 5,
    marginTop: 2
  },
  borderShadow: {
    shadowColor: 'lightgray',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 1,
  },
  imageContainerStyle: {
    borderWidth: 0.5,
    padding: 1.5,
    borderColor: 'lightgray',
    alignItems: 'center',
    borderRadius: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'white'
  }
};

const mapStateToProps = state => {
  const { userId } = state.user;
  return {
    userId
  };
};

export default connect(
  mapStateToProps,
  {
    createReport,
    likeGoal,
    unLikeGoal,
    chooseShareDest,
    deleteGoal,
    subscribeEntityNotification,
    unsubscribeEntityNotification
  }
)(GoalCard);
