/** @format */

import { Actions } from 'react-native-router-flux'
import { reset } from 'redux-form'
import { Alert } from 'react-native'
import _ from 'lodash'

import {
    SHARE_NEW_SHARE_TO,
    SHARE_NEW_SELECT_DEST,
    SHARE_NEW_CANCEL,
    SHARE_NEW_POST_SUCCESS,
    SHARE_NEW_POST,
    SHARE_NEW_POST_FAIL,
} from './NewShareReducers'

import { SHARE_DETAIL_OPEN, SHARE_DETAIL_CLOSE } from './ShareReducers'

import {
    switchCaseF,
    sanitizeTags,
    componentKeyByTab,
    constructPageId,
    switchCase,
} from '../../../middleware/utils'

import { fetchPostDetail } from '../post/PostActions'

// Actions
import { refreshComments } from '../../feed/comment/CommentActions'

import { api as API } from '../../../middleware/api'
import { DropDownHolder } from '../../../../Main/Common/Modal/DropDownModal'
import { EMPTY_POST } from '../../../../Utils/Constants'
import { trackWithProperties, EVENT } from '../../../../monitoring/segment'

const DEBUG_KEY = '[ Action Share ]'

/* Functions related to a share detail */

export const openShareDetailById = (shareId, initialProps) => (
    dispatch,
    getState
) => {
    const pageId = constructPageId('post')
    const share = {
        ...EMPTY_POST,
        created: new Date(),
        _id: shareId,
    }
    openShareDetail(share, pageId, initialProps)(dispatch, getState)
}

/*
 * open share detail
 */
export const openShareDetail = (share, pageId, initialProps) => (
    dispatch,
    getState
) => {
    const { tab } = getState().navigation

    // const scene = (!tab || tab === 'homeTab') ? 'share' : `share${capitalizeWord(tab)}`;
    // const { pageId } = _.get(getState().shareDetail, `${scene}`);
    const postId = share._id

    dispatch({
        type: SHARE_DETAIL_OPEN,
        payload: {
            share,
            post: share,
            postId,
            tab,
            pageId,
        },
    })

    fetchPostDetail(postId, pageId)(dispatch, getState)
    // In the version 0.3.9 and later, loading comment is done in share detail
    // refreshComments('Post', postId, tab, pageId)(dispatch, getState);

    const componentToOpen = componentKeyByTab(tab, 'share')
    Actions.push(`${componentToOpen}`, {
        pageId,
        postId,
        initialProps,
        postType: share.postType,
    })
}

// close share detail
export const closeShareDetail = (postId, pageId) => (dispatch, getState) => {
    Actions.pop()

    const { tab } = getState().navigation
    // const path = (!tab || tab === 'homeTab') ? 'share' : `share${capitalizeWord(tab)}`;
    // const { pageId } = _.get(getState().shareDetail, `${path}`);

    dispatch({
        type: SHARE_DETAIL_CLOSE,
        payload: {
            tab,
            postId,
            pageId,
        },
    })
}

/**
 * Functions related to creating a new share
 */
const switchPostType = (postType, ref, goalRef) =>
    switchCaseF({
        General: {
            postType,
            postRef: ref,
        },
        GoalStorylineUpdate: {
            postType,
            goalRef,
        },
        ShareUser: {
            postType,
            userRef: ref,
        },
        SharePost: {
            postType,
            postRef: ref,
        },
        ShareGoal: {
            postType,
            goalRef: ref,
        },
        ShareNeed: {
            postType,
            needRef: ref,
            goalRef,
        },
        ShareStep: {
            postType,
            stepRef: ref,
            goalRef,
        },
    })('General')(postType)

const switchShareToAction = (dest, callback) =>
    switchCaseF({
        // Open modal directly if share to feed
        feed: () => {
            console.log('feed also pushes')
            Actions.push('shareModal', { callback })
        },
        // Open search overlay if share to either tribe or event
        tribe: () =>
            Actions.push('searchTribeLightBox', {
                callback,
                shouldPreload: true,
            }),
        event: () =>
            Actions.push('searchEventLightBox', {
                callback,
                shouldPreload: true,
            }),
    })('feed')(dest)

// User chooses a share destination
// No need for refactoring since there could be only one newShare at a time
export const chooseShareDest = (
    postType,
    ref,
    dest,
    itemToShare,
    goalRef,
    callback
) => (dispatch, getState) => {
    const { userId } = getState().user
    const postDetail = switchPostType(postType, ref, goalRef)

    dispatch({
        type: SHARE_NEW_SHARE_TO,
        payload: {
            ...postDetail,
            shareTo: dest,
            owner: userId,
            itemToShare,
        },
    })

    switchShareToAction(dest, callback)
}

export const openNewShareToTribeView = (
    { postType, ref, tribe, itemToShare },
    callback
) => (dispatch, getState) => {
    const { userId } = getState().user
    const postDetail = switchPostType(postType, ref)

    dispatch({
        type: SHARE_NEW_SHARE_TO,
        payload: {
            ...postDetail,
            shareTo: 'tribe',
            owner: userId,
            itemToShare,
        },
    })

    dispatch({
        type: SHARE_NEW_SELECT_DEST,
        payload: {
            type: 'belongsToTribe',
            value: tribe,
        },
    })

    Actions.push('shareModal', { callback })
}

// Cancel a share
export const cancelShare = () => (dispatch) => {
    Actions.pop()
    dispatch(reset('shareModal'))
    dispatch({
        type: SHARE_NEW_CANCEL,
    })
}

// User submit the share modal form
export const submitShare = (values, callback) => (dispatch, getState) => {
    dispatch({
        type: SHARE_NEW_POST,
    })

    const { token } = getState().user
    const newShare = newShareAdaptor(getState().newShare, values)

    console.log(`${DEBUG_KEY}: new share to create is: `, newShare)

    let dest = 'Feed'
    if (newShare.belongsToEvent) {
        dest = 'Event'
    } else if (newShare.belongsToTribe) {
        dest = 'Tribe'
    }
    trackWithProperties(EVENT.POST_SHARED, {
        Type: newShare.postType,
        Destination: dest,
        Value: values,
    })

    API.post(
        'secure/feed/post',
        {
            post: JSON.stringify({ ...newShare }),
        },
        token
    )
        .then((res) => {
            if ((!res.message && res.data) || res.status === 200) {
                dispatch({
                    type: SHARE_NEW_POST_SUCCESS,
                    payload: res.data,
                })
                Actions.pop()
                // Callback passed down from the trigger
                if (callback) {
                    callback()
                }

                // Timeout is set to wait for actions finished in callback
                setTimeout(() => {
                    console.log(`${DEBUG_KEY}: [ submitShare ]: showing alert`)
                    DropDownHolder.alert(
                        'success',
                        makeShareSuccessMessage(newShare),
                        ''
                    )
                }, 300)

                console.log(
                    `${DEBUG_KEY}: [ submitShare ] create succeed with data:`,
                    res.data
                )
                return dispatch(reset('shareModal'))
            }
            console.warn(
                `${DEBUG_KEY}: creating share failed with message: `,
                res
            )
            dispatch({
                type: SHARE_NEW_POST_FAIL,
            })
        })
        .catch((err) => {
            Alert.alert('Creating share failed', 'Please try again later')
            dispatch({
                type: SHARE_NEW_POST_FAIL,
            })
            console.log(
                `${DEBUG_KEY}: creating share failed with exception: `,
                err
            )
        })
}

const transformPrivacy = (privacy, belongsToTribe, belongsToEvent) => {
    let ret = privacy === 'Private' ? 'self' : privacy.toLowerCase()
    // Set privacy to public if it's a share to event or tribe
    if (belongsToTribe || belongsToEvent) {
        ret = 'public'
    }
    return ret
}

const newShareAdaptor = (newShare, formVales) => {
    const {
        owner,
        postType,
        userRef,
        postRef,
        goalRef,
        needRef,
        stepRef,
        belongsToTribe,
        belongsToEvent,
    } = newShare

    const {
        privacy, // needs to uncapitalize the first character and map Private to self
        content,
        tags,
    } = formVales

    // const tagsToUse = clearTags(content, {}, tags);
    // Tags sanitization will reassign index as well as removing the unused tags
    const tagsToUse = sanitizeTags(content, tags)

    return {
        owner,
        postType,
        userRef,
        postRef,
        goalRef,
        needRef,
        stepRef,
        belongsToTribe,
        belongsToEvent,
        content: {
            text: content,
            tags: tagsToUse,
        },
        privacy: transformPrivacy(privacy, belongsToTribe, belongsToEvent),
    }
}

const makeShareSuccessMessage = (newShare) => {
    const {
        userRef,
        postRef,
        goalRef,
        needRef,
        stepRef,
        belongsToTribe,
        belongsToEvent,
    } = newShare

    let type = ''
    let destination = 'Activity Feed'

    if (belongsToEvent) {
        destination = 'Event'
    }

    if (belongsToTribe) {
        destination = 'Tribe'
    }

    if (userRef) {
        type = 'User'
    }

    if (postRef) {
        type = 'Post'
    }

    if (goalRef) {
        type = 'Goal'
    }

    if (needRef) {
        type = 'Need'
    }

    if (stepRef) {
        type = 'Step'
    }

    return `Successfully shared ${type} to ${destination}`
}

export const selectEvent = (event, callback) => (dispatch) => {
    dispatch({
        type: SHARE_NEW_SELECT_DEST,
        payload: {
            type: 'belongsToEvent',
            value: event,
        },
    })

    // Open share modal
    Actions.pop()
    Actions.shareModal({ callback })
}

export const selectTribe = (tribe, callback) => (dispatch) => {
    dispatch({
        type: SHARE_NEW_SELECT_DEST,
        payload: {
            type: 'belongsToTribe',
            value: tribe,
        },
    })

    // Open share modal
    Actions.pop()
    Actions.shareModal({ callback })
}

/**
 * Helper functions
 */
const capitalizeWord = (word) => {
    if (!word) return ''
    return word.replace(/^\w/, (c) => c.toUpperCase())
}
