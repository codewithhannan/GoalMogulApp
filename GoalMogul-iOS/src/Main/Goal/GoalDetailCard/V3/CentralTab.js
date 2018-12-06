/**
 * This is main subtab for GoalDetailCardV3. It contains the main components
 * for a goal. Steps, needs and all comment card.
 * On tab for each subcomponent, it will open FocusTab to render corresponding
 * focus content.
 */
import React from 'react';
import {
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  Animated
} from 'react-native';
import { connect } from 'react-redux';

// Components
import EmptyResult from '../../../Common/Text/EmptyResult';
import StepAndNeedCardV3 from './StepAndNeedCardV3';

// Assets
import next from '../../../../asset/utils/next.png';
import allComments from '../../../../asset/utils/allComments.png';

// Actions
import {
  goalDetailSwitchTabV2,
  goalDetailSwitchTabV2ByKey
} from '../../../../redux/modules/goal/GoalDetailActions';

import {
  createCommentFromSuggestion
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

  // Switch tab to FocusTab and display all the comments
  onViewCommentPress = () => {
    console.log(`${DEBUG_KEY}: User opens all comments.`);
    this.props.goalDetailSwitchTabV2ByKey('focusTab', undefined, 'comment');
  }

  // Refresh goal content and comment
  handleRefresh = () => {

  }

  keyExtractor = (item) => {
    const { _id } = item;
    return _id;
  }

  // Entry points to open comment subcomponent
  renderCommentCTR() {
    const commentCount = 20;
    return (
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          backgroundColor: 'white',
          marginTop: 10
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
          activeOpacity={0.85}
          onPress={this.onViewCommentPress}
          style={styles.iconContainerStyle}
        >
          <Image source={next} style={{ ...styles.nextIconStyle, opacity: 0.8 }} />
        </TouchableOpacity>
      </View>
    );
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
          this.props.createCommentFromSuggestion(newCommentParams);
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
        ListHeaderComponent={() => this.renderCommentCTR()}
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

const styles = {
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
  }
};

export default connect(
  mapStateToProps,
  {
    goalDetailSwitchTabV2,
    goalDetailSwitchTabV2ByKey,
    createCommentFromSuggestion
  }
)(CentralTab);
