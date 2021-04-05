/** @format */

import React, { Component } from 'react'
import {
    View,
    Image,
    Text,
    TouchableWithoutFeedback,
    TextInput,
    StyleSheet,
} from 'react-native'
import { color, default_style } from '../../styles/basic'
import { Formik, Field, ErrorMessage } from 'formik'

import { connect } from 'react-redux'

class OnboardingInviteCode extends Component {
    constructor(props) {
        super(props)

        // this.handleEditOnPressed = this.handleEditOnPressed.bind(this)
    }

    // handleEditOnPressed(pageId) {
    //     const { userId } = this.props
    //     this.props.openProfileDetailEditForm(userId, pageId)
    // }

    render() {
        return (
            <>
                <View
                    style={{
                        backgroundColor: color.PG_BACKGROUND,

                        flex: 1,
                        justifyContent: 'center',
                    }}
                >
                    <View>
                        <View
                            style={{
                                width: '80%',
                                marginHorizontal: 50,
                                bottom: 20,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 30,
                                    lineHeight: 40,
                                    color: '#42C0F5',
                                    fontWeight: '700',
                                    fontFamily: 'SFProDisplay-Bold',
                                }}
                            >
                                GoalMogul {''}
                                <Text
                                    style={{
                                        color: 'black',
                                        fontWeight: '500',
                                        fontSize: 25,
                                        fontStyle: 'SFProDisplay-Regular',
                                    }}
                                >
                                    is in private beta testing. You are now on
                                    the WaitList. We will email you as soon as
                                    your account is ready.
                                </Text>
                            </Text>
                        </View>

                        <View>
                            <Text
                                style={{
                                    fontSize: 13,
                                    // marginTop: 15,

                                    width: '80%',
                                    marginHorizontal: 52,
                                    lineHeight: 20,
                                    fontWeight: '500',
                                    fontStyle: 'SFProDisplay-Regular',
                                }}
                            >
                                Got an Invite Code? Enter it below to get
                                instant access:
                            </Text>
                        </View>
                    </View>

                    <Formik
                        initialValues={{
                            InviteCode: '',
                        }}
                        onSubmit={async (value, { resetForm }) => {
                            console.log('this isi value', value)
                        }}
                        validateOnBlur={true}
                    >
                        {({
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            values,
                            setFieldValue,
                            isSubmitting,
                            dirty,
                            isValid,
                            errors,
                            touched,
                        }) => (
                            <>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <View
                                        style={{
                                            width: '20%',
                                            height: 35,
                                            borderRadius: 4,
                                            borderBottomColor: '#42C0F5',
                                            borderTopColor: 'transparent',
                                            borderLeftColor: 'transparent',
                                            borderRightColor: 'transparent',
                                            borderWidth: 2,
                                            marginTop: 20,
                                            marginHorizontal: 20,
                                        }}
                                    >
                                        <TextInput
                                            onChangeText={handleChange(
                                                'InviteCode'
                                            )}
                                            onBlur={handleBlur('InviteCode')}
                                            value={values.InviteCode}
                                            multiline={true}
                                            style={styles.textinput}
                                            textAlign="left"
                                            keyboardType="numeric"
                                        />
                                    </View>

                                    <TouchableWithoutFeedback>
                                        <View
                                            style={{
                                                backgroundColor: '#42C0F5',
                                                width: '25%',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                height: 40,
                                                borderColor: '#42C0F5',
                                                borderWidth: 2,
                                                borderRadius: 7,
                                                marginTop: 20,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: 'white',
                                                    fontWeight: '500',
                                                    fontSize: 12,
                                                    fontStyle:
                                                        'SFProDisplay-Regular',
                                                }}
                                            >
                                                Submit Code
                                            </Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </>
                        )}
                    </Formik>
                </View>
            </>
        )
    }
}

const styles = StyleSheet.create({
    textinput: {
        paddingTop: 10,
        paddingHorizontal: 10,
        padding: 5,
    },
})

const mapStateToProps = (state) => {
    const { userId } = state.user

    return {
        userId,
    }
}

// export default connect(mapStateToProps, {})(OnboardingInviteCode)
export default OnboardingInviteCode
