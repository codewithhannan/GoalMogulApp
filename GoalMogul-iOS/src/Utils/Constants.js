import Constants from 'expo-constants';
import { Dimensions, Platform } from 'react-native';

const { height } = Dimensions.get('window');

export const DEVICE_STANDARD_HEIGHTS = {
    "iphone xs max": 896,
    "iphone xr": 896,
    "iphone": 896, // iphone 11

    "iphone x": 812,
    "iphone xs": 812,

    "iphone 6 plus": 736,
    "iphone 6s plus": 736,
    "iphone 7 plus": 736,
    "iphone 8 plus": 736,

    "iphone 6": 667,
    "iphone 6s": 667,
    "iphone 7": 667,
    "iphone 8": 667,
};

export const IPHONE_MODELS_2 = ['iphone 7 plus', 'iphone x', 'iphone xs', 'iphone xr', 'simulator', 'iphone' /* 11 */];
export const IPHONE_MODELS = ['iphone 7', 'iphone 6', 'iphone 6s',
    'iphone 5', 'iphone 6 plus', 'iphone 4', 'iphone 5s'];

export const DEVICE_MODEL = Constants.platform && Constants.platform.ios && Constants.platform.ios.model
    ? Constants.platform.ios.model.toLowerCase() : "iphone 7";

// Simple function to identify if iphone is on zoomed mode
export const IS_ZOOMED = (
    Platform.OS === 'ios' && // This is iphone
    (IPHONE_MODELS.includes(DEVICE_MODEL) || IPHONE_MODELS_2.includes(DEVICE_MODEL)) && // This is one of the recognized phone
    DEVICE_STANDARD_HEIGHTS[DEVICE_MODEL] > height // Actual view height is smaller
);

// Base url for image location. Should concat with the mediaRef or image to form the 
// full image location
export const IMAGE_BASE_URL = 'https://s3.us-west-2.amazonaws.com/goalmogul-v1/';
export const BUG_REPORT_URL = 'https://goo.gl/forms/zfhrCXeLPz3QCKi03';
export const RESET_PASSWORD_URL = 'https://web.goalmogul.com/password-reset';
export const PRIVACY_POLICY_URL = 'https://web.goalmogul.com/privacy';

const expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
export const URL_REGEX = new RegExp(expression);

export const SORT_BY_OPTIONS = [
    {
        text: 'Date Created',
        value: 'created'
    },
    {
        text: 'Last Updated',
        value: 'updated'
    },
    {
        text: 'Date Shared',
        value: 'shared'
    },
    {
        text: 'Priority',
        value: 'priority'
    },
];
      
export const CATEGORY_OPTIONS = [
    {
        text: 'All',
        value: 'All'
    },
    {
        text: 'General',
        value: 'General'
    },
    {
        text: 'Learning/Education',
        value: 'Learning/Education'
    },
    {
        text: 'Career/Business',
        value: 'Career/Business'
    },
    {
        text: 'Financial',
        value: 'Financial'
    },
    {
        text: 'Spiritual',
        value: 'Spiritual'
    },
    {
        text: 'Family/Personal',
        value: 'Family/Personal'
    },
    {
        text: 'Physical',
        value: 'Physical'
    },
    {
        text: 'Charity/Philanthropy',
        value: 'Charity/Philanthropy'
    },
    {
        text: 'Travel',
        value: 'Travel'
    },
    {
        text: 'Things',
        value: 'Things'
    }
];

/** Caret related constants */
export const CARET_OPTION_NOTIFICATION_SUBSCRIBE = 'Follow';
export const CARET_OPTION_NOTIFICATION_UNSUBSCRIBE = 'Unfollow';

export const GROUP_CHAT_DEFAULT_ICON_URL = 'https://i.imgur.com/dP71It0.png';

export const SHOW_SEE_MORE_TEXT_LENGTH = 110;

export const EMPTY_GOAL = {
    _id: '',
    category: 'General',
    details: {
        tags: [],
        text: ''
    },
    lastUpdated: '',
    needs: [],
    owner: {
        _id: '',
        name: '',
        profile: {
            elevatorPitch: '',
            occupation: '',
            pointsEarned: 0,
            views: 0,
        },
    },
    priority: 0,
    privacy: 'friends',
    steps: [],
    title: '',
};

export const EMPTY_POST =  {
	lastUpdated: '',
	owner: {
		_id: '',
        name: '',
        profile: {
            elevatorPitch: '',
            occupation: '',
            pointsEarned: 0,
            views: 0,
        },
	},
	privacy: "public",
	content: {
		text: '',
		tags: [],
		links: []
	},
	postType: "General",
};
