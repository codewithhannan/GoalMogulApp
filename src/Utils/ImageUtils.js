/** @format */

import axios from 'axios'
import { Image } from 'react-native'
import * as ImageManipulator from 'expo-image-manipulator'
import _ from 'lodash'
import TokenService from '../services/token/TokenService'

const ImageTypes = [
    'ProfileImage',
    'FeedImage',
    'PageImage',
    'GoalImage',
    'ChatFile',
    'FeedbackImage',
]
const getImageUrl = (type) => {
    let imageType
    if (!type) {
        imageType = 'ProfileImage'
    } else if (ImageTypes.some((oneType) => oneType === type)) {
        imageType = type
    } else {
        throw new Error(`Image type: ${type} is not included`)
    }
    return `https://api.goalmogul.com/api/secure/s3/${imageType}/signature`
    // return `http:/192.168.1.3:8081/api/secure/s3/${imageType}/signature`
}

const ImageUtils = {
    getPresignedUrl(file, token, dispatch, type) {
        return new Promise(async (resolve, reject) => {
            const url = getImageUrl(type)
            const authToken = await TokenService.getAuthToken()
            const param = {
                url,
                method: 'post',
                data: {
                    fileType: 'image/jpeg',
                    token: authToken,
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

    getPresignedMultipleUrl(file, token, dispatch, type) {
        return new Promise(async (resolve, reject) => {
            const url = getImageUrl(type)
            const authToken = await TokenService.getAuthToken()
            const param = {
                url,
                method: 'post',
                data: {
                    fileType: 'image/jpeg',
                    token: authToken,
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
        // const widthCap =
        //     capDimensions && capDimensions.capWidth
        //         ? capDimensions.capWidth
        //         : 500
        // const heightCap =
        //     capDimensions && capDimensions.capHeight
        //         ? capDimensions.capHeight
        //         : 500

        // const cropData = {
        //     offset: { x: 0, y: 0 },
        //     size: {
        //         width,
        //         height,
        //     },
        //     displaySize: {
        //         width: widthCap * (width > height ? 1 : width / height),
        //         height: heightCap * (height > width ? 1 : height / width),
        //     },
        //     resizeMode: 'cover',
        // }

        // // get info for original image
        // const fileType = 'jpeg'
        // const actions = [
        //     {
        //         resize: {
        //             width: widthCap * (width > height ? 1 : width / height),
        //             height: heightCap * (height > width ? 1 : height / width),
        //         },
        //     },
        // ]
        // const saveOptions = {
        //     compress: 1, // no compress since we resize the image
        //     format: ImageManipulator.SaveFormat.JPEG,
        // }

        // const promise = new Promise(async (resolve, reject) => {
        //     try {
        //         const editedImage = await ImageManipulator.manipulateAsync(
        //             file,
        //             actions,
        //             saveOptions
        //         )

        //         resolve({
        //             uri: editedImage.uri,
        //             name: `photo.${fileType}`,
        //             type: `image/${fileType}`,
        //         })
        //     } catch (err) {
        //         console.log('edited err: ', err)
        //         reject(err)
        //     }
        // })

        return { uri: file, name: `photo.jpeg`, type: `image/jpeg` }
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
            } catch (err) {
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
            ImageUtils.getImageSize(imageUri)
                .then(({ width, height }) => {
                    // Resize image
                    return ImageUtils.resizeImage(imageUri, width, height)
                })
                .then((image) => {
                    // Upload image to S3 server
                    console.log(
                        '[ ImageUtils ]: Finish resizing and start to getPresignedUrl'
                    )
                    return ImageUtils.getPresignedUrl(
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
                    console.log('[ ImageUtils ]: Uploading image')
                    return ImageUtils.uploadImage(file, signedRequest)
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

    // async checkPermission(permissions) {
    //     const promises = permissions.map((value) => Permissions.getAsync(value))
    //     const status = await Promise.all(promises)

    //     const requestPromises = status.map((value, index) => {
    //         if (value.status !== 'granted') {
    //             return Permissions.askAsync(permissions[index])
    //         }
    //         return ''
    //     })

    //     const filteredPromises = _.compact(requestPromises)
    //     const requestStatus = await Promise.all(filteredPromises)

    //     if (requestStatus.some((value) => value.status !== 'granted')) {
    //         alert('Please grant access to photos and camera.')
    //         return false
    //     }
    //     return true
    // },
}

export default ImageUtils

export const toHashCode = function (str) {
    var hash = 0,
        i,
        chr
    if (str.length === 0) return hash
    for (i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i)
        hash = (hash << 5) - hash + chr
        hash |= 0 // Convert to 32bit integer
    }
    return hash
}
