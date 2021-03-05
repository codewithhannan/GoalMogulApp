/** @format */

import React from 'react'
import { View, Animated, Text, Image, Dimensions } from 'react-native'

// Styles
import { tutorial } from '../styles'

// Assets
import TribeIcon from '../../assets/tutorial/Tribe.png' // Image used in version 1 tutorial
import GoalCardScreenshot from '../../assets/tutorial/V2_3.png'

const { width } = Dimensions.get('window')

class Tribe extends React.PureComponent {
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
                        source={GoalCardScreenshot}
                        style={styles.imageStyle}
                        resizeMode="contain"
                    />
                </View>

                <View style={{ paddingLeft: 26, paddingRight: 26 }}>
                    <Text
                        style={[
                            subTitleTextStyle,
                            { marginTop: 20, fontSize: 23 },
                        ]}
                    >
                        Breakdown Goals into Steps and Needs
                    </Text>
                    <Text style={[textStyle, { marginTop: 10 }]}>
                        So your friends know exactly how to help you achieve
                        them.
                    </Text>
                </View>
            </Animated.View>
        )
    }
}

const styles = {
    containerStyle: {
        paddingTop: 30,
        paddingBottom: 30,
    },
    imageStyle: {
        width: (width * 5) / 7,
        flex: 1,
        alignSelf: 'stretch',
    },
}

export default Tribe
