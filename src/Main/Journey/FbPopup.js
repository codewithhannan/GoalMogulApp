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
import SvgImage from '../../asset/svgs/FbPopup'
import cancel from '../../asset/utils/cancel_no_background.png'
import DelayedButton from '../Common/Button/DelayedButton'

class PopupFB extends Component {
    constructor(props) {
        super(props)
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

    renderButton() {
        return (
            <>
                <TouchableWithoutFeedback>
                    <View style={styles.btnContainer}>
                        <Text style={styles.btnText}>Share to Facebook</Text>
                    </View>
                </TouchableWithoutFeedback>
            </>
        )
    }

    render() {
        return (
            <Modal isVisible={this.props.isVisible} backdropOpacity={0.5}>
                <View style={styles.container}>
                    <View>
                        <View style={styles.header}>
                            <Text style={styles.title}>
                                {`Share your goal to Facebook!`}
                            </Text>
                        </View>
                        <View style={styles.svg}>
                            <SvgImage />
                        </View>
                        <Text style={styles.text}>
                            {`Adding your goal made you 42% more likely to achieve it.\n\nYou can improve your odds by telling friends about it!`}
                        </Text>
                    </View>
                    <View>{this.renderButton()}</View>
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
        height: hp(46.55),
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
    btnContainer: {
        backgroundColor: GM_BLUE,
        width: wp(49.5),
        height: hp(5.24),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: wp(1),
    },
    svg: {
        alignSelf: 'center',
        marginVertical: hp(3),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        width: wp(70),
    },
    btnText: {
        color: '#ffffff',
        fontFamily: text.FONT_FAMILY.SEMI_BOLD,
        fontSize: hp(1.95),
    },
    title: {
        fontFamily: text.FONT_FAMILY.BOLD,
        textAlign: 'left',
        fontSize: hp(2.39),
    },
    text: {
        fontFamily: text.FONT_FAMILY.REGULAR,
        fontSize: hp(2.25),
        textAlign: 'left',
        width: wp(76),
        paddingLeft: wp(2),
    },
    closeBtn: {
        justifyContent: 'center',
    },
})

export default connect(mapStateToProps)(PopupFB)
