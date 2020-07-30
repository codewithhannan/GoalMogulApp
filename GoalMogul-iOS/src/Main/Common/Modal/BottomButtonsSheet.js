/** @format */

import React from 'react'
import { View, Image, Text } from 'react-native'
import { default_style } from '../../../styles/basic'
import DelayedButton from '../Button/DelayedButton'
import BottomSheet from './BottomSheet'

/**
 * This bottom sheet uses https://github.com/nysamnang/react-native-raw-bottom-sheet#readme
 * and follows the pattern https://developer.apple.com/design/human-interface-guidelines/ios/app-architecture/modality/
 */
class BottomButtonsSheet extends React.PureComponent {
    open = () => this.bottomSheetRef.open()

    close = () => this.bottomSheetRef.close()

    renderContent() {
        let items = this.props.buttons.map((item) => {
            const {
                image,
                text,
                onPress,
                textStyle,
                imageStyle,
                ...otherProps
            } = item

            // context is passed into the onPress tot let it handle itself
            return (
                <DelayedButton
                    onPress={onPress}
                    key={text}
                    style={{
                        backgroundColor: 'white',
                        flexDirection: 'row',
                        padding: 10,
                        alignItems: 'center',
                    }}
                    {...otherProps}
                >
                    {image ? (
                        <Image
                            source={image}
                            style={[styles.defaultImageStyle, imageStyle]}
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
            <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                {items}
            </View>
        )
    }

    render() {
        const { buttons } = this.props
        if (!buttons || buttons.length === 0) return null

        return (
            <BottomSheet ref={(r) => (this.bottomSheetRef = r)}>
                {this.renderContent()}
            </BottomSheet>
        )
    }
}

const styles = {
    defaultImageStyle: {
        height: 22,
        width: 22,
        marginRight: 10,
    },
}

export default BottomButtonsSheet
