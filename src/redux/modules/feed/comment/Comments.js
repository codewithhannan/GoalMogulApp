/**
 * This reducer is the source of truth for Comments related Components based on the design
 * https://docs.google.com/document/d/1JxjCLZGsp5x_Sy0R56y05aUgAUALtuSVAgJIway9JTg/edit?usp=sharing
 *
 * @format
 */

import _ from 'lodash'

import { USER_LOG_OUT } from '../../../../reducers/User'

import {
    GOAL_DETAIL_CLOSE,
    GOAL_DETAIL_OPEN,
} from '../../../../reducers/GoalDetailReducers'

import { POST_DETAIL_OPEN, POST_DETAIL_CLOSE } from '../post/PostReducers'

import { SHARE_DETAIL_OPEN, SHARE_DETAIL_CLOSE } from '../post/ShareReducers'

import {
    COMMENT_LOAD,
    COMMENT_LOAD_DONE,
    COMMENT_LOAD_ERROR,
    COMMENT_REFRESH_DONE,
    COMMENT_DELETE_SUCCESS,
} from './CommentReducers'

import { COMMENT_NEW_POST_SUCCESS } from './NewCommentReducers'

import { LIKE_COMMENT, UNLIKE_COMMENT } from '../../like/LikeReducers'

export const INITIAL_COMMENT_OBJECT = {
    data: [],
    transformedComments: [],
    skip: 0,
    limit: 40,
    loading: false,
    reference: [],
    // pageId: { ...INITIAL_NEW_COMMENT_OBJECT } // worry about this last
}

export const INITIAL_COMMENT_PAGE = {
    loading: false,
}

const INITIAL_NEW_COMMENT_OBJECT = {}

const DEBUG_KEY = '[ Reducer Comments ]'

/**
 * Consts to handle
 *
 * Comment related
 * COMMENT_LOAD (done)
 * COMMENT_LOAD_DONE (done)
 * COMMENT_LOAD_ERROR (done)
 * COMMENT_REFRESH_DONE (done)
 * COMMENT_DELETE_SUCCESS (done)
 * COMMENT_POST (no action implemented)
 * COMMENT_POST_DONE (no action implemented)
 * COMMENT_LOAD_MORE_REPLIES (no action implemented)
 *
 * Like related
 * LIKE_COMMENT,
 * UNLIKE_COMMENT
 *
 * New comment related
 * COMMENT_NEW_POST_SUCCESS
 *
 * Page related
 * GOAL_DETAIL_OPEN, (done)
 * GOAL_DETAIL_CLOSE (done)
 * POST_DETAIL_OPEN, (done)
 * POST_DETAIL_CLOSE (done)
 * SHARE_DETAIL_OPEN, (done)
 * SHARE_DETAIL_CLOSE (done)
 *
 * User related
 */

const INITIAL_STATE = {}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case COMMENT_LOAD: {
            let newState = _.cloneDeep(state)
            const { parentId, pageId } = action.payload
            const shouldUpdate = sanityCheckByPageId(
                newState,
                parentId,
                pageId,
                COMMENT_LOAD
            )
            if (!shouldUpdate) return newState
            newState = _.set(newState, `${parentId}.${pageId}.loading`, true)
            // console.log(`${DEBUG_KEY}: comment load with payload: `, action.payload);
            // console.log(`${DEBUG_KEY}: new state is: `, newState);
            return newState
        }

        case COMMENT_LOAD_ERROR: {
            let newState = _.cloneDeep(state)
            const { parentId, pageId } = action.payload
            const shouldUpdate = sanityCheckByPageId(
                newState,
                parentId,
                pageId,
                COMMENT_LOAD
            )
            if (!shouldUpdate) return newState
            newState = _.set(newState, `${parentId}.${pageId}.loading`, false)

            return newState
        }

        case COMMENT_REFRESH_DONE: // Comment has no load more and refresh
        case COMMENT_LOAD_DONE: {
            let newState = _.cloneDeep(state)
            const { parentId, pageId, data } = action.payload
            // console.log(`${DEBUG_KEY}: refresh done for comments: `, action.payload);
            const shouldUpdate = sanityCheckByPageId(
                newState,
                parentId,
                pageId,
                action.type
            )
            if (!shouldUpdate) return newState
            newState = _.set(newState, `${parentId}.${pageId}.loading`, false)

            const sortedData = data.sort(
                (item1, item2) =>
                    new Date(item1.created) - new Date(item2.created)
            )
            const transformedComments = transformComments(sortedData)
            newState = _.set(newState, `${parentId}.data`, sortedData)
            newState = _.set(
                newState,
                `${parentId}.transformedComments`,
                transformedComments
            )

            // console.log(`${DEBUG_KEY}: newState for comment is: `, newState);
            return newState
        }

        case COMMENT_DELETE_SUCCESS: {
            let newState = _.cloneDeep(state)
            // Note here, it's parentRef not parentId
            const { commentId, parentRef } = action.payload
            const shouldUpdate = sanityCheck(newState, parentRef, action.type)
            if (!shouldUpdate) return

            // Get old data
            const oldData = _.get(newState, `${parentRef}.data`)

            // Filter the removed comment
            const newData = oldData.filter(
                (item) =>
                    item._id !== commentId && item.replyToRef !== commentId
            )

            // Update the transformed comment
            const transformedComments = transformComments(newData)

            newState = _.set(newState, `${parentRef}.data`, newData)
            newState = _.set(
                newState,
                `${parentRef}.transformedComments`,
                transformedComments
            )

            return newState
        }

        case COMMENT_NEW_POST_SUCCESS: {
            let newState = _.cloneDeep(state)
            const { comment } = action.payload
            // Note here, it's parentRef not parentId
            const { parentRef } = comment
            const shouldUpdate = sanityCheck(newState, parentRef, action.type)
            if (!shouldUpdate) return

            // Get old data
            const oldData = _.get(newState, `${parentRef}.data`)

            // Push new comment to the end
            const newData = [...oldData, comment]

            // Update the transformed comment
            const transformedComments = transformComments(newData)

            newState = _.set(newState, `${parentRef}.data`, newData)
            newState = _.set(
                newState,
                `${parentRef}.transformedComments`,
                transformedComments
            )
            return newState
        }

        /* Goal, Post, Share detail page open */
        case SHARE_DETAIL_OPEN:
        case POST_DETAIL_OPEN:
        case GOAL_DETAIL_OPEN: {
            let entityId = ''
            const pageId = action.payload.pageId
            if (action.type === GOAL_DETAIL_OPEN) {
                entityId = action.payload.goalId
            }

            if (
                action.type === SHARE_DETAIL_OPEN ||
                action.type === POST_DETAIL_OPEN
            ) {
                entityId = action.payload.postId
            }

            let newState = _.cloneDeep(state)

            let commentToUpdate = { ...INITIAL_COMMENT_OBJECT }
            if (_.has(newState, entityId)) {
                commentToUpdate = _.get(newState, entityId)
            }

            if (!_.has(commentToUpdate, pageId)) {
                commentToUpdate = _.set(commentToUpdate, pageId, {
                    ...INITIAL_COMMENT_PAGE,
                })
            }

            // Update reference
            const oldReference = _.get(commentToUpdate, 'reference')
            const hasPageReference =
                oldReference !== undefined &&
                oldReference.some((r) => r === pageId)
            let newReference = [pageId]
            if (oldReference !== undefined) {
                if (!hasPageReference) {
                    // Add new reference
                    newReference = newReference.concat(oldReference)
                } else {
                    // Use the old reference
                    newReference = oldReference
                }
            }
            commentToUpdate = _.set(commentToUpdate, 'reference', newReference)

            newState = _.set(newState, entityId, commentToUpdate)
            return newState
        }

        case SHARE_DETAIL_CLOSE:
        case POST_DETAIL_CLOSE:
        case GOAL_DETAIL_CLOSE: {
            let entityId = ''
            const pageId = action.payload.pageId
            if (action.type === GOAL_DETAIL_CLOSE) {
                entityId = action.payload.goalId
            }

            if (
                action.type === SHARE_DETAIL_CLOSE ||
                action.type === POST_DETAIL_CLOSE
            ) {
                entityId = action.payload.postId
            }

            let newState = _.cloneDeep(state)
            let commentToUpdate = { ...INITIAL_COMMENT_OBJECT }

            if (!_.has(newState, entityId)) {
                // Nothing to remove as the reference is gone already
                return newState
            } else {
                commentToUpdate = _.get(newState, entityId)
            }

            // Update reference
            const oldReference = _.get(commentToUpdate, 'reference')
            let newReference = oldReference
            const hasPageReference =
                oldReference !== undefined &&
                oldReference.some((r) => r === pageId)
            if (oldReference !== undefined && hasPageReference) {
                // Remove the pageId from the reference
                newReference = oldReference.filter((r) => r !== pageId)
            }

            if (!newReference || _.isEmpty(newReference)) {
                // No more reference is associated with this entity
                // Remove everything that it has including here, its comments
                newState = _.omit(newState, `${entityId}`)
                return newState
            }

            commentToUpdate = _.omit(commentToUpdate, entityId) // Remove associated comment page
            commentToUpdate = _.set(commentToUpdate, 'reference', newReference)
            newState = _.set(newState, entityId, commentToUpdate)
            return newState
        }

        /* Like related */
        case UNLIKE_COMMENT:
        case LIKE_COMMENT: {
            let newState = _.cloneDeep(state)
            const { id, likeId, tab, pageId, parentId, undo } = action.payload
            // console.log(`${DEBUG_KEY}: [ ${action.type} ]: payload is:`, action.payload);
            const commentId = id

            const shouldUpdate = sanityCheck(newState, parentId, action.type)
            if (!shouldUpdate) return newState

            // Update original comments
            const oldData = _.get(newState, `${parentId}.data`)
            const newData = updateLike(
                oldData,
                commentId,
                likeId,
                undo,
                action.type
            )
            // Update transformed comments
            const transformedComments = transformComments(newData)
            newState = _.set(newState, `${parentId}.data`, newData)
            newState = _.set(
                newState,
                `${parentId}.transformedComments`,
                transformedComments
            )
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

const sanityCheck = (state, parentId, type) => {
    if (!_.has(state, parentId)) {
        console.warn(
            `${DEBUG_KEY}: [ ${type} ]: expecting parentId: ${parentId} but not found`
        )
        return false
    }
    return true
}

const sanityCheckByPageId = (state, parentId, pageId, type) => {
    if (!_.has(state, parentId)) {
        console.warn(
            `${DEBUG_KEY}: [ ${type} ]: expecting goalId: ${parentId} but not found`
        )
        return false
    }
    if (!_.has(state, `${parentId}.${pageId}`)) {
        console.warn(
            `${DEBUG_KEY}: [ ${type} ]: expecting goalId: ${parentId} and ` +
                `pageId: ${pageId} but not found`
        )
        return false
    }

    return true
}

const transformComments = (data) =>
    data
        .filter((comment) => !comment.replyToRef)
        .map((comment) => {
            const commentId = comment._id
            const childComments = data.filter(
                (currentComment) => currentComment.replyToRef === commentId
            )

            const numberOfChildrenShowing = childComments.length > 0 ? 1 : 0
            const hasMoreToShow =
                numberOfChildrenShowing !== childComments.length
            const newComment = {
                ...comment,
                childComments,
                hasMoreToShow,
                numberOfChildrenShowing,
            }
            return newComment
        })

function updateLike(array, id, likeId, undo, likeType) {
    return array.map((item) => {
        let newItem = _.cloneDeep(item)
        if (item._id.toString() === id.toString()) {
            const oldLikeCount = _.get(newItem, 'likeCount', 0)
            // console.log(`${DEBUG_KEY}: oldLikeCount for comment is: `, oldLikeCount);
            let newLikeCount = oldLikeCount || 0
            if (likeType === LIKE_COMMENT) {
                if (undo) {
                    newLikeCount = newLikeCount - 1
                } else if (likeId === 'testId') {
                    newLikeCount = newLikeCount + 1
                }
            } else if (likeType === UNLIKE_COMMENT) {
                if (undo) {
                    newLikeCount = newLikeCount + 1
                } else if (likeId === undefined) {
                    newLikeCount = newLikeCount - 1
                }
            }

            newItem = _.set(newItem, 'likeCount', newLikeCount)
            newItem = _.set(newItem, 'maybeLikeRef', likeId)
            // console.log(`${DEBUG_KEY}: newLikeCount for comment is: `, newLikeCount);
        }
        return newItem
    })
}
