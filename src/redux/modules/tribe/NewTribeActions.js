/** @format */

// Actions to create a new tribe
import { Actions } from 'react-native-router-flux'
import { Alert } from 'react-native'
import { api as API } from '../../middleware/api'
import ImageUtils from '../../../Utils/ImageUtils'

import {
    TRIBE_NEW_SUBMIT,
    TRIBE_NEW_SUBMIT_SUCCESS,
    TRIBE_NEW_SUBMIT_FAIL,
    TRIBE_NEW_CANCEL,
    TRIBE_NEW_UPLOAD_PICTURE_SUCCESS,
    TRIBE_NEW_ERROR,
    TRIBE_CLEAR_ERROR,
} from './NewTribeReducers'

import { refreshTribes } from './TribeHubActions'
import { MYTRIBE_EDIT_SUCCESS } from './Tribes'

const BASE_ROUTE = 'secure/tribe'
const DEBUG_KEY = '[ Action Create Tribe ]'

// Open creating tribe modal
export const openNewTribeModal = () => (dispatch) => {
    Actions.push('createTribeStack')
}

export const cancelCreatingNewTribe = () => (dispatch) => {
    Actions.pop()
    dispatch({
        type: TRIBE_NEW_CANCEL,
    })
}

/**
 * @param values: new tribe values
 * @param needUpload: if there is media to be uploaded
 * @param isEdit: if edit, then use put rather than post
 *
 * Following are the params for the values submitted to the server
 * @param name
 * @param options:
		{membersCanInvite, isAutoAcceptEnabled, isPubliclyVisible, membershipLimit, description, picture}
 */
export const createNewTribe = (values, needUpload, isEdit, tribeId) => (
    dispatch,
    getState
) => {
    const { token } = getState().user

    const newTribe = formToTribeAdapter(values, tribeId, isEdit)
    // console.log(`${DEBUG_KEY}: newTribe to submit is; `, newTribe);

    dispatch({
        type: TRIBE_NEW_SUBMIT,
    })

    const onSuccess = (res, tribe) => {
        console.log(`${DEBUG_KEY}: [createNewTribe] success with res: `, res)
        dispatch({
            type: TRIBE_NEW_SUBMIT_SUCCESS,
            payload: {
                data: res.data, // new tribe object
            },
        })

        if (isEdit) {
            // console.log(`${DEBUG_KEY}: tribe edit success with res: `, res);
            // console.log(`${DEBUG_KEY}: tribe edit success with new tribe: `, tribe);
            dispatch({
                type: MYTRIBE_EDIT_SUCCESS,
                payload: {
                    tribeId,
                    newTribe: {
                        _id: tribe.tribeId,
                        ...tribe.details,
                    },
                },
            })
            refreshTribes('admin')(dispatch, getState)
        }
        Actions.pop()
        Alert.alert(
            'Success',
            `Congrats! Your tribe is successfully ${
                isEdit ? 'updated' : 'created'
            }.`
        )
    }

    const onError = (err) => {
        dispatch({
            type: TRIBE_NEW_SUBMIT_FAIL,
        })
        dispatch({
            type: TRIBE_NEW_ERROR,
            payload: err,
        })
        Alert.alert(err.message, 'Please try again later')
        console.log(
            `${DEBUG_KEY}: edit or create new tribe failed with err: `,
            err
        )
    }

    const imageUri = isEdit
        ? newTribe.details.picture
        : newTribe.options.picture
    if (!needUpload) {
        // If no mediaRef then directly submit the post
        sendCreateTribeRequest(
            newTribe,
            token,
            isEdit,
            dispatch,
            onSuccess,
            onError
        )
    } else {
        ImageUtils.getImageSize(imageUri)
            .then(({ width, height }) => {
                // Resize image
                console.log('width, height are: ', width, height)
                return ImageUtils.resizeImage(imageUri, width, height)
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
                            type: TRIBE_NEW_UPLOAD_PICTURE_SUCCESS,
                            payload: objectKey,
                        })
                    },
                    'PageImage'
                )
            })
            .then(({ signedRequest, file }) => {
                return ImageUtils.uploadImage(file, signedRequest)
            })
            .then((res) => {
                if (res instanceof Error) {
                    // uploading to s3 failed
                    console.log(
                        `${DEBUG_KEY}: error uploading image to s3 with res: `,
                        res
                    )
                    throw res
                }
                return getState().newEvent.tmpPicture
            })
            .then((image) => {
                // Use the presignedUrl as media string
                console.log(`${BASE_ROUTE}: presigned url sent is: `, image)
                const newTribeObject = isEdit
                    ? {
                          ...newTribe,
                          details: { ...newTribe.details, picture: image },
                      }
                    : {
                          ...newTribe,
                          options: { ...newTribe.options, picture: image },
                      }
                return sendCreateTribeRequest(
                    newTribeObject,
                    token,
                    isEdit,
                    dispatch,
                    onSuccess,
                    onError
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
}

const sendCreateTribeRequest = (
    newTribe,
    token,
    isEdit,
    dispatch,
    onSuccess,
    onError
) => {
    if (isEdit) {
        console.log(newTribe)
        API.put(`${BASE_ROUTE}`, { ...newTribe }, token)
            .then((res) => {
                if (res.status === 200) {
                    return onSuccess(res, newTribe)
                }
                onError(res)
            })
            .catch((err) => {
                onError(err)
            })
        return
    }
    console.log(newTribe)
    API.post(`${BASE_ROUTE}`, { ...newTribe }, token)
        .then((res) => {
            if (res.status === 200) {
                return onSuccess(res, newTribe)
            }
            onError(res)
        })
        .catch((err) => {
            onError(err)
        })
}

// Tranform form values to a tribe object
const formToTribeAdapter = (values, tribeId, isEdit) => {
    const {
        name,
        isMemberInviteEnabled,
        isAutoAcceptEnabled,
        isPubliclyVisible,
        membershipLimit,
        description,
        picture,
        category,
        tribeInviteCode,
        guidelines,
    } = values

    if (isEdit) {
        return {
            tribeId,
            details: {
                isMemberInviteEnabled,
                isAutoAcceptEnabled,
                isPubliclyVisible,
                membershipLimit: membershipLimit || Number.MAX_SAFE_INTEGER,
                description,
                picture,
                category,
                name,
                tribeInviteCode,
                guidelines,
            },
        }
    }

    return {
        name,
        options: {
            isMemberInviteEnabled,
            isAutoAcceptEnabled,
            isPubliclyVisible,
            membershipLimit: membershipLimit || Number.MAX_SAFE_INTEGER,
            description,
            picture,
            category,
            tribeInviteCode,
            guidelines,
        },
    }
}

// Transform tribe object to form values
export const tribeToFormAdapter = (tribe) => {
    const {
        name,
        isMemberInviteEnabled,
        isAutoAcceptEnabled,
        isPubliclyVisible,
        membershipLimit,
        description,
        picture,
        category,
        tribeInviteCode,
        guidelines,
    } = tribe
    console.log('TRIBE ha ye', tribe)

    // If membershipLimit is max safe, it means user hasn't defined the limit yet
    const membershipLimitToShow =
        membershipLimit === Number.MAX_SAFE_INTEGER
            ? undefined
            : `${membershipLimit}`

    return {
        name,
        isMemberInviteEnabled,
        isAutoAcceptEnabled,
        isPubliclyVisible,
        membershipLimit: membershipLimitToShow,
        description,
        picture,
        category,
        tribeInviteCode: tribeInviteCode?.code,
        guidelines,
    }
}

export const clearTribeError = () => (dispatch) => {
    dispatch({
        type: TRIBE_CLEAR_ERROR,
    })
}

/**
 * User edits a tribe that belongs to self
 */
export const editTribe = (tribe) => (dispatch, getState) => {}
