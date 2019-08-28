/**
 * NOTE: This new class is intended to accomodate zoomed view for ProgressBar. It hasn't been updated yet.
 */
import React from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';

/* Icon */
import Bar from '../../../asset/utils/progressBar.png';
import OpacBar from '../../../asset/utils/progressBarOpac.png';
import CounterBar from '../../../asset/utils/progressBarCounter.png';

const DEBUG_KEY = '[ UI ProgressBar ]';
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const PROGRESSBAR_COLOR = '#F7EB37';
const formatDate = (date) => {
  const month = months[(date || new Date()).getMonth()];
  const year = (date || new Date()).getFullYear();
  return `${month} ${year}`;
};

class ProgressBar extends React.PureComponent {

    renderProgressBarV2 = (props) => {
        const { percentage } = props;
        const { height, width, edgeIconSource, iconSource, goalRef, isProfileGoalCard } = props;
      
        const colorFlex = Math.round(percentage * 10);
        const layerFlex = Math.round((1 - percentage) * 10);
      
        // console.log(`${DEBUG_KEY}: [ renderProgressBar ]: percentage is: ${percentage}, colorFex: ${colorFlex}, for goalRef: ${goalRef.title}`);
      
      
        const layerComponent = layerFlex ?
        (
            <View style={{ flex: layerFlex, flexDirection: 'row', display: 'flex' }}>
                <View>
                <Image
                    source={edgeIconSource || CounterBar}
                    style={{ tintColor: '#f2f2f2', height: height || 11 }}
                />
                </View>
                <View style={{ flex: 1, backgroundColor: '#f2f2f2', height }} />
            </View>
        ) : null;
        // console.log(`percentage is: ${percentage}, colorFlex is: ${colorFlex}, layerFlex is: ${layerFlex}`);
        
        // For completed profile goal card goal, it's background is set to #F6F6F6. Thus we need to change
        // the background to the same color
        const layeredTintColor = goalRef && goalRef.isCompleted && isProfileGoalCard ? '#F6F6F6' : 'white';
      
        return (
            <View
                style={{
                ...styles.imageStyle,
                // flexDirection: 'row',
                // justifyContent: 'center',
                // alignItems: 'center',
                width,
                height,
                flex: 1
                }}
                onLayout={(e) => console.log('width is:', e.nativeEvent.layout.width)}
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
                        style={{ flex: 1, width, height, tintColor: layeredTintColor }}
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
            {
              colorFlex ? (
                <View
                  style={{
                    height: height || 11,
                    width: width || 260,
                    flex: 1,
                    zIndex: 1,
                    flexDirection: 'row',
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                  }}
                >
                  {colorFlex ? <View style={{ flex: colorFlex }} /> : null}
                  {layerComponent}
                </View>
              ) : (
                <View
                  style={{
                    height: height || 11,
                    width: width || 260,
                    flex: 1,
                    zIndex: 1,
                    flexDirection: 'row',
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    backgroundColor: '#f2f2f2'
                  }}
                />
              )
            }
          </View>
        );
    }

    render() {
        const {
            startTime,
            endTime,
            steps,
            needs,
            goalRef,
            marginRight,
        } = this.props;
        let progressPercentage = getProgress(steps || [], needs || [], goalRef);
        if (goalRef && goalRef.isCompleted) {
            progressPercentage = 1;
        }
        
        const startTimeText = startTime instanceof Date
            ? formatDate(startTime)
            : formatDate(new Date(startTime));
        const endTimeText = endTime instanceof Date
            ? formatDate(endTime)
            : formatDate(new Date(endTime));
        
        const startTimeTextView = startTimeText === 'undefined NaN'
            ? (<Text style={{ ...styles.textStyle, opacity: 0 }}>Jan 2018</Text>)
            : (<Text style={styles.textStyle}>{startTimeText}</Text>);
        
        const endTimeTextView = endTimeText === 'undefined NaN'
          ? (<Text style={{ ...styles.textStyle, opacity: 0 }}>Aug 2019</Text>)
          : (<Text style={styles.textStyle}>{endTimeText}</Text>);
        
        return (
            <View style={[styles.containerStyle]}>
                <View style={{ marginRight }}>
                    {startTimeTextView}
                </View>
                {/* <Image source={Bar} style={styles.imageStyle} /> */}
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    {this.renderProgressBarV2({ percentage: progressPercentage, ...this.props })}
                </View>
                <View>
                    {endTimeTextView}
                </View>
            </View>
          );
    }
};

const renderProgressBar = (props) => {
  const { percentage } = props;
  const { height, width, edgeIconSource, iconSource, goalRef, isProfileGoalCard } = props;

  const colorFlex = Math.round(percentage * 10);
  const layerFlex = Math.round((1 - percentage) * 10);

  // console.log(`${DEBUG_KEY}: [ renderProgressBar ]: percentage is: ${percentage}, colorFex: ${colorFlex}, for goalRef: ${goalRef.title}`);


  const layerComponent = layerFlex ?
  (
    <View style={{ flex: layerFlex, flexDirection: 'row', display: 'flex' }}>
      <View>
        <Image
          source={edgeIconSource || CounterBar}
          style={{ tintColor: '#f2f2f2', height: height || 11 }}
        />
      </View>
      <View style={{ flex: 1, backgroundColor: '#f2f2f2', height }} />
    </View>
  ) : null;
  // console.log(`percentage is: ${percentage}, colorFlex is: ${colorFlex}, layerFlex is: ${layerFlex}`);
  
  // For completed profile goal card goal, it's background is set to #F6F6F6. Thus we need to change
  // the background to the same color
  const layeredTintColor = goalRef && goalRef.isCompleted && isProfileGoalCard ? '#F6F6F6' : 'white';

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
          style={{ flex: 1, width, height, tintColor: layeredTintColor }}
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
          flex: 1,
          zIndex: 1,
          flexDirection: 'row',
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
        }}
      >
        {/* {colorFlex ? <View style={{ flex: colorFlex }} /> : null} */}
        {layerComponent}
      </View>
    </View>
  );
};

/**
 * Return the percentage of progress
 */
const getProgress = (steps, needs, goalRef) => {
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
  // return totalCount === 0 ? 1 : ((needsCompleteCount + stepsCompleteCount) / totalCount);
  if (goalRef && goalRef.isCompleted) return 1;
  return steps.length === 0 ? 0 : ((stepsCompleteCount) / steps.length);
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