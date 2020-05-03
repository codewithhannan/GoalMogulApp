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
export const GM_FONT_SIZE = {
  FONT_1: 14,
  FONT_2: 16,
  FONT_3: 18,
  FONT_3_5: 20,
  FONT_4: 24
};

export const GM_FONT_LINE_HEIGHT = {
  FONT_1: 14,
  FONT_2: 16,
  FONT_3: 18,
  FONT_3_5: 20,
  FONT_4: 24
};

export const GM_FONT_FAMILY = {
  GOTHAM_BOLD: "gotham-pro-bold",
  GOTHAM: "gotham-pro"
};

// Button style
export const BUTTON_STYLE = {
  GM_BLUE_BG_WHITE_BOLD_TEXT: {
    containerStyle: {
      height: 45,
      width: "100%",  
      backgroundColor: GM_BLUE,
      borderRadius: 3,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 5,
    },
    textStyle: {
      fontSize: GM_FONT_SIZE.FONT_3,
      fontWeight: "bold",
      lineHeight: GM_FONT_LINE_HEIGHT.FONT_3,
      color: "white",
      fontFamily: GM_FONT_FAMILY.GOTHAM_BOLD
    }
  },
  GM_WHITE_BG_BLUE_TEXT: {
    containerStyle: {
      height: 45,
      width: "100%",  
      backgroundColor: "white",
      borderRadius: 3,
      alignItems: "center",
      justifyContent: "center",
      borderColor: "#BDBDBD",
      borderWidth: 1,
      borderRadius: 5,
    },
    textStyle: {
      fontSize: GM_FONT_SIZE.FONT_2,
      lineHeight: GM_FONT_LINE_HEIGHT.FONT_3,
      color: GM_BLUE,
      fontFamily: GM_FONT_FAMILY.GOTHAM,
      fontWeight: "500"
    }
  }
};

// Text style
export const TEXT_STYLE = {
  onboardingTitleTextStyle: {
    fontSize: GM_FONT_SIZE.FONT_4, lineHeight: GM_FONT_LINE_HEIGHT.FONT_4,
    fontFamily: GM_FONT_FAMILY.GOTHAM_BOLD,
    textAlign: "center"
  },
  // Paragraph text style in an
  onboardingPharagraphTextStyle: {
    fontSize: GM_FONT_SIZE.FONT_3,
    lineHeight: GM_FONT_LINE_HEIGHT.FONT_4,
    fontFamily: GM_FONT_FAMILY.GOTHAM,
    fontWeight: "500",
    textAlign: "center"
  }
};

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

export const shadowStyle = {
    width: '100%',
    height: 5,
    backgroundColor: '#F2F2F2'
}
