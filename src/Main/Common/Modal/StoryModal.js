/** @format */

import React from 'react'
import {
    Image,
    View,
    Dimensions,
    TouchableWithoutFeedback,
    Text,
    TextInput,
} from 'react-native'

import Constant from 'expo-constants'
import Modal from 'react-native-modal'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

const StoryModal = ({
    isVisible,
    setIsVisible,
    count = 0,
    setCount,
    stories,
}) => {
    return (
        <Modal
            isVisible={isVisible}
            animationIn="zoomInUp"
            animationOut="zoomOutDown"
            hideModalContentWhileAnimating={true}
            animationInTiming={300}
            coverScreen={true}
            onBackdropPress={() => {
                setIsVisible(false)
            }}
            swipeDirection={['down', 'up']}
            onSwipeComplete={() => {
                console.log('Swiped Down')
                setIsVisible(false)
            }}
            onModalHide={() => setCount(0)}
        >
            <View
                style={{
                    width: screenWidth,
                    height: screenHeight,
                    left: '-5.5%',
                    top: 0,
                    // position: 'absolute',
                    // backgroundColor: 'red',
                }}
            >
                <View
                    style={{
                        zIndex: 2,
                        top: Constant.statusBarHeight + 5,
                        marginLeft: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Image
                        source={stories[count].profileImage}
                        style={{
                            height: 40,
                            width: 40,
                            borderRadius: 20,
                            borderColor: 'skyblue',
                            borderWidth: 2,
                            marginRight: 10,
                            backgroundColor: 'white',
                        }}
                        resizeMode="contain"
                    />
                    <Text
                        style={{
                            color: 'white',
                            fontWeight: 'bold',
                        }}
                    >
                        {stories[count].name}
                    </Text>
                </View>

                <Image
                    source={stories[count].story}
                    style={{
                        width: '100%',
                        height: '100%',
                        zIndex: 1,
                        position: 'absolute',
                    }}
                />
                <View
                    style={{
                        width: '100%',
                        height: '92%',
                        flexDirection: 'row',
                        position: 'absolute',
                        zIndex: 10,
                    }}
                >
                    <TouchableWithoutFeedback
                        onPress={() => {
                            if (count !== 0) {
                                setCount((old) => old - 1)
                            }
                        }}
                    >
                        <View style={{ flex: 1 }}></View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                        onPress={() => {
                            if (count === stories.length - 1) {
                                setIsVisible(false)
                            } else {
                                setCount((old) => old + 1)
                            }
                        }}
                    >
                        <View style={{ flex: 1 }}></View>
                    </TouchableWithoutFeedback>
                </View>
                <View
                    style={{
                        zIndex: 2,
                        position: 'absolute',
                        bottom: 0,
                        marginBottom: 20,
                        width: '100%',
                        alignItems: 'center',
                    }}
                >
                    <TextInput
                        placeholder="Reply To Story"
                        style={{
                            height: 45,
                            width: screenWidth - 80,
                            borderColor: 'darkGrey',
                            borderWidth: 2,
                            backgroundColor: 'rgba(130, 130, 130, 0.7)',
                            borderRadius: 30,
                            paddingHorizontal: 10,
                            color: 'white',
                        }}
                        placeholderTextColor="white"
                    />
                </View>
            </View>
        </Modal>
    )
}

export default StoryModal
