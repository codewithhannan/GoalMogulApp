/** @format */

import React from 'react'
import {
    View,
    Animated,
    Text,
    Image,
    Dimensions,
    TouchableOpacity,
} from 'react-native'
import { Actions } from 'react-native-router-flux'

// Styles
import { tutorial } from '../styles'
import { color } from '../styles/basic'

// Assets
import MoreIcon from '../../assets/tutorial/More.png'
import RightArrow from '../../assets/tutorial/RightArrow.png'
import Replay from '../../assets/tutorial/Replay.png'

const { width } = Dimensions.get('window')
const DEBUG_KEY = '[ UI Tutorial.Host ]'
const ZERO_ANIMATED_VAL = new Animated.Value(0)

class Host extends React.PureComponent {
    render() {
        const {
            subTitleTextStyle,
            textStyle,
            imageShadow,
            containerStyle,
        } = tutorial

        const { initial } = this.props

        const buttonText = initial === false ? 'Start' : 'Continue'
        const buttonAction =
            initial === false ? () => Actions.pop() : this.props.continue

        return (
            <Animated.View
                style={[
                    containerStyle,
                    {
                        ...styles.containerStyle,
                        opacity: this.props.opacity,
                        flex: 1,
                    },
                ]}
            >
                <View
                    style={[
                        {
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            alignItems: 'center',
                        },
                    ]}
                >
                    <Image
                        source={MoreIcon}
                        style={styles.imageStyle}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.textContainerStyle}>
                    <Text style={[subTitleTextStyle]}>There's more...</Text>
                    <Text style={[textStyle, { marginTop: 12 }]}>
                        {'\u2022'} Find your Tribe
                    </Text>
                    <Text style={[textStyle, { marginTop: 8 }]}>
                        {'\u2022'} Create Events, Live Chat Rooms
                    </Text>
                    <Text style={[textStyle, { marginTop: 8 }]}>
                        {'\u2022'} Form Mastermind Groups & More
                    </Text>
                </View>

                <TouchableOpacity
                    activeOpacity={0.6}
                    style={styles.buttonContainerStyle}
                    onPress={buttonAction}
                    disabled={this.props.buttonDisabled}
                >
                    <Text style={[textStyle, { fontSize: 21, marginTop: 2 }]}>
                        {buttonText}
                    </Text>
                    <Image
                        source={RightArrow}
                        style={{ height: 13, width: 20, marginLeft: 17 }}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.6}
                    style={styles.replayIconContainerStyle}
                    onPress={this.props.replay}
                    disabled={this.props.buttonDisabled}
                >
                    <Image
                        source={Replay}
                        style={{ height: 15, width: 15, marginRight: 6 }}
                    />
                    <Text style={[textStyle, { marginTop: 1 }]}>replay</Text>
                </TouchableOpacity>
            </Animated.View>
        )
    }
}

const styles = {
    containerStyle: {
        paddingTop: 30,
        paddingBottom: 50,
    },
    textContainerStyle: {
        width: '100%',
        paddingRight: 26,
        paddingLeft: 26,
        paddingTop: (width * 4) / 7,
        marginBottom: 20,
    },
    buttonContainerStyle: {
        backgroundColor: color.GM_BLUE,
        borderRadius: 5,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        paddingLeft: 28,
        paddingRight: 20,
        flexDirection: 'row',
    },
    replayIconContainerStyle: {
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        opacity: 0.8,
    },
    imageStyle: {
        marginTop: 15,
        width: (width * 9) / 12,
        height: (width * 9) / 12,
        flex: 1,
    },
}

export default Host
