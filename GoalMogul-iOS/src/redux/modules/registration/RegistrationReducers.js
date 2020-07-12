/**
 * This file is created during GM V2 implementation
 *
 * @format
 */
import Icons from '../../../asset/base64/Onboarding'

export const REGISTRATION_TEXT_CHANGE = 'registration_text_change'
export const REGISTRATION_TARGET_SELECTION = 'registration_target_selection'
export const REGISTRATION_USER_TARGETS = [
    {
        title: 'Finding help with planning or setting goals',
        selected: false,
    },
    {
        title: 'Getting reminders for my goals',
        selected: false,
    },
    {
        title: 'Finding motivation and inspiration',
        selected: false,
    },
    {
        title:
            'Participating in live chat rooms to talk about goals & achievement',
        selected: false,
    },
    {
        title: "Finding out what my friends' goals are in life",
        selected: false,
    },
    {
        title: 'Other',
        selected: false,
        extra: '',
    },
]
export const REGISTRATION_TRIBE_FETCH = 'registration_tribe_fetch'
export const REGISTRATION_TRIBE_SELECT = 'registration_tribe_select' // select a tribe to join during onboarding
export const REGISTRATION_USER_INVITE = 'registration_user_invite' // invite user after contact sync find matches
export const REGISTRATION_USER_INVITE_DONE = 'registration_user_invite_done' // invite user after contact sync find matches
export const REGISTRATION_USER_INVITE_FAIL = 'registration_user_invite_fail' // invite user after contact sync find matches

// Fake tribes rendered on network not available
export const REGISTRATION_DEFAULT_TRIBES = [
    {
        _id: 0,
        name: 'Personal Development',
        picture: undefined,
        description: 'This is a really long description',
    },
    {
        _id: 1,
        name: 'Fitness',
        picture: undefined,
    },
    {
        _id: 2,
        name: 'Career',
        picture: undefined,
    },
    {
        _id: 3,
        name: 'Travel',
        picture: undefined,
    },
    {
        _id: 4,
        name: 'Learning',
        picture: undefined,
    },
    {
        _id: 5,
        name: 'Arts',
        picture: undefined,
    },
    {
        _id: 6,
        name: 'Personal Development',
        picture: undefined,
    },
    {
        _id: 7,
        name: 'Personal Development',
        picture: undefined,
    },
]

export const REGISTRATION_COMMUNITY_GUIDELINE = [
    {
        title: "We're a positive, safe & judgement-free community",
        subTitle: '(NO NEGATIVITY AND NO TROLLING)',
        picture: Icons.SafeCommunity,
    },
    {
        title: 'Post goals often & stay committed',
        subTitle: '',
        picture: Icons.StayCommited,
    },
    {
        title: 'Inspire others with supportive comments',
        subTitle: '',
        picture: Icons.InspireOthers,
    },
    {
        title: 'Give & get suggestions, achieve more together!',
        subTitle: '',
        picture: Icons.AchieveTogether,
    },
]

export const REGISTRATION_SYNC_CONTACT_NOTES =
    'Contacts from your address book will be uploaded to GoalMogul on an ongoing ' +
    'basis to help connect you with your friends and personalize content, such as making suggestions for you and others. You can ' +
    'turn off syncing and remove previously uploaded contacts in your settings.'
