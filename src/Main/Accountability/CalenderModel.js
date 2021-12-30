/** @format */

// /** @format */

import React, { useState } from 'react'
import { Button, Text, View, TouchableOpacity, Image } from 'react-native'
import Modal from 'react-native-modalbox'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'

// import TimePic from './TimePic'
import Tooltip from '../../Main/Common/Tooltip'
import ProfileImage from '../Common/ProfileImage'
import Headline from '../Goal/Common/Headline'
import TimePickers from './TimePickers'

//Assets
import SWIPER_BACKGROUND from '../../asset/image/tooltip3.png'
import FriendsIcon from '../../asset/utils/friends.png'

//Actions
import { getProfileImageOrDefaultFromUser } from '../../redux/middleware/utils'

function CalenderModel(props) {
    const [isModalVisible, setModalVisible] = useState(false)
    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()
    const [time, setTime] = useState()

    const tooltipText = `You can change your check-in's anytime by opening your 'Settings' menu from the main screen and tapping 'Accountability'.`
    const toggleModal = () => {
        setModalVisible(!isModalVisible)
    }

    const handleConfirmButton = () => {
        const dataObj = {
            'Selected Time': time,
            'Start Date': startDate,
            'End Date': endDate,
        }
        console.log(dataObj)
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <Button title="Show modal" onPress={toggleModal} />
            {/* {isModalVisible && (
                <Tooltip
                    title={tooltipText}
                    imageSource={SWIPER_BACKGROUND}
                    type="commentSuggestion"
                    viewStyle={{
                        position: 'absolute',
                        zIndex: 100,
                        left: 100,
                        top: 150,
                        // bottom: 15,
                    }}
                    bgStyle={{ width: 248, height: 103 }}
                />
            )} */}
            <Modal
                isOpen={isModalVisible}
                onClosed={() => setModalVisible(false)}
                coverScreen={true}
                useNativeDriver={true}
                style={{ flex: 1, backgroundColor: 'transparent' }}
            >
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
                            style={{ marginVertical: 10, alignSelf: 'center' }}
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
                            style={{ position: 'absolute', right: 15, top: 10 }}
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
                                    <View
                                        style={{
                                            width: 80,
                                            height: 25,
                                            borderRadius: 15,
                                            marginVertical: 5,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: 'lightgray',
                                            flexDirection: 'row',
                                        }}
                                    >
                                        <Image
                                            source={FriendsIcon}
                                            style={{
                                                width: 12,
                                                height: 12,
                                                margin: 5,
                                            }}
                                        />
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                fontWeight: '500',
                                            }}
                                        >
                                            Friends
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <Text
                                style={{
                                    fontSize: 15,
                                    fontWeight: '500',
                                    marginVertical: 5,
                                }}
                            >
                                When do you want to be reminded to check in with
                                Patricia?
                            </Text>
                        </View>
                        <TimePickers />

                        {/* <TimePic
                            onTimeSelect={(val) => setTime(val)}
                            onStartDate={(val) => setStartDate(val)}
                            onEndDate={(val) => setEndDate(val)}
                        /> */}
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
                                marginBottom: 15,
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
                </View>
            </Modal>
        </View>
    )
}

export default CalenderModel
