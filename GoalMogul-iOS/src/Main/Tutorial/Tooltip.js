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

    const { text } = currentStep;

    let startingIndex, endingIndex, optionalIndex, focusedText, optionalText;
    if (text) {
        focusedText = text;
        optionalIndex = text.indexOf('optional');
        startingIndex = optionalIndex - 1;
        endingIndex = optionalIndex + 9;
    }
    
    if (optionalIndex !== -1) {
        optionalText = text.substring(startingIndex, endingIndex + 1);
        focusedText = text.substring(endingIndex + 1);
    }

    return (
        <View style={{ alignItems: 'center' }}>
            <View style={styles.tooltipContainer}>
                <Text testID="stepDescription" style={styles.tooltipText}>
                    {focusedText}
                </Text>
                {
                    optionalIndex !== -1
                        ? (<Text style={{ ...styles.tooltipText, color: '#025a7a', fontWeight: '600', marginTop: 4, fontSize: 13 }}>{optionalText}</Text>)
                        : null
                }
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