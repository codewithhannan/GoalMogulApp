/**
 * This is a central hub that defines the global usage of certain color
 *
 * @format
 */
import { Platform } from 'react-native'
import Constants from 'expo-constants'
import { IPHONE_MODELS, DEVICE_MODEL } from '../Utils/Constants'

/**
 * Following is the new blue for V2
 *
 * @link https://www.figma.com/file/T1ZgWm5TKDA4gtBS5gSjtc/GoalMogul-App?node-id=1%3A626
 */

export const IS_SMALL_PHONE =
    (Platform.OS === 'ios' && IPHONE_MODELS.includes(DEVICE_MODEL)) ||
    Platform.OS === 'android'
export const UI_SCALE =
    Constants.platform.ios &&
    Constants.platform.ios.userInterfaceIdiom === 'tablet'
        ? 1.3
        : 1

/**
 * DEPRECATED use use default styles
 */
import { color, text } from './basic'
export const BUTTON_STYLE = {
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
            fontSize: text.TEXT_FONT_SIZE.FONT_3,
            fontWeight: 'bold',
            lineHeight: text.TEXT_LINE_HEIGHT.FONT_4,
            color: 'white',
            fontFamily: text.FONT_FAMILY.SEMI_BOLD,
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
            fontSize: text.TEXT_FONT_SIZE.FONT_3,
            lineHeight: text.TEXT_LINE_HEIGHT.FONT_4,
            color: color.GM_BLUE,
            fontFamily: text.FONT_FAMILY.SEMI_BOLD,
        },
    },
    /*
     * Added 11 May 20 by Yanxiang Lan.
     * For use as secondary button in onboarding v2
     */
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
            fontSize: text.TEXT_FONT_SIZE.FONT_3,
            lineHeight: text.TEXT_LINE_HEIGHT.FONT_4,
            color: '#828282',
            fontFamily: text.FONT_FAMILY.SEMI_BOLD,
        },
    },
}

// Text style
export const TEXT_STYLE = {
    onboardingTitleTextStyle: {
        fontSize: text.TEXT_FONT_SIZE.FONT_4,
        lineHeight: text.TEXT_LINE_HEIGHT.FONT_4,
        fontFamily: text.FONT_FAMILY.BOLD,
        textAlign: 'center',
    },
    // Paragraph text style in an
    onboardingPharagraphTextStyle: {
        fontSize: text.TEXT_FONT_SIZE.FONT_3,
        lineHeight: text.TEXT_LINE_HEIGHT.FONT_4,
        fontFamily: text.FONT_FAMILY.REGULAR,
        fontWeight: '500',
        textAlign: 'center',
    },
}

export const imagePreviewContainerStyle = {
    shadowColor: '#ddd',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.8,
    shadowRadius: 1.2,
    elevation: 1,
}

export const cardBoxBorder = {
    borderTopWidth: 0.5,
    borderTopColor: '#eaeaea',
}

export const cardBoxShadow = {
    shadowColor: '#ddd',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 1,
}

export const tutorial = {
    containerStyle: {
        alignItems: 'center',
    },
    subTitleTextStyle: {
        fontSize: 21,
        fontWeight: '800',
        color: 'white',
        fontFamily: 'SFProDisplay-Bold',
        lineHeight: 23,
    },
    textStyle: {
        fontSize: 15,
        fontWeight: '600',
        color: 'white',
        fontFamily: 'SFProDisplay-Regular',
        lineHeight: 18,
    },
    imageShadow: {
        shadowColor: '#4c4c4c',
        shadowOffset: { width: 0, height: 1.5 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 1,
    },
}

export const modalContainerStyle = {
    backgroundColor: color.GM_BACKGROUND,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
}

export const modalCancelIconContainerStyle = {
    height: 30,
    width: 30,
    backgroundColor: 'rgb(217,40,40)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
}

export const modalCancelIconStyle = {
    height: 14,
    width: 14,
    tintColor: 'white',
}

export const modalHeaderBadgeShadow = {
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
}

// button bottom sheet height
export const getButtonBottomSheetHeight = (numOptions) =>
    Platform.select({
        ios: numOptions * 48 + 25,
        android: numOptions * 60 + 35, // additional height for the option
    })
