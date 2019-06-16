import React from 'react';
import {
  View,
  FlatList,
  Animated
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

// Components
import EmptyResult from '../../../Common/Text/EmptyResult';
// import CommentBox from '../../Common/CommentBoxV2';
import CommentCard from '../Comment/CommentCard';

// Assets

// Actions
import {
  goalDetailSwitchTabV2ByKey
} from '../../../../redux/modules/goal/GoalDetailActions';

import {
  resetCommentType
} from '../../../../redux/modules/feed/comment/CommentActions';

// Styles
import { BACKGROUND_COLOR } from '../../../../styles';

// Utils
import { switchCase } from '../../../../redux/middleware/utils';

// Selectors
import {
  getGoalDetailByTab,
  makeGetGoalPageDetailByPageId,
} from '../../../../redux/modules/goal/selector';

import {
  getCommentByTab,
  getNewCommentByTab,
  makeGetCommentByEntityId
} from '../../../../redux/modules/feed/comment/CommentSelector';

// Constants
const DEBUG_KEY = '[ UI FocusTab ]';
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const TABBAR_HEIGHT = 48.5;
const COMMENTBOX_HEIGHT = 43;
const TOTAL_HEIGHT = TABBAR_HEIGHT;

class FocusTab extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      keyboardHeight: 0,
      position: 'absolute',
      commentBoxPadding: new Animated.Value(0),
      keyboardDidShow: false
    };
    this.scrollToIndex = this.scrollToIndex.bind(this);
    this.handleHeadlineOnPressed = this.handleHeadlineOnPressed.bind(this);
  }

  componentDidMount() {
    console.log(`${DEBUG_KEY}: component did mount`);
    if (this.props.onRef !== null) {
      this.props.onRef(this);
    }
  }

  handleOnScrollToIndexFailed = (info) => {
    const { index, highestMeasuredFrameIndex, averageItemLength } = info;
    console.log(`${DEBUG_KEY}: [ handleOnScrollToIndexFailed ]: index: ${index}, highestMeasuredFrameIndex: ${highestMeasuredFrameIndex}`);
  }
  
  // Refresh goal detail and comments all together
  handleRefresh = () => {
    console.log(`${DEBUG_KEY}: user tries to refresh.`);
  }

  scrollToIndex = (index, viewOffset = 0, animated = true) => {
    this.flatlist.getNode().scrollToIndex({
    // this.flatlist.scrollToIndex({
      index,
      animated,
      viewPosition: 1,
      viewOffset
    });
  }

  handleHeadlineOnPressed = (focusType, focusRef) => {
    // Scroll to top without animation
    this.scrollToIndex(0, 0, false);

    // Switch to the focused item
    this.props.handleIndexChange(1, focusType, focusRef);
  }

  keyExtractor = (item) => {
    const { _id } = item;
    return _id;
  }

  dialogOnFocus = () => this.commentBox.focus();

  renderItem = (props) => {
    const { goalDetail } = this.props;
    return (
      <CommentCard
        key={`comment-${props.index}`}
        item={props.item}
        index={props.index}
        commentDetail={{ parentType: 'Goal', parentRef: goalDetail._id }}
        goalRef={goalDetail}
        scrollToIndex={(i, viewOffset) => this.scrollToIndex(i, viewOffset)}
        onCommentClicked={this.props.handleReplyTo}
        reportType='detail'
        pageId={this.props.pageId}
        entityId={this.props.goalId}
        onHeadlinePressed={this.handleHeadlineOnPressed}
      />
    );
  }

  render() {
    const { data, focusType, pageId, focusRef, initial } = this.props;
    if (!focusType) return null;
    const emptyText = switchCaseEmptyText(focusType);

    // const resetCommentTypeFunc = focusType === 'comment'
    //   ? () => this.props.resetCommentType('Comment', pageId)
    //   : () => this.props.resetCommentType('Suggestion', pageId);

    return (
      <View style={{ flex: 1, backgroundColor: 'transparent' }}>
        <AnimatedFlatList
          ref={ref => { this.flatlist = ref; }}
          data={data}
          initialNumToRender={40}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
          refreshing={this.props.loading || false}
          onRefresh={this.handleRefresh}
          onScrollToIndexFailed={this.handleOnScrollToIndexFailed}
          ListEmptyComponent={
            this.props.loading ? null :
            <EmptyResult
              text={emptyText}
              textStyle={{ paddingTop: 70 }}
            />
          }
          ListFooterComponent={<View style={{ height: 43, backgroundColor: 'transparent' }} />}
          onScroll={this.props.onScroll}
          scrollEventThrottle={1}
          contentContainerStyle={{ ...this.props.contentContainerStyle }}
          style={{ height: 200 }}
        />
        <Animated.View style={{ height: this.props.paddingBottom }} />
      </View>
    );
  }
}
const makeMapStateToProps = () => {
  const getGoalPageDetailByPageId = makeGetGoalPageDetailByPageId();
  const getCommentByEntityId = makeGetCommentByEntityId();

  const mapStateToProps = (state, props) => {
    const { pageId, goalId } = props;
    const newComment = getNewCommentByTab(state, pageId);
    // const goalDetail = getGoalDetailByTab(state);
    // const { goal, navigationStateV2 } = goalDetail;
    // const comments = getCommentByTab(state, props.pageId);

    const goalDetail = getGoalPageDetailByPageId(state, goalId, pageId);
    const { goal, goalPage } = goalDetail;
    const { navigationStateV2 } = goalPage;

    const { focusType, focusRef } = navigationStateV2;
    const comments = getCommentByEntityId(state, goalId, pageId);
    const { transformedComments, loading } = comments || {
      transformedComments: [],
      loading: false
    };
    // Initialize data by all comments
    let data = transformedComments;
  
    // console.log(`${DEBUG_KEY}: focusType is: ${focusType}, ref is: ${focusRef}`);
    if (focusType === 'step' || focusType === 'need') {
      // TODO: grab comments by step, filter by typeRef
      data = data.filter((comment) => {
        const isSuggestionForFocusRef = (
          comment.suggestion &&
          comment.suggestion.suggestionForRef &&
          comment.suggestion.suggestionForRef === focusRef
        );
        const isCommentForFocusRef = (
          _.get(comment, `${focusType}Ref`) === focusRef
        );


        if (isSuggestionForFocusRef || isCommentForFocusRef) {
              return true;
        }
        return false;
      });
    }
  
    return {
      newComment,
      data, // Comments of interest
      // loading: loading || goal.loading,
      loading: false,
      focusType,
      focusRef,
      goalDetail: goal
    };
  };

  return mapStateToProps;
};

const switchCaseEmptyText = (type) => switchCase({
  comment: 'No Comments',
  step: 'No suggestions for this step',
  need: 'No suggestions for this need'
})('comment')(type);

FocusTab.defaultPros = {
  focusType: undefined, // ['comment', 'step', 'need']
  focusRef: undefined,
  goalDetail: undefined,
  isSelf: false
};

export default connect(
  makeMapStateToProps,
  {
    goalDetailSwitchTabV2ByKey,
    resetCommentType
  },
  null,
  { withRef: true }
)(FocusTab);
