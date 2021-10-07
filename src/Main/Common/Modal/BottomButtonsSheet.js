/**
 * /* @format
 *
 * @format
 */

import React, { Component } from 'react'
import { View, Image, Text, TouchableOpacity } from 'react-native'

import { default_style, color } from '../../../styles/basic'
import DelayedButton from '../Button/DelayedButton'
import BottomSheet from './BottomSheet'
import { Icon } from '@ui-kitten/components'
import ChatGallery from '../../../asset/background/FeedbackScreenShot.png'
import ChatCamera from '../../../asset/background/ChatCamera.png'
import AudioModal from '../../../components/AudioModal'

/**
 * This bottom sheet uses https://github.com/nysamnang/react-native-raw-bottom-sheet#readme
 * and follows the pattern https://developer.apple.com/design/human-interface-guidelines/ios/app-architecture/modality/
 */

class BottomButtonsSheet extends Component {
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
                        this.close()
                        setTimeout(() => {
                            onPress && onPress()
                        }, 500)
                    }}
                    key={Math.random().toString(36).substr(2, 9)}
                    style={{
                        backgroundColor: color.GM_CARD_BACKGROUND,
                        flexDirection: 'row',
                        paddingVertical: 12,
                        alignItems: 'center',
                    }}
                    {...otherProps}
                >
                    {/* {/ First try to render image and then Icon /} */}
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

                    {/* {/ <Image /> /} */}
                    <Text style={[default_style.goalTitleText_1, textStyle]}>
                        {text}
                    </Text>
                </DelayedButton>
            )
        })
        if (this.props.chatGallary) {
            return (
                <View
                    style={{
                        backgroundColor: '#E5F7FF',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 150,
                        width: '90%',
                        alignSelf: 'center',
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            this.close()
                            setTimeout(() => {
                                this.props.chatGallaryPress()
                            }, 500)
                        }}
                    >
                        <Image
                            source={ChatGallery}
                            style={{
                                height: 50,
                                width: 50,
                                alignSelf: 'center',
                            }}
                            resizeMode="contain"
                        />
                        <Text style={{ color: '#42C0F5' }}>
                            Open Camera Roll
                        </Text>
                    </TouchableOpacity>
                </View>
            )
        } else if (this.props.chatCameraPress) {
            return (
                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 150,
                        width: '90%',
                        alignSelf: 'center',
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            this.close()
                            setTimeout(() => {
                                this.props.chatCameraPress()
                            }, 500)
                        }}
                    >
                        <Image
                            source={ChatCamera}
                            style={{
                                height: 60,
                                width: 60,
                                alignSelf: 'center',
                            }}
                            resizeMode="contain"
                        />
                        <Text style={{ color: '#42C0F5', marginTop: 8 }}>
                            Open Camera
                        </Text>
                    </TouchableOpacity>
                </View>
            )
        } else if (this.props.commentRecordingPress) {
            return (
                <AudioModal
                    onClose={this.close}
                    pageId={this.props.pageId}
                    goalDetail={this.props.item}
                    commentType
                />
            )
        } else if (this.props.chatRecordingPress) {
            return (
                <AudioModal
                    onClose={this.close}
                    chatType
                    chatUser={this.props.user}
                    chatMessages={this.props.messages}
                    chatRoom={this.props.chatRoom}
                />
            )
        } else {
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
    }

    render() {
        // console.log("THIS IS ITEM SHARE",this.props.closeSheetOnOptionPress);
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
