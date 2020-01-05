import _ from 'lodash';
import R from 'ramda';
import React from 'react';
import {
  // MaskedViewIOS,
  Dimensions, Image, Platform, Text, View
} from 'react-native';
// import {
//   FlingGestureHandler,
//   Directions,
//   State
// } from 'react-native-gesture-handler';
import { TabView } from 'react-native-tab-view';
import { connect } from 'react-redux';
import timeago from 'timeago.js';
// import Decode from 'unescape'; TODO: removed once new decode is good to go
import { deleteGoal } from '../../../actions';
import { ConfettiFadedBackgroundTopHalf } from '../../../asset/background';
// import BulbIcon from '../../../asset/utils/bulb.png';
import CommentIcon from '../../../asset/utils/comment.png';
import ShareIcon from '../../../asset/utils/forward.png';
import HelpIcon from '../../../asset/utils/help.png';
// Asset
import LoveIcon from '../../../asset/utils/love.png';
import ProgressBarLargeCounter from '../../../asset/utils/progressBar_counter_large.png';
import ProgressBarLarge from '../../../asset/utils/progressBar_large.png';
import StepIcon from '../../../asset/utils/steps.png';
import { makeCaretOptions, PAGE_TYPE_MAP, decode } from '../../../redux/middleware/utils';
import { chooseShareDest } from '../../../redux/modules/feed/post/ShareActions';
import { shareGoalToMastermind } from '../../../redux/modules/goal/GoalDetailActions';
// Actions
import { openGoalDetail } from '../../../redux/modules/home/mastermind/actions';
import { likeGoal, unLikeGoal } from '../../../redux/modules/like/LikeActions';
import { subscribeEntityNotification, unsubscribeEntityNotification } from '../../../redux/modules/notification/NotificationActions';
// Actions
import { createReport } from '../../../redux/modules/report/ReportActions';
// Constants
import { CARET_OPTION_NOTIFICATION_SUBSCRIBE, CARET_OPTION_NOTIFICATION_UNSUBSCRIBE, IPHONE_MODELS, IS_ZOOMED, DEVICE_MODEL } from '../../../Utils/Constants';
import { RightArrowIcon } from '../../../Utils/Icons';
import { actionSheet, switchByButtonIndex } from '../../Common/ActionSheetFactory';
import DelayedButton from '../../Common/Button/DelayedButton';
import ProfileImage from '../../Common/ProfileImage';
import ActionButton from '../Common/ActionButton';
import ActionButtonGroup from '../Common/ActionButtonGroup';
import GoalCardHeader from '../Common/GoalCardHeader';
// Components
import Headline from '../Common/Headline';
import ProgressBar from '../Common/ProgressBar';
import TabButtonGroup from '../Common/TabButtonGroup';
import Timestamp from '../Common/Timestamp';
import NeedTab from './NeedTab';
import StepTab from './StepTab';

const { height, width } = Dimensions.get('window');
const WINDOW_WIDTH = width;
const CardHeight = height * 0.7;
const ITEM_COUNT = Platform.OS === 'ios' &&
  IPHONE_MODELS.includes(DEVICE_MODEL)
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

  // Original style 1 currently used
  // buttonStyle={{
  //   selected: {
  //     backgroundColor: '#f8f8f8',
  //     tintColor: '#1998c9',
  //     color: '#1998c9',
  //     fontWeight: '600'
  //   },
  //   unselected: {
  //     backgroundColor: 'white',
  //     tintColor: '#696969',
  //     color: '#696969',
  //     fontWeight: '600'
  //   }
  // }} 

  // Original style 2
  // buttonStyle={{
  //   selected: {
  //     backgroundColor: APP_BLUE,
  //     tintColor: 'white',
  //     color: 'white',
  //     fontWeight: '700'
  //   },
  //   unselected: {
  //     backgroundColor: 'white',
  //     tintColor: '#616161',
  //     color: '#616161',
  //     fontWeight: '600'
  //   }
  // }}   
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

    return (
      <View style={{ marginTop: 16 }}>
        <ProgressBar
          startTime={start}
          endTime={end}
          steps={steps}
          needs={needs}
          goalRef={item}
          width={IS_ZOOMED ? 216 : 268} // TODO: use ratio with screen size rather static number
          size='large'
        />
      </View>
    );
  }

  // user basic information
  renderUserDetail(item) {
    const { title, owner, category, _id, created, maybeIsSubscribed, viewCount, priority, isCompleted } = item;
    const timeStamp = (created === undefined || created.length === 0)
      ? new Date() : created;

    const pageId = _.get(PAGE_TYPE_MAP, 'goalFeed');

    const selfOptions = makeCaretOptions('Goal', item);

    const caret = {
      self: {
        options: selfOptions,
        onPress: (key) => {
          if (key === 'Delete') {
            return this.props.deleteGoal(_id, pageId);
          }

          let initialProps = {};
          if (key === 'Edit Goal') {
            initialProps = { initialShowGoalModal: true };
            this.props.openGoalDetail(item, initialProps);
            return;
          }
          if (key === 'Share to Goal Feed') {
            // It has no pageId so it won't have loading animation
            return this.props.shareGoalToMastermind(_id);
          }
          if (key === 'Mark as Complete') {
            initialProps = { 
              initialMarkGoalAsComplete: true,
              refreshGoal: false
            };
            this.props.openGoalDetail(item, initialProps);
            return;
          }

          if (key === 'Unmark as Complete') {
            initialProps = { 
              initialUnMarkGoalAsComplete: true,
              refreshGoal: false
            };
            this.props.openGoalDetail(item, initialProps);
            return;
          }
        },
        shouldExtendOptionLength: owner._id === this.props.userId
      },
      others: {
        options: [
          { option: 'Report' }, 
          { option: maybeIsSubscribed ? CARET_OPTION_NOTIFICATION_UNSUBSCRIBE : CARET_OPTION_NOTIFICATION_SUBSCRIBE }
        ],
        onPress: (key) => {
          if (key === 'Report') {
            return this.props.createReport(_id, 'goal', 'Goal');
          }
          if (key === CARET_OPTION_NOTIFICATION_UNSUBSCRIBE) {
            return this.props.unsubscribeEntityNotification(_id, 'Goal');
          }
          if (key === CARET_OPTION_NOTIFICATION_SUBSCRIBE) {
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
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Headline
            name={owner.name}
            category={category}
            user={owner}
            isSelf={owner._id === this.props.userId}
            caret={caret}
          />
          <Timestamp time={timeago().format(timeStamp)} viewCount={viewCount} priority={priority} isCompleted={isCompleted} />
          <View style={{ flexDirection: 'row', marginTop: 5 }}>
            <Text
              style={{ flex: 1, flexWrap: 'wrap', color: 'black', fontSize: 18 }}
              numberOfLines={2}
              ellipsizeMode='tail'
              selectable
            >
              {decode(title)}
            </Text>
          </View>

        </View>
      </View>
    );
  }

  // Note: deprecated
  renderViewGoal() {
    return (
      <DelayedButton
        activeOpacity={0.6}
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
      </DelayedButton>
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
          iconStyle={{ tintColor: '#f15860', borderRadius: 5, height: 20, width: 22, marginTop: 1.5 }}
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
          textStyle={{ color: '#FCB110' }}
          iconStyle={{ tintColor: '#FCB110', height: 26, width: 26 }}
          onPress={() => {
            console.log(`${DEBUG_KEY}: user clicks comment icon`);
            this.props.onPress(
              this.props.item, 
              { 
                type: 'comment', 
                _id: undefined,
                initialShowSuggestionModal: false,
                initialFocusCommentBox: true
              }
            );
          }}
        />
      </ActionButtonGroup>
    );
  }
  // Original color picked for comment icon
  // #FCB110

  render() {
    const { item } = this.props;
    if (!item) return;

    const { steps, needs } = item;
    const tabHeight = getTabHeight(this.state.navigationState, item);
    return (
      <View style={{ marginTop: 10 }}>
        <View style={{ backgroundColor: 'white', ...styles.borderShadow }}>
          {item.isCompleted? 
            <Image
              source={ConfettiFadedBackgroundTopHalf}
              style={{
                height: WINDOW_WIDTH*.6,
                width: WINDOW_WIDTH,
                position: 'absolute',
                resizeMode: 'cover',
                opacity: 0.55,
              }}
          /> : null }
          <GoalCardHeader item={item} />
          <View>
            <DelayedButton
              activeOpacity={0.6}
              onPress={() => this.props.onPress(this.props.item)}
            >
              <View style={{ marginTop: 14, marginBottom: 15, marginRight: 12, marginLeft: 12 }}>
                {this.renderUserDetail(item)}
                {this.renderCardContent(item)}
              </View>
            </DelayedButton>
            { // Disable tabs if neither needs or steps
              // _.isEmpty(steps) && _.isEmpty(needs)
              // ? null
              // : (
              //   <View style={{ height: tabHeight }}>
              //     {this.renderTabs()}
              //   </View>
              // )
            }
            <View>
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
    unsubscribeEntityNotification,
    openGoalDetail,
    shareGoalToMastermind
  }
)(GoalCard);