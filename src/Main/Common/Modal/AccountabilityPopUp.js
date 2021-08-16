/** @format */

import React, { useState, Component } from 'react'
import {
    View,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    ImageBackground,
} from 'react-native'
import { Text } from 'react-native-animatable'
import Modal from 'react-native-modal'
import { color } from '../../../styles/basic'
import Tooltip from '../Tooltip'
import SWIPER_BACKGROUND from '../../../asset/image/tooltip.png'
import tooltipIcon from '../../../asset/icons/question.png'
import { requestAccountability } from '../../../actions/AccountableActions'
import { connect } from 'react-redux'

const MODAL_WIDTH = Dimensions.get('screen').width
const MODAL_HEIGHT = Dimensions.get('screen').height
const swiperText = `The accountability feature lets you schedule checkups for your friend's goals or habits, and reward or punish them based on their performance!`

class AccountabilityPopUp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            toolTipVisible: false,
        }
    }
    render() {
        const { name, goalId } = this.props
        // console.log('THIS IS GOALL ID', goalId)

        return (
            <>
                <Modal
                    backdropOpacity={0.4}
                    isVisible={this.props.isVisible}
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
                            <View
                                style={{
                                    flexDirection: 'row',
                                }}
                            >
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
                                <TouchableOpacity
                                    style={{
                                        position: 'absolute',
                                        bottom: 19,
                                        right: 65,
                                        justifyContent: 'flex-end',
                                    }}
                                    onPress={() =>
                                        this.setState({ toolTipVisible: true })
                                    }
                                >
                                    <Image
                                        source={tooltipIcon}
                                        style={{
                                            width: 16,
                                            height: 16,
                                            resizeMode: 'contain',
                                        }}
                                    />
                                </TouchableOpacity>
                            </View>

                            <View
                                style={{
                                    position: 'absolute',
                                    top: 58,
                                    zIndex: 5,
                                    left: 135,
                                }}
                            >
                                {this.state.toolTipVisible ? (
                                    <Tooltip
                                        title={swiperText}
                                        imageSource={SWIPER_BACKGROUND}
                                        type="swiperDetail"
                                        bgStyle={{ width: 250, height: 130 }}
                                        viewStyle={{
                                            right: 40,
                                            top: 10,
                                        }}
                                    />
                                ) : null}
                            </View>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    marginTop: 10,
                                    justifyContent: 'flex-end',
                                }}
                            >
                                <View style={{ width: 50 }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.props.requestAccountability(
                                                goalId
                                            )
                                            this.props.onClose()
                                        }}
                                    >
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
                                            this.props.onClose()
                                            this.setState({
                                                toolTipVisible: false,
                                            })
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
            </>
        )
    }
}

const mapStateToProps = (state, props) => {
    return {}
}

export default connect(mapStateToProps, {
    requestAccountability,
})(AccountabilityPopUp)
