/**
 * This file is created during GM V2 implementation
 *
 * @format
 */
import Icons from '../../../asset/base64/Onboarding'
import Tribes from '../../../asset/image/Tribes.png'
import Community1 from '../../../asset/image/Community_1.png'
import Community2 from '../../../asset/image/Community_2.png'
import Community3 from '../../../asset/image/Community_3.png'

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
        title: 'Give and get suggestions',
        subTitle: '',
        picture: Tribes,
    },
    {
        title: 'Inspire others\nwith encouraging comments',
        subTitle: '',
        picture: Community3,
    },
    {
        title: "We're a positive, safe & judgment-free community ",
        subTitle: '(NO NEGATIVITY AND NO TROLLING)',
        picture: Community1,
    },
    {
        title: `Spread H.O.P.E:\nHelp Other People Everyday`,
        subTitle: '',
        picture: Community2,
    },
]

export const REGISTRATION_SYNC_CONTACT_NOTES =
    'Contacts from your address book will be uploaded to GoalMogul to help connect you with your friends and personalize content, such as making suggestions for you and others. Learn more. '
