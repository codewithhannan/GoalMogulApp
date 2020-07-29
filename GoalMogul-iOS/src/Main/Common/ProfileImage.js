/** @format */

import _ from 'lodash'
import React from 'react'
import { Image, TouchableWithoutFeedback, View } from 'react-native'
import { connect } from 'react-redux'
// actions
import { openProfile } from '../../actions'
import { getImageOrDefault } from '../../redux/middleware/utils'
// Constants
import { default_style } from '../../styles/basic'

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
        if (imageStyle) defaultImageStyle = { ...imageStyle }
        if (this.props.defaultImageStyle && !imageUrl)
            defaultImageStyle = { ...this.props.defaultImageStyle }
        if (!imageStyle && !this.props.defaultImageStyle)
            defaultImageStyle = default_style.profileImage_2

        const defaultImageContainerStyle =
            this.props.defaultImageContainerStyle ||
            imageContainerStyle ||
            styles.imageContainerStyle

        return (
            <TouchableWithoutFeedback onPress={this.handleProfileImageOnPress}>
                <View
                    style={
                        imageUrl
                            ? { borderRadius: 100, ...imageContainerStyle }
                            : {
                                  borderRadius: 100,
                                  ...defaultImageContainerStyle,
                              }
                    }
                >
                    <Image
                        style={
                            imageUrl
                                ? imageStyle
                                    ? {
                                          borderRadius: 100,
                                          ...imageStyle,
                                      }
                                    : default_style.profileImage_1
                                : {
                                      borderRadius: 100,
                                      ...defaultImageStyle,
                                  }
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
