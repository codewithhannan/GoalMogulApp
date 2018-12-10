import React from 'react';
import { Text, View, Image, ImageBackground } from 'react-native';

/* Icon */
import Bar from '../../../asset/utils/progressBar.png';
import OpacBar from '../../../asset/utils/progressBarOpac.png';
import CounterBar from '../../../asset/utils/progressBarCounter.png';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const PROGRESSBAR_COLOR = '#F7EB37';
const formatDate = (date) => {
  const month = months[(date || new Date()).getMonth()];
  const year = (date || new Date()).getFullYear();
  return `${month} ${year}`;
};

const ProgressBar = (props) => {
  const { startTime, endTime, steps, needs, goalRef } = props;
  let progressPercentage = getProgress(steps || [], needs || []);
  if (goalRef && goalRef.isCompleted) {
    progressPercentage = 1;
  }

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
      {/* <Image source={Bar} style={styles.imageStyle} /> */}
      {renderProgressBar(progressPercentage)}
      <Text style={styles.textStyle}>
        {endTimeText === 'undefined NaN' ? 'Aug 2019' : endTimeText}
      </Text>
    </View>
  );
};

const renderProgressBar = (percentage) => {
  const colorFlex = Math.round(percentage * 10);
  const layerFlex = Math.round((1 - percentage) * 10);
  // console.log(`percentage is: ${percentage}, colorFlex is: ${colorFlex}, layerFlex is: ${layerFlex}`);
  return (
    <View style={{ ...styles.imageStyle, flexDirection: 'row', justifyContent: 'center' }}>
      <Image
        source={OpacBar}
        style={{
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          zIndex: 2,
          position: 'absolute'
        }}
      />
      <View
        style={{
          backgroundColor: PROGRESSBAR_COLOR,
          flex: 1,
          height: 8
        }}
      />
      <View
        style={{
          height: 8,
          // flex: 1,
          zIndex: 1,
          flexDirection: 'row',
          position: 'absolute',
          left: 0,
          right: 0

        }}
      >
        <View style={{ flex: colorFlex }} />
        <View style={{ flex: layerFlex, flexDirection: 'row' }}>
          <Image source={CounterBar} style={{ tintColor: '#f2f2f2', height: 8 }} />
          <View style={{ flex: 1, backgroundColor: '#f2f2f2' }} />
        </View>
      </View>
    </View>
  );
};

/**
 * Return the percentage of progress
 */
const getProgress = (steps, needs) => {
  let stepsCompleteCount = 0;
  steps.forEach(step => {
    if (step.isCompleted) {
      ++stepsCompleteCount;
    }
  });

  let needsCompleteCount = 0;
  needs.forEach((need) => {
    if (need.isCompleted) ++needsCompleteCount;
  });
  // console.log(`steps count is: ${stepsCompleteCount} out of total: ${steps.length}`);
  // console.log(`needs count is: ${needsCompleteCount} out of total: ${needs.length}`);

  const totalCount = steps.length + needs.length;
  // console.log('total count is: ', totalCount);
  return totalCount === 0 ? 1 : ((needsCompleteCount + stepsCompleteCount) / totalCount);
};

const styles = {
  containerStyle: {
    flexDirection: 'row',
    marginTop: 2,
    marginBottom: 6,
    alignItems: 'center'
  },
  imageStyle: {
    flex: 1,
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
