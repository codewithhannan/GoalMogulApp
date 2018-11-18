import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  MaskedViewIOS,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import { LinearGradient } from 'expo';
import { TabViewAnimated, SceneMap } from 'react-native-tab-view';
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
import SectionCard from '../Common/SectionCard';
import TabButtonGroup from '../Common/TabButtonGroup';
import ProgressBar from '../Common/ProgressBar';
import NextButton from '../Common/NextButton';
import NeedTab from './NeedTab';
import StepTab from './StepTab';
import { actionSheet, switchByButtonIndex } from '../../Common/ActionSheetFactory';
import ProfileImage from '../../Common/ProfileImage';

// Asset
import defaultProfilePic from '../../../asset/utils/defaultUserProfile.png';
import LoveIcon from '../../../asset/utils/love.png';
import BulbIcon from '../../../asset/utils/bulb.png';
import ShareIcon from '../../../asset/utils/forward.png';
import HelpIcon from '../../../asset/utils/help.png';
import StepIcon from '../../../asset/utils/steps.png';

// Constants
const { height } = Dimensions.get('window');
const CardHeight = height * 0.7;

const testNeed = [
  {
    text: 'Get in contact with Nuclear expert'
  },
  {
    text: 'Introduction to someone from Bill and Melinda Gates foundation'
  },
  {
    text: 'Introduction to someone from Bill and Melinda Gates foundation'
  },
];

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
const SHARE_TO_MENU_OPTTIONS = ['Share to feed', 'Share to an event', 'Share to a tribe', 'Cancel'];
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
      />
    ),
    steps: () => (
      <StepTab
        item={this.props.item.steps}
        onPress={() => this.props.onPress(this.props.item)}
        goalRef={this.props.item}
      />
    )
  });

  renderTabs() {
    return (
      <TabViewAnimated
        navigationState={this.state.navigationState}
        renderScene={this._renderScene}
        renderHeader={this._renderHeader}
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
          imageContainerStyle={{ marginTop: 7 }}
          imageUrl={owner && owner.profile ? owner.profile.image : undefined}
        />
        <View style={{ marginLeft: 15, flex: 1 }}>
          <Headline
            name={owner.name}
            category={category}
            caretOnPress={() => this.props.createReport(_id, 'goal', 'Goal')}
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
            color='#45C9F6'
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
      ? { backgroundColor: '#f9d6c9' }
      : { backgroundColor: 'white' };

    return (
      <ActionButtonGroup>
        <ActionButton
          iconSource={LoveIcon}
          count={likeCount}
          iconContainerStyle={likeButtonContainerStyle}
          iconStyle={{ tintColor: '#f15860' }}
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
          iconStyle={{ tintColor: '#a8e1a0', height: 32, width: 32 }}
          onPress={() => this.handleShareOnClick()}
        />
        <ActionButton
          iconSource={BulbIcon}
          count={commentCount}
          iconStyle={{ tintColor: '#f5eb6f', height: 26, width: 26 }}
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
      <View style={{ height: 450 }}>
        <View style={{ backgroundColor: '#f8f8f8', ...styles.borderShadow }}>
          <View style={{ backgroundColor: '#e5e5e5' }}>
            <View style={styles.containerStyle}>
              <View style={{ marginTop: 10, marginBottom: 12, marginRight: 12, marginLeft: 12 }}>
                {this.renderUserDetail(item)}
                {this.renderCardContent(item)}
              </View>
            </View>

            <View style={{ height: tabHeight }}>
              {this.renderTabs()}
            </View>

            <View style={styles.containerStyle}>
              {this.renderActionButtons(item)}
            </View>
          </View>
        </View>
        <NextButton onPress={() => console.log('next item')} />
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
  if (!dataToRender || dataToRender.length === 0) {
    return SECTION_CARD_HEIGHT + VIEW_GOAL_HEIGHT + TAB_HEADER_HEIGHT;
  }
  if (dataToRender.length < 3) {
    return ((dataToRender.length * SECTION_CARD_HEIGHT) + VIEW_GOAL_HEIGHT + TAB_HEADER_HEIGHT);
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
    color: '#45C9F6',
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
  }
};

export default connect(
  null,
  {
    createReport,
    likeGoal,
    unLikeGoal,
    chooseShareDest
  }
)(GoalCard);
