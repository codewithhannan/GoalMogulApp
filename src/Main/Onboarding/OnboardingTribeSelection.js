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
import { View, Text } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import OnboardingHeader from './Common/OnboardingHeader'

import { text, color, default_style } from '../../styles/basic'
import OnboardingStyles from '../../styles/Onboarding'

import {
    registrationTribeSelection,
    uploadSelectedTribes,
    registrationFetchTribes,
} from '../../redux/modules/registration/RegistrationActions'
import OnboardingFooter from './Common/OnboardingFooter'

import { wrapAnalytics, SCREENS } from '../../monitoring/segment'
import TribeDiscover from '../Tribe/TribeDiscover'
import DelayedButton from '../Common/Button/DelayedButton'
import { Icon } from '@ui-kitten/components'

const { text: textStyle } = OnboardingStyles

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
            category: CATEGORY.all.title,
        }
    }

    componentDidMount() {
        this.props.registrationFetchTribes()
    }

    selectCategory = (category) => {
        this.setState({
            ...this.state,
            category,
        })
    }

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

    keyExtractor = (item) => item._id

    renderHeader() {
        return <OnboardingHeader />
    }

    renderHeaderText() {
        return (
            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: color.GM_CARD_BACKGROUND,
                    paddingTop: 24,
                    padding: 16,
                }}
            >
                <Text
                    style={
                        ([textStyle.title],
                        { marginBottom: 12, fontWeight: '700', fontSize: 22 })
                    }
                >
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
                    It'll be easier to connect to others with similar goals.
                </Text>
            </View>
        )
    }

    renderCategorySelector = () => {
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
                            key={Math.random().toString(36).substr(2, 9)}
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
                <TribeDiscover
                    canSelect
                    renderHeader={this.renderHeader}
                    renderHeaderText={this.renderHeaderText}
                    renderCategorySelector={this.renderCategorySelector}
                    itemOnPress={(tribeDoc) =>
                        this.props.registrationTribeSelection(
                            tribeDoc._id,
                            !tribeDoc.selected
                        )
                    }
                    handleRefresh={this.props.registrationFetchTribes}
                    tribesToRender={tribesToRender}
                    bounces={false}
                    useTribesToRender
                />
                <OnboardingFooter
                    totalStep={2}
                    currentStep={1}
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
    return tribes
        ? tribes.filter((tribeDoc) => tribeDoc.category === categoryToFilter)
        : []
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
