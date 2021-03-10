/** @format */

// This reducer is for Post Detail Page
import _ from 'lodash'

import { USER_LOG_OUT } from '../../../../reducers/User'

import { LIKE_POST, UNLIKE_POST } from '../../like/LikeReducers'

import { COMMENT_DELETE_SUCCESS } from '../comment/CommentReducers'

import { COMMENT_NEW_POST_SUCCESS } from '../comment/NewCommentReducers'

const NEW_POST_INITIAL_STATE = {
    mediaRef: undefined,
    uploading: false,
}

const POST_INITIAL_STATE = {
    pageIdCount: 0,
    pageId: 'post_0',
}

const INITIAL_STATE = {
    post: POST_INITIAL_STATE,
    newPost: NEW_POST_INITIAL_STATE,
    // Post detail in meet tab
    postProfileTab: POST_INITIAL_STATE,
    // Post detail in notification tab
    postNotificationTab: POST_INITIAL_STATE,
    // Post detail in explore tab
    postExploreTab: POST_INITIAL_STATE,
    // Post detail in chatTab
    postChatTab: POST_INITIAL_STATE,
}

export const POST_DETAIL_FETCH = 'post_detail_fetch'
export const POST_DETAIL_FETCH_DONE = 'post_detail_fetch_done'
export const POST_DETAIL_FETCH_ERROR = 'post_detail_fetch_error'
export const POST_DETAIL_OPEN = 'post_detail_open'
export const POST_DETAIL_CLOSE = 'post_detail_close'
// Comment related constants
export const POST_DETAIL_GET_COMMENT = 'post_detail_get_comment'
export const POST_DETAIL_CREATE_COMMENT = 'post_detail_create_comment'
export const POST_DETAIL_UPDATE_COMMENT = 'post_detail_create_comment'
export const POST_DETAIL_DELETE_COMMENT = 'post_detail_create_comment'

// New post related constants
export const POST_NEW_POST_UPDATE_MEDIA = 'post_new_post_update_media'
export const POST_NEW_POST_SUBMIT = 'post_new_post_submit'
export const POST_NEW_POST_SUBMIT_SUCCESS = 'post_new_post_submit_success'
export const POST_NEW_POST_SUBMIT_FAIL = 'post_new_post_submit_fail'

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case POST_DETAIL_FETCH: {
            return { ...state }
        }

        case POST_DETAIL_FETCH_DONE: {
            return { ...state }
        }

        case POST_DETAIL_OPEN: {
            const newState = _.cloneDeep(state)
            const { post, tab } = action.payload
            const path =
                !tab || tab === 'homeTab'
                    ? 'post'
                    : `post${capitalizeWord(tab)}`
            const { pageIdCount, pageId } = _.get(newState, `${path}`)

            return _.set(newState, `${path}`, { ...post, pageIdCount, pageId })
        }

        /**
         * Clear post detail on user close or log out
         */
        case POST_DETAIL_CLOSE: {
            const { tab } = action.payload
            const path =
                !tab || tab === 'homeTab'
                    ? 'post'
                    : `post${capitalizeWord(tab)}`
            const newState = _.cloneDeep(state)
            return _.set(newState, `${path}`, { ...POST_INITIAL_STATE })
        }

        case USER_LOG_OUT: {
            return { ...INITIAL_STATE }
        }

        case LIKE_POST:
        case UNLIKE_POST: {
            const { id, likeId, tab, undo } = action.payload
            let newState = _.cloneDeep(state)

            const path =
                !tab || tab === 'homeTab'
                    ? 'post'
                    : `post${capitalizeWord(tab)}`
            const post = _.get(newState, path)
            if (post._id && post._id === id) {
                const oldLikeCount = _.get(newState, `${path}.likeCount`, 0)
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

                newState = _.set(newState, `${path}.likeCount`, newLikeCount)
                newState = _.set(newState, `${path}.maybeLikeRef`, likeId)
            }
            return newState
        }

        case POST_NEW_POST_UPDATE_MEDIA: {
            const newState = _.cloneDeep(state)
            return _.set(newState, 'newPost.mediaRef', action.payload)
        }

        case POST_NEW_POST_SUBMIT: {
            const newState = _.cloneDeep(state)
            return _.set(newState, 'newPost.uploading', true)
        }

        case POST_NEW_POST_SUBMIT_FAIL: {
            const newState = _.cloneDeep(state)
            return _.set(newState, 'newPost.uploading', false)
        }

        case POST_NEW_POST_SUBMIT_SUCCESS: {
            const newState = _.cloneDeep(state)
            return _.set(newState, 'newPost', NEW_POST_INITIAL_STATE)
        }

        // When a comment is deleted for a goal, decrement the comment count
        case COMMENT_DELETE_SUCCESS: {
            const { tab } = action.payload
            const newState = _.cloneDeep(state)
            const path =
                !tab || tab === 'homeTab'
                    ? 'post'
                    : `post${capitalizeWord(tab)}`
            let currentCount = _.get(newState, `${path}.commentCount`)
            if (!currentCount) return newState
            return _.set(newState, `${path}.commentCount`, --currentCount)
        }

        case COMMENT_NEW_POST_SUCCESS: {
            const { tab } = action.payload
            const newState = _.cloneDeep(state)
            const path =
                !tab || tab === 'homeTab'
                    ? 'post'
                    : `post${capitalizeWord(tab)}`
            let currentCount = _.get(newState, `${path}.commentCount`) || 0
            return _.set(newState, `${path}.commentCount`, ++currentCount)
        }

        default:
            return { ...state }
    }
}

const capitalizeWord = (word) => {
    if (!word) return ''
    return word.replace(/^\w/, (c) => c.toUpperCase())
}
