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
import icon_meet from '../../../asset/footer/navigation/meet.png'
import profileStyles from './Styles'
import { PROFILE_STYLES } from '../../../styles/Profile'

/* Select */
import { getUserData } from '../../../redux/modules/User/Selector'
import Icons from '../../../asset/base64/Icons'
import CoinProfileInfoModal from '../../Gamification/Coin/CoinProfileInfoModal'
import { default_style, text, color } from '../../../styles/basic'
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
                            ...default_style.normalText_1,
                            alignSelf: 'center',
                        }}
                    >
                        <Text style={{ fontFamily: text.FONT_FAMILY.BOLD }}>
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
                            style={default_style.infoIcon}
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
            <View
                style={{
                    flexDirection: 'row',
                }}
            >
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
                            ...default_style.normalText_1,
                            alignSelf: 'center',
                        }}
                    >
                        <Text style={{ fontFamily: text.FONT_FAMILY.BOLD }}>
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
                                ...default_style.normalText_1,
                                fontFamily: text.FONT_FAMILY.BOLD,
                                color: color.GM_BLUE,
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
        if (occupation && occupation.trim().length > 0) {
            return (
                <View style={{ alignSelf: 'flex-start', marginTop: 16 }}>
                    <View style={profileStyles.subHeaderStyle}>
                        <Text style={PROFILE_STYLES.aboutInfoTitle}>
                            Occupation
                        </Text>
                    </View>
                    <Text style={[default_style.normalText_1]}>
                        {occupation.trim()}
                    </Text>
                </View>
            )
        }
        return null
    }

    renderElevatorPitch(elevatorPitch, isTopElementExisting) {
        if (elevatorPitch && elevatorPitch.trim().length > 0) {
            return (
                <View
                    style={
                        isTopElementExisting
                            ? { alignSelf: 'flex-start', marginTop: 16 }
                            : { alignSelf: 'flex-start', marginTop: 0 }
                    }
                >
                    <View style={profileStyles.subHeaderStyle}>
                        <Text style={PROFILE_STYLES.aboutInfoTitle}>
                            Elevator Pitch
                        </Text>
                    </View>
                    <Text style={[default_style.normalText_1]}>
                        {elevatorPitch.trim()}
                    </Text>
                </View>
            )
        }
        return null
    }

    renderAbout(about) {
        if (about && about.trim().length > 0) {
            return (
                <View style={{ alignSelf: 'flex-start' }}>
                    <View style={profileStyles.subHeaderStyle}>
                        <Text style={PROFILE_STYLES.aboutInfoTitle}>About</Text>
                    </View>
                    <Text style={[default_style.normalText_1]}>
                        {about.trim()}
                    </Text>
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

        const detailsCard = (
            <View style={styles.containerStyle}>
                {this.renderAbout(about)}
                {this.renderElevatorPitch(elevatorPitch, about)}
            </View>
        )

        return (
            <View>
                {about || elevatorPitch ? detailsCard : null}
                <View style={styles.containerStyle}>
                    {this.renderFriendInfo()}
                    {this.renderOccupation(occupation)}
                </View>
            </View>
        )
    }
}

const styles = {
    containerStyle: {
        display: 'flex',
        paddingHorizontal: 16,
        paddingVertical: 24,
        marginBottom: 8,
        backgroundColor: color.GM_CARD_BACKGROUND,
        flex: 1,
    },
    iconStyle: {
        height: 20,
        width: 20,
    },
    dotIconStyle: {
        tintColor: '#828282',
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
        ...default_style.buttonIcon_1,
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
