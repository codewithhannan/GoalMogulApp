/**
 * This is main subtab for GoalDetailCardV3. It contains the main components
 * for a goal. Steps, needs and all comment card.
 * On tab for each subcomponent, it will open FocusTab to render corresponding
 * focus content.
 */
import React from 'react';
import {
  FlatList,
  Animated
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

// Components
import EmptyResult from '../../../Common/Text/EmptyResult';
import StepAndNeedCardV3 from './StepAndNeedCardV3';

// Assets

// Actions
import {
  refreshGoalDetailById,
  goalDetailSwitchTabV2,
  goalDetailSwitchTabV2ByKey
} from '../../../../redux/modules/goal/GoalDetailActions';

import {
  createCommentFromSuggestion,
  createCommentForSuggestion
} from '../../../../redux/modules/feed/comment/CommentActions';

// Selectors
import {
  // getGoalStepsAndNeeds, // These are used before refactoring
  // getGoalDetailByTab, // These are used before refactoring
  makeGetGoalPageDetailByPageId,
  makeGetGoalStepsAndNeedsV2
} from '../../../../redux/modules/goal/selector';

// Styles
import { BACKGROUND_COLOR } from '../../../../styles';

// Constants
const DEBUG_KEY = '[ UI CentralTab ]';
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class CentralTab extends React.PureComponent {
  constructor(props) {
    super(props);
    this.scrollToOffset = this.scrollToOffset.bind(this);
  }

  scrollToOffset = (offset) => {
    this.flatlist.getNode().scrollToOffset({
      offset,
      animated: true
    });
  }

  // Refresh goal content and comment
  handleRefresh = () => {
    if (this.props.goalDetail) {
      this.props.refreshGoalDetailById(this.props.goalDetail._id, this.props.pageId);
    }
  }

  keyExtractor = (item) => {
    const { _id } = item;
    return _id;
  }

  renderItem = (props) => {
    const { goalDetail, pageId, goalId } = this.props;
    if (!goalDetail) return null;

    let newCommentParams = {
      commentDetail: {
        parentType: 'Goal',
        parentRef: goalDetail._id, // Goal ref
        commentType: 'Comment',
      },
      suggestionForRef: props.item._id, // Need or Step ref
      suggestionFor: props.item.type === 'need' ? 'Need' : 'Step'
    };

    if (props.item.type === 'need') {
      newCommentParams = _.set(newCommentParams, 'commentDetail.needRef', props.item._id);
    }
    if (props.item.type === 'step') {
      newCommentParams = _.set(newCommentParams, 'commentDetail.stepRef', props.item._id);
    }

    return (
      <StepAndNeedCardV3
        key={`mastermind-${props.index}`}
        item={props.item}
        goalRef={goalDetail}
        onCardPress={() => {
          // Use passed in function to handle tab switch with animation
          this.props.handleIndexChange(1, props.item.type, props.item._id);
          this.props.createCommentForSuggestion(newCommentParams, pageId);
        }}
        isSelf={this.props.isSelf}
        count={props.item.count}
        pageId={pageId}
        goalId={goalId}
      />
    );
  }

  render() {
    const { data } = this.props;
    return (
      <AnimatedFlatList
        ref={ref => (this.flatlist = ref)}
        data={data}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        refreshing={this.props.loading || false}
        onRefresh={this.handleRefresh}
        ListEmptyComponent={
          this.props.loading ? null :
          <EmptyResult
            text='No steps or needs'
            textStyle={{ paddingTop: 70 }}
          />
        }
        {...this.props}
        scrollEventThrottle={2}
      />
    );
  }
}

CentralTab.defaultPros = {
  data: [],
  goalDetail: undefined,
  isSelf: false
};

const makeMapStateToProps = () => {
  const getGoalPageDetailByPageId = makeGetGoalPageDetailByPageId();
  const getGoalStepsAndNeedsV2 = makeGetGoalStepsAndNeedsV2();

  const mapStateToProps = (state, props) => {
    const { pageId, goalId } = props;
    const goalDetail = getGoalPageDetailByPageId(state, goalId, pageId);
    // const goalDetail = getGoalDetailByTab(state); // These are used before refactoring
    const { goal, goalPage } = goalDetail;
    let loading = false;
    if (goalPage) {
      loading = goalPage.loading;
    }
  
    return {
      goalDetail: goal,
      loading,
      // data: getGoalStepsAndNeeds(state, props.pageId), // These are used before refactoring
      data: getGoalStepsAndNeedsV2(state, goalId, pageId)
    };
  };

  return mapStateToProps;
};


export default connect(
  makeMapStateToProps,
  {
    goalDetailSwitchTabV2,
    goalDetailSwitchTabV2ByKey,
    refreshGoalDetailById,
    createCommentFromSuggestion,
    createCommentForSuggestion
  },
  null,
  { withRef: true }
)(CentralTab);
