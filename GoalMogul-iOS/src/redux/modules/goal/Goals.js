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
    GOAL_DETAIL_MARK_AS_COMPLETE_SUCCESS,
    GOAL_DETAIL_SWITCH_TAB_V2
} from '../../../reducers/GoalDetailReducers';

import {
    GOAL_CREATE_EDIT_SUCCESS
} from '../goal/CreateGoal';

import {
    HOME_REFRESH_GOAL_DONE,
    HOME_LOAD_GOAL_DONE
} from '../../../reducers/Home';

import {
    COMMENT_DELETE_SUCCESS
} from '../feed/comment/CommentReducers';

import {
    COMMENT_NEW_POST_SUCCESS
} from '../feed/comment/NewCommentReducers';

import {
    LIKE_POST,
    LIKE_GOAL,
    UNLIKE_POST,
    UNLIKE_GOAL
} from '../like/LikeReducers';

/**
 * List of const to add 
 * 
 * Create Goal
 * GOAL_CREATE_EDIT_SUCCESS (done)
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
 * GOAL_DETAIL_SWITCH_TAB, (no need)// This is used in GoalDetailCardV2 which is deprecated
 * GOAL_DETAIL_SWITCH_TAB_V2, (done)
 * 
 * Profile related (done)
 * PROFILE_FETCH_TAB_DONE (done)
 * PROFILE_REFRESH_TAB_DONE (done)
 * PROFILE_GOAL_DELETE_SUCCESS (done)
 * PROFILE_CLOSE_PROFILE (done)
 * 
 * Comment related
 * The ones that need to increase / decrease comment count
 * COMMENT_DELETE_SUCCESS, (done)
 * COMMENT_NEW_POST_SUCCESS (done)
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

const INITIAL_NAVIGATION_STATE_V2 = {
    index: 0,
    routes: [
      { key: 'centralTab', title: 'CentralTab' },
      { key: 'focusTab', title: 'FocusTab' },
    ],
    focusType: undefined, // ['need', 'step', 'comment']
    focusRef: undefined
  };

export const INITIAL_GOAL_PAGE = {
    refreshing: false, 
    loading: false, // Indicator if goal on this page is loading
    updating: false, // Indicator if goal on this page is updating
    // Potential navigation state and etc. First focus on integration with Profile
    navigationStateV2: { ...INITIAL_NAVIGATION_STATE_V2 }
};

const INITIAL_STATE = {

};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        /* Goal Detail related */
        case GOAL_DETAIL_FETCH_DONE: {
            const { goal, goalId, pageId } = action.payload;
            let newState = _.cloneDeep(state);
            let reference = pageId !== undefined ? [pageId] : [];
            let goalObjectToUpdate = _.has(newState, goalId)
                ? _.get(newState, `${goalId}`)
                : { ...INITIAL_GOAL_OBJECT };
            
            // Page should already exist for fetching a goal detail otherwise abort
            if (pageId === undefined || !_.has(state, `${goalId}.${pageId}`)) {
                return newState;
            }

            // Set the goal to the latest
            if (goal !== undefined) {
                goalObjectToUpdate = _.set(goalObjectToUpdate, 'goal', goal);
            }
 
            // Update the reference
            const oldReference = _.get(goalObjectToUpdate, 'reference');
            if (oldReference !== undefined) {
                if (!oldReference.some(r => r === pageId)) {
                    reference = reference.concat(oldReference);
                } else {
                    reference = oldReference;
                }
            }

            goalObjectToUpdate = _.set(goalObjectToUpdate, `${pageId}.loading`, false);
            goalObjectToUpdate = _.set(goalObjectToUpdate, 'reference', reference);
            
            newState = _.set(newState, `${goalId}`, goalObjectToUpdate);
            return newState;
        }

        case GOAL_DETAIL_OPEN: {
            const { goal, goalId, pageId } = action.payload;
            let newState = _.cloneDeep(state);
            let reference = [pageId];
            let goalObjectToUpdate = _.has(newState, goalId)
                ? _.get(newState, `${goalId}`)
                : { ...INITIAL_GOAL_OBJECT };
            
            if (pageId === undefined) {
                // Abort something is wrong
                console.warn(`${DEBUG_KEY}: [ ${GOAL_DETAIL_OPEN} ] with pageId: ${pageId}`);
                return newState;
            }
            
            // Set the goal to the latest
            if (goal !== undefined) {
                goalObjectToUpdate = _.set(goalObjectToUpdate, 'goal', goal);
            }

            // Setup goal page for pageId if not initially setup
            if (!_.has(goalObjectToUpdate, pageId)) {
                goalObjectToUpdate = _.set(goalObjectToUpdate, pageId, { ...INITIAL_GOAL_PAGE });
            }
 
            // Update the reference
            const oldReference = _.get(goalObjectToUpdate, 'reference');
            if (oldReference !== undefined) {
                if (!oldReference.some(r => r === pageId)) {
                    // Add new pageId to reference
                    reference = reference.concat(oldReference);
                } else {
                    // No ops since reference is already there
                    reference = oldReference;
                }
            }
            goalObjectToUpdate = _.set(goalObjectToUpdate, 'reference', reference);
            
            // Update goal object
            newState = _.set(newState, `${goalId}`, goalObjectToUpdate);
            return newState;
        }

        case GOAL_CREATE_EDIT_SUCCESS: {
            const { goal } = action.payload;
            let newState = _.cloneDeep(state);
            if (goal === undefined) return newState;

            const goalId = goal._id;
            if (!_.has(newState, goalId)) {
                // We don't update if no goal is already opened
                // Or not in any of the list
                return newState;
            }

            newState = _.set(newState, `${goalId}.goal`, goal);
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

        case GOAL_DETAIL_SWITCH_TAB_V2: {
            const { 
                tab, index, key, focusType, 
                focusRef, goalId, pageId
            } = action.payload;

            const path = `${goalId}.${pageId}.navigationStateV2`;
            let newState = _.cloneDeep(state);
            // Sanity check by pageId because we need pageId to be present
            const shouldUpdate = sanityCheckByPageId(
                newState, goalId, pageId, GOAL_DETAIL_SWITCH_TAB_V2
            );
            if (!shouldUpdate) return newState;

            const navigationStateV2 = _.get(newState, path);
            let newIndex = index || 0;
            if (key) {
                navigationStateV2.routes.forEach((route, i) => {
                if (route.key === key) {
                    newIndex = i;
                }
                });
            }
            newState = _.set(newState, `${path}.focusRef`, focusRef);
            newState = _.set(newState, `${path}.focusType`, focusType);
            newState = _.set(newState, `${path}.index`, newIndex);

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

                let goalToUpdate = { ...INITIAL_GOAL_OBJECT };
                // Update goal
                if (_.has(newState, goalId)) {
                    goalToUpdate = _.get(newState, `${goalId}`);
                    // newState = _.set(newState, `${goalId}.goal`, goal);
                }

                // TODO: perform schema check
                if (goal !== undefined) {
                    goalToUpdate = _.set(goalToUpdate, 'goal', goal);
                }

                const oldReference = _.get(newState, `${goalId}.reference`);
                // console.log(`${DEBUG_KEY}: old reference is: `, oldReference);
                const hasPageReference = (oldReference !== undefined && oldReference.some(r => r === pageId));
                // Update reference
                let newReference = [pageId];
                if (oldReference !== undefined) {
                    if (!hasPageReference) {
                        newReference = newReference.concat(oldReference);
                    } else {
                        newReference = oldReference;
                    }
                }

                goalToUpdate = _.set(goalToUpdate, 'reference', newReference);
                newState = _.set(newState, `${goalId}`, goalToUpdate);
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

        /* Comment related */
        case COMMENT_DELETE_SUCCESS: {
            const {
                pageId,
                tab,
                commentId,
                parentRef, 
                parentType // ['Goal', 'Post']
            } = action.payload;
            let newState = _.cloneDeep(state);
            // check parentType to determine to proceed
            if (parentType !== 'Goal') {
                return newState;
            }
            // Check if goal of concerned is in the Goals
            if (!_.has(newState, parentRef)) return newState;
            if (!_.has(newState, `${parentRef}.goal`)) {
                console.warn(
                    `${DEBUG_KEY}: goal is not in ${parentRef}: `, 
                    _.get(newState, `${parentRef}`)
                );
                return newState;
            }
            // Decrease comment count
            const oldCommentCount = _.get(newState, `${parentRef}.goal.commentCount`) || 0;
            const newCommentCount = (oldCommentCount - 1) < 0 ? 0 : oldCommentCount - 1;

            newState = _.set(newState, `${parentRef}.goal.commentCount`, newCommentCount);
            return newState;
        }

        case COMMENT_NEW_POST_SUCCESS: {
            let newState = _.cloneDeep(state);
            const { comment } = action.payload;
            const { parentType, parentRef } = comment;
            // check parentType to determine to proceed
            if (parentType !== 'Goal') {
                return newState;
            }

            // Check if goal of concerned is in the Goals
            if (!_.has(newState, parentRef)) return newState;

            if (!_.has(newState, `${parentRef}.goal`)) {
                console.warn(
                    `${DEBUG_KEY}: goal is not in ${parentRef}: `, 
                    _.get(newState, `${parentRef}`)
                );
                return newState;
            }

            // Increase comment count
            const oldCommentCount = _.get(newState, `${parentRef}.goal.commentCount`) || 0;
            const newCommentCount = (oldCommentCount + 1);

            newState = _.set(newState, `${parentRef}.goal.commentCount`, newCommentCount);
            return newState;
        }

        /* Like related */
        case LIKE_POST:
        case LIKE_GOAL:
        case UNLIKE_POST:
        case UNLIKE_GOAL: {
            const { id, likeId, tab, undo } = action.payload;
            let newState = _.cloneDeep(state);
            const goalId = id;

            if (!_.has(newState, `${goalId}.goal`)) return newState;

            let goalToUpdate = _.get(newState, `${goalId}.goal`);
            goalToUpdate = _.set(goalToUpdate, 'maybeLikeRef', likeId);

            const oldLikeCount = _.get(goalToUpdate, 'likeCount');
            let newLikeCount = oldLikeCount;

            if (action.type === LIKE_POST || action.type === LIKE_GOAL) {
                if (undo) {
                    newLikeCount = oldLikeCount - 1;
                } else if (likeId === 'testId') {
                    newLikeCount = oldLikeCount + 1;
                }
            } else if (action.type === UNLIKE_POST || action.type === UNLIKE_GOAL) {
                if (undo) {
                    newLikeCount = oldLikeCount + 1;
                } else if (likeId === undefined) {
                    newLikeCount = oldLikeCount - 1;
                }
            }
            goalToUpdate = _.set(goalToUpdate, 'likeCount', newLikeCount);
            newState = _.set(newState, `${goalId}.goal`, goalToUpdate);
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