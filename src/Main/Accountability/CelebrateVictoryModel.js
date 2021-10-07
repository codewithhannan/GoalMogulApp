/** @format */

import React, { useState } from 'react'
import {
    Text,
    Image,
    View,
    TextInput,
    TouchableOpacity,
    Button,
} from 'react-native'
import Modal from 'react-native-modal'

import cross from '../../asset/icons/cross.png'
import defaultImage from '../../asset/utils/profile_people_black.png'
import friends from '../../asset/utils/friends.png'

function CelebrateVictoryModel() {
    const [isModalVisible, setModalVisible] = useState(false)
    const toggleModal = (props) => {
        setModalVisible(!isModalVisible)
    }

    const lotties = [
        { image: require('../../asset/icons/handheart.png') },
        { image: require('../../asset/icons/welldone.png') },
        { image: require('../../asset/icons/rockon.png') },
        { image: require('../../asset/icons/faint.png') },
    ]
    return (
        <View
            style={{
                // marginRight: 30,
                backgroundColor: 'gray',
                flex: 1,
                backgroundColor: 'white',
                // opacity: 0.7,

                // backgroundColor: "transparent",
                justifyContent: 'center',
            }}
        >
            <Button title="Show modal" onPress={toggleModal} />

            <Modal
                transparent
                isVisible={isModalVisible}
                animationType="slide"
                swipeDirection="down"
                onSwipeComplete={() => setModalVisible(false)}
                style={{
                    marginRight: 0.1,
                    marginLeft: 0.1,
                    backgroundColor: 'transparent',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <View
                    style={{
                        backgroundColor: 'white',
                        // width: 200,
                        height: 360,
                        width: '90%',
                        borderRadius: 7,
                        // aspectRatio: 1 / 2,
                        alignItems: 'center',

                        // height: height * 0.6,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            top: 15,
                            height: 80,
                            width: '90%',
                        }}
                    >
                        <Image
                            source={defaultImage}
                            style={{
                                height: 58,
                                width: 58,
                                borderRadius: 29,
                            }}
                            resizeMode="contain"
                        />
                        <View
                            style={{
                                flexDirection: 'column',
                                marginLeft: 20,
                                marginTop: 8,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    color: 'black',
                                    fontWeight: '600',
                                    lineHeight: 16,
                                }}
                            >
                                Test Account
                            </Text>
                            <TouchableOpacity
                                style={{
                                    flexDirection: 'row',
                                    width: 62,
                                    height: 22,
                                    backgroundColor:
                                        'rgba(130, 130, 130, 0.26)',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 20,
                                    marginTop: 7,
                                }}
                            >
                                <Image
                                    source={friends}
                                    style={{ height: 11, width: 11 }}
                                />
                                <Text
                                    style={{
                                        fontSize: 10,
                                        fontWeight: '500',
                                        marginLeft: 3,
                                    }}
                                >
                                    Friends
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View
                        style={{
                            position: 'relative',

                            width: '90%',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ fontSize: 14, fontWeight: '500' }}>
                            Patricia Tsai crushed her goal like a boss! It’s
                            time to celebrate!
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            width: '95%',
                            marginTop: 15,
                        }}
                    >
                        {lotties.map((item, index) => (
                            <TouchableOpacity
                                key={Math.random().toString(36).substr(2, 9)}
                                style={{
                                    width: 72,
                                    height: 45,
                                    backgroundColor: '#D3F2FF',
                                    borderRadius: 20,
                                    marginHorizontal: 8,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Image
                                    style={{ height: 36, width: 42 }}
                                    source={item.image}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View
                        style={{
                            width: '90%',
                            height: 110,
                            borderRadius: 5,
                            borderColor: '#42C0F5',
                            borderWidth: 1,
                            marginTop: 10,
                        }}
                    >
                        <TextInput
                            multiline={true}
                            style={{
                                padding: 10,
                            }}
                            placeholderTextColor="#C4C4C4"
                            placeholder="What do you want to tell your friend?"
                        />
                    </View>
                    <View style={{ marginTop: 15 }}>
                        <TouchableOpacity
                            style={{
                                width: 200,
                                height: 38,
                                backgroundColor: '#45C9F6',
                                borderRadius: 5,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: '500',
                                    color: 'white',
                                }}
                            >
                                Send to User
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ position: 'absolute', right: 15, top: 15 }}>
                        <TouchableOpacity
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            onPress={toggleModal}
                        >
                            <Image
                                source={cross}
                                style={{ width: 30, height: 30 }}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default CelebrateVictoryModel
