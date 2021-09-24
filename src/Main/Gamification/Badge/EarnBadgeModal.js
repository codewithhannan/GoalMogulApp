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
import DelayedButton from '../../Common/Button/DelayedButton'
import {
    modalCancelIconContainerStyle,
    modalCancelIconStyle,
    modalContainerStyle,
    modalHeaderBadgeShadow,
} from '../../../styles'
import { Silver3D, Gold3D, Green } from '../../../asset/banner'
import BronzeBadgeNew from '../../../asset/banner/Bronze-New.png'
import SilverBadgeNew from '../../../asset/banner/Silver-New.png'
import GoldBadgeNew from '../../../asset/banner/Gold-New.png'
import GreenBadgeNew from '../../../asset/banner/Green-New.png'
// import { Bronze3D, Silver3D, Gold3D, Green } from '../../../asset/banner'
// import { ConfettiFadedBackground } from '../../../asset/background'
import {
    getBagdeIconByTier,
    getBadgeTextByTier,
} from '../../../redux/modules/gamification/BadgeActions'
import GoldBadgeInfoModal from './GoldBadgeInfoModal'
import GoldBadgeRewardModal from './GoldBadgeRewardModal'
import { color } from '../../../styles/basic'

import ConfettiFadedBackground from '../../../asset/background/ConfettiBackground.png'
import { GM_BLUE } from '../../../styles/basic/color'
import QuestionMark from '../../../asset/banner/QuestionMark.png'

const { CheckIcon, QuestionIcon } = Icons
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

            this.props.fetchBadgeUserCount(callback)
        }
    }

    closeModal() {
        this.props.closeModal && this.props.closeModal()
    }

    onModalShow = () => {
        // Mark modal as shown by calling endpoint and update user profile
        if (
            !_.get(
                this.props.user,
                'profile.badges.milestoneBadge.isAwardAlertShown',
                false
            )
        )
            this.props.markEarnBadgeModalAsShown()
    }

    renderBadgeEarned(tier) {
        const badgeIcon = getBagdeIconByTier(tier)
        return (
            <View style={{ ...modalHeaderBadgeShadow, marginTop: 10 }}>
                <View
                    style={{
                        height: 185,
                        width: 140,
                    }}
                />
                <View
                    style={{
                        position: 'absolute',
                        top: 60,
                        alignItems: 'center',
                    }}
                >
                    <Image
                        source={badgeIcon}
                        style={{ height: 140, width: 135 }}
                    />
                    {tier === 0 && (
                        <View
                            style={{
                                position: 'absolute',
                                top: 65,
                                left: 52,
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                source={QuestionMark}
                                style={{ height: 29, width: 16 }}
                            />
                        </View>
                    )}
                </View>
            </View>
        )
    }

    renderCancelButton() {
        return (
            <View
                style={{ position: 'absolute', top: 0, right: 0, padding: 15 }}
            >
                <DelayedButton
                    activeOpacity={0.6}
                    onPress={() => this.closeModal()}
                    style={{
                        ...modalCancelIconContainerStyle,
                        backgroundColor: '#ffffff',
                    }}
                    disabled={this.state.showGoldBagdeInfoModal}
                >
                    <Image
                        source={cancel}
                        style={{ ...modalCancelIconStyle, tintColor: GM_BLUE }}
                    />
                </DelayedButton>
            </View>
        )
    }

    render() {
        let tier = _.get(
            this.props.user,
            'profile.badges.milestoneBadge.currentMilestone',
            0
        )

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
                    marginTop: Constants.statusBarHeight + 10,
                    borderRadius: 15,
                    height: 150,
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
                <View
                    style={{
                        backgroundColor: color.GM_BACKGROUND,
                        borderRadius: 15,
                    }}
                >
                    <ImageBackground
                        source={ConfettiFadedBackground}
                        style={{
                            width: '100%',
                            borderRadius: 15,
                            justifyContent: 'center',
                            alignContent: 'center',
                        }}
                        // imageStyle={{ borderRadius: 15 }}
                    >
                        <View
                            style={{
                                ...modalContainerStyle,
                                backgroundColor: 'transparent',
                            }}
                        >
                            {this.renderCancelButton()}
                            {tier >= 0 && [
                                this.renderBadgeEarned(tier),
                                // <Text
                                //     style={{
                                //         color: 'rgb(0, 150, 203)',
                                //         fontWeight: '500',
                                //         fontSize: 22,
                                //         marginTop: 18,
                                //     }}
                                // >
                                //     Congratulations!
                                // </Text>,
                                <Text
                                    style={{
                                        color: GM_BLUE,
                                        textAlign: 'center',
                                        width: '56.85%',
                                        fontSize: 18,
                                        fontWeight: '600',
                                        paddingTop: 15,
                                        paddingBottom: 7,
                                    }}
                                >
                                    {tier === 0
                                        ? `You have not earned a Badge yet`
                                        : `You currently have the ${getBadgeTextByTier(
                                              tier
                                          )} Badge`}
                                </Text>,
                                <View
                                    style={{
                                        width: '100%',
                                        height: 1,
                                        backgroundColor: 'rgb(238, 238, 238)',
                                        marginVertical: 3,
                                    }}
                                />,
                            ]}
                            <Text
                                style={{
                                    color: 'rgb(51, 51, 51)',
                                    fontSize: 18,
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
                                        if (tier != 4) {
                                            this.setState({
                                                showGoldBagdeInfoModal: true,
                                            })
                                            b.leadingIcon == null
                                        }
                                    }
                                }

                                if (b.tier <= tier) {
                                    setTimeout(() => {
                                        b.leadingIcon = CheckIcon
                                        b.leadingIconContainerStyle = {
                                            ...b.leadingIconContainerStyle,
                                            backgroundColor: '#42C0F5',
                                            borderColor: '#42C0F5',
                                        }
                                        b.leadingIconStyle = {
                                            ...b.leadingIconStyle,
                                            tintColor: '#FFFFFF',
                                        }
                                    }, 1000)
                                }
                                return (
                                    <BadgeInfoCard
                                        badgeInfo={b}
                                        onLeadingIconPress={onLeadingIconPress}
                                        userTier={tier}
                                    />
                                )
                            })}

                            <View
                                style={{
                                    flexDirection: 'row',
                                    // backgroundColor: 'red',
                                    height: 30,
                                }}
                            >
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
        titleColor,
        infoTextList,
        badgeIcon,
        badgeIconStyle,
        leadingIcon,
        leadingIconStyle,
        leadingIconContainerStyle,
        gradient,
        tier,
        bulletIcon,
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
                borderWidth: 1,
                shadowColor: '#45C9F6',
                shadowOpacity: 0.1,
                borderColor,
                borderRadius: 8,
                minHeight: 70,
                width: '100%',
            }}
        >
            <LinearGradient
                colors={linearGradientColors}
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    borderRadius: 8,
                    alignItems: 'center',
                }}
                locations={linearGradientLocations}
                start={[0.7, 0]}
                end={[1, 1]}
            >
                {/* Left icon and badge */}

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {/* Info or Check icon, show check mark when user has the badge or it's a gold badge */}
                    <DelayedButton
                        style={[
                            leadingIconContainerStyle,
                            { opacity: userTier >= tier || tier === 4 ? 1 : 0 },
                        ]}
                        onPress={onLeadingIconPress}
                    >
                        <Image source={leadingIcon} style={leadingIconStyle} />
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
                <View
                    style={{
                        justifyContent: 'center',
                        width: '80%',
                    }}
                >
                    <Text
                        style={{
                            color: titleColor,
                            fontSize: 14,
                            fontWeight: '500',
                        }}
                    >
                        {title}
                    </Text>
                    {infoTextList.map((t, index) => {
                        const { text, hasBulletPoint } = t
                        if (hasBulletPoint) {
                            return (
                                <View
                                    key={Math.random()
                                        .toString(36)
                                        .substr(2, 9)}
                                    style={{
                                        flexDirection: 'row',
                                        // marginTop: 3,
                                        width: '80%',
                                    }}
                                >
                                    <Image
                                        source={bulletIcon}
                                        style={{
                                            height: 10,
                                            width: 10,
                                            tintColor: '#4D4D4D',
                                            top: 3,
                                        }}
                                    />
                                    <Text
                                        style={{
                                            color: 'rgb(85, 85, 85)',
                                            fontSize: 12,
                                            left: 7,
                                            flexWrap: 'wrap',
                                        }}
                                    >
                                        {`${text}`}
                                    </Text>
                                </View>
                            )
                        }
                        return (
                            <Text
                                style={{
                                    color: 'rgb(85, 85, 85)',
                                    fontSize: 12,
                                }}
                            >
                                {`    ${text}`}
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
    height: 11,
    width: 12,
    tintColor: '#AFAFAF',
}
const GoldIconStyle = {
    height: 11,
    width: 11,
    tintColor: '#AFAFAF',
}
const DefaultLeadingIconContainerStyle = {
    height: 21,
    width: 21,
    borderRadius: 13,
    borderWidth: 0.8,
    // borderColor: '#42C0F5',
    borderColor: '#AFAFAF',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
}

const DefaultGoldLeadingIconContainerStyle = {
    height: 21,
    width: 21,
    borderRadius: 13,
    borderWidth: 0.8,
    borderColor: '#AFAFAF',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
}
const BadgeInfo = [
    {
        title: 'Green',
        titleColor: '#7BAF59',
        tier: 1,
        infoTextList: [
            { text: 'Add a profile image', hasBulletPoint: true },
            {
                text: 'Fill in your profile',
                hasBulletPoint: true,
            },
            { text: 'Set your 1st goal', hasBulletPoint: true },
        ],
        badgeIcon: GreenBadgeNew,
        badgeIconStyle: DefaultBadgeIconStyle,
        leadingIcon: QuestionIcon,
        bulletIcon: CheckIcon,
        leadingIconStyle: DefaultLeadingIconStyle,
        leadingIconContainerStyle: DefaultLeadingIconContainerStyle,
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
        titleColor: '#A26644',
        tier: 2,
        infoTextList: [
            {
                text: 'Invite 1 friend who signs up',
                hasBulletPoint: true,
            },
        ],
        badgeIcon: BronzeBadgeNew,
        badgeIconStyle: DefaultBadgeIconStyle,
        leadingIcon: QuestionIcon,
        bulletIcon: CheckIcon,
        leadingIconStyle: DefaultLeadingIconStyle,
        leadingIconContainerStyle: DefaultLeadingIconContainerStyle,
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
        titleColor: '#838384',

        tier: 3,
        infoTextList: [
            { text: 'Set 7 Goals', hasBulletPoint: true },
            {
                text: "Invite 7 friends who've earned their Green Badges",
                hasBulletPoint: true,
            },
            // { text: ' Green Badges', hasBulletPoint: false },
        ],
        badgeIcon: SilverBadgeNew,
        badgeIconStyle: DefaultBadgeIconStyle,
        leadingIcon: QuestionIcon,
        bulletIcon: CheckIcon,
        leadingIconStyle: DefaultLeadingIconStyle,
        leadingIconContainerStyle: DefaultLeadingIconContainerStyle,
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
        titleColor: '#FEC83E',
        tier: 4,
        title: 'Gold',
        infoTextList: [
            {
                text:
                    "Invite 10 friends who've earned their Silver Badge or higher",
                hasBulletPoint: true,
            },
            // {
            //     text: ' Silver Badge or higher',
            //     hasBulletPoint: false,
            // },
        ],
        badgeIcon: GoldBadgeNew,
        badgeIconStyle: DefaultBadgeIconStyle,
        leadingIcon: QuestionIcon,
        bulletIcon: CheckIcon,
        leadingIconStyle: {
            ...GoldIconStyle,
            height: 14,
            width: 9,
        },
        leadingIconContainerStyle: DefaultGoldLeadingIconContainerStyle,
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
