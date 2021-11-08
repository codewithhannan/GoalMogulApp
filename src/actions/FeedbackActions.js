/** @format */

import {
    clearfeedbackImages,
    deleteFeedbackImage,
    feedbackImagesSelected,
    feedbackImagesToSend,
} from '../reducers/FeedbackReducers'
import * as ImagePickers from 'expo-image-picker'
import ImageUtils from '../Utils/ImageUtils'
import { api as API } from '../redux/middleware/api'
import { Alert } from 'react-native'
import ImagePicker from 'react-native-image-crop-picker'

const DEBUG_KEY = '[Feedback Actions]'

export const openFeedBackCameraRoll = (callback, maybeOptions) => async (
    dispatch
) => {
    const { status } = await ImagePickers.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
        // TODO: fire event to say permission not granted
        return alert('Please grant access to photos and camera.')
    }
    const disableEditing = maybeOptions && maybeOptions.disableEditing
    ImagePicker.openPicker({
        width: 848,
        height: 480,
        compressImageQuality: 0.7,
        cropping: true,
        includeExif: true,
    }).then((image) => {
        // console.log('IMAGE HYE HA', image)
        if (callback) {
            return callback(image)
        }
        return dispatch(feedbackImagesSelected(image))
    })
    // const result = await ImagePickers.launchImageLibraryAsync(
    //     disableEditing
    //         ? {}
    //         : {
    //               allowsEditing: true,
    //               aspect: [4, 3],
    //               quality: 0.9,
    //           }
    // )

    // if (!result.cancelled) {
    //     if (callback) {
    //         return callback(result)
    //     }

    //     return dispatch(feedbackImagesSelected(result))
    // }
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
        return feedback.path
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
                                resizedImage.path,
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
