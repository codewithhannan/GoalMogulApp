/** @format */

import VoiceUtils from '../Utils/VoiceUtils'

const DEBUG_KEY = '[Voice Actions]'

export const sendVoiceMessage = (uri) => async (dispatch, getState) => {
    const { token } = getState().user

    try {
        VoiceUtils.getPresignedUrl(
            uri,
            token,
            (objectKey) => {
                console.log('THIS IS OBJECT KEY OF VOICE', objectKey)
            },
            'CommentAudio'
        )
    } catch (error) {
        console.log(
            `${DEBUG_KEY}failed upload voice with error:`,
            error.message
        )
    }
}
