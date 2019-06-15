import React, { Component } from 'react';
import {
  View,
  Animated,
  Dimensions,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Keyboard
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  MenuProvider
} from 'react-native-popup-menu';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { Constants } from 'expo';
import {
  DotIndicator
} from 'react-native-indicators';
import { copilot } from 'react-native-copilot-gm';

// Actions
import {
  closeGoalDetail,
  closeGoalDetailWithoutPoping,
  goalDetailSwitchTabV2,
  goalDetailSwitchTabV2ByKey,
  editGoal,
  markGoalAsComplete,
  refreshGoalDetailById
} from '../../../redux/modules/goal/GoalDetailActions';

import {
  attachSuggestion,
  cancelSuggestion,
  openSuggestionModal,
  removeSuggestion,
  createCommentFromSuggestion,
  createCommentForSuggestion,
  resetCommentType,
  updateNewComment,
  createSuggestion,
  refreshComments
} from '../../../redux/modules/feed/comment/CommentActions';

import {
  showNextTutorialPage,
  startTutorial,
  updateNextStepNumber
} from '../../../redux/modules/User/TutorialActions';

// selector
import {
  // getGoalStepsAndNeeds,
  // getGoalDetailByTab,
  // makeGetGoalDetailById,
  makeGetGoalPageDetailByPageId,
  makeGetGoalStepsAndNeedsV2
} from '../../../redux/modules/goal/selector';

import {
  // getCommentByTab,
  getNewCommentByTab,
  makeGetCommentByEntityId
} from '../../../redux/modules/feed/comment/CommentSelector';

// Component
import SearchBarHeader from '../../Common/Header/SearchBarHeader';
import LoadingModal from '../../Common/Modal/LoadingModal';
import SuggestionModal from './SuggestionModal3';
import CentralTab from './V3/CentralTab';
import FocusTab from './V3/FocusTab';
import SectionCardV2 from '../Common/SectionCardV2';
import CommentBox from '../Common/CommentBoxV2';
import GoalDetailSection from './GoalDetailSection';

// Assets
import next from '../../../asset/utils/next.png';
import allComments from '../../../asset/utils/allComments.png';

// Styles
import {
  BACKGROUND_COLOR,
  // APP_BLUE
} from '../../../styles';
import { Logger } from '../../../redux/middleware/utils/Logger';
import { constructMenuName, getParentCommentId } from '../../../redux/middleware/utils';
import Tooltip from '../../Tutorial/Tooltip';

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width
};

const HEADER_HEIGHT = 240; // Need to be calculated in the state later based on content length
const COLLAPSED_HEIGHT = 30 + Constants.statusBarHeight;
const DEBUG_KEY = '[ UI GoalDetailCardV3 ]';
const TABBAR_HEIGHT = 48.5;
// const COMMENTBOX_HEIGHT = 43;
const TOTAL_HEIGHT = TABBAR_HEIGHT;
const COMPONENT_NAME = 'goalDetail';

class GoalDetailCardV3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scroll: new Animated.Value(0),
      // Following are state for CommentBox
      position: 'absolute',
      commentBoxPadding: new Animated.Value(0),
      focusTabBottomPadding: new Animated.Value(0),
      keyboardDidShow: false,
      cardHeight: HEADER_HEIGHT,
      centralTabContentOffset: 0,
      goalCardzIndex: 2
    };
    this.onContentSizeChange = this.onContentSizeChange.bind(this);
    this._renderScene = this._renderScene.bind(this);
    this._renderTabBar = this._renderTabBar.bind(this);
    this._handleIndexChange = this._handleIndexChange.bind(this);
    this.onViewCommentPress = this.onViewCommentPress.bind(this);
    this.handleReplyTo = this.handleReplyTo.bind(this);
    this.getFocusedItem = this.getFocusedItem.bind(this);
    this.keyboardWillShow = this.keyboardWillShow.bind(this);
    this.keyboardWillHide = this.keyboardWillHide.bind(this);
    this.handleScrollToCommentItem = this.handleScrollToCommentItem.bind(this);
    this.focusTab = undefined;
  }

  componentDidUpdate(prevProps) {
    if (!this.props.hasShown && !prevProps.showTutorial && this.props.showTutorial === true) {
      console.log(`${DEBUG_KEY}: [ componentDidUpdate ]: tutorial start: `, this.props.nextStepNumber);
      this.goalDetailSection.openHeadlineMenu();
      setTimeout(() => {
        this.props.start();
      }, 500);
    }
  }

  componentDidMount() {
    this.state.scroll.addListener(({ value }) => { this._value = value; });    
    this.keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow', this.keyboardWillShow);
    this.keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide', this.keyboardWillHide);

    // Listeners for tutorial
    this.props.copilotEvents.on('stop', () => {
      console.log(`${DEBUG_KEY}: [ componentDidMount ]: [ copilotEvents ] 
        tutorial stop. show next page. Next step number is: `, this.props.nextStepNumber);
      
      this.props.showNextTutorialPage('goal_detail', 'goal_detail_page');
    });

    this.props.copilotEvents.on('stepChange', (step) => {
      const { name, order, visible, target, wrapper } = step;
      console.log(`${DEBUG_KEY}: [ onStepChange ]: step order: ${order}, step visible: ${name} `);

      // We showing current order. SO the next step should be order + 1
      this.props.updateNextStepNumber('goal_detail', 'goal_detail_page', order + 1);
    });

    // Start tutorial if not previously shown
    if (!this.props.hasShown) {
      // TODO: @Jia Tutorial to uncomment
      setTimeout(() => {
        this.props.startTutorial('goal_detail', 'goal_detail_page');
      }, 400);
    }

    const { initial, goalDetail, goalId, pageId, tab } = this.props;

    // On comment loaded, scroll to corresponding comment item if needed
    const refreshCommentsCallback = initial && initial.initialScrollToComment && initial.commentId
      ? () => this.handleScrollToCommentItem(initial.commentId)
      : undefined;

    this.props.refreshComments('Goal', goalId, tab, pageId, refreshCommentsCallback);

    if (initial && initial.refreshGoal !== false) {
      this.props.refreshGoalDetailById(goalId, pageId);
    }

    console.log(`${DEBUG_KEY}: did mount with goalId: ${goalId}, pageId: ${pageId}`);
    if (initial && !_.isEmpty(initial)) {
      const { 
        focusType, 
        focusRef, 
        initialShowSuggestionModal, // Boolean to determine if we show suggestion modal on open
        initialFocusCommentBox, // Boolean to determine if we focus on comment box initially
        initialShowGoalModal, // Boolean to determine if we open goal edition modal
        initialUnMarkGoalAsComplete, // Boolean to determine if we unmark a goal as complete
        initialMarkGoalAsComplete, // Boolean to determine if we mark a goal as complete
        showCaret // Boolean to determine if we open caret on the top right for goal
      } = initial;
      let newCommentParams = {
        commentDetail: {
          parentType: 'Goal',
          parentRef: goalDetail._id, // Goal ref
          commentType: 'Comment'
        },
        suggestionForRef: focusRef, // Need or Step ref
        suggestionFor: focusType === 'need' ? 'Need' : 'Step'
      };

      // Open Create Goal Modal for edition
      if (initialShowGoalModal) {
        setTimeout(() => {
          this.props.editGoal(goalDetail, pageId);
        }, 500);
        return;
      }

      if (initialMarkGoalAsComplete) {
        this.props.markGoalAsComplete(goalId, true, pageId);
        return;
      }

      if (initialUnMarkGoalAsComplete) {
        this.props.markGoalAsComplete(goalId, false, pageId);
        return;
      }

      // Add needRef and stepRef for item
      if (focusType === 'need') {
        newCommentParams = _.set(newCommentParams, 'commentDetail.needRef', focusRef);
      }
      if (focusType === 'step') {
        newCommentParams = _.set(newCommentParams, 'commentDetail.stepRef', focusRef);
      }

      this.props.goalDetailSwitchTabV2ByKey('focusTab', focusRef, focusType, goalId, pageId);
      this.props.createCommentForSuggestion(newCommentParams, pageId);
      if (initialShowSuggestionModal) {
        // Show suggestion modal if initialShowSuggestionModal is true
        // Current source is NotificationNeedCard on suggestion pressed
        console.log(`${DEBUG_KEY}: i am opening suggestion modal`);
        setTimeout(() => {
          this.props.createSuggestion(goalId, pageId);
        }, 500);
      }

      console.log(`${DEBUG_KEY}: initial is: `, initial);
      if (initialFocusCommentBox) {
        // Focus on comment box if initialFocusCommentBox is true
        // To reduce taps to enable comment functions
        setTimeout(() => {
          console.log(`${DEBUG_KEY}: calling handleReplyTo`);
          this.handleReplyTo();
        }, 500);        
      }

      if (showCaret) {
        if (this.goalDetailSection !== undefined) {
          setTimeout(() => {
            this.goalDetailSection.openHeadlineMenu();
          }, 300);
        }
      }
    }

    this.handleOnCommentSubmitEditing = this.handleOnCommentSubmitEditing.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    // console.log(`${DEBUG_KEY}: next props are: `, nextProps);
    return !_.isEqual(this.props, nextProps);
  }

  componentWillUnmount() {
    const { goalId, pageId } = this.props;
    console.log(`${DEBUG_KEY}: unmounting goal: ${goalId}, page: ${pageId}`);
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
    this.state.scroll.removeAllListeners();
    this.props.closeGoalDetailWithoutPoping(goalId, pageId);

    // Remove tutorial listener
    this.props.copilotEvents.off('stop');
    this.props.copilotEvents.off('stepChange');
  }

  // Switch tab to FocusTab and display all the comments
  onViewCommentPress = () => {
    console.log(`${DEBUG_KEY}: User opens all comments.`);
    const { goalId, pageId } = this.props;
    this.setState({
      ...this.state,
      centralTabContentOffset: this.state.scroll._value
    });

    this.props.goalDetailSwitchTabV2ByKey('focusTab', undefined, 'comment', goalId, pageId);
    Animated.timing(this.state.scroll, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true
    }).start();
  }

  // Handle on GoalDetailSection content size change to update the height
  onContentSizeChange(cardHeight) {
    // console.log('new card height: ', cardHeight);
    this.setState({
      ...this.state,
      cardHeight: cardHeight + 48
    });
  }

  // Can be replaced by memorized selector
  getFocusedItem(focusType, focusRef, goalDetail) {
    const type = focusType === 'step' ? 'steps' : 'needs';
    let focusedItem = { description: '', isCompleted: false };
    if (_.has(goalDetail, `${type}`)) {
      _.get(goalDetail, `${type}`).forEach((item) => {
        if (item._id === focusRef) {
          focusedItem = _.cloneDeep(item);
        }
      });
    }
    return focusedItem;
  }

  keyboardWillShow = (e) => {
    // console.log(`${DEBUG_KEY}: [ ${this.props.pageId} ]: keyboard will show`);
    // console.log(`${DEBUG_KEY}: [ ${this.props.pageId} ]: ${Actions.currentScene}`);
    const { focusType } = this.props.navigationState;

    // Keyboard listener will fire when goal edition modal is opened
    if (focusType === undefined) return;

    this.setState({
      ...this.state,
      goalCardzIndex: 0 // set the zIndex to enable scroll on the goal card
    });

    this.forceUpdate(); // Force update to re-render

    const timeout = ((TOTAL_HEIGHT * 210) / e.endCoordinates.height);
    Animated.sequence([
      Animated.delay(timeout),
      Animated.parallel([
        Animated.timing(this.state.commentBoxPadding, {
          toValue: e.endCoordinates.height - TOTAL_HEIGHT,
          duration: (210 - timeout)
        }),
        Animated.timing(this.state.focusTabBottomPadding, {
          toValue: e.endCoordinates.height - TOTAL_HEIGHT,
          duration: (210 - timeout)
        })
      ])
    ]).start();
  }

  keyboardWillHide = () => {
    // console.log(`${DEBUG_KEY}: [ ${this.props.pageId} ]: keyboard will hide`);
    this.setState({
      ...this.state,
      keyboardDidShow: false,
      goalCardzIndex: 2 // reset the zIndex to enable buttons on the goal card
    });

    // Force update to re-render
    // We should find a better way to solve this triggering reupdate
    this.forceUpdate();
    
    Animated.parallel([
      Animated.timing(this.state.commentBoxPadding, {
        toValue: 0,
        duration: 210
      }),
      Animated.timing(this.state.focusTabBottomPadding, {
        toValue: 0,
        duration: 210
      })
    ]).start();
  }

  /**
   * Scroll to a comment item from wherever
   */
  handleScrollToCommentItem = (commentId) => {
    this._handleIndexChange(1, 'comment', undefined);
    const { originalComments, comments } = this.props;

    Logger.log(`${DEBUG_KEY}: [ handleScrollToCommentItem ]: originalComments`, originalComments, 2);
    const parentCommentId = getParentCommentId(commentId, originalComments);

    Logger.log(`${DEBUG_KEY}: [ handleScrollToCommentItem ]: commentId`, commentId, 2);
    if (!parentCommentId) return; // Do nothing since it's no loaded. Defensive coding
    
    Logger.log(`${DEBUG_KEY}: [ handleScrollToCommentItem ]: parentCommentId`, parentCommentId, 2);
    const parentCommentIndex = comments.findIndex(c => c._id === parentCommentId);
    if (this.focusTab === undefined || parentCommentIndex === -1) return;

    Logger.log(`${DEBUG_KEY}: [ handleScrollToCommentItem ]: parentCommentIndex`, parentCommentIndex, 2);
    setTimeout(() => {
      this.focusTab.scrollToIndex(parentCommentIndex);
    }, 500);
  }

  handleReplyTo = (type) => {
    this.setState({
      ...this.state,
      keyboardDidShow: true
    });
    if (this.commentBox !== undefined) {
      console.log(`${DEBUG_KEY}: [ ${this.props.pageId} ]: [ handleReplyTo ]`);
      this.commentBox.focusForReply(type);
    } else {
      console.warn(`${DEBUG_KEY}: [ handleReplyTo ] this.commentBox is undefined!`);
    }
  }

  handleOnCommentSubmitEditing = () => {
    Logger.log(`${DEBUG_KEY}: [ handleOnCommentSubmitEditing ]`, null, 2);
    const { focusType } = this.props.navigationState;
    const { newComment } = this.props;
    if (newComment && newComment.contentText && !_.isEmpty(newComment.contentText)) {
      return;
    }

    if (!newComment) {
      console.warn(`${DEBUG_KEY}: [ handleOnCommentSubmitEditing ]: newComment is undefined. Something is wrong.`);
    }
    // Since the contentText is empty, reset the replyToRef and commentType
    // Update new comment
    const newCommentType = focusType === 'comment' ? 'Comment' : 'Suggestion';
    let commentToReturn = _.cloneDeep(newComment);
    commentToReturn = _.set(commentToReturn, 'replyToRef', undefined);
    commentToReturn = _.set(commentToReturn, 'commentType', newCommentType);
    this.props.updateNewComment(commentToReturn, this.props.pageId);
  }

  /**
   * Tab related handlers
   * focusType: ['comment', 'need', 'step']
   */
  _handleIndexChange = (index, focusType, focusRef) => {
    // TODO: change to v2
    const { navigationState, pageId, goalId } = this.props;
    if (navigationState.routes[index].key === 'centralTab') {
      // Remove suggestion for the previous focused item
      this.props.removeSuggestion(pageId);
      this.props.goalDetailSwitchTabV2ByKey('centralTab', undefined, undefined, goalId, pageId);
      Animated.timing(this.state.scroll, {
        toValue: this.state.centralTabContentOffset,
        duration: 450,
        useNativeDriver: true
      }).start();
      return;
    }

    // Only record the scroll if we are switching tab.
    // This method can be called in the same tab
    if (navigationState && navigationState.index !== index) {
      this.setState({
        ...this.state,
        centralTabContentOffset: this.state.scroll._value
      });
    }
    
    this.props.goalDetailSwitchTabV2ByKey(
      'focusTab', focusRef, focusType, goalId, pageId
    );
    
    Animated.timing(this.state.scroll, {
      toValue: new Animated.Value(0),
      duration: 300,
      useNativeDriver: true
    }).start();
  };

  _renderScene = ({ route }) => {
    switch (route.key) {
      case 'centralTab':
        return (
          <CentralTab
            ref={(ref) => (this.centralTabScrollView = ref)}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: this.state.scroll } } }],
              { useNativeDriver: true }
            )}
            contentContainerStyle={{ 
              paddingTop: this.state.cardHeight + 10, 
              flexGrow: 1
            }}
            contentOffset={{ y: this.state.centralTabContentOffset }}
            isSelf={this.props.isSelf}
            handleIndexChange={this._handleIndexChange}
            pageId={this.props.pageId}
            goalId={this.props.goalId}
          />
        );

      case 'focusTab':
        return (
          <FocusTab
            onRef={(ref) => { this.focusTab = ref; }}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: this.state.scroll } } }],
              { useNativeDriver: true }
            )}
            contentContainerStyle={{ 
              paddingTop: this.state.cardHeight + 20, 
              flexGrow: 1
            }}
            paddingBottom={this.state.focusTabBottomPadding}
            pageId={this.props.pageId}
            goalId={this.props.goalId}
            handleReplyTo={this.handleReplyTo}
            isSelf={this.props.isSelf}
            handleIndexChange={this._handleIndexChange}
            initial={this.props.initial}
          />
        );

      default: return null;
    }
  }

  // _renderScene = SceneMap({
  //   centralTab: CentralTab,
  //   focusTab: FocusTab
  // })
  _renderTabBar = (props) => {
    const translateY = this.state.scroll.interpolate({
      inputRange: [0, (this.state.cardHeight - COLLAPSED_HEIGHT)],
      outputRange: [0, -(this.state.cardHeight - COLLAPSED_HEIGHT)],
      extrapolate: 'clamp',
    });

    const { goalDetail, goalId, pageId } = this.props;
    return (
      <Animated.View 
        style={[styles.header, { transform: [{ translateY }], zIndex: this.state.goalCardzIndex }]}
      >
        <View style={{ height: this.state.cardHeight, backgroundColor: 'white' }}>
          <GoalDetailSection
            onRef={(ref) => { this.goalDetailSection = ref; }}
            item={goalDetail}
            onSuggestion={() => {
              // Goes to central tab by opening all comments
              this.props.goalDetailSwitchTabV2ByKey(
                'focusTab', undefined, 'comment', goalId, pageId
              );
              setTimeout(() => {
                console.log(`${DEBUG_KEY}: [ UI GoalDetailSectoin ]: calling handleReplyTo from onSuggestion`);
                this.handleReplyTo();
              }, 500);  
            }}
            isSelf={this.props.isSelf}
            onContentSizeChange={this.onContentSizeChange}
            pageId={pageId}
            goalId={goalId}
            menuName={constructMenuName(COMPONENT_NAME, this.props.pageId)}
          />
          <View style={{ borderBottomWidth: 0.5, borderColor: '#e5e5e5' }} />
          {this.renderFocusedItem()}
          {this.renderCommentCTR()}
        </View>
      </Animated.View>
    );
  }

  /**
   * Render focused item.
   */
  renderFocusedItem() {
    const { goalDetail, navigationState } = this.props;
    const { focusType, focusRef } = navigationState;
    if (!focusType) return null;
    const focusedItem = this.getFocusedItem(focusType, focusRef, goalDetail);

    return (
      <View style={{ zIndex: 2 }}>
        <SectionCardV2
          type={focusType}
          goalRef={goalDetail}
          item={focusedItem}
          isFocusedItem
          isSelf={this.props.isSelf}
          onBackPress={() => this._handleIndexChange(0)}
          onContentSizeChange={this.props.onContentSizeChange}
          count={this.props.focusedItemCount}
          pageId={this.props.pageId}
          goalId={this.props.goalId}
        />
      </View>
    );
  }

  // Entry points to open comment subcomponent
  renderCommentCTR() {
    const { goalDetail, navigationState } = this.props;
    const { commentCount } = goalDetail;
    const { focusType } = navigationState;
    if (focusType) return null;
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        style={{ paddingTop: 10, backgroundColor: BACKGROUND_COLOR }}
        onPress={this.onViewCommentPress}
      >
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            backgroundColor: 'white',
          }}
        >
          <View style={styles.iconContainerStyle}>
            <Image style={styles.commentIconStyle} source={allComments} />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, color: '#616161' }}>
              All comments {commentCount}
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={this.onViewCommentPress}
            style={styles.iconContainerStyle}
          >
            <Image source={next} style={[styles.nextIconStyle, { opacity: 0.8 }]} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

  renderCommentBox(focusType, pageId) {
    Logger.log(`${DEBUG_KEY}: [ renderCommentBox ]: for [ ${this.props.pageId} ]: focusType is: `, focusType, 2);
    if (!focusType) return null;

    const resetCommentTypeFunc = focusType === 'comment'
      ? () => this.props.resetCommentType('Comment', pageId)
      : () => this.props.resetCommentType('Suggestion', pageId);

    return (
      <Animated.View
        style={[
          styles.composerContainer, {
            position: this.state.position,
            paddingBottom: this.state.commentBoxPadding,
            backgroundColor: 'white',
            zIndex: 3
          }
        ]}
      >
        <CommentBox
          onRef={(ref) => { this.commentBox = ref; }}
          hasSuggestion
          onSubmitEditing={this.handleOnCommentSubmitEditing}
          resetCommentType={resetCommentTypeFunc}
          initial={this.props.initial}
          pageId={this.props.pageId}
          goalId={this.props.goalId}
        />
      </Animated.View>
    );
  }

  render() {
    const { goalDetail, navigationState, pageId, goalId } = this.props;
    // Logger.log('transformed comments to render are: ', goalDetail, 1);
    if (!goalDetail || _.isEmpty(goalDetail)) return null;
    const { focusType, focusRef } = navigationState;

    return (
      <MenuProvider customStyles={{ backdrop: styles.backdrop }}>
        <View style={styles.containerStyle}>
          <LoadingModal 
            visible={this.props.updating} 
            customIndicator={<DotIndicator size={12} color='white' />}  
          />
          <SearchBarHeader
            backButton
            title='Goal'
            onBackPress={() => this.props.closeGoalDetail(goalId, pageId)}
          />
          <TabView
            style={{ flex: 1 }}
            navigationState={this.props.navigationState}
            renderScene={this._renderScene}
            renderTabBar={this._renderTabBar}
            initialLayout={initialLayout}
            onIndexChange={index => this._handleIndexChange(index)}
            swipeEnabled={navigationState.focusType !== undefined}
          />
          {this.renderCommentBox(focusType, pageId)}
          <SuggestionModal
            visible={this.props.showSuggestionModal}
            onCancel={() => {
              // Programmatically focus textinput to avoid floating input bug
              this.handleReplyTo();
              this.props.cancelSuggestion(pageId);
            }}
            onAttach={() => {
              // Programmatically focus textinput to avoid floating input bug
              this.handleReplyTo();
              this.props.attachSuggestion(goalDetail, focusType, focusRef, pageId);
            }}
            pageId={this.props.pageId}
            goalId={this.props.goalId}
            item={goalDetail}
          />
          {/** <Report showing={this.props.showingModalInDetail} /> */}
        </View>
      </MenuProvider>
    );
  }
}

const styles = StyleSheet.create({
  composerContainer: {
    left: 0,
    right: 0,
    bottom: 0
  },
  containerStyle: {
    backgroundColor: BACKGROUND_COLOR, 
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  iconContainerStyle: {
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20
  },
  commentIconStyle: {
    width: 28,
    height: 20,
    tintColor: '#616161'
  },
  nextIconStyle: {
    height: 25,
    width: 26,
    transform: [{ rotateY: '180deg' }],
    tintColor: '#17B3EC'
  },
  iconStyle: {
    alignSelf: 'center',
    fontSize: 20,
    marginLeft: 5,
    marginTop: 2
  },
  backdrop: {
    backgroundColor: 'gray',
    opacity: 0.5
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1
  }
});

const makeMapStateToProps = () => {
  const getGoalPageDetailByPageId = makeGetGoalPageDetailByPageId();
  const getCommentByEntityId = makeGetCommentByEntityId();
  const getGoalStepsAndNeedsV2 = makeGetGoalStepsAndNeedsV2();

  const mapStateToProps = (state, props) => {
    const { pageId, goalId } = props;
    const newComment = getNewCommentByTab(state, pageId);
    // Following two lines are used before refactoring
    // const goalDetail = getGoalDetailByTab(state);
    // const comments = getCommentByTab(state, pageId);
    const goalDetail = getGoalPageDetailByPageId(state, goalId, pageId);
    const { goal, goalPage } = goalDetail;

    const { navigationStateV2, updating } = goalPage;

  
    const { showingModalInDetail } = state.report;
    const { userId } = state.user;

    const comments = getCommentByEntityId(state, goalId, pageId);
    const { data, transformedComments, loading } = comments || {
      transformedComments: [],
      loading: false,
      data: []
    };
  
    const { focusType, focusRef } = navigationStateV2;
    const focusedItemCount = getFocusedItemCount(transformedComments, focusType, focusRef);
    const isSelf = userId === (!goal || _.isEmpty(goal) ? '' : goal.owner._id);

    // Tutorial related
    const { tutorialText, hasShown, showTutorial } = state.tutorials.goal_detail.goal_detail_page;
  
    return {
      commentLoading: loading,
      stepsAndNeeds: getGoalStepsAndNeedsV2(state, goalId, pageId),
      comments: transformedComments,
      originalComments: data, // All comments in raw form
      goalDetail: goal,
      navigationState: navigationStateV2,
      showingModalInDetail,
      showSuggestionModal: newComment ? newComment.showSuggestionModal : false,
      isSelf,
      tab: state.navigation.tab,
      // When on focusTab, show the count for focusedItem
      focusedItemCount,
      updating,
      newComment,
      // Tutorial related
      tutorialText, hasShown, showTutorial
    };
  };

  return mapStateToProps;
};

const getFocusedItemCount = (comments, focusType, focusRef) => {
  // Initialize data by all comments
  // console.log(`type is: ${focusType}, ref is: ${focusRef}, count is: ${comments.length}`);
  const refPath = focusType === 'need' ? 'needRef' : 'stepRef';
  let rawComments = comments;
  let focusedItemCount = 0;
  // console.log(`${DEBUG_KEY}: focusType is: ${focusType}, ref is: ${focusRef}`);
  if (focusType === 'step' || focusType === 'need') {
    // TODO: grab comments by step, filter by typeRef
    rawComments = rawComments.filter((comment) => {

      // Check if a comment is a suggestion for a step or a need
      const isSuggestionForFocusRef = (comment.suggestion &&
        comment.suggestion.suggestionForRef &&
        comment.suggestion.suggestionForRef === focusRef);
      
      // Check if a comment is a comment for a step or a need
      const isCommentForFocusRef = (_.get(comment, `${refPath}`) === focusRef); 
      if (isCommentForFocusRef || isSuggestionForFocusRef) {
            return true;
      }
      return false;
    });

    rawComments.forEach(c => {
      if (c.childComments && c.childComments.length > 0) {
        // Count all the childComments
        focusedItemCount += c.childComments.length;
      }
      // Count the current comment
      focusedItemCount += 1;
    });
  }

  if (focusType === 'comment') {
    focusedItemCount = rawComments.length;
  }

  return focusedItemCount;
};

const GoalDetailCardV3Explained = copilot({
  overlay: 'svg', // or 'view'
  animated: true, // or false
  stepNumberComponent: () => <View />,
  tooltipComponent: Tooltip
})(GoalDetailCardV3);

export default connect(
  makeMapStateToProps,
  {
    closeGoalDetail,
    closeGoalDetailWithoutPoping,
    attachSuggestion,
    cancelSuggestion,
    openSuggestionModal,
    goalDetailSwitchTabV2,
    goalDetailSwitchTabV2ByKey,
    removeSuggestion,
    createCommentFromSuggestion,
    resetCommentType,
    updateNewComment,
    createCommentForSuggestion,
    createSuggestion,
    editGoal,
    markGoalAsComplete,
    refreshGoalDetailById,
    refreshComments,
    // Tutorial related
    showNextTutorialPage,
    startTutorial,
    updateNextStepNumber,
  }
)(GoalDetailCardV3Explained);
