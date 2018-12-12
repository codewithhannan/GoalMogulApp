import { createSelector } from 'reselect';
import _ from 'lodash';

const getNeeds = (state) => state.goalDetail.goal.needs;
const getSteps = (state) => state.goalDetail.goal.steps;

const getComments = (state) => state.comment;
const getPageId = (state, pageId) => pageId;

const getTab = (state) => state.navigation.tab;
const getState = (state) => state.goalDetail;

/*
 * Transform a goal's need and step to become
 * [ {needTitle: 'needs'}, ..., {stepTitle: 'steps'}, ...]
 * in GoalDetailCard2
 */
export const getGoalStepsAndNeeds = createSelector(
  [getState, getTab, getComments, getPageId],
  (goalDetails, tab, allComments, pageId) => {
    const path = !tab || tab === 'homeTab' ? 'goal' : `goal${capitalizeWord(tab)}`;
    const goal = _.get(goalDetails, `${path}.goal`);

    const page = pageId ? `${pageId}` : 'default';
    const commentPath = !tab ? `homeTab.${page}` : `${tab}.${page}`;
    const comments = _.get(allComments, `${commentPath}`);

    const { needs, steps } = goal;
    let res = [];
    if (steps && steps.length > 0) {
      res.push({ sectionTitle: 'steps', count: steps.length, _id: 'step-title' });
    }

    // Transform needs to have a type
    let newSteps = [];
    if (steps && steps.length !== 0) {
      newSteps = steps.map((step) => {
        const count = comments.data.filter((c) => {
          if (c.suggestion &&
              c.suggestion.suggestionForRef &&
              c.suggestion.suggestionForRef === step._id) {
                return true;
          }
          return false;
        }).length;
        return {
          ...step,
          type: 'step',
          count
        };
      });
    }

    res = res.concat(newSteps);

    if (needs && needs.length > 0) {
      res.push({ sectionTitle: 'needs', count: needs.length, _id: 'need-title' });
    }
    // Transform needs to have a type
    let newNeeds = [];
    if (needs && needs.length !== 0) {
      newNeeds = needs.map((need) => {
        const count = comments.data.filter((c) => {
          if (c.suggestion &&
              c.suggestion.suggestionForRef &&
              c.suggestion.suggestionForRef === need._id) {
                return true;
          }
          return false;
        }).length;
        return {
          ...need,
          type: 'need',
          count
        };
      });
    }

    res = res.concat(newNeeds);
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
