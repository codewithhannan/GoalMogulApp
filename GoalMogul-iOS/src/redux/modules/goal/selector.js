import { createSelector } from 'reselect';
import _ from 'lodash';

const getNeeds = (state) => state.goalDetail.goal.needs;
const getSteps = (state) => state.goalDetail.goal.steps;

const getTab = (state) => state.navigation.tab;
const getState = (state) => state.goalDetail;

/*
 * Transform a goal's need and step to become
 * [ {needTitle: 'needs'}, ..., {stepTitle: 'steps'}, ...]
 * in GoalDetailCard2
 */
export const getGoalStepsAndNeeds = createSelector(
  [getState, getTab],
  (goalDetails, tab) => {
    const path = !tab || tab === 'homeTab' ? 'goal' : `goal${capitalizeWord(tab)}`;
    const goal = _.get(goalDetails, `${path}.goal`);

    const { needs, steps } = goal;
    let res = [];
    if (needs && needs.length > 0) {
      res.push({ sectionTitle: 'needs', count: needs.length, _id: 'need-title' });
    }
    // Transform needs to have a type
    let newNeeds = [];
    if (needs && needs.length !== 0) {
      newNeeds = needs.map((need) => ({
        ...need,
        type: 'need'
      }));
    }

    res = res.concat(newNeeds);

    if (steps && steps.length > 0) {
      res.push({ sectionTitle: 'steps', count: steps.length, _id: 'step-title' });
    }

    // Transform needs to have a type
    let newSteps = [];
    if (steps && steps.length !== 0) {
      newSteps = steps.map((step) => ({
        ...step,
        type: 'step'
      }));
    }

    res = res.concat(newSteps);
    return res;
  }
);

// Get goal detail by tabs
export const getGoalDetailByTab = createSelector(
  [getState, getTab],
  (goalDetails, tab) => {
    const path = !tab || tab === 'homeTab' ? 'goal' : `goal${capitalizeWord(tab)}`;
    return _.get(goalDetails, `${path}`);
  }
);

const capitalizeWord = (word) => {
  if (!word) return '';
  return word.replace(/^\w/, c => c.toUpperCase());
};
