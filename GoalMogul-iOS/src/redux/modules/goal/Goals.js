/**
 * This reducer is the source of truth for Goals related Components based on the design
 * https://docs.google.com/document/d/1JxjCLZGsp5x_Sy0R56y05aUgAUALtuSVAgJIway9JTg/edit?usp=sharing
 */

import _ from 'lodash';

// Constants
import {
    PROFILE_FETCH_TAB_DONE,
    PROFILE_REFRESH_TAB_DONE,
    PROFILE_GOAL_DELETE_SUCCESS
} from '../../../reducers/Profile';

import {
    PROFILE_CLOSE_PROFILE
} from '../../../actions/types';

/**
 * List of const to add 
 * 
 * Create Goal
 * GOAL_CREATE_EDIT_SUCCESS
 * 
 * Goal Detail related
 * GOAL_DETAIL_MARK_NEED_AS_COMPLETE_SUCCESS
 * GOAL_DETAIL_MARK_AS_COMPLETE_SUCCESS,
 * GOAL_DETAIL_SHARE_TO_MASTERMIND_SUCCESS,
 * GOAL_DETAIL_MARK_STEP_AS_COMPLETE_SUCCESS,
 * GOAL_DETAIL_MARK_NEED_AS_COMPLETE_SUCCESS
 * 
 * Profile related (done)
 * PROFILE_FETCH_TAB_DONE (done)
 * PROFILE_REFRESH_TAB_DONE (done)
 * PROFILE_GOAL_DELETE_SUCCESS (done)
 * PROFILE_CLOSE_PROFILE (done)
 * 
 * Comment related
 * The ones that need to increase / decrease comment count
 * 
 * Home related (Goal Feed)
 * 
 */

const DEBUG_KEY = '[ Reducer Goals ]';

// Sample goal object in the map
const INITIAL_GOAL = {
    goal: {},
    pageId: {
        refreshing: false
    },
    reference: [],
};

const INITIAL_GOAL_PAGE = {
    refreshing: false,
    // Potential navigation state and etc. First focus on integration with Profile
};

const INITIAL_STATE = {

};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        /* Profile related */
        case PROFILE_REFRESH_TAB_DONE:
        case PROFILE_FETCH_TAB_DONE: {
            const { pageId, data, type } = action.payload;
            let newState = _.cloneDeep(state);
            if (type !== 'goals') return newState;
            if (!data || _.isEmpty(data)) return newState;

            data.forEach(goal => {
                const goalId = goal._id;
                // Update goal
                if (!_.has(newState, goalId)) {
                    newState = _.set(newState, `${goalId}.goal`, goal);
                }

                const oldReference = _.get(newState, `${goalId}.reference`);
                const hasPageReference = (oldReference !== undefined && oldReference.some(r => r === pageId));
                // Update reference
                let newReference = [pageId];
                if (!hasPageReference) {
                    newReference = newReference.concat(oldReference);
                }
                newState = _.set(newState, `${goalId}.reference`, newReference);
            });

            return newState;
        }

        case PROFILE_GOAL_DELETE_SUCCESS: {
            const { pageId, goalId } = action.payload;
            let newState = _.cloneDeep(state);
            if (!_.has(newState, goalId)) return newState; // no reference to remove

            let goalToUpdate = _.get(newState, `${goalId}`);

            // Update reference
            const oldReference = _.get(goalToUpdate, 'reference');
            let newReference = oldReference;
            if (oldReference && oldReference.some(r => r === pageId)) {
                newReference = newReference.filter(r => r !== pageId);
            }

            // Remove pageId reference object
            goalToUpdate = _.omit(goalToUpdate, `${pageId}`);

            // Remove this goal if it's no longer referenced
            if (!newReference || _.isEmpty(newReference)) {
                newState = _.omit(newState, `${goalId}`);
                return newState;
            }

            // Update the goal by goalId
            goalToUpdate = _.set(goalToUpdate, 'reference', newReference);
            newState = _.set(newState, `${goalId}`, goalToUpdate);
            return newState;
        }

        case PROFILE_CLOSE_PROFILE: {
            const { goalList, pageId } = action.payload;
            let newState = _.cloneDeep(state);
            if (!goalList || _.isEmpty(goalList)) return newState;

            goalList.forEach(goalId => {
                // Check if goalId in the Goals
                if (!_.has(newState, goalId)) {
                    return;
                }

                let goalToUpdate = _.get(newState, `${goalId}`);

                // Remove pageId reference object
                goalToUpdate = _.omit(goalToUpdate, `${pageId}`);

                const oldReference = _.get(newState, `${goalId}.reference`);
                const hasPageReference = (oldReference !== undefined && oldReference.some(r => r === pageId));
                // Remove reference
                let newReference = oldReference;
                if (hasPageReference) {
                    newReference = oldReference.filter(r => r !== pageId);
                }

                // Remove this goal if it's no longer referenced
                if (!newReference || _.isEmpty(newReference)) {
                    newState = _.omit(newState, `${goalId}`);
                    return;
                }
                goalToUpdate = _.set(goalToUpdate, 'reference', newReference);
                newState = _.set(newState, `${goalId}`, goalToUpdate);
            });

            return newState;
        }

        default: 
            return { ...state };
    }
};
