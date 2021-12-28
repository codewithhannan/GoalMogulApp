/** @format */

// /** @format */

// //https://stackoverflow.com/questions/65205428/handle-multiple-checkboxes-in-expo-react-native
import React, { Component, useState } from 'react'
import { TouchableWithoutFeedback, Keyboard } from 'react-native'
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import { CheckBox } from 'react-native-elements'

export default function Patricia() {
    const [isChecked, setIsChecked] = useState(false)
    const [data, setData] = useState([
        {
            id: 1,
            text: 'Make your goal more specific?                    ',
            status: false,
        },
        {
            id: 2,
            text: 'Brekae your goal into more steps so i can fellow better?',
            status: false,
        },
        {
            id: 3,
            text: 'List more needs so i can help you more easy? ',
            status: false,
        },
        {
            id: 4,
            text: 'Set a clear deadline for your goal?              ',
            status: false,
        },
    ])
    const [text, onChangeText] = useState()

    const handleOnPress = (id, index) => {
        const temData = [...data]
        temData[index].status = !temData[index].status
        setData(temData)

        // console.log("hellll", checked);
    }
    const handleChange = (id) => {
        let temp = data.map((product) => {
            if (id === product.id) {
                return { ...product, status: !product.status }
            }
            return product
        })
        setData(temp)
    }

    let selected = data.filter((product) => product.status)
    console.log('helo', selected)

    const handleSubmit = () => {
        let selected = data.filter((product) => product.status)
        console.log('helo', selected)
        onChangeText()
        console.log('your text:', text)
    }

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View>
                <Text
                    style={{
                        color: '#45C9F6',
                        fontSize: 20,
                        fontWeight: 'bold',
                        alignSelf: 'center',
                    }}
                >
                    Ask Patricia to clarify her goal
                </Text>
                <Text
                    style={{
                        fontSize: 17,
                        padding: 15,
                        fontWeight: 'bold',
                    }}
                >
                    Patricia, are you able to...
                </Text>
                {data.map((item, index) => (
                    <View style={{ flexDirection: 'row', width: '95%' }}>
                        <CheckBox
                            value={item.status}
                            onChange={() => {
                                handleChange(item.id)
                            }}
                            // onValueChange={() => setIsChecked()}
                            checkedIcon={
                                <Image
                                    style={{
                                        width: 30,
                                        height: 30,
                                        backgroundColor: '#45C9F6',
                                        // borderWidth: 1,
                                        borderRadius: 5,
                                    }}
                                    source={require('../assets/checkedd.png')}
                                />
                            }
                            uncheckedIcon={
                                <Image
                                    style={{
                                        width: 30,
                                        height: 30,
                                    }}
                                    source={require('../assets/unchecked.png')}
                                />
                            }
                            color="red"
                            title={item.text}
                            checked={item.status}
                            onPress={() => handleOnPress(item.id, index)}
                        />
                    </View>
                ))}

                <View>
                    <TextInput
                        value={text}
                        multiline={true}
                        onChangeText={(text) => onChangeText(text)}
                        placeholder="Anythings else you whant to add"
                        style={{
                            borderWidth: 1,
                            height: 100,
                            width: '90%',
                            alignSelf: 'center',
                            borderRadius: 1,
                            textAlignVertical: 'top',

                            borderColor: '#45C9F6',
                        }}
                    ></TextInput>
                </View>

                <View>
                    <TouchableOpacity
                        onPress={() => handleSubmit()}
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 20,

                            borderRadius: 5,
                            width: '90%',
                            alignSelf: 'center',
                            height: 40,

                            backgroundColor: '#45C9F6',
                        }}
                    >
                        <Text
                            style={{
                                justifyContent: 'center',
                                textAlign: 'center',
                                color: '#fff',
                                fontSize: 20,
                                // marginTop: 4,
                            }}
                        >
                            Confirm
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}
