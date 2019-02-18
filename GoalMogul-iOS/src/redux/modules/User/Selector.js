/** 
 * This is the object selector for user object.
 */

import { createSelector } from 'reselect';
import _ from 'lodash';


const DEBUG_KEY = '[ Selector Users ]';

// Get goal list by userId and pageId
const getUserGoals = (state, userId, pageId) => getUserData(state, userId, pageId, 'goals');
// Get post list by userId and pageId
const getUserPosts = (state, userId, pageId) => getUserData(state, userId, pageId, 'posts');

const getGoals = (state) => state.goals;
const getPosts = (state) => state.posts;

const getUserData = (state, userId, pageId, type) => {
    // console.log(`${DEBUG_KEY}: userId: ${userId}, pageId: ${pageId}, type: ${type}`);
    let ret = [];
    const users = state.users;
    if (!_.has(users, userId)) {
        console.warn(`${DEBUG_KEY}: no user found for id: ${userId} when getting ${type}`);
        return ret;
    }

    const user = _.get(users, `${userId}`);
    if (!_.has(user, pageId)) {
        console.warn(`${DEBUG_KEY}: no pageId found when getting ${type} in user:`, user);
        return ret;
    }

    ret = _.get(user, `${pageId}.${type}.data`);
    return ret;
};

const getEntityByIds = (ids, entities) => {
    let ret = [];
    ret = _.uniq(ids).map((id) => {
        if (_.has(entities, id)) {
            return _.get(entities, id);
        }
        return {};
    }).filter(g => !_.isEmpty(g));
    return ret;
};

export const makeGetUserGoals = () => {
    return createSelector(
        [getUserGoals, getGoals],
        (goalIds, goals) => {
            // console.log(`${DEBUG_KEY}: [ makeGetUserGoals ] goalIds: ${goalIds}`);
            return getEntityByIds(goalIds, goals);
        }
    );
};

export const makeGetUserPosts = () => {
    return createSelector(
        [getUserPosts, getPosts],
        (postIds, posts) => getEntityByIds(postIds, posts)
    );
};
