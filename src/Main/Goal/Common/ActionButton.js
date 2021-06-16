/** @format */

import React from 'react'
import { Image, Text, View, Dimensions, TouchableOpacity } from 'react-native'
// Components
import DelayedButton from '../../Common/Button/DelayedButton'
import { default_style } from '../../../styles/basic'
import Tooltip from 'react-native-walkthrough-tooltip'
import LottieView from 'lottie-react-native'
import CLAP_LOTTIE from '../../../asset/emojis/clap.json'
import HEART_LOTTIE from '../../../asset/emojis/heart.json'
import SALUTE_LOTTIE from '../../../asset/emojis/salute.json'
import METOO_LOTTIE from '../../../asset/emojis/metoo.json'
import WOO_LOTTIE from '../../../asset/emojis/ohh.json'
import ROCKON_LOTTIE from '../../../asset/emojis/rockon.json'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'

const DEBUG_KEY = '[ UI ActionButton ]'

const TOOLTIP_WIDTH = Dimensions.get('screen').width

const LOTTIE_DATA = [
    {
        name: `    Love`,
        lottieSource: ROCKON_LOTTIE,
        value: '',
    },
    {
        name: 'Applause',
        lottieSource: CLAP_LOTTIE,
        value: '',
    },
    {
        name: 'Me Too!',
        lottieSource: METOO_LOTTIE,
        value: '',
    },
    {
        name: '    Rock-on',
        lottieSource: ROCKON_LOTTIE,
        value: '',
    },
    {
        name: '   Salute',
        lottieSource: SALUTE_LOTTIE,
        value: '',
    },
    {
        name: 'Wow',
        lottieSource: WOO_LOTTIE,
        value: '',
    },
]

class ActionButton extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            buttonDisabled: false,
            toolTipVisible: false,
        }
    }

    handleOnPress = () => {
        if (this.state.buttonDisabled) return
        this.setState({
            buttonDisabled: true,
        })
        this.props.onPress()
        // console.log(`${DEBUG_KEY}: set timeout`);
        setTimeout(() => {
            this.setState({
                buttonDisabled: false,
            })
        }, 800)
        // console.log(`${DEBUG_KEY}: enable button`);
    }

    render() {
        const {
            containerStyle,
            count,
            hidden,
            onTextPress,
            textContainerStyle,
            unitText,
        } = this.props
        if (hidden) return null
        const buttonDisabled = this.state.buttonDisabled

        const countText = (
            <DelayedButton
                activeOpacity={0.8}
                onPress={
                    count > 0 && onTextPress ? onTextPress : this.handleOnPress
                }
                style={textContainerStyle}
                disabled={buttonDisabled}
            >
                <Text style={[styles.textStyle, this.props.textStyle]}>
                    {count > 0 ? `${count} ` : ''}
                    {unitText ? unitText + (count > 1 ? 's' : '') : ''}
                </Text>
            </DelayedButton>
        )

        return (
            <>
                <Tooltip
                    animated={true}
                    isVisible={this.state.toolTipVisible}
                    arrowSize={{
                        height: 2,
                        width: 2,
                    }}
                    contentStyle={{
                        // backgroundColor: '#F9F9F9',
                        borderRadius: 40,
                        width: TOOLTIP_WIDTH * 0.85,
                        flex: 1,
                    }}
                    content={
                        <>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    width: TOOLTIP_WIDTH * 0.8,
                                }}
                            >
                                {LOTTIE_DATA.map((lottie) => {
                                    return (
                                        <>
                                            <TouchableOpacity>
                                                <View>
                                                    <LottieView
                                                        style={{
                                                            height: hp(5),
                                                        }}
                                                        source={
                                                            lottie.lottieSource
                                                        }
                                                        autoPlay
                                                        loop
                                                    />
                                                    <Text
                                                        style={{
                                                            fontSize: 8,
                                                            color: '#818181',
                                                            alignSelf: 'center',
                                                        }}
                                                    >
                                                        {lottie.name}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        </>
                                    )
                                })}
                            </View>
                        </>
                    }
                    disableShadow={false}
                    topAdjustment={2}
                    placement="top"
                    showChildInTooltip={false}
                    backgroundColor="transparent"
                    onClose={() => this.setState({ toolTipVisible: false })}
                >
                    <DelayedButton
                        touchableWithoutFeedback
                        activeOpacity={0.6}
                        onPress={this.handleOnPress}
                        disabled={buttonDisabled}
                        onLayout={this.props.onLayout}
                        onLongPress={() =>
                            this.setState({ toolTipVisible: true })
                        }
                    >
                        <View style={[styles.containerStyle, containerStyle]}>
                            <View style={this.props.iconContainerStyle}>
                                <Image
                                    resizeMode="contain"
                                    source={this.props.iconSource}
                                    style={[
                                        default_style.buttonIcon_1,
                                        this.props.iconStyle,
                                    ]}
                                />
                            </View>
                            {countText}
                        </View>
                    </DelayedButton>
                </Tooltip>
            </>
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
