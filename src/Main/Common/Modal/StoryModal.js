/** @format */

import React, { useState, useRef } from 'react'
import {
    Image,
    View,
    Dimensions,
    TouchableWithoutFeedback,
    Text,
    ActivityIndicator,
} from 'react-native'

import Constant from 'expo-constants'
import Modal from 'react-native-modal'
import Carousel from 'react-native-snap-carousel'
import { Video, AVPlaybackStatus } from 'expo-av'
import * as Progress from 'react-native-progress'
import { GM_BLUE } from '../../../styles/basic/color'

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
    const video = useRef(null)
    const [status, setStatus] = useState({ isLoaded: false })
    const [progress, setProgress] = useState(0)

    const nextItem = (item) => {
        setStatus({ isLoaded: false })
        if (internalCount === item.story.length - 1) {
            if (count === stories.length - 1) {
                setIsVisible(false)
            } else {
                setProgress(0)
                setTimeout(() => {
                    carousel.current.snapToNext()
                }, 260)
                setInternalCount(0)
            }
        } else {
            setProgress(0)

            setInternalCount((old) => old + 1)
            // startTimer()
        }
    }

    const prevItem = (item) => {
        setStatus({ isLoaded: false })
        if (internalCount !== 0) {
            setProgress(0)

            setInternalCount((old) => old - 1)
            // startTimer()
        } else {
            if (count != 0) {
                setProgress(0)

                carousel.current.snapToPrev()
            }
        }
    }
    // const startTimer = () => {
    //     const interval = setInterval(() => {
    //         setProgress((old) =>
    //             old + status.durationMillis
    //                 ? 0.05 / status.durationMillis
    //                 : 0.05
    //         )
    //     }, 100)

    //     setTimeout(
    //         () => {
    //             clearInterval(interval)
    //             nextItem(stories[count])
    //         },
    //         status.durationMillis ? status.durationMillis : 2500
    //     )
    // }

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
            onModalHide={() => {
                setInternalCount(0)
                // setProgress(0)
            }}
            onModalShow={() => {
                startTimer()
            }}
        >
            <View
                style={{
                    width: screenWidth + 5,
                    height: screenHeight,
                    left: '-5.6%',
                    top: 0,
                    backgroundColor: 'rgba(0,0,0,1)',
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
                    onBeforeSnapToItem={() => {}}
                    onSnapToItem={(index) => {
                        setCount(index)
                        // startTimer()
                    }}
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
                                {/* <View
                                    style={{
                                        zIndex: 2,
                                        top: Constant.statusBarHeight + 15,
                                        marginLeft: 20,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Progress.Bar
                                        progress={progress}
                                        width={screenWidth - 40}
                                        color="white"
                                        height={3}
                                        borderRadius={1}
                                    />
                                </View> */}

                                {item.story[internalCount]?.type === 'img' ? (
                                    <Image
                                        resizeMode="contain"
                                        source={item.story[internalCount]?.uri}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            zIndex: 1,
                                            position: 'absolute',
                                        }}
                                    />
                                ) : (
                                    <>
                                        {status.isLoaded === false ? (
                                            <ActivityIndicator
                                                size="large"
                                                color={GM_BLUE}
                                                style={{
                                                    top: '45%',
                                                    position: 'absolute',
                                                    zIndex: 1,
                                                    alignSelf: 'center',
                                                }}
                                            />
                                        ) : (
                                            <></>
                                        )}
                                        <Video
                                            ref={video}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                zIndex: 1,
                                                position: 'absolute',
                                                backgroundColor:
                                                    'rgba(0,0,0,0.7)',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                            source={{
                                                uri:
                                                    item.story[internalCount]
                                                        ?.uri,
                                            }}
                                            useNativeControls={false}
                                            resizeMode="contain"
                                            shouldPlay={status.isLoaded}
                                            onPlaybackStatusUpdate={(
                                                status
                                            ) => {
                                                setStatus(() => status)
                                            }}
                                        />
                                    </>
                                )}

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
                                            prevItem(item)
                                        }}
                                    >
                                        <View style={{ flex: 1 }}></View>
                                    </TouchableWithoutFeedback>
                                    <TouchableWithoutFeedback
                                        onPress={() => {
                                            nextItem(item)
                                        }}
                                    >
                                        <View style={{ flex: 1 }}></View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </>
                        )
                    }}
                />
            </View>
        </Modal>
    )
}

export default StoryModal
