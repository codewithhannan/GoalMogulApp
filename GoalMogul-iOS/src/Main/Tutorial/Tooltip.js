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
    let component;
    if (isLastStep && currentTutorialFinished) {
        component = (<TouchableOpacity onPress={handleStop}>
            <Button>Finish</Button>
        </TouchableOpacity>);
    }

    if (isLastStep && !currentTutorialFinished) {
        component = (<TouchableOpacity onPress={handleStop}>
            <Button>Next</Button>
        </TouchableOpacity>);
    }

    if (!isLastStep) {
        component = (<TouchableOpacity onPress={handleNext}>
            <Button>Next</Button>
        </TouchableOpacity>);
    }

    return (
        <View style={{ paddingBottom: 15, alignItems: 'center' }}>
            <View style={styles.tooltipContainer}>
                <Text testID="stepDescription" style={styles.tooltipText}>{currentStep.text}</Text>
            </View>
            <View style={[styles.bottomBar]}>
            {
                component
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
        currentTutorialFinished: state.tutorials.isOnCurrentFlowLastStep
    };
};

export default connect(
    mapStateToProps,
    null
)(Tooltip);