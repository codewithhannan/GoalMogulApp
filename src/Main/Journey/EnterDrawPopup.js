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
import Icon from 'react-native-vector-icons/MaterialIcons'

class EnterDrawPopup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            opt1: false,
            opt2: false,
            opt3: false,
            opt4: false,
            opt5: false,
            opt6: false,
            opt7: false,
            opt8: false,
            opt9: false,
            opt10: false,
        }
    }

    options = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

    renderOptions(options) {
        return options.map((option, index) => (
            <View style={styles.optContainer}>
                <Text style={styles.optText}>{option}</Text>
                <TouchableWithoutFeedback
                    onPress={() => this.handleCheckbox(`opt${index}`)}
                >
                    <Icon
                        name={
                            this.state[`opt${index}`]
                                ? 'radio-button-checked'
                                : 'radio-button-unchecked'
                        }
                        style={
                            this.state[`opt${index}`]
                                ? styles.btnChecked
                                : styles.btnUnchecked
                        }
                    />
                </TouchableWithoutFeedback>
            </View>
        ))
    }

    handleCheckbox(opt) {
        this.setState({ [opt]: !this.state[opt] })
    }

    renderButtons() {
        return (
            <>
                <TouchableWithoutFeedback>
                    <View style={styles.btnContainer}>
                        <Text style={styles.btnText}>Submit Entry</Text>
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
                                {`Answer to Enter the Drawing`}
                            </Text>
                        </View>
                        <Text style={styles.text}>
                            {`On a scale of 1-10, how important is it for you to help your friends whenever you have the opportunity to do so?\n(10 = most important, 1 = least important)`}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                    >
                        {this.renderOptions(this.options)}
                    </View>
                    {this.renderButtons()}
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
        height: hp(39.52),
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
        width: wp(52.5),
        height: hp(5.24),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: wp(1),
        marginTop: hp(2.39),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnText: {
        color: '#ffffff',
        fontFamily: text.FONT_FAMILY.SEMI_BOLD,
        fontSize: hp(2.09),
    },
    title: {
        fontWeight: '600',
        textAlign: 'center',
        fontSize: hp(2.39),
    },
    text: {
        fontFamily: text.FONT_FAMILY.REGULAR,
        fontSize: hp(2.09),
        textAlign: 'left',
        marginVertical: hp(2.39),
    },
    optContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: hp(0.85),
    },
    optText: {
        fontSize: hp(2.09),
        fontWeight: '400',
        marginBottom: hp(0.44),
    },
    btnChecked: {
        color: GM_BLUE,
        fontSize: hp(2.8),
    },
    btnUnchecked: {
        color: '#BDBDBD',
        fontSize: hp(2.8),
    },
})

export default connect(mapStateToProps, {
    openPopup,
})(EnterDrawPopup)
