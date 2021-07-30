/** @format */

import CLAP_LOTTIE from '../../../asset/emojis/clap.json'
import HEART_LOTTIE from '../../../asset/emojis/HeartWithHand.json'
import SALUTE_LOTTIE from '../../../asset/emojis/salute.json'
import METOO_LOTTIE from '../../../asset/emojis/metoo.json'
import WOO_LOTTIE from '../../../asset/emojis/ohh.json'
import ROCKON_LOTTIE from '../../../asset/emojis/rockon.json'

import LoveOutlineIcon from '../../../asset/utils/love-outline.png'
import LoveIcon from '../../../asset/icons/Like.png'
import Clap from '../../../asset/icons/clap.png'
import Hearthand from '../../../asset/icons/handheart.png'
import Wow from '../../../asset/icons/wow.png'
import Salute from '../../../asset/icons/salute.png'
import Rockon from '../../../asset/icons/rockon.png'
import Metoo from '../../../asset/icons/metoo.png'

import { color } from '../../../styles/basic'

export const LOTTIE_DATA = [
    {
        name: ` Love`,
        lottieSource: HEART_LOTTIE,
        value: 'Hearthand',
        title: 'Love',
    },
    {
        name: 'Applause',
        lottieSource: CLAP_LOTTIE,
        value: 'Clap',
        title: 'Applause',
    },
    {
        name: 'Me Too!',
        lottieSource: METOO_LOTTIE,
        value: 'Metoo',
        title: 'Me Too!',
    },
    {
        name: '    Rock-on',
        lottieSource: ROCKON_LOTTIE,
        value: 'Rockon',
        title: 'Rock-on',
    },
    {
        name: '    Salute',
        lottieSource: SALUTE_LOTTIE,
        value: 'Salute',
        title: 'Salute',
    },
    {
        name: 'Wow',
        lottieSource: WOO_LOTTIE,
        value: 'Wow',
        title: 'Wow',
    },
]

export const renderTextIcon = (likeType) => {
    switch (likeType) {
        case 'Applause':
            return Clap
        case 'Thumbsup':
            return LoveIcon
        case 'Like':
            return LoveIcon
        case 'Me Too!':
            return Metoo
        case 'Love':
            return Hearthand
        case 'Rock-on':
            return Rockon
        case 'Salute':
            return Salute
        case 'Wow':
            return Wow
        default:
            return LoveOutlineIcon
    }
}

export const renderUnitText = (unitText) => {
    switch (unitText) {
        case 'Clap':
            return 'Applause'
        case 'Love':
            return 'Like'
        case 'Metoo':
            return 'Me Too!'
        case 'Hearthand':
            return 'Love'
        case 'Rockon':
            return 'Rock-on'
        case 'Salute':
            return 'Salute'
        case 'Wow':
            return 'Wow'
        case 'Thumbsup':
            return 'Like'
        default:
            return 'Like'
    }
}

export const renderTextStyle = (unitText) => {
    switch (unitText) {
        case 'Applause':
            return '#EBA823'
        case 'Love':
            return color.GM_RED
        case 'Me Too!':
            return '#EBA823'
        case 'Hearthand':
            return color.GM_RED
        case 'Rock-on':
            return '#EBA823'
        case 'Salute':
            return '#EBA823'
        case 'Wow':
            return '#EBA823'
        default:
            return color.GM_RED
    }
}

export const updateLikeIcon = (reactions, liketype) => {
    // console.log('THIS IS REACTIONSSS', reactions)
    // console.log('THIS IS LIKE TYPEEE', liketype)

    const filteredReactions = reactions.find((reaction) => {
        return reaction.type == liketype
    })
    filteredReactions.count += 1
    // console.log('THIS IS FILTEREDDD REACTIONNN 1', filteredReactions.count)

    // console.log('THIS IS FILTEREDDD REACTIONNN', filteredReactions)
}
