/**
 * Onboarding flow header with GM logo and text "GoalMogul". This is a static file that doesn't contain any state / props.
 *
 * @link https://www.figma.com/file/T1ZgWm5TKDA4gtBS5gSjtc/GoalMogul-App?node-id=24%3A195
 *
 * @format
 */

import React from 'react'
import { View, Image } from 'react-native'
import HeaderImage from '../../../asset/header/header-logo.png'
import { color } from '../../../styles/basic'

class OnboardingHeader extends React.Component {
    render() {
        return (
            <View style={styles.containerStyle}>
                <View style={{ height: 34, width: '100%' }} />
                <View
                    style={{
                        height: 90,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <View style={{ height: 35.1 }}>
                        <Image
                            source={HeaderImage}
                            style={{ height: 35.1, width: 150 }}
                            resizeMode="cover"
                        />
                    </View>
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
