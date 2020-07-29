/** @format */

import React from 'react'
import { Image, Text, View } from 'react-native'

// Components
import DelayedButton from '../../Common/Button/DelayedButton'
import { default_style } from '../../../styles/basic'

const DEBUG_KEY = '[ UI ActionButton ]'

class ActionButton extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            buttonDisabled: false,
        }
    }

    handleOnPress = () => {
        if (this.state.buttonDisabled) return
        this.setState({
            ...this.state,
            buttonDisabled: true,
        })
        this.props.onPress()
        // console.log(`${DEBUG_KEY}: set timeout`);
        setTimeout(() => {
            this.setState({
                ...this.state,
                buttonDisabled: false,
            })
        }, 800)
        // console.log(`${DEBUG_KEY}: enable button`);
    }

    render() {
        const {
            containerStyle,
            count,
            disabled,
            onTextPress,
            textContainerStyle,
            unitText,
        } = this.props
        if (disabled) return null
        const buttonDisabled = disabled === true || this.state.buttonDisabled

        const countText = (
            <DelayedButton
                activeOpacity={0.6}
                onPress={
                    count > 0 && onTextPress ? onTextPress : this.handleOnPress
                }
                style={textContainerStyle}
                disabled={buttonDisabled}
            >
                <Text
                    style={{
                        ...default_style.buttonText_1,
                        ...styles.textStyle,
                        ...this.props.textStyle,
                    }}
                >
                    {count > 0 ? `${count} ` : ''}
                    {unitText ? unitText + (count > 1 ? 's' : '') : ''}
                </Text>
            </DelayedButton>
        )

        return (
            <DelayedButton
                activeOpacity={0.6}
                style={{
                    ...styles.containerStyle,
                    ...containerStyle,
                    opacity: buttonDisabled ? 0.4 : 1,
                }}
                onPress={this.handleOnPress}
                disabled={buttonDisabled}
            >
                <View style={this.props.iconContainerStyle}>
                    <Image
                        resizeMode="contain"
                        source={this.props.iconSource}
                        style={{
                            ...default_style.buttonIcon_1,
                            ...this.props.iconStyle,
                        }}
                    />
                </View>
                {countText}
            </DelayedButton>
        )
    }
}

const styles = {
    containerStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    iconContainerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    textStyle: {
        ...default_style.smallTitle_1,
        marginLeft: 8,
    },
}

export default ActionButton
