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
import { openPopup } from '../../actions'
import SvgImage from '../../asset/svgs/ShareGoalPopup1'
import cancel from '../../asset/utils/cancel_no_background.png'
import DelayedButton from '../Common/Button/DelayedButton'

class ShareGoalPopup1 extends Component {
    constructor(props) {
        super(props)
    }

    renderButtons() {
        return (
            <>
                <TouchableWithoutFeedback>
                    <View style={styles.btnContainer1}>
                        <Text style={styles.btnText1}>Share My Goals</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback>
                    <View style={styles.btnContainer2}>
                        <Text style={styles.btnText2}>No, thanks</Text>
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
        console.log('\n Props passed to popup modal', this.props)
        // this.props.openPopup(popupName)
        return (
            <Modal isVisible={this.props.isVisible}>
                <View style={styles.container}>
                    {this.renderCancelButton()}
                    <View>
                        <View style={styles.header}>
                            <Text style={styles.title}>
                                {`Share with Friends`}
                            </Text>
                        </View>
                        <Text style={styles.text}>
                            {`Do you know someone who would be happy to keep up with your life?\n\nHow about sharing your goals with them?`}
                        </Text>
                        <View style={styles.svg}>
                            <SvgImage />
                        </View>
                    </View>
                    <View>{this.renderButtons()}</View>
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
        paddingVertical: hp(1.5),
        backgroundColor: '#ffffff',
        alignSelf: 'center',
        justifyContent: 'space-between',
        height: hp(59.58),
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
    btnContainer2: {
        backgroundColor: '#ffffff',
        width: wp(52.5),
        height: hp(5.24),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: wp(1),
        borderWidth: 2,
        borderColor: GM_BLUE,
        marginBottom: hp(1),
    },
    svg: {
        alignSelf: 'center',
        marginVertical: hp(2),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnText1: {
        color: '#ffffff',
        fontFamily: text.FONT_FAMILY.SEMI_BOLD,
        fontSize: hp(1.95),
    },
    btnText2: {
        color: GM_BLUE,
        fontFamily: text.FONT_FAMILY.SEMI_BOLD,
        fontSize: hp(1.95),
    },
    title: {
        fontFamily: text.FONT_FAMILY.BOLD,
        width: wp(76),
        textAlign: 'center',
        fontSize: hp(2.39),
    },
    text: {
        fontFamily: text.FONT_FAMILY.REGULAR,
        fontSize: hp(2.25),
        textAlign: 'left',
        width: wp(76),
        marginTop: hp(1),
    },
    closeBtn: {
        justifyContent: 'center',
    },
})

export default connect(mapStateToProps, {
    openPopup,
})(ShareGoalPopup1)
