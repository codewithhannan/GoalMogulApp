/** @format */

// This stores all the comments for a specific goal
import R from 'ramda'
import _ from 'lodash'

import { arrayUnique } from '../../../middleware/utils'
import {
    GOAL_DETAIL_OPEN,
    GOAL_DETAIL_CLOSE,
} from '../../../../reducers/GoalDetailReducers'

import { POST_DETAIL_OPEN, POST_DETAIL_CLOSE } from '../post/PostReducers'

import { SHARE_DETAIL_OPEN, SHARE_DETAIL_CLOSE } from '../post/ShareReducers'

import { LIKE_COMMENT, UNLIKE_COMMENT } from '../../like/LikeReducers'

import { COMMENT_NEW_POST_SUCCESS } from './NewCommentReducers'

const DEBUG_KEY = '[ CommentReducers ]'

export const COMMENT_INITIAL_STATE = {
    data: [],
    transformedComments: [],
    skip: 0,
    limit: 40,
    loading: false,
    hasNextPage: undefined,
}
/**
 * This reducer is servered as denormalized comment stores. For each tab,
 * it looks like
 * goal_{pageId}: { COMMENT_INITIAL_STATE };
 */
export const INITIAL_STATE = {
    homeTab: {},
    profileTab: {
        ...COMMENT_INITIAL_STATE,
    },
    notificationTab: {
        ...COMMENT_INITIAL_STATE,
    },
    exploreTab: {
        ...COMMENT_INITIAL_STATE,
    },
    chatTab: {
        ...COMMENT_INITIAL_STATE,
    },
}

export const COMMENT_LOAD = 'comment_load'
export const COMMENT_REFRESH_DONE = 'comment_refresh_done'
export const COMMENT_LOAD_DONE = 'comment_load'
export const COMMENT_LOAD_MORE_REPLIES = 'comment_load_more_replies'
export const COMMENT_LOAD_ERROR = 'comment_load_error'
export const COMMENT_DELETE_SUCCESS = 'comment_delete_success'

// New comment related constants
export const COMMENT_POST = 'comment_post'
export const COMMENT_POST_DONE = 'comment_post_done'

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        // load more child comments
        case COMMENT_LOAD_MORE_REPLIES: {
            // TODO: find the comment and update the numberOfChildrenShowing and hasMoreToShow
            return {
                ...state,
            }
        }

        case COMMENT_LOAD_ERROR: {
            const { tab, pageId } = action.payload
            const newState = _.cloneDeep(state)

            const page = pageId ? `${pageId}` : 'default'
            const path = !tab ? `homeTab.${page}` : `${tab}.${page}`
            return _.set(newState, `${path}.loading`, false)
        }

        // following switches are to handle loading Comments
        case COMMENT_LOAD: {
            const { tab, pageId } = action.payload
            const newState = _.cloneDeep(state)

            const page = pageId ? `${pageId}` : 'default'
            const path = !tab ? `homeTab.${page}` : `${tab}.${page}`
            return _.set(newState, `${path}.loading`, true)
        }

        case COMMENT_REFRESH_DONE: {
            const { skip, data, hasNextPage, tab, pageId } = action.payload
            const page = pageId ? `${pageId}` : 'default'
            const path = !tab ? `homeTab.${page}` : `${tab}.${page}`
            let newState = _.cloneDeep(state)
            newState = _.set(newState, `${path}.loading`, false)

            if (skip !== undefined) {
                newState = _.set(newState, `${path}.skip`, skip)
            }
            newState = _.set(newState, `${path}.hasNextPage`, hasNextPage)
            const sortedData = data.sort(
                (item1, item2) =>
                    new Date(item1.created) - new Date(item2.created)
            )

            newState = _.set(newState, `${path}.data`, sortedData)
            // A dump way to transform all comments to comments with childComments
            const transformedComments = transformComments(sortedData)
            return _.set(
                newState,
                `${path}.transformedComments`,
                transformedComments
            )
        }

        // On new comment posted successfully, add the new comment to the loaded comments
        case COMMENT_NEW_POST_SUCCESS: {
            let newState = _.cloneDeep(state)
            const { tab, pageId, comment } = action.payload
            const page = pageId ? `${pageId}` : 'default'
            const path = !tab ? `homeTab.${page}` : `${tab}.${page}`
            const oldComments = _.get(newState, `${path}.data`)
            const newComments = [...oldComments, comment]

            newState = _.set(newState, `${path}.data`, newComments)

            const transformedComments = transformComments(newComments)
            return _.set(
                newState,
                `${path}.transformedComments`,
                transformedComments
            )
        }

        case COMMENT_LOAD_DONE: {
            const { skip, data, hasNextPage, tab, pageId } = action.payload
            let newState = _.cloneDeep(state)

            const page = pageId ? `${pageId}` : 'default'
            const path = !tab ? `homeTab.${page}` : `${tab}.${page}`
            newState = _.set(newState, `${path}.loading`, false)

            if (skip !== undefined) {
                newState = _.set(newState, `${path}.skip`, skip)
            }
            newState = _.set(newState, `${path}.hasNextPage`, hasNextPage)
            const oldData = _.get(newState, `${path}.data`)
            return _.set(
                newState,
                `${path}.data`,
                arrayUnique(oldData.concat(data))
            )
        }

        // User likes a comment or User unlikes a comment
        case UNLIKE_COMMENT:
        case LIKE_COMMENT: {
            const { id, likeId, tab, pageId } = action.payload
            // console.log(`${DEBUG_KEY}: [ ${action.type} ]: payload is:`, action.payload);
            const page = pageId ? `${pageId}` : 'default'

            let newState = _.cloneDeep(state)
            const path = !tab ? `homeTab.${page}` : `${tab}.${page}`
            // Update original comments
            const newData = updateLike(
                _.get(newState, `${path}.data`),
                id,
                likeId
            )
            // Update transformed comments
            const transformedComments = transformComments(newData)
            newState = _.set(newState, `${path}.data`, newData)
            return _.set(
                newState,
                `${path}.transformedComments`,
                transformedComments
            )
        }

        case SHARE_DETAIL_OPEN:
        case POST_DETAIL_OPEN:
        case GOAL_DETAIL_OPEN: {
            let newState = _.cloneDeep(state)
            const { tab, pageId } = action.payload
            const page = pageId ? `${pageId}` : 'default'

            const path = !tab ? `homeTab.${page}` : `${tab}.${page}`
            newState = _.set(newState, `${path}`, { ...COMMENT_INITIAL_STATE })
            return newState
        }

        case SHARE_DETAIL_CLOSE:
        case POST_DETAIL_CLOSE:
        case GOAL_DETAIL_CLOSE: {
            const { tab, pageId } = action.payload
            const page = pageId ? `${pageId}` : 'default'
            const path = !tab ? 'homeTab' : `${tab}`

            const properties = _.keys(_.get(state, path)).filter(
                (property) => property !== page
            )
            const newState = _.cloneDeep(state)
            const newTab = _.cloneDeep(_.get(newState, path))
            return _.set(newState, `${path}`, _.pick(newTab, properties))
        }

        // User deletes a comment successfully, remove comments and update status
        case COMMENT_DELETE_SUCCESS: {
            const { commentId, tab, pageId } = action.payload
            // console.log(`${action.type} comment, id is: ${id}, likeId is: ${likeId}`);
            const page = pageId ? `${pageId}` : 'default'

            let newState = _.cloneDeep(state)
            const path = !tab ? `homeTab.${page}` : `${tab}.${page}`
            const oldData = _.get(newState, `${path}.data`)
            // Update original comments
            const newData = oldData.filter((item) => item._id !== commentId)
            // Update transformed comments
            const transformedComments = transformComments(newData)
            newState = _.set(newState, `${path}.data`, newData)
            return _.set(
                newState,
                `${path}.transformedComments`,
                transformedComments
            )
        }

        default:
            return { ...state }
    }
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
        }
        return newItem
    })
}

/**
 * Note: following is the schema design for comment
{
  created: {
		type: Date,
		required: true,
	},
	lastUpdated: {
		type: Date,
		required: true,
	},
	owner: {
		type: Schema.ObjectId,
		ref: 'users',
		required: true,
  },
  parentType: {
    type: String,
    enum: ["Goal", "Post"],
    required: true,
  },
  parentRef: {
    type: Schema.ObjectId,
    required: true,
  },
	content: {
		text: String,
		tags: [{
			startIndex: Number,
			endIndex: Number,
			user: {
				type: Schema.ObjectId,
				ref: 'users',
			},
    }],
    links: [mongoose.SchemaTypes.Url]
  },
  commentType: {
    type: String,
    enum: ["Comment", "Reply", "Suggestion"],
    required: true,
  },
  replyToRef: {
      type: Schema.ObjectId,
      ref: 'comments',
  },
  suggestion: {
    suggestionType: {
      type: String,
      enum: ["ChatConvoRoom", "Event", "Tribe", "Link", "Reading", "Step", "Need", "Friend", "User", "Custom"],
      required: true,
    },
    suggestionFor: {
      type: String,
      enum: ["Goal", "Need", "Step"],
      required: true,
    },
    suggestionForRef: Schema.ObjectId,
    mediaRef: String,
    suggestionLink: mongoose.SchemaTypes.Url, // reading, link, custom
    suggestionText: String, // reading, custom
    userRef: {
        type: Schema.ObjectId,
        ref: 'users',
    },
    goalRef: {
        type: Schema.ObjectId,
        ref: 'goals',
    },
    needRef: Schema.ObjectId,
    stepRef: Schema.ObjectId, // pairs with goalRef
    // chatRoomRef/eventRef/tribeRef
  },
});
 */
