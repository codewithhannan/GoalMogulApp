/**
 * Onboarding flow header with GM logo and text "GoalMogul". This is a static file that doesn't contain any state / props.
 *
 * @link https://www.figma.com/file/T1ZgWm5TKDA4gtBS5gSjtc/GoalMogul-App?node-id=24%3A195
 *
 * @format
 */

import React from 'react'
import { View, Image, Dimensions, StatusBar } from 'react-native'
import HeaderImage from '../../../asset/header/header-logo.png'
import { color } from '../../../styles/basic'
import { getStatusBarHeight } from 'react-native-status-bar-height'

class OnboardingHeader extends React.Component {
    getScreenHeight = () => {
        return Math.round(Dimensions.get('window').height)
    }

    render() {
        const screenHeight = this.getScreenHeight()

        // Below is from https://github.com/ovr/react-native-status-bar-height#readme
        // that takes care of both iphone and android status bar height
        const statusBarHeight = getStatusBarHeight()

        return (
            <View style={styles.containerStyle}>
                <View style={{ height: statusBarHeight, width: '100%' }} />
                <View
                    style={{
                        height: screenHeight / 9.5,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Image
                        source={HeaderImage}
                        style={{ height: screenHeight / 20 }}
                        resizeMode="contain"
                    />
                </View>
            </View>
        )
    }
}

const styles = {
    containerStyle: {
        display: 'flex',
        backgroundColor: color.GM_BLUE,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
}

export default OnboardingHeader
