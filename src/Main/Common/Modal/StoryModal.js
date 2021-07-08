/** @format */

import React, { useState, useRef } from 'react'
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
import Carousel from 'react-native-snap-carousel'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

const StoryModal = ({
    isVisible,
    setIsVisible,
    count = 0,
    setCount,
    stories,
    storiesA,
}) => {
    const carousel = useRef(null)
    const [internalCount, setInternalCount] = useState(0)
    const [shouldSnap, setShouldSnap] = useState(false)
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
                setIsVisible(false)
            }}
            onModalHide={() => setInternalCount(0)}
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
                <Carousel
                    data={stories}
                    ref={carousel}
                    sliderWidth={screenWidth}
                    itemWidth={screenWidth}
                    firstItem={count}
                    snapToNext={shouldSnap}
                    renderItem={({ item, index }) => {
                        return (
                            <>
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
                                        source={item.profileImage}
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
                                        {item.name}
                                    </Text>
                                </View>

                                <Image
                                    source={item.story[internalCount]}
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
                                                setInternalCount(
                                                    (old) => old - 1
                                                )
                                            }
                                        }}
                                    >
                                        <View style={{ flex: 1 }}></View>
                                    </TouchableWithoutFeedback>
                                    <TouchableWithoutFeedback
                                        onPress={() => {
                                            console.log(carousel)
                                            if (
                                                internalCount ===
                                                item.story.length - 1
                                            ) {
                                                setInternalCount(0)
                                                carousel.current.snapToNext()
                                            } else {
                                                setInternalCount(
                                                    (old) => old + 1
                                                )
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
                                            backgroundColor:
                                                'rgba(130, 130, 130, 0.7)',
                                            borderRadius: 30,
                                            paddingHorizontal: 10,
                                            color: 'white',
                                        }}
                                        placeholderTextColor="white"
                                    />
                                </View>
                            </>
                        )
                    }}
                    // onSnapToItem={(index) =>
                    //     this.setState({ activeIndex: index })
                    // }
                />
                {/* <GestureRecognizer
                    // onSwipeLeft={(state) => onSwipeLeft(state)}
                    // onSwipeRight={(state) => onSwipeRight(state)}
                    onSwipe={(direction, state) => onSwipe(direction, state)}
                    style={{
                        height: '100%',
                        width: '100%',
                    }}
                    config={{
                        velocityThreshold: 0.3,
                        directionalOffsetThreshold: 80,
                    }}
                >
                    <>
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
                    </>
                </GestureRecognizer> */}
            </View>
        </Modal>
    )
}

export default StoryModal
