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
    TouchableOpacity,
    TextInput,
    Alert,
    KeyboardAvoidingView,
    Keyboard,
} from 'react-native'
import Constants from 'expo-constants'
import Modal from 'react-native-modal'
import cancel from '../../../asset/utils/cancel_no_background.png'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import { Formik } from 'formik'
import Icon from 'react-native-vector-icons/MaterialIcons'

import * as text from '../../../styles/basic/text'
import { GM_BLUE } from '../../../styles/basic/color'
import DelayedButton from '../Button/DelayedButton'

class ClarifyModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            opt0: false,
            opt1: false,
            opt2: false,
            opt3: false,
            increaseHeight: false,
        }
    }

    options = [
        `Make your goal more specific`,
        `Break your goal into more Steps so i can follow better?`,
        `List more Needs so i can help you more easily?`,
        `Set a clear deadline for you goal?`,
    ]

    renderOptions(options, setFieldValue) {
        return options.map((option, index) => (
            <>
                <View style={styles.optContainer}>
                    <TouchableWithoutFeedback
                        onPress={() =>
                            this.handleCheckbox(
                                `opt${index}`,
                                setFieldValue,
                                index
                            )
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
                {/* <View
                    style={{
                        width: '100%',
                        borderWidth: 0.2,
                        marginTop: 5,

                        backgroundColor: 'lightgrey',
                    }}
                /> */}
            </>
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
                <TouchableOpacity onPress={handleSubmit}>
                    <View style={styles.btnContainer}>
                        <Text style={styles.btnText}>Submit</Text>
                    </View>
                </TouchableOpacity>
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
        const { name } = this.props

        return (
            <>
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
                            position: !this.state.increaseHeight
                                ? 'absolute'
                                : null,
                            bottom: !this.state.increaseHeight ? 0 : null,
                            borderRadius: 5,

                            height: this.state.increaseHeight ? '95%' : null,
                            justifyContent: this.state.increaseHeight
                                ? 'center'
                                : null,
                        }}
                    >
                        <View
                            style={{
                                ...styles.modalContainerStyle,
                                height: hp(50),
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
                                {`Ask ${name} to clarify his goals:`}
                            </Text>
                            <Text style={styles.text}>
                                {`${name}, are you able to..`}
                            </Text>

                            <Formik
                                initialValues={{
                                    opt0: '',
                                    opt1: '',
                                    opt2: '',
                                    opt3: '',
                                }}
                                onSubmit={async (value, { setSubmitting }) => {
                                    Alert.alert(
                                        'Thank you',
                                        'Your message has been submitted!',
                                        [
                                            {
                                                text: 'Ok',
                                                onPress: () =>
                                                    this.props.closeModal(
                                                        true,
                                                        value
                                                    ),
                                            },
                                        ],
                                        { cancelable: false }
                                    )
                                }}
                            >
                                {({
                                    handleChange,
                                    handleBlur,
                                    handleSubmit,
                                    values,
                                    setFieldValue,
                                }) => (
                                    <>
                                        {this.renderOptions(
                                            this.options,
                                            setFieldValue
                                        )}

                                        <View style={styles.inputContainer}>
                                            <TextInput
                                                placeholder={`Anything else you want to add?`}
                                                multiline={true}
                                                style={styles.inputText}
                                                onChangeText={handleChange(
                                                    'opt4'
                                                )}
                                                onFocus={() =>
                                                    this.setState({
                                                        increaseHeight: true,
                                                    })
                                                }
                                                onEndEditing={() =>
                                                    this.setState({
                                                        increaseHeight: false,
                                                    })
                                                }
                                                ref={(c) => {
                                                    this.textInputRef = c
                                                }}
                                                onSubmitEditing={() => {
                                                    this.textInputRef.blur()
                                                    this.setState({
                                                        increaseHeight: false,
                                                    })
                                                }}
                                            />
                                        </View>

                                        {this.renderButton(handleSubmit)}
                                    </>
                                )}
                            </Formik>

                            {this.renderCancelButton()}
                        </View>
                    </View>
                </Modal>
            </>
        )
    }
}

export default ClarifyModal

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
        // alignItems: 'left',
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
        height: hp(4.5),
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
        height: 85,
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
        justifyContent: 'flex',
        alignItems: 'flex-start',
        marginVertical: hp(0.85),
    },
    optText: {
        fontSize: hp(1.8),
        paddingLeft: wp(2),
        fontWeight: '400',
    },
    btnChecked: {
        color: GM_BLUE,
        fontSize: hp(2.5),
    },
    btnUnchecked: {
        color: '#BDBDBD',
        fontSize: hp(2.5),
    },
}
