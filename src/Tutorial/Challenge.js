/** @format */

import React from 'react'
import { View, Animated, Text, Image, Dimensions } from 'react-native'

// Styles
import { tutorial } from '../styles'

// Assets
import SetGoals from '../../assets/tutorial/SetGoals.png' // Image used in version 1 tutorial
import ProfileScreenshot from '../../assets/tutorial/V2_1.png'

const { width } = Dimensions.get('window')

class Challenge extends React.PureComponent {
    render() {
        const {
            subTitleTextStyle,
            textStyle,
            imageShadow,
            containerStyle,
        } = tutorial

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
                <View style={[imageShadow, { flex: 1 }]}>
                    <Image
                        source={ProfileScreenshot}
                        style={styles.imageStyle}
                        resizeMode="contain"
                    />
                </View>

                <View style={{ paddingLeft: 26, paddingRight: 26 }}>
                    <Text style={[subTitleTextStyle]}>
                        Stay up-to-date with what really matters to your friends
                    </Text>
                    <Text style={[textStyle, { marginTop: 8 }]}>
                        Build relationships by seeing the goals that are the
                        most meaningful for people
                    </Text>
                </View>
            </Animated.View>
        )
    }
}

const styles = {
    containerStyle: {
        paddingTop: 10,
        paddingBottom: 50,
    },
    imageStyle: {
        width: (width * 2) / 3,
        flex: 1,
        alignSelf: 'stretch',
    },
}

export default Challenge
