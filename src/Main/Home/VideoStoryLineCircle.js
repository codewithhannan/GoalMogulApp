/** @format */

import React, { useState } from 'react'
import { TouchableWithoutFeedback, View, Image, Text } from 'react-native'

import StoryModal from '../Common/Modal/StoryModal'

import { FONT_FAMILY, TEXT_FONT_SIZE } from '../../styles/basic/text'
import { GM_BLUE } from '../../styles/basic/color'

const VideoStoryLineCircle = ({
    image,
    name,
    profileImage,
    arrayStory,
    stories,
}) => {
    const [showModal, setShowModal] = useState(false)
    const [count, setCount] = useState(0)

    return (
        <View
            style={{
                width: 72,
                alignItems: 'center',
                justifyContent: 'center',
                height: 130,
                marginHorizontal: 2,
            }}
        >
            <View style={{ position: 'absolute' }}>
                <StoryModal
                    isVisible={showModal}
                    setIsVisible={setShowModal}
                    storiesA={arrayStory}
                    count={count}
                    setCount={setCount}
                    stories={stories}
                />
            </View>
            <TouchableWithoutFeedback
                onPress={() => {
                    setCount(stories.findIndex((item) => item.name === name))
                    setTimeout(() => setShowModal(true), 200)
                }}
            >
                <View style={{ height: 72 }}>
                    <Image
                        source={image}
                        style={{
                            height: 70,
                            width: 70,
                            borderRadius: 35,
                        }}
                    />
                    <View
                        style={{
                            height: 28,
                            width: 28,
                            borderRadius: 14,
                            position: 'absolute',
                            borderColor: GM_BLUE,
                            right: 0,
                            borderWidth: 1,
                            bottom: 0,
                            backgroundColor: 'white',
                        }}
                    >
                        <Image
                            resizeMode="contain"
                            source={profileImage}
                            style={{
                                height: 26,
                                width: 26,
                                borderRadius: 13,
                            }}
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>
            <Text
                style={{
                    width: 42,
                    // fontFamily: FONT_FAMILY.SEMI_BOLD,
                    fontSize: TEXT_FONT_SIZE.FONT_1,
                    alignSelf: 'center',
                    textAlign: 'center',
                    height: 50,
                }}
            >
                {name}
            </Text>
        </View>
    )
}

export default VideoStoryLineCircle
