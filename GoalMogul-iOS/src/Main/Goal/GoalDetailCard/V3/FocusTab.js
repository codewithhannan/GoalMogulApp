import React from 'react';
import {
  View,
  FlatList,
  Animated,
  StyleSheet,
  Keyboard
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

// Components
import EmptyResult from '../../../Common/Text/EmptyResult';
import CommentBox from '../../Common/CommentBox';
import CommentCard from '../Comment/CommentCard';

// Assets

// Actions
import {
  goalDetailSwitchTabV2ByKey
} from '../../../../redux/modules/goal/GoalDetailActions';

// Styles
import { BACKGROUND_COLOR } from '../../../../styles';

// Utils
import { switchCase } from '../../../../redux/middleware/utils';

// Selectors
import {
  getGoalDetailByTab
} from '../../../../redux/modules/goal/selector';

import {
  getCommentByTab,
  getNewCommentByTab
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
  }

  componentDidMount() {
    console.log(`${DEBUG_KEY}: did mount.`);
    this.keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow', this.keyboardWillShow);
    this.keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide', this.keyboardWillHide);
  }

  componentWillUnmount() {
    console.log(`${DEBUG_KEY}: unmounting.`);
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
  }

  keyboardWillShow = (e) => {
    // this.flatlist.getNode().scrollToOffset({
    // // this.flatlist.scrollToOffset({
    //   offset: e.endCoordinates.height - TOTAL_HEIGHT,
    //   animated: true
    // });
    if (!this.state.keyboardDidShow) {
      this.handleReplyTo();
    }
    const timeout = ((TOTAL_HEIGHT * 210) / e.endCoordinates.height);
    Animated.sequence([
      Animated.delay(timeout),
      Animated.timing(this.state.commentBoxPadding, {
        toValue: e.endCoordinates.height - TOTAL_HEIGHT,
        duration: (210 - timeout)
      })
    ]).start();
  }

  keyboardWillHide = () => {
    Animated.timing(this.state.commentBoxPadding, {
      toValue: 0,
      duration: 210
    }).start();
    this.setState({
      ...this.state,
      keyboardDidShow: false
    });
  }

  // Refresh goal detail and comments all together
  handleRefresh = () => {
    console.log(`${DEBUG_KEY}: user tries to refresh.`);
  }

  handleOnCommentSubmitEditing = () => {
    const { newComment } = this.props;
    if (newComment && newComment.contentText && !_.isEmpty(newComment.contentText)) {
      return;
    }
    // Since the contentText is empty, reset the replyToRef and commentType
    // Update new comment
    const newCommentType = this.props.focusType === 'comment' ? 'Comment' : 'Suggestion';
    let commentToReturn = _.cloneDeep(newComment);
    commentToReturn = _.set(commentToReturn, 'replyToRef', undefined);
    commentToReturn = _.set(commentToReturn, 'commentType', newCommentType);
    this.props.updateNewComment(commentToReturn, this.props.pageId);
  }

  scrollToIndex = (index, viewOffset = 0) => {
    this.flatlist.getNode().scrollToIndex({
    // this.flatlist.scrollToIndex({
      index,
      animated: true,
      viewPosition: 1,
      viewOffset
    });
  }

  keyExtractor = (item) => {
    const { _id } = item;
    return _id;
  }

  dialogOnFocus = () => this.commentBox.focus();

  handleReplyTo = () => {
    this.setState({
      ...this.state,
      keyboardDidShow: true
    });
    this.commentBox.focusForReply();
  }

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
        onCommentClicked={() => this.handleReplyTo()}
        reportType='detail'
      />
    );
  }

  render() {
    const { data, focusType } = this.props;
    if (!focusType) return '';
    const emptyText = switchCaseEmptyText(focusType);
    return (
      <View style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}>
        <AnimatedFlatList
          ref={ref => { this.flatlist = ref; }}
          data={data}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
          refreshing={this.props.loading || false}
          onRefresh={this.handleRefresh}
          ListEmptyComponent={
            this.props.loading ? '' :
            <EmptyResult
              text={emptyText}
              textStyle={{ paddingTop: 110 }}
            />
          }
          ListFooterComponent={<View style={{ height: 43, backgroundColor: 'transparent' }} />}
          onScroll={this.props.onScroll}
          scrollEventThrottle={1}
          contentContainerStyle={{ ...this.props.contentContainerStyle }}
          style={{ height: 200 }}
        />
        <Animated.View
          style={[
            styles.composerContainer, {
              position: this.state.position,
              paddingBottom: this.state.commentBoxPadding,
              backgroundColor: 'white'
            }
          ]}
        >
          <CommentBox
            onRef={(ref) => { this.commentBox = ref; }}
            hasSuggestion
            onSubmitEditing={this.handleOnCommentSubmitEditing}
          />
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  composerContainer: {
    left: 0,
    right: 0,
    bottom: 0
  }
});

const mapStateToProps = (state, props) => {
  const newComment = getNewCommentByTab(state, props.pageId);
  const goalDetail = getGoalDetailByTab(state);
  const { goal, navigationStateV2 } = goalDetail;
  const { focusType, focusRef } = navigationStateV2;
  const comments = getCommentByTab(state, props.pageId);
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
      if (comment.suggestion &&
          comment.suggestion.suggestionForRef &&
          comment.suggestion.suggestionForRef === focusRef) {
            return true;
      }
      return false;
    });
  }

  return {
    newComment,
    data, // Comments of interest
    // loading: loading || goal.loading,
    focusType,
    focusRef,
    goalDetail: goal
  };
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
  mapStateToProps,
  {
    goalDetailSwitchTabV2ByKey
  }
)(FocusTab);
