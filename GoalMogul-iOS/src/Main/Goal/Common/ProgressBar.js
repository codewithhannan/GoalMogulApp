import React from 'react';
import { Text, View, Image } from 'react-native';

/* Icon */
import Bar from '../../../asset/utils/progressBar.png';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatDate = (date) => `${months[(date !== undefined ? date : new Date()).getMonth() - 1]} ` +
  `${(date || new Date()).getFullYear()}`;


const ProgressBar = (props) => {
  const { startTime, endTime } = props;

  const startTimeText = startTime instanceof Date ? formatDate(startTime) : startTime;
  const endTimeText = endTime instanceof Date ? formatDate(endTime) : endTime;

  return (
    <View style={styles.containerStyle}>
      <Text style={styles.textStyle}>
        {startTimeText}
      </Text>
      <Image source={Bar} style={styles.imageStyle} />
      <Text style={styles.textStyle}>
        {endTimeText}
      </Text>
    </View>
  );
};

const styles = {
  containerStyle: {
    flexDirection: 'row',
    marginTop: 2,
    marginBottom: 6
  },
  imageStyle: {
    flex: 6
  },
  textStyle: {
    color: '#7b7b7b',
    fontSize: 8.5,
    alignSelf: 'center'
  }
};

//TODO: validate prop types
export default ProgressBar;
