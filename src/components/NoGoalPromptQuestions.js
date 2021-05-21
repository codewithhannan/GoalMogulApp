/** @format */

import React, { Component } from 'react'
import { Text, View, Dimensions, StyleSheet, Image } from 'react-native'
import CreateGoal from '../asset/image/CreateGoalLion.png'
import { connect } from 'react-redux'

import Carousel from 'react-native-snap-carousel' // Version can be specified in package.json

import { scrollInterpolator, animatedStyles } from './noGoalAnimation'
import { color } from '../styles/basic'

const SLIDER_WIDTH = Dimensions.get('window').width
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7)
const ITEM_HEIGHT = Math.round((ITEM_WIDTH * 3) / 12)

const DATA = []
for (let i = 0; i < 10; i++) {
    DATA.push(i)
}

class CreateGoalToast extends Component {
    state = {
        activeIndex: 0,
    }

    constructor(props) {
        super(props)
        this._renderItem = this._renderItem.bind(this)
    }

    componentDidMount() {}

    _renderItem({ item }) {
        const { firstText, randomText } = this.props

        return (
            <View
                style={{
                    backgroundColor: color.GM_BLUE_LIGHT_LIGHT,
                    borderRadius: 5,
                    height: 80,
                    width: ITEM_WIDTH * 1.109,

                    marginLeft: 30,
                    flex: 1,
                    justifyContent: 'center',
                }}
            >
                <Text
                    style={{
                        fontSize: 14,
                        color: '#333333',
                        fontWeight: 'normal',
                        lineHeight: 18,
                        width: ITEM_WIDTH * 1.035,
                        position: 'absolute',
                        left: 16,

                        fontStyle: 'SFProDisplay-Regular',
                    }}
                >
                    {item}
                </Text>
            </View>
        )
    }

    render() {
        return (
            <View style={{ bottom: 75, position: 'absolute', width: '100%' }}>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'center',
                    }}
                >
                    {/* <Carousel
                    ref={(c) => (this.carousel = c)}
                    loop={true}
                    loopClonesPerSide={20}
                    data={this.props.randomQuestions}
                    renderItem={this._renderItem}
                    sliderWidth={SLIDER_WIDTH}
                    itemWidth={ITEM_WIDTH}
                    containerCustomStyle={styles.carouselContainer}
                    inactiveSlideShift={0}
                    onSnapToItem={(index) => this.setState({ index })}
                    scrollInterpolator={scrollInterpolator}
                    slideInterpolatedStyle={animatedStyles}
                    useScrollView={true}
                /> */}
                    <Carousel
                        layout={'default'}
                        ref={(ref) => (this.carousel = ref)}
                        data={this.props.randomQuestions}
                        sliderWidth={ITEM_WIDTH * 1.085}
                        itemWidth={ITEM_WIDTH * 1.085}
                        renderItem={this._renderItem}
                        onSnapToItem={(index) =>
                            this.setState({
                                activeIndex: index,
                            })
                        }
                    />
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    const { user } = state.user
    const { profile } = user

    return {
        profile,
    }
}

export default connect(mapStateToProps, {})(CreateGoalToast)

const styles = StyleSheet.create({
    carouselContainer: {},
    itemContainer: {
        width: '100%',
        height: 76,
        alignItems: 'center',
        justifyContent: 'center',

        backgroundColor: color.PG_BACKGROUND,
        flexDirection: 'row',
        borderRadius: 5,
    },
    itemLabel: {
        color: 'white',
        fontSize: 24,
    },
    counter: {
        marginTop: 25,
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
    },
})
