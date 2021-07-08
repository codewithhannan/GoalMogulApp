/** @format */

import React, { useState } from 'react'
import {
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    ImageBackground,
} from 'react-native'
import { Text } from 'react-native-animatable'
import Modal from 'react-native-modal'
import { color } from '../../../styles/basic'
import Tooltip from '../Tooltip'
import SWIPER_BACKGROUND from '../../../asset/image/messageUI1.png'

function AccountabilityPopUp({ isVisible, name, onClose }) {
    const MODAL_WIDTH = Dimensions.get('screen').width
    const MODAL_HEIGHT = Dimensions.get('screen').height
    const swiperText = `The accountability feature lets you schedule checkups for your friend's goals or habits, and reward or punish them based on their performance!`
    const [toolTipVisible, setToolTipVisible] = useState(false)

    return (
        <Modal
            backdropOpacity={0.4}
            isVisible={isVisible}
            animationIn="zoomInUp"
            animationInTiming={400}
        >
            <View
                style={{
                    flex: 1,
                    position: 'absolute',
                    top: 220,
                }}
            >
                <View
                    style={{
                        width: '100%',

                        backgroundColor: color.GM_BACKGROUND,
                        height: 120,

                        borderRadius: 5,
                    }}
                >
                    <View style={{ flexDirection: 'row' }}>
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: '600',
                                padding: 15,
                                width: '100%',
                                lineHeight: 25,
                            }}
                        >
                            {`Request to hold ${name} accountable for his goal?`}
                        </Text>
                    </View>

                    <View
                        style={{
                            position: 'absolute',
                            top: 45,
                            left: 135,
                        }}
                    >
                        {toolTipVisible ? (
                            <Tooltip
                                title={swiperText}
                                imageSource={SWIPER_BACKGROUND}
                                type="swiperDetail"
                                viewStyle={{
                                    position: 'absolute',
                                    zIndex: 1,
                                    left: 3,
                                    top: 10,
                                }}
                            />
                        ) : null}
                        <TouchableOpacity
                            style={{ left: 120 }}
                            onPress={() => setToolTipVisible(true)}
                        >
                            <Text>Tooltip</Text>
                        </TouchableOpacity>
                    </View>

                    <View
                        style={{
                            flexDirection: 'row',
                            marginTop: 10,
                            justifyContent: 'flex-end',
                        }}
                    >
                        <View style={{ width: 50 }}>
                            <TouchableOpacity>
                                <Text
                                    style={{
                                        fontSize: 19,
                                        color: color.GM_BLUE,
                                        fontWeight: '600',
                                    }}
                                >
                                    YES
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: 50 }}>
                            <TouchableOpacity
                                onPress={() => {
                                    onClose()
                                    setToolTipVisible(false)
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 19,
                                        color: color.GM_BLUE,
                                        fontWeight: '600',
                                    }}
                                >
                                    NO
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({})

export default AccountabilityPopUp
