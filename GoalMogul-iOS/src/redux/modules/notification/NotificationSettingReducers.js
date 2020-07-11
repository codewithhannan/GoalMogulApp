/**
 * This is reducer for user notification settings. It memerizes that
 *
 * @format
 */

const INITIAL_STATE = {
    notificationToken: undefined,
}

// Successfully subscribe to a type of notification
export const NOTIFICATION_SUBSCRIBE_SUCCESS = 'notification_subscribe_success'

export default (state = INITIAL_STATE, action) => {
    switch (state.type) {
        default:
            return { ...state }
    }
}
