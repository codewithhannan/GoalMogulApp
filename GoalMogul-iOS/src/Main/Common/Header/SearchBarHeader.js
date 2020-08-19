/**
 * --------------------------------------------------------
 * This components should be placed outise of SafeViewArea
 * --------------------------------------------------------
 *
 * TODO: add prop types for this component. Start documenting from version 0.4.1
 *
 * props
 *
 * tutorialOn: describe if there is any tutorial for the component
 * Sample usage is at:
 * tutorialOn={{
 *       rightIcon: {
 *           iconType: 'menu',
 *           tutorialText: this.props.tutorialText[2],
 *           order: 2,
 *           name: 'meettab_menu'
 *       }
 *   }}
 *
 * @format
 */

import React, { Component } from 'react'
import { View, Image, Text, TouchableOpacity } from 'react-native'
import R from 'ramda'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import { walkthroughable, CopilotStep } from 'react-native-copilot-gm'

/* Asset */
import Logo from '../../../asset/header/GMText.png'

import { actionSheet, switchByButtonIndex } from '../ActionSheetFactory'

/* Component */
import DelayedButton from '../Button/DelayedButton'

/* Utils */
import { componentKeyByTab } from '../../../redux/middleware/utils'

/* Actions */
import { back, openProfile, openSetting, blockUser } from '../../../actions'
import { openMyEventTab } from '../../../redux/modules/event/MyEventTabActions'
import { openMyTribeTab } from '../../../redux/modules/tribe/MyTribeTabActions'
import { createReport } from '../../../redux/modules/report/ReportActions'

// styles
import { HEADER_STYLES } from '../../../styles/Header'

import { getUserData } from '../../../redux/modules/User/Selector'
import { Icon } from '@ui-kitten/components'

// For profile friend setting ActionSheetIOS
const FRIENDSHIP_SETTING_BUTTONS = ['Block', 'Report', 'Cancel']
const CANCEL_INDEX = 2

const DEBUG_KEY = '[ Component SearchBarHeader ]'
const WalkableView = walkthroughable(View)

/**
  TODO: refactor element to have consistent behavior
  rightIcon: 'empty' or null,
  backButton: true or false,
  setting: true or false
*/
class SearchBarHeader extends Component {
    state = {
        overlay: false,
    }

    handleBackOnClick() {
        if (this.props.onBackPress) {
            this.props.onBackPress()
            return
        }
        this.props.back()
    }

    handleProfileOnClick() {
        this.props.openProfile(this.props.appUserId)
    }

    handleSettingOnClick() {
        // TODO: open account setting page
        this.props.openSetting()
    }

    handleFriendsSettingOnClick = () => {
        const text = 'Please go to Settings to manage blocked users.'
        const switchCases = switchByButtonIndex([
            [
                R.equals(0),
                () => {
                    console.log(
                        `${DEBUG_KEY} User blocks _id: `,
                        this.props.profileUserId
                    )
                    this.props.blockUser(
                        this.props.profileUserId,
                        () =>
                            alert(
                                `You have successfully blocked ${this.props.profileUserName}. ${text}`
                            ),
                        { name: this.props.profileUserName } // To show block confirmation alert
                    )
                },
            ],
            [
                R.equals(1),
                () => {
                    console.log(
                        `${DEBUG_KEY} User reports profile with _id: `,
                        this.props.profileUserId
                    )
                    this.props.createReport(this.props.profileUserId, 'User')
                },
            ],
        ])
        const friendsSettingActionSheet = actionSheet(
            FRIENDSHIP_SETTING_BUTTONS,
            CANCEL_INDEX,
            switchCases
        )
        friendsSettingActionSheet()
    }

    handleMenuIconOnClick = () => {
        Actions.drawerOpen()
    }

    renderLeftIcon() {
        const { backButton } = this.props
        return (
            <DelayedButton
                activeOpacity={backButton ? 0.6 : 1}
                onPress={
                    backButton ? this.handleBackOnClick.bind(this) : () => {}
                }
                style={{ justifyContent: 'center' }}
            >
                {backButton ? (
                    <Icon
                        name="chevron-left"
                        pack="material-community"
                        style={HEADER_STYLES.nakedButton}
                    />
                ) : (
                    <Image
                        source={Logo}
                        resizeMode="contain"
                        style={HEADER_STYLES.logo}
                    />
                )}
            </DelayedButton>
        )
    }

    /**
     * @param setting:
     * @param haveSetting:
     * @param pageSetting: if a page needs a pageSetting icon, ..., then it needs
     *        to pass in pageSetting
     * @param rightIcon:
     */
    renderRightIcons() {
        const { menuOnPress, tutorialOn } = this.props
        const hasRightIconTutorial = tutorialOn && tutorialOn.rightIcon

        // Standard search bar menu
        if (this.props.rightIcon === 'menu') {
            // has tutorial for right icon menu
            if (
                hasRightIconTutorial &&
                tutorialOn.rightIcon.iconType === 'menu'
            ) {
                return (
                    <CopilotStep
                        text={tutorialOn.rightIcon.tutorialText}
                        order={tutorialOn.rightIcon.order}
                        name={tutorialOn.rightIcon.name}
                    >
                        <WalkableView>
                            <TouchableOpacity
                                activeOpacity={0.6}
                                onPress={
                                    menuOnPress || this.handleMenuIconOnClick
                                }
                                style={styles.headerRightContaner}
                            >
                                <Icon
                                    name="menu"
                                    pack="material-community"
                                    style={HEADER_STYLES.button}
                                />
                            </TouchableOpacity>
                        </WalkableView>
                    </CopilotStep>
                )
            }
            return (
                <View style={{ flexDirection: 'row' }}>
                    <DelayedButton
                        activeOpacity={0.6}
                        onPress={() => {
                            const componentKeyToOpen = componentKeyByTab(
                                this.props.navigationTab,
                                'searchLightBox'
                            )
                            Actions.push(componentKeyToOpen)
                        }}
                        style={styles.headerRightContaner}
                    >
                        <Icon
                            name="magnify"
                            pack="material-community"
                            style={HEADER_STYLES.button}
                        />
                    </DelayedButton>
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={menuOnPress || this.handleMenuIconOnClick}
                        style={styles.headerRightContaner}
                    >
                        <Icon
                            name="menu"
                            pack="material-community"
                            style={HEADER_STYLES.button}
                        />
                    </TouchableOpacity>
                </View>
            )
        }

        // Empty dummy view as default
        return <View style={{ height: 30, width: 30 }} />
    }

    renderTitle() {
        if (this.props.title) {
            return (
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Text style={HEADER_STYLES.title}>{this.props.title}</Text>
                </View>
            )
        }
        return <View style={{ flex: 1 }} />
    }

    render() {
        return (
            <View style={styles.headerStyle}>
                {this.renderLeftIcon()}
                {this.renderTitle()}
                {this.renderRightIcons()}
            </View>
        )
    }
}

const styles = {
    headerStyle: {
        ...HEADER_STYLES.headerContainer,
        justifyContent: 'center',
    },
    headerRightContaner: {
        ...HEADER_STYLES.buttonWrapper,
        marginLeft: 8,
    },
}

const mapStateToProps = (state, props) => {
    const appUserId = state.user.userId
    const { image } = state.user.user.profile // Image is app user image
    const navigationTab = state.navigation.tab

    // If no userId passed in, then we assume it's app userId
    const profileUserId = props.userId || appUserId
    const user = getUserData(state, profileUserId, 'user')
    const profileUserName = user.name

    const haveSetting = appUserId.toString() === profileUserId.toString()

    return {
        haveSetting,
        profileUserId,
        profileUserName,
        image,
        appUserId,
        navigationTab,
        user,
    }
}

export default connect(mapStateToProps, {
    back,
    openProfile,
    openSetting,
    blockUser,
    openMyEventTab,
    openMyTribeTab,
    createReport,
})(SearchBarHeader)
