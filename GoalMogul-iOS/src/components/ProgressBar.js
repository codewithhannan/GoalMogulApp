import React from 'react';
import { Text, View, Image } from 'react-native';

/* Icon */
import Bar from '../asset/utils/progressBar.png';

const ProgressBar = (props) => {
  return (
    <View style={styles.containerStyle}>
      <Text style={styles.textStyle}>
        March 11 {props.startTime}
      </Text>
      <Image source={Bar} style={styles.imageStyle} />
      <Text style={styles.textStyle}>
        Nov 12 {props.endTime}
      </Text>
    </View>
  );
};

const styles = {
  containerStyle: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 14
  },
  imageStyle: {
    flex: 6
  },
  textStyle: {
    flex: 1,
    color: '#7b7b7b',
    fontSize: 10
  }
};

//TODO: validate prop types
export default ProgressBar;
