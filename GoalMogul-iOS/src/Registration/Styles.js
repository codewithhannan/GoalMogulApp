import { StyleSheet } from 'react-native';

/*
Styling for Registration workflow
*/
export default StyleSheet.create({
  containerStyle: {
    flex: 1,
    display: 'flex'
  },
  bodyContainerStyle: {
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
  },
  titleTextStyle: {
    fontSize: 25,
    fontWeight: '700',
    color: '#646464',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 18
  },
  textInputStyle: {
    fontSize: 15,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 16,
    paddingBottom: 16
  },
  explanationTextStyle: {
    marginTop: 23,
    marginBottom: 14,
    alignSelf: 'center',
    color: '#858585',
    fontSize: 15
  }
});
