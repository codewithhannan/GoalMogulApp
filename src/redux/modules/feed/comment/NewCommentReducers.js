/** @format */

// This is the reducer for creating a new comment
import _ from 'lodash'
import validator from 'validator'
import {
    GOAL_DETAIL_OPEN,
    GOAL_DETAIL_CLOSE,
    GOAL_DETAIL_SWITCH_TAB_V2,
} from '../../../../reducers/GoalDetailReducers'

import { POST_DETAIL_OPEN, POST_DETAIL_CLOSE } from '../post/PostReducers'

import { SHARE_DETAIL_OPEN, SHARE_DETAIL_CLOSE } from '../post/ShareReducers'
import { INITIAL_COMMENT_OBJECT } from './Comments'

export const NEW_COMMENT_INITIAL_STATE = {
    contentText: '',
    contentTags: [], // { user, startIndex, endIndex, tagReg, tagText } //start index
    owner: undefined,
    // ["Goal", "Post"]
    parentType: undefined,
    parentRef: undefined,
    content: undefined,
    // This field is populated after comment is posted if there is an image
    mediaPresignedUrl: undefined,
    mediaRef: undefined,
    // ["Comment", "Reply", "Suggestion"]
    commentType: 'Comment',
    replyToRef: undefined,
    tmpSuggestion: { ...INITIAL_SUGGESETION },
    suggestion: { ...INITIAL_SUGGESETION },
    // This is used when suggestion type is friend and we search for certain friend
    friendList: [],
    showSuggestionModal: false,
    showAttachedSuggestion: false,
    uploading: false,
}
/**
 * This reducer is servered as denormalized comment stores
 */
const INITIAL_STATE = {
    homeTab: {
        //...NEW_COMMENT_INITIAL_STATE
    },
    profileTab: {
        //...NEW_COMMENT_INITIAL_STATE
    },
    notificationTab: {
        //...NEW_COMMENT_INITIAL_STATE
    },
    exploreTab: {
        //...NEW_COMMENT_INITIAL_STATE
    },
    chatTab: {
        //...NEW_COMMENT_INITIAL_STATE
    },
}

const INITIAL_SUGGESETION = {
    // ["ChatConvoRoom", "Event", "Tribe", "Link", "Reading",
    // "Step", "Need", "Friend", "User", "Custom"]
    suggestionType: 'Custom',
    // ["Goal", "Need", "Step"]
    suggestionFor: undefined,
    suggestionForRef: undefined,
    mediaRef: undefined,
    suggestionLink: undefined,
    suggestionText: undefined,
    userRef: undefined,
    goalRef: undefined,
    needRef: undefined,
    stepRef: undefined,
    chatRoomRef: undefined,
    eventRef: undefined,
    tribeRef: undefined,
    selectedItem: undefined,
}

const DEBUG_KEY = '[ Reducers NewComment ]'

export const COMMENT_NEW = 'comment_new'
export const COMMENT_EMPTY = 'comment_empty'
export const COMMENT_NEW_UPDATE = 'comment_new_update'
export const COMMENT_NEW_UPDATE_COMMENT_TYPE = 'comment_new_update_comment_type'
export const COMMENT_NEW_TEXT_ON_CHANGE = 'comment_new_text_on_change'
export const COMMENT_NEW_TAGS_ON_CHANGE = 'comment_new_tags_on_change'
export const COMMENT_NEW_TAGS_REG_ON_CHANGE = 'comment_new_tags_reg_on_change'
export const COMMENT_NEW_SUGGESTION_CREATE = 'comment_new_suggestion_create'
export const COMMENT_NEW_SUGGESTION_ATTACH = 'comment_new_suggestion_attach'
// Open suggestion modal
export const COMMENT_NEW_SUGGESTION_OPEN_MODAL =
    'comment_new_suggestion_open_modal'
// Open the attached suggestion to edit
export const COMMENT_NEW_SUGGESTION_OPEN_CURRENT =
    'comment_new_suggestion_open_current'
export const COMMENT_NEW_SUGGESTION_CANCEL = 'comment_new_suggestion_cancel'
export const COMMENT_NEW_SUGGESTION_REMOVE = 'comment_new_suggestion_remove'
export const COMMENT_NEW_SUGGESTION_UPDAET_TYPE =
    'comment_new_suggestion_update_type'
export const COMMENT_NEW_SUGGESTION_UPDATE_TEXT =
    'comment_new_suggestion_update_text'
export const COMMENT_NEW_SUGGESTION_UPDATE_LINK =
    'comment_new_suggestion_update_link'
// Select item for suggestion
export const COMMENT_NEW_SUGGESTION_SELECT_ITEM =
    'comment_new_suggestion_select_item'
// Posting a comment
export const COMMENT_NEW_POST_START = 'comment_new_post_start'
export const COMMENT_NEW_POST_SUCCESS = 'comment_new_post_success'
// Comment with suggestion for a need or a step succeed
export const COMMENT_NEW_POST_SUGGESTION_SUCCESS =
    'comment_new_post_suggestion_success'
export const COMMENT_NEW_POST_FAIL = 'comment_new_post_fail'

// User chooses an image in the comment
export const COMMENT_NEW_SELECT_IMAGE = 'comment_new_select_image'
export const COMMENT_NEW_UPLOAD_PICTURE_SUCCESS =
    'comment_new_upload_picture_success'
export const COMMENT_NEW_UPLOAD_VOICE_SUCCESS =
    'comment_new_upload_voice_success'

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GOAL_DETAIL_OPEN: {
            let newState = _.cloneDeep(state)
            const { tab, goal, pageId, goalId } = action.payload
            const page = pageId ? `${pageId}` : 'default'
            const path = !tab ? `homeTab.${page}` : `${tab}.${page}`
            newState = _.set(newState, `${path}`, {
                ...NEW_COMMENT_INITIAL_STATE,
            })
            newState = _.set(newState, `${path}.parentType`, 'Goal')
            return _.set(
                newState,
                `${path}.parentRef`,
                goalId ? goalId : goal._id
            )
        }

        case SHARE_DETAIL_OPEN: {
            let newState = _.cloneDeep(state)
            const { tab, share, pageId, postId } = action.payload
            const page = pageId ? `${pageId}` : 'default'
            const path = !tab ? `homeTab.${page}` : `${tab}.${page}`
            newState = _.set(newState, `${path}`, {
                ...NEW_COMMENT_INITIAL_STATE,
            })
            newState = _.set(newState, `${path}.parentType`, 'Post')
            return _.set(newState, `${path}.parentRef`, postId)
        }

        case POST_DETAIL_OPEN: {
            let newState = _.cloneDeep(state)
            const { tab, post, pageId, postId } = action.payload
            const page = pageId ? `${pageId}` : 'default'
            const path = !tab ? `homeTab.${page}` : `${tab}.${page}`
            newState = _.set(newState, `${path}`, {
                ...NEW_COMMENT_INITIAL_STATE,
            })
            newState = _.set(newState, `${path}.parentType`, 'Post')
            return _.set(newState, `${path}.parentRef`, postId)
        }

        // When user exits the GoalDetailCard, we need to reset the state
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

        case COMMENT_NEW_POST_FAIL: {
            const newState = _.cloneDeep(state)
            const { tab, pageId } = action.payload
            const page = pageId ? `${pageId}` : 'default'
            const path = !tab ? `homeTab.${page}` : `${tab}.${page}`
            return _.set(newState, `${path}.uploading`, false)
        }

        case COMMENT_NEW_POST_START: {
            const newState = _.cloneDeep(state)
            const { tab, pageId } = action.payload
            const page = pageId ? `${pageId}` : 'default'
            const path = !tab ? `homeTab.${page}` : `${tab}.${page}`
            return _.set(newState, `${path}.uploading`, true)
        }

        // when comment posts succeed, delete everything but parent type and ref
        case COMMENT_NEW_POST_SUCCESS: {
            const newState = _.cloneDeep(state)
            console.log(`${DEBUG_KEY}: payload is: `, action.payload)
            const { tab, pageId } = action.payload
            const page = pageId ? `${pageId}` : 'default'
            const path =
                !tab || tab === 'homeTab' ? `homeTab.${page}` : `${tab}.${page}`

            // We need to preserve parentType, parentRef, needRef, stepRef,
            const oldComment = _.get(newState, `${path}`)
            const resetComment = resetNewComment(oldComment)
            // const parentType = _.get(newState, `${path}.parentType`);
            // const parentRef = _.get(newState, `${path}.parentRef`);

            // const newTabState = {
            //   ...NEW_COMMENT_INITIAL_STATE,
            //   parentType,
            //   parentRef
            // };
            console.log(
                `${DEBUG_KEY}: [ COMMENT_NEW_POST_SUCCESS ]: resetComment:`,
                resetComment
            )
            return _.set(newState, `${path}`, resetComment)
        }

        // cases related to new comment
        case COMMENT_NEW_TEXT_ON_CHANGE: {
            // TODO: potential optimzation
            const newState = _.cloneDeep(state)
            const { tab, text, pageId } = action.payload
            const page = pageId ? `${pageId}` : 'default'
            const path = !tab ? `homeTab.${page}` : `${tab}.${page}`
            return _.set(newState, `${path}.contentText`, text)
        }

        case COMMENT_NEW_TAGS_ON_CHANGE: {
            const newState = _.cloneDeep(state)
            const { tab, contentTags, pageId } = action.payload
            const page = pageId ? `${pageId}` : 'default'
            const path = !tab ? `homeTab.${page}` : `${tab}.${page}`
            return _.set(newState, `${path}.contentTags`, contentTags)
        }

        case COMMENT_NEW_TAGS_REG_ON_CHANGE: {
            const newState = _.cloneDeep(state)
            const { tab, contentTagsReg, pageId } = action.payload
            const page = pageId ? `${pageId}` : 'default'
            const path = !tab ? `homeTab.${page}` : `${tab}.${page}`
            return _.set(newState, `${path}.contentTagsReg`, contentTagsReg)
        }

        case COMMENT_NEW: {
            const {
                parentType,
                parentRef,
                commentType,
                replyToRef,
                name,
                tag,
                owner,
                tab,
                pageId,
                suggestionFor,
                suggestionForRef,
                suggestionType,
                needRef, // Added to differentiate if this is a comment for a need
                stepRef, // Added to differentiate if this is a comment for a need
            } = action.payload
            const page = pageId ? `${pageId}` : 'default'
            const path = !tab ? `homeTab.${page}` : `${tab}.${page}`
            let newState = _.cloneDeep(state)
            if (suggestionFor && suggestionForRef) {
                const suggestion = {
                    suggestionFor,
                    suggestionForRef,
                    suggestionType,
                }
                newState = setState(newState, `${path}.suggestion`, suggestion)
            }
            newState = setState(newState, `${path}.parentType`, parentType)
            newState = setState(newState, `${path}.parentRef`, parentRef)
            newState = setState(newState, `${path}.commentType`, commentType)
            newState = setState(newState, `${path}.replyToRef`, replyToRef)
            newState = setState(newState, `${path}.name`, name)
            newState = setState(newState, `${path}.tag`, tag)
            newState = setState(newState, `${path}.owner`, owner)

            if (needRef) {
                newState = setState(newState, `${path}.needRef`, needRef)
            }

            if (stepRef) {
                newState = setState(newState, `${path}.stepRef`, stepRef)
            }

            // console.log(`${DEBUG_KEY}: new state for newcomment: `, newState);
            return newState
        }

        case COMMENT_EMPTY: {
            const newState = _.cloneDeep(state)
            const { commentDetail, tab, pageId } = action.payload
            const page = pageId ? `${pageId}` : 'default'
            const path = !tab ? `homeTab.${page}` : `${tab}.${page}`
            return _.set(newState, `${path}`, {
                ...NEW_COMMENT_INITIAL_STATE,
                ...commentDetail,
            })
        }

        case COMMENT_NEW_UPDATE: {
            const newState = _.cloneDeep(state)
            const { newComment, tab, pageId } = action.payload
            const page = pageId ? `${pageId}` : 'default'
            const path = !tab ? `homeTab.${page}` : `${tab}.${page}`
            return _.set(newState, `${path}`, newComment)
        }

        case COMMENT_NEW_UPDATE_COMMENT_TYPE: {
            const newState = _.cloneDeep(state)
            const { commentType, tab, pageId } = action.payload
            const page = pageId ? `${pageId}` : 'default'
            const path = !tab ? `homeTab.${page}` : `${tab}.${page}`
            return _.set(newState, `${path}.commentType`, commentType)
        }

        case COMMENT_NEW_SUGGESTION_UPDAET_TYPE: {
            let newState = _.cloneDeep(state)
            const { tab, suggestionType, pageId } = action.payload
            const page = pageId ? `${pageId}` : 'default'
            const path = !tab ? `homeTab.${page}` : `${tab}.${page}`
            newState = _.set(
                newState,
                `${path}.tmpSuggestion.suggestionType`,
                suggestionType
            )
            return newState
        }

        case COMMENT_NEW_SUGGESTION_CREATE: {
            const {
                suggestionFor,
                suggestionForRef,
                tab,
                pageId,
            } = action.payload
            const page = pageId ? `${pageId}` : 'default'
            const path = !tab ? `homeTab.${page}` : `${tab}.${page}`
            let newState = _.cloneDeep(state)
            newState = _.set(
                newState,
                `${path}.tmpSuggestion.suggestionFor`,
                suggestionFor
            )
            newState = _.set(
                newState,
                `${path}.tmpSuggestion.suggestionForRef`,
                suggestionForRef
            )

            return newState
        }

        // Remove the suggestion to become initial state
        case COMMENT_NEW_SUGGESTION_REMOVE: {
            let newState = _.cloneDeep(state)
            const { tab, pageId } = action.payload
            const page = pageId ? `${pageId}` : 'default'
            const path = !tab ? `homeTab.${page}` : `${tab}.${page}`
            newState = _.set(newState, `${path}.showAttachedSuggestion`, false)

            // Since suggestion is removed, reset commentType to Comment
            newState = _.set(newState, `${path}.commentType`, 'Comment')

            const oldTmpSuggestion = _.get(newState, `${path}.tmpSuggestion`)
            const resetTmpSuggestion = resetTmpSuggestionFromState(
                oldTmpSuggestion
            )
            newState = _.set(
                newState,
                `${path}.tmpSuggestion`,
                resetTmpSuggestion
            )
            return _.set(newState, `${path}.suggestion`, {
                ...INITIAL_SUGGESETION,
            })
        }

        // Reset the temperary suggestion to become initial state
        case COMMENT_NEW_SUGGESTION_CANCEL: {
            let newState = _.cloneDeep(state)
            const { tab, pageId } = action.payload
            const page = pageId ? `${pageId}` : 'default'
            const path = !tab ? `homeTab.${page}` : `${tab}.${page}`

            // Close suggestion modal
            newState = _.set(newState, `${path}.showSuggestionModal`, false)
            return _.set(newState, `${path}.tmpSuggestion`, {
                ...INITIAL_SUGGESETION,
            })
        }

        // Set tmp suggestion to final suggestion
        case COMMENT_NEW_SUGGESTION_ATTACH: {
            let newState = _.cloneDeep(state)
            const {
                tab,
                pageId,
                goalDetail,
                focusType,
                focusRef,
            } = action.payload
            const page = pageId ? `${pageId}` : 'default'
            const path = !tab ? `homeTab.${page}` : `${tab}.${page}`

            let tmpSuggestion = _.get(newState, `${path}.tmpSuggestion`)
            // If suggestion type is NewStep or NewNeed, we need to set the
            // suggestionFor and suggestionForRef as the current goal
            // Or if the focusType is comment, it means user is viewing all comments
            if (
                tmpSuggestion.suggestionType === 'NewStep' ||
                tmpSuggestion.suggestionType === 'NewNeed' ||
                focusType === 'comment'
            ) {
                tmpSuggestion = _.set(tmpSuggestion, 'suggestionFor', 'Goal')
                tmpSuggestion = _.set(
                    tmpSuggestion,
                    'suggestionForRef',
                    goalDetail._id
                )

                if (
                    tmpSuggestion.suggestionType === 'NewStep' ||
                    tmpSuggestion.suggestionType === 'NewNeed'
                ) {
                    tmpSuggestion = _.set(
                        tmpSuggestion,
                        'goalRef',
                        goalDetail._id
                    )
                }
            } else if (focusType === 'step' || focusType === 'need') {
                // If focusType is either step or need, it means user are suggesting
                // everything else but NewStep and NewNeed for a step or a need
                tmpSuggestion = _.set(
                    tmpSuggestion,
                    'suggestionFor',
                    focusType === 'step' ? 'Step' : 'Need'
                )
                tmpSuggestion = _.set(
                    tmpSuggestion,
                    'suggestionForRef',
                    focusRef
                )
            }

            if (
                tmpSuggestion.suggestionType === 'Custom' &&
                tmpSuggestion.suggestionLink &&
                !tmpSuggestion.suggestionText
            ) {
                tmpSuggestion = _.set(
                    tmpSuggestion,
                    'suggestionText',
                    'Suggestion'
                )
            }

            // Append https:// to the url if suggestion type is custome with suggestionLink
            if (
                tmpSuggestion.suggestionType === 'Custom' &&
                tmpSuggestion.suggestionLink
            ) {
                let url = tmpSuggestion.suggestionLink

                // url is a valid url without protocol
                if (
                    validator.isURL(url) &&
                    !validator.isURL(url, {
                        protocols: ['http', 'https'],
                        require_protocol: true,
                    })
                ) {
                    // Set https:// as protocol
                    url = `http://${url}`
                    // Update tmpSuggestion.suggestionLink
                    tmpSuggestion = _.set(tmpSuggestion, 'suggestionLink', url)
                }
                console.log(`${DEBUG_KEY}: updaetd url is:`, url)
            }

            newState = _.set(newState, `${path}.suggestion`, tmpSuggestion)
            newState = _.set(newState, `${path}.showAttachedSuggestion`, true)
            // Only set the commentType to suggestion if something is attached
            newState = _.set(newState, `${path}.commentType`, 'Suggestion')
            // Close suggestion modal
            return _.set(newState, `${path}.showSuggestionModal`, false)
        }

        // Set current suggestion to tmp suggestion for editing
        case COMMENT_NEW_SUGGESTION_OPEN_CURRENT: {
            let newState = _.cloneDeep(state)
            const { tab, pageId } = action.payload
            const page = pageId ? `${pageId}` : 'default'
            const path = !tab ? `homeTab.${page}` : `${tab}.${page}`

            const suggestion = _.get(newState, `${path}.suggestion`)
            newState = _.set(newState, `${path}.tmpSuggestion`, suggestion)

            // Open suggestion modal
            return _.set(newState, `${path}.showSuggestionModal`, true)
        }

        case COMMENT_NEW_SUGGESTION_OPEN_MODAL: {
            let newState = _.cloneDeep(state)
            // console.log(`${DEBUG_KEY}: old state is: `, newState);
            const { tab, pageId } = action.payload
            const page = pageId ? `${pageId}` : 'default'
            const path = !tab ? `homeTab.${page}` : `${tab}.${page}`

            newState = _.set(newState, `${path}.showSuggestionModal`, true)
            // console.log(`${DEBUG_KEY}: new state is: `, newState);
            return newState
        }

        // Update suggestion text
        case COMMENT_NEW_SUGGESTION_UPDATE_TEXT: {
            const newState = _.cloneDeep(state)
            const { tab, text, pageId } = action.payload
            const page = pageId ? `${pageId}` : 'default'
            const path = !tab ? `homeTab.${page}` : `${tab}.${page}`

            return _.set(newState, `${path}.tmpSuggestion.suggestionText`, text)
        }

        // Update suggestion link
        case COMMENT_NEW_SUGGESTION_UPDATE_LINK: {
            const newState = _.cloneDeep(state)
            const { tab, suggestionLink, pageId } = action.payload
            const page = pageId ? `${pageId}` : 'default'
            const path = !tab ? `homeTab.${page}` : `${tab}.${page}`
            console.log('SUGGESTION LINK NEW STATE=>', newstate)
            console.log(
                `Tab =>${tab} suggestionLink =>${suggestionLink} pageId =>${pageId}`
            )
            return _.set(
                newState,
                `${path}.tmpSuggestion.suggestionLink`,
                suggestionLink
            )
        }

        // Update item selected
        case COMMENT_NEW_SUGGESTION_SELECT_ITEM: {
            const newState = _.cloneDeep(state)
            const { tab, selectedItem, pageId } = action.payload
            const page = pageId ? `${pageId}` : 'default'
            const path = !tab ? `homeTab.${page}` : `${tab}.${page}`
            return _.set(
                newState,
                `${path}.tmpSuggestion.selectedItem`,
                selectedItem
            )
        }

        // User chooses an image for the comment
        case COMMENT_NEW_SELECT_IMAGE: {
            const { tab, mediaRef, pageId } = action.payload
            const newState = _.cloneDeep(state)
            const page = pageId ? `${pageId}` : 'default'
            const path = !tab ? `homeTab.${page}` : `${tab}.${page}`
            return _.set(newState, `${path}.mediaRef`, mediaRef)
        }

        // Update the field with presignedUrl
        case COMMENT_NEW_UPLOAD_PICTURE_SUCCESS: {
            const { tab, pageId, objectKey } = action.payload
            const newState = _.cloneDeep(state)
            const page = pageId ? `${pageId}` : 'default'
            const path = !tab ? `homeTab.${page}` : `${tab}.${page}`
            return _.set(newState, `${path}.mediaPresignedUrl`, objectKey)
        }

        case COMMENT_NEW_UPLOAD_VOICE_SUCCESS: {
            const { tab, pageId, objectKey } = action.payload
            const newState = _.cloneDeep(state)
            const page = pageId ? `${pageId}` : 'default'
            const path = !tab ? `homeTab.${page}` : `${tab}.${page}`
            return _.set(newState, `${path}.mediaPresignedUrl`, objectKey)
        }

        /**
         * User switches tab from focus to central
         */
        case GOAL_DETAIL_SWITCH_TAB_V2: {
            let newState = _.cloneDeep(state)
            const {
                tab,
                key,
                focusRef,
                focusType,
                goalId,
                pageId,
            } = action.payload

            // Currently we don't consider if user goes from central to focus
            if (key !== 'centralTab') {
                return newState
            }

            const page = pageId ? `${pageId}` : 'default'
            const path = !tab ? `homeTab.${page}` : `${tab}.${page}`
            let commentToUpdate = _.get(newState, `${path}`)

            // We need to remove any stepRef and needRef from the comment object because
            // user already exit that context
            commentToUpdate = _.omit(commentToUpdate, 'stepRef')
            commentToUpdate = _.omit(commentToUpdate, 'needRef')

            // Reset the commentType to comment
            commentToUpdate = _.set(commentToUpdate, 'commentType', 'Comment')

            // Update the state to use the new comment
            newState = _.set(newState, `${path}`, commentToUpdate)
            return newState
        }

        default:
            return { ...state }
    }
}

const setState = (newState, path, data) => {
    // If data exists or original field is set, then we set explicitly.
    if (data || _.get(newState, `${path}`))
        return _.set(newState, `${path}`, data)
    return newState
}

// Reset tmpSuggestion and keep suggestionFor and suggestionForRef after attaching
const resetTmpSuggestionFromState = (tmpSuggestion) => {
    const copyTmpSuggestion = _.cloneDeep(tmpSuggestion)
    let ret = _.cloneDeep(INITIAL_SUGGESETION)
    if (copyTmpSuggestion.suggestionFor !== undefined) {
        ret = _.set(ret, 'suggestionFor', copyTmpSuggestion.suggestionFor)
    }

    if (copyTmpSuggestion.suggestionForRef !== undefined) {
        ret = _.set(ret, 'suggestionForRef', copyTmpSuggestion.suggestionForRef)
    }
    return ret
}

// Reset comment object after submission and keep corresponding field after posting
const resetNewComment = (comment) => {
    const copyComment = _.cloneDeep(comment)
    let ret = _.cloneDeep(NEW_COMMENT_INITIAL_STATE)
    const oldTmpSuggestion = _.get(copyComment, 'tmpSuggestion')
    const tmpSuggestion = resetTmpSuggestionFromState(oldTmpSuggestion)
    const oldParentRef = _.get(copyComment, 'parentRef')
    const oldParentType = _.get(copyComment, 'parentType')

    ret = _.set(ret, 'parentRef', oldParentRef)
    ret = _.set(ret, 'parentType', oldParentType)
    ret = _.set(ret, 'tmpSuggestion', tmpSuggestion)
    if (copyComment.needRef) {
        ret = _.set(ret, 'needRef', copyComment.needRef)
    }

    ret = _.set(ret, 'commentType', 'Comment')

    if (copyComment.stepRef) {
        ret = _.set(ret, 'stepRef', copyComment.stepRef)
    }

    return ret
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
