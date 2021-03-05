/** @format */

import React from 'react'
import { View, Animated, Text, Image, Dimensions } from 'react-native'

// Styles
import { tutorial } from '../styles'

// Assets
import LearnFeed from '../../assets/tutorial/Learn.png' // Image used in version 1 tutorial
import CreateGoalScreenshot from '../../assets/tutorial/V2_2.png'

const { width } = Dimensions.get('window')

class Learn extends React.PureComponent {
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
                <View
                    style={{
                        width: '100%',
                        paddingLeft: 26,
                        paddingRight: 26,
                        marginTop: 20,
                    }}
                >
                    <Text style={[subTitleTextStyle]}>
                        Set challenging goals.
                    </Text>
                    <Text
                        style={[textStyle, { marginTop: 10, marginBottom: 15 }]}
                    >
                        Your friends can help you achieve them
                    </Text>
                </View>

                <View style={[imageShadow, { flex: 1 }]}>
                    <Image
                        source={CreateGoalScreenshot}
                        style={styles.imageStyle}
                        resizeMode="contain"
                    />
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
        width: (width * 8) / 9,
        flex: 1,
        alignSelf: 'stretch',
    },
}

export default Learn
