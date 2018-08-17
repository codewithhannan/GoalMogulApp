import { createSelector } from 'reselect';

const getNeeds = (state) => state.goalDetail.goal.needs;
const getSteps = (state) => state.goalDetail.goal.steps;

/*
 * Transform a goal's need and step to become
 * [ {needTitle: 'needs'}, ..., {stepTitle: 'steps'}, ...]
 */
export const getGoalStepsAndNeeds = createSelector(
  [getNeeds, getSteps],
  (needs, steps) => {
    let res = [];
    if (needs && needs.length > 0) {
      res.push({ sectionTitle: 'needs' });
    }
    res.concat(needs);
    if (steps && steps.length > 0) {
      res.push({ sectionTitle: 'steps' });
    }
    res.concat(steps);
    return res;
  }
);
