/** @format */

import { StyleSheet } from 'react-native'

export default StyleSheet.create({
    titleSectionStyle: {
        marginLeft: 15,
        marginRight: 15,
        borderBottomWidth: 1,
        borderColor: '#b8bec6',
    },
    titleTextStyle: {
        fontSize: 18,
        paddingTop: 18,
        paddingBottom: 18,
    },
    detailCardSection: {
        flexDirection: 'column',
        paddingTop: 20,
        marginLeft: 15,
        marginRight: 15,
        borderBottomWidth: 1,
        borderColor: '#b8bec6',
    },
    detailTextStyle: {
        fontSize: 14,
        fontWeight: '700',
        paddingBottom: 7,
        maxWidth: 250,
    },
    statusTextStyle: {
        fontSize: 13,
        color: '#b8bec6',
        paddingBottom: 10,
    },
    actionTextStyle: {
        fontSize: 13,
        color: '#17B3EC',
        paddingBottom: 20,
        fontWeight: '700',
    },
    iconContainerStyle: {
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        right: 0,
        top: 12,
    },
    editIconStyle: {
        width: 20,
        height: 20,
    },
    buttonContainerStyle: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 8,
        marginLeft: 18,
        marginRight: 18,
        height: 41,
        justifyContent: 'center',
        backgroundColor: '#17B3EC',
    },
    buttonTextStyle: {
        fontSize: 15,
        fontWeight: '800',
        color: '#ffffff',
        alignSelf: 'center',
    },
})
