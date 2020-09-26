/**
 * This is the badge view with Confetti background
 *
 * @format
 */

import React from 'react'
import PropTypes from 'prop-types'
import {
    View,
    Image,
    ImageBackground,
    ViewPropTypes,
    Dimensions,
    TouchableWithoutFeedback,
} from 'react-native'
import { SpackleBackgroundImage } from '../../../asset/image'
import { Bronze3D, Silver3D, Gold3D } from '../../../asset/banner'
import DelayedButton from '../../Common/Button/DelayedButton'
import style from '../../Tutorial/style'

const width = Dimensions.get('window').width

const SparkleBadgeView = (props) => {
    const {
        onPress,
        backgroundImageSource,
        containerStyle,
        containerImageStyle,
        milestoneIdentifier, // ["BadgeAward:Bronze", "BadgeAward:Silver", "BadgeAward:Gold"]
    } = props

    const badgeSource = getIconSource(milestoneIdentifier)

    const view = (
        <ImageBackground
            source={backgroundImageSource || SpackleBackgroundImage}
            style={[styles.containerStyle, containerStyle]}
            imageStyle={[styles.containerImageStyle, containerImageStyle]}
        >
            <View style={{ alignItems: 'center' }}>
                <View style={{ height: 5, width: '100%' }} />
                <View
                    style={{
                        height: 60,
                        width: 60,
                        borderRadius: 30,
                        backgroundColor: 'white',
                    }}
                />
                <View
                    style={{
                        position: 'absolute',
                        top: 3,
                        bottom: 3,
                        left: 3,
                        right: 3,
                        alignItems: 'center',
                        paddingLeft: 2,
                    }}
                >
                    <Image
                        source={badgeSource}
                        style={{ height: 55, width: 50 }}
                    />
                </View>
            </View>
        </ImageBackground>
    )

    if (onPress) {
        return (
            <DelayedButton
                onPress={onPress}
                activeOpacity={1}
                touchableWithoutFeedback
            >
                <View>{view}</View>
            </DelayedButton>
        )
    }
    return view
}

const getIconSource = (milestoneIdentifier) => {
    if (milestoneIdentifier === 'BadgeAward:Bronze') {
        return Bronze3D
    }
    if (milestoneIdentifier === 'BadgeAward:Silver') {
        return Silver3D
    }
    if (milestoneIdentifier === 'BadgeAward:Gold') {
        return Gold3D
    }
    return Bronze3D
}

const styles = {
    containerStyle: {
        height: width / 3,
        width: width / 3,
        borderRadius: 12,
        alignItem: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 3.5,
        marginTop: 10,
        marginBottom: 10,
    },
    // Image backgroudn image style
    containerImageStyle: {
        height: width / 3,
        width: width / 3,
        borderRadius: 12,
    },
}

SparkleBadgeView.defaultProps = {
    // Image background style
    containerStyle: {},
    // Image backgroudn image style
    containerImageStyle: {},
}

SparkleBadgeView.prototype = {
    containerStyle: ViewPropTypes.style,
    containerImageStyle: ViewPropTypes.style,
    milestoneIdentifier: PropTypes.string.isRequired,
}

export default SparkleBadgeView
