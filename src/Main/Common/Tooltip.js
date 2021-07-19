/** @format */

import React, { Component } from 'react'
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native'

import { Icon } from '@ui-kitten/components'
import { connect } from 'react-redux'
import { Entypo } from '@expo/vector-icons'
import { setProgressTooltip } from '../../actions'
import * as Animatable from 'react-native-animatable'

class Tooltip extends Component {
    constructor(props) {
        super(props)
        this.state = {
            toolTipVisible: true,
            checked: true,
        }
    }

    componentDidMount() {}

    render() {
        const {
            tooltip,
            setProgressTooltip,
            imageSource,
            type,
            viewStyle,
            bgStyle,
        } = this.props

        return (
            <>
                {this.state.toolTipVisible &&
                (tooltip.goalProgressTooltip ||
                    tooltip.swipeToolTipStatus ||
                    tooltip.profileGoalDetail ||
                    tooltip.accountabilityTooltip ||
                    tooltip.suggestionToolTip) ? (
                    <Animatable.View
                        animation="fadeIn"
                        delay={500}
                        duration={500}
                        style={viewStyle}
                    >
                        <ImageBackground
                            resizeMode="cover"
                            source={imageSource}
                            style={
                                ([
                                    {
                                        width: 217,
                                        height: 95,
                                    },
                                ],
                                { ...bgStyle })
                            }
                        >
                            <View style={{ padding: 5 }}>
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
                                    {this.props.title}
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    this.state.checked &&
                                        setProgressTooltip(type)
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
                                            bottom: 14,

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
                                            bottom: 14,
                                            left: 3,
                                            tintColor: '#42C0F5',
                                        }}
                                    />
                                </TouchableOpacity>

                                <View
                                    style={{ bottom: 15, marginHorizontal: 5 }}
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
                    </Animatable.View>
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

export default connect(mapStateToProps, { setProgressTooltip })(Tooltip)
