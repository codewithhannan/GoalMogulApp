import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

import styles from './style.js';

const DEBUG_KEY = '[ UI Tooltip ]';

const Tooltip = ({
    isFirstStep,
    isLastStep,
    handleNext,
    handlePrev,
    handleStop,
    currentStep,
    currentTutorialFinished
}) => {
    console.log(`${DEBUG_KEY}: currentTutorialFinished: `, currentTutorialFinished);
    return (
        <View style={{ paddingBottom: 15, alignItems: 'center' }}>
            <View style={styles.tooltipContainer}>
                <Text testID="stepDescription" style={styles.tooltipText}>{currentStep.text}</Text>
            </View>
            <View style={[styles.bottomBar]}>
            {
                !isLastStep ?
                    (<TouchableOpacity onPress={handleNext}>
                        <Button>Next</Button>
                    </TouchableOpacity>) :
                    (<TouchableOpacity onPress={handleStop}>
                        <Button>Finish</Button>
                    </TouchableOpacity>)
            }
            </View>
        </View>
    );
};

const Button = ({ wrapperStyle, style, ...rest }) => (
    <View style={[styles.button, wrapperStyle]}>
        <Text style={[styles.buttonText, style]} {...rest} />
    </View>
);

const mapStateToProps = (state) => {

    return {
        currentTutorialFinished: state.tutorials.create_goal.create_goal_modal.nextStepNumber === 8
    };
};

export default connect(
    mapStateToProps,
    null
)(Tooltip);