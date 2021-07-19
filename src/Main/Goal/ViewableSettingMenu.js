/** @format */

import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native'
import { connect } from 'react-redux'
import { walkthroughable, CopilotStep } from 'react-native-copilot-gm'

// Asset
import dropDown from '../../asset/utils/dropDown.png'

// Actions
import { default_style } from '../../styles/basic'
import { PRIVACY_OPTIONS } from '../../Utils/Constants'
import { Icon } from '@ui-kitten/components'
import { getButtonBottomSheetHeight } from '../../styles'
import BottomButtonsSheet from '../Common/Modal/BottomButtonsSheet'

const DEBUG_KEY = '[ ViewableSettingMenu Component ]'
const WalkableView = walkthroughable(View)

class ViewableSettingMenu extends Component {
    handleInfoIcon = () => {
        Alert.alert(
            'Share to goals feed',
            'Choosing this will make your goal appear on your friends’ home feed'
        )
    }

    handleOnClick = () => {
        this.bottomSheetRef && this.bottomSheetRef.open()
    }

    renderBottomSheet() {
        const options = PRIVACY_OPTIONS.map(
            ({ text, value, materialCommunityIconName }) => {
                return {
                    text: text,
                    icon: {
                        name: materialCommunityIconName,
                        pack: 'material-community',
                    },
                    onPress: () => {
                        this.bottomSheetRef.close()
                        this.props.callback(value)
                    },
                }
            }
        )
        // Options height + bottom space + bottom sheet handler height
        const sheetHeight = getButtonBottomSheetHeight(options.length)
        return (
            <BottomButtonsSheet
                ref={(r) => (this.bottomSheetRef = r)}
                buttons={options}
                height={sheetHeight}
            />
        )
    }

    render() {
        // Don't show caret if belongs to event or tribe
        let tutorialComponent = null
        if (this.props.tutorialOn && this.props.tutorialOn.shareToMastermind) {
            const {
                tutorialText,
                order,
                name,
            } = this.props.tutorialOn.shareToMastermind
            tutorialComponent = (
                <CopilotStep text={tutorialText} order={order} name={name}>
                    <WalkableView
                        style={{
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                        }}
                    />
                </CopilotStep>
            )
        }

        // PRIVACY_OPTIONS array only contains unique values, hence filter will return max 1 result
        const filteredOptions = PRIVACY_OPTIONS.filter(
            ({ value }) => this.props.privacy === value
        )
        const { text, materialCommunityIconName } =
            filteredOptions.length === 0
                ? PRIVACY_OPTIONS[0]
                : filteredOptions.pop()

        return (
            <View>
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.containerStyle}
                    onPress={this.handleOnClick}
                >
                    <Icon
                        style={[
                            default_style.normalIcon_1,
                            { tintColor: '#BDBDBD' },
                        ]}
                        pack="material-community"
                        name={materialCommunityIconName}
                    />
                    <Text
                        style={[
                            default_style.normalText_2,
                            {
                                width: 45,
                                color: '#9A9A9A',
                                marginHorizontal: 3,
                            },
                        ]}
                    >
                        {text}
                    </Text>
                    <Image style={styles.caretStyle} source={dropDown} />
                    {tutorialComponent}
                </TouchableOpacity>
                {this.renderBottomSheet()}
            </View>
        )
    }
}

const styles = {
    containerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 3,
        paddingHorizontal: 6,
        borderColor: '#E8E8E8',
        borderWidth: 1,
        borderRadius: 2,
    },
    caretStyle: {
        marginLeft: 3,
        width: 10,
        height: 10,
        tintColor: '#9A9A9A',
    },
}

export default connect(null, null)(ViewableSettingMenu)
