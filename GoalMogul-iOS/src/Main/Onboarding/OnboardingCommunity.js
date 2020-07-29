/**
 * Fanout page for community guideline during onboard
 *
 * @see https://www.figma.com/file/T1ZgWm5TKDA4gtBS5gSjtc/GoalMogul-App?node-id=24%3A195
 *
 * @format
 */

import React from 'react'
import { View, Text, Dimensions, Image } from 'react-native'
import { connect } from 'react-redux'
import Carousel from 'react-native-snap-carousel'
import OnboardingHeader from './Common/OnboardingHeader'
import { TEXT_STYLE as textStyle } from '../../styles'
import { text, default_style } from '../../styles/basic'
import OnboardingFooter from './Common/OnboardingFooter'
import { Actions } from 'react-native-router-flux'

const screenWidth = Math.round(Dimensions.get('window').width)
class OnboardingCommunity extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            swipeAll: false,
        }
    }

    onBack = () => {
        Actions.pop()
    }

    onNext = () => {
        const screenTransitionCallback = () => {
            // TODO: analytics track
            Actions.push('registration_welcome')
        }
        screenTransitionCallback()
    }

    onSwipedAll = (index) => {
        if (index == this.props.communityGuidelines.length - 1) {
            this.setState({ ...this.state, swipeAll: true })
        }
    }

    renderCard = ({ index, item }) => {
        const { title, subTitle, picture } = item
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'white',
                    paddingTop: 0,
                    paddingBottom: 30,
                    alignItems: 'center',
                    margin: 10,
                    borderWidth: 1,
                    borderColor: 'white',
                    borderRadius: 10,
                    ...styles.shadow,
                }}
                key={index}
            >
                <View>
                    {picture ? (
                        <Image
                            style={{
                                width: screenWidth - 32 - 10 - 10,
                                height: screenWidth - 32 - 10,
                                backgroundColor: 'white',
                                borderTopLeftRadius: 10,
                                borderTopRightRadius: 10,
                            }}
                            source={picture}
                        />
                    ) : (
                        <View
                            style={{
                                width: screenWidth - 32 - 10 - 10,
                                height: screenWidth - 32 - 10,
                                backgroundColor: 'gray',
                                borderTopLeftRadius: 10,
                                borderTopRightRadius: 10,
                            }}
                        />
                    )}
                </View>

                <View
                    style={{ width: '70%', justifyContent: 'center', flex: 1 }}
                >
                    <Text
                        style={[
                            default_style.titleText_1,
                            {
                                fontSize: text.TEXT_FONT_SIZE.FONT_3_5,
                                lineHeight: text.TEXT_LINE_HEIGHT.FONT_4,
                                fontFamily: text.FONT_FAMILY.REGULAR,
                                marginTop: 14,
                                marginBottom: 14,
                                textAlign: 'center',
                            },
                        ]}
                    >
                        {title}
                    </Text>
                    {subTitle ? (
                        <Text
                            style={
                                (default_style.normalText_1,
                                {
                                    textAlign: 'center',
                                })
                            }
                        >
                            {subTitle}
                        </Text>
                    ) : null}
                </View>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.containerStyle}>
                <OnboardingHeader />
                <View
                    style={{
                        flex: 1,
                        paddingBottom: 20,
                        paddingRight: 20,
                        paddingLeft: 20,
                    }}
                >
                    <View style={{ alignItems: 'center', marginTop: 35 }}>
                        <Text style={textStyle.onboardingTitleTextStyle}>
                            You are here to share
                        </Text>
                        <Text style={textStyle.onboardingTitleTextStyle}>
                            your goals with others
                        </Text>
                    </View>
                    <View
                        style={{ flex: 1, alignItems: 'center', marginTop: 30 }}
                    >
                        <Carousel
                            ref={(c) => {
                                this._carousel = c
                            }}
                            data={this.props.communityGuidelines}
                            renderItem={this.renderCard}
                            sliderWidth={screenWidth}
                            itemWidth={screenWidth - 32}
                            layout={'stack'}
                            layoutCardOffset={10}
                            onSnapToItem={this.onSwipedAll}
                        />
                    </View>
                </View>
                <OnboardingFooter
                    totalStep={3}
                    currentStep={3}
                    onNext={this.onNext}
                    onPrev={this.onBack}
                    nextDisabled={!this.state.swipeAll}
                />
            </View>
        )
    }
}

const styles = {
    containerStyle: {
        flex: 1,
        backgroundColor: 'white',
    },
    shadow: {
        shadowOffset: {
            width: 0,
            height: 0,
        },
        elevation: 6,
        shadowRadius: 6,
        shadowOpacity: 1,
        shadowColor: 'rgba(0,0,0,0.3)',
    },
}

const mapStateToProps = (state) => {
    const { communityGuidelines } = state.registration
    return {
        communityGuidelines,
    }
}

export default connect(mapStateToProps, {})(OnboardingCommunity)
