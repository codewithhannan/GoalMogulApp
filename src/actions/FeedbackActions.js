/** @format */

import {
    clearfeedbackImages,
    deleteFeedbackImage,
    feedbackImagesSelected,
    feedbackImagesToSend,
} from '../reducers/FeedbackReducers'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'
import ImageUtils from '../Utils/ImageUtils'
import { api as API } from '../redux/middleware/api'

const DEBUG_KEY = '[Feedback Actions]'

export const openFeedBackCameraRoll = (callback, maybeOptions) => async (
    dispatch
) => {
    const permissions = [Permissions.CAMERA, Permissions.CAMERA_ROLL]
    const permissionGranted = await ImageUtils.checkPermission(permissions)
    if (!permissionGranted) {
        // TODO: fire event to say permission not granted
        return
    }
    const disableEditing = maybeOptions && maybeOptions.disableEditing
    const result = await ImagePicker.launchImageLibraryAsync(
        disableEditing
            ? {}
            : {
                  allowsEditing: true,
                  aspect: [4, 3],
                  quality: 0.9,
              }
    )

    if (!result.cancelled) {
        if (callback) {
            return callback(result)
        }

        return dispatch(feedbackImagesSelected(result))
    }
}

export const deleteFeedback = (index) => {
    return async (dispatch) => {
        try {
            dispatch(deleteFeedbackImage(index))
        } catch (err) {
            console.log(
                `${DEBUG_KEY} This is the error of deleting feedback`,
                err.message
            )
        }
    }
}

export const sendFeedbackImages = (description, maybeShowModal) => async (
    dispatch,
    getState
) => {
    // Obtain pre-signed url
    const imageUri = getState().feedback.feedBackimages.map((feedback) => {
        return feedback.uri
    })

    const { token } = getState().user

    try {
        if (imageUri) {
            await Promise.all(
                imageUri.map(async (image) => {
                    await ImageUtils.getImageSize(image)
                        .then(async ({ width, height }) => {
                            // Resize image
                            console.log('width, height are: ', width, height)
                            return await ImageUtils.resizeImage(
                                image,
                                width,
                                height
                            )
                        })
                        .then(async (resizedImage) => {
                            // Upload image to S3 server
                            console.log('image to upload is: ', resizedImage)
                            return ImageUtils.getPresignedUrl(
                                resizedImage.uri,
                                token,
                                (objectKey) => {
                                    console.log(
                                        'THIS IS OBJECT KEY OF FEEEDBACK',
                                        objectKey
                                    )
                                    dispatch(feedbackImagesToSend(objectKey))
                                },
                                'FeedbackImage'
                            )
                        })
                        .then(({ file, signedRequest }) => {
                            return ImageUtils.uploadImage(file, signedRequest)
                        })
                        .then((res) => {
                            if (res instanceof Error) {
                                // uploading to s3 failed
                                console.log(
                                    'error uploading image to s3 with res: ',
                                    res
                                )
                                throw res
                            }
                        })
                        .then((res) => {
                            if (res instanceof Error) {
                                // uploading to s3 failed
                                console.log(
                                    'error uploading image to s3 with res: ',
                                    res
                                )
                                throw res
                            }
                            return getState().feedback.imagesToSend
                        })
                })
            )

            let images = getState().feedback.imagesToSend
            let res = await API.post(
                'secure/user/account/submit-feedback',
                {
                    images,
                    description,
                },
                token
            )
            if (res.status === 200) {
                dispatch(clearfeedbackImages())
                setTimeout(() => {
                    maybeShowModal()
                }, 600)
            }

            console.log(
                `${DEBUG_KEY} this is response of sending images to database`,
                res
            )
        }
    } catch (error) {
        console.log(
            `${DEBUG_KEY}failed upload feedback images with error:`,
            error.message
        )
    }
}
