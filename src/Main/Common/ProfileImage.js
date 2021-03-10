/** @format */

import _ from 'lodash'
import React from 'react'
import { Image, View, ActionSheetIOS } from 'react-native'
import defaultUserProfile from '../../asset/utils/defaultUserProfile.png'
import { connect } from 'react-redux'
// actions
import { openProfile } from '../../actions'
import { getImageOrDefault } from '../../redux/middleware/utils'
// Constants
import { default_style } from '../../styles/basic'
import DelayedButton from './Button/DelayedButton'

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
        } else if (userId) {
            this.props.openProfile(userId)
        }
    }

    chooseImage = async () => {
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: BUTTONS,
                cancelButtonIndex: CANCEL_INDEX,
            },
            (buttonIndex) => {
                console.log('button clicked', BUTTONS[buttonIndex])
                switch (buttonIndex) {
                    case TAKING_PICTURE_INDEX:
                        this.props.openCamera((result) => {
                            this.props.change('profile.image', result.uri)
                        })
                        break
                    case CAMERA_ROLL_INDEX:
                        this.props.openCameraRoll((result) => {
                            this.props.change('profile.image', result.uri)
                        })
                        break
                    default:
                        return
                }
            }
        )
    }
    renderImage = ({ input: { value } }) => {
        return (
            <TouchableOpacity activeOpacity={0.6} onPress={this.chooseImage}>
                <View style={styles.imageContainerStyle}>
                    <View style={styles.imageWrapperStyle}>
                        <ProfileImage
                            imageStyle={styles.imageStyle}
                            imageUrl={getProfileImageOrDefault(value)}
                        />
                    </View>
                </View>
                <View style={styles.iconContainerStyle}>
                    <Icon
                        name="edit"
                        pack="material"
                        style={styles.editIconStyle}
                    />
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        const {
            imageContainerStyle,
            disabled,
            actionDecorator,
            userId,
            icon, // React component
        } = this.props
        let { imageUrl, imageStyle, defaultImageSource } = this.props

        if (!defaultImageSource) {
            // TODO mod 2 on hash of userId and render blue/grey profile image based on result
            defaultImageSource = defaultUserProfile
        }
        const resizeMode = setValue(this.props.resizeMode).withDefaultCase(
            'cover'
        )

        imageStyle = imageStyle
            ? {
                  borderRadius: 100,
                  ...imageStyle,
              }
            : default_style.profileImage_1

        let defaultImageStyle = default_style.defaultImageStyle || {}
        if (imageStyle)
            defaultImageStyle = { ...defaultImageStyle, ...imageStyle }
        if (this.props.defaultImageStyle && !imageUrl)
            defaultImageStyle = {
                ...defaultImageStyle,
                ...this.props.defaultImageStyle,
            }
        if (!imageStyle && !this.props.defaultImageStyle)
            defaultImageStyle = {
                ...defaultImageStyle,
                ...default_style.profileImage_1,
            }

        const defaultImageContainerStyle =
            this.props.defaultImageContainerStyle ||
            imageContainerStyle ||
            styles.imageContainerStyle

        let fragment = (
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
                {
                    // Render icon as the image if icon is provided
                    icon ? (
                        icon
                    ) : (
                        <Image
                            style={
                                imageUrl
                                    ? imageStyle
                                    : {
                                          borderRadius: 100,
                                          ...defaultImageStyle,
                                      }
                            }
                            source={getImageOrDefault(
                                imageUrl,
                                defaultImageSource
                            )}
                            resizeMode={resizeMode}
                        />
                    )
                }
            </View>
        )

        const canOnPress = (actionDecorator || userId) && !disabled
        return canOnPress ? (
            <DelayedButton
                touchableWithoutFeedback
                onPress={this.handleProfileImageOnPress}
            >
                {fragment}
            </DelayedButton>
        ) : (
            fragment
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
        backgroundColor: 'white',
    },
}

export default connect(null, {
    openProfile,
})(ProfileImage)
