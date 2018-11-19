import { StyleSheet } from 'react-native';

const Styles = StyleSheet.create({
  container: {
    borderRadius: 5,
  },
  imageStyle: {
    height: 48,
    width: 48,
    borderRadius: 5,
    alignSelf: 'center'
  },
  buttonTextStyle: {
    color: '#46C8F5',
    fontSize: 11,
    fontWeight: '700',
    paddingLeft: 1,
    padding: 0,
    alignSelf: 'center'
  },
  buttonContainerStyle: {
    marginLeft: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  buttonStyle: {
    width: 70,
    height: 26,
    borderWidth: 1,
    borderColor: '#46C8F5',
    borderRadius: 13,
  },
});

export default Styles;
