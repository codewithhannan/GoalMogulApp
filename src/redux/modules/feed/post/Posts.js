/**
 * This reducer is the source of truth for Posts related Components based on the design
 * https://docs.google.com/document/d/1JxjCLZGsp5x_Sy0R56y05aUgAUALtuSVAgJIway9JTg/edit?usp=sharing
 *
 * @format
 */

import _ from 'lodash'

import {
    PROFILE_FETCH_TAB_DONE,
    PROFILE_REFRESH_TAB_DONE,
    PROFILE_POST_DELETE_SUCCESS,
} from '../../../../reducers/Profile'

import { PROFILE_CLOSE_PROFILE } from '../../../../actions/types'

import {
    HOME_REFRESH_GOAL_DONE,
    HOME_LOAD_GOAL_DONE,
} from '../../../../reducers/Home'

import {
    POST_DETAIL_OPEN,
    POST_DETAIL_CLOSE,
    POST_NEW_POST_UPDATE_MEDIA,
    POST_NEW_POST_SUBMIT_SUCCESS,
    POST_NEW_POST_SUBMIT_FAIL,
    POST_NEW_POST_SUBMIT,
    POST_DETAIL_FETCH,
    POST_DETAIL_FETCH_DONE,
    POST_DETAIL_FETCH_ERROR,
} from './PostReducers'

import { SHARE_DETAIL_OPEN, SHARE_DETAIL_CLOSE } from './ShareReducers'

import { USER_LOG_OUT } from '../../../../reducers/User'

import { LIKE_POST, UNLIKE_POST } from '../../like/LikeReducers'

import { COMMENT_DELETE_SUCCESS } from '../comment/CommentReducers'

import { COMMENT_NEW_POST_SUCCESS } from '../comment/NewCommentReducers'

/* Tribe related */
import {
    MYTRIBE_FEED_FETCH_DONE,
    MYTRIBE_FEED_REFRESH_DONE,
    MYTRIBE_DETAIL_CLOSE,
} from '../../tribe/Tribes'

import {
    MYEVENT_FEED_FETCH_DONE,
    MYEVENT_FEED_REFRESH_DONE,
} from '../../event/MyEventReducers'

import {
    EVENT_FEED_FETCH_DONE,
    EVENT_FEED_REFRESH_DONE,
} from '../../event/EventReducers'

import {
    NOTIFICATION_SUBSCRIBE,
    NOTIFICATION_UNSUBSCRIBE,
} from '../../notification/NotificationTabReducers'
import {
    TRIBE_HUB_FEED_LOAD_DONE,
    TRIBE_HUB_FEED_REFRESH_DONE,
} from '../../tribe/MyTribeTabReducers'

/* Event related */

/**
 * Related consts to add
 *
 * Post related
 * POST_DETAIL_OPEN (done)
 * POST_DETAIL_CLOSE (done)
 * POST_DETAIL_FETCH
 * POST_DETAIL_FETCH_DONE (no action implemented)
 * POST_DETAIL_FETCH_ERROR
 *
 * New post related
 * POST_NEW_POST_UPDATE_MEDIA (done)
 * POST_NEW_POST_SUBMIT (done)
 * POST_NEW_POST_SUBMIT_SUCCESS (done)
 *
 * Share related
 * SHARE_DETAIL_OPEN (done)
 * SHARE_DETAIL_CLOSE (done)
 * SHARE_DETAIL_FETCH (no action implemented)
 * SHARE_DETAIL_FETCH_DONE (no action implemented)
 *
 * Profile related
 * PROFILE_FETCH_TAB_DONE (done)
 * PROFILE_REFRESH_TAB_DONE (done)
 * PROFILE_CLOSE_PROFILE (done)
 * PROFILE_POST_DELETE_SUCCESS (done)
 *
 * Comment related
 * COMMENT_DELETE_SUCCESS (done)
 * COMMENT_NEW_POST_SUCCESS (done)
 *
 * Home related (activityfeed)
 * HOME_REFRESH_GOAL_DONE (done)
 * HOME_LOAD_GOAL_DONE (done)
 *
 * Tribe related
 * MYTRIBE_FEED_FETCH_DONE (done)
 * MYTRIBE_FEED_REFRESH_DONE (done)
 * TRIBE_FEED_REFRESH_DONE (done)
 * TRIBE_FEED_REFRESH_DONE (done)
 *
 * Event related
 * MYEVENT_FEED_FETCH_DONE (done)
 * MYEVENT_FEED_REFRESH_DONE (done)
 * EVENT_FEED_REFRESH_DONE (done)
 * EVENT_FEED_REFRESH_DONE (done)
 *
 * Like related
 * LIKE_POST (done)
 * UNLIKE_POST (done)
 *
 * User related
 * USER_LOG_OUT (done)
 */

// Sample goal object in the map
export const INITIAL_POST_OBJECT = {
    post: {},
    // pageId: {
    //     refreshing: false
    // },
    reference: [],
}

export const INITIAL_POST_PAGE = {
    refreshing: false,
    loading: false, // Indicator if goal on this page is loading
    updating: false, // Indicator if goal on this page is updating
}

const NEW_POST_INITIAL_STATE = {
    mediaRef: undefined,
    uploading: false,
}

const INITIAL_STATE = {
    // This will replace the newPost in PostReducers for simplicity
    // There should be only one newPost at a time, so we don't need
    // Seperate it by page
    newPost: NEW_POST_INITIAL_STATE,
}

const DEBUG_KEY = '[ Reducers Posts ]'

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SHARE_DETAIL_OPEN:
        case POST_DETAIL_OPEN: {
            const { post, postId, pageId } = action.payload
            let newState = _.cloneDeep(state)
            let reference = [pageId]
            let postObjectToUpdate = _.has(newState, postId)
                ? _.get(newState, `${postId}`)
                : INITIAL_POST_OBJECT

            if (pageId === undefined) {
                // Abort something is wrong
                console.warn(
                    `${DEBUG_KEY}: [ ${POST_DETAIL_OPEN} ] with pageId: ${pageId}`
                )
                return newState
            }

            // Set the goal to the latest
            if (post !== undefined) {
                postObjectToUpdate = _.set(postObjectToUpdate, 'post', post)
            }

            // Setup goal page for pageId if not initially setup
            if (!_.has(postObjectToUpdate, pageId)) {
                postObjectToUpdate = _.set(postObjectToUpdate, pageId, {
                    ...INITIAL_POST_PAGE,
                })
            }

            // Update the reference
            const oldReference = _.get(postObjectToUpdate, 'reference')
            if (oldReference !== undefined) {
                if (!oldReference.some((r) => r === pageId)) {
                    reference = reference.concat(oldReference)
                } else {
                    reference = oldReference
                }
            }

            postObjectToUpdate = _.set(
                postObjectToUpdate,
                'reference',
                reference
            )

            // Update goal object
            newState = _.set(newState, `${postId}`, postObjectToUpdate)
            return newState
        }

        /* Goal Detail related */
        case POST_DETAIL_FETCH_DONE: {
            const { postId, post, pageId } = action.payload
            let newState = _.cloneDeep(state)
            let reference = pageId !== undefined ? [pageId] : []
            let postObjectToUpdate = _.has(newState, postId)
                ? _.get(newState, `${postId}`)
                : { ...INITIAL_POST_OBJECT }

            // Page should already exist for fetching a post detail otherwise abort
            if (pageId === undefined || !_.has(state, `${postId}.${pageId}`)) {
                return newState
            }

            // Set the post to the latest
            if (post !== undefined && post !== null) {
                postObjectToUpdate = _.set(postObjectToUpdate, 'post', post)
            }

            // Update the reference
            const oldReference = _.get(postObjectToUpdate, 'reference')
            if (oldReference !== undefined) {
                if (!oldReference.some((r) => r === pageId)) {
                    reference = reference.concat(oldReference)
                } else {
                    reference = oldReference
                }
            }

            postObjectToUpdate = _.set(
                postObjectToUpdate,
                `${pageId}.loading`,
                false
            )
            postObjectToUpdate = _.set(
                postObjectToUpdate,
                'reference',
                reference
            )

            newState = _.set(newState, `${postId}`, postObjectToUpdate)
            return newState
        }

        case POST_DETAIL_FETCH: {
            const { postId, pageId } = action.payload
            const newState = _.cloneDeep(state)
            const shouldUpdate = sanityCheckByPageId(
                newState,
                postId,
                pageId,
                action.type
            )
            if (!shouldUpdate) return newState
            return _.set(newState, `${postId}.${pageId}.loading`, true)
        }

        case POST_DETAIL_FETCH_ERROR: {
            const { postId, pageId } = action.payload
            const newState = _.cloneDeep(state)
            const shouldUpdate = sanityCheckByPageId(
                newState,
                postId,
                pageId,
                action.type
            )
            if (!shouldUpdate) return newState
            return _.set(newState, `${postId}.${pageId}.loading`, false)
        }

        case SHARE_DETAIL_CLOSE:
        case POST_DETAIL_CLOSE: {
            const { pageId, postId } = action.payload
            let newState = _.cloneDeep(state)
            if (!_.has(newState, postId)) return newState // no reference to remove

            let postToUpdate = _.get(newState, `${postId}`)

            // Update reference
            const oldReference = _.get(postToUpdate, 'reference')
            let newReference = oldReference
            if (
                oldReference !== undefined &&
                oldReference.some((r) => r === pageId)
            ) {
                newReference = newReference.filter((r) => r !== pageId)
            }

            // Remove pageId reference object
            postToUpdate = _.omit(postToUpdate, `${pageId}`)

            // Remove this post if it's no longer referenced
            if (!newReference || _.isEmpty(newReference)) {
                newState = _.omit(newState, `${postId}`)
                return newState
            }

            // Update the goal by goalId
            postToUpdate = _.set(postToUpdate, 'reference', newReference)
            newState = _.set(newState, `${postId}`, postToUpdate)
            return newState
        }

        /* New post related */
        case POST_NEW_POST_UPDATE_MEDIA: {
            const newState = _.cloneDeep(state)
            return _.set(newState, 'newPost.mediaRef', action.payload)
        }

        case POST_NEW_POST_SUBMIT: {
            const newState = _.cloneDeep(state)
            return _.set(newState, 'newPost.uploading', true)
        }

        case POST_NEW_POST_SUBMIT_SUCCESS: {
            const { post, update } = action.payload
            console.log(`${DEBUG_KEY}: payload is:`, action.payload)
            let newState = _.cloneDeep(state)

            // If it's an update, update the post
            if (update && post && post._id && _.has(newState, `${post._id}`)) {
                newState = _.set(newState, `${post._id}.post`, post)
            }
            return _.set(newState, 'newPost', { ...NEW_POST_INITIAL_STATE })
        }

        case POST_NEW_POST_SUBMIT_FAIL: {
            const newState = _.cloneDeep(state)
            return _.set(newState, 'newPost.uploading', false)
        }

        /* Profile, Home, Event and Tribe related */
        case TRIBE_HUB_FEED_LOAD_DONE:
        case TRIBE_HUB_FEED_REFRESH_DONE:
        case MYTRIBE_FEED_FETCH_DONE:
        case MYTRIBE_FEED_REFRESH_DONE:
        case MYEVENT_FEED_FETCH_DONE:
        case MYEVENT_FEED_REFRESH_DONE:
        case EVENT_FEED_FETCH_DONE:
        case EVENT_FEED_REFRESH_DONE:
        case HOME_REFRESH_GOAL_DONE:
        case HOME_LOAD_GOAL_DONE:
        case PROFILE_REFRESH_TAB_DONE:
        case PROFILE_FETCH_TAB_DONE: {
            const { pageId, data, type } = action.payload
            let newState = _.cloneDeep(state)

            // Customized logics
            if (
                action.type === PROFILE_REFRESH_TAB_DONE ||
                action.type === PROFILE_FETCH_TAB_DONE
            ) {
                if (type !== 'posts') return newState
            }

            // Customized logics
            if (
                action.type === HOME_REFRESH_GOAL_DONE ||
                action.type === HOME_LOAD_GOAL_DONE
            ) {
                if (type !== 'activityfeed') return newState
            }

            if (!data || _.isEmpty(data)) return newState

            data.forEach((post) => {
                const postId = post._id
                // Update goal
                if (!_.has(newState, postId)) {
                    newState = _.set(newState, `${postId}.post`, post)
                }

                const oldReference = _.get(newState, `${postId}.reference`)
                // console.log(`${DEBUG_KEY}: old reference is: `, oldReference);
                const hasPageReference =
                    oldReference !== undefined &&
                    oldReference.some((r) => r === pageId)
                // Update reference
                let newReference = [pageId]
                if (oldReference !== undefined) {
                    if (!hasPageReference) {
                        newReference = newReference.concat(oldReference)
                    } else {
                        newReference = oldReference
                    }
                }

                newState = _.set(newState, `${postId}.reference`, newReference)
            })

            return newState
        }

        case PROFILE_POST_DELETE_SUCCESS: {
            const { pageId, postId } = action.payload
            let newState = _.cloneDeep(state)
            if (!_.has(newState, postId)) return newState // no reference to remove

            let postToUpdate = _.get(newState, `${postId}`)

            // Update reference
            const oldReference = _.get(postToUpdate, 'reference')
            let newReference = oldReference
            if (oldReference && oldReference.some((r) => r === pageId)) {
                newReference = newReference.filter((r) => r !== pageId)
            }

            // Remove pageId reference object
            postToUpdate = _.omit(postToUpdate, `${pageId}`)

            // Remove this goal if it's no longer referenced
            if (!newReference || _.isEmpty(newReference)) {
                newState = _.omit(newState, `${postId}`)
                return newState
            }

            // Update the goal by goalId
            postToUpdate = _.set(postToUpdate, 'reference', newReference)
            newState = _.set(newState, `${postId}`, postToUpdate)
            return newState
        }

        // Tribe page close. Remove related post refs
        case MYTRIBE_DETAIL_CLOSE: {
            const { pageId, tribeId, allFeedRefs } = action.payload
            let newState = _.cloneDeep(state)

            if (!allFeedRefs || _.isEmpty(allFeedRefs)) return newState

            allFeedRefs.forEach((postId) => {
                // Check if postId in the Posts
                if (!_.has(newState, postId)) {
                    return
                }

                let postToUpdate = _.get(newState, `${postId}`)

                const oldReference = _.get(newState, `${postId}.reference`)
                const hasPageReference =
                    oldReference !== undefined &&
                    oldReference.some((r) => r === pageId)
                // Remove reference
                let newReference = _.cloneDeep(oldReference)
                if (hasPageReference) {
                    newReference = oldReference.filter((r) => r !== pageId)
                }

                // Remove this goal if it's no longer referenced
                if (!newReference || _.isEmpty(newReference)) {
                    newState = _.omit(newState, `${postId}`)
                    return
                }
                postToUpdate = _.set(postToUpdate, 'reference', newReference)
                newState = _.set(newState, `${postId}`, postToUpdate)
            })

            return newState
        }

        case PROFILE_CLOSE_PROFILE: {
            const { postList, pageId } = action.payload
            let newState = _.cloneDeep(state)
            if (!postList || _.isEmpty(postList)) return newState

            postList.forEach((postId) => {
                // Check if postId in the Posts
                if (!_.has(newState, postId)) {
                    return
                }

                let postToUpdate = _.get(newState, `${postId}`)

                // Remove pageId reference object
                postToUpdate = _.omit(postToUpdate, `${pageId}`)

                const oldReference = _.get(newState, `${postId}.reference`)
                const hasPageReference =
                    oldReference !== undefined &&
                    oldReference.some((r) => r === pageId)
                // Remove reference
                let newReference = oldReference
                if (hasPageReference) {
                    newReference = oldReference.filter((r) => r !== pageId)
                }

                // Remove this goal if it's no longer referenced
                if (!newReference || _.isEmpty(newReference)) {
                    newState = _.omit(newState, `${postId}`)
                    return
                }
                postToUpdate = _.set(postToUpdate, 'reference', newReference)
                newState = _.set(newState, `${postId}`, postToUpdate)
            })

            return newState
        }

        /* Comment related */
        case COMMENT_DELETE_SUCCESS: {
            const {
                pageId,
                tab,
                commentId,
                parentRef,
                parentType, // ['Goal', 'Post']
            } = action.payload
            let newState = _.cloneDeep(state)
            // check parentType to determine to proceed
            if (parentType !== 'Post') {
                return newState
            }
            // Check if post of concerned is in the Posts
            if (!_.has(newState, parentRef)) return newState
            if (!_.has(newState, `${parentRef}.post`)) {
                console.warn(
                    `${DEBUG_KEY}: post is not in ${parentRef}: `,
                    _.get(newState, `${parentRef}`)
                )
                return newState
            }
            // Decrease comment count
            const oldCommentCount =
                _.get(newState, `${parentRef}.post.commentCount`) || 0
            const newCommentCount =
                oldCommentCount - 1 < 0 ? 0 : oldCommentCount - 1

            newState = _.set(
                newState,
                `${parentRef}.post.commentCount`,
                newCommentCount
            )
            return newState
        }

        case COMMENT_NEW_POST_SUCCESS: {
            let newState = _.cloneDeep(state)
            const { comment } = action.payload
            const { parentType, parentRef } = comment
            // check parentType to determine to proceed
            if (parentType !== 'Post') {
                return newState
            }

            // Check if post of concerned is in the Posts
            if (!_.has(newState, parentRef)) return newState

            if (!_.has(newState, `${parentRef}.post`)) {
                console.warn(
                    `${DEBUG_KEY}: post is not in ${parentRef}: `,
                    _.get(newState, `${parentRef}`)
                )
                return newState
            }

            // Increase comment count
            const oldCommentCount =
                _.get(newState, `${parentRef}.post.commentCount`) || 0
            const newCommentCount = oldCommentCount + 1

            newState = _.set(
                newState,
                `${parentRef}.post.commentCount`,
                newCommentCount
            )
            return newState
        }

        /* Like related */
        case LIKE_POST:
        case UNLIKE_POST: {
            const { id, likeId, undo } = action.payload
            let newState = _.cloneDeep(state)
            const postId = id

            // No corresponding post exits
            if (!_.has(newState, `${postId}.post`)) return newState

            let postToUpdate = _.get(newState, `${postId}.post`)
            postToUpdate = _.set(postToUpdate, 'maybeLikeRef', likeId)

            const oldLikeCount = _.get(postToUpdate, 'likeCount', 0)
            let newLikeCount = oldLikeCount || 0
            if (action.type === LIKE_POST) {
                if (undo) {
                    newLikeCount = newLikeCount - 1
                } else if (likeId === 'testId') {
                    newLikeCount = newLikeCount + 1
                }
            } else if (action.type === UNLIKE_POST) {
                if (undo) {
                    newLikeCount = newLikeCount + 1
                } else if (likeId === undefined) {
                    newLikeCount = newLikeCount - 1
                }
            }

            postToUpdate = _.set(postToUpdate, 'likeCount', newLikeCount)
            newState = _.set(newState, `${postId}.post`, postToUpdate)
            return newState
        }

        // Notification to update maybeIsSubscribe state for goal
        case NOTIFICATION_UNSUBSCRIBE: {
            let newState = _.cloneDeep(state)
            const { entityId, entityKind } = action.payload
            if (entityKind !== 'Post') return newState
            const shouldUpdate = sanityCheck(newState, entityId, action.type)

            if (shouldUpdate) {
                newState = _.set(
                    newState,
                    `${entityId}.post.maybeIsSubscribed`,
                    false
                )
            }
            return newState
        }

        case NOTIFICATION_SUBSCRIBE: {
            let newState = _.cloneDeep(state)
            const { entityId, entityKind } = action.payload
            if (entityKind !== 'Post') return newState
            const shouldUpdate = sanityCheck(newState, entityId, action.type)

            if (shouldUpdate) {
                newState = _.set(
                    newState,
                    `${entityId}.post.maybeIsSubscribed`,
                    true
                )
            }
            return newState
        }

        /* User related */
        case USER_LOG_OUT: {
            return { ...INITIAL_STATE }
        }

        default:
            return { ...state }
    }
}

const sanityCheck = (state, postId, type) => {
    if (!_.has(state, postId)) {
        console.warn(
            `${DEBUG_KEY}: [ ${type} ]: expecting postId: ${postId} but not found`
        )
        return false
    }
    return true
}

const sanityCheckByPageId = (state, postId, pageId, type) => {
    if (!_.has(state, postId)) {
        console.warn(
            `${DEBUG_KEY}: [ ${type} ]: expecting postId: ${postId} but not found`
        )
        return false
    }
    if (!_.has(state, `${postId}.${pageId}`)) {
        console.warn(
            `${DEBUG_KEY}: [ ${type} ]: expecting postId: ${postId} and ` +
                `pageId: ${pageId} but not found`
        )
        return false
    }

    return true
}
