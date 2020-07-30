/** @format */

import { getBottomSpace } from 'react-native-iphone-x-helper'
import {
    FONT_FAMILY_1,
    FONT_FAMILY_2,
    LETTER_SPACING_TITLE,
    LETTER_SPACING,
    FONT_FAMILY_3,
    GM_BLUE,
} from '..'

export const getCardBottomMargin = () => {
    return getBottomSpace()
}

export default OnboardingStyles = {
    container: {
        page: {
            backgroundColor: 'white',
            flex: 1,
            paddingBottom: getCardBottomMargin(),
        },
        card: {
            backgroundColor: 'white',
            flexGrow: 1,
            padding: 16,
        },
    },
    input: {
        text: {
            fontSize: 16,
            lineHeight: 20,
            letterSpacing: LETTER_SPACING,
            backgroundColor: 'white',
        },
        title: {
            fontSize: 14,
            lineHeight: 14,
            fontFamily: FONT_FAMILY_2,
            letterSpacing: LETTER_SPACING,
        },
    },
    text: {
        // onboardingTitleTextStyle
        title: {
            fontSize: 24,
            lineHeight: 28,
            fontFamily: FONT_FAMILY_1,
            textAlign: 'center',
            letterSpacing: LETTER_SPACING_TITLE,
        },
        subTitle: {
            fontSize: 18,
            lineHeight: 18,
            color: '#BDBDBD',
            fontFamily: FONT_FAMILY_1,
        },
        subTitle_2: {
            fontFamily: FONT_FAMILY_2,
            fontSize: 16,
            color: '#333',
            letterSpacing: LETTER_SPACING_TITLE,
        },
        // onboardingPharagraphTextStyle
        paragraph: {
            fontSize: 18,
            lineHeight: 24,
            fontFamily: FONT_FAMILY_2,
            color: '#333',
        },
    },
    button: {
        GM_BLUE_BG_WHITE_BOLD_TEXT: {
            containerStyle: {
                height: 45,
                width: '100%',
                backgroundColor: GM_BLUE,
                borderRadius: 3,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
            },
            textStyle: {
                fontSize: 18,
                fontWeight: 'bold',
                lineHeight: 24,
                color: 'white',
                fontFamily: FONT_FAMILY_3,
                letterSpacing: LETTER_SPACING_TITLE,
            },
        },
        GM_WHITE_BG_BLUE_TEXT: {
            containerStyle: {
                height: 45,
                width: '100%',
                backgroundColor: 'white',
                borderRadius: 3,
                alignItems: 'center',
                justifyContent: 'center',
                borderColor: '#BDBDBD',
                borderWidth: 1,
                borderRadius: 5,
            },
            textStyle: {
                fontSize: 18,
                lineHeight: 24,
                color: GM_BLUE,
                fontFamily: FONT_FAMILY_3,
                letterSpacing: LETTER_SPACING_TITLE,
            },
        },
        GM_WHITE_BG_GRAY_TEXT: {
            containerStyle: {
                height: 45,
                width: '100%',
                borderRadius: 5,
                backgroundColor: 'white',
                alignItems: 'center',
                justifyContent: 'center',
            },
            textStyle: {
                fontSize: 18,
                lineHeight: 24,
                color: '#828282',
                fontFamily: FONT_FAMILY_3,
                letterSpacing: LETTER_SPACING_TITLE,
            },
        },
    },
}
