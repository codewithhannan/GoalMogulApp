/**
 * This is the group chat info modal on create group chats. This is currently
 * a template that is not being used anywhere. But in the future, we would
 * convert this to any modal in chat needed
 *
 * It uses the template of design at
 * @see https://app.zeplin.io/project/5d009c1e24480d5d9e3a7516/screen/5d09ba6095c353041690652a
 *
 * @format
 */

import React from 'react'
import { View, Text, Image } from 'react-native'
import Modal from 'react-native-modal'
import Icons from '../../../asset/base64/Icons'
import cancel from '../../../asset/utils/cancel_no_background.png'
import {
    modalCancelIconContainerStyle,
    modalCancelIconStyle,
    modalContainerStyle,
} from '../../../styles'
import DelayedButton from '../../Common/Button/DelayedButton'

const { CoinSackIcon } = Icons

class ChatInfoModal extends React.PureComponent {
    closeModal() {
        this.props.closeModal && this.props.closeModal()
    }

    renderCancelButton() {
        return (
            <View
                style={{ position: 'absolute', top: 0, left: 0, padding: 15 }}
            >
                <DelayedButton
                    activeOpacity={0.6}
                    onPress={() => this.closeModal()}
                    style={modalCancelIconContainerStyle}
                >
                    <Image source={cancel} style={modalCancelIconStyle} />
                </DelayedButton>
            </View>
        )
    }

    render() {
        return (
            <Modal
                backdropColor={'black'}
                backdropOpacity={0.5}
                isVisible={this.props.isVisible}
                onBackdropPress={() => this.closeModal()}
                onSwipeComplete={() => this.closeModal()}
                swipeDirection={['down']}
                swipeThreshold={20}
            >
                <View style={{ ...modalContainerStyle, padding: 25 }}>
                    {this.renderCancelButton()}
                    <View
                        style={{
                            marginTop: 10,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                        }}
                    >
                        <Image
                            source={CoinSackIcon}
                            style={{ height: 30, width: 30 }}
                        />
                        <Text
                            style={{
                                fontSize: 22,
                                marginLeft: 5,
                                color: 'rgb(51, 51, 51)',
                            }}
                        >
                            Coins
                        </Text>
                    </View>
                    {/* Divider */}
                    <View
                        style={{
                            width: '76%',
                            height: 0.5,
                            backgroundColor: 'rgb(238, 238, 238)',
                            marginVertical: 14,
                        }}
                    />
                    <View>
                        <Text style={{ fontSize: 17, marginBottom: 5 }}>
                            Earn more coins by:
                        </Text>
                        {coinInfoTextList.map((t) => {
                            const { text, hasBulletPoint } = t
                            if (hasBulletPoint) {
                                return (
                                    <Text
                                        style={{
                                            color: 'rgb(85, 85, 85)',
                                            fontSize: 14,
                                            lineHeight: 19,
                                        }}
                                    >
                                        {`\u2022 ${text}`}
                                    </Text>
                                )
                            }
                            return (
                                <Text
                                    style={{
                                        color: 'rgb(85, 85, 85)',
                                        fontSize: 14,
                                        marginBottom: 4,
                                        lineHeight: 19,
                                    }}
                                >
                                    {`   ${text}`}
                                </Text>
                            )
                        })}
                    </View>
                    {/* Divider */}
                    <View
                        style={{
                            width: '76%',
                            height: 0.5,
                            backgroundColor: 'rgb(238, 238, 238)',
                            marginVertical: 14,
                        }}
                    />
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text
                            style={{
                                color: 'rgb(0, 150, 203)',
                                fontSize: 12,
                                padding: 3,
                                fontStyle: 'italic',
                            }}
                        >
                            In the future you'll be able to redeem your
                        </Text>
                        <Text
                            style={{
                                color: 'rgb(0, 150, 203)',
                                fontSize: 12,
                                padding: 3,
                                fontStyle: 'italic',
                            }}
                        >
                            coins for useful things!
                        </Text>
                    </View>
                </View>
            </Modal>
        )
    }
}

const coinInfoTextList = [
    {
        text: 'Getting Likes, Comments, or Suggestions',
        hasBulletPoint: true,
    },
    {
        text: 'from other users',
        hasBulletPoint: false,
    },
    {
        text: 'Giving other users Suggestions that ',
        hasBulletPoint: true,
    },
    {
        text: 'receive Likes',
        hasBulletPoint: false,
    },
    {
        text: 'Adding other users to Tribes, Events,',
        hasBulletPoint: true,
    },
    {
        text: 'or Chatrooms',
        hasBulletPoint: false,
    },
]

export default ChatInfoModal
