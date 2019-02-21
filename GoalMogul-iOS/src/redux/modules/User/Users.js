/**
 * This reducer is the source of truth for Profile Components based on the design
 * https://docs.google.com/document/d/1JxjCLZGsp5x_Sy0R56y05aUgAUALtuSVAgJIway9JTg/edit?usp=sharing
 */
import _ from 'lodash';
import {
    arrayUnique,
    hasTypePrefix
} from '../../middleware/utils';

import {
    PROFILE_FETCH_MUTUAL_FRIEND_COUNT_DONE,
    PROFILE_FETCH_MUTUAL_FRIEND_DONE,
    PROFILE_FETCH_MUTUAL_FRIEND,
    PROFILE_FETCH_FRIENDSHIP_DONE,
    PROFILE_REFRESH_TAB,
    PROFILE_REFRESH_TAB_DONE,
    PROFILE_REFRESH_TAB_FAIL,
    PROFILE_FETCH_TAB,
    PROFILE_FETCH_TAB_DONE,
    PROFILE_FETCH_TAB_FAIL,
    PROFILE_UPDATE_FILTER,
    PROFILE_GOAL_DELETE_SUCCESS,
    PROFILE_POST_DELETE_SUCCESS,
    PROFILE_RESET_FILTER,
    PROFILE_OPEN_CREATE_OVERLAY,
    PROFILE_CLOSE_CREATE_OVERLAY,
    updatePriorities,
    INITIAL_FILTER_STATE
} from '../../../reducers/Profile';

import {
    USER_LOG_OUT,
    USER_LOAD_PROFILE_DONE
  } from '../../../reducers/User';

import {
    PROFILE_OPEN_PROFILE,
    PROFILE_CLOSE_PROFILE,
    PROFILE_OPEN_PROFILE_DETAIL,
    PROFILE_CLOSE_PROFILE_DETAIL, // Not to update state for now
    PROFILE_IMAGE_UPLOAD_SUCCESS,
    PROFILE_SUBMIT_UPDATE,
    PROFILE_UPDATE_SUCCESS,
    PROFILE_FETCHING_SUCCESS,
    PROFILE_FETCHING_FAIL,
    PROFILE_SWITCH_TAB,
    MEET_UPDATE_FRIENDSHIP_DONE,
    SETTING_EMAIL_UPDATE_SUCCESS,
    SETTING_PHONE_UPDATE_SUCCESS,
    SETTING_PHONE_VERIFICATION_SUCCESS
} from '../../../actions/types';

const DEBUG_KEY = '[ Reducer Users ]';

const INITIAL_DUMMY_USER = {
    name: '',
    profile: {
        image: undefined
    },
};

/**
 * Sample userId --> user object mapping
 * Call getUserData(state, userId, '') will return the following data
 * Call getUserData(state, userId, 'user') will return the actual user object
 */
const INITIAL_USER = {
    user: {
        
    },
    mutualFriends: {
        data: [],
        skip: 0,
        limit: 10,
        count: 0,
        refreshing: false,
        loading: false,
        hasNextPage: undefined
    },
    /**
     * Friendship between current user and current profile fetched
     * Ignore if it's self. This should not be tied to a page
     */
    friendship: {
        _id: undefined,
        initiator_id: undefined,
        status: undefined // one of [undefined, 'Invited', 'Accepted']
    },
    reference: []
};

const INITIAL_FRIENDSHIP = {
    _id: undefined,
    initiator_id: undefined,
    status: undefined // one of [undefined, 'Invited', 'Accepted']
};

const INITIAL_MUTUAL_FRIENDS = {
    data: [],
    skip: 0,
    limit: 10,
    count: 0,
    refreshing: false,
    loading: false,
    hasNextPage: undefined
};

const INITIAL_USER_PROFILE_DETAIL_PAGE = {
    // uploading user profile changes
    uploading: false,
};

/**
 * Sample userPage object in userId --> user object mapping
 * Call getUserDataByPageId(state, userId, pageId, '') will return the following data
 * Call getUserDataByPageId(state, userId, pageId, 'navigationState') 
 * will return navigationState object
 */
const INITIAL_USER_PAGE = {
    // Profile page plus icon for goal / post creation
    showPlus: true,
    // Overall loading status
    loading: false,
    // uploading user profile changes, this might be unused due to the INITIAL_USER_PROFILE_DETAIL_PAGE
    uploading: false, 
    // navigation state
    selectedTab: 'goals',
    navigationState: {
      index: 0,
      routes: [
        { key: 'goals', title: 'Goals' },
        { key: 'posts', title: 'Posts' },
        { key: 'needs', title: 'Needs' }
      ]
    },
    goals: {
        data: [],
        skip: 0,
        limit: 10,
        filter: {
            sortBy: 'created',
            orderBy: 'descending',
            categories: 'All',
            completedOnly: 'false',
            priorities: '',
        },
        loading: false,
        refreshing: false
    },
    needs: {
        filter: {
            sortBy: 'created',
            orderBy: 'descending',
            categories: 'All',
            completedOnly: 'false',
            priorities: ''
        },
        limit: 10,
        skip: 0,
        hasNextPage: undefined,
        data: [],
        loading: false,
        refreshing: false
    },
    posts: {
        filter: {
            sortBy: 'created',
            orderBy: 'descending',
            categories: 'All',
            completedOnly: 'false',
            priorities: ''
        },
        limit: 10,
        skip: 0,
        hasNextPage: undefined,
        data: [],
        loading: false,
        refreshing: false
    }
};

const INITIAL_STATE = {

};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        /* Open / Close profile related page */
        case PROFILE_OPEN_PROFILE: {
            let newState = _.cloneDeep(state);
            const { userId, pageId } = action.payload;
            let reference = [];
            if (userId in newState) {
                const prevReference = _.get(newState, `${userId}.reference`);
                if (prevReference !== undefined && !_.isEmpty(prevReference)) {
                    reference = prevReference;
                }
            } else {
                newState = _.set(newState, `${userId}.user`, { ...INITIAL_DUMMY_USER });
            }

            if (reference !== undefined && reference.some(r => r === pageId)) {
                console.warn(`${DEBUG_KEY}: page ${pageId} already opened`);
                return newState;
            }

            // Set user related initial state
            newState = _.set(newState, `${userId}.friendship`, { ...INITIAL_FRIENDSHIP });
            newState = _.set(newState, `${userId}.userId`, userId);
            newState = _.set(newState, `${userId}.mutualFriends`, { ...INITIAL_MUTUAL_FRIENDS });

            // Set page related initial state
            newState = _.set(newState, `${userId}.${pageId}`, { ...INITIAL_USER_PAGE });
            newState = _.set(newState, `${userId}.${pageId}.loading`, true);
            // Add new page Id to the list of references
            reference = reference.concat(pageId);
            return _.set(newState, `${userId}.reference`, reference);
        }

        // case PROFILE_CLOSE_PROFILE_DETAIL: we don't want to update on PROFILE_DETAIL_CLOSE
        case PROFILE_CLOSE_PROFILE: {
            let newState = _.cloneDeep(state);
            const { pageId, userId } = action.payload;
            if (!_.has(newState, `${userId}`)) return newState;

            // Remove pageId related vars
            newState = _.omit(newState, [`${userId}.${pageId}`]);
            
            let reference = _.get(newState, `${userId}.reference`);
            if (reference !== undefined && reference.some(r => r === pageId)) {
                // Remove pageId from the reference
                reference = reference.filter(r => r !== pageId);
            }

            if (reference === undefined || _.isEmpty(reference)) {
                // No more pages are referencing this user, remove it from the objects
                newState = _.omit(newState, [`${pageId}`]);
            }

            return newState;
        }

        case PROFILE_OPEN_PROFILE_DETAIL: {
            let newState = _.cloneDeep(state);
            const { userId, pageId } = action.payload;
            let reference = [];
            if (userId in newState) {
                reference = _.get(newState, `${userId}.reference`);
            }

            if (reference !== undefined && reference.some(r => r === pageId)) {
                console.warn(`${DEBUG_KEY}: page ${pageId} already opened`);
                return newState;
            }

            newState = _.set(newState, `${userId}.${pageId}`, { ...INITIAL_USER_PROFILE_DETAIL_PAGE });

            return _.set(newState, `${userId}.reference`, reference);
        }

        /* Profile fetching */
        case USER_LOAD_PROFILE_DONE:
        case PROFILE_FETCHING_SUCCESS: {
            let newState = _.cloneDeep(state);
            const { user, pageId } = action.payload;

            let userToUpdate = {};
            // We need to use user._id otherwise, it will break USER_LOAD_PROFILE_DONE
            const path = `${user._id}.user`;
            if (_.has(newState, `${user._id}`)) {
                userToUpdate = _.get(newState, path);
            }
            // Update the user
            newState = _.set(newState, path, { ...userToUpdate, ...user });

            // Set loading for pageId to false
            if (pageId) {
                newState = _.set(newState, `${user._id}.${pageId}.loading`, false);
            }
            return newState;
        }

        case PROFILE_FETCHING_FAIL: {
            let newState = _.cloneDeep(state);
            const { pageId, res, userId } = action.payload;
            if (pageId) {
                newState = _.set(newState, `${userId}.${pageId}.loading`, false);
            }
            return newState;
        }

        /* Mutual friends fetching */
        case PROFILE_FETCH_MUTUAL_FRIEND: {
            const { userId, refresh } = action.payload;
            const newState = _.cloneDeep(state);
            const path = refresh 
                ? `${userId}.mutualFriends.refreshing` 
                : `${userId}.mutualFriends.loading`;
            return _.set(newState, path, true);
        }

        case PROFILE_FETCH_MUTUAL_FRIEND_DONE: {
            const { userId, refresh, skip, hasNextPage, data } = action.payload;
            let newState = _.cloneDeep(state);
            const path = refresh 
                ? `${userId}.mutualFriends.refreshing` 
                : `${userId}.mutualFriends.loading`;
            newState = _.set(newState, path, true);
            let newMutualFriends = _.get(newState, `${userId}.mutualFriends`);
            if (refresh) {
                newMutualFriends = _.set(newMutualFriends, 'data', data);
            } else {
                const oldData = _.get(newMutualFriends, 'data');
                const newData = arrayUnique(oldData.concat(data));
                newMutualFriends = _.set(newMutualFriends, 'data', newData);
            }
            newMutualFriends = _.set(newMutualFriends, 'hasNextPage', hasNextPage);
            newMutualFriends = _.set(newMutualFriends, 'skip', skip);

            return _.set(newState, `${userId}.mutualFriends`, newMutualFriends);
        }

        case PROFILE_FETCH_MUTUAL_FRIEND_COUNT_DONE: {
            const newState = _.cloneDeep(state);
            const { userId, data } = action.payload;
            if (!(userId in newState)) {
                return newState;
            }

            return _.set(newState, `${userId}.mutualFriends.count`, data);
        }

        /* Fetching friendship / updating friendship */
        case PROFILE_FETCH_FRIENDSHIP_DONE: {
            const newState = _.cloneDeep(state);
            const { data, userId } = action.payload;
            if (!_.has(newState, `${userId}`)) {
                console.log(`${DEBUG_KEY}: fetch friendship done for ${userId} but` + 
                'profile page for this user is no longer exists');
                return newState;
            }

            // Do not update since it's invalid
            if (data === null || data === undefined || _.isEmpty(data)) {
                return newState;
            }

            return _.set(newState, `${userId}.friendship`, data);
        }

        /**
            payload: {
                type: ['acceptFriend', 'deleteFriend', 'requestFriend']
                tab: ['requests.outgoing', 'requests.incoming', 'friends', 'suggested']
                data: if 'deleteFriend' or 'acceptFriend', then friendshipId. Otherwise, userId
            }
        */
        case MEET_UPDATE_FRIENDSHIP_DONE: {
            const { type, data, message } = action.payload;
            const { userId, friendshipId } = data;
            const resData = data.data;
            const newState = _.cloneDeep(state);

            if (!_.has(newState, userId)) {
                // meet is updating a user that has been opened profile yet
                return newState;
            }

            let newFriendship = _.cloneDeep(newState, `${userId}.friendship`);
            if (!message) {
                // If no message, upate succeeded
                if (type === 'requestFriend') {
                    if (resData && !_.isEmpty(resData)) {
                        newFriendship = _.cloneDeep(resData);
                    } else {
                        newFriendship.status = 'Invited';
                    }
                } else if (type === 'deleteFriend' && friendshipId === newFriendship._id) {
                    newFriendship.status = undefined;
                } else if (type === 'acceptFriend' && friendshipId === newFriendship._id) {
                    newFriendship.status = 'Accepted';
                }
            }

            return _.set(newState, `${userId}.friendship`, newFriendship);
        }

        /* Updating profile */
        case PROFILE_IMAGE_UPLOAD_SUCCESS: {
            const { data, userId } = action.payload;
            const newState = _.cloneDeep(state);
            sanityCheck(newState, userId, PROFILE_IMAGE_UPLOAD_SUCCESS);

            return _.set(newState, `${userId}.user.profile.tmpImage`, data);
        }

        case PROFILE_SUBMIT_UPDATE: {
            const { pageId, userId } = action.payload;
            let newState = _.cloneDeep(state);
            sanityCheck(newState, userId, PROFILE_SUBMIT_UPDATE);

            if (pageId) {
                newState = _.set(newState, `${userId}.${pageId}.uploading`, true);
            } else {
                console.warn(`${DEBUG_KEY}: [ ${PROFILE_SUBMIT_UPDATE} ]` +
                `no pageId passed in for profile update for userId: ${userId}`);
            }
            return newState;
        }

        case PROFILE_UPDATE_SUCCESS: {
            const { pageId, userId, user } = action.payload;
            let newState = _.cloneDeep(state);
            sanityCheck(newState, userId, PROFILE_UPDATE_SUCCESS);

            const userToUpdate = _.get(newState, `${userId}.user`);
            newState = _.set(newState, `${userId}.user`, { ...userToUpdate, ...user });

            if (!pageId || _.isEmpty(pageId)) {
                console.warn(`${DEBUG_KEY}: [ ${PROFILE_UPDATE_SUCCESS} ]` +
                `no pageId passed in for profile update for userId: ${userId}`);
            } else {
                newState = _.set(newState, `${userId}.${pageId}.uploading`, false);
            }
            return newState;
        }

        /* Profile tab navigation */
        case PROFILE_SWITCH_TAB: {
            const { index, pageId, userId } = action.payload;
            let newState = _.cloneDeep(state);
            sanityCheck(newState, userId, PROFILE_SWITCH_TAB);
            const shouldUpdate = sanityCheckPageId(state, userId, pageId, PROFILE_SWITCH_TAB);

            if (!shouldUpdate) return newState;
            
            const navigationstate = _.get(newState, `${userId}.${pageId}.navigationState`);
            const newSelectedTab = navigationstate.routes[index].key;

            newState = _.set(newState, `${userId}.${pageId}.navigationState.index`, index);
            newState = _.set(newState, `${userId}.${pageId}.selectedTab`, newSelectedTab);
            return newState;
        }

        /* Fetching goals / posts / needs for a profile */
        case PROFILE_FETCH_TAB: {
            const { type, userId, pageId } = action.payload;
            let newState = _.cloneDeep(state);
            const shouldUpdate = sanityCheckPageId(newState, userId, pageId, PROFILE_FETCH_TAB);
            if (shouldUpdate) {
                newState = _.set(newState, `${userId}.${pageId}.${type}.loading`, true);
            }
            return newState;
        }

        case PROFILE_REFRESH_TAB: {
            const { type, userId, pageId } = action.payload;
            let newState = _.cloneDeep(state);
            const shouldUpdate = sanityCheckPageId(newState, userId, pageId, PROFILE_REFRESH_TAB);
            if (shouldUpdate) {
                newState = _.set(newState, `${userId}.${pageId}.${type}.refreshing`, true);
            }
            return newState;
        }

        case PROFILE_REFRESH_TAB_DONE: {
            const { type, userId, pageId, data, skip, hasNextPage } = action.payload;
            let newState = _.cloneDeep(state);
            const shouldUpdate = sanityCheckPageId(
                newState, 
                userId, 
                pageId, 
                PROFILE_REFRESH_TAB_DONE
            );
            if (!shouldUpdate) {
                return newState;
            }

            let newData = data;
            if (type === 'needs') {
                newData = newData.filter((item) => item.needs && item.needs.length !== 0);
            }

            const path = `${userId}.${pageId}.${type}`;
            newState = _.set(newState, `${path}.data`, transformData(newData)); // only keep an array of ids
            newState = _.set(newState, `${path}.refreshing`, false);
            newState = _.set(newState, `${path}.skip`, skip);
            newState = _.set(newState, `${path}.hasNextPage`, hasNextPage);

            return newState; 
        }

        case PROFILE_FETCH_TAB_DONE: {
            const { type, userId, pageId, data, skip, hasNextPage } = action.payload;
            let newState = _.cloneDeep(state);
            const shouldUpdate = sanityCheckPageId(
                newState, 
                userId, 
                pageId, 
                PROFILE_REFRESH_TAB_DONE
            );
            if (!shouldUpdate) {
                return newState;
            }

            const path = `${userId}.${pageId}.${type}`;
            const oldData = _.get(newState, `${path}.data`);
            let newData = data;
            if (type === 'needs') {
              newData = newData.filter((item) => item.needs && item.needs.length !== 0);
            }
            newData = transformData(newData); // only keep an array of ids
            
            newState = _.set(newState, `${path}.data`, _.uniq(oldData.concat(newData)));
            newState = _.set(newState, `${path}.loading`, false);
            newState = _.set(newState, `${path}.skip`, skip);
            newState = _.set(newState, `${path}.hasNextPage`, hasNextPage);

            return newState; 
        }

        case PROFILE_FETCH_TAB_FAIL: {
            const { type, userId, pageId } = action.payload;
            let newState = _.cloneDeep(state);
            const shouldUpdate = sanityCheckPageId(newState, userId, pageId, PROFILE_FETCH_TAB_FAIL);
            if (shouldUpdate) {
                newState = _.set(newState, `${userId}.${pageId}.${type}.loading`, false);
            }
            return newState;
        }

        case PROFILE_REFRESH_TAB_FAIL: {
            const { type, userId, pageId } = action.payload;
            let newState = _.cloneDeep(state);
            const shouldUpdate = sanityCheckPageId(newState, userId, pageId, PROFILE_REFRESH_TAB_FAIL);
            if (shouldUpdate) {
                newState = _.set(newState, `${userId}.${pageId}.${type}.refreshing`, false);
            }
            return newState;
        }

        // Update one of filter within tab
        case PROFILE_UPDATE_FILTER: {
            const { tab, type, value, userId, pageId } = action.payload;
            const newState = _.cloneDeep(state);
            const shouldUpdate = sanityCheckPageId(newState, userId, pageId, PROFILE_UPDATE_FILTER);
            if (!shouldUpdate) return newState;

            const path = `${userId}.${pageId}.${tab}.filter`;
            if (type === 'priorities') {
                const oldPriorities = _.get(newState, `${path}.priorities`);
                const newPriorities = updatePriorities(oldPriorities, value);
                return _.set(newState, `${tab}.priorities`, newPriorities);
            }
            return _.set(newState, `${path}.${type}`, value);
        }

        case PROFILE_RESET_FILTER: {
            const { tab, pageId, userId } = action.payload;
            const newState = _.cloneDeep(state);
            const shouldUpdate = sanityCheckPageId(newState, userId, pageId, PROFILE_RESET_FILTER);

            if (!shouldUpdate) return newState;
            return _.set(newState, `${userId}.${pageId}.${tab}.filter`, { ...INITIAL_FILTER_STATE });
        }

        /* Goal / Post deletion */
        // When a goal or a post is deleted by user
        case PROFILE_GOAL_DELETE_SUCCESS: {
            const newState = _.cloneDeep(state);
            const { userId, pageId, goalId } = action.payload;
            const shouldUpdate = sanityCheck(newState, userId, PROFILE_GOAL_DELETE_SUCCESS);
            if (!shouldUpdate) return newState;

            const user = _.get(newState, `${userId}`);
            const updatedUser = removeItem(goalId, 'goals', 'user', user);
            return _.set(newState, `${userId}`, updatedUser);
        }
    
        case PROFILE_POST_DELETE_SUCCESS: {
            const newState = _.cloneDeep(state);
            const { userId, postId } = action.payload;
            const shouldUpdate = sanityCheck(newState, userId, PROFILE_POST_DELETE_SUCCESS);
            if (!shouldUpdate) return newState;

            const user = _.get(newState, `${userId}`);
            const updatedUser = removeItem(postId, 'posts', 'user', user);
            return _.set(newState, `${userId}`, updatedUser);
        }

        /* Create overlay (Plus button) */
        case PROFILE_OPEN_CREATE_OVERLAY: {
            const newState = _.cloneDeep(state);
            const { userId, pageId } = action.payload;
            const shouldUpdate = sanityCheckPageId(
                newState, 
                userId, 
                pageId, 
                PROFILE_OPEN_CREATE_OVERLAY);
            if (!shouldUpdate) {
                return newState;
            }

            return _.set(newState, `${userId}.${pageId}.showPlus`, false);
        }

        case PROFILE_CLOSE_CREATE_OVERLAY: {
            const newState = _.cloneDeep(state);
            const { userId, pageId } = action.payload;
            const shouldUpdate = sanityCheckPageId(
                newState, 
                userId, 
                pageId, 
                PROFILE_CLOSE_CREATE_OVERLAY);
            if (!shouldUpdate) {
                return newState;
            }

            return _.set(newState, `${userId}.${pageId}.showPlus`, true);
        }

        /* Profile setting (for app user only) */
        case SETTING_EMAIL_UPDATE_SUCCESS: {
            const { userId, email } = action.payload;
            let newState = _.cloneDeep(state);
            const shouldUpdate = sanityCheck(newState, userId, SETTING_EMAIL_UPDATE_SUCCESS);
            if (!shouldUpdate) {
                return newState;
            }

            newState = _.set(newState, `${userId}.user.email.address`, email);
            newState = _.set(newState, `${userId}.user.email.isVerified`, false);
            return newState;
        }

        case SETTING_PHONE_UPDATE_SUCCESS: {
            const { userId, phone } = action.payload;
            let newState = _.cloneDeep(state);
            const shouldUpdate = sanityCheck(newState, userId, SETTING_PHONE_UPDATE_SUCCESS);
            if (!shouldUpdate) {
                return newState;
            }

            newState = _.set(newState, `${userId}.user.phone.number`, phone);
            newState = _.set(newState, `${userId}.user.phone.isVerified`, false);
            return newState;
        }

        case SETTING_PHONE_VERIFICATION_SUCCESS: {
            const { userId } = action.payload;
            let newState = _.cloneDeep(state);
            const shouldUpdate = sanityCheck(newState, userId, SETTING_PHONE_UPDATE_SUCCESS);
            if (!shouldUpdate) {
                return newState;
            }

            newState = _.set(newState, `${userId}.user.phone.isVerified`, true);
            return newState;
        }

        /* User log out */
        case USER_LOG_OUT: {
            // Clean up actions
            return { ...INITIAL_STATE };
        }

        /* Default case */
        default:
            return { ...state };
    }
};

const transformData = (data) => data.map(d => d._id);

const sanityCheck = (state, userId, type) => {
    if (!_.has(state, userId)) {
        // This is bad since app user is updating a profile image that is never loaded
        console.warn(`${DEBUG_KEY}: [ ${type} ]` +
        `no user object found for userId: ${userId}`);
        return false;
    }
    return true;
};

const sanityCheckPageId = (state, userId, pageId, type) => {
    if (!_.has(state, userId)) {
        // This is bad since app user is updating a profile image that is never loaded
        console.warn(`${DEBUG_KEY}: [ ${type} ]` +
        `no user object found for userId: ${userId}`);
        return false;
    }

    const user = _.get(state, `${userId}`);
    const isPageIdInReference = user.reference !== undefined && user.reference.some(r => r === pageId);

    if (!_.has(user, `${pageId}`)) {
        if (isPageIdInReference) {
            console.warn(`${DEBUG_KEY}: pageId ${pageId} is in reference but missing from object`);
        } else {
            console.warn(`${DEBUG_KEY}: pageId ${pageId} is not in reference and also missing from object`);
        }
        return false;
    }

    if (!isPageIdInReference) {
        console.error(`${DEBUG_KEY}: pageId ${pageId} is not in reference but is part of the object. ` +
        'Potential memory leak');
        return false;
    }
    return true;
};

/**
 * Remove a post / goal id from related user's profile page.
 * prefixType: ['goal', 'post']
 * type: ['goals', 'posts']
 */
const removeItem = (id, type, prefixType, user) => {
    let userToReturn = _.cloneDeep(user);
    Object.keys(userToReturn).forEach(k => {
        // console.log(`${DEBUG_KEY}: checking prefixType: ${prefixType} with key: ${k}`);
        if (hasTypePrefix(prefixType, k)) { // Check if key k has type prefix
            // console.log(`${DEBUG_KEY}: checking prefixType: ${prefixType} with key: ${k} result is true`);
            // This is a page for type
            const oldData = _.get(userToReturn, `${k}.${type}.data`);
            const newData = oldData.filter(d => d !== id);
            userToReturn = _.set(userToReturn, `${k}.${type}.data`, newData);

            if (type === 'goals') {
                const oldNeed = _.get(userToReturn, `${k}.needs.data`);
                const newNeed = oldNeed.filter(d => d !== id);
                userToReturn = _.set(userToReturn, `${k}.needs.data`, newNeed);
            }
        }
    });
    // console.log(`${DEBUG_KEY}: finish removing: userToReturn is: `, userToReturn);
    return userToReturn;
};
