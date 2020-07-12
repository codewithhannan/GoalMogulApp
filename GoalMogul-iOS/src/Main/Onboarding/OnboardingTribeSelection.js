/**
 * Page for user to select interested tribe to join
 *
 * @link https://www.figma.com/file/T1ZgWm5TKDA4gtBS5gSjtc/GoalMogul-App?node-id=24%3A195
 *
 * @format
 */

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
    FONT_FAMILY_2,
    DEFAULT_STYLE,
    FONT_FAMILY_1,
} from '../../styles'
import { registrationTribeSelection } from '../../redux/modules/registration/RegistrationActions'
import OnboardingFooter from './Common/OnboardingFooter'
import * as Animatable from 'react-native-animatable'
import { Icon, CheckBox } from '@ui-kitten/components'

const CATEGORY = {
    all: 'All',
    relationship: 'Relationship',
    finance: 'Finance',
    family: 'Family',
    arts: 'Arts',
    realEstate: 'Real Estate',
}
class OnboardingTribeSelection extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            scroll: new Animated.Value(1),
            category: CATEGORY.all,
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

    selectCategory = (category) => {
        this.setState({
            ...this.state,
            category,
        })
    }

    keyExtractor = (item) => item._id

    renderItem = ({ item, index, separators }) => {
        const { selected, name, picture, description } = item
        const containerStyle = selected
            ? styles.tribeCardSelectedContainerStyle
            : styles.tribeCardContainerStyle
        return (
            <DelayedButton
                style={containerStyle}
                onPress={() =>
                    this.props.registrationTribeSelection(item._id, !selected)
                }
                activeOpacity={0.8}
            >
                <View
                    style={{
                        flex: 1,
                        borderTopLeftRadius: 3,
                        borderTopRightRadius: 3,
                    }}
                >
                    <Image
                        style={styles.tribeCardImageStyle}
                        source={picture}
                    />
                </View>
                <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            width: '100%',
                            paddingVertical: 8,
                            alignItems: 'center',
                        }}
                    >
                        <Icon
                            name="check-circle-outline"
                            pack="material-community"
                            style={{
                                tintColor: selected ? GM_BLUE : '#E0E0E0',
                                height: 23,
                                width: 23,
                            }}
                        />
                        <Text
                            style={[
                                DEFAULT_STYLE.titleText_1,
                                {
                                    paddingLeft: 8,
                                    letterSpacing: 0.2,
                                },
                            ]}
                        >
                            {name}
                        </Text>
                    </View>
                    <Text
                        style={[
                            DEFAULT_STYLE.normalText_1,
                            {
                                color: '#828282',
                                letterSpacing: 0.2,
                                paddingLeft: 2, // compensate for icon extra widith
                            },
                        ]}
                    >
                        {description}
                    </Text>
                </View>
            </DelayedButton>
        )
    }

    renderScroll = () => {
        // Only render scroll when iphone model < 8
        const opacity = this.state.scroll.interpolate({
            inputRange: [0, 120],
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

    renderListHeaderComponent = () => {
        return (
            <View
                style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    paddingHorizontal: 10,
                    paddingTop: 20,
                    paddingBottom: 15,
                    marginBottom: 2,
                    backgroundColor: 'white',
                }}
            >
                {BUTTON_LIST.map((button) => {
                    const { title, ...iconProps } = button

                    return (
                        <DelayedButton
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            onPress={() => this.selectCategory(title)}
                            activeOpacity={0.8}
                        >
                            <Icon
                                {...iconProps}
                                style={{
                                    height: 20,
                                    width: 20,
                                    tintColor:
                                        this.state.category == title
                                            ? GM_BLUE
                                            : '#828282',
                                }}
                            />
                            <Text
                                style={[
                                    DEFAULT_STYLE.normalText_2,
                                    {
                                        color:
                                            this.state.category == title
                                                ? GM_BLUE
                                                : '#333333',
                                        marginTop: 5,
                                    },
                                ]}
                            >
                                {title}
                            </Text>
                        </DelayedButton>
                    )
                })}
            </View>
        )
    }

    render() {
        return (
            <View style={styles.containerStyle}>
                <OnboardingHeader />
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View
                        style={{
                            alignItems: 'center',
                            paddingTop: 30,
                            backgroundColor: 'white',
                        }}
                    >
                        <Text
                            style={[
                                textStyle.onboardingTitleTextStyle,
                                { marginBottom: 15 },
                            ]}
                        >
                            Join some Tribes!
                        </Text>
                        <Text style={styles.subTitleTextStyle}>
                            It'll be easier to connet to others with similar
                            goals.
                        </Text>
                    </View>
                    {this.renderListHeaderComponent()}
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
                        numColumns={1}
                        // style={{ marginTop: 10 }}
                        contentContainerStyle={{
                            backgroundColor: 'white',
                            paddingBottom: 16,
                        }}
                        bounces={false}
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

const BUTTON_LIST = [
    {
        name: 'apps',
        pack: 'material',
        title: CATEGORY.all,
    },
    {
        name: 'heart-outline',
        pack: 'material-community',
        title: CATEGORY.relationship,
    },
    {
        name: 'cash-usd',
        pack: 'material-community',
        title: CATEGORY.finance,
    },
    {
        name: 'account-multiple-outline',
        pack: 'material-community',
        title: CATEGORY.family,
    },
    {
        name: 'brush',
        pack: 'material-community',
        title: CATEGORY.arts,
    },
    {
        name: 'home-outline',
        pack: 'material-community',
        title: CATEGORY.realEstate,
    },
]

const styles = {
    containerStyle: {
        flex: 1,
        backgroundColor: '#EAE8EA',
    },
    subTitleTextStyle: {
        fontSize: GM_FONT_SIZE.FONT_3,
        lineHeight: GM_FONT_LINE_HEIGHT.FONT_3,
        fontFamily: FONT_FAMILY_2,
    },
    tribeCardContainerStyle: {
        backgroundColor: 'white',
        borderRadius: 3,
        justifyContent: 'center',
        flex: 1,
        marginTop: 20,
        height: 120,
        marginLeft: 8,
        marginRight: 8,
        shadowOffset: {
            width: -2,
            height: 2,
        },
        shadowRadius: 3,
        shadowOpacity: 0.9,
        shadowColor: 'rgba(0,0,0,0.1)',
    },
    tribeCardSelectedContainerStyle: {
        backgroundColor: '#F6FDFF',
        borderWidth: 1,
        borderColor: GM_BLUE,
        borderRadius: 3,
        justifyContent: 'center',
        flex: 1,
        marginTop: 20,
        height: 120,
        marginLeft: 8,
        marginRight: 8,
        shadowOffset: {
            width: -2,
            height: 2,
        },
        shadowRadius: 3,
        shadowOpacity: 0.9,
        shadowColor: 'rgba(0,0,0,0.1)',
    },
    tribeCardImageStyle: {
        width: 42,
        height: 42,
        marginTop: 20,
        borderTopRightRadius: 3,
        borderTopLeftRadius: 3,
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
