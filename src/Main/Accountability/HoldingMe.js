/** @format */
/** @format */

import { HEADER_STYLES } from '../../styles/Header'

import React, { useState } from 'react'
import { View, FlatList, StyleSheet, Text, StatusBar } from 'react-native'
import { Image } from 'react-native-elements'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { Searchbar } from 'react-native-paper'
import img from '../../Main/Accountable_images/imagee.jpeg'
import { TouchableOpacity } from 'react-native-gesture-handler'
import ADD from '../../asset/icons/account_add.png'
import SelectGoalModal from './components/SelectGoalModal'

const todoList = [
    { id: '1', text: 'Amila Brown ', image: img, name: 'Name of Goal' },
    { id: '2', text: 'Alfi Ray', image: img, name: 'Name of Goal' },
    { id: '3', text: 'Andrq Wilson', image: img, name: 'Name of Goal' },
    { id: '4', text: 'Amila Brown', image: img, name: 'Name of Goal' },
    { id: '5', text: 'Andrq Wilson', image: img, name: 'Name of Goal' },
    { id: '6', text: 'Amila Brown', image: img, name: 'Name of Goal' },
    { id: '7', text: 'Andrq Wilson', image: img, name: 'Name of Goal' },
]
const Separator = () => <View style={styles.itemSeparator} />

const rightSwipeActions = () => {
    return (
        <>
            <View
                style={{
                    width: 60,
                    backgroundColor: 'red',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <TouchableOpacity>
                    <Image
                        resizeMode="contain"
                        source={require('../../asset/icons/trash.png')}
                        style={{
                            width: 35,
                            height: 35,
                        }}
                    />
                </TouchableOpacity>
            </View>
            <View
                style={{
                    width: 60,
                    backgroundColor: '#45C9F6',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <TouchableOpacity>
                    <Image
                        resizeMode="contain"
                        source={require('../Accountable_images/message.png')}
                        style={{
                            width: 35,
                            height: 35,
                        }}
                    />
                </TouchableOpacity>
            </View>
        </>
    )
}

export default function HoldingAccountable() {
    const [isVisible, setisVisible] = useState(false)

    const closeModal = () => setisVisible(false)

    return (
        <>
            <View style={styles.headerStyle}>
                <Text style={styles.titleTextStyle}>
                    Holding Me Accounntable
                </Text>
            </View>
            <TouchableOpacity onPress={() => setisVisible(true)}>
                <View
                    style={{
                        marginTop: 20,
                        alignSelf: 'center',
                        flexDirection: 'row',
                    }}
                >
                    <Image
                        source={ADD}
                        style={{ height: 22, width: 22 }}
                        resizeMode="contain"
                    />
                    <Text
                        style={{
                            left: 5,
                            fontSize: 15,
                            top: 1,
                            fontWeight: '600',
                        }}
                    >
                        Add More Accountability Buddies
                    </Text>
                </View>
            </TouchableOpacity>

            <FlatList
                style={{ marginTop: 20 }}
                data={todoList}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Swipeable
                        friction={2}
                        leftThreshold={80}
                        rightThreshold={40}
                        renderRightActions={rightSwipeActions}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                padding: 10,
                            }}
                        >
                            <View>
                                <Image
                                    source={require('../../asset/utils/defaultUserProfile.png')}
                                    style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 30,
                                        // marginBottom: 10,
                                    }}
                                />
                            </View>

                            <View
                                style={{
                                    paddingLeft: 10,
                                    flexDirection: 'column',
                                    justifyContent: 'space-evenly',
                                }}
                            >
                                <Text
                                    style={{
                                        fontWeight: '400',

                                        fontSize: 16,
                                        color: '#000',
                                    }}
                                >
                                    {item.text}
                                </Text>
                                <Text
                                    style={{
                                        fontWeight: '600',
                                        fontSize: 16,
                                        color: '#50505',
                                    }}
                                >
                                    {item.name}
                                </Text>
                            </View>
                        </View>
                    </Swipeable>
                )}
                ItemSeparatorComponent={() => <Separator />}
            />

            <SelectGoalModal isVisible={isVisible} closeModal={closeModal} />
        </>
    )
}
const styles = StyleSheet.create({
    container: {
        // marginBottom: 10,
        // height: 50,
        // flex: 1,
        // height: 50,
        // marginTop: StatusBar.currentHeight || 0,
    },
    item: {
        // backgroundColor: '#fad586',
        // padding: 20,
        // marginVertical: 8,
        // marginHorizontal: 16,
    },
    title: {
        // fontSize: 20,
    },
    headerStyle: {
        ...HEADER_STYLES.headerContainer,
        justifyContent: 'center',
    },
    titleTextStyle: HEADER_STYLES.title,
    titleTextStyles: {
        top: 15,
        left: 20,
    },
    // titles: { left: 300, bottom: 13, fontSize: 22 },
    // container: {
    //     flex: 1,
    // },
    itemSeparator: {
        flex: 1,
        height: 1,
        backgroundColor: '#DADADA',
    },
})
