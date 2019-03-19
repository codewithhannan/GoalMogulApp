import React from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';

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
  const {
    startTime,
    endTime,
    steps,
    needs,
    goalRef,
    marginRight
  } = props;
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
      <View style={{ zIndex: 2, marginRight }}>
        <Text style={styles.textStyle}>
          {startTimeText === 'undefined NaN' ? 'Jan 2018' : startTimeText}
        </Text>
      </View>
      {/* <Image source={Bar} style={styles.imageStyle} /> */}
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', zIndex: 2 }}>
        {renderProgressBar({ percentage: progressPercentage, ...props })}
      </View>

      <View style={{ zIndex: 2 }}>
        <Text style={styles.textStyle}>
          {endTimeText === 'undefined NaN' ? 'Aug 2019' : endTimeText}
        </Text>
      </View>
    </View>
  );
};

const renderProgressBar = (props) => {
  const { percentage } = props;
  const { height, width, edgeIconSource, iconSource } = props;

  const colorFlex = Math.round(percentage * 10);
  const layerFlex = Math.round((1 - percentage) * 10);

  const layerComponent = layerFlex ?
  (
    <View style={{ flex: layerFlex, flexDirection: 'row' }}>
      <Image
        source={edgeIconSource || CounterBar}
        style={{ tintColor: '#f2f2f2', height: height || 11 }}
      />
      <View style={{ flex: 1, backgroundColor: '#f2f2f2', width, height }} />
    </View>
  ) : null;
  // console.log(`percentage is: ${percentage}, colorFlex is: ${colorFlex}, layerFlex is: ${layerFlex}`);
  return (
    <View
      style={{
        ...styles.imageStyle,
        // flexDirection: 'row',
        // justifyContent: 'center',
        // alignItems: 'center',
        width,
        height
      }}
    >
      <View
        style={{
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          zIndex: 2,
          position: 'absolute',
        }}
      >
        <Image
          source={iconSource || OpacBar}
          style={{ flex: 1, width, height, tintColor: 'white' }}
        />
      </View>

      <View
        style={{
          backgroundColor: PROGRESSBAR_COLOR,
          height: height || 11,
          width: width || 260,
          paddingRight: 2
        }}
      />
      <View
        style={{
          height: height || 11,
          width: width || 260,
          // flex: 1,
          zIndex: 1,
          flexDirection: 'row',
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
        }}
      >
        <View style={{ flex: colorFlex }} />
        {layerComponent}
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
    display: 'flex',
    flexDirection: 'row',
    marginTop: 2,
    marginBottom: 6,
    alignItems: 'center'
  },
  imageStyle: {
    flex: 1
    // marginLeft: 2,
    // marginRight: 2
  },
  textStyle: {
    color: '#7b7b7b',
    fontSize: 8.5,
    alignSelf: 'center'
  }
};

//TODO: validate prop types
export default ProgressBar;
