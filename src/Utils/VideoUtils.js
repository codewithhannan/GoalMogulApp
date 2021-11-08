/** @format */

import axios from 'axios'
import _ from 'lodash'
import TokenService from '../services/token/TokenService'

const VideoTypes = ['ChatVideo', 'CommentVideo']
const getVideoUrl = (type) => {
    let videoType
    if (!type) {
        videoType = 'ChatVideo'
    } else if (VideoTypes.some((oneType) => oneType === type)) {
        videoType = type
    } else {
        throw new Error(`Video type: ${type} is not included`)
    }
    return `https://api.goalmogul.com/api/secure/s3/${videoType}/signature`
    // return `http:/192.168.1.12:8081/api/secure/s3/${videoType}/signature`
}

const VideoUtils = {
    getPresignedUrl(file, token, dispatch, type) {
        return new Promise(async (resolve, reject) => {
            const url = getVideoUrl(type)
            const authToken = await TokenService.getAuthToken()
            const param = {
                url,
                method: 'post',
                data: {
                    fileType: 'video/mp4',
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
            const url = getVideoUrl(type)
            const authToken = await TokenService.getAuthToken()
            const param = {
                url,
                method: 'post',
                data: {
                    fileType: 'video/mp4',
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

    uploadVideo(file, presignedUrl, objectKey) {
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
            xhr.setRequestHeader('Content-Type', 'video/mp4')
            xhr.send({ uri: file, type: 'video/mp4' })
        })
    },
}

export default VideoUtils

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
