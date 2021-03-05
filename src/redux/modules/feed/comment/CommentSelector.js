/** @format */

import { createSelector } from 'reselect'
import _ from 'lodash'

import { INITIAL_COMMENT_OBJECT, INITIAL_COMMENT_PAGE } from './Comments'

const DEBUG_KEY = '[ Selector Comments ]'

const getNavigationTab = (state) => {
    const { tab } = state.navigation
    return tab
}
const getComment = (state) => state.comment

const getNewComment = (state) => state.newComment

const getPageId = (state, pageId) => pageId

/*
 * Iterate through member list to check if user is a current member
 */
export const getCommentByTab = createSelector(
    [getNavigationTab, getComment, getPageId],
    (tab, comment, pageId) => {
        const page = pageId ? `${pageId}` : 'default'
        const path = !tab ? `homeTab.${page}` : `${tab}.${page}`
        return _.get(comment, `${path}`)
    }
)

export const getNewCommentByTab = createSelector(
    [getNavigationTab, getNewComment, getPageId],
    (tab, newComment, pageId) => {
        const page = pageId ? `${pageId}` : 'default'
        const path = !tab ? `homeTab.${page}` : `${tab}.${page}`
        return _.get(newComment, `${path}`)
    }
)

const getCommentByEntityId = (state, entityId) => {
    const comments = state.comments
    if (!_.has(comments, entityId)) {
        console.warn(`${DEBUG_KEY}: no comments for entityId: ${entityId}`)
        return INITIAL_COMMENT_OBJECT
    }
    return _.get(comments, entityId)
}

export const getCommentWithPageInfo = (state, entityId, pageId) => {
    const commentObject = getCommentByEntityId(state, entityId)
    let commentPage = { ...INITIAL_COMMENT_PAGE }
    if (!_.has(commentObject, pageId)) {
        console.warn(`${DEBUG_KEY}: no comments page for entityId: ${entityId}`)
    } else {
        commentPage = _.get(commentObject, pageId)
    }

    const { data, transformedComments } = commentObject

    return {
        data,
        transformedComments,
        ...commentPage,
    }
}

export const makeGetCommentByEntityId = () => {
    return createSelector([getCommentWithPageInfo], (comments) => comments)
}

export const getRepliesWithPageInfo = (state, commentId, entityId) => {
    const commentObject = getCommentByEntityId(state, entityId)
    const { transformedComments } = commentObject

    return {
        item: transformedComments.find((val) => val._id === commentId),
    }
}

export const makeGetRepliesById = () => {
    return createSelector([getRepliesWithPageInfo], (replies) => replies)
}
