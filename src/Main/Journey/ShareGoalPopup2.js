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
import SvgImage1 from '../../asset/svgs/ShareGoalPopup2'
import SvgImage2 from '../../asset/svgs/Lightbulb'
import cancel from '../../asset/utils/cancel_no_background.png'
import DelayedButton from '../Common/Button/DelayedButton'

class ShareGoalPopup2 extends Component {
    constructor(props) {
        super(props)
    }

    renderButtons() {
        return (
            <>
                <TouchableWithoutFeedback
                    onPress={() => this.props.closeModal('invitefriendpopup')}
                >
                    <View style={styles.btnContainer1}>
                        <Text style={styles.btnText1}>Share My Goals</Text>
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
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <SvgImage2 />
                            <Text style={styles.title}>{`Did you know?`}</Text>
                        </View>
                        <View style={styles.svg}>
                            <SvgImage1 />
                        </View>
                        <Text style={styles.text}>
                            {`A survey we conducted revealed 79% of people having a strong desire to support their friends when they can. Give your friends the joy of supporting you today?`}
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
        paddingHorizontal: wp(4),
        paddingVertical: hp(2),
        backgroundColor: '#ffffff',
        alignSelf: 'center',
        justifyContent: 'space-between',
        height: hp(53.59),
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
    },
    svg: {
        alignSelf: 'center',
        marginVertical: hp(2),
    },
    btnText1: {
        color: '#ffffff',
        fontFamily: text.FONT_FAMILY.SEMI_BOLD,
        fontSize: hp(1.95),
    },
    title: {
        fontFamily: text.FONT_FAMILY.BOLD,
        fontSize: hp(2.39),
        paddingLeft: wp(3),
    },
    text: {
        fontFamily: text.FONT_FAMILY.REGULAR,
        fontSize: hp(2.25),
        textAlign: 'left',
        alignSelf: 'center',
        width: wp(76),
    },
    closeBtn: {
        justifyContent: 'center',
    },
})

export default connect(mapStateToProps)(ShareGoalPopup2)
