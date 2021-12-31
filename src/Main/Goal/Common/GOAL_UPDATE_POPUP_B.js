/** @format */

import React, { useState, useEffect } from 'react'
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    KeyboardAvoidingView,
} from 'react-native'
// import LottieView from 'lottie-react-native'
import CheckBox from '@react-native-community/checkbox'
import { Actions } from 'react-native-router-flux'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import { connect } from 'react-redux'
import Modal from 'react-native-modal'
import { MaterialIcons } from '@expo/vector-icons'

import InviteFriendModal from '../../MeetTab/Modal/InviteFriendModal'
import {
    wrapAnalytics,
    SCREENS,
    trackWithProperties,
    EVENT as E,
    track,
    identifyWithTraits,
} from '../../../monitoring/segment'
import { GM_BLUE } from '../../../styles/basic/color'
import * as text from '../../../styles/basic/text'
import { default_style } from '../../../styles/basic'
import DelayedButton from '../../../Main/Common/Button/DelayedButton'

// import DelayedButton from '../../../Main/Common/Button/DelayedButton'

// import SILVER_BADGE from '../../asset/popup_animation/p5.json'
// import GOLD_BADGE from '../../asset/popup_animation/p6.json'
// import GREEN_BADGE from '../../asset/popup_animation/p2-v2.json'
// import BRONZE_BADGE from '../../asset/popup_animation/p3.json'
// import FIRST_GOAL from '../../asset/popup_animation/p1.json'
// import SEVEN_GOALS from '../../asset/popup_animation/p4-v2.json'
// import STREAK from '../../asset/popup_animation/p7.json'
// import STREAK_MISSED from '../../asset/popup_animation/p8.json'
// import POPUP_BLUE from '../../asset/popup_animation/popupBlue.png'
import GoalUpdateA from '../../../asset/image/GoalUpdateA.png'

// import * as Helper from '../../Utils/HelperMethods'

const GOAL_UPDATE_POPUP_B = ({
    isVisible,
    closeModal,
    data,
    pageId,
    token,
    makeVisibleB,
}) => {
    const [toggleTribe, setToggleTribe] = useState(false)
    const [toggleFriends, setToggleFriends] = useState(false)
    const [toggleContact, setToggleContacts] = useState(false)
    const [showInviteFriendModal, setShowInviteFriendModal] = useState(false)
    const [helpText, setHelpText] = useState('')
    // showInviteFriendModal: false,

    const openInviteFriendModal = () => {
        setShowInviteFriendModal(true)
        track(E.INVITE_FRIENDS_OPEN)
    }

    const closeInviteFriendModal = () => {
        setShowInviteFriendModal(false)
    }

    return (
        <Modal isVisible={isVisible}>
            <InviteFriendModal
                isVisible={showInviteFriendModal}
                closeModal={closeInviteFriendModal}
                seekHelp
            />
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    style={{
                        height: '100%',
                        width: '100%',
                        backgroundColor: '#ffffff',
                        alignItems: 'center',
                    }}
                >
                    <View
                        style={{
                            width: '100%',
                            height: 55,
                            backgroundColor: GM_BLUE,
                            flexDirection: 'row',
                        }}
                    >
                        <TouchableOpacity
                            onPress={closeModal}
                            style={styles.closeBtn}
                        >
                            <MaterialIcons
                                name="arrow-back-ios"
                                size={20}
                                color="white"
                            />
                        </TouchableOpacity>
                        <Text style={styles.title}>Seek Help</Text>
                    </View>
                    {/* <Image source={GoalUpdateA} style={styles.img} /> */}

                    <Text style={styles.d2}>
                        Specify what you would like help with:
                    </Text>
                    <Text style={styles.goal}>{data?.goal?.title}</Text>
                    {/* </ImageBackground> */}
                    <TextInput
                        multiline
                        style={{
                            width: '90%',
                            height: 124,
                            borderColor: '##707079',
                            borderWidth: 0.5,
                            borderRadius: 4,
                            marginTop: 15,
                            padding: 10,
                        }}
                        placeholder="Clarify what you want help with"
                        textAlignVertical="top"
                        autoCorrect={false}
                        onChangeText={(value) => setHelpText(value)}
                    />
                    <Text style={styles.d2}>
                        Where do you want to Seek Help from?
                    </Text>
                    <View style={{ width: '95%' }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                alignContent: 'center',
                            }}
                        >
                            <CheckBox
                                disabled={false}
                                value={toggleTribe}
                                onValueChange={() => {
                                    setToggleFriends(false)
                                    setToggleContacts(false)
                                    setToggleTribe(!toggleTribe)
                                }}
                            />
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: '400',
                                    marginLeft: 5,
                                }}
                            >
                                Pick a Tribe
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                alignContent: 'center',
                            }}
                        >
                            <CheckBox
                                disabled={false}
                                value={toggleFriends}
                                onValueChange={() => {
                                    setToggleContacts(false)
                                    setToggleTribe(false)
                                    setToggleFriends(!toggleFriends)
                                }}
                            />
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: '400',
                                    marginLeft: 5,
                                }}
                            >
                                Friends List
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                alignContent: 'center',
                            }}
                        >
                            <CheckBox
                                disabled={false}
                                value={toggleContact}
                                onValueChange={() => {
                                    setToggleTribe(false)
                                    setToggleFriends(false)
                                    setToggleContacts(!toggleContact)
                                }}
                                // tintColors={{true:'#42C0F5',false:'grey'}}
                            />
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: '400',
                                    marginLeft: 5,
                                }}
                            >
                                My Contacts (Outside of GoalMogul)
                            </Text>
                        </View>
                    </View>
                    <DelayedButton
                        style={[
                            {
                                paddingVertical: 10,
                                width: '90%',
                                alignItems: 'center',
                                backgroundColor: GM_BLUE,
                                borderRadius: 5,
                                position: 'absolute',
                                bottom: 20,
                            },
                        ]}
                        // onPress={() => {
                        //     closeModal()
                        //     Actions.push('seekhelp')
                        // }}
                        onPress={() => {
                            if (toggleTribe) {
                                closeModal()
                                return Actions.push('seekTribe', {
                                    helpText: helpText,
                                })
                            } else if (toggleFriends) {
                                closeModal()
                                return Actions.push('seekhelp', {
                                    helpText: helpText,
                                })
                            }
                            openInviteFriendModal()
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
                            Next
                        </Text>
                    </DelayedButton>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Modal>
    )
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
        alignItems: 'center',
        backgroundColor: GM_BLUE,
        alignSelf: 'center',
        height: '105%',
        width: '110%',
    },
    title: {
        paddingTop: hp(2.2),
        // fontFamily: text.FONT_FAMILY.MEDIUM,
        marginLeft: wp(9),
        width: wp(76),
        textAlign: 'center',
        fontSize: hp(2),
        color: 'white',
    },
    d2: {
        fontSize: hp(2.2),
        marginTop: hp(3.4),
        fontWeight: 'bold',
        width: wp(90),
        // fontFamily: text.FONT_FAMILY.REGULAR,
    },
    goal: {
        // fontFamily: text.FONT_FAMILY.SEMI_BOLD,
        fontSize: hp(2),
        fontWeight: '600',
        marginTop: hp(1.9),
        width: wp(90),
        color: GM_BLUE,
    },
    closeBtn: {
        alignSelf: 'flex-start',
        top: 20,
        left: 20,
    },
    img: {
        height: hp(20),
        width: wp(80),
        resizeMode: 'contain',
    },
})

export default connect(null, null)(GOAL_UPDATE_POPUP_B)
