/** @format */
import { getBottomSpace } from 'react-native-iphone-x-helper'
import { text, color } from '../basic'
import { UI_SCALE } from '..'
import { Platform } from 'react-native'

export const getCardBottomOffset = () => {
    return Platform.select({
        ios: getBottomSpace(),
        default: 0,
    })
}

export default OnboardingStyles = {
    container: {
        page: {
            backgroundColor: 'white',
            flex: 1,
        },
        card: {
            backgroundColor: color.GM_CARD_BACKGROUND,
            flexGrow: 1,
            padding: 16,
            justifyContent: 'center',
            alignItems: 'center',
        },
    },
    input: {
        text: {
            fontSize: 16 * UI_SCALE,
            lineHeight: 20,
            letterSpacing: text.LETTER_SPACING.REGULAR,
            backgroundColor: 'white',
        },
        title: {
            fontSize: 14 * UI_SCALE,
            lineHeight: 14,
            fontFamily: text.FONT_FAMILY.REGULAR,
            letterSpacing: text.LETTER_SPACING.REGULAR,
        },
    },
    text: {
        // onboardingTitleTextStyle
        title: {
            fontSize: text.TEXT_FONT_SIZE.FONT_3_5,
            lineHeight: text.TEXT_FONT_SIZE.FONT_4,
            fontFamily: text.FONT_FAMILY.REGULAR,
            textAlign: 'center',
            letterSpacing: text.LETTER_SPACING.WIDE,
        },
        subTitle: {
            fontSize: 18 * UI_SCALE,
            lineHeight: 18,
            color: '#BDBDBD',
            fontFamily: text.FONT_FAMILY.REGULAR,
        },
        subTitle_2: {
            fontFamily: text.FONT_FAMILY.REGULAR,
            fontSize: 16 * UI_SCALE,
            color: color.TEXT_COLOR.DARK,
            letterSpacing: text.LETTER_SPACING.WIDE,
        },
        // onboardingPharagraphTextStyle
        paragraph: {
            fontSize: 18 * UI_SCALE,
            lineHeight: 24,
            fontFamily: text.FONT_FAMILY.REGULAR,
            color: color.TEXT_COLOR.DARK,
        },
    },
    button: {
        GM_BLUE_BG_WHITE_BOLD_TEXT: {
            containerStyle: {
                height: 45,
                width: '100%',
                backgroundColor: color.GM_BLUE,
                borderRadius: 3,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
            },
            textStyle: {
                fontSize: 18 * UI_SCALE,
                fontWeight: 'bold',
                lineHeight: 24,
                color: 'white',
                fontFamily: text.FONT_FAMILY.SEMI_BOLD,
                letterSpacing: text.LETTER_SPACING.WIDE,
            },
        },
        GM_WHITE_BG_BLUE_TEXT: {
            containerStyle: {
                height: 45,
                width: '100%',
                backgroundColor: color.GM_CARD_BACKGROUND,
                borderRadius: 3,
                alignItems: 'center',
                justifyContent: 'center',
                borderColor: '#BDBDBD',
                borderWidth: 1,
                borderRadius: 5,
            },
            textStyle: {
                fontSize: 18 * UI_SCALE,
                lineHeight: 24,
                color: color.GM_BLUE,
                fontFamily: text.FONT_FAMILY.SEMI_BOLD,
                letterSpacing: text.LETTER_SPACING.WIDE,
            },
        },
        GM_WHITE_BG_GRAY_TEXT: {
            containerStyle: {
                height: 45,
                width: '100%',
                borderRadius: 5,
                backgroundColor: color.GM_CARD_BACKGROUND,
                alignItems: 'center',
                justifyContent: 'center',
            },
            textStyle: {
                fontSize: 18 * UI_SCALE,
                lineHeight: 24,
                color: '#828282',
                fontFamily: text.FONT_FAMILY.SEMI_BOLD,
                letterSpacing: text.LETTER_SPACING.WIDE,
            },
        },
    },
}
