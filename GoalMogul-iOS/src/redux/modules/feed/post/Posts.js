/**
 * This reducer is the source of truth for Posts related Components based on the design
 * https://docs.google.com/document/d/1JxjCLZGsp5x_Sy0R56y05aUgAUALtuSVAgJIway9JTg/edit?usp=sharing
 */

import _ from 'lodash';

import {
    PROFILE_FETCH_TAB_DONE,
    PROFILE_REFRESH_TAB_DONE,
    PROFILE_POST_DELETE_SUCCESS
} from '../../../../reducers/Profile';

import {
    PROFILE_CLOSE_PROFILE
} from '../../../../actions/types';

/**
 * Related consts to add
 * 
 * Post related
 * 
 * 
 * Profile related
 * PROFILE_FETCH_TAB_DONE
 * PROFILE_REFRESH_TAB_DONE
 * PROFILE_CLOSE_PROFILE
 * PROFILE_POST_DELETE_SUCCESS
 * 
 * Comment related
 * The ones that need to increase / decrease comment count
 * 
 * Home related (Activity Feed)
 * 
 * Tribe related
 * 
 * Event related
 * 
 */

// Sample goal object in the map
const INITIAL_POST = {
    post: {},
    pageId: {
        refreshing: false
    },
    reference: [],
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
            if (type !== 'posts') return newState;
            if (!data || _.isEmpty(data)) return newState;

            data.forEach(post => {
                const postId = post._id;
                // Update goal
                if (!_.has(newState, postId)) {
                    newState = _.set(newState, `${postId}.post`, post);
                }

                const oldReference = _.get(newState, `${postId}.reference`);
                const hasPageReference = (oldReference !== undefined && oldReference.some(r => r === pageId));
                // Update reference
                let newReference = [pageId];
                if (!hasPageReference) {
                    newReference = newReference.concat(oldReference);
                }
                newState = _.set(newState, `${postId}.reference`, newReference);
            });

            return newState;
        }

        case PROFILE_POST_DELETE_SUCCESS: {
            const { pageId, postId } = action.payload;
            let newState = _.cloneDeep(state);
            if (!_.has(newState, postId)) return newState; // no reference to remove

            let postToUpdate = _.get(newState, `${postId}`);

            // Update reference
            const oldReference = _.get(postToUpdate, 'reference');
            let newReference = oldReference;
            if (oldReference && oldReference.some(r => r === pageId)) {
                newReference = newReference.filter(r => r !== pageId);
            }

            // Remove pageId reference object
            postToUpdate = _.omit(postToUpdate, `${pageId}`);

            // Remove this goal if it's no longer referenced
            if (!newReference || _.isEmpty(newReference)) {
                newState = _.omit(newState, `${postId}`);
                return newState;
            }

            // Update the goal by goalId
            postToUpdate = _.set(postToUpdate, 'reference', newReference);
            newState = _.set(newState, `${postId}`, postToUpdate);
            return newState;
        }

        case PROFILE_CLOSE_PROFILE: {
            const { postList, pageId } = action.payload;
            let newState = _.cloneDeep(state);
            if (!postList || _.isEmpty(postList)) return newState;

            postList.forEach(postId => {
                // Check if postId in the Posts
                if (!_.has(newState, postId)) {
                    return;
                }

                let postToUpdate = _.get(newState, `${postId}`);

                // Remove pageId reference object
                postToUpdate = _.omit(postToUpdate, `${pageId}`);

                const oldReference = _.get(newState, `${postId}.reference`);
                const hasPageReference = (oldReference !== undefined && oldReference.some(r => r === pageId));
                // Remove reference
                let newReference = oldReference;
                if (hasPageReference) {
                    newReference = oldReference.filter(r => r !== pageId);
                }

                // Remove this goal if it's no longer referenced
                if (!newReference || _.isEmpty(newReference)) {
                    newState = _.omit(newState, `${postId}`);
                    return;
                }
                postToUpdate = _.set(postToUpdate, 'reference', newReference);
                newState = _.set(newState, `${postId}`, postToUpdate);
            });

            return newState;
        }

        default: 
            return { ...state };
    }
};
