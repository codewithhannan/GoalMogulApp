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
 *
 * @format
 */

import React from 'react'
import { View, Text } from 'react-native'
import { color, text } from '../../../styles/basic'
import OnboardingStyles from '../../../styles/Onboarding'
import { Icon } from '@ui-kitten/components'
import DelayedButton from '../../Common/Button/DelayedButton'

const { button: buttonStyle } = OnboardingStyles

class OnboardingFooter extends React.Component {
    renderProgressBar() {
        const { totalStep, currentStep, hideProgressDots } = this.props
        console.log('THIS IS TOTAL STEPP', totalStep)
        if (hideProgressDots)
            return (
                <>
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                        }}
                    ></View>
                </>
            )
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                }}
            >
                {[...Array(totalStep)].map((_, i) => {
                    if (currentStep - 1 < i) {
                        return (
                            <View
                                style={styles.dotStyleEmpty(styles.circleSize)}
                                key={Math.random().toString(36).substr(2, 9)}
                            />
                        )
                    } else {
                        return (
                            <View
                                style={styles.dotStyleFull(styles.circleSize)}
                                key={Math.random().toString(36).substr(2, 9)}
                            />
                        )
                    }
                })}
            </View>
        )
    }

    renderButton(props) {
        const { disabled, buttonText, ...otherProps } = props
        let disabledStyle = disabled
            ? { backgroundColor: color.GM_BLUE_LIGHT }
            : {}
        return (
            <DelayedButton
                {...otherProps}
                disabled={disabled}
                style={[
                    buttonStyle.GM_BLUE_BG_WHITE_BOLD_TEXT.containerStyle,
                    disabledStyle,
                    { marginBottom: 8 },
                ]}
                onPress={this.props.onButtonPress}
            >
                <Text
                    style={[buttonStyle.GM_BLUE_BG_WHITE_BOLD_TEXT.textStyle]}
                >
                    {buttonText}
                </Text>
            </DelayedButton>
        )
    }

    render() {
        const {
            buttonText,
            onNext,
            onPrev,
            nextDisabled,
            ...otherProps
        } = this.props
        if (buttonText) {
            return this.renderButton(this.props)
        }
        return (
            <View style={styles.containerStyle}>
                {/** Only render back button if not the first component */}
                <Circle
                    {...otherProps}
                    size={styles.circleSize}
                    rotate
                    isFirst={this.props.currentStep == 1}
                    onPress={this.props.onPrev}
                />
                {this.renderProgressBar()}
                <Circle
                    {...otherProps}
                    size={styles.circleSize}
                    onPress={this.props.onNext}
                    disabled={nextDisabled == undefined ? false : nextDisabled}
                />
            </View>
        )
    }
}

const styles = {
    containerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 15,
        // marginBottom: 20,
        backgroundColor: color.GM_CARD_BACKGROUND,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowRadius: 3,
        shadowOpacity: 1,
        shadowColor: 'rgba(0,0,0,0.05)',
        height: 100, // TODO: footer hight should adjust with screen height
    },
    buttonContainerStyle: {
        height: 45,
        width: '100%',
        backgroundColor: color.GM_BLUE,
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        marginTop: 40,
        marginBottom: 20,
    },
    buttonTextStyle: {
        fontSize: text.TEXT_FONT_SIZE.FONT_3,
        fontWeight: 'bold',
        lineHeight: text.TEXT_LINE_HEIGHT.FONT_3,
        color: 'white',
        fontFamily: text.FONT_FAMILY.BOLD,
    },
    circleSize: 52, // TODO: circle size should ajust with screen dimension
    circle: {
        imageRatio: 28 / 100, // scale down to 28/100 of the height
        // Asusming the icon is pointing right
        containerStyle: (size, rotate, disabled) => ({
            height: size,
            width: size,
            borderRadius: size / 2,
            backgroundColor: rotate
                ? '#F2F2F2'
                : disabled
                ? color.GM_BLUE_LIGHT_LIGHT
                : color.GM_BLUE,
            marginLeft: size / 2,
            marginRight: size / 2,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 5,
        }),
        // rotate refers to if it's right pointing or left pointing
        // rotate == true means it's right pointing
        imageStyle: (size, rotate) => {
            if (rotate) {
                return {
                    height: (size * 52) / 100,
                    width: (size * 52) / 100,
                    tintColor: 'black',
                }
            }
            return {
                height: (size * 60) / 100,
                width: (size * 60) / 100,
                tintColor: 'white',
            }
        },
    },
    dotStyleEmpty: (size) => {
        const radius = Math.ceil((size * 200) / 2000)
        return {
            backgroundColor: color.GM_DOT_GRAY,
            height: radius * 2,
            width: radius * 2,
            borderRadius: radius,
            marginLeft: radius * 2 - 1,
            marginRight: radius * 2 - 1,
        }
    },
    dotStyleFull: (size) => {
        const radius = Math.ceil((size * 200) / 2000)
        return {
            backgroundColor: color.GM_BLUE,
            height: radius * 2,
            width: radius * 2,
            borderRadius: radius,
            marginLeft: radius * 2 - 1,
            marginRight: radius * 2 - 1,
        }
    },
}

/**
 * Render a blue cycle that scale with size
 * @param {*} size: height or width of the circle
 * @param {*} image: image source to render at the center of the Cycle
 */
const Circle = ({ size, image, rotate, isFirst, onPress, disabled }) => {
    const containerStyle = styles.circle.containerStyle(size, rotate)
    if (isFirst) {
        return <View style={{ ...containerStyle, opacity: 0 }} />
    }
    const name = rotate ? 'chevron-left' : 'chevron-right'
    return (
        <DelayedButton
            style={styles.circle.containerStyle(size, rotate, disabled)}
            onPress={onPress}
            disabled={disabled}
        >
            {/** Icon should scale along the cycle size */}
            <Icon
                name={name}
                pack="material"
                style={styles.circle.imageStyle(size, rotate)}
            />
        </DelayedButton>
    )
}

export default OnboardingFooter
