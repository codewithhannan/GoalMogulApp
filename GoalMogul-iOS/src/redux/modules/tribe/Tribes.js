/**
 * This reducer is the source of truth for Tribes related Components based on the design
 * https://docs.google.com/document/d/1JxjCLZGsp5x_Sy0R56y05aUgAUALtuSVAgJIway9JTg/edit?usp=sharing
 */

import _ from 'lodash';
import {
    MYTRIBE_DETAIL_OPEN, // Not used in actions
    MYTRIBE_DETAIL_LOAD,
    MYTRIBE_DETAIL_LOAD_SUCCESS,
    MYTRIBE_DETAIL_LOAD_FAIL,
    MYTRIBE_DETAIL_CLOSE,
    MYTRIBE_FEED_FETCH,
    MYTRIBE_FEED_FETCH_DONE,
    MYTRIBE_FEED_REFRESH_DONE,
    MYTRIBE_REQUEST_JOIN_SUCCESS,
    MYTRIBE_REQUEST_JOIN_ERROR,
    MYTRIBE_REQUEST_JOIN,
    MYTRIBE_REQUEST_CANCEL_JOIN_SUCCESS,
    MYTRIBE_REQUEST_CANCEL_JOIN_ERROR,
    MYTRIBE_REQUEST_CANCEL_JOIN,
    MYTRIBE_MEMBER_SELECT_FILTER,
    MYTRIBE_SWITCH_TAB
} from './MyTribeReducers';

/**
 * List of actions to add
 * 
 * LIKE_POST
 * UNLIKE_POST
 * 
 * MYTRIBE_EDIT_SUCCESS
 * (Done) MYTRIBE_SWITCH_TAB,
 * (Not used in actions) MYTRIBE_DETAIL_OPEN,
 * (Done) MYTRIBE_DETAIL_LOAD,
 * (Done) MYTRIBE_DETAIL_LOAD_SUCCESS,
 * (WIP) MYTRIBE_DETAIL_LOAD_FAIL,
 * (Done) MYTRIBE_DETAIL_CLOSE,
 * (Done) MYTRIBE_FEED_FETCH,
 * (Done) MYTRIBE_FEED_FETCH_DONE,
 * (Done) MYTRIBE_FEED_REFRESH,
 * (Done) MYTRIBE_FEED_REFRESH_DONE,
 * (Done) MYTRIBE_MEMBER_REMOVE_SUCCESS,  --> replaced by MYTRIBE_UPDATE_MEMBER_SUCCESS with updateType
 * (Done) MYTRIBE_PROMOTE_MEMBER_SUCCESS, --> replaced by MYTRIBE_UPDATE_MEMBER_SUCCESS with updateType
 * (Done) MYTRIBE_ACCEPT_MEMBER_SUCCESS,  --> replaced by MYTRIBE_UPDATE_MEMBER_SUCCESS with updateType
 * (Done) MYTRIBE_DEMOTE_MEMBER_SUCCESS,  --> replaced by MYTRIBE_UPDATE_MEMBER_SUCCESS with updateType
 * (Done) MYTRIBE_MEMBER_ACCEPT_SUCCESS,  --> replaced by MYTRIBE_UPDATE_MEMBER_SUCCESS with updateType
 * (Done) MYTRIBE_MEMBER_SELECT_FILTER,
 * (Done) MYTRIBE_REQUEST_JOIN_SUCCESS,
 * (Done) MYTRIBE_REQUEST_JOIN_ERROR,
 * (Done) MYTRIBE_REQUEST_JOIN,
 * (Done) MYTRIBE_REQUEST_CANCEL_JOIN_SUCCESS,
 * (Done) MYTRIBE_REQUEST_CANCEL_JOIN_ERROR,
 * (Done) MYTRIBE_REQUEST_CANCEL_JOIN
 * MYTRIBE_RESET --> change to MYTRIBE_CLOSE
 */
export const TRIBE_NATIVATION_ROUTES = {
    default: [
        { key: 'about', title: 'About' },
        { key: 'members', title: 'Participants' }
    ],
    member: [
        { key: 'about', title: 'About' },
        { key: 'posts', title: 'Posts' },
        { key: 'members', title: 'Participants' }
    ]
};

export const TRIBE_USER_ROUTES = {
    default: [
        { key: 'Admin', title: 'Admin' },
        { key: 'Member', title: 'Member' },
        { key: 'JoinRequester', title: 'Requested' },
        { key: 'Invitee', title: 'Invited' }
    ],
    memberDefaultRoutes: [
        { key: 'Admin', title: 'Admin' },
        { key: 'Member', title: 'Member' }
    ],
    memberCanInviteRoutes: [
        { key: 'Admin', title: 'Admin' },
        { key: 'Member', title: 'Member' },
        { key: 'Invitee', title: 'Invited' }
    ]
}

export const MYTRIBE_NOT_FOUND = "mytribe_not_found";
export const MYTRIBE_FEED_REFRESH = "mytribe_feed_refresh";
export const MYTRIBE_UPDATE_MEMBER_SUCCESS = "mytribe_update_member_success";
export const MYTRIBE_EDIT_SUCCESS = 'mytribe_edit_success';
export const MYTRIBE_MEMBER_INVITE_FAIL = 'mytribe_member_invite_fail';
export const MYTRIBE_MEMBER_INVITE_SUCCESS = 'mytribe_member_invite_success';
export const MYTRIBE_DELETE_SUCCESS = 'mytribe_delete_success';

export const MEMBER_UPDATE_TYPE = {
    promoteAdmin: 'promoteAdmin',
    removeMember: 'removeMember',
    demoteMember: 'demoteMember',
    acceptMember: 'acceptMember', // can be either Admin accepts join request or user accepts invite
};

// page metadata related to a tribe page
export const INITIAL_TRIBE_PAGE = {
    navigationState: {
        index: 0,
        routes: _.cloneDeep(TRIBE_NATIVATION_ROUTES.member)
    },
    selectedTab: 'about',
    /*
     feed is put inside the TRIBE_PAGE as we don't want scrolling context to lose when other pages are refreshing
    */
    feed: [], // list of postIds that should be available in Posts
    feedLoading: false,
    feedRefreshing: false,
    allFeedRefs: [], // list of all post refs that this tribe has ever load. This is for cleanup purpose.
    tribeLoading: false,
    hasNextPage: undefined,
    updating: false,
    membersFilter: 'Admin',
    skip: 0,
    limit: 10,
    memberNavigationState: {
        index: 0,
        routes: _.cloneDeep(TRIBE_USER_ROUTES.default)
    }
};

/**
 * tribe object in redux that is mapped to a tribeId. Whenever tribe 
 * is opened in a new page, a new INITIAL_TRIBE_PAGE is created
 */
const INITIAL_TRIBE_OBJECT = {
    tribe: {},
    hasRequested: undefined,
    reference: [],
};

// keeps a map between tribeId --> tribe object
const INITIAL_STATE = {

};

const DEBUG_KEY = '[ Reducer Tribes ]';

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        // This case is currently not used anywhere
        // case MYTRIBE_DETAIL_OPEN:
        case MYTRIBE_DETAIL_CLOSE: // Tribe detail on close
        case MYTRIBE_NOT_FOUND: {  // Tribe can't be opened as user has no previlege to view
            const { tribeId, pageId } = action.payload;
            let newState = _.cloneDeep(state);
            if (!_.has(newState, tribeId) || !_.has(newState, `${tribeId}.${pageId}`)) {
                // Nothing to cleanup
                return newState;
            }

            let tribeToUpdate = _.get(newState, tribeId);
            let referenceToUpdate = removeReference(_.get(tribeToUpdate, 'reference'), pageId);

            // Remove page from tribe object
            tribeToUpdate = _.omit(tribeToUpdate, `${pageId}`);

            // Remove this tribe if it's no longer referenced
            if (!referenceToUpdate || _.isEmpty(referenceToUpdate)) {
                newState = _.omit(newState, `${tribeId}`);
                return newState;
            }

            // Update the tribe object references
            tribeToUpdate = _.set(tribeToUpdate, 'reference', referenceToUpdate);

            // Update the tribe by tribeId in new state
            newState = _.set(newState, `${tribeId}`, tribeToUpdate);
            return newState;
        }

        case MYTRIBE_DETAIL_LOAD: { // tribe detail starts loading. Preset the page data
            const { tribeId, pageId } = action.payload;
            let newState = _.cloneDeep(state);
            let tribeObjectToUpdate = _.has(newState, tribeId)
                ? _.get(newState, tribeId)
                : _.cloneDeep(INITIAL_TRIBE_OBJECT);

            if (!pageId) {
                // pageId doesn't exist log error
                // TODO: tribe: sentry log
                return newState;
            }

            // initialize page for this tribe
            if (!_.has(tribeObjectToUpdate, pageId)) {
                tribeObjectToUpdate = _.set(tribeObjectToUpdate, pageId, _.cloneDeep(INITIAL_TRIBE_PAGE));
            }

            // Update the reference
            const referenceToUpdate = addReference(_.get(tribeObjectToUpdate, 'reference'), pageId);
            tribeObjectToUpdate = _.set(tribeObjectToUpdate, 'reference', referenceToUpdate);

            // set page tribeLoading to true
            tribeObjectToUpdate = _.set(tribeObjectToUpdate, `${pageId}.tribeLoading`, true);
            
            // Update tribe object
            newState = _.set(newState, tribeId, tribeObjectToUpdate);
            return newState;
        }

        case MYTRIBE_DETAIL_LOAD_SUCCESS: {  // Tribe object load finishes.
            const { tribeId, pageId, tribe } = action.payload;
            let newState = _.cloneDeep(state);
            let tribeObjectToUpdate = _.has(newState, tribeId)
                ? _.get(newState, tribeId)
                : _.cloneDeep(INITIAL_TRIBE_OBJECT);

            if (!pageId) {
                // pageId doesn't exist log error.
                // TODO: tribe: sentry log
                return newState;
            }

            // initialize page for this tribe if not existing. But it should contain page by now.
            if (!_.has(tribeObjectToUpdate, pageId)) {
                tribeObjectToUpdate = _.set(tribeObjectToUpdate, pageId, _.cloneDeep(INITIAL_TRIBE_PAGE));
            }

            // Update the reference
            const referenceToUpdate = addReference(_.get(tribeObjectToUpdate, 'reference'), pageId);
            tribeObjectToUpdate = _.set(tribeObjectToUpdate, 'reference', referenceToUpdate);

            // set tribe item that is loaded
            tribeObjectToUpdate = _.set(tribeObjectToUpdate, 'tribe', tribe);
            // set page tribeLoading to false
            tribeObjectToUpdate = _.set(tribeObjectToUpdate, `${pageId}.tribeLoading`, false);

            // Update tribe object
            newState = _.set(newState, tribeId, tribeObjectToUpdate);
            return newState;
        }

        case MYTRIBE_FEED_REFRESH: { // feed starts refreshing
            const { pageId, tribeId } = action.payload;
            let newState = _.cloneDeep(state);
            if (!_.has(newState, tribeId) || !_.has(newState, `${tribeId}.${pageId}`)) {
                // TODO: tribe: add sentry log
                console.error(`${DEBUG_KEY}: tribeId ${tribeId} or pageId ${pageId} not exist for action: ${action.type}`);
                return newState;
            }

            // Set feedRefreshing to true
            newState = _.set(newState, `${tribeId}.${pageId}.feedRefreshing`, true);
            return newState;
        }

        case MYTRIBE_FEED_FETCH: { // feed starts loading more
            const { pageId, tribeId } = action.payload;
            let newState = _.cloneDeep(state);
            if (!_.has(newState, tribeId) || !_.has(newState, `${tribeId}.${pageId}`)) {
                // TODO: tribe: add sentry log
                console.error(`${DEBUG_KEY}: tribeId ${tribeId} or pageId ${pageId} not exist for action: ${action.type}`);
                return newState;
            }

            // Set feedLoading to true
            newState = _.set(newState, `${tribeId}.${pageId}.feedLoading`, true);
            return newState;
        }

        case MYTRIBE_FEED_FETCH_DONE: {  // load more of the tribe feed finish
            const { pageId, tribeId, hasNextPage, data, skip } = action.payload;
            let newState = _.cloneDeep(state);
            if (!_.has(newState, tribeId) || !_.has(newState, `${tribeId}.${pageId}`)) {
                // TODO: tribe: add sentry log
                console.error(`${DEBUG_KEY}: tribeId ${tribeId} or pageId ${pageId} not exist for action: ${action.type}`);
                return newState;
            }

            let tribePageToUpdate = _.get(newState, `${tribeId}.${pageId}`);
            // Update metadata
            tribePageToUpdate = _.set(tribePageToUpdate, "hasNextPage", hasNextPage);
            tribePageToUpdate = _.set(tribePageToUpdate, "skip", skip);
            tribePageToUpdate = _.set(tribePageToUpdate, "feedLoading", false);

            // Merge new post references
            const postRefs = data ? data.map(d => d._id) : [];
            const currPostRefs = _.get(tribePageToUpdate, "feed");
            const curAllFeedRefs = _.get(tribePageToUpdate, "allFeedRefs");
            tribePageToUpdate = _.set(tribePageToUpdate, "feed", _.uniq(currPostRefs.concat(postRefs)));

            // Update all feed refs for cleanup
            tribePageToUpdate = _.set(tribePageToUpdate, "allFeedRefs", _.union(curAllFeedRefs, postRefs));
            
            // Update tribe page in new state
            newState = _.set(newState, `${tribeId}.${pageId}`, tribePageToUpdate);

            return newState;
        }

        case MYTRIBE_FEED_REFRESH_DONE : {  // refresh tribe feed finish
            const { pageId, tribeId, hasNextPage, data, skip } = action.payload;
            let newState = _.cloneDeep(state);
            if (!_.has(newState, tribeId) || !_.has(newState, `${tribeId}.${pageId}`)) {
                // TODO: tribe: add sentry log
                console.error(`${DEBUG_KEY}: tribeId ${tribeId} or pageId ${pageId} not exist for action: ${action.type}`);
                return newState;
            }

            let tribePageToUpdate = _.get(newState, `${tribeId}.${pageId}`);
            // Update metadata
            tribePageToUpdate = _.set(tribePageToUpdate, "hasNextPage", hasNextPage);
            tribePageToUpdate = _.set(tribePageToUpdate, "skip", skip);
            tribePageToUpdate = _.set(tribePageToUpdate, "feedRefreshing", false); // update feedRefreshing since this is refreshing on complete

            // Merge new post references
            const postRefs = data ? data.map(d => d._id) : [];
            const curAllFeedRefs = _.get(tribePageToUpdate, "allFeedRefs");
            // replace feed 
            tribePageToUpdate = _.set(tribePageToUpdate, "feed", _.uniq(postRefs));

            // Update all feed refs for cleanup
            tribePageToUpdate = _.set(tribePageToUpdate, "allFeedRefs", _.union(curAllFeedRefs, postRefs));
            
            // Update tribe page in new state
            newState = _.set(newState, `${tribeId}.${pageId}`, tribePageToUpdate);
            return newState;
        }

        case MYTRIBE_UPDATE_MEMBER_SUCCESS: {
            const { userId, tribeId, updateType } = action.payload;
            let newState = _.cloneDeep(state);
            if (!updateType) {
                return newState;
            }

            if (!_.has(newState, tribeId)) {
                // TODO: tribe: add sentry log
                console.error(`${DEBUG_KEY}: tribeId: ${tribeId} doesn't exist in redux for action: `, action);
                return newState;
            }

            let tribeToUpdate = _.get(newState, tribeId);
            const oldMembers = _.get(tribeToUpdate, 'tribe.members', []);
            let newMembers = oldMembers;
            if (updateType == MEMBER_UPDATE_TYPE.promoteAdmin) {
                newMembers = updateMemberStatus(oldMembers, userId, 'Admin');
            } else if (updateType == MEMBER_UPDATE_TYPE.removeMember) {
                newMembers = oldMembers.filter((member) => member.memberRef._id !== userId);
            } else if (updateType == MEMBER_UPDATE_TYPE.demoteMember || updateType == MEMBER_UPDATE_TYPE.acceptMember) {
                newMembers = updateMemberStatus(oldMembers, userId, 'Member');
            } else {
                // TODO: tribe: sentry error log
            }

            tribeToUpdate = _.set(tribeToUpdate, 'tribe.members', newMembers);
            // Set new tribe in new state
            newState = _.set(newState, tribeId, tribeToUpdate);
            return newState;
        }

        case MYTRIBE_MEMBER_SELECT_FILTER: {
            const { option, index, tribeId, pageId } = action.payload;
            let newState = _.cloneDeep(state);
            if (!_.has(newState, tribeId) || !_.has(newState, `${tribeId}.${pageId}`)) {
                // TODO: tribe: add sentry log
                console.error(`${DEBUG_KEY}: tribeId ${tribeId} or pageId ${pageId} not exist for action: `, action);
                return newState;
            }

            let tribePageToUpdate = _.get(newState, `${tribeId}.${pageId}`);
            if (option) {
                tribePageToUpdate = _.set(tribePageToUpdate, 'membersFilter', option);
            }
            if (index || index === 0) {
                tribePageToUpdate = _.set(tribePageToUpdate, 'memberNavigationState.index', index);
            }

            newState = _.set(newState,  `${tribeId}.${pageId}`, tribePageToUpdate);
            return newState;
        }

        case MYTRIBE_REQUEST_JOIN_SUCCESS: {
            const { userId, tribeId, member, pageId } = action.payload;
            let newState = _.cloneDeep(state);
            if (!_.has(newState, tribeId) || !_.has(newState, `${tribeId}.${pageId}`)) {
                // TODO: tribe: add sentry log
                console.error(`${DEBUG_KEY}: tribeId: ${tribeId} or pageId: ${pageId} is not in redux for action`, action);
                return newState;
            }

            let tribeToUpdate = _.get(newState, tribeId);

            const oldMembers = _.get(tribeToUpdate, 'tribe.members');
            let newMembers = oldMembers.filter((m) => m.memberRef._id !== userId);
            newMembers = newMembers.concat(member);

            tribeToUpdate = _.set(tribeToUpdate, 'hasRequested', true);
            tribeToUpdate = _.set(tribeToUpdate, `${pageId}.updating`, false);
            tribeToUpdate = _.set(tribeToUpdate, 'tribe.members', newMembers);

            newState = _.set(newState, tribeId, tribeToUpdate);
            return newState;
        }

        case MYTRIBE_REQUEST_CANCEL_JOIN_ERROR:
        case MYTRIBE_REQUEST_JOIN_ERROR: {
            const { tribeId, pageId } = action.payload;
            if (!_.has(newState, tribeId) || !_.has(newState, `${tribeId}.${pageId}`)) {
                // TODO: tribe: add sentry log
                console.error(`${DEBUG_KEY}: tribeId ${tribeId} or pageId ${pageId} not exist for action: `, action);
                return newState;
            }

            const newState = _.cloneDeep(state);
            return _.set(newState, `${tribeId}.${pageId}.updating`, false);
        } 

        case MYTRIBE_REQUEST_JOIN:
        case MYTRIBE_REQUEST_CANCEL_JOIN: {
            const { tribeId, pageId } = action.payload;
            if (!_.has(newState, tribeId) || !_.has(newState, `${tribeId}.${pageId}`)) {
                // TODO: tribe: add sentry log
                console.error(`${DEBUG_KEY}: tribeId ${tribeId} or pageId ${pageId} not exist for action: `, action);
                return newState;
            }

            const newState = _.cloneDeep(state);
            return _.set(newState, `${tribeId}.${pageId}.updating`, true);
        }
        
        
        case MYTRIBE_REQUEST_CANCEL_JOIN_SUCCESS: {
            const { userId, tribeId, pageId } = action.payload;
            let newState = _.cloneDeep(state);
            if (!_.has(newState, tribeId) || !_.has(newState, `${tribeId}.${pageId}`)) {
                // TODO: tribe: add sentry log
                console.error(`${DEBUG_KEY}: tribeId: ${tribeId} is not in redux for action`, action);
                return newState;
            }

            let tribeToUpdate = _.get(newState, tribeId);

            const oldMembers = _.get(tribeToUpdate, 'tribe.members');
            let newMembers = oldMembers.filter((m) => m.memberRef._id !== userId);

            tribeToUpdate = _.set(tribeToUpdate, 'hasRequested', false);
            tribeToUpdate = _.set(tribeToUpdate, `${pageId}.updating`, false);
            tribeToUpdate = _.set(tribeToUpdate, 'tribe.members', newMembers);

            newState = _.set(newState, tribeId, tribeToUpdate);
            return newState;
        }

        case MYTRIBE_SWITCH_TAB: {
            const { index, tribeId, pageId } = action.payload;
            let newState = _.cloneDeep(state);
            if (!_.has(newState, tribeId) || !_.has(newState, `${tribeId}.${pageId}`)) {
                // TODO: tribe: add sentry log
                console.error(`${DEBUG_KEY}: tribeId: ${tribeId} is not in redux for action`, action);
                return newState;
            }

            let newNavigationState = _.get(newState, `${tribeId}.${pageId}.navigationState`);
            newNavigationState = _.set(newNavigationState, 'index', index);

            newState = _.set(newState, `${tribeId}.${pageId}.navigationState`, newNavigationState);
            return newState;
        }
        
        case MYTRIBE_EDIT_SUCCESS: {
            const { newTribe, tribeId } = action.payload;
            const newState = _.cloneDeep(state);

            if (!_.has(newState, tribeId)) {
                // TODO: tribe: add sentry log
                console.error(`${DEBUG_KEY}: tribeId: ${tribeId} is not in redux for action`, action);
                return newState;
            }

            let tribeToUpdate = _.get(newState, tribeId);
            const oldTribe = _.get(tribeToUpdate, 'tribe');
            const updatedTribe = updateTribe(oldTribe, newTribe);
            tribeToUpdate = _.set(tribeToUpdate, 'tribe', updatedTribe);

            newState = _.set(newState, tribeId, tribeToUpdate);
            return newState;
        }

        case MYTRIBE_DETAIL_LOAD_FAIL: // TODO: tribe: Load tribe detail failed
        default: 
            return { ...state };
    }
};

/**
 * Check if oldReference contains newPageId. Otherwise, add to the reference and return
 * @param {*} oldReference 
 * @param {*} newPageId 
 */
const addReference = (oldReference, newPageId) => {
    let referenceToReturn = _.cloneDeep(oldReference);
    if (referenceToReturn !== undefined) {
        if (!referenceToReturn.some(r => r === newPageId)) {
            // Add new pageId to reference
            referenceToReturn = referenceToReturn.concat(newPageId);
        }
    }
    return referenceToReturn;
}

/**
 * Remove pageId from oldReference if it contains pageId
 * @param {*} oldReference 
 * @param {*} pageId 
 */
const removeReference = (oldReference, pageId) => {
    let referenceToUpdate = _.cloneDeep(oldReference);
    if (referenceToUpdate !== undefined && referenceToUpdate.some(r => r === pageId)) {
        referenceToUpdate = referenceToUpdate.filter(r => r !== pageId);
    }
    return referenceToUpdate;
}

/**
 * Update member status in member list to new category
 * @param {*} members 
 * @param {*} memberIdToUpdate 
 * @param {*} newCategory 
 */
const updateMemberStatus = (members, memberIdToUpdate, newCategory) => {
    const newMembers = members.map((member) => {
        if (member.memberRef._id === memberIdToUpdate) {
            return _.set(member, 'category', newCategory);
        }
        return member;
    });
    return newMembers;
};

/**
 * Update the field of oldTribe
 * @param {*} oldTribe 
 * @param {*} newTribe 
 */
const updateTribe = (oldTribe, newTribe) => {
    let updatedTribe = _.cloneDeep(oldTribe);
    Object.keys(newTribe).forEach((key) => {
        // oldEvent doesn't have the field
        if (!oldTribe[key] || oldTribe[key] !== newTribe[key]) {
            updatedTribe = _.set(updatedTribe, `${key}`, newTribe[key]);
        }
    });
    return updatedTribe;
};