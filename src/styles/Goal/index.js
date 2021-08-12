/** @format */

import { UI_SCALE } from '..'
import { color, text } from '../basic'

export const PRIORTY_PILL_STYLES = [
    // 1
    {
        color: color.GM_MID_GREY,
        backgroundColor: color.GM_LIGHT_GRAY,
        materialCommunityIconName: 'arrow-down-circle',
    },
    // 2
    {
        color: color.GM_MID_GREY,
        backgroundColor: color.GM_LIGHT_GRAY,
        materialCommunityIconName: 'arrow-down-circle',
    },
    // 3
    {
        color: color.GM_MID_GREY,
        backgroundColor: color.GM_LIGHT_GRAY,
        materialCommunityIconName: 'arrow-down-circle',
    },
    // 4
    {
        color: '#2F80ED',
        backgroundColor: '#D9F4FF',
        materialCommunityIconName: 'do-not-disturb',
    },
    // 5
    {
        color: '#2F80ED',
        backgroundColor: '#D9F4FF',
        materialCommunityIconName: 'do-not-disturb',
    },
    // 6
    {
        color: '#8D6708',
        backgroundColor: '#FFF7DE',
        materialCommunityIconName: 'arrow-up-circle',
    },
    // 7
    {
        color: '#8D6708',
        backgroundColor: '#FFF7DE',
        materialCommunityIconName: 'arrow-up-circle',
    },
    // 8
    {
        color: '#914F15',
        backgroundColor: '#FFECD0',
        materialCommunityIconName: 'alert-circle',
    },
    // 9
    {
        color: '#AA0000',
        backgroundColor: '#FFE7DE',
        materialCommunityIconName: 'alert-circle',
    },
    // 10
    {
        color: '#AA0000',
        backgroundColor: '#FFE7DE',
        materialCommunityIconName: 'fire',
    },
]

export const GOALS_STYLE = {
    commonPillIcon: {
        height: 12 * UI_SCALE,
        width: 12 * UI_SCALE,
        tintColor: color.TEXT_COLOR.DARK,
    },
    commonPillText: {
        fontFamily: text.FONT_FAMILY.SEMI_BOLD,
        fontSize: 9 * UI_SCALE,
        color: color.TEXT_COLOR.DARK,
        marginLeft: 3,
    },
    commonPillContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: color.GM_LIGHT_GRAY,
        borderRadius: 100,
    },
    privacyPillWidth: 82 * UI_SCALE,
    priorityPillWidth: 40 * UI_SCALE,
}

export const TABBAR_HEIGHT = 50 * UI_SCALE
