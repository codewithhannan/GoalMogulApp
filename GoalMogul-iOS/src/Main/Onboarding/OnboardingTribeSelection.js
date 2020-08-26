/**
 * Page for user to select interested tribe to join
 *
 * @link https://www.figma.com/file/T1ZgWm5TKDA4gtBS5gSjtc/GoalMogul-App?node-id=24%3A195
 *
 * TODO: ghost card: when there is no tribes to render
 * @format
 */

import React from 'react'
import _ from 'lodash'
import { View, Text, FlatList, Animated, Image, Dimensions } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import right_arrow_icon from '../../asset/utils/right_arrow.png'
import OnboardingHeader from './Common/OnboardingHeader'
import DelayedButton from '../Common/Button/DelayedButton'

import { text, color, default_style } from '../../styles/basic'
import OnboardingStyles from '../../styles/Onboarding'

import {
    registrationTribeSelection,
    registrationFetchTribes,
    uploadSelectedTribes,
} from '../../redux/modules/registration/RegistrationActions'
import OnboardingFooter from './Common/OnboardingFooter'
import * as Animatable from 'react-native-animatable'

import { Icon, CheckBox } from '@ui-kitten/components'
import { getImageOrDefault, decode } from '../../redux/middleware/utils'
import { wrapAnalytics, SCREENS } from '../../monitoring/segment'

const { width } = Dimensions.get('window')
const { text: textStyle } = OnboardingStyles
const AnimatedFlatList = Animatable.createAnimatableComponent(FlatList)

// TODO: when categories are cleaned, this mapping needs to be updated
// https://app.asana.com/0/1179217829906631/1184987107432454
const CATEGORY = {
    all: {
        title: 'All',
        category: 'General',
    },
    relationship: {
        title: 'Relationships',
        category: 'Family/Personal',
    },
    finance: {
        title: 'Finance',
        category: 'Financial',
    },
    arts: {
        title: 'Arts',
        category: 'Things',
    },
    realEstate: {
        title: 'Real Estate',
        category: 'Career/Business',
    },
}
class OnboardingTribeSelection extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            scroll: new Animated.Value(1),
            category: CATEGORY.all.title,
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.scrollView.bounce(1000)
        }, 1000)

        this.props.registrationFetchTribes()
    }

    handleAnimatableTextRef = (ref) => (this.scrollView = ref)

    onNext = () => {
        Actions.push('registration_community_guideline')
        this.props.uploadSelectedTribes()
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
        const { selected, name, picture, description, memberCount } = item
        const containerStyle = selected
            ? styles.tribeCardSelectedContainerStyle
            : styles.tribeCardContainerStyle

        return (
            <DelayedButton
                style={containerStyle}
                onPress={() =>
                    this.props.registrationTribeSelection(item._id, !selected)
                }
                activeOpacity={0.9}
            >
                <View
                    style={{
                        flex: 1,
                        borderTopLeftRadius: 3,
                        borderTopRightRadius: 3,
                    }}
                >
                    <View
                        style={{
                            position: 'absolute',
                            bottom: 16,
                            left: 16,
                            zIndex: 2,
                            borderRadius: 10,
                            borderWidth: 0.5,
                            backgroundColor: selected
                                ? color.GM_BLUE
                                : color.GM_CARD_BACKGROUND,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderColor: selected ? color.GM_BLUE : '#8C8C8C',
                        }}
                    >
                        <Icon
                            name="check"
                            pack="material-community"
                            style={{
                                tintColor: selected
                                    ? color.GM_CARD_BACKGROUND
                                    : '#8C8C8C',
                                height: 20,
                                width: 20,
                            }}
                        />
                    </View>
                    <Image
                        style={{
                            height: (width - 32) / 2.2,
                            width: width - 32,
                            borderTopLeftRadius: 5,
                            borderTopRightRadius: 5,
                        }}
                        source={getImageOrDefault(picture)}
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
                        <Text
                            style={[
                                default_style.titleText_1,
                                {
                                    letterSpacing: text.LETTER_SPACING.REGULAR,
                                    flex: 1,
                                },
                            ]}
                        >
                            {name}
                        </Text>
                        <Text
                            style={[
                                default_style.normalText_1,
                                {
                                    color: '#828282',
                                    letterSpacing: text.LETTER_SPACING.REGULAR,
                                },
                            ]}
                        >
                            {memberCount}{' '}
                            {memberCount > 1 ? 'members' : 'member'}
                        </Text>
                    </View>
                    <Text
                        style={[
                            default_style.normalText_1,
                            {
                                color: '#828282',
                                letterSpacing: text.LETTER_SPACING.REGULAR,
                            },
                        ]}
                    >
                        {decode(description)}
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
                            fontSize: text.TEXT_FONT_SIZE.FONT_2,
                            fontFamily: text.FONT_FAMILY.BOLD,
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
                    paddingHorizontal: 16,
                    paddingBottom: 16,
                    marginBottom: 2,
                    backgroundColor: color.GM_CARD_BACKGROUND,
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
                            key={title}
                        >
                            <Icon
                                {...iconProps}
                                style={{
                                    height: 20,
                                    width: 20,
                                    tintColor:
                                        this.state.category == title
                                            ? color.GM_BLUE
                                            : '#828282',
                                }}
                            />
                            <Text
                                style={[
                                    default_style.normalText_2,
                                    {
                                        color:
                                            this.state.category == title
                                                ? color.GM_BLUE
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
        const { tribes } = this.props
        const tribesToRender = filterTribesByCategory({
            tribes,
            category: this.state.category,
        })
        return (
            <View
                style={[
                    OnboardingStyles.container.page,
                    { paddingBottom: 0, backgroundColor: '#EAE8EA' },
                ]}
            >
                <OnboardingHeader />
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: color.GM_CARD_BACKGROUND,
                            paddingTop: 24,
                            padding: 16,
                        }}
                    >
                        <Text style={[textStyle.title, { marginBottom: 12 }]}>
                            Join some Tribes!
                        </Text>
                        <Text
                            style={[
                                textStyle.subTitle,
                                {
                                    color: color.TEXT_COLOR.DARK,
                                    fontFamily: text.FONT_FAMILY.REGULAR,
                                    textAlign: 'center',
                                    flexWrap: 'wrap',
                                },
                            ]}
                        >
                            It'll be easier to connet to others with similar
                            goals.
                        </Text>
                    </View>
                    {this.renderListHeaderComponent()}
                    <AnimatedFlatList
                        onScroll={Animated.event(
                            [
                                {
                                    nativeEvent: {
                                        contentOffset: { y: this.state.scroll },
                                    },
                                },
                            ],
                            { useNativeDriver: false }
                        )}
                        data={tribesToRender}
                        renderItem={(item, index) =>
                            this.renderItem(item, index)
                        }
                        keyExtractor={this.keyExtractor}
                        numColumns={1}
                        // style={{ marginTop: 10 }}
                        contentContainerStyle={{
                            backgroundColor: color.GM_CARD_BACKGROUND,
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

const filterTribesByCategory = ({ tribes, category }) => {
    if (category === CATEGORY.all.title) return tribes

    // Get the category by title from CATEGORY
    const categoryToFilter = _.filter(CATEGORY, (c) => c.title === category)[0]
        .category
    return tribes.filter((tribeDoc) => tribeDoc.category === categoryToFilter)
}

const BUTTON_LIST = [
    {
        name: 'apps',
        pack: 'material',
        title: CATEGORY.all.title,
    },
    {
        name: 'heart-outline',
        pack: 'material-community',
        title: CATEGORY.relationship.title,
    },
    {
        name: 'cash-usd',
        pack: 'material-community',
        title: CATEGORY.finance.title,
    },
    {
        name: 'brush',
        pack: 'material-community',
        title: CATEGORY.arts.title,
    },
    {
        name: 'home-outline',
        pack: 'material-community',
        title: CATEGORY.realEstate.title,
    },
]

const styles = {
    tribeCardContainerStyle: {
        backgroundColor: 'white',
        borderRadius: 5,
        justifyContent: 'center',
        flex: 1,
        marginTop: 20,
        marginLeft: 16,
        marginRight: 16,
        shadowOffset: {
            width: -2,
            height: 2,
        },
        shadowRadius: 3,
        shadowOpacity: 0.9,
        shadowColor: 'rgba(0,0,0,0.1)',
        borderWidth: 0.5,
        borderColor: '#FAFAFA',
    },
    tribeCardSelectedContainerStyle: {
        backgroundColor: '#F6FDFF',
        borderRadius: 5,
        justifyContent: 'center',
        flex: 1,
        marginTop: 20,
        marginLeft: 16,
        marginRight: 16,
        shadowOffset: {
            width: -2,
            height: 2,
        },
        shadowRadius: 3,
        shadowOpacity: 0.9,
        shadowColor: 'rgba(0,0,0,0.1)',
        borderWidth: 0.5,
        borderColor: color.GM_BLUE,
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

const AnalyticsWrapper = wrapAnalytics(
    OnboardingTribeSelection,
    SCREENS.REG_TRIBES
)

export default connect(mapStateToProps, {
    registrationTribeSelection,
    registrationFetchTribes,
    uploadSelectedTribes,
})(AnalyticsWrapper)
