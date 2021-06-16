/** @format */

import {
    deleteFeedbackImage,
    feedbackImagesSelected,
} from '../reducers/FeedbackReducers'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'
import ImageUtils from '../Utils/ImageUtils'
import { api as API } from '../redux/middleware/api'
import { async } from 'validate.js'

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

export const sendFeedbackImages = () => async (dispatch, getState) => {
    // Obtain pre-signed url
    const imageUri = getState().feedback.feedBackimages.map((feedback) => {
        return feedback.uri
    })

    const { userId, token } = getState().user

    try {
        if (imageUri) {
            const result = imageUri.map(async (image) => {
                await ImageUtils.getImageSize(image)
                    .then(({ width, height }) => {
                        // Resize image
                        console.log('width, height are: ', width, height)
                        return ImageUtils.resizeImage(image, width, height)
                    })
                    .then((resizedImage) => {
                        // Upload image to S3 server
                        console.log('image to upload is: ', resizedImage)
                        return ImageUtils.getPresignedUrl(
                            resizedImage.uri,
                            token
                        )
                    })
                    .then(({ file, signedRequest }) => {
                        let images = ImageUtils.uploadImage(file, signedRequest)
                    })
            })

            // .then((image) => {
            //     // Upload image to S3 server
            //     console.log('image to upload is: ', image)
            //     return ImageUtils.getPresignedUrl(
            //         image.uri,
            //         token,
            //         (objectKey) => {
            //             dispatch({
            //                 type: REGISTRATION_ADDPROFILE_UPLOAD_SUCCESS,
            //                 payload: objectKey,
            //             })
            //         }
            //     )
            // })
            // .then(({ signedRequest, file }) => {
            //     return ImageUtils.uploadImage(file, signedRequest)
            // })
            // .then((res) => {
            //     if (res instanceof Error) {
            //         // uploading to s3 failed
            //         console.log('error uploading image to s3 with res: ', res)
            //         throw res
            //     }
            //     return getState().user.profile.imageObjectId
            // })
            // .then((image) => {
            //     // Update profile imageId to the latest uploaded one
            //     return API.put(
            //         'secure/user/profile',
            //         {
            //             image,
            //         },
            //         token
            //     )
            //         .then((res) => {
            //             console.log('update profile picture Id with res: ', res)
            //         })
            //         .catch((err) => {
            //             console.log('error updating record: ', err)
            //         })
            // })
        }
    } catch (error) {
        console.log('THIS IS ERROR', error)
    }
}
