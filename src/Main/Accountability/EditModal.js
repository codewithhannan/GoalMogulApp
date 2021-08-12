/** @format */

import React, { useState, useEffect } from 'react'
import { Button, Text, View, Image, TouchableOpacity } from 'react-native'
import Modal from 'react-native-modalbox'
import EditSteps from './EditSteps'
import Line from '../../asset/icons/line.png'
import cross from '../../asset/icons/Vector.png'

function EditModal() {
    const [isModalVisible, setModalVisible] = useState(false)

    const toggleModal = (props) => {
        setModalVisible(!isModalVisible)
    }

    return (
        <>
            <View
                style={{
                    // backgroundColor: "gray",
                    flex: 1,
                    backgroundColor: 'white',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Button title="Show modal" onPress={toggleModal} />
            </View>

            <Modal
                isOpen={isModalVisible}
                //  onClosed={this.props.onCancel}
                useNativeDriver={false}
                coverScreen={true}
                // swipeDirection="down"
                // onSwipeComplete={() => setModalVisible(false)}
                style={{
                    // marginRight: 0.1,
                    // marginLeft: 0.1,
                    // backgroundColor: '#d6d6d6',
                    flex: 1,
                    backgroundColor: 'transparent',
                }}
            >
                <View
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                        height: 600,
                        backgroundColor: 'white',
                        // marginTop: 160,
                        // marginVertical: 70,

                        // height: "50%",
                    }}
                >
                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                width: 45,
                                height: 3.5,
                                borderRadius: 5,
                                marginVertical: 10,
                                backgroundColor: 'lightgray',
                            }}
                        />
                        <TouchableOpacity onPress={toggleModal}>
                            <Image
                                style={{
                                    width: 40,
                                    height: 10,
                                    marginLeft: 330,
                                }}
                                source={cross}
                            />
                        </TouchableOpacity>
                    </View>

                    <EditSteps />
                </View>
            </Modal>
        </>
    )
}
export default EditModal
