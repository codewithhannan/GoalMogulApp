/** @format */

import React, { Component } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native'
// import LottieView from 'lottie-react-native'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import { connect } from 'react-redux'
import Modal from 'react-native-modal'
import { GM_BLUE } from '../../../styles/basic/color'
import { Entypo } from '@expo/vector-icons'
import * as text from '../../../styles/basic/text'
import { default_style } from '../../../styles/basic'
import { Actions } from 'react-native-router-flux'
import CreatePostModal from '../../Post/CreatePostModal'
import { openGoalDetail } from '../../../redux/modules/home/mastermind/actions'

import DelayedButton from '../../../Main/Common/Button/DelayedButton'
import GoalUpdateA from '../../../asset/image/GoalUpdateA.png'

class GOAL_UPDATE_POPUP_A extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { isVisible, closeModal, data, pageId } = this.props
        return (
            <Modal isVisible={isVisible}>
                <CreatePostModal
                    onRef={(r) => (this.createPostModal = r)}
                    initializeFromState
                    pageId={pageId}
                    initialPost={{
                        belongsToGoalStoryline: {
                            goalRef: data?.goal?._id,
                            title: data?.goal?.title,
                            owner: data?.goal?.owner,
                            category: data?.goal?.category,
                            priority: data?.goal?.priority,
                        },
                        privacy: data?.goal?.privacy,
                    }}
                />
                <View style={styles.container}>
                    <TouchableOpacity
                        onPress={closeModal}
                        style={styles.closeBtn}
                    >
                        <Entypo name="cross" size={28} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Goal Update</Text>
                    <Image source={GoalUpdateA} style={styles.img} />

                    <Text style={styles.d2}>
                        You haven’t updated your goal in a while:
                    </Text>
                    <Text style={styles.goal}>{data?.goal?.title}</Text>
                    {/* </ImageBackground> */}
                    <View style={{ position: 'absolute', bottom: 30 }}>
                        <DelayedButton
                            style={[
                                {
                                    paddingVertical: 10,
                                    width: 200,
                                    alignItems: 'center',
                                    backgroundColor: GM_BLUE,
                                    borderRadius: 5,
                                    marginTop: 10,
                                },
                            ]}
                            onPress={() => {
                                closeModal()
                                Actions.push('seekhelp')
                            }}
                        >
                            <Text
                                style={[
                                    default_style.subTitleText_1,
                                    {
                                        fontFamily: text.FONT_FAMILY.SEMI_BOLD,
                                        color: 'white',
                                    },
                                ]}
                            >
                                Seek Help
                            </Text>
                        </DelayedButton>
                        <DelayedButton
                            style={[
                                {
                                    paddingVertical: 10,
                                    width: 200,
                                    alignItems: 'center',
                                    backgroundColor: GM_BLUE,
                                    borderRadius: 5,
                                    marginTop: 10,
                                },
                            ]}
                            onPress={() => {
                                console.log(this.createPostModal)
                                this.createPostModal &&
                                    this.createPostModal.open()
                            }}
                        >
                            <Text
                                style={[
                                    default_style.subTitleText_1,
                                    {
                                        fontFamily: text.FONT_FAMILY.SEMI_BOLD,
                                        color: 'white',
                                    },
                                ]}
                            >
                                Share An Update
                            </Text>
                        </DelayedButton>
                        <DelayedButton
                            style={[
                                {
                                    paddingVertical: 10,
                                    width: 200,
                                    alignItems: 'center',
                                    backgroundColor: GM_BLUE,
                                    borderRadius: 5,
                                    marginTop: 10,
                                },
                            ]}
                            onPress={() => {
                                // initialProps = { initialShowGoalModal: true }
                                this.props.openGoalDetail(data?.goal, {
                                    initialShowGoalModal: true,
                                })
                                closeModal()
                            }}
                        >
                            <Text
                                style={[
                                    default_style.subTitleText_1,
                                    {
                                        fontFamily: text.FONT_FAMILY.SEMI_BOLD,
                                        color: 'white',
                                    },
                                ]}
                            >
                                Edit Goal
                            </Text>
                        </DelayedButton>
                        <DelayedButton
                            style={[
                                {
                                    paddingVertical: 10,
                                    width: 200,
                                    alignItems: 'center',
                                    backgroundColor: 'white',
                                    borderRadius: 5,
                                    marginTop: 10,
                                    borderWidth: 1,
                                    borderColor: GM_BLUE,
                                },
                            ]}
                            onPress={() => console.log('1ST BUTTON')}
                        >
                            <Text
                                style={[
                                    default_style.subTitleText_1,
                                    {
                                        fontFamily: text.FONT_FAMILY.SEMI_BOLD,
                                        color: GM_BLUE,
                                    },
                                ]}
                            >
                                Remind me in 1 week
                            </Text>
                        </DelayedButton>
                    </View>
                </View>
            </Modal>
        )
    }
}

// const mapStateToProps = (state, ownProps) => {
//     const user = state.user
//     const { popupName, isVisible, closeModal } = ownProps
//     return {
//         user,
//         popupName,
//         isVisible,
//         closeModal,
//     }
// }

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: wp(4),
        paddingVertical: hp(2),
        alignItems: 'center',
        backgroundColor: '#ffffff',
        alignSelf: 'center',
        height: hp(76),
        width: wp(90),
        borderRadius: wp(2),
    },
    title: {
        paddingTop: hp(1),
        // fontFamily: text.FONT_FAMILY.MEDIUM,
        width: wp(76),
        textAlign: 'center',
        fontSize: hp(2.5),
        color: 'black',
    },
    d2: {
        fontSize: hp(1.75),
        marginTop: hp(3.4),
        fontWeight: '400',
        width: wp(77),
        // fontFamily: text.FONT_FAMILY.REGULAR,
    },
    goal: {
        // fontFamily: text.FONT_FAMILY.SEMI_BOLD,
        fontSize: hp(1.7),
        fontWeight: '600',
        marginTop: hp(1.9),
        width: wp(77),
        color: GM_BLUE,
    },
    closeBtn: {
        alignSelf: 'flex-end',
    },
    img: {
        height: hp(20),
        width: wp(80),
        resizeMode: 'contain',
    },
})

export default connect(null, { openGoalDetail })(GOAL_UPDATE_POPUP_A)
