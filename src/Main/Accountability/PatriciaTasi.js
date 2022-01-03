/** @format */

import React, { useState } from 'react'
import {
    Button,
    Text,
    View,
    TouchableOpacity,
    Image,
    TouchableWithoutFeedback,
    Keyboard,
    TextInput,
} from 'react-native'
import Modal from 'react-native-modalbox'

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'

import ProfileImage from '../Common/ProfileImage'
import { getProfileImageOrDefaultFromUser } from '../../redux/middleware/utils'
import { CheckBox } from 'react-native-elements'
// import { FONT_FAMILY } from '../../styles/basic/text'

function PatriciaTasi(props) {
    const [isModalVisible, setModalVisible] = useState(false)

    const [checked, toggleChecked] = useState(false)

    const tooltipText = `You can change your check-in's anytime by opening your 'Settings' menu from the main screen and tapping 'Accountability'.`
    const toggleModal = () => {
        setModalVisible(!isModalVisible)
    }

    const handleConfirmButton = () => {
        // const dataObj = {
        //     'Selected Time': time,
        //     'Start Date': startDate,
        //     'End Date': endDate,
        // }
        // console.log(dataObj)
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <Button title="Show modal" onPress={toggleModal} />

            <Modal
                isOpen={isModalVisible}
                onClosed={() => setModalVisible(false)}
                coverScreen={true}
                useNativeDriver={true}
                style={{ flex: 1, backgroundColor: 'transparent' }}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View
                        style={{
                            width: wp('100%'),
                            height: hp('85%'),
                            backgroundColor: 'white',
                            position: 'absolute',
                            bottom: 0,
                        }}
                    >
                        <View style={{ flex: 1 }}>
                            <View
                                style={{
                                    marginVertical: 10,
                                    alignSelf: 'center',
                                }}
                            >
                                <View
                                    style={{
                                        width: 50,
                                        height: 4,
                                        borderRadius: 5,
                                        backgroundColor: 'lightgray',
                                    }}
                                />
                            </View>

                            <TouchableOpacity
                                style={{
                                    position: 'absolute',
                                    right: 15,
                                    top: 10,
                                }}
                                onPress={() => setModalVisible(false)}
                            >
                                <Image
                                    style={{
                                        width: 25,
                                        height: 25,
                                        resizeMode: 'contain',
                                    }}
                                    source={require('../../asset/icons/cross.png')}
                                />
                            </TouchableOpacity>
                            <View
                                style={{
                                    marginHorizontal: 10,
                                    // width: 115,
                                }}
                            >
                                <View style={{ flexDirection: 'row' }}>
                                    <ProfileImage
                                        imageStyle={{ width: 50, height: 50 }}
                                        imageUrl={getProfileImageOrDefaultFromUser(
                                            props.item
                                        )}
                                        imageContainerStyle={{
                                            // width: 40,
                                            backgroundColor: 'white',
                                        }}
                                        disabled
                                    />
                                    <View style={{ marginHorizontal: 15 }}>
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                color: '#3B414B',
                                                fontWeight: '600',
                                            }}
                                        >
                                            Patricia Tsai
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View
                                style={{
                                    backgroundColor: '#99E1FF33',
                                    width: 299,
                                    height: 90,
                                    borderRadius: 10,
                                    marginLeft: 55,
                                    bottom: 20,
                                }}
                            >
                                <Text
                                    style={{
                                        fontStyle: 'normal',
                                        fontWeight: 'normal',
                                        fontSize: 16,
                                        lineHeight: 20,
                                        display: 'flex',
                                        alignItems: 'center',
                                        letterSpacing: 0.13,
                                        marginLeft: 12,
                                        marginTop: 8,
                                    }}
                                >
                                    Your next checkin with Patricia is:
                                </Text>
                                <Text
                                    style={{
                                        marginTop: 8,
                                        marginLeft: 12,
                                        width: 267,
                                        height: 40,
                                        color: '#42C0F5',
                                        fontStyle: 'normal',
                                        fontWeight: 'normal',
                                        fontSize: 16,
                                        lineHeight: 20,
                                        display: 'flex',
                                        alignItems: 'center',
                                        letterSpacing: 0.13,
                                    }}
                                >
                                    August 15, 2021 at 11:00 AM your local time
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <CheckBox
                                    checkedIcon={
                                        <Image
                                            resizeMode="contain"
                                            source={require('../Accountable_images/Checkbox.png')}
                                        />
                                    }
                                    uncheckedIcon={
                                        <Image
                                            resizeMode="contain"
                                            source={require('../Accountable_images/Rectangle.png')}
                                        />
                                    }
                                    checked={checked}
                                    onPress={() => toggleChecked(!checked)}
                                />

                                <Text
                                    style={{
                                        position: 'absolute',
                                        marginTop: 10,
                                        // height: 20,

                                        marginLeft: 47,
                                        width: 292,
                                        fontWeight: '500',
                                        fontSize: 16,
                                        lineHeight: 20,
                                        color: '#000000',
                                        // height: 20,
                                        fontStyle: 'normal ',
                                    }}
                                >
                                    Ask:
                                </Text>
                                <Text
                                    style={{
                                        position: 'absolute',
                                        marginTop: 10,
                                        marginLeft: 80,
                                        width: 282,
                                        fontWeight: '500',
                                        fontSize: 16,
                                        lineHeight: 20,
                                        color: '#000000',
                                        // height: 20,
                                        fontStyle: 'normal ',
                                    }}
                                >
                                    "What 3 steps are you committed to taking
                                    before our next check-in?”
                                </Text>
                            </View>
                            <View>
                                <Text
                                    style={{
                                        // position: 'absolute',
                                        marginTop: 20,
                                        height: 15,
                                        marginLeft: 16,
                                        width: 150,
                                        fontWeight: '600',
                                        fontSize: 12,
                                        lineHeight: 14,
                                        color: '#333333',
                                        marginBottom: 5,
                                        fontStyle: 'normal ',
                                    }}
                                >
                                    Add a Personal Message
                                </Text>
                            </View>
                            <View
                                style={{
                                    width: 320,
                                    height: 102,
                                    left: 16,
                                    borderWidth: 1,
                                    borderColor: '#42C0F5',
                                    borderRadius: 3,
                                    paddingLeft: 8,
                                }}
                            >
                                <TextInput placeholder="Awesome goal! I'm holding you to it!" />
                            </View>
                            <View>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: '#42C0F5',
                                        width: '90%',
                                        justifyContent: 'center',
                                        alignSelf: 'center',
                                        height: 40,
                                        borderColor: '#42C0F5',
                                        borderWidth: 2,
                                        borderRadius: 5,
                                        marginTop: 80,
                                        // marginBottom: 15,
                                    }}
                                    onPress={handleConfirmButton}
                                >
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            color: 'white',
                                            fontSize: 20,
                                            fontWeight: '500',
                                        }}
                                    >
                                        Confirm
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: 'white',
                                        width: '90%',
                                        justifyContent: 'center',
                                        alignSelf: 'center',
                                        height: 40,
                                        borderColor: '#42C0F5',
                                        borderWidth: 2,
                                        borderRadius: 5,
                                        marginTop: 10,
                                    }}
                                    onPress={handleConfirmButton}
                                >
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            color: '#42C0F5',
                                            fontSize: 20,
                                            fontWeight: '500',
                                        }}
                                    >
                                        Go Back
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    )
}

export default PatriciaTasi
