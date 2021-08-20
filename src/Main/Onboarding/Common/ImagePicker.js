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

import { color } from '../../../styles/basic'
import { getButtonBottomSheetHeight } from '../../../styles'
import BottomButtonsSheet from '../../Common/Modal/BottomButtonsSheet'

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
    openAddMediaModal = () => this.mediaBottomSheetRef.open()

    closeAddMediaModal = () => this.mediaBottomSheetRef.close()

    makeAddMediaOptions = () => {
        const { handleTakingPicture, handleCameraRoll } = this.props
        return [
            {
                text: 'Take Photo',
                icon: { name: 'camera', pack: 'material-community' },
                iconStyle: { height: 24, color: 'black' },
                onPress: () => {
                    this.closeAddMediaModal()
                    setTimeout(() => {
                        handleTakingPicture()
                    }, 500)
                },
            },
            {
                text: 'Open Camera Roll',
                textStyle: { color: 'black' },
                icon: { name: 'image-outline', pack: 'material-community' },
                iconStyle: { height: 24, color: 'black' },
                imageStyle: { tintColor: 'black' },
                onPress: () => {
                    this.closeAddMediaModal()
                    setTimeout(() => {
                        handleCameraRoll()
                    }, 500)
                },
            },
        ]
    }

    renderAddMediaBottomSheet = () => {
        const options = this.makeAddMediaOptions()

        const sheetHeight = getButtonBottomSheetHeight(options.length)

        return (
            <BottomButtonsSheet
                ref={(r) => (this.mediaBottomSheetRef = r)}
                buttons={options}
                height={sheetHeight}
            />
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
                // <Icon name="add-a-photo" pack="material" style={imageStyle} />
                <Image
                    source={TAKE_PIC_ICON}
                    style={{ height: 40, width: 40, resizeMode: 'contain' }}
                />
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
                    onPress={this.openAddMediaModal}
                >
                    {this.renderImage()}
                </TouchableOpacity>
                {this.renderAddMediaBottomSheet()}
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
        backgroundColor: '#F2F2F2',
    },
    borderedButtonStyles: {
        borderWidth: 2,
        borderColor: color.GM_DOT_GRAY,
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
