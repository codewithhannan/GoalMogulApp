import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

const SettingCard = props => {
  console.log('onpress is: ', props.onPress);
  return (
    <TouchableOpacity onPress={() => props.onPress}>
      <View style={styles.containerStyle}>
        <Text style={styles.titleStyle}>
          {props.title}
        </Text>
        <Text style={styles.explanationTextStyle}>
          {props.explanation}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = {
  containerStyle: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
    marginLeft: 15,
    marginRight: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#b8bec6'
  },
  titleStyle: {
    fontSize: 15,
    fontWeight: '700'
  },
  explanationTextStyle: {
    fontSize: 12,
  }
};

export default SettingCard;
