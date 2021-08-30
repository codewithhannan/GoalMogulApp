/** @format */

import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

function YesNoComponent({ name = 'test' }) {
    return (
        <View
            style={{
                backgroundColor: 'rgba(153, 225, 255, 0.2)',
                width: 240,
                height: 100,
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Text style={{ fontSize: 16, fontWeight: '600' }}>
                Accept {name}'s request?
            </Text>
            <View style={{ flexDirection: 'row', marginTop: 15 }}>
                <TouchableOpacity
                    style={{
                        width: 55,
                        height: 33,
                        backgroundColor: '#42C0F5',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 5,
                        marginHorizontal: 5,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 14,
                            color: 'white',
                            fontWeight: '500',
                        }}
                    >
                        YES
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        width: 55,
                        height: 33,
                        backgroundColor: '#E3E3E3',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 5,
                        marginHorizontal: 5,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 14,
                            color: '#505050',
                            fontWeight: '500',
                        }}
                    >
                        NO
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default YesNoComponent
