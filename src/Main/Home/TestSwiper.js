/** @format */

import React, { Component } from 'react'
import {
    Text,
    View,
    Dimensions,
    StyleSheet,
    Image,
    SafeAreaView,
} from 'react-native'

import Carousel from 'react-native-snap-carousel' // Version can be specified in package.json

import { scrollInterpolator, animatedStyles } from './animation'

import GreenBadgeToast from '../../components/GreenBadgeToast'
import GetGreenBadge from '../../components/GetGreenBadge'
import GetBronzeBadge from '../../components/GetBronzeBadge'
import SilverBadge from '../../components/SilverBadge'

const SLIDER_WIDTH = Dimensions.get('window').width
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.95)
const ITEM_HEIGHT = Math.round((ITEM_WIDTH * 3) / 9)

const DATA = []
for (let i = 0; i < 10; i++) {
    DATA.push(i)
}

class CreateGoalToast extends Component {
    constructor(props) {
        super(props)
        this._renderItem = this._renderItem.bind(this)

        this.state = {
            index: 0,
        }
    }

    _renderItem({ item }) {
        return <SilverBadge />
    }

    render() {
        return (
            <View>
                <Carousel
                    ref={(c) => (this.carousel = c)}
                    data={DATA}
                    renderItem={this._renderItem}
                    sliderWidth={SLIDER_WIDTH}
                    itemWidth={ITEM_WIDTH}
                    containerCustomStyle={styles.carouselContainer}
                    inactiveSlideShift={0}
                    onSnapToItem={(index) => this.setState({ index })}
                    scrollInterpolator={scrollInterpolator}
                    slideInterpolatedStyle={animatedStyles}
                    useScrollView={true}
                />
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

export default CreateGoalToast

const styles = StyleSheet.create({
    carouselContainer: {
        marginTop: 5,
        marginBottom: 10,
    },
    itemContainer: {
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'dodgerblue',
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
