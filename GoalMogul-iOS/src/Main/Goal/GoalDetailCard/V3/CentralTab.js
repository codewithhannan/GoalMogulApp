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

// Components
import EmptyResult from '../../../Common/Text/EmptyResult';
import StepAndNeedCardV3 from './StepAndNeedCardV3';

// Assets

// Actions
import {
  goalDetailSwitchTabV2,
  goalDetailSwitchTabV2ByKey
} from '../../../../redux/modules/goal/GoalDetailActions';

import {
  createCommentFromSuggestion,
  createCommentForSuggestion
} from '../../../../redux/modules/feed/comment/CommentActions';

// Selectors
import {
  getGoalStepsAndNeeds,
  getGoalDetailByTab
} from '../../../../redux/modules/goal/selector';

// Styles
import { BACKGROUND_COLOR } from '../../../../styles';

// Constants
const DEBUG_KEY = '[ UI CentralTab ]';
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class CentralTab extends React.Component<{}> {

  // Refresh goal content and comment
  handleRefresh = () => {

  }

  keyExtractor = (item) => {
    const { _id } = item;
    return _id;
  }

  renderItem = (props) => {
    const { goalDetail } = this.props;
    if (!goalDetail) return '';

    const newCommentParams = {
      commentDetail: {
        parentType: 'Goal',
        parentRef: goalDetail._id, // Goal ref
        commentType: 'Suggestion'
      },
      suggestionForRef: props.item._id, // Need or Step ref
      suggestionFor: props.item.type === 'need' ? 'Need' : 'Step'
    };

    return (
      <StepAndNeedCardV3
        key={`mastermind-${props.index}`}
        item={props.item}
        goalRef={goalDetail}
        onCardPress={() => {
          // TODO: function to do should become
          this.props.goalDetailSwitchTabV2ByKey(
            'focusTab', props.item._id, props.item.type
          );
          this.props.createCommentForSuggestion(newCommentParams);
        }}
        isSelf={this.props.isSelf}
      />
    );
  }

  render() {
    const { data } = this.props;
    return (
      <AnimatedFlatList
        data={data}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        refreshing={this.props.loading || false}
        onRefresh={this.handleRefresh}
        ListEmptyComponent={
          this.props.loading ? '' :
          <EmptyResult
            text='No needs and steps'
            textStyle={{ paddingTop: 100 }}
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

const mapStateToProps = (state) => {
  const goalDetail = getGoalDetailByTab(state);
  const { goal } = goalDetail;

  return {
    goalDetail: goal,
    data: getGoalStepsAndNeeds(state),
  };
};

export default connect(
  mapStateToProps,
  {
    goalDetailSwitchTabV2,
    goalDetailSwitchTabV2ByKey,
    createCommentFromSuggestion,
    createCommentForSuggestion
  }
)(CentralTab);
