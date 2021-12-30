/** @format */

// /** @format */

import React, { useState, useEffect, useRef } from 'react'
import { Text, View, Image, TouchableWithoutFeedback } from 'react-native'

import check from '../../asset/utils/check.png'

function SlotButton({ day, onDaySelect, onDayUnselect }) {
    // console.log("daysssssssss", day);
    const [selected, setSelected] = useState(day.selected)
    useEffect(() => {
        selected ? onDaySelect(day.word) : onDayUnselect(day.word)
    }, [selected])

    return (
        <View>
            <TouchableWithoutFeedback
                onPress={() => {
                    selected ? setSelected(false) : setSelected(true)
                }}
            >
                <View
                    style={
                        {
                            // marginBottom: 50,
                        }
                    }
                >
                    <View
                        style={{
                            height: 30,
                            // marginTop: 20,
                            width: 30,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: selected ? '#42C0F5' : 'white',
                            borderRadius: 5,
                            borderWidth: 0.5,
                            borderColor: selected ? '#42C0F5' : 'gray',
                        }}
                    >
                        <Image
                            source={check}
                            style={{
                                resizeMode: 'contain',
                                width: 20,
                                height: 20,
                                tintColor: 'white',
                            }}
                        />
                    </View>
                    <Text
                        style={{
                            // padding: 5,
                            marginTop: 5,
                            fontSize: 16,
                            // fontWeight: "bold",
                            color: selected ? 'black' : 'black',
                        }}
                    >
                        {day.letter}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}

export default SlotButton
