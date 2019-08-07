/**
 * This modal shows the congradulation message for user earning a new badge
 */

import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
    View, Image, Text, Animated, ImageBackground
} from 'react-native';
import { Constants, LinearGradient } from 'expo';
import Modal from 'react-native-modal';
import { markEarnBadgeModalAsShown, fetchBadgeUserCount } from '../../../actions/ProfileActions';
import cancel from '../../../asset/utils/cancel_no_background.png';
import Icons from '../../../asset/base64/Icons';
import { Logger } from '../../../redux/middleware/utils/Logger';
import DelayedButton from '../../Common/Button/DelayedButton';
import { modalCancelIconContainerStyle, modalCancelIconStyle, modalContainerStyle } from '../../../styles';
import Badges, { Bronze3D, Silver3D, Gold3D, Green } from '../../../asset/banner';
import { ConfettiFadedBackground } from '../../../asset/background';
import { getBagdeIconByTier } from '../../../redux/modules/gamification/BadgeActions';

const { CheckIcon, InfoIcon } = Icons;
const DEBUG_KEY = '[ UI EarnBadgeModal ]';

class EarnBadgeModal extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            numberLoaded: false,
            numberOfUsersOnSameBadge: undefined
        };

        this.animations = {
            numberOfUsersOnSameBadgeOpacity: new Animated.Value(0)
        };
    }

    componentDidUpdate(prevProps) {
        // Modal is shown
        if (!prevProps.isVisible && this.props.isVisible) {
            // Send request to fetch the number of
            console.log('earn badge modal is now alive ');
            const callback = (count) => {
                console.log(`${DEBUG_KEY}: [ componentDidUpdate ]: count is: `, count);
                this.setState({
                    ...this.state,
                    numberLoaded: true,
                    numberOfUsersOnSameBadge: count
                }, () => {
                    Animated.timing(this.animations.numberOfUsersOnSameBadgeOpacity, {
                        toValue: 1,
                        duration: 400,
                        useNativeDriver: true,
                    }).start();
                });
            };

            const tier = _.get(this.props.user, 'profile.badges.milestoneBadge.currentMilestone') || 0;
            this.props.fetchBadgeUserCount(callback);
        }
    }

    closeModal() {
        this.props.closeModal && this.props.closeModal();
    }

    onModalShow = () => {
        // Mark modal as shown by calling endpoint and update user profile
        this.props.markEarnBadgeModalAsShown();
    }

    renderBadgeEarned() {
        let tier = 0;
        if (_.has(this.props.user, 'profile.badges.milestoneBadge.currentMilestone')) {
            tier = _.get(this.props.user, 'profile.badges.milestoneBadge.currentMilestone');
        }

        const badgeIcon = getBagdeIconByTier(tier);
        return (
            <View style={{ ...styles.shadow, marginTop: 10 }}>
                <View style={{ height: 5, width: '100%'}} />
                <View style={{ height: 60, width: 60, borderRadius: 30, backgroundColor: 'white' }} />
                <View style={{ position: 'absolute', top: 3, bottom: 3, left: 3, right: 3, alignItems: 'center' }}>
                    <Image source={badgeIcon} style={{ height: 55, width: 50 }} />
                </View>
            </View>
        );
    }

    renderCancelButton() {
        return (
            <View style={{ position: 'absolute', top: 0, left: 0, padding: 15 }}>
                <DelayedButton
                    activeOpacity={0.6}
                    onPress={() => this.closeModal()}
                    style={modalCancelIconContainerStyle}
                >
                    <Image
                        source={cancel}
                        style={modalCancelIconStyle}
                    />
                </DelayedButton>
            </View>
        );
    }

    render() {
        return (
            <Modal
                backdropColor={'black'}
                isVisible={this.props.isVisible}
                backdropOpacity={0.7}
                onModalShow={this.onModalShow}
                style={{ flex: 1, marginTop: Constants.statusBarHeight + 15, backgroundColor: 'white', borderRadius: 15 }}
            >
                <ImageBackground source={ConfettiFadedBackground} style={{ width: '100%', height: '100%', borderRadius: 15 }} imageStyle={{ borderRadius: 15 }}>
                    <View style={{ ...modalContainerStyle, backgroundColor: 'transparent', flex: 1 }}>
                        {this.renderCancelButton()}
                        <Text style={{ color: 'rgb(0, 150, 203)', fontWeight: '500', fontSize: 22, marginTop: 18 }}>
                            Congratulations!
                        </Text>
                        {this.renderBadgeEarned()}
                        <Text style={{ color: 'rgb(153, 153, 153)', fontSize: 14, paddingTop: 15, paddingBottom: 7 }}>
                            You've earned a Silver Badge.
                        </Text>
                        <View style={{ width: '76%', height: 0.5, backgroundColor: 'rgb(238, 238, 238)', marginVertical: 3 }} />
                        <Text style={{ color: 'rgb(51, 51, 51)', fontSize: 17, paddingVertical: 7 }}>Badges</Text>
                        {
                            BadgeInfo.map((b) => (<BadgeInfoCard badgeInfo={b} />))
                        }

                        <Text style={{ color: 'rgb(95, 95, 95)', fontSize: 11, lineHeight: 6, marginTop: 15, padding: 6 }}>
                            {`\u002A Limited to the first 15 gold users. `}
                            <Text style={{ color: 'rgb(0, 150, 203)', fontWeight: '600' }}>
                                View details
                            </Text>
                        </Text>
                        <Animated.Text
                            style={{ 
                                color: 'rgb(209, 163, 16)', 
                                fontSize: 11, lineHeight: 6, padding: 8, 
                                fontStyle: 'italic',
                                opacity: this.animations.numberOfUsersOnSameBadgeOpacity
                            }}
                        >
                            {`There are currently ${this.state.numberOfUsersOnSameBadge} gold users.`}
                        </Animated.Text>
                    </View> 
                </ImageBackground>
            </Modal>
        );
    }
}

// Render badge info
const BadgeInfoCard = (props) => {
    const { badgeInfo } = props;
    if (!badgeInfo) return null;

    // NOTE: title can be a component/
    const { 
        title, infoTextList, badgeIcon, badgeIconStyle, 
        leadingIcon, leadingIconStyle, leadingIconContainerStyle,
        linearGradientColors, linearGradientLocations
    } = badgeInfo;

    return (
        <View style={{ borderWidth: 0.5, borderColor: 'rgb(227, 238, 226)', borderRadius: 5, minHeight: 70, marginVertical: 3, width: '100%' }}>
            <LinearGradient
                colors={linearGradientColors}
                style={{ flex: 1, flexDirection: 'row', borderRadius: 5, alignItems: 'center' }}
                locations={linearGradientLocations}
                start={[0.7, 0]}
                end={[1, 1]}
            >
                {/* Left icon and badge */}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {/* Info or Check icon */}
                    <View style={leadingIconContainerStyle}>
                        <Image source={leadingIcon} style={{ ...leadingIconStyle }} />
                    </View>
                    <Image source={badgeIcon} style={{ height: 12, ...badgeIconStyle }} />
                </View>

                {/* Divider */}
                <View style={{ height: '66%', width: 0.5, marginHorizontal: 10, backgroundColor: 'rgb(238, 238, 238)' }} />

                {/* Right title and text info */}
                <View style={{ justifyContent: 'center' }}>
                    <Text style={{ color: 'rgb(51, 51, 51)', fontSize: 14, fontWeight: '500' }}>{title}</Text>
                    {
                        infoTextList.map((t) => {
                            const { text, hasBulletPoint } = t;
                            if (hasBulletPoint) {
                                return (
                                    <Text style={{ color: 'rgb(85, 85, 85)', fontSize: 10 }}>
                                        {`\u2022 ${text}`}
                                    </Text>
                                )
                            }
                            return (
                                <Text style={{ color: 'rgb(85, 85, 85)', fontSize: 10 }}>
                                    {`  ${text}`}
                                </Text>
                            )
                        })
                    }
                </View>
                
            </LinearGradient>
        </View>
    );
};

const styles = {
    shadow: {
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 1.2 },
        // shadowOpacity: 0.23,
        // shadowRadius: 4
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
    }
};

export default connect(
    null,
    {
        markEarnBadgeModalAsShown,
        fetchBadgeUserCount
    }
)(EarnBadgeModal);

// TODO: move this to constants
const DefaultBadgeIconStyle = {
    height: 36, width: 32
};
const DefaultLeadingIconStyle = {
    height: 15, width: 17, tintColor: 'rgb(88, 117, 89)'
};
const DefaultLeadingIconContainerStyle = {
    height: 26, 
    width: 26, 
    borderRadius: 13, 
    borderWidth: 0.8, 
    borderColor: 'rgb(235, 249, 227)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10
};
const BadgeInfo = [
    {
        title: 'Newbie',
        infoTextList: [
            { text: 'Sign up for GoalMogul', hasBulletPoint: true },
            { text: 'Complete app on-boarding', hasBulletPoint: true }
        ],
        badgeIcon: Green,
        badgeIconStyle: {
            ...DefaultBadgeIconStyle
        },
        leadingIcon: CheckIcon,
        leadingIconStyle: {
            ...DefaultLeadingIconStyle
        },
        leadingIconContainerStyle: { ...DefaultLeadingIconContainerStyle },
        linearGradientColors: ['rgb(253, 255, 252)', 'rgb(250, 254, 247)', 'rgb(244, 250, 240)'],
        linearGradientLocations: [0, 0.7, 1]
    },
    {
        title: 'Bronze',
        infoTextList: [
            { text: 'Add a profile image', hasBulletPoint: true }, 
            { text: 'Fill out your \'Headline\', \'Occupation\',', hasBulletPoint: true },
            { text: 'and \'About\'', hasBulletPoint: false }
        ],
        badgeIcon: Bronze3D,
        badgeIconStyle: {
            ...DefaultBadgeIconStyle
        },
        leadingIcon: CheckIcon,
        leadingIconStyle: {
            ...DefaultLeadingIconStyle
        },
        leadingIconContainerStyle: { ...DefaultLeadingIconContainerStyle },
        linearGradientColors: ['rgb(253, 255, 252)', 'rgb(250, 254, 247)', 'rgb(244, 250, 240)'],
        linearGradientLocations: [0, 0.5, 1]
    },
    {
        title: 'Silver',
        infoTextList: [
            { text: 'Add 7 Friends', hasBulletPoint: true },
            { text: 'Add 7 Goals', hasBulletPoint: true }
        ],
        badgeIcon: Silver3D,
        badgeIconStyle: {
            ...DefaultBadgeIconStyle
        },
        leadingIcon: CheckIcon,
        leadingIconStyle: {
            ...DefaultLeadingIconStyle
        },
        leadingIconContainerStyle: { ...DefaultLeadingIconContainerStyle },
        linearGradientColors: ['rgb(253, 255, 252)', 'rgb(250, 254, 247)', 'rgb(244, 250, 240)'],
        linearGradientLocations: [0, 0.5, 1]
    },
    {
        title: 'Gold + $200 Reward\u002A',
        infoTextList: [
            { text: 'Invite 10 friends to GoalMogul who\'ve', hasBulletPoint: true },
            { text: 'earned a Silver Badge or higher', hasBulletPoint: false }
        ],
        badgeIcon: Gold3D,
        badgeIconStyle: {
            ...DefaultBadgeIconStyle
        },
        leadingIcon: InfoIcon,
        leadingIconStyle: {
            ...DefaultLeadingIconStyle
        },
        leadingIconContainerStyle: { ...DefaultLeadingIconContainerStyle },
        linearGradientColors: ['white', 'white', 'white'],
        linearGradientLocations: [0, 0.5, 1]
    },
];
