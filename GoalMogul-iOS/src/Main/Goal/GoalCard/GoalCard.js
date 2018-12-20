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
import { Icon } from 'react-native-elements';
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

// Asset
import defaultProfilePic from '../../../asset/utils/defaultUserProfile.png';
import LoveIcon from '../../../asset/utils/love.png';
import BulbIcon from '../../../asset/utils/bulb.png';
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
  ? 3 : 2;

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
          { key: 'needs', title: 'Needs' },
          { key: 'steps', title: 'Steps' },
        ],
      }
    };
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
      <TabButtonGroup buttons={props} tabIconMap={TabIconMap} />
    );
  };

  _renderScene = SceneMap({
    needs: () => (
      <NeedTab
        item={this.props.item.needs}
        onPress={() => this.props.onPress(this.props.item)}
        goalRef={this.props.item}
        itemCount={ITEM_COUNT}
      />
    ),
    steps: () => (
      <StepTab
        item={this.props.item.steps}
        onPress={() => this.props.onPress(this.props.item)}
        goalRef={this.props.item}
        itemCount={ITEM_COUNT}
      />
    )
  });

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
      <View style={{ marginTop: 20 }}>
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
    const { title, owner, category, _id, created } = item;
    const timeStamp = (created === undefined || created.length === 0)
      ? new Date() : created;

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
            caretOnPress={() => this.props.createReport(_id, 'goal', 'Goal')}
            user={owner}
            isSelf={owner._id === this.props.userId}
          />
          <Timestamp time={timeago().format(timeStamp)} />
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <Text
              style={{ flex: 1, flexWrap: 'wrap', color: 'black', fontSize: 13 }}
              numberOfLines={3}
              ellipsizeMode='tail'
            >
              {title}
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
        <View style={{ alignSelf: 'center', alignItems: 'center' }}>
          <Icon
            name='ios-arrow-round-forward'
            type='ionicon'
            color='#17B3EC'
            iconStyle={styles.iconStyle}
          />
        </View>
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
            if (maybeLikeRef && maybeLikeRef.length > 0) {
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
          iconSource={BulbIcon}
          count={commentCount}
          textStyle={{ color: '#FBDD0D' }}
          iconStyle={{ tintColor: '#FBDD0D', height: 26, width: 26 }}
          onPress={() => {
            console.log(`${DEBUG_KEY}: user clicks suggest icon`);
            this.props.onPress(this.props.item);
          }}
        />
      </ActionButtonGroup>
    );
  }

  render() {
    const { item } = this.props;
    if (!item) return;

    const tabHeight = getTabHeight(this.state.navigationState, item);
    return (
      <View style={{ height: 450, marginTop: 4 }}>
        <View style={{ backgroundColor: '#f8f8f8', ...styles.borderShadow }}>
          <GoalCardHeader item={item} />
          <View style={{ backgroundColor: '#e5e5e5' }}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.containerStyle}
              onPress={() => this.props.onPress(this.props.item)}
            >
              <View style={{ marginTop: 14, marginBottom: 12, marginRight: 12, marginLeft: 12 }}>
                {this.renderUserDetail(item)}
                {this.renderCardContent(item)}
              </View>
            </TouchableOpacity>

            <View style={{ height: tabHeight }}>
              {this.renderTabs()}
            </View>

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
    chooseShareDest
  }
)(GoalCard);
