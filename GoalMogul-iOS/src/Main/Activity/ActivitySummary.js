// This component is the card header
// For example, Jia created a comment for Goal
import React from 'react';
import {
  View,
  Text
} from 'react-native';

import { switchCase } from '../../redux/middleware/utils';

class ActivitySummary extends React.Component {

  renderText(item) {
    const { boldTextStyle, textStyle } = styles;
    const {
      action, // ['Create', 'Update']
      actionDetails, // ['GoalComplete'],
      actor,
      actedWith, // ['Comment', 'Goal', 'Post', 'Like']
      actedUponEntityType, // ['Goal', 'Post']
      belongsToTribe,
      belongsToEvent,
      postRef
    } = item;

    const tribeText = belongsToTribe
      ? <Text><Text style={{ ...boldTextStyle }}>{' '}{belongsToTribe.name}</Text>{' '}Tribe</Text>
      : '';
    const eventText = belongsToEvent
      ? <Text><Text style={{ ...boldTextStyle }}>{' '}{belongsToEvent.title}</Text>{' '}Event</Text>
      : '';
    const actorText = <Text style={{ ...boldTextStyle, ...textStyle }}>{actor.name} </Text>;
    const text = getSummaryText({
      Create: {
        Goal: (val) => `${val.action.toLowerCase()}d a ${val.actedWith}`,
        Post: (val) => {
          if (!val.postRef && !val.postRef.postType) return '';
          if (val.postRef.postType === 'General') {
            return `${val.action.toLowerCase()}d a ${val.actedWith} ` +
              `${val.belongsToEvent || val.belongsToTribe ? 'in' : ''}`;
          }
          return `shared a ${switchPostType(val.postRef.postType)}` +
            `${val.belongsToEvent || val.belongsToTribe ? 'to' : ''}`;
        },
        Comment: (val) => `commented on ${val.actedUponEntityType}`,
        Like: (val) => `liked a ${val.actedUponEntityType}`
      },
      Update: {
        Goal: () => 'completed the goal'
      }
})({ belongsToTribe, belongsToEvent, postRef }).do(action).with(actedWith).on(actedUponEntityType);

    return (
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center'
        }}
      >
        <Text
          numberOfLines={1}
          ellipsizeMode='tail'
          style={{ flex: 1, flexWrap: 'wrap', color: 'black', fontSize: 11 }}
        >
          {actorText}
          {text}
          {eventText}
          {tribeText}
        </Text>
      </View>
    );
  }

  render() {
    const { item } = this.props;
    if (!item) return '';

    return (
      <View style={{ marginBottom: 0.5, backgroundColor: 'white', padding: 5, marginLeft: 10, marginRight: 10 }}>
          {this.renderText(item)}
      </View>
    );
  }
}

const executeIfFunction = (f, values) => (f instanceof Function ? f(values) : f);
const switchNestCases = (cases) => (action) => (actedWith) => {
  const innerCases = cases.hasOwnProperty(action) ? cases[action] : {};
  return innerCases.hasOwnProperty(actedWith) ? innerCases[actedWith] : '';
};

const getSummaryText = (cases) => ({ belongsToTribe, belongsToEvent, postRef }) => ({
  do(action) {
    return {
      with(actedWith) {
        return {
          on(actedUponEntityType) {
            return executeIfFunction(
              switchNestCases(cases)(action)(actedWith),
              {
                action,
                actedWith,
                actedUponEntityType,
                belongsToTribe,
                belongsToEvent,
                postRef
              }
            );
          }
        };
      }
    };
  }
});

const switchPostType = (postType) => switchCase({
  ShareNeed: 'need',
  SharePost: 'post',
  ShareGoal: 'goal',
  ShareUser: 'user',
  ShareStep: 'step'
})('ShareNeed')(postType);

const styles = {
  boldTextStyle: {
    fontWeight: '700'
  },
  textStyle: {
    fontSize: 11
  }
};

export default ActivitySummary;
