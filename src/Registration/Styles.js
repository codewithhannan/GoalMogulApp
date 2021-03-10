/** @format */

import { Dimensions, StyleSheet } from 'react-native'

const window = Dimensions.get('window')
/*
Styling for Registration workflow
*/
export default StyleSheet.create({
    containerStyle: {
        flex: 1,
        backgroundColor: '#ffffff',
        // display: 'flex',
    },
    bodyContainerStyle: {
        flex: 1,
        display: 'flex',
        backgroundColor: '#ffffff',
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.3,
    },
    titleTextStyle: {
        fontSize: 25,
        fontWeight: '700',
        color: '#646464',
        alignSelf: 'center',
        marginTop: 20,
        marginBottom: 18,
    },
    textInputStyle: {
        fontSize: 15,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 16,
        paddingBottom: 16,
        width: window - 36,
        borderBottomWidth: 2,
        borderColor: '#eaeaea',
    },
    explanationTextStyle: {
        marginTop: 23,
        marginBottom: 14,
        alignSelf: 'center',
        color: '#858585',
        fontSize: 15,
    },
    contactSyncPromptingText: {
        alignSelf: 'center',
        color: '#858585',
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 5,
    },
    contactNoteText: {
        marginTop: 5,
        marginBottom: 14,
        alignSelf: 'center',
        color: '#858585',
        fontSize: 13,
    },
    errorStyle: {
        color: '#ff0033',
        justifyContent: 'center',
        marginBottom: 4,
        alignSelf: 'center',
    },
})
