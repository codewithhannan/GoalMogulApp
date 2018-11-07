import React from 'react';
import { Text, View, Image } from 'react-native';

/* Icon */
import Bar from '../../../asset/utils/progressBar.png';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatDate = (date) => {
  const month = months[(date || new Date()).getMonth()];
  const year = (date || new Date()).getFullYear();
  return `${month} ${year}`;
};


const ProgressBar = (props) => {
  const { startTime, endTime } = props;

  const startTimeText = startTime instanceof Date
    ? formatDate(startTime)
    : formatDate(new Date(startTime));
  const endTimeText = endTime instanceof Date
    ? formatDate(endTime)
    : formatDate(new Date(endTime));

  return (
    <View style={styles.containerStyle}>
      <Text style={styles.textStyle}>
        {startTimeText === 'undefined NaN' ? 'Jan 2018' : startTimeText}
      </Text>
      <Image source={Bar} style={styles.imageStyle} />
      <Text style={styles.textStyle}>
        {endTimeText === 'undefined NaN' ? 'Aug 2019' : endTimeText}
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
    flex: 6,
    marginLeft: 2,
    marginRight: 2
  },
  textStyle: {
    color: '#7b7b7b',
    fontSize: 8.5,
    alignSelf: 'center'
  }
};

//TODO: validate prop types
export default ProgressBar;
