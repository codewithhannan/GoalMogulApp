/** @format */

import Constants from 'expo-constants'
import { Dimensions, Platform } from 'react-native'

const { height } = Dimensions.get('window')

export const DEVICE_STANDARD_HEIGHTS = {
    'iphone xs max': 896,
    'iphone xr': 896,
    iphone: 896, // iphone 11

    'iphone x': 812,
    'iphone xs': 812,

    'iphone 6 plus': 736,
    'iphone 6s plus': 736,
    'iphone 7 plus': 736,
    'iphone 8 plus': 736,

    'iphone 6': 667,
    'iphone 6s': 667,
    'iphone 7': 667,
    'iphone 8': 667,
}

export const IPHONE_MODELS_3 = ['iphone 11 pro max']

export const IPHONE_MODELS_2 = [
    'iphone x',
    'iphone xs',
    'iphone xr',
    'iphone 11',
    'iphone 11 pro',
    'simulator',
]
export const IPHONE_MODELS = [
    'iphone' /* se */,
    'iphone 8 plus',
    'iphone 7 plus',
    'iphone 6 plus',
    'iphone 8',
    'iphone 7',
    'iphone 6s',
    'iphone 6',
    'iphone 5',
    'iphone 4',
    'iphone 5s',
]

export const DEVICE_MODEL =
    Constants.platform && Constants.platform.ios && Constants.platform.ios.model
        ? Constants.platform.ios.model.toLowerCase()
        : 'iphone 7'

// 'ios' or 'android'
export const DEVICE_PLATFORM = Platform.OS

export const IS_BIG_IPHONE = IPHONE_MODELS_3.includes(DEVICE_MODEL)

// Simple function to identify if iphone is on zoomed mode
export const IS_ZOOMED =
    Platform.OS === 'ios' && // This is iphone
    (IPHONE_MODELS.includes(DEVICE_MODEL) ||
        IPHONE_MODELS_2.includes(DEVICE_MODEL)) && // This is one of the recognized phone
    DEVICE_STANDARD_HEIGHTS[DEVICE_MODEL] > height // Actual view height is smaller

// Base url for image location. Should concat with the mediaRef or image to form the
// full image location
export const WEB_APP_URL = 'https://share.goalmogul.com'
export const IMAGE_BASE_URL = 'https://s3.us-west-2.amazonaws.com/goalmogul-v1/'
export const BUG_REPORT_URL = 'https://goo.gl/forms/zfhrCXeLPz3QCKi03'
export const RESET_PASSWORD_URL = `https://web.goalmogul.com/password-reset`
export const PRIVACY_POLICY_URL = `${WEB_APP_URL}/privacy`
export const TERMS_OF_SERVICE_URL = `${WEB_APP_URL}/terms`
export const USER_INVITE_URL = `${WEB_APP_URL}/invite/`

const expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi
export const URL_REGEX = new RegExp(expression)

export const MINUTE_IN_MS = 60 * 1000
export const DAY_IN_MS = 24 * 60 * MINUTE_IN_MS

export const SORT_BY_OPTIONS = [
    {
        text: 'Date Created',
        value: 'created',
    },
    {
        text: 'Last Updated',
        value: 'updated',
    },
    {
        text: 'Date Shared',
        value: 'shared',
    },
    {
        text: 'Priority',
        value: 'priority',
    },
]

export const CATEGORY_OPTIONS = [
    {
        text: 'All',
        value: 'All',
    },
    {
        text: 'General',
        value: 'General',
    },
    {
        text: 'Career/Business',
        value: 'Career/Business',
    },
    {
        text: 'Charity/Philanthropy',
        value: 'Charity/Philanthropy',
    },
    {
        text: 'Learning/Mindset',
        value: 'Learning/Education',
    },

    {
        text: 'Financial/Wealth',
        value: 'Financial',
    },
    {
        text: 'Spiritual',
        value: 'Spiritual',
    },
    {
        text: 'Personal/Relationships',
        value: 'Family/Personal',
    },
    {
        text: 'Health/Wellness',
        value: 'Physical',
    },

    {
        text: 'Travel',
        value: 'Travel',
    },
    {
        text: 'Things to Buy',
        value: 'Things',
    },
]

export const PRIVACY_FRIENDS = 'friends'
export const PRIVACY_PUBLIC = 'public'
export const PRIVACY_PRIVATE = 'self'
export const PRIVACY_CLOSEFRIENDS = 'close-friends'
export const PRIVACY_EXCLUDEFRIENDS = 'exclude-friends'
export const PRIVACY_EXCLUDECLOSEFRIENDS = 'exclude-close-friends'
export const PRIVACY_SPECIFICFRIENDS = 'specific-friends'

export const PRIVACY_OPTIONS = [
    {
        text: 'Friends',
        value: PRIVACY_FRIENDS,
        materialCommunityIconName: 'account-multiple',
    },
    {
        text: 'Close Friends',
        value: PRIVACY_CLOSEFRIENDS,
        materialCommunityIconName: 'heart',
    },
    {
        text: 'Public',
        value: PRIVACY_PUBLIC,
        materialCommunityIconName: 'earth',
    },

    {
        text: 'Only Me',
        value: PRIVACY_PRIVATE,
        materialCommunityIconName: 'lock',
    },
    {
        text: 'Friends',
        value: PRIVACY_EXCLUDEFRIENDS,
        materialCommunityIconName: 'account-multiple',
    },
    {
        text: 'Close Friends',
        value: PRIVACY_EXCLUDECLOSEFRIENDS,
        materialCommunityIconName: 'heart',
    },
    {
        text: 'Specific Friends',
        value: PRIVACY_SPECIFICFRIENDS,
        materialCommunityIconName: 'account-multiple',
    },
]

/** Caret related constants */
export const CARET_OPTION_NOTIFICATION_SUBSCRIBE = 'Follow'
export const CARET_OPTION_NOTIFICATION_UNSUBSCRIBE = 'Unfollow'

export const GROUP_CHAT_DEFAULT_ICON_URL = 'https://i.imgur.com/dP71It0.png'

export const CONTENT_PREVIEW_MAX_NUMBER_OF_LINES = 5

export const EMPTY_GOAL = {
    _id: '',
    category: 'General',
    details: {
        tags: [],
        text: '',
    },
    lastUpdated: '',
    needs: [],
    owner: {
        _id: '',
        name: '',
        profile: {
            elevatorPitch: '',
            occupation: '',
            location: '',
            pointsEarned: 0,
            views: 0,
        },
    },
    priority: 0,
    privacy: 'friends',
    steps: [],
    title: '',
}

export const EMPTY_POST = {
    lastUpdated: '',
    owner: {
        _id: '',
        name: '',
        profile: {
            elevatorPitch: '',
            occupation: '',
            location: '',
            pointsEarned: 0,
            views: 0,
        },
    },
    privacy: 'public',
    content: {
        text: '',
        tags: [],
        links: [],
    },
    postType: 'General',
}
