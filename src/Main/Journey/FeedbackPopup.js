/**
 * This modal shows content from the bottom of the screen, currently used in About for Tribes.
 *
 * @format
 */

import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import {
    View,
    Image,
    Text,
    TouchableWithoutFeedback,
    TextInput,
} from 'react-native'
import Constants from 'expo-constants'
import Modal from 'react-native-modal'
import cancel from '../../asset/utils/cancel_no_background.png'
import DelayedButton from '../Common/Button/DelayedButton'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import { Formik } from 'formik'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { GM_BLUE } from '../../styles/basic/color'
import * as text from '../../styles/basic/text'

class BottomModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            opt0: false,
            opt1: false,
            opt2: false,
            opt3: false,
            opt4: false,
        }
    }

    options = [
        `I don't believe I can achieve my goals`,
        `I don't want to be judged and criticized`,
        `There's no good reason to share my goals`,
        `I want to first explore the app more`,
        `Other`,
    ]

    renderOptions(options, setFieldValue) {
        return options.map((option, index) => (
            <View style={styles.optContainer}>
                <TouchableWithoutFeedback
                    onPress={() =>
                        this.handleCheckbox(`opt${index}`, setFieldValue, index)
                    }
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
                <Text style={styles.optText}>{option}</Text>
            </View>
        ))
    }

    handleCheckbox(opt, setFieldValue, index) {
        this.setState({ [opt]: !this.state[opt] }, () => {
            if (index != this.options.length - 1) {
                setFieldValue(opt, this.state[opt] ? this.options[index] : '')
            } else if (index == this.options.length - 1 && !this.state[opt]) {
                setFieldValue(opt, '')
            }
        })
    }

    closeModal() {
        this.props.closeModal && this.props.closeModal()
    }

    renderButton(handleSubmit) {
        return (
            <>
                <TouchableWithoutFeedback onPress={handleSubmit}>
                    <View style={styles.btnContainer}>
                        <Text style={styles.btnText}>Submit</Text>
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
                    onPress={() => this.closeModal()}
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
                backdropColor={'black'}
                backdropOpacity={0.5}
                isVisible={this.props.isVisible}
                onModalShow={this.onModalShow}
                onBackdropPress={() => this.closeModal()}
                onSwipeComplete={() => this.closeModal()}
                swipeDirection={'down'}
                style={{
                    marginTop: Constants.statusBarHeight + 15,
                    borderRadius: 15,
                    margin: 0,
                }}
            >
                <View
                    style={{
                        backgroundColor: 'white',
                        width: '100%',
                        position: 'absolute',
                        bottom: 0,
                        borderRadius: 5,
                    }}
                >
                    <View
                        style={{
                            ...styles.modalContainerStyle,
                            height: this.state.opt4 ? hp(67.04) : hp(52.74),
                        }}
                    >
                        <View
                            style={{
                                borderBottomColor: '#C4C4C4',
                                borderBottomWidth: hp(0.4),
                                borderRadius: wp(1),
                                marginVertical: hp(0.65),
                                width: wp(10.66),
                                alignSelf: 'center',
                            }}
                        />
                        <Text style={styles.title}>
                            Your Feedback is Super Important!
                        </Text>
                        <Text style={styles.text}>
                            {`We really want to help you enjoy GoalMogul as much as possible.`}
                        </Text>
                        <View
                            style={{
                                borderBottomColor: '#D7D7D7',
                                borderBottomWidth: hp(0.2),
                                marginBottom: hp(1.2),
                                width: '100%',
                            }}
                        />
                        <Text style={styles.text}>
                            {`Can you tell us why not? (Check all that apply)`}
                        </Text>
                        <Formik
                            initialValues={{
                                opt0: '',
                                opt1: '',
                                opt2: '',
                                opt3: '',
                                opt4: '',
                            }}
                            onSubmit={(values, actions) => {
                                this.props.closeModal(true, values)
                                actions.setSubmitting(false)
                            }}
                        >
                            {(props) => [
                                this.renderOptions(
                                    this.options,
                                    props.setFieldValue
                                ),
                                this.state.opt4 && (
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            placeholder={`Write Something`}
                                            multiline={true}
                                            style={styles.inputText}
                                            onChangeText={props.handleChange(
                                                'opt4'
                                            )}
                                        />
                                    </View>
                                ),
                                this.renderButton(props.handleSubmit),
                            ]}
                        </Formik>
                        {this.renderCancelButton()}
                    </View>
                </View>
            </Modal>
        )
    }
}

export default connect()(BottomModal)

const styles = {
    title: {
        fontFamily: text.FONT_FAMILY.BOLD,
        alignSelf: 'center',
        fontSize: hp(1.9),
        color: GM_BLUE,
        marginVertical: hp(1.2),
    },
    modalContainerStyle: {
        backgroundColor: 'white',
        paddingHorizontal: wp(4.26),
        borderRadius: 15,
        padding: 5,
        flex: 1,
        alignItems: 'left',
        height: hp(52.74),
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
    text: {
        fontFamily: text.FONT_FAMILY.MEDIUM,
        fontSize: hp(1.9),
        textAlign: 'left',
        marginBottom: hp(1.2),
    },
    btnContainer: {
        backgroundColor: GM_BLUE,
        width: wp(91.46),
        height: hp(5.24),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: wp(1),
        marginVertical: hp(0.85),
    },
    btnText: {
        color: '#ffffff',
        fontFamily: text.FONT_FAMILY.SEMI_BOLD,
        fontSize: hp(1.95),
    },
    inputContainer: {
        width: wp(91.46),
        height: hp(12.87),
        marginVertical: hp(0.85),
        padding: wp(4),
        borderWidth: 1,
        borderColor: '#DADADA',
        borderRadius: wp(1),
    },
    inputText: {
        fontFamily: text.FONT_FAMILY.REGULAR,
        fontSize: hp(1.9),
    },
    optContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: hp(0.85),
    },
    optText: {
        fontSize: hp(1.9),
        paddingLeft: wp(2),
        fontWeight: '400',
    },
    btnChecked: {
        color: GM_BLUE,
        fontSize: hp(3.2),
    },
    btnUnchecked: {
        color: '#BDBDBD',
        fontSize: hp(3.2),
    },
}
