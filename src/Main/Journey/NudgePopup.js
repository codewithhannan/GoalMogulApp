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
import SvgImage1 from '../../asset/svgs/NudgePopup'
import cancel from '../../asset/utils/cancel_no_background.png'
import DelayedButton from '../Common/Button/DelayedButton'
import { addNudge, NUDGE_TYPES } from '../../actions/NudgeActions'

class NudgePopup extends Component {
    constructor(props) {
        super(props)
    }

    renderButtons() {
        const { owner, goalId } = this.props
        return (
            <>
                <View
                    style={{ flexDirection: 'row', justifyContent: 'center' }}
                >
                    <TouchableWithoutFeedback
                        onPress={() => {
                            this.props.addNudge(
                                owner._id,
                                this.props.token,
                                NUDGE_TYPES.clarifyGoals,
                                null,
                                goalId
                            )
                            this.props.closeModal()
                        }}
                    >
                        <View style={styles.btnContainer1}>
                            <Text style={styles.btnText1}>YES</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={this.props.closeModal}>
                        <View style={styles.btnContainer2}>
                            <Text style={styles.btnText2}>NO</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
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
                    onPress={this.props.closeModal}
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
            <Modal isVisible={this.props.isVisible} backdropOpacity={0.4}>
                <View style={styles.container}>
                    <View>
                        <Text
                            style={styles.title}
                        >{`Nudge ${this.props.name}?`}</Text>
                        <View style={styles.svg}>
                            <SvgImage1 />
                        </View>
                        <Text style={styles.text}>
                            {`How about nudging ${this.props.name} to set his own Steps or Needs?`}
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
    const visitedUser = state.profile.userId.userId
    const { owner, _id } = state.goalDetail.goal.goal
    const { token } = state.auth.user
    // console.log('THIS IS STATEEEE', state)
    return {
        user,
        isVisible,
        closeModal,
        visitedUser,
        token,
        owner,
        goalId: _id,
    }
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: wp(4),
        paddingVertical: hp(2),
        backgroundColor: '#ffffff',
        alignSelf: 'center',
        justifyContent: 'space-between',
        height: hp(48.49),
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
        width: wp(25.33),
        height: hp(5.09),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: wp(1),
        marginHorizontal: wp(1.5),
    },
    btnContainer2: {
        backgroundColor: '#ffffff',
        width: wp(25.33),
        height: hp(5.09),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: wp(1),
        borderColor: GM_BLUE,
        borderWidth: wp(0.3),
        marginHorizontal: wp(1.5),
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
    btnText2: {
        color: GM_BLUE,
        fontFamily: text.FONT_FAMILY.SEMI_BOLD,
        fontSize: hp(1.95),
    },
    title: {
        fontFamily: text.FONT_FAMILY.BOLD,
        fontSize: hp(2.39),
    },
    text: {
        fontFamily: text.FONT_FAMILY.REGULAR,
        fontSize: hp(2.25),
        textAlign: 'left',
        width: wp(76),
    },
    closeBtn: {
        justifyContent: 'center',
    },
})

export default connect(mapStateToProps, { addNudge })(NudgePopup)
