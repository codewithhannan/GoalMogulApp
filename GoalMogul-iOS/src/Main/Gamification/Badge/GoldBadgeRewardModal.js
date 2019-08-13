/**
 * This modal displays reward info for gold badge
 */
import React from 'react';
import { View, Image, Text, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import { Constants } from 'expo';
import { modalContainerStyle, modalCancelIconContainerStyle, modalCancelIconStyle, modalHeaderBadgeShadow, APP_BLUE } from '../../../styles';
import DelayedButton from '../../Common/Button/DelayedButton';
import RichText from '../../Common/Text/RichText';
import { Gold3D } from '../../../asset/banner';
import { InviteFriendGuideImage } from '../../../asset/image';
import cancel from '../../../asset/utils/cancel_no_background.png';

const windowWith = Dimensions.get('window').width;

class GoldBadgeRewardModal extends React.PureComponent {

    closeModal() {
        this.props.closeModal && this.props.closeModal();
    }

    renderCancelButton() {
        return (
            <View style={{ position: 'absolute', top: 0, left: 0, padding: 15 }}>
                <DelayedButton
                    activeOpacity={0.6}
                    onPress={() => this.closeModal()}
                    style={modalCancelIconContainerStyle}
                >
                    <Image
                        source={cancel}
                        style={modalCancelIconStyle}
                    />
                </DelayedButton>
            </View>
        );
    }

    render() {
        return (
            <Modal
                backdropColor={'black'}
                isVisible={this.props.isVisible}
                backdropOpacity={0.7}
                style={{ marginTop: Constants.statusBarHeight + 15, borderRadius: 15 }}
            >
                <View style={{ ...modalContainerStyle, alignItems: 'flex-start' }}>
                    {this.renderCancelButton()}
                    <Text style={{ color: 'rgb(51, 51, 51)', fontWeight: '500', fontSize: 22, marginTop: 5, alignSelf: 'center' }}>Gold Badge Rewards</Text>

                    <Text style={styles.contentTextStyle}>Beginning September 1, 2019, be one of the first fifteen (15) users to attain Gold Badge status and GoalMogul Inc. will reward you with a USD $300.00 cash prize!</Text>
                    <Text style={styles.titleTextStyle}>IMPORTANT CONTEST DISCLAIMER:</Text>
                    <Text style={styles.titleTextStyle}>YOU MUST HAVE A PAYPAL OR VENMO ACCOUNT TO RECEIVE PAYMENT FROM US. IN ORDER TO AVOID FRAUDULENT ACTIVITY OR FAKE USER ACCOUNTS, UNFORTUNATELY WE WILL *NOT* BE ABLE TO SEND PAYMENT TO ANOTHER PERSON OR BY MAIL.  SORRY, NO EXCEPTIONS.</Text>
                    <Text style={styles.titleTextStyle}>INSTRUCTIONS:</Text>
                    <Text style={styles.contentTextStyle}>
                        After you receive a Gold Badge, follow these instructions to receive your cash prize:{"\n"}{"\n"}
                        Email <Text style={styles.emailTextStyle}>support@goalmogul.com</Text> with subject line "Gold Badge winner" and in the email let us know your
                    </Text>
                    {
                        bulletPointList.map(l => {
                            return (
                                <Text style={styles.contentTextStyle}>{`\u2022 ${l}`}</Text>
                            )
                        })
                    }
                    <Text>After we verify that you are one of the first fifteen (15) Gold Badge users, we will reply to your email to arrange online direct payment of USD$300.00 to you via Paypal or Venmo.</Text>
                    <Text>Please contact <Text style={styles.emailTextStyle}>support@goalmogul.com</Text> if you have any questions.</Text>
                </View>
            </Modal>
        );
    }
}

const styles = {
    titleTextStyle: {
        color: 'rgb(51, 51, 51)',
        fontSize: 17
    },
    contentTextStyle: {
        color: 'rgb(51, 51, 51)',
        fontSize: 14
    },
    emailTextStyle: {
        color: APP_BLUE,
        textDecorationLine: 'underline'
    }
};

const bulletPointList = [
    'Full Name', 
    'Mailing Address', 
    'Phone Number', 
    'the Approximate Date and Time you received your Gold Badge'
];

export default GoldBadgeRewardModal;
