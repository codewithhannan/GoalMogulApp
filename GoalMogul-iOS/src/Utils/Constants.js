export const IPHONE_MODELS_2 = ['iphone 7 plus', 'iphone x', 'iPhone xs', 'iphone xr'];
export const IPHONE_MODELS = ['iphone 7', 'iphone 6', 
    'iphone 5', 'iphone 6 plus', 'iphone 4', 'iphone 5s'];

// Base url for image location. Should concat with the mediaRef or image to form the 
// full image location
export const IMAGE_BASE_URL = 'https://s3.us-west-2.amazonaws.com/goalmogul-v1/';
export const BUG_REPORT_URL = 'https://goo.gl/forms/zfhrCXeLPz3QCKi03';
export const RESET_PASSWORD_URL = 'https://web.goalmogul.com/password-reset';

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
