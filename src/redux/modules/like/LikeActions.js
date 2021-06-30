/** @format */

import { EVENT as E, trackWithProperties } from '../../../monitoring/segment'
import { api as API } from '../../middleware/api'
import { Logger } from '../../middleware/utils/Logger'
import {
    LIKE_COMMENT,
    LIKE_GOAL,
    LIKE_POST,
    UNLIKE_COMMENT,
    UNLIKE_GOAL,
    UNLIKE_POST,
} from './LikeReducers'

const DEBUG_KEY = '[ Action Like ]'
const LIKE_BASE_ROUTE = 'secure/feed/like'
// Like module related actions
/**
 * action to get like for a goal / post / comment
 * @params parentId: goal/post/comment id
 * @params parentType: ['Goal', 'Post', 'Comment']
 */
export const getLikeList = (parentId, parentType, callback) => (
    dispatch,
    getState
) => {
    const { token } = getState().user

    const onSuccess = (res) => {
        Logger.log(`${DEBUG_KEY}: [ getLikeList ] success with res: `, res, 3)
        if (callback) {
            return callback(res.data)
        }
    }

    const onError = (err) => {
        console.warn(`${DEBUG_KEY}: [ getLikeList ] failed with err: `, err)
    }

    API.get(
        `${LIKE_BASE_ROUTE}?parentId=${parentId}&parentType=${parentType}`,
        token
    )
        .then((res) => {
            if (res.status === 200) {
                return onSuccess(res)
            }
            return onError(res)
        })
        .catch((err) => {
            onError(err)
        })
}

/**
 * action to like a goal / post / comment
 * @params type: one of goal, post, comment
 * @params id: goal/post/comment id
 * @params pageId: if post / comment, we need to provide pageId
 */
export const likeGoal = (type, id, pageId, parentId, likeType) => (
    dispatch,
    getState
) => {
    const { token, userId } = getState().user
    const { tab } = getState().navigation
    const tmp = ((request) => {
        switch (request) {
            case 'goal':
                trackWithProperties(E.GOAL_LIKED, {
                    GoalId: id,
                    UserId: userId,
                })
                return {
                    requestBody: {
                        goalRef: id,
                        type: likeType,
                    },
                    action: (likeId) =>
                        dispatch({
                            type: LIKE_GOAL,
                            payload: {
                                id,
                                likeId,
                                tab,
                                type,
                            },
                        }),

                    undoAction: () =>
                        dispatch({
                            type: LIKE_GOAL,
                            payload: {
                                id,
                                likeId: undefined,
                                tab,
                                type,
                                undo: true,
                            },
                        }),
                }
            case 'post':
                trackWithProperties(E.POST_LIKED, {
                    PostId: id,
                    UserId: userId,
                })
                return {
                    requestBody: {
                        postRef: id,
                        type: likeType,
                    },
                    action: (likeId) =>
                        dispatch({
                            type: LIKE_POST,
                            payload: {
                                id,
                                likeId,
                                tab,
                                type,
                            },
                        }),
                    undoAction: () =>
                        dispatch({
                            type: LIKE_POST,
                            payload: {
                                id,
                                likeId: undefined,
                                tab,
                                undo: true,
                            },
                        }),
                }

            default:
                trackWithProperties(E.COMMENT_LIKED, {
                    CommentId: id,
                    UserId: userId,
                })
                return {
                    requestBody: {
                        commentRef: id,
                        type: likeType,
                    },
                    action: (likeId) =>
                        dispatch({
                            type: LIKE_COMMENT,
                            payload: {
                                id, // commentId
                                likeId,
                                tab,
                                type,
                                pageId,
                                parentId, // comment parentRef
                            },
                        }),
                    undoAction: () =>
                        dispatch({
                            type: LIKE_COMMENT,
                            payload: {
                                id, // commentId
                                likeId: undefined,
                                tab,
                                type,
                                pageId,
                                undo: true,
                                parentId, // comment parentRef
                            },
                        }),
                }
        }
    })(type)
    console.log(`${DEBUG_KEY}: tmp.requestBody: `, tmp.requestBody)
    tmp.action('testId')

    API.post(`${LIKE_BASE_ROUTE}`, { ...tmp.requestBody }, token)
        .then((res) => {
            // TODO: update reducers
            console.log(`${DEBUG_KEY}: like goal res: `, res)
            if (res.status >= 200 && res.status < 300 && res.data) {
                return tmp.action(res.data._id)
            }
            return tmp.undoAction()
        })
        .catch((err) => {
            console.log(
                `${DEBUG_KEY}: Error when like ${type} with id: ${id}. Error is: `,
                err
            )
            return tmp.undoAction()
        })
}

/**
 * action to unlike a goal / post / comment
 * @params id: entityId
 * @params parentId: for comment usage. We need parentId to identify in Comments reducer
 */
export const unLikeGoal = (type, id, likeId, pageId, parentId) => (
    dispatch,
    getState
) => {
    console.log(
        `[ Action Unlike ]: type: ${type} with id: ${id}. ` +
            `Like id: ${likeId}, pageId: ${pageId}, parentId: ${parentId}`
    )
    const { token, userId } = getState().user
    const { tab } = getState().navigation
    const tmp = ((request) => {
        switch (request) {
            case 'goal':
                trackWithProperties(E.GOAL_UNLIKED, {
                    GoalId: id,
                    UserId: userId,
                })
                return {
                    action: (unlikeId) =>
                        dispatch({
                            type: UNLIKE_GOAL,
                            payload: {
                                id,
                                likeId: unlikeId,
                                tab,
                                pageId,
                                type,
                            },
                        }),
                    undoAction: () =>
                        dispatch({
                            type: UNLIKE_GOAL,
                            payload: {
                                id,
                                likeId,
                                tab,
                                pageId,
                                type,
                                undo: true,
                            },
                        }),
                }
            case 'post':
                trackWithProperties(E.POST_LIKED, {
                    PostId: id,
                    UserId: userId,
                })
                return {
                    action: (unlikeId) =>
                        dispatch({
                            type: UNLIKE_POST,
                            payload: {
                                id,
                                likeId: unlikeId,
                                tab,
                                pageId,
                                type,
                            },
                        }),
                    undoAction: () =>
                        dispatch({
                            type: UNLIKE_POST,
                            payload: {
                                id,
                                likeId,
                                tab,
                                pageId,
                                type,
                                undo: true,
                            },
                        }),
                }

            default:
                trackWithProperties(E.COMMENT_LIKED, {
                    CommentId: id,
                    UserId: userId,
                })
                return {
                    action: (unlikeId) =>
                        dispatch({
                            type: UNLIKE_COMMENT,
                            payload: {
                                id,
                                likeId: unlikeId,
                                tab,
                                pageId,
                                type,
                                parentId, // comment parentId
                            },
                        }),
                    undoAction: () =>
                        dispatch({
                            type: UNLIKE_COMMENT,
                            payload: {
                                id, // commentId
                                parentId, // comment parentId
                                likeId,
                                tab,
                                pageId,
                                type,
                                undo: true,
                            },
                        }),
                }
        }
    })(type)
    tmp.action()

    API.delete(`${LIKE_BASE_ROUTE}?likeId=${likeId}`, { likeId }, token)
        .then((res) => {
            if (res.status === 200 || (res && res.isSuccess)) {
                console.log(
                    `${DEBUG_KEY}: Remove like successfully for ${type} with id: ${id}`
                )
                // TODO: update reducers
                return
            }
            console.warn(
                `${DEBUG_KEY}: Remove like return without error and success message.
        res is: `,
                res
            )
            return tmp.undoAction()
        })
        .catch((err) => {
            console.log(
                `${DEBUG_KEY}: Error when like ${type} with id: ${id}. Error is: `,
                err
            )
            return tmp.undoAction()
        })
}
