/** @format */

import React, { Component } from 'react'
import {
    View,
    Image,
    Text,
    TouchableWithoutFeedback,
    Dimensions,
    TouchableOpacity,
    ImageBackground,
} from 'react-native'
import { color, default_style } from '../styles/basic'
import { Icon } from '@ui-kitten/components'

import { connect } from 'react-redux'
import * as text from '../styles/basic/text'

import { Entypo } from '@expo/vector-icons'
import { setGoalProgressTooltip } from '../actions'

class StepsTooltip extends Component {
    constructor(props) {
        super(props)
        this.state = {
            toolTipVisible: true,
            checked: true,
        }
    }

    render() {
        const { tooltip, setGoalProgressTooltip } = this.props
        return (
            <>
                {this.state.toolTipVisible && tooltip.goalProgressTooltip ? (
                    <View
                        style={{
                            position: 'absolute',
                            zIndex: 1,
                            bottom: 78,
                            right: 25,
                        }}
                    >
                        <ImageBackground
                            resizeMode="cover"
                            source={require('../asset/image/messageUI.png')}
                            style={{
                                width: 217,
                                height: 95,
                            }}
                        >
                            <View>
                                <Text
                                    style={{
                                        fontSize: 12,
                                        lineHeight: 14.32,
                                        width: '88%',

                                        padding: 12,
                                        color: 'white',
                                        fontFamily: 'SFProDisplay-Semibold',
                                    }}
                                >
                                    This horizontal bar shows how much goal
                                    progress has been made.
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    this.state.checked &&
                                        setGoalProgressTooltip()
                                    this.setState({ toolTipVisible: false })
                                }}
                                style={{
                                    position: 'absolute',
                                    right: 8,
                                    top: 8,
                                }}
                            >
                                <Entypo name="cross" size={18} color="white" />
                            </TouchableOpacity>

                            <View style={{ flexDirection: 'row', padding: 10 }}>
                                <TouchableOpacity
                                    onPress={() =>
                                        this.setState({
                                            checked: !this.state.checked,
                                        })
                                    }
                                >
                                    <View
                                        style={{
                                            height: 13,
                                            width: 13,
                                            borderWidth: 1,
                                            marginHorizontal: 3,
                                            bottom: 5,

                                            borderColor: 'white',
                                            backgroundColor: this.state.checked
                                                ? 'white'
                                                : 'transparent',
                                            borderRadius: 2,
                                            borderColor: 'white',
                                        }}
                                    />
                                    <Icon
                                        name="done"
                                        pack="material"
                                        style={{
                                            height: 12,
                                            position: 'absolute',
                                            bottom: 5,
                                            left: 3,
                                            tintColor: '#42C0F5',
                                        }}
                                    />
                                </TouchableOpacity>

                                <View
                                    style={{ bottom: 6, marginHorizontal: 5 }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 12,

                                            color: 'white',
                                            fontFamily: 'SFProDisplay-Semibold',
                                        }}
                                    >
                                        Don't show me this tip again.
                                    </Text>
                                </View>
                            </View>
                        </ImageBackground>
                    </View>
                ) : null}
            </>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const { tooltip } = state
    return {
        tooltip,
    }
}

export default connect(mapStateToProps, { setGoalProgressTooltip })(
    StepsTooltip
)
