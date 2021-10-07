/** @format */

import React, { useState } from 'react'
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    StatusBar,
    FlatList,
    Image,
    TouchableOpacity,
} from 'react-native'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import * as Animatable from 'react-native-animatable'

//assets

import RECORDING from '../../asset/utils/Recording.png'
import VIDEO from '../../asset/utils/Video.png'
import ACCOUNTABILITY from '../../asset/utils/Accountability.png'

const todoList = [
    { id: '1', text: 'Learn JavaScript' },
    { id: '2', text: 'Learn React' },
    { id: '3', text: 'Learn TypeScript' },
]

const SWIPED_DATA = [
    {
        id: 1,
        source: ACCOUNTABILITY,
        onPress: () => console.log('Account'),
        backgroundColor: '#CEFFBC',
    },

    {
        id: 3,
        source: RECORDING,
        onPress: () => console.log('Record'),
        backgroundColor: '#D7F3FF',
    },
    {
        id: 2,
        source: VIDEO,
        onPress: () => console.log('Video'),
        backgroundColor: '#E5F7FF',
    },
]

const Separator = () => <View style={styles.itemSeparator} />

const rightSwipeActions = () => {
    return (
        <>
            {SWIPED_DATA.map((item, index) => {
                return (
                    <View>
                        <TouchableOpacity
                            onPress={item.onPress}
                            key={Math.random().toString(36).substr(2, 9)}
                        >
                            <Animatable.View
                                style={{
                                    backgroundColor: item.backgroundColor,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: 100,
                                    height: 170,
                                }}
                            >
                                <Image
                                    source={item.source}
                                    resizeMode="contain"
                                    style={{ height: 40, width: 40 }}
                                />
                            </Animatable.View>
                        </TouchableOpacity>
                    </View>
                )
            })}
        </>
    )
}
const swipeFromLeftOpen = () => {
    alert('Swipe from left')
}
const swipeFromRightOpen = () => {}
const ListItem = ({ text }) => (
    <Swipeable
        renderRightActions={rightSwipeActions}
        onSwipeableRightOpen={swipeFromRightOpen}
    >
        <View
            style={{
                paddingHorizontal: 30,
                paddingVertical: 20,
                backgroundColor: 'white',
                height: 170,

                justifyContent: 'center',
            }}
        >
            <Text style={{ fontSize: 24 }} style={{ fontSize: 20 }}>
                {text}
            </Text>
        </View>
    </Swipeable>
)
const SwipeGesture = () => {
    return (
        <>
            <StatusBar />
            <SafeAreaView style={styles.container}>
                <Text style={{ textAlign: 'center', marginVertical: 20 }}>
                    Swipe right or left
                </Text>
                <FlatList
                    data={todoList}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <ListItem {...item} />}
                    ItemSeparatorComponent={() => <Separator />}
                />
            </SafeAreaView>
        </>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    itemSeparator: {
        flex: 1,
        height: 1,
        backgroundColor: '#444',
    },
})
export default SwipeGesture
