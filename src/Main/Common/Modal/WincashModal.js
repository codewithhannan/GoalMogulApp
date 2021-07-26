/**
 * This modal shows the congradulation message for user earning a new badge
 *
 * @format
 */

import React from 'react'
import { connect } from 'react-redux'
import { View, Image, Text, Animated, ImageBackground } from 'react-native'
import Constants from 'expo-constants'
import { LinearGradient } from 'expo-linear-gradient'
import Modal from 'react-native-modal'
import cancel from '../../../asset/utils/cancel_no_background.png'
import DelayedButton from '../../Common/Button/DelayedButton'
import {
    modalCancelIconContainerStyle,
    modalCancelIconStyle,
    modalContainerStyle,
    modalHeaderBadgeShadow,
} from '../../../styles'
import { color } from '../../../styles/basic'
import Wincash_banner from '../../../asset/image/wincash.png'
import ConfettiFadedBackground from '../../../asset/background/ConfettiBackground.png'
import { GM_BLUE } from '../../../styles/basic/color'
import { colors } from 'react-native-elements'

const { CheckIcon, QuestionIcon } = Icons
const DEBUG_KEY = '[ UI WinCashModal ]'

class WincashModal extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            numberLoaded: false,
            numberOfUsersOnSameBadge: undefined,
            showGoldBagdeInfoModal: false,
            showGoldBadgeRewardModal: false,
        }

        this.animations = {
            numberOfUsersOnSameBadgeOpacity: new Animated.Value(0),
        }
    }

    closeModal() {
        this.props.closeModal && this.props.closeModal()
    }

    renderCancelButton() {
        return (
            <View
                style={{ position: 'absolute', top: 0, right: 0, padding: 15 }}
            >
                <DelayedButton
                    activeOpacity={0.6}
                    onPress={() => this.closeModal()}
                    style={{
                        ...modalCancelIconContainerStyle,
                        backgroundColor: '#ffffff',
                    }}
                    disabled={this.state.showGoldBagdeInfoModal}
                >
                    <Image
                        source={cancel}
                        style={{
                            ...modalCancelIconStyle,
                            tintColor: colors.grey2,
                        }}
                    />
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
                // onModalShow={this.onModalShow}
                onBackdropPress={() => this.closeModal()}
                onSwipeComplete={() => this.closeModal()}
                swipeDirection="down"
                style={{
                    marginTop: Constants.statusBarHeight + 20,
                    borderRadius: 4,
                    height: 664,
                }}
            >
                <View
                    style={{
                        backgroundColor: color.GV_MODAL,
                        borderRadius: 4,
                    }}
                >
                    <View
                        style={{
                            ...modalContainerStyle,
                            backgroundColor: 'transparent',
                        }}
                    >
                        {this.renderCancelButton()}
                        <Text
                            style={{
                                color: 'rgb(51, 51, 51)',
                                fontSize: 18,
                                paddingVertical: 7,
                                fontWeight: 'bold',
                            }}
                        >
                            $$ Win Cash $$
                        </Text>
                        <View
                            style={{ alignItems: 'center', marginVertical: 15 }}
                        >
                            <Image
                                source={Wincash_banner}
                                style={{
                                    width: 295,
                                    height: 160,
                                    resizeMode: 'contain',
                                }}
                            />
                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                // marginVertical: 10,
                            }}
                        >
                            <Text
                                style={{
                                    textAlign: 'center',
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    lineHeight: 20,
                                }}
                            >
                                There are several ways to win cash on GoalMogul!
                                Here’s the most common:
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                marginVertical: 10,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    lineHeight: 20,
                                    color: colors.grey1,
                                }}
                            >
                                After you have earned the Silver Badge (Add 7
                                Goals and Invite 7 Friends who join GoalMogul),
                                then you qualify to participate in the H.O.P.E.
                                Challenge.{'\n'}
                                {'\n'}The H.O.P.E. Challenge runs once every two
                                weeks; this means you could win $100 twice a
                                month for doing what you love to do: Helping
                                Other People Everyday!{'\n'}
                                {'\n'}If you already earned the Silver Badge, be
                                sure to check your chat messages from Coachbot
                                Pedro for more details!
                            </Text>
                        </View>
                        <DelayedButton
                            activeOpacity={0.6}
                            onPress={() => this.closeModal()}
                            style={{
                                height: 30,
                                width: 184,
                                backgroundColor: '#45C9F6',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 2,
                            }}
                        >
                            <Text
                                style={{
                                    color: 'white',
                                    fontSize: 14,
                                    fontWeight: '600',
                                }}
                            >
                                OK
                            </Text>
                        </DelayedButton>
                    </View>
                </View>
            </Modal>
        )
    }
}

export default connect(null, null)(WincashModal)
