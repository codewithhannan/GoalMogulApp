/** @format */

import React, { Component } from 'react'
import { View, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import { connect } from 'react-redux'
import Modal from 'react-native-modal'

import { GM_BLUE } from '../../styles/basic/color'
import * as text from '../../styles/basic/text'
import SvgImage1 from '../../asset/svgs/SuggestionPopup'

class SuggestionPopup extends Component {
    constructor(props) {
        super(props)
    }

    renderButtons() {
        return (
            <>
                <View
                    style={{ flexDirection: 'row', justifyContent: 'center' }}
                >
                    <TouchableWithoutFeedback
                        onPress={this.props.showSuggestion}
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

    render() {
        return (
            <Modal isVisible={this.props.isVisible} backdropOpacity={0.4}>
                <View style={styles.container}>
                    <View>
                        <Text style={styles.title}>{`Make a Suggestion?`}</Text>
                        <View style={styles.svg}>
                            <SvgImage1 />
                        </View>
                        <Text style={styles.text}>
                            {`${this.props.name} is more likely to achieve this goal if it is broken into Steps and Needs. Be the first to make a suggestion?`}
                        </Text>
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
        paddingVertical: hp(2),
        backgroundColor: '#ffffff',
        alignSelf: 'center',
        justifyContent: 'space-between',
        height: hp(48.49),
        width: wp(91.46),
        borderRadius: wp(2),
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

export default connect(mapStateToProps)(SuggestionPopup)
