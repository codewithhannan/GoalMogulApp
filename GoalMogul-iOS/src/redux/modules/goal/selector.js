import { createSelector } from 'reselect';
import _ from 'lodash';

const getNeeds = (state) => state.goalDetail.goal.needs;
const getSteps = (state) => state.goalDetail.goal.steps;

const getTab = (state) => state.navigation;
const getState = (state) => state.goalDetail;

/*
 * Transform a goal's need and step to become
 * [ {needTitle: 'needs'}, ..., {stepTitle: 'steps'}, ...]
 * in GoalDetailCard2
 */
export const getGoalStepsAndNeeds = createSelector(
  [getNeeds, getSteps],
  (needs, steps) => {
    let res = [];
    if (needs && needs.length > 0) {
      res.push({ sectionTitle: 'needs' });
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
      res.push({ sectionTitle: 'steps' });
    }

    // Transform needs to have a type
    let newSteps = [];
    if (needs && needs.length !== 0) {
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
    const path = !tab ? 'goal' : `goal${capitalizeWord(tab)}`;
    return _.get(goalDetails, `${path}`);
  }
);

const capitalizeWord = (word) => {
  if (!word) return '';
  return word.replace(/^\w/, c => c.toUpperCase());
};
