/** @format */

import MessageStorageService from '../../../services/chat/MessageStorageService'
import { TAB_ICON_UPDATE_CHAT_COUNT } from './TabIconReducers'

const DEBUG_KEY = '[TabIconActions]'

export const updateChatCount = () => (dispatch, getState) => {
    MessageStorageService.getUnreadMessageCount((err, count) => {
        if (err) {
            console.log(`${DEBUG_KEY} Error getting unread message count`, err)
        } else {
            dispatch({
                type: TAB_ICON_UPDATE_CHAT_COUNT,
                payload: count,
            })
        }
    })
}
