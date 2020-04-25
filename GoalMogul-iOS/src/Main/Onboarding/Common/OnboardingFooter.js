import React from 'react';
import {
    View,
    Image
} from 'react-native';
import { GM_BLUE, GM_DOT_GRAY, GM_BLUE_LIGHT_LIGHT } from '../../../styles';
import right_arrow_icon from '../../../asset/utils/right_arrow.png';
import DelayedButton from '../../Common/Button/DelayedButton';


/**
 * Onboarding footer to show the progress on registration and onboarding.
 * 
 * There are three main component. 1. Back button 2. Progress bar 3. Next button
 * 
 * @link https://www.figma.com/file/T1ZgWm5TKDA4gtBS5gSjtc/GoalMogul-App?node-id=24%3A195
 * 
 * props {
 *      currentStep,
 *      totalStep,
 *      onNext,
 *      onPrev // can be undefined if currentStep = 1
 * }
 */
class OnboardingFooter extends React.Component {

    renderProgressBar() {
        const { totalStep, currentStep } = this.props;
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", flexDirection: "row" }}>
                {
                    [...Array(totalStep)].map((_, i) => {
                        if (currentStep - 1 < i) {
                            return <View style={styles.dotStyleEmpty(styles.circleSize)} key={i} />
                        } else {
                            return <View style={styles.dotStyleFull(styles.circleSize)} key={i} />
                        }
                    })
                }
            </View>
        )
    }

    render() {
        return (
            <View style={styles.containerStyle}>
                {/** Only render back button if not the first component */}
                <Circle size={styles.circleSize} image={right_arrow_icon} rotate isFirst={this.props.currentStep == 1} onPress={this.props.onPrev} />
                {this.renderProgressBar()}
                <Circle size={styles.circleSize} image={right_arrow_icon} onPress={this.props.onNext} />
            </View>
        )
    }
}

const styles = {
    containerStyle: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        height: 76 // TODO: footer hight should adjust with screen height
    },
    circleSize: 52, // TODO: circle size should ajust with screen dimension
    circle: {
        imageRatio: 28 / 100, // scale down to 28/100 of the height
        // Asusming the icon is pointing right
        containerStyle: (size, rotate) => ({
            height: size, 
            width: size, 
            borderRadius: size / 2, 
            backgroundColor: rotate ? GM_BLUE_LIGHT_LIGHT : GM_BLUE, 
            marginLeft: size / 2, 
            marginRight: size / 2,
            alignItems: "center",
            justifyContent: "center",
            padding: 5
        }),
        // Assuming the icon is pointing right
        imageStyle: (size, rotate) => {
            if (rotate) {
                return {
                    height: size * 28 / 100,
                    width: size * 28 / 100 + 1,
                    transform: [{ rotate: '180deg' }]
                }
            }
            return { height: size * 28 / 100, width: size * 28 / 100 + 1 }
        }
    },
    dotStyleEmpty: (size) => {
        const radius = Math.ceil(size * 200 / 2000);
        return {
            backgroundColor: GM_DOT_GRAY,
            height: radius * 2,
            width: radius * 2,
            borderRadius: radius,
            marginLeft: radius * 2 - 1,
            marginRight: radius * 2 - 1,
        };
    },
    dotStyleFull: (size) => {
        const radius = Math.ceil(size * 200 / 2000);
        return {
            backgroundColor: GM_BLUE,
            height: radius * 2,
            width: radius * 2,
            borderRadius: radius,
            marginLeft: radius * 2 - 1,
            marginRight: radius * 2 - 1
        };
    }
};

/**
 * Render a blue cycle that scale with size
 * @param {*} size: height or width of the circle  
 * @param {*} image: image source to render at the center of the Cycle
 */
const Circle = ({ size, image, rotate, isFirst, onPress }) => {
    const containerStyle = styles.circle.containerStyle(size, rotate);
    if (isFirst) {
        return <View style={{ ...containerStyle, opacity: 0 }} />
    }
    return (
        <DelayedButton style={styles.circle.containerStyle(size, rotate)} onPress={onPress}>
            {/** Image should scale along the cycle size */}
            <Image source={image} style={styles.circle.imageStyle(size, rotate)} />
        </DelayedButton>
    )
}

export default OnboardingFooter;
