/**
 * Utils for Users related functions
 *
 * @format
 */

import _ from 'lodash'
import {
    INITIAL_USER_PAGE,
    INITIAL_MUTUAL_FRIENDS,
    INITIAL_FRIENDSHIP,
} from '../../../src/redux/modules/User/Users'

export const DEFAULT_TEST_USERS_INITIAL_STATE = {
    userId: {
        friendship: { ...INITIAL_FRIENDSHIP },
        mutualFriends: { ...INITIAL_MUTUAL_FRIENDS },
        pageId: { ...INITIAL_USER_PAGE }, // default pageId is just string 'pageId'
        loading: false,
        referece: ['test_default_user_pageId'],
    },
}

// Default test user reducer initial state
export const DEFAULT_TEST_USER_INTIAL_STATE = {
    userId: 'userId', // Used in default users
    token: 'token',
    // Detail user info
    user: {
        name: 'tester',
        profile: {
            image: undefined,
        },
        email: {},
        chatNotificationPreferences: undefined,
    },
    profile: {},
    updatingPassword: false,
    updateAccountSetting: false, // Boolean indicator for account setting is being updated
}
