/**
 * This modal shows the congradulation message for user earning a new badge
 *
 * @format
 */

import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { View, Image, Text, Animated, ImageBackground } from 'react-native'
import Constants from 'expo-constants'
import { LinearGradient } from 'expo-linear-gradient'
import Modal from 'react-native-modal'
import {
    markEarnBadgeModalAsShown,
    fetchBadgeUserCount,
} from '../../../actions/ProfileActions'
import cancel from '../../../asset/utils/cancel_no_background.png'
import Icons from '../../../asset/base64/Icons'
import { Logger } from '../../../redux/middleware/utils/Logger'
import DelayedButton from '../../Common/Button/DelayedButton'
import {
    modalCancelIconContainerStyle,
    modalCancelIconStyle,
    modalContainerStyle,
    modalHeaderBadgeShadow,
} from '../../../styles'
import Badges, {
    Bronze3D,
    Silver3D,
    Gold3D,
    Green,
} from '../../../asset/banner'
import { ConfettiFadedBackground } from '../../../asset/background'
import {
    getBagdeIconByTier,
    getBadgeTextByTier,
} from '../../../redux/modules/gamification/BadgeActions'
import GoldBadgeInfoModal from './GoldBadgeInfoModal'
import GoldBadgeRewardModal from './GoldBadgeRewardModal'

const { CheckIcon, InfoIcon, QuestionIcon } = Icons
const DEBUG_KEY = '[ UI EarnBadgeModal ]'

class EarnBadgeModal extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            numberLoaded: false,
            numberOfUsersOnSameBadge: undefined,
            showGoldBagdeInfoModal: false,
            showGoldBadgeRewardModal: false,
        }

        this.animations = {
            numberOfUsersOnSameBadgeOpacity: new Animated.Value(0),
        }
    }

    componentDidUpdate(prevProps) {
        // Modal is shown
        if (!prevProps.isVisible && this.props.isVisible) {
            // Send request to fetch the number of
            const callback = (count) => {
                console.log(
                    `${DEBUG_KEY}: [ componentDidUpdate ]: count is: `,
                    count
                )
                this.setState(
                    {
                        ...this.state,
                        numberLoaded: true,
                        numberOfUsersOnSameBadge: count,
                    },
                    () => {
                        Animated.timing(
                            this.animations.numberOfUsersOnSameBadgeOpacity,
                            {
                                toValue: 1,
                                duration: 400,
                                useNativeDriver: true,
                            }
                        ).start()
                    }
                )
            }

            const tier =
                _.get(
                    this.props.user,
                    'profile.badges.milestoneBadge.currentMilestone'
                ) || 0
            this.props.fetchBadgeUserCount(callback)
        }
    }

    closeModal() {
        this.props.closeModal && this.props.closeModal()
    }

    onModalShow = () => {
        // Mark modal as shown by calling endpoint and update user profile
        this.props.markEarnBadgeModalAsShown()
    }

    renderBadgeEarned(tier) {
        const badgeIcon = getBagdeIconByTier(tier)
        return (
            <View style={{ ...modalHeaderBadgeShadow, marginTop: 10 }}>
                <View style={{ height: 5, width: '100%' }} />
                <View
                    style={{
                        height: 60,
                        width: 60,
                        borderRadius: 30,
                        backgroundColor: 'white',
                    }}
                />
                <View
                    style={{
                        position: 'absolute',
                        top: 3,
                        bottom: 3,
                        left: 3,
                        right: 3,
                        alignItems: 'center',
                    }}
                >
                    <Image
                        source={badgeIcon}
                        style={{ height: 55, width: 50 }}
                    />
                </View>
            </View>
        )
    }

    renderCancelButton() {
        return (
            <View
                style={{ position: 'absolute', top: 0, left: 0, padding: 15 }}
            >
                <DelayedButton
                    activeOpacity={0.6}
                    onPress={() => this.closeModal()}
                    style={modalCancelIconContainerStyle}
                    disabled={this.state.showGoldBagdeInfoModal}
                >
                    <Image source={cancel} style={modalCancelIconStyle} />
                </DelayedButton>
            </View>
        )
    }

    render() {
        let tier = 0
        if (
            _.has(
                this.props.user,
                'profile.badges.milestoneBadge.currentMilestone'
            )
        ) {
            tier = _.get(
                this.props.user,
                'profile.badges.milestoneBadge.currentMilestone'
            )
        }

        const hasModalOverlay =
            this.state.showGoldBadgeRewardModal ||
            this.state.showGoldBagdeInfoModal

        return (
            <Modal
                backdropColor={'black'}
                backdropOpacity={0.5}
                isVisible={this.props.isVisible}
                onModalShow={this.onModalShow}
                onBackdropPress={() => this.closeModal()}
                onSwipeComplete={() => this.closeModal()}
                swipeDirection={hasModalOverlay ? null : 'down'}
                style={{
                    marginTop: Constants.statusBarHeight + 15,
                    borderRadius: 15,
                }}
            >
                <GoldBadgeRewardModal
                    isVisible={this.state.showGoldBadgeRewardModal}
                    closeModal={() => {
                        this.setState({
                            ...this.state,
                            showGoldBadgeRewardModal: false,
                        })
                    }}
                />
                <GoldBadgeInfoModal
                    isVisible={this.state.showGoldBagdeInfoModal}
                    closeModal={() => {
                        this.setState({
                            ...this.state,
                            showGoldBagdeInfoModal: false,
                        })
                    }}
                />
                <View style={{ backgroundColor: 'white', borderRadius: 15 }}>
                    <ImageBackground
                        source={ConfettiFadedBackground}
                        style={{
                            width: '100%',
                            minHeight: 608,
                            borderRadius: 15,
                        }}
                        imageStyle={{ borderRadius: 15 }}
                    >
                        <View
                            style={{
                                ...modalContainerStyle,
                                backgroundColor: 'transparent',
                                flex: 1,
                            }}
                        >
                            {this.renderCancelButton()}
                            <Text
                                style={{
                                    color: 'rgb(0, 150, 203)',
                                    fontWeight: '500',
                                    fontSize: 22,
                                    marginTop: 18,
                                }}
                            >
                                Congratulations!
                            </Text>
                            {this.renderBadgeEarned(tier)}
                            <Text
                                style={{
                                    color: 'rgb(153, 153, 153)',
                                    fontSize: 14,
                                    paddingTop: 15,
                                    paddingBottom: 7,
                                }}
                            >
                                You've earned a {getBadgeTextByTier(tier)}{' '}
                                Badge.
                            </Text>
                            <View
                                style={{
                                    width: '76%',
                                    height: 0.5,
                                    backgroundColor: 'rgb(238, 238, 238)',
                                    marginVertical: 3,
                                }}
                            />
                            <Text
                                style={{
                                    color: 'rgb(51, 51, 51)',
                                    fontSize: 17,
                                    paddingVertical: 7,
                                }}
                            >
                                Badges
                            </Text>
                            {BadgeInfo.map((b) => {
                                const { id } = b
                                let onLeadingIconPress = () => {}
                                if (id && id === 'gold') {
                                    onLeadingIconPress = () => {
                                        this.setState({
                                            ...this.state,
                                            showGoldBagdeInfoModal: true,
                                        })
                                    }
                                }
                                return (
                                    <BadgeInfoCard
                                        badgeInfo={b}
                                        onLeadingIconPress={onLeadingIconPress}
                                        userTier={tier}
                                    />
                                )
                            })}

                            <View style={{ flexDirection: 'row' }}>
                                <Text
                                    style={{
                                        color: 'rgb(95, 95, 95)',
                                        fontSize: 11,
                                        lineHeight: 6,
                                        marginTop: 25,
                                        padding: 6,
                                        paddingRight: 0,
                                    }}
                                >
                                    {`\u002A Limited to the first 15 gold users. `}
                                </Text>
                                <DelayedButton
                                    activeOpacity={0.6}
                                    onPress={() => {
                                        this.setState({
                                            ...this.state,
                                            showGoldBadgeRewardModal: true,
                                        })
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 11,
                                            color: 'rgb(0, 150, 203)',
                                            fontWeight: '600',
                                            marginTop: 25,
                                            lineHeight: 6,
                                            padding: 6,
                                            paddingLeft: 2,
                                        }}
                                    >
                                        View details
                                    </Text>
                                </DelayedButton>
                            </View>
                            <Animated.Text
                                style={{
                                    color: 'rgb(209, 163, 16)',
                                    fontSize: 11,
                                    lineHeight: 6,
                                    padding: 8,
                                    fontStyle: 'italic',
                                    opacity: this.animations
                                        .numberOfUsersOnSameBadgeOpacity,
                                }}
                            >
                                {`There are currently ${this.state.numberOfUsersOnSameBadge} gold users.`}
                            </Animated.Text>
                        </View>
                    </ImageBackground>
                </View>
            </Modal>
        )
    }
}

// Render badge info
const BadgeInfoCard = (props) => {
    const { badgeInfo, onLeadingIconPress, userTier } = props
    if (!badgeInfo) return null

    // NOTE: title can be a component/
    const {
        title,
        infoTextList,
        badgeIcon,
        badgeIconStyle,
        leadingIcon,
        leadingIconStyle,
        leadingIconContainerStyle,
        gradient,
        tier,
    } = badgeInfo

    let linearGradientColors, linearGradientLocations, borderColor
    if (userTier >= tier) {
        linearGradientColors = gradient.achieved.linearGradientColors
        linearGradientLocations = gradient.achieved.linearGradientLocations
        borderColor = 'rgb(227, 238, 226)'
    } else {
        linearGradientColors = gradient.default.linearGradientColors
        linearGradientLocations = gradient.default.linearGradientLocations
        borderColor = '#e8e8e8'
    }
    return (
        <View
            style={{
                borderWidth: 0.5,
                borderColor,
                borderRadius: 5,
                minHeight: 75,
                marginVertical: 3,
                width: '100%',
            }}
        >
            <LinearGradient
                colors={linearGradientColors}
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    borderRadius: 5,
                    alignItems: 'center',
                }}
                locations={linearGradientLocations}
                start={[0.7, 0]}
                end={[1, 1]}
            >
                {/* Left icon and badge */}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {/* Info or Check icon */}
                    <DelayedButton
                        style={leadingIconContainerStyle}
                        onPress={onLeadingIconPress}
                    >
                        <Image
                            source={leadingIcon}
                            style={{ ...leadingIconStyle }}
                        />
                    </DelayedButton>
                    <Image
                        source={badgeIcon}
                        style={{ height: 12, ...badgeIconStyle }}
                    />
                </View>

                {/* Divider */}
                <View
                    style={{
                        height: '66%',
                        width: 0.5,
                        marginHorizontal: 10,
                        backgroundColor: 'rgb(238, 238, 238)',
                    }}
                />

                {/* Right title and text info */}
                <View style={{ justifyContent: 'center' }}>
                    <Text
                        style={{
                            color: 'rgb(51, 51, 51)',
                            fontSize: 14,
                            fontWeight: '500',
                        }}
                    >
                        {title}
                    </Text>
                    {infoTextList.map((t) => {
                        const { text, hasBulletPoint } = t
                        if (hasBulletPoint) {
                            return (
                                <Text
                                    style={{
                                        color: 'rgb(85, 85, 85)',
                                        fontSize: 10,
                                    }}
                                >
                                    {`\u2022 ${text}`}
                                </Text>
                            )
                        }
                        return (
                            <Text
                                style={{
                                    color: 'rgb(85, 85, 85)',
                                    fontSize: 10,
                                }}
                            >
                                {`  ${text}`}
                            </Text>
                        )
                    })}
                </View>
            </LinearGradient>
        </View>
    )
}

export default connect(null, {
    markEarnBadgeModalAsShown,
    fetchBadgeUserCount,
})(EarnBadgeModal)

// TODO: move this to constants
const DefaultBadgeIconStyle = {
    height: 36,
    width: 32,
}
const DefaultLeadingIconStyle = {
    height: 15,
    width: 17,
    tintColor: 'rgb(88, 117, 89)',
}
const DefaultLeadingIconContainerStyle = {
    height: 26,
    width: 26,
    borderRadius: 13,
    borderWidth: 0.8,
    borderColor: 'rgb(235, 249, 227)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
}
const BadgeInfo = [
    {
        title: 'Green',
        tier: 0,
        infoTextList: [
            { text: 'Add a profile image', hasBulletPoint: true },
            {
                text: "Fill out your 'Headline', 'Occupation',",
                hasBulletPoint: true,
            },
            { text: " and 'About'", hasBulletPoint: false },
            { text: 'Set your 1st goal', hasBulletPoint: true },
        ],
        badgeIcon: Green,
        badgeIconStyle: {
            ...DefaultBadgeIconStyle,
        },
        leadingIcon: CheckIcon,
        leadingIconStyle: {
            ...DefaultLeadingIconStyle,
        },
        leadingIconContainerStyle: { ...DefaultLeadingIconContainerStyle },
        gradient: {
            achieved: {
                linearGradientColors: [
                    'rgb(253, 255, 252)',
                    'rgb(250, 254, 247)',
                    'rgb(244, 250, 240)',
                ],
                linearGradientLocations: [0, 0.5, 1],
            },
            default: {
                linearGradientColors: ['white', 'white', 'white'],
                linearGradientLocations: [0, 0.5, 1],
            },
        },
    },
    {
        title: 'Bronze',
        tier: 1,
        infoTextList: [
            {
                text: 'Invite 1 friend who signs up',
                hasBulletPoint: true,
            },
        ],
        badgeIcon: Bronze3D,
        badgeIconStyle: {
            ...DefaultBadgeIconStyle,
        },
        leadingIcon: CheckIcon,
        leadingIconStyle: {
            ...DefaultLeadingIconStyle,
        },
        leadingIconContainerStyle: { ...DefaultLeadingIconContainerStyle },
        gradient: {
            achieved: {
                linearGradientColors: [
                    'rgb(253, 255, 252)',
                    'rgb(250, 254, 247)',
                    'rgb(244, 250, 240)',
                ],
                linearGradientLocations: [0, 0.5, 1],
            },
            default: {
                linearGradientColors: ['white', 'white', 'white'],
                linearGradientLocations: [0, 0.5, 1],
            },
        },
    },
    {
        title: 'Silver',
        tier: 2,
        infoTextList: [
            { text: 'Set 7 Goals', hasBulletPoint: true },
            {
                text: "Invite 7 friends who've earned their",
                hasBulletPoint: true,
            },
            { text: ' Green Badges', hasBulletPoint: false },
        ],
        badgeIcon: Silver3D,
        badgeIconStyle: {
            ...DefaultBadgeIconStyle,
        },
        leadingIcon: CheckIcon,
        leadingIconStyle: {
            ...DefaultLeadingIconStyle,
        },
        leadingIconContainerStyle: { ...DefaultLeadingIconContainerStyle },
        gradient: {
            achieved: {
                linearGradientColors: [
                    'rgb(253, 255, 252)',
                    'rgb(250, 254, 247)',
                    'rgb(244, 250, 240)',
                ],
                linearGradientLocations: [0, 0.5, 1],
            },
            default: {
                linearGradientColors: ['white', 'white', 'white'],
                linearGradientLocations: [0, 0.5, 1],
            },
        },
    },
    {
        id: 'gold',
        tier: 3,
        title: 'Gold + $700 Reward\u002A',
        infoTextList: [
            {
                text: "Invite 10 friends to GoalMogul who've",
                hasBulletPoint: true,
            },
            {
                text: 'earned their Silver Badge or higher',
                hasBulletPoint: false,
            },
        ],
        badgeIcon: Gold3D,
        badgeIconStyle: {
            ...DefaultBadgeIconStyle,
        },
        leadingIcon: QuestionIcon,
        leadingIconStyle: {
            ...DefaultLeadingIconStyle,
            height: 14,
            width: 9,
        },
        leadingIconContainerStyle: { ...DefaultLeadingIconContainerStyle },
        gradient: {
            achieved: {
                linearGradientColors: [
                    'rgb(253, 255, 252)',
                    'rgb(250, 254, 247)',
                    'rgb(244, 250, 240)',
                ],
                linearGradientLocations: [0, 0.7, 1],
            },
            default: {
                linearGradientColors: ['white', 'white', 'white'],
                linearGradientLocations: [0, 0.5, 1],
            },
        },
    },
]
