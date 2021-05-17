/** @format */

import React, { Component } from 'react'
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableWithoutFeedback,
} from 'react-native'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import { connect } from 'react-redux'
import Modal from 'react-native-modal'

import { GM_BLUE } from '../../styles/basic/color'
import * as text from '../../styles/basic/text'
import SvgImage from '../../asset/svgs/ShareGoalPopup1'
import cancel from '../../asset/utils/cancel_no_background.png'
import DelayedButton from '../Common/Button/DelayedButton'

class InviteFriendsPopup extends Component {
    constructor(props) {
        super(props)
    }

    renderButtons() {
        return (
            <>
                <TouchableWithoutFeedback
                    onPress={() => this.props.closeModal(true)}
                >
                    <View style={styles.btnContainer1}>
                        <Text style={styles.btnText1}>Invite Friends</Text>
                    </View>
                </TouchableWithoutFeedback>
            </>
        )
    }

    renderCancelButton() {
        return (
            <View
                style={{ position: 'absolute', top: 0, right: 0, padding: 10 }}
            >
                <DelayedButton
                    activeOpacity={0.6}
                    onPress={() => this.props.closeModal()}
                    style={styles.modalCancelIconContainerStyle}
                >
                    <Image
                        source={cancel}
                        style={styles.modalCancelIconStyle}
                    />
                </DelayedButton>
            </View>
        )
    }

    render() {
        return (
            <Modal isVisible={this.props.isVisible}>
                <View style={styles.container}>
                    <View>
                        <View style={styles.header}>
                            <Text style={styles.title}>
                                {`Increase Your Chances of Winning`}
                            </Text>
                        </View>
                        <View style={styles.svg}>
                            <SvgImage />
                        </View>
                        <Text style={styles.text}>
                            {`Thank you. Your entry has been submitted. A winner will be selected every week!\n\nGoalMogul makes it easy to find out your friend's goals. Invite a few friends so you can delight in helping them?`}
                        </Text>
                    </View>
                    <View>{this.renderButtons()}</View>
                    {this.renderCancelButton()}
                </View>
            </Modal>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const user = state.user
    const { isVisible, closeModal } = ownProps
    return {
        user,
        isVisible,
        closeModal,
    }
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: wp(5.86),
        paddingVertical: hp(1.5),
        backgroundColor: '#ffffff',
        alignSelf: 'center',
        justifyContent: 'space-between',
        height: hp(62.52),
        width: wp(91.46),
        borderRadius: wp(2),
    },
    modalCancelIconContainerStyle: {
        height: 30,
        width: 30,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
    },
    modalCancelIconStyle: {
        height: 14,
        width: 14,
        tintColor: 'black',
    },
    btnContainer1: {
        backgroundColor: GM_BLUE,
        width: wp(52.5),
        height: hp(5.24),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: wp(1),
        marginBottom: hp(1),
    },
    svg: {
        alignSelf: 'center',
        marginVertical: hp(2),
    },
    header: {
        width: wp(68),
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnText1: {
        color: '#ffffff',
        fontFamily: text.FONT_FAMILY.SEMI_BOLD,
        fontSize: hp(1.95),
    },
    title: {
        fontWeight: '600',
        textAlign: 'center',
        fontSize: hp(2.39),
    },
    text: {
        fontFamily: text.FONT_FAMILY.REGULAR,
        fontSize: hp(2.25),
        textAlign: 'left',
        // marginTop: hp(1),
    },
    closeBtn: {
        justifyContent: 'center',
    },
})

export default connect(mapStateToProps)(InviteFriendsPopup)
