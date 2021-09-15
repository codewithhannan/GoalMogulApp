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
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native'

import { color } from '../../styles/basic'
import { Icon, withStyles } from '@ui-kitten/components'
import { getButtonBottomSheetHeight } from '../../styles'
import BottomButtonsSheet from './Modal/BottomButtonsSheet'

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
            imageSource = icon
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
        const { rounded, bordered, imageUri, icon } = this.props
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
                {/* Only render edit icon if there is existing images */}
                {imageUri || icon ? (
                    <TouchableOpacity onPress={this.openAddMediaModal}>
                        <View style={styles.iconContainerStyle}>
                            <Icon
                                name="edit"
                                pack="material"
                                style={styles.editIconStyle}
                            />
                        </View>
                    </TouchableOpacity>
                ) : null}
                {this.renderAddMediaBottomSheet()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    buttonStyles: {
        width: '100%',
        height: '100%',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    roundedButtonStyles: {
        borderRadius: 180,
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
    defaultImageStyle: {
        height: 40,
        width: 40,
    },
    roundedImageStyles: {
        borderRadius: 180,
    },
    // Image related styles
    iconContainerStyle: {
        position: 'absolute',
        bottom: 0,
        right: 0,

        width: 40,
        height: 40,
        borderRadius: 20,
        borderColor: '#DDD',
        borderWidth: 0.5,

        alignItems: 'center',
        justifyContent: 'center',

        backgroundColor: 'white',
        shadowColor: '#DDD',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 1,
        elevation: 1,
        zIndex: 2,
    },
    editIconStyle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        tintColor: '#BBB',
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
