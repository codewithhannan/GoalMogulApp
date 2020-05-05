import React from 'react';
import { Text, View } from 'react-native';

import { GM_BLUE, DEFAULT_STYLE } from '../../../styles';


const DEBUG_KEY = '[ UI ProgressBar ]';
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatDate = (date) => {
    const month = months[(date || new Date()).getMonth()];
    const year = (date || new Date()).getFullYear();
    return `${month} ${year}`;
};

const renderProgressBar = (props) => {
    const {
        sections,
        height,
        percentage,
        backgroundColor
    } = props;
    const percentagePerBar = 100 / sections;

    let progressBar = Array.from(Array(sections)).map((a, index) => {
        const i = index+1;
        const borderRadius = {
            borderTopLeftRadius: i === 1 ? height/2 : 0,
            borderBottomLeftRadius: i === 1 ? height/2 : 0,
            borderTopRightRadius: i === sections ? height/2 : 0,
            borderBottomRightRadius: i === sections ? height/2 : 0,
        }
        const progressFill = percentagePerBar * i - percentage;
        const marginRight = (progressFill <= 0 ? 0
            : (progressFill >= percentagePerBar ? 100 : (100 * progressFill / percentagePerBar)))
            + '%';

        return (
            <View style={{
                flex: 1,
                height,
                marginRight: i < sections ? 1 : 0,
                backgroundColor: '#E0E0E0',
                ...borderRadius
            }}>
                <View style={{
                    flex: 1,
                    backgroundColor,
                    marginRight,
                    ...borderRadius
                }}/>
            </View>
        );
    });

    return(
        <View style={styles.barContainerStyle}>
            {progressBar}
        </View>
    );
}

/**
 * Return the percentage of progress
 */
const getProgress = (steps, needs, goalRef) => {
    let stepsCompleteCount = 0;
    steps.forEach(step => {
        if (step.isCompleted) ++stepsCompleteCount;
    });

    let needsCompleteCount = 0;
    needs.forEach((need) => {
        if (need.isCompleted) ++needsCompleteCount;
    });

    if (goalRef && goalRef.isCompleted) return 1;
    return steps.length === 0 ? 0 : ((stepsCompleteCount) / steps.length);
};

const ProgressBar = (props) => {
    const {
        startTime,
        endTime,
        steps,
        needs,
        goalRef
    } = props;
    const percentage = getProgress(steps || [], needs || [], goalRef) * 100;

    const startTimeText = startTime instanceof Date
        ? formatDate(startTime)
        : formatDate(new Date(startTime));
    const endTimeText = endTime instanceof Date
        ? formatDate(endTime)
        : formatDate(new Date(endTime));

    const startTimeTextView = startTimeText === 'undefined NaN'
        ? (<Text style={{ ...DEFAULT_STYLE.smallText_2, opacity: 0 }}/>)
        : (<Text style={DEFAULT_STYLE.smallText_2}>{startTimeText}</Text>);

    const endTimeTextView = endTimeText === 'undefined NaN'
        ? (<Text style={{ ...DEFAULT_STYLE.smallText_2, opacity: 0 }}/>)
        : (<Text style={DEFAULT_STYLE.smallText_2}>{endTimeText}</Text>);

    return (
        <View style={styles.containerStyle}>
            <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 10
            }}>
                {startTimeTextView}
                {endTimeTextView}
            </View>
            {renderProgressBar({
                percentage,
                backgroundColor: props.color || GM_BLUE,
                height: props.barHeight || 11,
                sections: props.sections || 6
            })}
        </View>
    );
};

const styles = {
    containerStyle: {
        flex: 1,
        marginTop: 2
    },
    barContainerStyle: {
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center'
    }
};

//TODO: validate prop types
export default ProgressBar;
