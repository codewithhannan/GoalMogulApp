/** @format */

import React, { Component } from 'react'
import { View, AppState, FlatList, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import { MenuProvider } from 'react-native-popup-menu'
import { Actions } from 'react-native-router-flux'
import _ from 'lodash'
import { Notifications } from 'expo'
import { copilot } from 'react-native-copilot-gm'
// import { copilot } from 'react-native-copilot'

/* Components */
import TabButtonGroup from '../Common/TabButtonGroup'
import SearchBarHeader from '../Common/Header/SearchBarHeader'

import Mastermind from './Mastermind'
import ActivityFeed from './ActivityFeed'
import EarnBadgeModal from '../Gamification/Badge/EarnBadgeModal'
import CreatePostModal from '../Post/CreatePostModal'
import CreateContentButtons from '../Common/Button/CreateContentButtons'
import { wrapAnalytics, SCREENS } from '../../monitoring/segment'
import { track, EVENT as E } from '../../monitoring/segment'

// Actions
import {
    homeSwitchTab,
    fetchAppUserProfile,
    fetchProfile,
    checkIfNewlyCreated,
} from '../../actions'
import {
    openCreateOverlay,
    refreshGoalFeed,
    closeCreateOverlay,
} from '../../redux/modules/home/mastermind/actions'

import { refreshActivityFeed } from '../../redux/modules/home/feed/actions'

import {
    subscribeNotification,
    saveUnreadNotification,
    handlePushNotification,
} from '../../redux/modules/notification/NotificationActions'

import {
    showNextTutorialPage,
    startTutorial,
    saveTutorialState,
    updateNextStepNumber,
    pauseTutorial,
    markUserAsOnboarded,
    resetTutorial,
} from '../../redux/modules/User/TutorialActions'

import { saveRemoteMatches } from '../../actions/MeetActions'

// Styles
import { color } from '../../styles/basic'

// Utils
import Tooltip, { CreateGoalTooltip } from '../Tutorial/Tooltip'
import { svgMaskPath } from '../Tutorial/Utils'

const DEBUG_KEY = '[ UI Home ]'

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            navigationState: {
                index: 0,
                routes: [
                    { key: 'activity', title: 'All Posts' },
                    { key: 'goals', title: 'Just Goals' },
                ],
            },
            appState: AppState.currentState,
            showWelcomeScreen: false,
            showBadgeEarnModal: false,
        }
        this.scrollToTop = this.scrollToTop.bind(this)
        this._renderScene = this._renderScene.bind(this)
        this.setTimer = this.setTimer.bind(this)
        this.stopTimer = this.stopTimer.bind(this)
        this._handleNotification = this._handleNotification.bind(this)
        this._notificationSubscription = undefined
        this.setMastermindRef = this.setMastermindRef.bind(this)
    }

    componentDidUpdate(prevProps) {
        // if (!prevProps.showTutorial && this.props.showTutorial === true) {
        //     console.log(
        //         `${DEBUG_KEY}: [ componentDidUpdate ]: tutorial start: `,
        //         this.props.nextStepNumber
        //     )
        //     this.props.start()
        // }

        if (
            !_.isEqual(prevProps.user, this.props.user) &&
            !prevProps.user &&
            !this.props.user.isOnBoarded
        ) {
            console.log(
                `${DEBUG_KEY}: [ componentDidUpdate ]: prev user: `,
                prevProps.user
            )
            setTimeout(() => {
                console.log('[Home UI] [componentDidUpdate] start tutorial')
                this.props.start()
            }, 200)
        }

        if (
            !_.isEqual(prevProps.user, this.props.user) &&
            !this.props.user.isOnBoarded
        ) {
            // Tutorial will be started by on welcome screen closed
            this.setState({
                showWelcomeScreen: true,
            })
            return
        }

        if (
            !_.isEqual(prevProps.user, this.props.user) &&
            (!prevProps.user.profile || !prevProps.user.profile.badges) &&
            _.has(
                this.props.user,
                'profile.badges.milestoneBadge.isAwardAlertShown'
            ) &&
            this.props.user.profile.badges.milestoneBadge.isAwardAlertShown ===
                false
        ) {
            // Showing modal to congrats user earning a new badge
            this.setState({
                showBadgeEarnModal: true,
            })
            return
        }
    }

    componentDidMount() {
        this.props.refreshActivityFeed()
        AppState.addEventListener('change', this.handleAppStateChange)
        this._notificationSubscription = Notifications.addListener(
            this._handleNotification
        )

        // Set timer to fetch profile again if previously failed
        this.setTimer()
        this.props.checkIfNewlyCreated()

        const { user } = this.props
        if (user && !user.isOnBoarded) {
            setTimeout(() => {
                console.log('[Home UI] [componentDidMount] start tutorial')
                this.props.start()
            }, 300)
        }

        this.props.copilotEvents.on('stop', () => {
            console.log(
                `${DEBUG_KEY}: [ componentDidMount ]: [ copilotEvents ] tutorial stop. show next page. Next step number is: `,
                this.props.nextStepNumber
            )

            if (this.props.nextStepNumber === 1) {
                Actions.createGoalModal({ isFirstTimeCreateGoal: true })
                this.props.pauseTutorial('create_goal', 'home', 1)
                setTimeout(() => {
                    this.props.showNextTutorialPage('create_goal', 'home')
                    this.props.markUserAsOnboarded()
                }, 400)
                return
            }
        })

        this.props.copilotEvents.on('stepChange', (step) => {
            const { order, name } = step
            console.log(
                `${DEBUG_KEY}: [ onStepChange ]: step order: ${order}, step visible: ${name}, current next step is: ${this.props.nextStepNumber}`
            )
            // console.log(`${DEBUG_KEY}: [ componentDidMount ]: [ stepChange ]: step change to ${step.order}`);
            // TODO: if later we have more steps in between, change here
            // This is called before changing to a new step
            this.props.updateNextStepNumber('create_goal', 'home', order + 1)
        })
    }

    componentWillUnmount() {
        console.log(`${DEBUG_KEY}: [ componentWillUnmount ]`)

        // Remove tutorial listener
        this.props.copilotEvents.off('stop')
        this.props.copilotEvents.off('stepChange')

        AppState.removeEventListener('change', this.handleAppStateChange)
        this._notificationSubscription.remove()
        // Remove timer in case app crash
        this.stopTimer()
    }

    setMastermindRef(mastermindRef) {
        this.mastermindRef = mastermindRef
    }

    setTimer() {
        this.stopTimer() // Clear the previous timer if there is one

        console.log(
            `${DEBUG_KEY}: [ Setting New Timer ] for fetching profile after 1s`
        )
        this.timer = setTimeout(() => {
            console.log(
                `${DEBUG_KEY}: [ Timer firing ] fetching profile again.`
            )
            this.props.fetchProfile(this.props.userId)
        }, 1000)
    }

    stopTimer() {
        if (this.timer !== undefined) {
            console.log(
                `${DEBUG_KEY}: [ Timer clearing ] for fetching profile 5s after mounted`
            )
            clearInterval(this.timer)
        }
    }

    scrollToTop = () => {
        if (this.flatList)
            this.flatList.scrollToIndex({
                animated: true,
                index: 0,
                viewOffset: this.topTabBarHeight || 80,
            })
    }

    _handleNotification(notification) {
        this.props.handlePushNotification(notification)
    }

    handleAppStateChange = async (nextAppState) => {
        if (
            this.state.appState.match(/inactive|background/) &&
            nextAppState === 'active'
        ) {
            console.log(
                `${DEBUG_KEY}: [handleAppStateChange] App has become active!`
            )
            track(E.APP_ACTIVE)
            const {
                needRefreshActivity,
                needRefreshMastermind,
                user,
            } = this.props
            if (user === undefined || _.isEmpty(user) || !user.profile) {
                this.props.fetchAppUserProfile({ navigate: false })
            }

            if (needRefreshMastermind) {
                this.props.refreshGoalFeed()
            }

            if (needRefreshActivity) {
                this.props.refreshActivityFeed()
            }
        }

        if (this.state.appState === 'active' && nextAppState !== 'active') {
            console.log(
                `${DEBUG_KEY}: [handleAppStateChange] App has become inactive!`
            )
            track(E.APP_INACTIVE)
            await this.props.saveUnreadNotification()
            await this.props.saveTutorialState()
        }

        this.setState({
            appState: nextAppState,
        })
    }

    _handleIndexChange = (index) => {
        this.setState({
            navigationState: {
                ...this.state.navigationState,
                index,
            },
        })
        this.props.homeSwitchTab(index)
    }

    _renderHeader = (props) => {
        return (
            <View
                onLayout={(e) =>
                    (this.topTabBarHeight = e.nativeEvent.layout.height)
                }
            >
                <CreateContentButtons
                    onCreateUpdatePress={() =>
                        this.createPostModal && this.createPostModal.open()
                    }
                    onCreateGoalPress={Actions.createGoalModal}
                />
                {/* Hid switching tabs to clean up the main view to just friend's Goals and Updates */}
                {/* <View style={styles.tabContainer}>
                    <TabButtonGroup buttons={props} />
                </View> */}
            </View>
        )
    }

    handleOnRefresh = () => {
        const { routes, index } = this.state.navigationState
        routes[index].key === 'activity'
            ? this.props.refreshActivityFeed()
            : this.props.refreshGoalFeed()
    }

    _renderScene() {
        const { routes, index } = this.state.navigationState
        switch (routes[index].key) {
            case 'goals':
                return (
                    <Mastermind
                        tutorialText={this.props.tutorialText[0]}
                        nextStepNumber={this.props.nextStepNumber}
                        order={0}
                        name="create_goal_home_0"
                        setMastermindRef={this.setMastermindRef}
                    />
                )
            case 'activity':
                return <ActivityFeed />
            default:
                return null
        }
    }

    render() {
        const { user, refreshing } = this.props

        // NOTE: this has to compare with true otherwise it might be undefine
        const showRefreshing = refreshing === true && user.isOnBoarded === true
        const tutorialOn =
            this.props.nextStepNumber >= 2
                ? {
                      rightIcon: {
                          iconType: 'menu',
                          tutorialText: this.props.tutorialText[1],
                          order: 1,
                          name: 'create_goal_home_menu',
                      },
                  }
                : undefined
        return (
            <MenuProvider customStyles={{ backdrop: styles.backdrop }}>
                <CreatePostModal
                    attachGoalRequired
                    onRef={(r) => (this.createPostModal = r)}
                />
                <View style={styles.homeContainerStyle}>
                    <SearchBarHeader rightIcon="menu" tutorialOn={tutorialOn} />
                    <FlatList
                        ref={(ref) => (this.flatList = ref)}
                        ListHeaderComponent={this._renderHeader({
                            jumpToIndex: this._handleIndexChange,
                            navigationState: this.state.navigationState,
                        })}
                        data={[{}]}
                        renderItem={this._renderScene}
                        refreshing={showRefreshing}
                        onRefresh={this.handleOnRefresh}
                    />
                    <EarnBadgeModal
                        isVisible={this.state.showBadgeEarnModal}
                        closeModal={() => {
                            this.setState({
                                showBadgeEarnModal: false,
                            })
                        }}
                        user={this.props.user}
                    />
                </View>
            </MenuProvider>
        )
    }
}

const mapStateToProps = (state) => {
    const { userId } = state.user
    const refreshing = state.home.activityfeed.refreshing
    // || state.home.mastermind.refreshing
    const needRefreshMastermind = _.isEmpty(state.home.mastermind.data)
    const needRefreshActivity = _.isEmpty(state.home.activityfeed.data)
    const { user } = state.user

    // Tutorial related
    const { create_goal } = state.tutorials
    const { home } = create_goal
    const { hasShown, showTutorial, tutorialText, nextStepNumber } = home

    return {
        refreshing,
        user,
        needRefreshActivity,
        needRefreshMastermind,
        userId,
        // Tutorial related
        hasShown,
        showTutorial,
        tutorialText,
        nextStepNumber,
    }
}

const styles = {
    homeContainerStyle: {
        backgroundColor: color.GM_BACKGROUND,
        flex: 1,
    },
    tabContainer: {
        paddingLeft: 8,
        paddingRight: 8,
        backgroundColor: color.GM_CARD_BACKGROUND,
    },
    backdrop: {
        backgroundColor: 'gray',
        opacity: 0.5,
    },
}

const AnalyticsWrapped = wrapAnalytics(Home, SCREENS.HOME)

const HomeExplained = copilot({
    overlay: 'svg', // or 'view'
    animated: true, // or false
    stepNumberComponent: () => <View />,
    tooltipComponent: CreateGoalTooltip,
    // svgMaskPath: svgMaskPath,
})(AnalyticsWrapped)

export default connect(
    mapStateToProps,
    {
        fetchAppUserProfile,
        homeSwitchTab,
        openCreateOverlay,
        /* Notification related */
        subscribeNotification,
        saveUnreadNotification,
        handlePushNotification,
        /* Feed related */
        refreshGoalFeed,
        refreshActivityFeed,
        fetchProfile,
        checkIfNewlyCreated,
        closeCreateOverlay,
        /* Tutorial related */
        showNextTutorialPage,
        startTutorial,
        saveTutorialState,
        updateNextStepNumber,
        pauseTutorial,
        markUserAsOnboarded,
        resetTutorial,
        /* Contact sync related */
        saveRemoteMatches,
    },
    null,
    { withRef: true }
)(HomeExplained)
