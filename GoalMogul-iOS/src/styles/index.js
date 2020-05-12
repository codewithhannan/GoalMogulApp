/**
 * This is a central hub that defines the global usage of certain color
 */
export const BACKGROUND_COLOR = 'white';
export const APP_BLUE_BRIGHT = '#17B3EC';
export const APP_BLUE = '#23B7E9';
export const APP_DEEP_BLUE = '#0397CB';

/**
 * Following is the new blue for V2 
 * 
 * @link https://www.figma.com/file/T1ZgWm5TKDA4gtBS5gSjtc/GoalMogul-App?node-id=1%3A626
 */
export const GM_BLUE = "#45C9F6";
export const GM_BLUE_LIGHT = "#9EE6FF";
export const GM_BLUE_LIGHT_LIGHT = "#DEF7FF";
export const GM_DOT_GRAY = "#E0E0E0";

/**
 * Standardized font size for GM V2
 * 
 * @link https://www.figma.com/file/T1ZgWm5TKDA4gtBS5gSjtc/GoalMogul-App?node-id=1%3A626
 */
export const GM_FONT_1 = 14;
export const GM_FONT_2 = 16;
export const GM_FONT_3 = 18;
export const GM_FONT_3_5 = 20;
export const GM_FONT_4 = 24;

export const GM_FONT_FAMILY_1 = 'gotham-pro-bold';
export const GM_FONT_FAMILY_2 = 'gotham-pro';
export const GM_FONT_FAMILY_3 = 'Helvetica';

export const imagePreviewContainerStyle = {
    shadowColor: '#ddd',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.8,
    shadowRadius: 1.2,
    elevation: 1,
};

export const cardBoxBorder = {
    borderTopWidth: 0.5,
    borderTopColor: '#eaeaea'
};

export const cardBoxShadow = {
    shadowColor: '#ddd',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 1,
};

export const tutorial = {
    containerStyle: {
        alignItems: 'center',
    },
    subTitleTextStyle: {
        fontSize: 21,
        fontWeight: '800',
        color: 'white',
        fontFamily: 'gotham-pro-bold',
        lineHeight: 23
    },
    textStyle: {
        fontSize: 15,
        fontWeight: '600',
        color: 'white',
        fontFamily: 'gotham-pro',
        lineHeight: 18
    },
    imageShadow: {
        shadowColor: '#4c4c4c',
        shadowOffset: { width: 0, height: 1.5 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 1,
    }
};

export const modalContainerStyle = {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
};

export const modalCancelIconContainerStyle = {
    height: 30,
    width: 30,
    backgroundColor: 'rgb(217,40,40)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15
};

export const modalCancelIconStyle = {
    height: 14,
    width: 14,
    tintColor: 'white'
};

export const modalHeaderBadgeShadow = {
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
};

const UI_SCALE = 1;
export const TEXT_COLOR_1 = '#333';

export const FONT_FAMILY_1 = 'Avenir';
export const FONT_FAMILY_2 = 'Avenir';
export const FONT_FAMILY_3 = 'Helvetica';

export const DEFAULT_STYLE = {
    // Headers
    titleText_1: {
        fontFamily: FONT_FAMILY_1,
        fontSize: 16 * UI_SCALE,
        color: TEXT_COLOR_1,
        fontWeight: 'bold',
        letterSpacing: 0.3
    },
    titleText_2: {
        fontFamily: FONT_FAMILY_1,
        fontSize: 14 * UI_SCALE,
        fontWeight: 'bold',
        color: TEXT_COLOR_1
    },
    subTitleText_1: {
        fontFamily: FONT_FAMILY_2,
        fontSize: 16 * UI_SCALE,
        fontWeight: '400',
        color: TEXT_COLOR_1,
        letterSpacing: 0.3
    },
    // Normal texts
    normalText_1: {
        fontFamily: FONT_FAMILY_2,
        fontSize: 14 * UI_SCALE,
        color: TEXT_COLOR_1
    },
    // Detailing texts
    smallTitle_1: {
        fontFamily: FONT_FAMILY_1,
        fontSize: 11 * UI_SCALE,
        fontWeight: 'bold',
        color: TEXT_COLOR_1,
        letterSpacing: 0.3
    },
    smallText_1: {
        fontFamily: FONT_FAMILY_2,
        fontSize: 11 * UI_SCALE,
        color: TEXT_COLOR_1
    },
    smallText_2: {
        fontFamily: FONT_FAMILY_2,
        fontSize: 9 * UI_SCALE,
        color: TEXT_COLOR_1
    },
    smallIcon_1: {
        height: 13 * UI_SCALE,
        width: 13 * UI_SCALE
    },
    // Button styles
    buttonText_1: {
        fontFamily: FONT_FAMILY_1,
        fontSize: 14 * UI_SCALE,
        fontWeight: '400',
        color: TEXT_COLOR_1
    },
    buttonIcon_1: {
        height: 24 * UI_SCALE,
        width: 24 * UI_SCALE,
        tintColor: TEXT_COLOR_1
    },
    // Misc
    infoIcon: {
        height: 8 * UI_SCALE,
        width: 8 * UI_SCALE,
        tintColor: TEXT_COLOR_1
    },
    priortyBar: {
        height: 4 * UI_SCALE,
        width: 30 * UI_SCALE,
        marginTop: 4 * UI_SCALE
    },
    profileImage_1: {
        height: 60 * UI_SCALE,
        width: 60 * UI_SCALE,
        borderRadius: 30 * UI_SCALE
    },
    profileImage_2: {
        height: 20 * UI_SCALE,
        width: 20 * UI_SCALE,
        margin: 20 * UI_SCALE
    },
    shadow: {
        width: '100%',
        height: 5,
        backgroundColor: '#F2F2F2'
    }
}
