/**
 * This modal holds info for how to earn gold badge.
 *
 * @format
 */

import React from 'react'
import { View, Image, Text, Dimensions } from 'react-native'
import Modal from 'react-native-modal'
import Constants from 'expo-constants'
import {
    modalContainerStyle,
    modalCancelIconContainerStyle,
    modalCancelIconStyle,
    modalHeaderBadgeShadow,
} from '../../../styles'
import DelayedButton from '../../Common/Button/DelayedButton'
import { Gold3D } from '../../../asset/banner'
import { InviteFriendGuideImage } from '../../../asset/image'
import cancel from '../../../asset/utils/cancel_no_background.png'

const windowWith = Dimensions.get('window').width

class GoldBadgeInfoModal extends React.PureComponent {
    closeModal() {
        this.props.closeModal && this.props.closeModal()
    }

    renderGoldBadge() {
        return (
            <View style={{ ...modalHeaderBadgeShadow, marginTop: 10 }}>
                <View style={{ height: 5, width: '100%' }} />
                <View
                    style={{
                        height: 60,
                        width: 60,
                        borderRadius: 30,
                        backgroundColor: 'white',
                    }}
                />
                <View
                    style={{
                        position: 'absolute',
                        top: 3,
                        bottom: 3,
                        left: 3,
                        right: 3,
                        alignItems: 'center',
                    }}
                >
                    <Image source={Gold3D} style={{ height: 55, width: 50 }} />
                </View>
            </View>
        )
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
                backdropOpacity={0.5}
                isVisible={this.props.isVisible}
                onBackdropPress={() => this.closeModal()}
                style={{
                    marginTop: Constants.statusBarHeight + 15,
                    borderRadius: 15,
                }}
            >
                <View style={modalContainerStyle}>
                    {this.renderCancelButton()}
                    <Text
                        style={{
                            color: 'rgb(51, 51, 51)',
                            fontWeight: '500',
                            fontSize: 22,
                            marginTop: 5,
                        }}
                    >
                        The Gold Badge
                    </Text>
                    {this.renderGoldBadge()}
                    {/* Divider */}
                    <View
                        style={{
                            width: '76%',
                            height: 0.5,
                            backgroundColor: 'rgb(238, 238, 238)',
                            marginVertical: 14,
                        }}
                    />
                    <Text
                        style={{
                            fontSize: 15,
                            lineHeight: 18,
                            color: 'rgb(51, 51, 51)',
                        }}
                    >
                        You will be awarded the gold badge when you have invited
                        10 Silver/Gold badge friends with your personal invite
                        link.
                    </Text>

                    <Text
                        style={{
                            fontSize: 15,
                            lineHeight: 17,
                            color: 'rgb(51, 51, 51)',
                            marginTop: 10,
                        }}
                    >
                        Get your personal invite link by visiting the friends
                        tab as pressing{' '}
                        <Text style={{ fontWeight: '600' }}>
                            "Invite friends now"
                        </Text>
                    </Text>

                    <Image
                        source={InviteFriendGuideImage}
                        style={{
                            width: windowWith * 0.76,
                            height: (windowWith * 0.76 * 582) / 750,
                            borderRadius: 10,
                            marginTop: 10,
                        }}
                        resizeMode="cover"
                    />
                </View>
            </Modal>
        )
    }
}

export default GoldBadgeInfoModal
