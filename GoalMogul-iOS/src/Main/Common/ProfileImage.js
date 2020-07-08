/** @format */

import React from 'react'
import { Image, View, TouchableWithoutFeedback } from 'react-native'
import _ from 'lodash'
import { connect } from 'react-redux'

// default profile picture
import DEFAULT_PROFILE_IMAGE from '../../asset/utils/defaultUserProfile.png'

// actions
import { openProfile } from '../../actions'

// Constants
import { IMAGE_BASE_URL } from '../../Utils/Constants'
import { DEFAULT_STYLE } from '../../styles'

const DEBUG_KEY = '[ UI ProfileImage ]'
/*
 * props: imageUrl, resizeMode, imageContainerStyle, imageStyle
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

    /**
     * Get the source prop for Image component
     * @param {*} imageUrl
     * @param {*} defaultImageSource
     */
    getImageSource = (imageUrl, defaultImageSource) => {
        if (!imageUrl && !defaultImageSource) {
            // Use default profile pic as image source
            return DEFAULT_PROFILE_IMAGE
        }

        // Use passed in default image source
        if (!imageUrl) return defaultImageSource

        if (typeof imageUrl == 'string') {
            if (imageUrl.indexOf('https://') != 0) {
                // This is an image stored in S3 with format ProfileImage/token
                return { uri: `${IMAGE_BASE_URL}${imageUrl}` }
            } else {
                // This is a full URL
                return { uri: imageUrl }
            }
        }

        // This is a local image / icon passed in as imageUrl
        // It's typically has Integer type
        return imageUrl
    }

    render() {
        let { imageUrl } = this.props
        const {
            imageContainerStyle,
            imageStyle,
            defaultImageSource,
        } = this.props
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
                        source={this.getImageSource(
                            imageUrl,
                            defaultImageSource
                        )}
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
