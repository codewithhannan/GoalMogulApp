/** @format */

import VoiceUtils from '../Utils/VoiceUtils'

const DEBUG_KEY = '[Voice Actions]'

export const sendVoiceMessage = (uri) => async (dispatch, getState) => {
    const { token } = getState().user

    try {
        await VoiceUtils.getPresignedUrl(
            uri,
            token,
            (objectKey) => {
                console.log('THIS IS OBJECT KEY OF VOICE', objectKey)
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
            })
    } catch (error) {
        console.log(
            `${DEBUG_KEY}failed upload voice with error:`,
            error.message
        )
    }
}
