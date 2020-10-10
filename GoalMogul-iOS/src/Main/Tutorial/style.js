/** @format */

import { StyleSheet } from 'react-native'
import { GM_BLUE } from '../../styles/basic/color'

export const STEP_NUMBER_RADIUS = 14
export const STEP_NUMBER_DIAMETER = STEP_NUMBER_RADIUS * 2
export const ZINDEX = 100
export const MARGIN = 13
export const OFFSET_WIDTH = 4
export const ARROW_SIZE = 6

export default style = {
    container: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        zIndex: ZINDEX,
    },
    arrow: {
        position: 'absolute',
        borderColor: 'transparent',
        borderWidth: ARROW_SIZE,
        backgroundColor: '#d1ecf6',
    },
    tooltip: {
        position: 'absolute',
        paddingTop: 15,
        paddingHorizontal: 15,
        paddingBottom: 12,
        backgroundColor: '#d1ecf6',
        borderRadius: 9,
        borderWidth: 0.5,
        borderColor: '#d1ecf6',
        overflow: 'hidden',
    },
    tooltipText: {
        fontSize: 15,
        color: '#038ebf',
        textAlign: 'center',
    },
    tooltipContainer: {
        flex: 1,
    },
    stepNumberContainer: {
        position: 'absolute',
        width: STEP_NUMBER_DIAMETER,
        height: STEP_NUMBER_DIAMETER,
        overflow: 'hidden',
        zIndex: ZINDEX + 1,
    },
    stepNumber: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderRadius: STEP_NUMBER_RADIUS,
        borderColor: '#FFFFFF',
        backgroundColor: '#27ae60',
    },
    stepNumberText: {
        fontSize: 10,
        backgroundColor: 'transparent',
        color: '#FFFFFF',
    },
    button: {
        padding: 8,
        paddingHorizontal: 15,
        borderRadius: 3,
        backgroundColor: GM_BLUE,
    },
    buttonText: {
        color: '#fff',
        fontSize: 12,
    },
    bottomBar: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    overlayRectangle: {
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.2)',
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
    },
    overlayContainer: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
    },
}
