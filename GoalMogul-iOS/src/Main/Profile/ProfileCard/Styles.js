import { StyleSheet, Dimensions } from 'react-native';


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
    fontSize: 12,
    color: '#646464',
    fontStyle: 'italic',
    marginBottom: 2
  },
  detailTextStyle: {
    fontSize: 14,
    // color: '#646464',
    color: '#333'
  }
});
