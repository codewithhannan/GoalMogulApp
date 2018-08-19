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
    // Transform needs to have a type
    const newNeeds = needs.map(need => ({
      ...need,
      type: 'need'
    }));
    res.concat(newNeeds);

    if (steps && steps.length > 0) {
      res.push({ sectionTitle: 'steps' });
    }

    // Transform needs to have a type
    const newSteps = steps.map(step => ({
      ...step,
      type: 'step'
    }));
    res.concat(newSteps);
    return res;
  }
);
