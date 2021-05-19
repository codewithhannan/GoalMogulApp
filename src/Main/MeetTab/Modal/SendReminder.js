/** @format */

import React, { Component } from 'react'
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    Text,
    TouchableWithoutFeedback,
} from 'react-native'

class SendReminder extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <>
                <View
                    style={{
                        flexDirection: 'row',

                        alignItems: 'center',
                        justifyContent: 'space-between',
                        height: 50,
                        backgroundColor: 'white',
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            marginHorizontal: 20,
                        }}
                    >
                        <Image
                            source={require('../../../asset/utils/defaultUserProfile.png')}
                            style={{
                                height: 35,
                                width: 35,
                                borderRadius: 150 / 2,
                                overflow: 'hidden',
                            }}
                        />

                        <Text
                            style={{
                                alignSelf: 'center',
                                marginLeft: 12,
                                fontSize: 16,
                                top: 2,
                            }}
                        >
                            Abdul Hannan
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={{
                            width: 113,
                            height: 27,
                            borderRadius: 3,
                            backgroundColor: '#42C0F5',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: 20,
                        }}
                    >
                        <Text style={{ fontSize: 12, color: 'white' }}>
                            Send Reminder
                        </Text>
                    </TouchableOpacity>
                </View>
            </>
        )
    }
}

export default SendReminder

const styles = StyleSheet.create({})
