import { StyleSheet, Dimensions } from 'react-native';
import { GM_FONT_2, GM_FONT_FAMILY_1, GM_FONT_1, GM_FONT_FAMILY_2 } from '../../../styles';


const window = Dimensions.get('window');
/*
Styling for Registration workflow
*/
export default StyleSheet.create({
    dividerStyle: {
        height: 1,
        width: (window.width * 5) / 7,
        borderColor: '#dcdcdc',
        borderBottomWidth: 1,
        alignSelf: 'center'
    },
    headerTextStyle: {
        fontSize: 14,
        color: '#646464',
        marginLeft: 10,
        marginRight: 10,
        maxWidth: (window.width * 5) / 7,
        alignSelf: 'center'
    },
    subHeaderTextStyle: {
        fontSize: GM_FONT_2,
        fontWeight: 'bold',
        color: '#333',
        fontFamily: GM_FONT_FAMILY_1,
        marginBottom: 16,
        letterSpacing: 0.3
    },
    detailTextStyle: {
        fontSize: GM_FONT_1,
        fontFamily: GM_FONT_FAMILY_2,
        color: '#3B414B',
        fontWeight: '500',
    }
});
