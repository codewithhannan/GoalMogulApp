/** @format */

import axios from 'axios'
import { Image } from 'react-native'
import * as ImageManipulator from 'expo-image-manipulator'
import * as Permissions from 'expo-permissions'
import _ from 'lodash'
import TokenService from '../services/token/TokenService'

const VoiceTypes = ['CommentAudio', 'ChatRoomAudio']

const getVoiceUrl = (type) => {
    let voiceType

    if (VoiceTypes.some((oneType) => oneType === type)) {
        voiceType = type
    } else {
        throw new Error(`Image type: ${type} is not included`)
    }
    // return `https://api.goalmogul.com/api/secure/s3/${voiceType}/signature`
    return `http:/192.168.1.8:8081/api/secure/s3/${voiceType}/signature`
}

const VoiceUtils = {
    getPresignedUrl(file, token, dispatch, type) {
        let uriParts = file.split('.')
        let fileType = uriParts[uriParts.length - 1]
        return new Promise(async (resolve, reject) => {
            const url = getVoiceUrl(type)
            const authToken = await TokenService.getAuthToken()

            const formData = new FormData()
            formData.append('audio', {
                uri: file,
                name: `recording.${fileType}`,
                fileType: `audio/x-${fileType}`,
            })
            const param = {
                url,
                method: 'post',
                data: formData,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': token,
                },
            }
            axios(param)
                .then((res) => {
                    const { objectKey, signedRequest } = res.data
                    if (dispatch) {
                        dispatch(objectKey)
                    }
                    resolve({ signedRequest, file, objectKey })
                })
                .catch((err) => {
                    console.log('error uploading: ', err)
                    reject(err)
                })
        })
    },

    uploadImage(file, presignedUrl, objectKey) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest()
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        // Successfully uploaded the file.
                        console.log('Successfully uploading the file')
                        resolve({ resp: xhr.responseText, objectKey })
                    } else {
                        // The file could not be uploaded.
                        reject(
                            new Error(
                                `Request failed. Status: ${xhr.status}. Content: ${xhr.responseText}`
                            )
                        )
                    }
                }
            }
            xhr.open('PUT', presignedUrl)
            xhr.setRequestHeader('X-Amz-ACL', 'public-read')
            xhr.setRequestHeader('Content-Type', 'image/jpeg')
            xhr.send({ uri: file, type: 'image/jpeg' })
        })
    },

    getImageSize(file) {
        return new Promise((resolve) => {
            Image.getSize(file, (width, height) => {
                resolve({ width, height })
            })
        })
    },

    async getMultipleImageSize(file) {
        return await new Promise((resolve, reject) => {
            let imageUri = []
            file.map((url) => {
                return Image.getSize(url, (width, height) => {
                    imageUri.push({ width, height })
                    resolve(imageUri)
                })
            })
        })
    },

    /**
     *
     * @param {*} file
     * @param {*} width
     * @param {*} height
     * @param {object} capDimensions: { capHeight, capWidth }
     */
    resizeImage(file, width, height, capDimensions) {
        console.log('file to resize is: ', file)
        const widthCap =
            capDimensions && capDimensions.capWidth
                ? capDimensions.capWidth
                : 500
        const heightCap =
            capDimensions && capDimensions.capHeight
                ? capDimensions.capHeight
                : 500

        const cropData = {
            offset: { x: 0, y: 0 },
            size: {
                width,
                height,
            },
            displaySize: {
                width: widthCap * (width > height ? 1 : width / height),
                height: heightCap * (height > width ? 1 : height / width),
            },
            resizeMode: 'cover',
        }

        // get info for original image
        const fileType = 'jpeg'
        const actions = [
            {
                resize: {
                    width: widthCap * (width > height ? 1 : width / height),
                    height: heightCap * (height > width ? 1 : height / width),
                },
            },
        ]
        const saveOptions = {
            compress: 1, // no compress since we resize the image
            format: ImageManipulator.SaveFormat.JPEG,
        }

        const promise = new Promise(async (resolve, reject) => {
            try {
                const editedImage = await ImageManipulator.manipulateAsync(
                    file,
                    actions,
                    saveOptions
                )

                resolve({
                    uri: editedImage.uri,
                    name: `photo.${fileType}`,
                    type: `image/${fileType}`,
                })
            } catch (error) {
                console.log('edited err: ', err)
                reject(err)
            }
        })

        return promise
    },

    resizeMultipleImage(file, width, height, capDimensions) {
        console.log('file to resize is: ', file)
        const widthCap =
            capDimensions && capDimensions.capWidth
                ? capDimensions.capWidth
                : 500
        const heightCap =
            capDimensions && capDimensions.capHeight
                ? capDimensions.capHeight
                : 500

        const cropData = {
            offset: { x: 0, y: 0 },
            size: {
                width,
                height,
            },
            displaySize: {
                width: widthCap * (width > height ? 1 : width / height),
                height: heightCap * (height > width ? 1 : height / width),
            },
            resizeMode: 'cover',
        }

        // get info for original image
        const fileType = 'jpeg'
        const actions = [
            {
                resize: {
                    width: widthCap * (width > height ? 1 : width / height),
                    height: heightCap * (height > width ? 1 : height / width),
                },
            },
        ]
        const saveOptions = {
            compress: 1, // no compress since we resize the image
            format: ImageManipulator.SaveFormat.JPEG,
        }

        const promise = new Promise(async (resolve, reject) => {
            try {
                const editedImage = await ImageManipulator.manipulateAsync(
                    file,
                    actions,
                    saveOptions
                )

                resolve({
                    uri: editedImage.uri,
                    name: `photo.${fileType}`,
                    type: `image/${fileType}`,
                })
            } catch (error) {
                console.log('edited err: ', err)
                reject(err)
            }
        })

        return promise
    },

    /**
     * Upload image to S3 server
     * @param(required) imageUri
     * @param(required) dispatch
     * @param(required) path
     * @return
     */
    upload(hasImageModified, imageUri, token, type, dispatch, userId) {
        return new Promise((resolve, reject) => {
            if (!hasImageModified) {
                return resolve()
            }
            VoiceUtils.getImageSize(imageUri)
                .then(({ width, height }) => {
                    // Resize image
                    return VoiceUtils.resizeImage(imageUri, width, height)
                })
                .then((image) => {
                    // Upload image to S3 server
                    console.log(
                        '[ VoiceUtils ]: Finish resizing and start to getPresignedUrl'
                    )
                    return VoiceUtils.getPresignedUrl(
                        image.uri,
                        undefined, // token is extracted from TokenService now instead of storing it in redux state
                        (objectKey) => {
                            dispatch({
                                type,
                                payload: {
                                    data: objectKey,
                                    userId,
                                },
                            })
                        }
                    )
                })
                .then(({ signedRequest, file }) => {
                    console.log('[ VoiceUtils ]: Uploading image')
                    return VoiceUtils.uploadImage(file, signedRequest)
                })
                .then((res) => {
                    if (res instanceof Error) {
                        // uploading to s3 failed
                        console.log(
                            'error uploading image to s3 with res: ',
                            res
                        )
                        reject(res)
                    }
                    resolve()
                })
        })
    },
}

export default VoiceUtils
