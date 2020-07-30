/**
 * ********************************************************
 * FILENAME: ImagePicker.js    TYPE: Component
 *
 * DESCRIPTION:
 *      Allow user to select a photo from local directory.
 *
 * AUTHER: Yanxiang Lan     START DATE: 12 May 20
 * CREDIT: Jia Zeng, for partial code written in v1.
 * *********************************************************
 *
 * @format
 */

import React, { Component } from 'react'
import {
    View,
    Image,
    TouchableOpacity,
    StyleSheet,
    ActionSheetIOS,
} from 'react-native'
import { Icon, withStyles } from '@ui-kitten/components'

import { GM_DOT_GRAY } from '../../../styles'

// Resources
const TAKE_PIC_ICON = require('../../../asset/image/takePictureIcon.png')

// Action sheet specific
//TODO: abstract out as util function
const BUTTONS = ['Take a Picture', 'Camera Roll', 'Cancel']
const TAKING_PICTURE_INDEX = 0
const CAMERA_ROLL_INDEX = 1
const CANCEL_INDEX = 2

/**
 * REQUIRED PROPS:
 * * void     handleTakingPicture()
 * * void     handleCameraRoll()
 *
 * OPTIONAL PROPS:
 * * string   imageUri
 * * image    icon
 * * boolean  rounded
 * * boolean  bordered
 *
 * Please see documentation for details.
 */
class ImagePicker extends Component {
    /**Prompt user for an image selection */
    onAddImagePressed = () => {
        const { handleTakingPicture, handleCameraRoll } = this.props

        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: BUTTONS,
                cancelButtonIndex: CANCEL_INDEX,
            },
            (buttonIndex) => {
                switch (buttonIndex) {
                    case TAKING_PICTURE_INDEX:
                        handleTakingPicture()
                        break
                    case CAMERA_ROLL_INDEX:
                        handleCameraRoll()
                        break
                    default:
                        return
                }
            }
        )
    }

    renderImage = () => {
        const { imageUri, icon, rounded, eva } = this.props
        const imageStyle = []
        let imageSource

        if (imageUri) {
            imageSource = { uri: imageUri }
            imageStyle.push(styles.imageStyles)
            if (rounded) imageStyle.push(styles.roundedImageStyles)
        } else if (icon) {
            imageSource = TAKE_PIC_ICON
        } else {
            imageStyle.push(styles.defaultImageStyle)
            imageStyle.push(eva.style.icon)
        }

        imageStyle.push({ zIndex: 1 })
        if (!imageSource) {
            // render default image icon
            return (
                <Icon name="add-a-photo" pack="material" style={imageStyle} />
            )
        }

        return <Image source={imageSource} style={imageStyle} />
    }

    render() {
        const { rounded, bordered } = this.props
        const buttonStyle = [styles.buttonStyles]

        if (rounded) buttonStyle.push(styles.roundedButtonStyles)
        if (bordered) buttonStyle.push(styles.borderedButtonStyles)

        return (
            <View {...this.props}>
                <TouchableOpacity
                    style={buttonStyle}
                    onPress={this.onAddImagePressed}
                >
                    {this.renderImage()}
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    buttonStyles: {
        width: 200,
        height: 200,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    roundedButtonStyles: {
        borderRadius: 180,
    },
    borderedButtonStyles: {
        borderWidth: 2,
        borderColor: GM_DOT_GRAY,
    },
    imageStyles: {
        width: '100%',
        height: '100%',
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    roundedImageStyles: {
        borderRadius: 180,
    },
    defaultImageStyle: {
        height: 80,
        width: 80,
    },
})

/**
 * Map app theme to styles. These styles can be accessed
 * using the <eva> prop. For example,
 * const { eva } = this.props;
 * eva.style.backgroundPrimary;
 * @see https://github.com/akveo/react-native-ui-kitten/blob/master/docs/src/articles/design-system/use-theme-variables.md
 */
const mapThemeToStyles = (theme) => ({
    icon: {
        tintColor: theme['color-primary-500'],
    },
})

const StyledImagePicker = withStyles(ImagePicker, mapThemeToStyles)
export default StyledImagePicker
