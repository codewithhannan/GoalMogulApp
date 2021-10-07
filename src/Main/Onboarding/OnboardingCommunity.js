/**
 * Fanout page for community guideline during onboard
 *
 * @see https://www.figma.com/file/T1ZgWm5TKDA4gtBS5gSjtc/GoalMogul-App?node-id=24%3A195
 *
 * @format
 */

import React from 'react'
import { View, Text, Dimensions, Image, Platform } from 'react-native'
import { connect } from 'react-redux'
import Carousel from 'react-native-snap-carousel'
import OnboardingHeader from './Common/OnboardingHeader'

import { text, color, default_style } from '../../styles/basic'
import OnboardingStyles from '../../styles/Onboarding'

import OnboardingFooter from './Common/OnboardingFooter'
import { Actions } from 'react-native-router-flux'
import {
    wrapAnalytics,
    SCREENS,
    EVENT as E,
    track,
    trackWithProperties,
} from '../../monitoring/segment'
import { Button } from 'react-native-paper'

const { text: textStyle } = OnboardingStyles

class OnboardingCommunity extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            swipeAll: false,
            indexvalue: 0,
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
        // track(E.REG_ACCOUNT_CREATED)
    }

    onSwipedAll = (index) => {
        trackWithProperties(E.ONBOARDING_STEP_COMPLETED, {
            step_number: index,
        })
        if (index === 3) {
            track(E.REG_ACCOUNT_CREATED)
        }

        if (index == this.props.communityGuidelines.length - 1) {
            this.setState({ ...this.state, swipeAll: true })
        }
    }

    getCurrentScreenWidth = () => {
        return Math.round(Dimensions.get('window').width)
    }

    getImageWidth = () => {
        const currentScreenWidth = this.getCurrentScreenWidth()

        return Platform.select({
            ios: currentScreenWidth - 32 - 10 - 10,
            android: currentScreenWidth - 32 - 10 - 70,
        })
    }

    renderCard = ({ index, item }) => {
        const { title, subTitle, picture } = item

        const width = this.getImageWidth()
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: color.GM_CARD_BACKGROUND,
                    paddingTop: 0,
                    paddingBottom: 30,
                    alignItems: 'center',
                    margin: 5,
                    borderWidth: 1,
                    borderColor: color.GM_CARD_BACKGROUND,
                    borderRadius: 10,
                    ...styles.shadow,
                }}
                key={Math.random().toString(36).substr(2, 9)}
            >
                <View
                    style={{ paddingTop: 0, position: 'absolute', bottom: 100 }}
                >
                    {picture ? (
                        <Image
                            style={{
                                width,
                                height: Dimensions.get('screen').height * 0.39,
                                backgroundColor: color.GM_CARD_BACKGROUND,
                            }}
                            source={picture}
                            resizeMode="contain"
                        />
                    ) : (
                        <View
                            style={{
                                width,
                                height: width,
                                borderTopLeftRadius: 10,
                                borderTopRightRadius: 10,
                            }}
                        />
                    )}
                </View>

                <View
                    style={{
                        // width: '90%',
                        bottom: 15,
                        position: 'absolute',
                        justifyContent: 'center',
                        // backgroundColor: 'red',
                    }}
                >
                    <Text
                        style={[
                            default_style.titleText_1,
                            {
                                fontSize: 22,
                                lineHeight: text.TEXT_LINE_HEIGHT.FONT_4 + 4,
                                fontFamily: text.FONT_FAMILY.REGULAR,
                                marginTop: 14,
                                marginBottom: 14,
                                textAlign: 'center',
                                fontWeight: '300',
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

    SwapSlide = (value) => {
        if (!this.state.swipeAll) {
            this.setState({ indexvalue: value })
        } else {
            this.onNext()
        }
    }

    render() {
        return (
            <View style={styles.containerStyle}>
                <OnboardingHeader />
                <View
                    style={{
                        flex: 1,
                        paddingBottom: 20,
                        paddingRight: 6,
                        paddingLeft: 6,
                    }}
                >
                    <View style={{ alignItems: 'center', marginTop: 20 }}>
                        <Text
                            style={
                                ([textStyle.title],
                                { fontWeight: '700', fontSize: 23 })
                            }
                        >
                            You are here to share
                        </Text>
                        <Text
                            style={
                                ([textStyle.title],
                                { fontWeight: '700', fontSize: 23 })
                            }
                        >
                            your goals with others.
                        </Text>
                    </View>
                    <View
                        style={{ flex: 1, alignItems: 'center', marginTop: 15 }}
                    >
                        <Carousel
                            ref={(value) => {
                                this.SwapSlide = value
                            }}
                            data={this.props.communityGuidelines}
                            renderItem={this.renderCard}
                            sliderWidth={this.getCurrentScreenWidth()}
                            itemWidth={this.getCurrentScreenWidth() - 36}
                            layout={'stack'}
                            layoutCardOffset={10}
                            onSnapToItem={this.onSwipedAll}
                        />
                    </View>
                </View>
                <OnboardingFooter
                    totalStep={2}
                    currentStep={2}
                    onNext={() => {
                        if (!this.state.swipeAll) {
                            this.SwapSlide.snapToNext()
                        } else {
                            this.onNext()
                        }
                    }}
                    onPrev={this.onBack}
                    // nextDisabled={!this.state.swipeAll}
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
        elevation: 3,
        shadowRadius: 6,
        shadowOpacity: 0.17,
        shadowColor: 'black',
    },
}

const mapStateToProps = (state) => {
    const { userId } = state.user
    const { communityGuidelines } = state.registration
    return {
        communityGuidelines,
        userId,
    }
}

const AnalyticsWrapper = wrapAnalytics(
    OnboardingCommunity,
    SCREENS.REG_COMMUNITY
)

export default connect(mapStateToProps, {})(AnalyticsWrapper)
