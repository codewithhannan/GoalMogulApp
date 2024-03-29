/** @format */

import React from 'react'
import { View, Image, Text } from 'react-native'
import { default_style, color } from '../../../styles/basic'
import DelayedButton from '../Button/DelayedButton'
import BottomSheet from './BottomSheet'
import { Icon } from '@ui-kitten/components'

/**
 * This bottom sheet uses https://github.com/nysamnang/react-native-raw-bottom-sheet#readme
 * and follows the pattern https://developer.apple.com/design/human-interface-guidelines/ios/app-architecture/modality/
 */
class BottomButtonsSheet extends React.PureComponent {
    open = () => this.bottomSheetRef.open()

    close = () => this.bottomSheetRef.close()

    renderContent = () => {
        let items = this.props.buttons.map((item) => {
            const {
                image,
                text,
                onPress,
                textStyle,
                imageStyle,
                iconStyle,
                icon,
                closeSheetOnOptionPress,
                ...otherProps
            } = item

            // context is passed into the onPress tot let it handle itself
            return (
                <DelayedButton
                    onPress={() => {
                        onPress && onPress()
                        if (closeSheetOnOptionPress) this.close()
                    }}
                    key={text}
                    style={{
                        backgroundColor: color.GM_CARD_BACKGROUND,
                        flexDirection: 'row',
                        paddingVertical: 12,
                        alignItems: 'center',
                    }}
                    {...otherProps}
                >
                    {/* First try to render image and then Icon */}
                    {image ? (
                        <Image
                            source={image}
                            style={[styles.defaultImageStyle, imageStyle]}
                        />
                    ) : icon ? (
                        <Icon
                            {...icon}
                            style={[styles.defaultIconStyle, iconStyle]}
                        />
                    ) : null}
                    {/* <Image /> */}
                    <Text style={[default_style.goalTitleText_1, textStyle]}>
                        {text}
                    </Text>
                </DelayedButton>
            )
        })
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'flex-start',
                    paddingHorizontal: 16,
                }}
            >
                {items}
            </View>
        )
    }

    render() {
        const { buttons, ...otherProps } = this.props
        if (!buttons || buttons.length === 0) return null

        return (
            <BottomSheet ref={(r) => (this.bottomSheetRef = r)} {...otherProps}>
                {this.renderContent()}
            </BottomSheet>
        )
    }
}

const styles = {
    defaultImageStyle: {
        height: 24,
        width: 24,
        marginRight: 12,
    },
    defaultIconStyle: {
        height: 24,
        color: 'black',
        marginRight: 12,
    },
}

export default BottomButtonsSheet
