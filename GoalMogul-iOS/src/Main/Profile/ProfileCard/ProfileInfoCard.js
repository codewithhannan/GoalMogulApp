/** @format */

import React, { Component } from 'react'
import { View, Text, Image } from 'react-native'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'

/* Components */
import ProfileActionButton from '../../Common/Button/ProfileActionButton'
import DelayedButton from '../../Common/Button/DelayedButton'
import { DotIcon } from '../../../Utils/Icons'

/* Actions */
import { openProfileDetailEditForm } from '../../../actions/'

/* Asset */
import brief_case from '../../../asset/utils/briefcase.png'
import ElevatorPitchIcon from '../../../asset/utils/elevator_pitch.png'
import AboutIcon from '../../../asset/utils/about.png'
import icon_meet from '../../../asset/footer/navigation/meet.png'
import profileStyles from './Styles'

/* Select */
import { getUserData } from '../../../redux/modules/User/Selector'
import Icons from '../../../asset/base64/Icons'
import CoinProfileInfoModal from '../../Gamification/Coin/CoinProfileInfoModal'
import { DEFAULT_STYLE, FONT_FAMILY_1, GM_BLUE } from '../../../styles'
import { componentKeyByTab } from '../../../redux/middleware/utils'

const { CoinSackIcon, InfoIcon } = Icons
const DEBUG_KEY = '[ UI ProfileInfoCard ]'
// TODO: use redux instead of passed in props
// TODO: profile reducer redesign to change here. Evaluate all the components used
class ProfileInfoCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showCoinProfileInfoModal: false,
        }
    }

    handleEditOnPressed() {
        const { userId, pageId } = this.props
        this.props.openProfileDetailEditForm(userId, pageId)
    }

    handleMutualFriendOnPressed = () => {
        const { pageId, userId } = this.props
        // canEdit means self
        if (this.props.canEdit) {
            // const componentKeyToOpen = componentKeyByTab(this.props.navigationTab, 'friendTabView');
            const componentKeyToOpen = componentKeyByTab(
                this.props.navigationTab,
                'meet'
            )
            Actions.push(componentKeyToOpen)
            return
        }
        Actions.push('mutualFriends', { userId, pageId })
    }

    // Coin info on Profile About tab
    renderCoinInfo(user) {
        // Only show coin info if self (canEdit is true)
        if (!user || !this.props.canEdit) return null
        const coins =
            user.profile && user.profile.pointsEarned
                ? user.profile.pointsEarned
                : 0
        return (
            <View
                style={{
                    flexDirection: 'row',
                    paddingBottom: 20,
                    alignItems: 'center',
                }}
            >
                <Image source={CoinSackIcon} style={styles.iconStyle} />
                <View
                    style={{
                        marginRight: 10,
                        marginLeft: 10,
                        flexDirection: 'row',
                    }}
                >
                    <Text
                        style={{
                            ...DEFAULT_STYLE.normalText_1,
                            alignSelf: 'center',
                        }}
                    >
                        <Text style={{ fontFamily: FONT_FAMILY_1 }}>
                            {coins}{' '}
                        </Text>
                        Coins
                    </Text>
                    <DelayedButton
                        activeOpacity={0.6}
                        onPress={() => {
                            this.setState({
                                ...this.state,
                                showCoinProfileInfoModal: true,
                            })
                        }}
                        style={styles.infoIconContainerStyle}
                    >
                        <Image
                            source={InfoIcon}
                            style={DEFAULT_STYLE.infoIcon}
                        />
                    </DelayedButton>
                </View>
            </View>
        )
    }

    renderFriendInfo() {
        const title = this.props.canEdit ? 'Friends' : 'Mutual Friends'
        const data = this.props.canEdit
            ? this.props.friendsCount
            : this.props.mutualFriends.count
        return (
            <View style={{ flexDirection: 'row', paddingBottom: 20 }}>
                <Image source={icon_meet} style={styles.iconStyle} />
                <View
                    style={{
                        marginRight: 10,
                        marginLeft: 10,
                        flexDirection: 'row',
                    }}
                >
                    <Text
                        style={{
                            ...DEFAULT_STYLE.normalText_1,
                            alignSelf: 'center',
                        }}
                    >
                        <Text style={{ fontFamily: FONT_FAMILY_1 }}>
                            {data === undefined ? 0 : data}{' '}
                        </Text>
                        {title}
                    </Text>
                    <DotIcon
                        iconContainerStyle={{ ...styles.dotIconContainerStyle }}
                        iconStyle={styles.dotIconStyle}
                    />
                    <DelayedButton
                        activeOpacity={0.6}
                        onPress={this.handleMutualFriendOnPressed}
                        style={{ justifyContent: 'center' }}
                    >
                        <Text
                            style={{
                                ...DEFAULT_STYLE.normalText_1,
                                fontFamily: FONT_FAMILY_1,
                                color: GM_BLUE,
                            }}
                        >
                            View friends
                        </Text>
                    </DelayedButton>
                </View>
            </View>
        )
    }

    renderOccupation(occupation) {
        if (occupation) {
            return (
                <View style={{ flexDirection: 'row' }}>
                    <Image source={brief_case} style={styles.iconStyle} />
                    <Text
                        style={[
                            profileStyles.headerTextStyle,
                            DEFAULT_STYLE.normalText_1,
                        ]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {occupation}
                    </Text>
                </View>
            )
        }
        return null
    }

    renderElevatorPitch(elevatorPitch) {
        if (elevatorPitch) {
            return (
                <View style={{ alignSelf: 'flex-start' }}>
                    <View style={profileStyles.subHeaderStyle}>
                        <Image
                            resizeMode="contain"
                            source={ElevatorPitchIcon}
                            style={{
                                ...DEFAULT_STYLE.normalIcon_1,
                                tintColor: '#828282',
                                marginRight: 10,
                            }}
                        />
                        <Text style={DEFAULT_STYLE.titleText_1}>
                            Elevator Pitch
                        </Text>
                    </View>
                    <Text style={[DEFAULT_STYLE.normalText_1]}>
                        {elevatorPitch}
                    </Text>
                </View>
            )
        }
        return null
    }

    renderAbout(about) {
        if (about) {
            return (
                <View style={{ alignSelf: 'flex-start', marginTop: 24 }}>
                    <View style={profileStyles.subHeaderStyle}>
                        <Image
                            resizeMode="contain"
                            source={AboutIcon}
                            style={{
                                ...DEFAULT_STYLE.normalIcon_1,
                                tintColor: '#828282',
                                marginRight: 10,
                            }}
                        />
                        <Text style={DEFAULT_STYLE.titleText_1}>About</Text>
                    </View>
                    <Text style={[DEFAULT_STYLE.normalText_1]}>{about}</Text>
                </View>
            )
        }
        return null
    }

    renderProfileActionButton() {
        if (this.props.canEdit) {
            return (
                <ProfileActionButton
                    onPress={() => this.handleEditOnPressed()}
                />
            )
        }
    }

    render() {
        // TODO: profile reducer redesign to change here.
        // Refactor to use userId to fetch the corresponding profile from the source of truth reducer
        const { user } = this.props
        if (!user || !user.profile) {
            console.log(`${DEBUG_KEY}: [ render ]: invalid user:`, user)
            return null
        }
        const { elevatorPitch, occupation, about } = user.profile

        return (
            <View>
                <View style={styles.containerStyle}>
                    {this.renderElevatorPitch(elevatorPitch)}
                    {this.renderAbout(about)}
                </View>
                <View style={DEFAULT_STYLE.shadow} />
                <View style={styles.containerStyle}>
                    {this.renderFriendInfo()}
                    {this.renderOccupation(occupation)}
                    <CoinProfileInfoModal
                        isVisible={this.state.showCoinProfileInfoModal}
                        closeModal={() => {
                            this.setState({
                                ...this.state,
                                showCoinProfileInfoModal: false,
                            })
                        }}
                    />
                </View>
                <View style={DEFAULT_STYLE.shadow} />
            </View>
        )
    }
}

const styles = {
    containerStyle: {
        display: 'flex',
        padding: 30,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: 'white',
        flex: 1,
    },
    iconStyle: {
        height: 20,
        width: 20,
    },
    dotIconStyle: {
        tintColor: '#818181',
        height: 5,
        width: 5,
    },
    dotIconContainerStyle: {
        width: 4,
        marginLeft: 4,
        marginRight: 5,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    infoIconContainerStyle: {
        ...DEFAULT_STYLE.buttonIcon_1,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 5,
    },
}

const mapStateToProps = (state, props) => {
    const { userId } = props
    const canEdit = userId === state.user.userId
    const navigationTab = state.navigation.tab

    const userObject = getUserData(state, userId, '')
    const { user, mutualFriends, friendship } = userObject
    const friendsCount = state.meet.friends.count

    return {
        canEdit,
        user,
        mutualFriends,
        friendsCount,
        navigationTab,
    }
}

export default connect(mapStateToProps, {
    openProfileDetailEditForm,
})(ProfileInfoCard)
