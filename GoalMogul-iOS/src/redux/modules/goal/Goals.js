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

import {
    USER_LOG_OUT
} from '../../../reducers/User';

import {
    GOAL_DETAIL_OPEN,
    GOAL_DETAIL_FETCH,
    GOAL_DETAIL_FETCH_DONE,
    GOAL_DETAIL_FETCH_ERROR,
    GOAL_DETAIL_UPDATE,
    GOAL_DETAIL_UPDATE_DONE,
    GOAL_DETAIL_CLOSE,
    GOAL_DETAIL_MARK_NEED_AS_COMPLETE_SUCCESS,
    GOAL_DETAIL_MARK_STEP_AS_COMPLETE_SUCCESS,
    GOAL_DETAIL_SHARE_TO_MASTERMIND_SUCCESS,
    GOAL_DETAIL_MARK_AS_COMPLETE_SUCCESS
} from '../../../reducers/GoalDetailReducers';

import {
    HOME_REFRESH_GOAL_DONE,
    HOME_LOAD_GOAL_DONE
} from '../../../reducers/Home';

/**
 * List of const to add 
 * 
 * Create Goal
 * GOAL_CREATE_EDIT_SUCCESS
 * 
 * Goal Detail related
 * GOAL_DETAIL_MARK_AS_COMPLETE_SUCCESS, (done)
 * GOAL_DETAIL_SHARE_TO_MASTERMIND_SUCCESS, (done)
 * GOAL_DETAIL_MARK_STEP_AS_COMPLETE_SUCCESS, (done)
 * GOAL_DETAIL_MARK_NEED_AS_COMPLETE_SUCCESS (done)
 * GOAL_DETAIL_UPDATE, (done)
 * GOAL_DETAIL_UPDATE_DONE, (done)
 * GOAL_DETAIL_FETCH, (done)
 * GOAL_DETAIL_FETCH_DONE, (done)
 * GOAL_DETAIL_FETCH_ERROR, (done)
 * GOAL_DETAIL_OPEN (done)
 * GOAL_DETAIL_CLOSE, (done)
 * GOAL_DETAIL_SWITCH_TAB,
 * GOAL_DETAIL_SWITCH_TAB_V2,
 * 
 * Profile related (done)
 * PROFILE_FETCH_TAB_DONE (done)
 * PROFILE_REFRESH_TAB_DONE (done)
 * PROFILE_GOAL_DELETE_SUCCESS (done)
 * PROFILE_CLOSE_PROFILE (done)
 * 
 * Comment related
 * The ones that need to increase / decrease comment count
 * COMMENT_DELETE_SUCCESS
 * 
 * Home related (Goal Feed)
 * HOME_REFRESH_GOAL_DONE (done)
 * HOME_LOAD_GOAL_DONE (done)
 * 
 * Like related
 * LIKE_POST,
 * LIKE_GOAL,
 * UNLIKE_POST,
 * UNLIKE_GOAL
 * 
 * User related
 * USER_LOG_OUT (done)
 * 
 */

const DEBUG_KEY = '[ Reducer Goals ]';

// Sample goal object in the map
const INITIAL_GOAL_OBJECT = {
    goal: {},
    // pageId: {
    //     refreshing: false
    // },
    reference: [],
};

const INITIAL_GOAL_PAGE = {
    refreshing: false, 
    loading: false, // Indicator if goal on this page is loading
    updating: false, // Indicator if goal on this page is updating
    // Potential navigation state and etc. First focus on integration with Profile
};

const INITIAL_STATE = {

};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        /* Goal Detail related */
        case GOAL_DETAIL_FETCH_DONE:
        case GOAL_DETAIL_OPEN: {
            const { goal, goalId, pageId, tab } = action.payload;
            let newState = _.cloneDeep(state);
            let reference = [pageId];
            let goalObjectToUpdate = _.has(newState, goalId)
                ? _.get(newState, 'goalId')
                : { ...INITIAL_GOAL_OBJECT };
            
            // Set the goal to the latest
            if (goal !== undefined) {
                goalObjectToUpdate = _.set(goalObjectToUpdate, 'goal', goal);
            }

            // Setup goal page for pageId if not initially setup
            if (_.has(goalObjectToUpdate, pageId)) {
                goalObjectToUpdate = _.set(goalObjectToUpdate, pageId, { ...INITIAL_GOAL_PAGE });
            }
 
            const oldReference = _.get(goalObjectToUpdate, 'reference');
            if (oldReference !== undefined && !oldReference.some(r => r === pageId)) {
                reference = reference.concat(oldReference);
            }

            // Update the reference
            goalObjectToUpdate = _.set(goalObjectToUpdate, 'reference', reference);
            
            newState = _.set(newState, `${goalId}`, goalObjectToUpdate);

            // Customized actions
            if (action.type === GOAL_DETAIL_FETCH_DONE) {
                _.set(newState, `${goalId}.${pageId}.loading`, false);
            }
            
            return newState;
        }

        case GOAL_DETAIL_FETCH: {
            const { goalId, pageId } = action.payload;
            const newState = _.cloneDeep(state);
            const shouldUpdate = sanityCheckByPageId(newState, goalId, pageId, GOAL_DETAIL_FETCH);
            if (!shouldUpdate) return newState;
            return _.set(newState, `${goalId}.${pageId}.loading`, true);
        }

        case GOAL_DETAIL_FETCH_ERROR: {
            const { goalId, pageId } = action.payload;
            const newState = _.cloneDeep(state);
            const shouldUpdate = sanityCheckByPageId(
                newState, goalId, pageId, GOAL_DETAIL_FETCH_ERROR
            );
            if (!shouldUpdate) return newState;
            return _.set(newState, `${goalId}.${pageId}.loading`, false);
        }

        case GOAL_DETAIL_UPDATE: {
            const { goalId, pageId } = action.payload;
            const newState = _.cloneDeep(state);
            const shouldUpdate = sanityCheckByPageId(newState, goalId, pageId, GOAL_DETAIL_UPDATE);
            if (!shouldUpdate) return newState;
            return _.set(newState, `${goalId}.${pageId}.updating`, true);
        }

        case GOAL_DETAIL_UPDATE_DONE: {
            const { goalId, pageId } = action.payload;
            const newState = _.cloneDeep(state);
            const shouldUpdate = sanityCheckByPageId(newState, goalId, pageId, GOAL_DETAIL_UPDATE);
            if (!shouldUpdate) return newState;
            return _.set(newState, `${goalId}.${pageId}.updating`, false);
        }

        case GOAL_DETAIL_MARK_NEED_AS_COMPLETE_SUCCESS: {
            const { id, isCompleted, goalId, pageId } = action.payload;
            let newState = _.cloneDeep(state);
            const shouldUpdate = sanityCheck(newState, goalId, GOAL_DETAIL_MARK_NEED_AS_COMPLETE_SUCCESS);
            if (!shouldUpdate) {
                return newState;
            }

            const shouldUpdatePage = sanityCheckByPageId(newState, goalId, pageId, GOAL_DETAIL_MARK_NEED_AS_COMPLETE_SUCCESS);
            if (shouldUpdatePage) {
                newState = _.set(newState, `${goalId}.${pageId}.updating`, false);
            }

            const oldNeeds = _.get(newState, `${goalId}.goal.needs`);
            // When mark need as complete, user might not be in goal detail view
            // so oldNeeds could be undefined
            if (oldNeeds !== undefined && oldNeeds.length > 0) {
                const newNeeds = findAndUpdate(id, oldNeeds, { isCompleted });
                newState = _.set(newState, `${goalId}.goal.needs`, newNeeds);
            }
             
            return newState;
        }

        case GOAL_DETAIL_MARK_STEP_AS_COMPLETE_SUCCESS: {
            const { id, isCompleted, goalId, pageId } = action.payload;
            let newState = _.cloneDeep(state);
            const shouldUpdate = sanityCheck(newState, goalId, GOAL_DETAIL_MARK_STEP_AS_COMPLETE_SUCCESS);
            if (!shouldUpdate) {
                return newState;
            }

            const shouldUpdatePage = sanityCheckByPageId(newState, goalId, pageId, GOAL_DETAIL_MARK_STEP_AS_COMPLETE_SUCCESS);
            if (shouldUpdatePage) {
                newState = _.set(newState, `${goalId}.${pageId}.updating`, false);
            }

            const oldSteps = _.get(newState, `${goalId}.goal.steps`);
            // When mark step as complete, user might not be in goal detail view
            // so oldNeeds could be undefined
            if (oldSteps !== undefined && oldSteps.length > 0) {
                const newSteps = findAndUpdate(id, oldSteps, { isCompleted });
                newState = _.set(newState, `${goalId}.goal.steps`, newSteps);
            }

            return newState;
        }

        case GOAL_DETAIL_SHARE_TO_MASTERMIND_SUCCESS: {
            const { goalId } = action.payload;
            let newState = _.cloneDeep(state);
            const shouldUpdate = sanityCheck(newState, goalId, GOAL_DETAIL_SHARE_TO_MASTERMIND_SUCCESS);
            if (!shouldUpdate) {
                return newState;
            }
            newState = _.set(newState, `${goalId}.goal.shareToGoalFeed`, true);
            return newState;
        }

        case GOAL_DETAIL_MARK_AS_COMPLETE_SUCCESS: {
            const { goalId, complete } = action.payload;
            let newState = _.cloneDeep(state);
            const shouldUpdate = sanityCheck(newState, goalId, GOAL_DETAIL_MARK_AS_COMPLETE_SUCCESS);
            if (!shouldUpdate) {
                return newState;
            }
            newState = _.set(newState, `${goalId}.goal.isCompleted`, complete);
            return newState;
        }

        /* Profile related */
        case HOME_LOAD_GOAL_DONE: // pageId for goal feed is 'HOME'
        case HOME_REFRESH_GOAL_DONE: // pageId for goal feed is 'HOME'
        case PROFILE_REFRESH_TAB_DONE:
        case PROFILE_FETCH_TAB_DONE: {
            const { pageId, data, type } = action.payload;
            let newState = _.cloneDeep(state);

            // Customized logics
            if (action.type === PROFILE_REFRESH_TAB_DONE || action.type === PROFILE_FETCH_TAB_DONE) {
                if (type !== 'goals') return newState;
            }

            // Customized logics
            if (action.type === HOME_REFRESH_GOAL_DONE || action.type === HOME_LOAD_GOAL_DONE) {
                if (type !== 'mastermind') return newState;
            }
            
            if (!data || _.isEmpty(data)) return newState;

            data.forEach(goal => {
                const goalId = goal._id;
                // Update goal
                if (!_.has(newState, goalId)) {
                    newState = _.set(newState, `${goalId}.goal`, goal);
                }

                const oldReference = _.get(newState, `${goalId}.reference`);
                // console.log(`${DEBUG_KEY}: old reference is: `, oldReference);
                const hasPageReference = (oldReference !== undefined && oldReference.some(r => r === pageId));
                // Update reference
                let newReference = [pageId];
                if (oldReference !== undefined && !hasPageReference) {
                    newReference = newReference.concat(oldReference);
                }

                // console.log(`${DEBUG_KEY}: new reference is: `, newReference);
                newState = _.set(newState, `${goalId}.reference`, newReference);
            });

            return newState;
        }

        case GOAL_DETAIL_CLOSE:
        case PROFILE_GOAL_DELETE_SUCCESS: {
            const { pageId, goalId } = action.payload;
            let newState = _.cloneDeep(state);
            if (!_.has(newState, goalId)) return newState; // no reference to remove

            let goalToUpdate = _.get(newState, `${goalId}`);

            // Update reference
            const oldReference = _.get(goalToUpdate, 'reference');
            let newReference = oldReference;
            if (oldReference !== undefined && oldReference.some(r => r === pageId)) {
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
            // console.log(`${DEBUG_KEY}: closing profile with pageId: ${pageId} and goalList:`, goalList);
            let newState = _.cloneDeep(state);
            if (!goalList || _.isEmpty(goalList)) return newState;

            // console.log(`${DEBUG_KEY}: profile close before state: `, newState);

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

            // console.log(`${DEBUG_KEY}: profile close with newState: `, newState);
            return newState;
        }

        case USER_LOG_OUT: {
            return { ...INITIAL_STATE };
        }

        default: 
            return { ...state };
    }
};

const sanityCheck = (state, goalId, type) => {
    if (!_.has(state, goalId)) {
        console.warn(`${DEBUG_KEY}: [ ${type} ]: expecting goalId: ${goalId} but not found`);
        return false;
    }
    return true;
};

const sanityCheckByPageId = (state, goalId, pageId, type) => {
    if (!_.has(state, goalId)) {
        console.warn(`${DEBUG_KEY}: [ ${type} ]: expecting goalId: ${goalId} but not found`);
        return false;
    }
    if (!_.has(state, `${goalId}.${pageId}`)) {
        console.warn(`${DEBUG_KEY}: [ ${type} ]: expecting goalId: ${goalId} and ` + 
        `pageId: ${pageId} but not found`);
        return false;
    }

    return true;
};

// Find the object with id and update the object with the newValsMap
function findAndUpdate(id, data, newValsMap) {
    if (!data || data.length === 0) return [];
    return data.map((item) => {
        let newItem = _.cloneDeep(item);
        if (item._id === id) {
            Object.keys(newValsMap).forEach(key => {
                if (newValsMap[key] !== null) {
                    newItem = _.set(newItem, `${key}`, newValsMap[key]);
                }
            });
        }
        return newItem;
    });
}
