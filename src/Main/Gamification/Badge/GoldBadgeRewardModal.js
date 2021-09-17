/**
 * This modal displays reward info for gold badge
 *
 * @format
 */

import React from 'react'
import { View, Image, Text, ScrollView, TextInput, Linking } from 'react-native'
import Modal from 'react-native-modal'
import Constants from 'expo-constants'
import {
    modalContainerStyle,
    modalCancelIconContainerStyle,
    modalCancelIconStyle,
} from '../../../styles'
import { color } from '../../../styles/basic'
import DelayedButton from '../../Common/Button/DelayedButton'
import cancel from '../../../asset/utils/cancel_no_background.png'

class GoldBadgeRewardModal extends React.PureComponent {
    closeModal() {
        this.props.closeModal && this.props.closeModal()
    }

    handleEmailOnPress = () => {
        Linking.openURL(
            `mailto:support@goalmogul.com?subject=Gold Badge winner&body=`
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
                <View
                    style={{
                        ...modalContainerStyle,
                        padding: 10,
                        alignItems: 'flex-start',
                        flex: 1,
                    }}
                >
                    {this.renderCancelButton()}
                    <Text
                        style={{
                            color: 'rgb(51, 51, 51)',
                            fontWeight: '500',
                            fontSize: 22,
                            marginTop: 20,
                            alignSelf: 'center',
                            marginBottom: 5,
                        }}
                    >
                        Gold Badge Rewards
                    </Text>
                    <ScrollView
                        contentContainerStyle={{ padding: 10 }}
                        persistentScrollbar
                        showsVerticalScrollIndicator
                    >
                        <TextInput
                            editable={false}
                            multiline
                            value={`Beginning September 1, 2019, be one of the first fifteen (15) users to attain Gold Badge status and GoalMogul Inc. will reward you with a USD $700.00 cash prize!\n`}
                            style={styles.contentTextStyle}
                        />
                        <TextInput
                            editable={false}
                            multiline
                            style={styles.titleTextStyle}
                            value={'IMPORTANT CONTEST DISCLAIMER:'}
                        />
                        <TextInput
                            editable={false}
                            multiline
                            style={styles.titleTextStyle}
                            value={`YOU MUST HAVE A PAYPAL OR VENMO ACCOUNT TO RECEIVE PAYMENT FROM US. IN ORDER TO AVOID FRAUDULENT ACTIVITY OR FAKE USER ACCOUNTS, UNFORTUNATELY WE WILL *NOT* BE ABLE TO SEND PAYMENT TO ANOTHER PERSON OR BY MAIL.  SORRY, NO EXCEPTIONS.\n`}
                        />
                        <TextInput
                            editable={false}
                            multiline
                            style={styles.titleTextStyle}
                            value={'INSTRUCTIONS:'}
                        />
                        <Text
                            style={styles.contentTextStyle}
                            editable={false}
                            multiline
                        >
                            After you receive a Gold Badge, follow these
                            instructions to receive your cash prize:{'\n'}
                            {'\n'}
                            Email{' '}
                            <Text
                                editable={false}
                                multiline
                                style={styles.emailTextStyle}
                                onPress={this.handleEmailOnPress}
                            >
                                support@goalmogul.com
                            </Text>{' '}
                            with subject line "Gold Badge winner" and in the
                            email let us know your
                        </Text>
                        {/* <Text selectable style={styles.contentTextStyle}>Beginning September 1, 2019, be one of the first fifteen (15) users to attain Gold Badge status and GoalMogul Inc. will reward you with a USD $700.00 cash prize!{`\n`}</Text>
                        <Text selectable style={styles.titleTextStyle}>IMPORTANT CONTEST DISCLAIMER:</Text>
                        <Text selectable style={styles.titleTextStyle}>YOU MUST HAVE A PAYPAL OR VENMO ACCOUNT TO RECEIVE PAYMENT FROM US. IN ORDER TO AVOID FRAUDULENT ACTIVITY OR FAKE USER ACCOUNTS, UNFORTUNATELY WE WILL *NOT* BE ABLE TO SEND PAYMENT TO ANOTHER PERSON OR BY MAIL.  SORRY, NO EXCEPTIONS.{"\n"}</Text>
                        <Text selectable style={styles.titleTextStyle}>INSTRUCTIONS:</Text>
                        <Text selectable style={styles.contentTextStyle}>
                            After you receive a Gold Badge, follow these instructions to receive your cash prize:{"\n"}{"\n"}
                            Email <Text selectable style={styles.emailTextStyle}>support@goalmogul.com</Text> with subject line "Gold Badge winner" and in the email let us know your
                        </Text> */}
                        {bulletPointList.map((l, i) => {
                            return (
                                <TextInput
                                    key={i}
                                    multiline
                                    editable={false}
                                    style={styles.contentTextStyle}
                                >{`\u2022 ${l}`}</TextInput>
                            )
                        })}
                        <TextInput
                            multiline
                            editable={false}
                            style={styles.contentTextStyle}
                        >
                            {'\n'}After we verify that you are one of the first
                            fifteen (15) Gold Badge users, we will reply to your
                            email to arrange online direct payment of USD$300.00
                            to you via Paypal or Venmo.
                        </TextInput>
                        <Text selectable style={styles.contentTextStyle}>
                            {'\n'}Please contact{' '}
                            <Text
                                onPress={this.handleEmailOnPress}
                                style={styles.emailTextStyle}
                            >
                                support@goalmogul.com
                            </Text>{' '}
                            if you have any questions.
                        </Text>
                    </ScrollView>
                </View>
            </Modal>
        )
    }
}

const styles = {
    titleTextStyle: {
        color: 'rgb(51, 51, 51)',
        fontSize: 16,
        lineHeight: 17,
    },
    contentTextStyle: {
        color: 'rgb(51, 51, 51)',
        fontSize: 14,
        lineHeight: 17,
    },
    emailTextStyle: {
        color: color.GM_BLUE,
        textDecorationLine: 'underline',
    },
}

const bulletPointList = [
    ' Full Name',
    ' Mailing Address',
    ' Phone Number',
    ' Approximate Date and Time you received   your Gold Badge',
]

export default GoldBadgeRewardModal
