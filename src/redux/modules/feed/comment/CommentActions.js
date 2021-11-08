/**
 * This file contains actions for fetching comments for a specific goal and also
 * actions related to a specific comment
 *
 * @format
 */

import { Alert, Keyboard } from 'react-native'
import _ from 'lodash'
import validator from 'validator'
import {
    COMMENT_LOAD,
    COMMENT_REFRESH_DONE,
    COMMENT_LOAD_DONE,
    COMMENT_LOAD_ERROR,
    COMMENT_DELETE_SUCCESS,
} from './CommentReducers'

import {
    COMMENT_NEW,
    COMMENT_EMPTY,
    COMMENT_NEW_UPDATE,
    COMMENT_NEW_UPDATE_COMMENT_TYPE,
    COMMENT_NEW_TEXT_ON_CHANGE,
    COMMENT_NEW_TAGS_ON_CHANGE,
    COMMENT_NEW_TAGS_REG_ON_CHANGE,
    COMMENT_NEW_SUGGESTION_REMOVE,
    COMMENT_NEW_SUGGESTION_CREATE,
    COMMENT_NEW_SUGGESTION_ATTACH,
    COMMENT_NEW_SUGGESTION_CANCEL,
    COMMENT_NEW_SUGGESTION_OPEN_CURRENT,
    COMMENT_NEW_SUGGESTION_OPEN_MODAL,
    COMMENT_NEW_SUGGESTION_UPDAET_TYPE,

    // update suggestion link and text
    COMMENT_NEW_SUGGESTION_UPDATE_TEXT,
    COMMENT_NEW_SUGGESTION_UPDATE_LINK,

    // Select searched suggestion item
    COMMENT_NEW_SUGGESTION_SELECT_ITEM,
    COMMENT_NEW_POST_START,
    COMMENT_NEW_POST_SUCCESS,
    COMMENT_NEW_POST_FAIL,
    COMMENT_NEW_POST_SUGGESTION_SUCCESS,
    COMMENT_NEW_SELECT_IMAGE,
    COMMENT_NEW_UPLOAD_PICTURE_SUCCESS,
    COMMENT_NEW_UPLOAD_VOICE_SUCCESS,
} from './NewCommentReducers'

import { SUGGESTION_SEARCH_CLEAR_STATE } from './SuggestionSearchReducers'

import { getGoal } from '../../goal/selector'

import { api as API } from '../../../middleware/api'
import {
    queryBuilder,
    switchCase,
    sanitizeTags,
} from '../../../middleware/utils'
import ImageUtils from '../../../../Utils/ImageUtils'
import VoiceUtils from '../../../../Utils/VoiceUtils'
import VideoUtils from '../../../../Utils/VideoUtils'
import { openGoalDetail } from '../../../modules/home/mastermind/actions'
import { trackWithProperties, EVENT as E } from '../../../../monitoring/segment'

const DEBUG_KEY = '[ Action Comment ]'
const BASE_ROUTE = 'secure/feed/comment'

// New comment related actions
export const newCommentOnTextChange = (text, pageId) => (
    dispatch,
    getState
) => {
    const { tab } = getState().navigation
    dispatch({
        type: COMMENT_NEW_TEXT_ON_CHANGE,
        payload: {
            text,
            tab,
            pageId,
        },
    })
}

export const newCommentOnTagsChange = (contentTags, pageId) => (
    dispatch,
    getState
) => {
    const { tab } = getState().navigation
    dispatch({
        type: COMMENT_NEW_TAGS_ON_CHANGE,
        payload: {
            contentTags,
            tab,
            pageId,
        },
    })
}

/**
 * Update the tags regular expression array
 * @param contentTagsReg: array of contentTagsReg
 */
export const newCommentOnTagsRegChange = (contentTagsReg, pageId) => (
    dispatch,
    getState
) => {
    const { tab } = getState().navigation
    dispatch({
        type: COMMENT_NEW_TAGS_REG_ON_CHANGE,
        payload: {
            contentTagsReg,
            tab,
            pageId,
        },
    })
}

// Comment module related actions

/**
 * Select an image for the comment
 */
export const newCommentOnMediaRefChange = (mediaRef, pageId) => (
    dispatch,
    getState
) => {
    const { tab } = getState().navigation
    dispatch({
        type: COMMENT_NEW_SELECT_IMAGE,
        payload: {
            mediaRef,
            tab,
            pageId,
        },
    })
}
/**
 * action to update a comment for a goal / post
 * @params commentId: id of the comment
 * @params updates: JsonObject of the updated comment
 */
export const updateComment = (commentId, updates) => {}

/**
 * action to delete a comment for a goal / post
 * @params commentId: id of the comment
 */
export const deleteComment = (commentId, pageId, parentRef, parentType) => (
    dispatch,
    getState
) => {
    const { token, userId } = getState().user
    const { tab } = getState().navigation
    const onSuccess = (res) => {
        console.log(`${DEBUG_KEY}: comment delete success with res: `, res)
        trackWithProperties(E.COMMENT_DELETED, {
            CommentId: commentId,
            UserId: userId,
        })
        dispatch({
            type: COMMENT_DELETE_SUCCESS,
            payload: {
                pageId,
                tab,
                commentId,
                parentRef,
                parentType,
            },
        })
        Alert.alert('Success', 'Comment deleted successfully')
    }

    const onError = (err) => {
        console.log(
            `${DEBUG_KEY}: delete comment ${commentId} failed with err: `,
            err
        )
        Alert.alert('Failed to delete comment', 'Please try again later')
    }

    API.delete(`${BASE_ROUTE}?commentId=${commentId}`, {}, token)
        .then((res) => {
            if (res.status === '200' || res.status === 200 || res.isSuccess) {
                return onSuccess(res)
            }
            onError(res)
        })
        .catch((err) => onError(err))
}

/**
 * Following section is for actions related to creating a new comment
 * which involes suggestion
 */

// User clicks on the comment button
export const createComment = (commentDetail, pageId) => (
    dispatch,
    getState
) => {
    const { userId } = getState().user
    const { tab } = getState().navigation
    console.log('Creating comment with commentDetail: ', commentDetail)

    dispatch({
        type: COMMENT_NEW,
        payload: {
            ...commentDetail,
            owner: userId,
            tab,
            pageId,
        },
    })
}

export const createEmptyComment = (commentDetail, pageId) => (
    dispatch,
    getState
) => {
    const { tab } = getState().navigation

    dispatch({
        type: COMMENT_EMPTY,
        payload: {
            commentDetail,
            tab,
            pageId,
        },
    })
}

/**
 * Create comment as a suggestion as user enter focused content for a need or a step
 */
export const createCommentForSuggestion = (
    { commentDetail, suggestionFor, suggestionForRef },
    pageId
) => (dispatch, getState) => {
    const { userId } = getState().user
    const { tab } = getState().navigation

    dispatch({
        type: COMMENT_NEW,
        payload: {
            ...commentDetail,
            owner: userId,
            tab,
            pageId,
            suggestionFor,
            suggestionForRef,
            suggestionType: 'Custom',
        },
    })

    // We don't pass in suggestionType because we want user to choose
    dispatch({
        type: COMMENT_NEW_SUGGESTION_CREATE,
        payload: {
            suggestionFor,
            suggestionForRef,
            tab,
            pageId,
        },
    })
}

// When user clicks on suggestion icon outside comment box
// const { parentType, parentRef, commentType, replyToRef } = commentDetail;
export const createCommentFromSuggestion = (
    { commentDetail, suggestionForRef, suggestionFor },
    pageId
) => (dispatch, getState) => {
    const { userId } = getState().user
    const { tab } = getState().navigation

    dispatch({
        type: COMMENT_NEW,
        payload: {
            ...commentDetail,
            owner: userId,
            tab,
            pageId,
        },
    })

    dispatch({
        type: COMMENT_NEW_SUGGESTION_CREATE,
        payload: {
            suggestionFor,
            suggestionForRef,
            tab,
            pageId,
        },
    })
}

export const resetCommentType = (commentType, pageId) => (
    dispatch,
    getState
) => {
    const { tab } = getState().navigation
    dispatch({
        type: COMMENT_NEW_UPDATE_COMMENT_TYPE,
        payload: {
            commentType,
            pageId,
            tab,
        },
    })
}

/**
 * Update the fields / properties for the new comment
 */
export const updateNewComment = (newComment, pageId) => (
    dispatch,
    getState
) => {
    const { tab } = getState().navigation
    dispatch({
        type: COMMENT_NEW_UPDATE,
        payload: {
            newComment,
            pageId,
            tab,
        },
    })
}

/**
 * comment(jsonStrObj):
 * parentRef, parentType("Goal" || "Post"), contentText, contentTags, commentType[, replyToRef, suggestion(Suggestion)]
 */
export const postComment = (pageId, callback) => (dispatch, getState) => {
    const { token, user } = getState().user
    const { tab } = getState().navigation
    console.log(`pageid:${pageId}  tab: ${tab}`)
    const newComment = commentAdapter(getState(), pageId, tab)
    const { suggestion, mediaRef } = newComment
    console.log(`${DEBUG_KEY}: new comment to submit is: `, newComment)

    dispatch({
        type: COMMENT_NEW_POST_START,
        payload: {
            tab,
            pageId,
            entityId: newComment.parentRef, // This is for post/share/goal to set the loading indicator
        },
    })

    // TODO: Check if no suggestion and no replyToRef is filled
    // and commentType is Suggestion, then we set commentType to Comment.
    const onError = (err) => {
        Keyboard.dismiss()
        dispatch({
            type: COMMENT_NEW_POST_FAIL,
            payload: {
                pageId,
                tab,
                entityId: newComment.parentRef, // This is for post/share/goal to remove the loading indicator
            },
        })
        Alert.alert(
            'Error',
            'Failed to submit comment. Please try again later.'
        )
        console.log(`${DEBUG_KEY}: error submitting comment: `, err)
    }

    // If succeed, COMMENT_NEW_POST_SUCCESS, otherwise, COMMENT_NEW_POST_FAIL
    const onSuccess = (data) => {
        const { commentType } = newComment
        // trackWithProperties(E.COMMENT_ADDED, {
        //     CommentDetail: newComment,
        //     UserId: user.userId,
        // })
        dispatch({
            type: COMMENT_NEW_POST_SUCCESS,
            payload: {
                comment: {
                    ...data,
                    owner: {
                        ...user,
                    },
                },
                tab,
                pageId,
                entityId: newComment.parentRef, // This is for post/share/goal to remove the loading indicator
            },
        })
        // If succeed and comment type is suggestionFor a need or a step, switch to
        // comment tab
        if (
            commentType === 'Suggestion' &&
            suggestion &&
            (suggestion.suggestionFor === 'Need' ||
                suggestion.suggestionFor === 'Step')
        ) {
            dispatch({
                type: COMMENT_NEW_POST_SUGGESTION_SUCCESS,
                payload: {
                    tab,
                },
            })
        }
        console.log(
            `${DEBUG_KEY}: comment posted successfully with res: `,
            data
        )
        if (callback) callback()
        // Alert.alert('Success', 'You have successfully created a comment.');
    }

    if (!mediaRef) {
        return sendPostCommentRequest(newComment, token, onError, onSuccess)
    }

    // Upload the media and obtain a pointer first
    ImageUtils.getImageSize(mediaRef)
        .then(({ width, height }) => {
            // Resize image
            console.log('width, height are: ', width, height)
            return ImageUtils.resizeImage(mediaRef, width, height, {
                capHeight: 720,
                capWidth: 720,
            })
        })
        .then((image) => {
            // Upload image to S3 server
            console.log('image to upload is: ', image)
            return ImageUtils.getPresignedUrl(
                image.uri,
                token,
                (objectKey) => {
                    // Obtain pre-signed url and store in getState().postDetail.newPost.mediaRef
                    dispatch({
                        type: COMMENT_NEW_UPLOAD_PICTURE_SUCCESS,
                        payload: {
                            tab,
                            pageId,
                            objectKey,
                        },
                    })
                },
                'GoalImage'
            )
        })
        .then(({ signedRequest, file }) =>
            ImageUtils.uploadImage(file, signedRequest)
        )
        .then((res) => {
            console.log('comment res', res)
            if (res instanceof Error) {
                // uploading to s3 failed
                console.log(
                    `${DEBUG_KEY}: error uploading image to s3 with res: `,
                    res
                )
                throw res
            }
            const page = pageId ? `${pageId}` : 'default'
            const path = !tab ? `homeTab.${page}` : `${tab}.${page}`
            const imageUrl = _.get(
                getState().newComment,
                `${path}.mediaPresignedUrl`
            )
            // Use the presignedUrl as media string
            console.log(`${BASE_ROUTE}: presigned url sent is: `, imageUrl)
            const newCommentObject = {
                ...newComment,
                mediaRef: imageUrl,
            }

            return sendPostCommentRequest(
                newCommentObject,
                token,
                onError,
                onSuccess
            )
        })
        .catch((err) => {
            /*
            Error Type:
              image getSize
              image Resize
              image upload to S3
              update profile image Id
            */
            onError(err)
        })
}

/**
 * comment voice request
 */
export const sendVoiceMessage = (uri, pageId, _id, callback) => async (
    dispatch,
    getState
) => {
    const { token, user } = getState().user
    const { tab } = getState().navigation
    // const newComment = commentAdapter(getState(), pageId, tab)
    // const { suggestion, mediaRef } = newComment
    // console.log(`${DEBUG_KEY}: new comment to submit is: `, newComment)
    const newComment = {
        commentType: 'Comment',
        parentRef: _id,
        parentType: 'Goal',
        contentText: '',
        contentTags: [],
        content: undefined,
        mediaPresignedUrl: undefined,
        mediaRef: uri,
        replyToRef: undefined,
    }

    // const uriPath = uri.substring(uri.lastIndexOf('/') + 1, uri.length)

    dispatch({
        type: COMMENT_NEW_POST_START,
        payload: {
            tab,
            pageId,
            entityId: newComment.parentRef, // This is for post/share/goal to set the loading indicator
        },
    })

    const onError = (err) => {
        Keyboard.dismiss()
        // dispatch({
        //     type: COMMENT_NEW_POST_FAIL,
        //     payload: {
        //         pageId,
        //         tab,
        //         entityId: newComment.parentRef, // This is for post/share/goal to remove the loading indicator
        //     },
        // })
        // Alert.alert(
        //     'Error',
        //     'Failed to submit comment. Please try again later.'
        // )
        console.log(`${DEBUG_KEY}: error submitting comment: `, err)
    }

    const onSuccess = (data) => {
        // trackWithProperties(E.COMMENT_ADDED, {
        //     CommentDetail: newComment,
        //     UserId: user.userId,
        // })
        // dispatch({
        //     type: COMMENT_NEW_POST_SUCCESS,
        //     payload: {
        //         comment: {
        //             ...data,
        //             owner: {
        //                 ...user,
        //             },
        //         },
        //         tab,

        //         entityId: newComment.parentRef, // This is for post/share/goal to remove the loading indicator
        //     },
        // })

        console.log(
            `${DEBUG_KEY}: comment posted successfully with res: `,
            data
        )
        if (callback) callback()
        // Alert.alert('Success', 'You have successfully created a comment.');
    }

    VoiceUtils.getPresignedUrl(
        uri,
        token,
        (objectKey) => {
            dispatch({
                type: COMMENT_NEW_UPLOAD_VOICE_SUCCESS,
                payload: {
                    tab,
                    pageId,
                    objectKey,
                },
            })
        },
        'CommentAudio'
    )
        .then(({ file, signedRequest }) => {
            return VoiceUtils.uploadVoice(file, signedRequest)
        })
        .then((res) => {
            if (res instanceof Error) {
                // uploading to s3 failed
                console.log('error uploading voice to s3 with res: ', res)
                throw res
            }
            const page = pageId ? `${pageId}` : 'default'
            const path = !tab ? `homeTab.${page}` : `${tab}.${page}`
            const voiceUrl = _.get(
                getState().newComment,
                `${path}.mediaPresignedUrl`
            )
            // Use the presignedUrl as media string
            console.log(`${BASE_ROUTE}: presigned url sent is: `, voiceUrl)
            let newCommentObject = {
                ...newComment,
                mediaRef: voiceUrl,
            }

            return sendPostCommentRequest(
                newCommentObject,
                token,
                onError,
                onSuccess
            )
        })
        .catch((err) => {
            /*
        Error Type:
          voice upload to S3
        */
            onError(err)
        })
}
export const sendVideoMessage = (
    uri,
    videoName,
    pageId,
    _id,
    callback
) => async (dispatch, getState) => {
    const { token, user } = getState().user
    const { tab } = getState().navigation
    // const newComment = commentAdapter(getState(), pageId, tab)
    // const { suggestion, mediaRef } = newComment
    // console.log(`${DEBUG_KEY}: new comment to submit is: `, newComment)
    const newComment = {
        commentType: 'Comment',
        parentRef: _id,
        parentType: 'Goal',
        contentText: videoName,
        contentTags: [],
        content: undefined,
        mediaPresignedUrl: undefined,
        mediaRef: uri,
        replyToRef: undefined,
    }

    // const uriPath = uri.substring(uri.lastIndexOf('/') + 1, uri.length)

    dispatch({
        type: COMMENT_NEW_POST_START,
        payload: {
            tab,
            pageId,
            entityId: newComment.parentRef, // This is for post/share/goal to set the loading indicator
        },
    })

    const onError = (err) => {
        Keyboard.dismiss()
        // dispatch({
        //     type: COMMENT_NEW_POST_FAIL,
        //     payload: {
        //         pageId,
        //         tab,
        //         entityId: newComment.parentRef, // This is for post/share/goal to remove the loading indicator
        //     },
        // })
        // Alert.alert(
        //     'Error',
        //     'Failed to submit comment. Please try again later.'
        // )
        console.log(`${DEBUG_KEY}: error submitting comment: `, err)
    }

    const onSuccess = (data) => {
        // trackWithProperties(E.COMMENT_ADDED, {
        //     CommentDetail: newComment,
        //     UserId: user.userId,
        // })
        // dispatch({
        //     type: COMMENT_NEW_POST_SUCCESS,
        //     payload: {
        //         comment: {
        //             ...data,
        //             owner: {
        //                 ...user,
        //             },
        //         },
        //         tab,

        //         entityId: newComment.parentRef, // This is for post/share/goal to remove the loading indicator
        //     },
        // })

        console.log(
            `${DEBUG_KEY}: comment posted successfully with res: `,
            data
        )
        if (callback) callback()
        // Alert.alert('Success', 'You have successfully created a comment.');
    }

    VideoUtils.getPresignedUrl(
        uri,
        token,
        (objectKey) => {
            dispatch({
                type: COMMENT_NEW_UPLOAD_VOICE_SUCCESS,
                payload: {
                    tab,
                    pageId,
                    objectKey,
                },
            })
        },
        'CommentVideo'
    )
        .then(({ file, signedRequest }) => {
            return VideoUtils.uploadVideo(file, signedRequest)
        })
        .then((res) => {
            if (res instanceof Error) {
                // uploading to s3 failed
                console.log('error uploading video to s3 with res: ', res)
                throw res
            }
            const page = pageId ? `${pageId}` : 'default'
            const path = !tab ? `homeTab.${page}` : `${tab}.${page}`
            const videoUrl = _.get(
                getState().newComment,
                `${path}.mediaPresignedUrl`
            )
            // Use the presignedUrl as media string
            console.log(`${BASE_ROUTE}: presigned url sent is: `, videoUrl)
            let newCommentObject = {
                ...newComment,
                mediaRef: videoUrl,
            }

            return sendPostCommentRequest(
                newCommentObject,
                token,
                onError,
                onSuccess
            )
        })
        .catch((err) => {
            /*
        Error Type:
          voice upload to S3
        */
            onError(err)
        })
}

export const sendClarifyMessage = (goalId, textToSend, pageId) => async (
    dispatch,
    getState
) => {
    const { token, user } = getState().user
    const { tab } = getState().navigation
    // const newComment = commentAdapter(getState(), pageId, tab)
    // const { suggestion, mediaRef } = newComment
    // console.log(`${DEBUG_KEY}: new comment to submit is: `, newComment)
    const newComment = {
        commentType: 'Suggestion',
        parentRef: goalId,
        parentType: 'Goal',
        contentText: '',
        contentTags: [],
        content: undefined,
        suggestion: {
            suggestionText: textToSend,
            suggestionType: 'Clarify',
        },
        mediaPresignedUrl: undefined,
        mediaRef: undefined,
        replyToRef: undefined,
    }

    dispatch({
        type: COMMENT_NEW_POST_START,
        payload: {
            tab,
            pageId,
            entityId: newComment.parentRef, // This is for post/share/goal to set the loading indicator
        },
    })

    const onError = (err) => {
        Keyboard.dismiss()
        console.log(`${DEBUG_KEY}: error submitting comment: `, err)
    }

    try {
        const onSuccess = (data) => {
            console.log(
                `${DEBUG_KEY}: comment posted successfully with res: `,
                data
            )

            dispatch({
                type: COMMENT_NEW_POST_SUCCESS,
                payload: {
                    comment: {
                        ...data,
                        owner: {
                            ...user,
                        },
                    },
                    tab,
                    pageId,
                    entityId: newComment.parentRef, // This is for post/share/goal to remove the loading indicator
                },
            })
        }

        let newCommentObject = {
            ...newComment,
        }

        return sendPostCommentRequest(
            newCommentObject,
            token,
            onError,
            onSuccess
        )

        /*
        Error Type:
          voice upload to S3
        */
    } catch (error) {
        console.log('ERRRORRR', error.message)
    }
}

// Send creating comment request
export const sendPostCommentRequest = (
    newComment,
    token,
    onError,
    onSuccess
) => {
    API.post(`${BASE_ROUTE}`, { comment: JSON.stringify(newComment) }, token)
        .then((res) => {
            if (!res.message && res.data) {
                return onSuccess(res.data)
            }

            onError(res)
        })
        .catch((err) => {
            onError(err)
        })
}

/**
 * Transform the new comment in state to proper comment format
 */
const commentAdapter = (state, pageId, tab) => {
    const page = pageId ? `${pageId}` : 'default'
    const path = !tab ? `homeTab.${page}` : `${tab}.${page}`
    let newComment = _.get(state.newComment, `${path}`)
    console.log(`${DEBUG_KEY}: raw comment is: `, newComment)

    const {
        contentText,
        contentTags,
        // owner,
        parentType,
        parentRef,
        // content,
        commentType,
        replyToRef,
        suggestion,
        mediaRef,
        needRef,
        stepRef,
    } = newComment

    const tmpCommentType =
        suggestion && suggestion.suggestionFor && suggestion.suggestionForRef
            ? 'Suggestion'
            : 'Comment'

    // Tags sanitization will reassign index as well as removing the unused tags
    const contentTagsToUser = sanitizeTags(contentText, contentTags)

    let commentToReturn = {
        contentText,
        contentTags: contentTagsToUser.map((t) => {
            const { user, startIndex, endIndex } = t
            return { user, startIndex, endIndex }
        }),
        parentType,
        parentRef,
        // content,
        commentType: commentType || tmpCommentType,
        replyToRef,
        mediaRef,
        suggestion: suggestionAdapter(suggestion),
    }
    // console.log(`${DEBUG_KEY}: adapted comment is: `, commentToReturn.suggestion);
    if (replyToRef === undefined) {
        commentToReturn = _.omit(commentToReturn, 'replyToRef')
    }

    if (_.isEmpty(suggestion)) {
        delete commentToReturn.suggestion
    }

    if (stepRef) {
        commentToReturn = _.set(commentToReturn, 'stepRef', stepRef)
    }

    if (needRef) {
        commentToReturn = _.set(commentToReturn, 'needRef', needRef)
    }

    if (commentType === 'Comment') {
        // This is a comment, remove any suggestion related stuff
        commentToReturn = _.omit(commentToReturn, 'suggestion')
    }

    return commentToReturn
}

const suggestionAdapter = (suggestion) => {
    // console.log(`${DEBUG_KEY}: raw suggestion is: `, suggestion);
    if (!suggestion) return {}
    // TODO: require validation
    const {
        selectedItem,
        suggestionFor,
        suggestionForRef,
        suggestionType,
        suggestionLink,
        suggestionText,
        goalRef,
    } = suggestion

    const ret = switchCase({
        User: {
            userRef: selectedItem ? selectedItem._id : undefined,
        },
        ChatConvoRoom: {
            chatRoomRef: selectedItem ? selectedItem._id : undefined,
        },
        NewNeed: {
            suggestionText,
            goalRef,
        },
        NewStep: {
            suggestionText,
            goalRef,
        },
        Event: {
            eventRef: selectedItem ? selectedItem._id : undefined,
        },
        Tribe: {
            tribeRef: selectedItem ? selectedItem._id : undefined,
        },
        Custom: {
            suggestionLink,
            suggestionText:
                suggestionText === '' || suggestionText === undefined
                    ? 'Suggestion'
                    : suggestionText,
        },
    })({})(suggestionType)

    if (ret && !_.isEmpty(ret)) {
        return {
            ...ret,
            suggestionFor,
            suggestionForRef,
            suggestionType,
        }
    }
    return {
        suggestionFor,
        suggestionForRef,
        suggestionType,
    }
}

/* Actions for suggestion modal */
export const openSuggestionModal = (pageId) => (dispatch, getState) => {
    console.log(`${DEBUG_KEY}: [ openSuggestionModal ]`)
    const { tab } = getState().navigation
    dispatch({
        type: COMMENT_NEW_SUGGESTION_OPEN_MODAL,
        payload: {
            tab,
            pageId,
        },
    })
}

// When user clicks on the suggestion icon on the comment box
export const createSuggestion = (goalId, pageId) => (dispatch, getState) => {
    //check if suggestionFor and suggestionRef have assignment,
    //If not then we assign the current goal ref and 'Goal'
    const { tab } = getState().navigation
    const page = pageId ? `${pageId}` : 'default'
    const path = !tab ? `homeTab.${page}` : `${tab}.${page}`

    const { suggestion, tmpSuggestion } = _.get(
        getState().newComment,
        `${path}`
    )
    const goal = getGoal(getState(), goalId)
    // const { _id } = getState().goalDetail;
    if (!goal || _.isEmpty(goal)) {
        console.warn(
            `${DEBUG_KEY}: fetch to get goal for creating suggestion: ${goalId}`
        )
        return
    }
    const { _id } = goal
    // Already have a suggestion. Open the current one
    if (
        suggestion.suggestionFor &&
        suggestion.suggestionForRef &&
        // When suggestionType is Custom and no suggestionText or suggestionLink,
        // it means that it's suggestion comment for a step or a need
        !(
            suggestion.suggestionType === 'Custom' &&
            (!suggestion.suggestionText ||
                _.isEmpty(suggestion.suggestionText)) &&
            (!suggestion.suggestionLink || _.isEmpty(suggestion.suggestionLink))
        )
    ) {
        return openCurrentSuggestion(pageId)(dispatch, getState)
    }

    // This is the first time user clicks on the suggestion icon. No other entry points.
    if (!tmpSuggestion.suggestionFor && !tmpSuggestion.suggestionForRef) {
        dispatch({
            type: COMMENT_NEW_SUGGESTION_CREATE,
            payload: {
                suggestionFor: 'Goal',
                suggestionForRef: _id,
                tab,
            },
        })
    }

    openSuggestionModal(pageId)(dispatch, getState)
}

// Cancel creating a suggestion
export const cancelSuggestion = (pageId) => (dispatch, getState) => {
    const { tab } = getState().navigation
    dispatch({
        type: COMMENT_NEW_SUGGESTION_CANCEL,
        payload: {
            tab,
            pageId,
        },
    })
}

// Remove the suggestion
export const removeSuggestion = (pageId) => (dispatch, getState) => {
    const { tab } = getState().navigation
    dispatch({
        type: COMMENT_NEW_SUGGESTION_REMOVE,
        payload: {
            tab,
            pageId,
        },
    })
}

export const updateSuggestionType = (suggestionType, pageId) => (
    dispatch,
    getState
) => {
    const { tab } = getState().navigation

    // Clear previous search state
    dispatch({
        type: SUGGESTION_SEARCH_CLEAR_STATE,
        payload: {},
    })

    dispatch({
        type: COMMENT_NEW_SUGGESTION_UPDAET_TYPE,
        payload: {
            suggestionType,
            tab,
            pageId,
        },
    })
}

export const openCurrentSuggestion = (pageId) => (dispatch, getState) => {
    const { tab } = getState().navigation
    dispatch({
        type: COMMENT_NEW_SUGGESTION_OPEN_CURRENT,
        payload: {
            tab,
            pageId,
        },
    })
}

export const attachSuggestion = (goalDetail, focusType, focusRef, pageId) => (
    dispatch,
    getState
) => {
    const { tab } = getState().navigation
    const page = pageId ? `${pageId}` : 'default'
    const path = !tab ? `homeTab.${page}` : `${tab}.${page}`
    const { tmpSuggestion } = _.get(getState().newComment, `${path}`)

    const {
        suggestionText,
        suggestionLink,
        selectedItem,
        suggestionType,
    } = tmpSuggestion

    // If nothing is selected, then we show an error
    if (!suggestionText && !suggestionLink && !selectedItem) {
        return Alert.alert(
            'Error',
            'Make sure you suggest something to your friend'
        )
    }

    let isUrl = true
    if (suggestionType === 'Custom' && suggestionLink) {
        isUrl = validator.isURL(suggestionLink)
    }

    console.log(`${DEBUG_KEY}: isURL: `, isUrl)
    if (!selectedItem && suggestionLink && !isUrl) {
        return Alert.alert(
            'Invalid link',
            'Make sure you have the correct format for URL'
        )
    }

    dispatch({
        type: COMMENT_NEW_SUGGESTION_ATTACH,
        payload: {
            tab,
            pageId,
            goalDetail,
            focusType,
            focusRef,
        },
    })
}

export const onSuggestionTextChange = (text, pageId) => (
    dispatch,
    getState
) => {
    const { tab } = getState().navigation
    dispatch({
        type: COMMENT_NEW_SUGGESTION_UPDATE_TEXT,
        payload: {
            text,
            tab,
            pageId,
        },
    })
}

export const onSuggestionLinkChange = (suggestionLink, pageId) => (
    dispatch,
    getState
) => {
    const { tab } = getState().navigation
    dispatch({
        type: COMMENT_NEW_SUGGESTION_UPDATE_LINK,
        payload: {
            suggestionLink,
            tab,
            pageId,
        },
    })
}

export const onSuggestionItemSelect = (selectedItem, pageId) => (
    dispatch,
    getState
) => {
    console.log('suggestion item selected with item: ', selectedItem)
    const { tab } = getState().navigation
    dispatch({
        type: COMMENT_NEW_SUGGESTION_SELECT_ITEM,
        payload: {
            selectedItem,
            tab,
            pageId,
        },
    })
}

/**
 * For the next three functions, we could abstract a pattern since
 * It's shared across mastermind/actions, feed/actions, MeetActions, ProfileActions
 * NOTE: goal feed and activity feed share the same constants with different
 * input on type field
 */
export const refreshComments = (
    parentType,
    parentId,
    tab,
    pageId,
    callback
) => (dispatch, getState) => {
    const { token } = getState().user
    const page = pageId ? `${pageId}` : 'default'
    const path = tab ? `${tab}.${page}` : `homeTab.${page}`
    const { limit, hasNextPage } = _.get(getState().comment, path)
    if (hasNextPage === false) {
        return
    }
    dispatch({
        type: COMMENT_LOAD,
        payload: {
            tab,
            pageId,
            parentId,
        },
    })
    const onSuccess = (data) => {
        dispatch({
            type: COMMENT_REFRESH_DONE,
            payload: {
                type: parentType,
                data,
                skip: data.length,
                limit,
                hasNextPage: !(data === undefined || data.length === 0),
                tab,
                pageId,
                parentId,
            },
        })
        console.log(
            `${DEBUG_KEY}: [ refreshComments ]: refresh comment success with data length: `,
            data.length
        )
        if (callback) {
            // console.log(`${DEBUG_KEY}: [ refreshComments ]: calling callback`);
            callback()
        }
    }

    const onError = (err) => {
        console.log(`${DEBUG_KEY}: refresh comment failed with err: `, err)
        dispatch({
            type: COMMENT_LOAD_ERROR,
            payload: {
                tab,
                pageId,
                parentId,
            },
        })
    }

    loadComments(0, limit, token, { parentId, parentType }, onSuccess, onError)
}

export const loadMoreComments = (parentType, parentId, tab, pageId) => (
    dispatch,
    getState
) => {
    const { token } = getState().user
    const page = pageId ? `${pageId}` : 'default'
    const path = tab ? `${tab}.${page}` : `homeTab.${page}`
    const { skip, limit, hasNextPage } = _.get(getState().comment, path)

    if (hasNextPage === false) {
        return
    }
    dispatch({
        type: COMMENT_LOAD,
        payload: {
            tab,
            pageId,
            parentId,
        },
    })

    const onSuccess = (data) => {
        dispatch({
            type: COMMENT_LOAD_DONE,
            payload: {
                type: parentType,
                data,
                skip: data.length,
                limit,
                hasNextPage: !(data === undefined || data.length === 0),
                tab,
                pageId,
                parentId,
            },
        })
        console.log(
            `${DEBUG_KEY}: load more comments succeeds with data: `,
            data
        )
    }

    const onError = (err) => {
        console.log(`${DEBUG_KEY}: load more comments failed with err: `, err)
        dispatch({
            type: COMMENT_LOAD_ERROR,
            payload: {
                tab,
                pageId,
                parentId,
            },
        })
    }

    loadComments(
        skip,
        limit,
        token,
        { parentId, parentType },
        onSuccess,
        onError
    )
}

export const loadComments = (
    skip,
    limit,
    token,
    { parentId, parentType },
    callback,
    onError
) => {
    API.get(
        `${BASE_ROUTE}?parentId=${parentId}&parentType=${parentType}`,
        // `${BASE_ROUTE}?parentId=5bc81da9d4f72c0019bb0cdb&parentType=Goal`,
        token
    )
        .then((res) => {
            if (res.data) {
                console.log(
                    `${DEBUG_KEY}: loading with res data length: `,
                    res.data.length
                )
                // Right now return test data
                return callback(res.data.filter((i) => !_.isEmpty(i)))
            }
            console.log(`${DEBUG_KEY}: loading with res: `, res)
            console.warn(`${DEBUG_KEY}: Loading comment with no res`)
            onError(res)
        })
        .catch((err) => {
            onError(err)
        })
}
