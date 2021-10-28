/** @format */

import axios from 'axios'
import TokenService from '../services/token/TokenService'

const VoiceTypes = ['CommentAudio', 'ChatVoice']

const getVoiceUrl = (type) => {
    let voiceType

    if (VoiceTypes.some((oneType) => oneType === type)) {
        voiceType = type
    } else {
        throw new Error(`Voice type: ${type} is not included`)
    }
    return `https://api.goalmogul.com/api/secure/s3/${voiceType}/signature`
    // return `http:/192.168.1.24:8081/api/secure/s3/${voiceType}/signature`
}

const VoiceUtils = {
    getPresignedUrl(file, token, dispatch, type) {
        let uriParts = file.split('.')
        let fileType = uriParts[uriParts.length - 1]

        return new Promise(async (resolve, reject) => {
            const url = getVoiceUrl(type)
            const authToken = await TokenService.getAuthToken()

            const param = {
                url,
                method: 'post',
                data: {
                    fileType: `audio/x-${fileType}`,
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

    uploadVoice(file, presignedUrl, objectKey) {
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
            xhr.setRequestHeader('Content-Type', 'audio/x-m4a')
            xhr.send({ uri: file, type: 'audio/x-m4a' })
        })
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
                    console.log('[ VoiceUtils ]: Uploading voice')
                    return VoiceUtils.uploadImage(file, signedRequest)
                })
                .then((res) => {
                    if (res instanceof Error) {
                        // uploading to s3 failed
                        console.log(
                            'error uploading voice to s3 with res: ',
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
