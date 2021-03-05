/** @format */

import { StyleSheet, Dimensions } from 'react-native'

const window = Dimensions.get('window')
/*
Styling for Registration workflow
*/
export default StyleSheet.create({
    dividerStyle: {
        height: 1,
        width: (window.width * 5) / 7,
        borderColor: '#dcdcdc',
        borderBottomWidth: 1,
        alignSelf: 'center',
    },
    headerTextStyle: {
        marginLeft: 10,
        marginRight: 10,
        maxWidth: (window.width * 5) / 7,
        alignSelf: 'center',
    },
    subHeaderStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
})
