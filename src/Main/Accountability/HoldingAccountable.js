/** @format */

import { HEADER_STYLES } from '../../styles/Header'
import React, { useState } from 'react'
import { View, FlatList, StyleSheet, Text, StatusBar } from 'react-native'
import { Image } from 'react-native-elements'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { Searchbar } from 'react-native-paper'
import img from '../../Main/Accountable_images/imagee.jpeg'
import { TouchableOpacity } from 'react-native-gesture-handler'
import CalenderModel from './CalenderModel'
import { connect } from 'react-redux'

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

function HoldingAccountable() {
    const [isVisible, setisVisible] = useState(false)

    const toggleModal = () => setisVisible(false)

    const rightSwipeActions = () => {
        return (
            <>
                <View
                    style={{
                        width: 60,
                        backgroundColor: 'red',
                        flexDirection: 'row',
                    }}
                >
                    <TouchableOpacity style={{ top: 15, left: 10 }}>
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
                    }}
                >
                    <TouchableOpacity style={{ top: 15, left: 10 }}>
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
                <View
                    style={{
                        width: 60,
                        // height: 80,
                        backgroundColor: '#27AE60',
                        flexDirection: 'row',
                    }}
                >
                    <TouchableOpacity
                        style={{ top: 10, left: 5 }}
                        onPress={() => setisVisible(true)}
                    >
                        <Image
                            resizeMode="contain"
                            source={require('../Accountable_images/reschedule.png')}
                            style={{
                                width: 55,
                                height: 85,
                            }}
                        />
                    </TouchableOpacity>
                </View>
            </>
        )
    }
    return (
        <>
            <View style={styles.headerStyle}>
                <Text style={styles.titleTextStyle}>
                    I'm Holding Accontable
                </Text>
            </View>
            <View style={{ width: '90%', top: 20, left: 18, height: 70 }}>
                <Searchbar placeholder="Search" />
            </View>

            <CalenderModel isVisible={isVisible} onClose={toggleModal} />
            <FlatList
                style={{ marginBottom: 10 }}
                data={todoList}
                keyExtractor={(item) => item.id}
                // renderItem={ListItem}
                renderItem={({ item }) => (
                    <Swipeable
                        friction={2}
                        leftThreshold={80}
                        rightThreshold={40}
                        // onSwipeableOpen={() => this.closeRow(index)}
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
                                        // lineHeight: 19.09,
                                        fontSize: 16,
                                        color: '#000',
                                    }}
                                >
                                    {item.text}
                                </Text>
                                <Text
                                    style={{
                                        fontWeight: '600',

                                        // lineHeight: 19.09,
                                        fontSize: 16,
                                        color: '#50505',
                                        // fontWeight:""
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
        </>
    )
}

const mapStateToProps = (state) => {
    return {}
}

export default connect(mapStateToProps, {})(HoldingAccountable)
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
