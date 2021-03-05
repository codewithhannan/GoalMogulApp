/** @format */

import _ from 'lodash'

const INITIAL_STATE = {
    chatCount: undefined,
}

export const TAB_ICON_UPDATE_CHAT_COUNT = 'tab_icon_update_chat_count'

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case TAB_ICON_UPDATE_CHAT_COUNT:
            let newState = _.cloneDeep(state)
            return _.set(newState, 'chatCount', action.payload)
        default:
            return { ...state }
    }
}
