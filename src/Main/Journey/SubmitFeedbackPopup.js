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
import cancel from '../../asset/utils/cancel_no_background.png'
import DelayedButton from '../Common/Button/DelayedButton'

class SubmitFeedbackPopup extends Component {
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

    render() {
        return (
            <Modal
                isVisible={this.props.isVisible}
                animationIn="zoomInUp"
                animationInTiming={400}
            >
                <View style={styles.container}>
                    <View>
                        <View style={styles.header}>
                            <Text style={styles.title}>{`Thank You!`}</Text>
                        </View>
                        <Text style={styles.text}>
                            {`We'll use your feedback to improve your GoalMogul Experience`}
                        </Text>
                    </View>
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
        paddingRight: wp(4),
        paddingLeft: wp(8),
        paddingVertical: hp(2.5),
        backgroundColor: '#ffffff',
        alignSelf: 'center',
        justifyContent: 'space-between',
        height: hp(18.26),
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontFamily: text.FONT_FAMILY.BOLD,
        width: wp(76),
        textAlign: 'left',
        fontSize: hp(2.39),
    },
    text: {
        fontFamily: text.FONT_FAMILY.REGULAR,
        fontSize: hp(2.25),
        textAlign: 'left',
        marginTop: hp(2.2),
    },
})

export default connect(mapStateToProps)(SubmitFeedbackPopup)
