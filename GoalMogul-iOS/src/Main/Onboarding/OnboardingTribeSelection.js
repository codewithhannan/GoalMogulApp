/** @format */

import React from 'react'
import { View, Text, FlatList, Animated, Image } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import right_arrow_icon from '../../asset/utils/right_arrow.png'
import OnboardingHeader from './Common/OnboardingHeader'
import DelayedButton from '../Common/Button/DelayedButton'
import {
    GM_FONT_SIZE,
    GM_BLUE,
    GM_FONT_FAMILY,
    GM_FONT_LINE_HEIGHT,
    TEXT_STYLE as textStyle,
} from '../../styles'
import { registrationTribeSelection } from '../../redux/modules/registration/RegistrationActions'
import OnboardingFooter from './Common/OnboardingFooter'
import * as Animatable from 'react-native-animatable'

/**
 * Page for user to select interested tribe to join
 *
 * @link https://www.figma.com/file/T1ZgWm5TKDA4gtBS5gSjtc/GoalMogul-App?node-id=24%3A195
 */
class OnboardingTribeSelection extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            scroll: new Animated.Value(1),
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.scrollView.bounce(1000)
        }, 1000)
    }

    handleAnimatableTextRef = (ref) => (this.scrollView = ref)

    onNext = () => {
        const screenTransitionCallback = () => {
            Actions.push('registration_community_guideline')
        }
        screenTransitionCallback()
        // TODO: pass callback to actions
    }

    onBack = () => {
        const screenTransitionCallback = () => {
            Actions.pop()
        }
        screenTransitionCallback()
    }

    keyExtractor = (item) => item._id

    renderItem = ({ item, index, separators }) => {
        const { selected, name, picture } = item
        const containerStyle = selected
            ? styles.tribeCardSelectedContainerStyle
            : styles.tribeCardContainerStyle
        return (
            <DelayedButton
                style={containerStyle}
                onPress={() =>
                    this.props.registrationTribeSelection(item._id, !selected)
                }
            >
                <View style={{ flex: 1 }}>
                    <Image
                        style={styles.tribeCardImageStyle}
                        source={picture}
                    />
                </View>
                <Text
                    style={{
                        fontSize: GM_FONT_SIZE.FONT_2,
                        lineHeight: GM_FONT_LINE_HEIGHT.FONT_2,
                        fontFamily: GM_FONT_FAMILY.GOTHAM,
                        width: 120,
                        textAlign: 'center',
                    }}
                >
                    {name}
                </Text>
            </DelayedButton>
        )
    }

    renderScroll = () => {
        // Only render scroll when iphone model < 8
        const opacity = this.state.scroll.interpolate({
            inputRange: [0, 70],
            outputRange: [1, 0],
            extrapolate: 'clamp',
        })

        return (
            <Animatable.View
                style={{
                    opacity,
                    position: 'absolute',
                    bottom: 10,
                    alignSelf: 'center',
                }}
                ref={this.handleAnimatableTextRef}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#DEF7FF',
                        padding: 7,
                        width: 94,
                        borderRadius: 4,
                    }}
                >
                    <Image
                        source={right_arrow_icon}
                        style={{
                            transform: [{ rotate: '90deg' }],
                            tintColor: '#2F80ED',
                            height: 12,
                            width: 15,
                            marginRight: 5,
                        }}
                    />
                    <Text
                        style={{
                            fontSize: GM_FONT_SIZE.FONT_2,
                            fontFamily: GM_FONT_FAMILY.GOTHAM_BOLD,
                            color: '#2F80ED',
                            paddingTop: 2,
                            textAlign: 'center',
                        }}
                    >
                        Scroll
                    </Text>
                </View>
            </Animatable.View>
        )
    }

    render() {
        return (
            <View style={styles.containerStyle}>
                <OnboardingHeader />
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View style={{ alignItems: 'center', marginTop: 35 }}>
                        <Text
                            style={[
                                textStyle.onboardingTitleTextStyle,
                                { marginBottom: 20 },
                            ]}
                        >
                            Join some Tribes!
                        </Text>
                        <Text style={styles.subTitleTextStyle}>
                            It'll be easier to connet to
                        </Text>
                        <Text style={styles.subTitleTextStyle}>
                            others with similar goals.
                        </Text>
                    </View>
                    <FlatList
                        onScroll={Animated.event([
                            {
                                nativeEvent: {
                                    contentOffset: { y: this.state.scroll },
                                },
                            },
                        ])}
                        data={this.props.tribes}
                        renderItem={(item, index) =>
                            this.renderItem(item, index)
                        }
                        keyExtractor={this.keyExtractor}
                        numColumns={2}
                        style={{ marginTop: 10 }}
                        contentContainerStyle={{
                            paddingLeft: 8,
                            paddingRight: 8,
                            paddingTop: 5,
                            paddingBottom: 16,
                        }}
                    />
                    {this.renderScroll()}
                </View>

                <OnboardingFooter
                    totalStep={3}
                    currentStep={2}
                    onNext={this.onNext}
                    onPrev={this.onBack}
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
    subTitleTextStyle: {
        fontSize: GM_FONT_SIZE.FONT_4,
        lineHeight: GM_FONT_LINE_HEIGHT.FONT_4,
        fontFamily: GM_FONT_FAMILY.GOTHAM,
    },
    tribeCardContainerStyle: {
        backgroundColor: 'white',
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginTop: 20,
        height: 120,
        marginLeft: 8,
        marginRight: 8,
        paddingBottom: 16,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowRadius: 26,
        shadowOpacity: 1,
        shadowColor: 'rgba(0,0,0,0.06)',
    },
    tribeCardSelectedContainerStyle: {
        backgroundColor: '#F6FDFF',
        borderWidth: 1,
        borderColor: GM_BLUE,
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginTop: 20,
        height: 120,
        marginLeft: 8,
        marginRight: 8,
        paddingBottom: 16,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowRadius: 26,
        shadowOpacity: 1,
        shadowColor: 'rgba(0,0,0,0.06)',
    },
    tribeCardImageStyle: {
        width: 42,
        height: 42,
        marginTop: 20,
    },
}

const mapStateToProps = (state) => {
    const { tribes } = state.registration

    return {
        tribes,
    }
}

export default connect(mapStateToProps, {
    registrationTribeSelection,
})(OnboardingTribeSelection)
