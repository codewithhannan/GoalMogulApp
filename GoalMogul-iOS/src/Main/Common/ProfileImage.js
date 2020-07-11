/** @format */

import React from 'react'
import { Image, View, TouchableWithoutFeedback } from 'react-native'
import _ from 'lodash'
import { connect } from 'react-redux'

// actions
import { openProfile } from '../../actions'

// Constants
import { DEFAULT_STYLE } from '../../styles'
import { getImageOrDefault } from '../../redux/middleware/utils'

const DEBUG_KEY = '[ UI ProfileImage ]'
/*
 * props: imageUrl, resizeMode, imageContainerStyle, imageStyle, defaultImageSource
 */
class ProfileImage extends React.Component {
    shouldComponentUpdate(nextProps) {
        if (this.props.imageUrl !== nextProps.imageUrl) {
            return true
        }
        return false
    }

    handleProfileImageOnPress = () => {
        const { userId, disabled } = this.props
        if (!userId || _.isEmpty(userId) || disabled) return

        if (this.props.actionDecorator) {
            this.props.actionDecorator(() => this.props.openProfile(userId))
        } else {
            this.props.openProfile(userId)
        }
    }

    render() {
        const {
            imageContainerStyle,
            imageStyle,
            defaultImageSource,
        } = this.props
        let imageUrl = this.props.imageUrl
        const resizeMode = setValue(this.props.resizeMode).withDefaultCase(
            'cover'
        )

        let defaultImageStyle
        if (this.props.defaultImageStyle)
            defaultImageStyle = { ...this.props.defaultImageStyle }
        else if (imageStyle) defaultImageStyle = { ...imageStyle }
        else defaultImageStyle = DEFAULT_STYLE.profileImage_2

        const defaultImageContainerStyle =
            this.props.defaultImageContainerStyle ||
            imageContainerStyle ||
            styles.imageContainerStyle

        return (
            <TouchableWithoutFeedback onPress={this.handleProfileImageOnPress}>
                <View
                    style={
                        imageUrl
                            ? { ...imageContainerStyle, borderRadius: 100 }
                            : defaultImageContainerStyle
                    }
                >
                    <Image
                        style={
                            imageUrl
                                ? (imageStyle && {
                                      ...imageStyle,
                                      borderRadius: 100,
                                  }) ||
                                  DEFAULT_STYLE.profileImage_1
                                : defaultImageStyle
                        }
                        source={getImageOrDefault(imageUrl, defaultImageSource)}
                        resizeMode={resizeMode}
                    />
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

const setValue = (value) => ({
    withDefaultCase(defaultValue) {
        return value === undefined ? defaultValue : value
    },
})

const styles = {
    imageContainerStyle: {
        alignItems: 'center',
        borderRadius: 100,
        alignSelf: 'flex-start',
        backgroundColor: 'white',
        borderColor: '#BDBDBD',
        borderWidth: 1,
    },
}

export default connect(null, {
    openProfile,
})(ProfileImage)
