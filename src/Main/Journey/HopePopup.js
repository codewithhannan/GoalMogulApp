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
import SvgImage from '../../asset/svgs/HopePopup'
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
                        <Text style={styles.btnText1}>See the Question</Text>
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
                                {`Spread H.O.P.E\nHelp Other People Everyday`}
                            </Text>
                        </View>
                        <Text style={styles.text}>
                            {`Hey ${this.props.name}! It's our mission to help as many people as we can.`}
                        </Text>
                        <Text style={styles.text}>
                            {`Would you answer one quick question?`}
                        </Text>
                        <Text style={styles.text}>
                            {`When you do, you'll be automatically entered into a drawing for a prize.`}
                        </Text>
                        <View style={styles.svg}>
                            <SvgImage />
                        </View>
                        <Text style={styles.text}>
                            {`The drawing closes in one week, so don't delay.`}
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
        paddingVertical: hp(2.99),
        backgroundColor: '#ffffff',
        alignSelf: 'center',
        justifyContent: 'space-between',
        height: hp(69.16),
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
        width: wp(49.06),
        height: hp(5.23),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: wp(1),
        marginBottom: hp(1),
    },
    svg: {
        alignSelf: 'center',
        marginBottom: hp(2.39),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnText1: {
        color: '#ffffff',
        fontFamily: text.FONT_FAMILY.SEMI_BOLD,
        fontSize: hp(2.09),
    },
    title: {
        fontWeight: '600',
        width: wp(76),
        textAlign: 'center',
        fontSize: hp(2.39),
        marginBottom: hp(2.39),
    },
    text: {
        fontWeight: '400',
        fontSize: hp(2.39),
        textAlign: 'left',
        marginBottom: hp(2.39),
    },
})

export default connect(mapStateToProps)(InviteFriendsPopup)
