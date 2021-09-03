/** @format */

import React, { Component } from 'react'
import {
    View,
    AppState,
    FlatList,
    TouchableWithoutFeedback,
    Image,
    TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'
import { MenuProvider } from 'react-native-popup-menu'
import { Actions } from 'react-native-router-flux'
import _ from 'lodash'
import * as Notifications from 'expo-notifications'
import { copilot } from 'react-native-copilot-gm'
import R from 'ramda'
// import { copilot } from 'react-native-copilot'

/* Components */
import TabButtonGroup from '../Common/TabButtonGroup'
import SearchBarHeader from '../Common/Header/SearchBarHeader'
import { openCamera, openCameraRoll } from '../../actions'

import Mastermind from './Mastermind'
import ActivityFeed from './ActivityFeed'
import EarnBadgeModal from '../Gamification/Badge/EarnBadgeModal'
import CreatePostModal from '../Post/CreatePostModal'
import CreateContentButtons from '../Common/Button/CreateContentButtons'
import { wrapAnalytics, SCREENS } from '../../monitoring/segment'
import { track, EVENT as E } from '../../monitoring/segment'
import { getToastsData } from '../../actions/ToastActions'
import BottomButtonsSheet from '../Common/Modal/BottomButtonsSheet'

//video stroyline
import VideoStoryLineCircle from './VideoStoryLineCircle'

// Actions
import {
    homeSwitchTab,
    fetchAppUserProfile,
    fetchProfile,
    checkIfNewlyCreated,
    getUserVisitedNumber,
    refreshProfileData,
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
import * as ImagePicker from 'expo-image-picker'

import { saveRemoteMatches } from '../../actions/MeetActions'

// Styles
import { color } from '../../styles/basic'
import { TEXT_FONT_SIZE, FONT_FAMILY } from '../../styles/basic/text'
import video_icon from '../../asset/icons/video_icon.png'
import { getButtonBottomSheetHeight } from '../../styles'

// Utils
import { CreateGoalTooltip } from '../Tutorial/Tooltip'
import { Text } from 'react-native-animatable'
import {
    fetchUnreadCount,
    refreshNotificationTab,
} from '../../redux/modules/notification/NotificationTabActions'
import { makeGetUserGoals } from '../../redux/modules/User/Selector'
import { trackWithProperties } from 'expo-analytics-segment'
import { getAllNudges } from '../../actions/NudgeActions'

const stories = [
    {
        profileImage: require('../../asset/image/Community_1.png'),

        name: 'Test Name 1',
        story: [
            {
                type: 'img',
                uri: require('../../testStory3.jpg'),
            },
            {
                type: 'vid',
                uri:
                    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            },
            {
                type: 'img',
                uri: require('../../testStory4.jpeg'),
            },
        ],
    },
    // {
    //     profileImage: require('../../asset/image/Community_1.png'),

    //     name: 'Test Name 1',
    //     story: require('../../testStory2.png'),
    // },
    // {
    //     profileImage: require('../../asset/image/Community_1.png'),

    //     name: 'Test Name 1',
    //     story: require('../../testStory3.jpg'),
    // },
    {
        profileImage: require('../../asset/image/Community_1.png'),

        name: 'Test Name 2',
        story: [
            {
                type: 'img',
                uri: require('../../testStory.jpeg'),
            },
            {
                type: 'img',
                uri: require('../../testStory2.png'),
            },
        ],
    },
    // {
    //     profileImage: require('../../asset/image/Community_1.png'),

    //     name: 'Test Name 2',
    //     story: require('../../testStory.jpeg'),
    // },
    {
        profileImage: require('../../asset/image/Community_1.png'),

        name: 'Test Name 3',
        story: [
            {
                type: 'img',
                uri: require('../../testStory3.jpg'),
            },
        ],
    },
]

// const unique = stories.reduce((res, itm) => {
//     let result = res.find(
//         (item) => JSON.stringify(item.name) == JSON.stringify(itm.name)
//     )
//     if (!result) return res.concat(itm)
//     return res
// }, [])

const DEBUG_KEY = '[ UI Home ]'

let pageAb

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
            shouldRenderBadgeModal: false,
            pickedImage: null,
            shareModal: false,
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
        // this.props.getToastsData()
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
            !this.state.showBadgeEarnModal &&
            !_.get(
                this.props.user,
                'profile.badges.milestoneBadge.currentMilestone',
                0
            ) > 0 &&
            !_.get(
                this.props.user,
                'profile.badges.milestoneBadge.isAwardAlertShown',
                true
            )
        ) {
            // Showing modal to congrats user earning a new badge
            this.setState({
                showBadgeEarnModal: true,
            })
            return
        }
    }

    componentDidMount() {
        const pageId = this.props.refreshProfileData(this.props.userId)

        pageAb = pageId

        setTimeout(() => {
            this.handleEarnBadgeModal()
        }, 2000)

        this.props.refreshNotificationTab()
        // this.props.fetchUnreadCount()

        this.props.refreshActivityFeed()
        AppState.addEventListener('change', this.handleAppStateChange)
        this._notificationSubscription = Notifications.addNotificationReceivedListener(
            this._handleNotification
        )

        // Set timer to fetch profile again if previously failed
        this.setTimer()
        this.props.checkIfNewlyCreated()

        this.props.getUserVisitedNumber()

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
        if (this.flatList) console.log('THIS IS FLATLISTTT', this.flatList)
        this.flatList.scrollToIndex({
            animated: true,
            index: 0,
            viewOffset: this.topTabBarHeight || 80,
        })
    }

    _handleNotification(notification) {
        this.props.handlePushNotification(notification)
    }

    // pickImage = async () => {
    //     if (Platform.OS !== 'web') {
    //         const {
    //             status,
    //         } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    //         if (status !== 'granted') {
    //             return alert(
    //                 'Sorry, we need camera roll permissions to make this work!'
    //             )
    //         } else {
    //             let result = await ImagePicker.launchImageLibraryAsync({
    //                 mediaTypes: ImagePicker.MediaTypeOptions.All,
    //                 allowsEditing: true,
    //                 aspect: [4, 3],
    //                 quality: 0.3,
    //             })

    //             console.log(result)

    //             if (!result.cancelled) {
    //                 this.setState({ pickedImage: result })
    //             }
    //         }
    //     }
    // }

    handleAppStateChange = async (nextAppState) => {
        if (
            this.state.appState.match(/inactive|background/) &&
            nextAppState === 'active'
        ) {
            console.log(
                `${DEBUG_KEY}: [handleAppStateChange] App has become active!`
            )

            trackWithProperties(E.APP_ACTIVE, {
                source: 'direct',
            })

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
                    onCreateUpdatePress={
                        () =>
                            this.createPostModal && this.createPostModal.open()
                        // this.setState({ shareModal: true })
                    }
                    onCreateGoalPress={() =>
                        Actions.push('createGoalModal', {
                            pageId: pageAb,
                        })
                    }
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
        const { token } = this.props
        routes[index].key === 'activity'
            ? this.props.refreshActivityFeed()
            : this.props.refreshGoalFeed()
        this.props.getAllNudges(token)
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

    _storyLineHeader = (props) => {
        const options = [
            {
                text: 'Open Gallery',
                onPress: this.handleOpenCameraRoll,
            },
            {
                text: 'Open Camera',
                onPress: this.handleOpenCamera,
            },
        ]
        return (
            <>
                <TouchableOpacity onPress={this.handleImageIconOnClick}>
                    <View
                        style={{
                            width: 70,
                            height: 70,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: color.GM_LIGHT_GRAY,
                            borderRadius: 35,
                            marginTop: 5,
                        }}
                    >
                        <Image
                            source={video_icon}
                            resizeMode="contain"
                            style={{
                                height: 20,
                                width: 20,
                            }}
                        />
                    </View>
                </TouchableOpacity>
                <BottomButtonsSheet
                    ref={(r) => (this.bottomSheetRef = r)}
                    buttons={options}
                    height={getButtonBottomSheetHeight(options.length)}
                />
            </>
        )
    }
    handleImageIconOnClick = () => {
        this.bottomSheetRef && this.bottomSheetRef.open()
    }

    handleEarnBadgeModal = () => {
        this.setState({ shouldRenderBadgeModal: true })
    }

    handleOpenCameraRoll = () => {
        // const callback = R.curry((result) => {
        //     this.props.newCommentOnMediaRefChange(result.uri, this.props.pageId)
        // })
        this.bottomSheetRef.close()
        setTimeout(() => {
            this.props.openCameraRoll((result) => console.log(result), {
                disableEditing: true,
            })
        }, 500)
    }

    handleOpenCamera = () => {
        this.bottomSheetRef.close()

        setTimeout(() => {
            this.props.openCamera(
                (result) => console.log(result),
                null,
                null,
                true
            )
        }, 500)
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
                    // onModal={() => this.setState({ shareModal: true })}
                    onRef={(r) => (this.createPostModal = r)}
                />
                <View style={styles.homeContainerStyle}>
                    <SearchBarHeader rightIcon="menu" tutorialOn={tutorialOn} />

                    {/* <View
                        style={{
                            width: '100%',
                            height: 150,
                            backgroundColor: 'white',
                            justifyContent: 'center',
                            paddingVertical: 2,
                            marginBottom: 10,
                            paddingLeft: 10,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: TEXT_FONT_SIZE.FONT_1,
                                fontFamily: FONT_FAMILY.SEMI_BOLD,
                                marginBottom: 12,
                            }}
                        >
                            Trending Stories
                        </Text>
                        <FlatList
                            keyExtractor={(index) => index.toString()}
                            horizontal={true}
                            ListHeaderComponent={this._storyLineHeader}
                            data={stories}
                            renderItem={({ item }) => {
                                return (
                                    <VideoStoryLineCircle
                                        image={item.story[0].uri}
                                        profileImage={item.profileImage}
                                        name={item.name}
                                        arrayStory={item.story}
                                        stories={stories}
                                    />
                                )
                            }}
                        />
                    </View> */}

                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        keyboardShouldPersistTaps="handled"
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
                    {/* {this.state.shouldRenderBadgeModal ? (
                        <EarnBadgeModal
                            isVisible={this.state.showBadgeEarnModal}
                            closeModal={() => {
                                this.setState({
                                    showBadgeEarnModal: false,
                                })
                            }}
                            user={this.props.user}
                        />
                    ) : null} */}
                </View>
            </MenuProvider>
        )
    }
}

const mapStateToProps = (state) => {
    const { popup } = state
    const { token } = state.auth.user
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
        token,
        user,
        needRefreshActivity,
        needRefreshMastermind,
        userId,
        // Tutorial related
        hasShown,
        showTutorial,
        tutorialText,
        nextStepNumber,
        popup,
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
        openCamera,
        openCameraRoll,
        fetchAppUserProfile,
        homeSwitchTab,
        openCreateOverlay,
        /* Notification related */
        subscribeNotification,
        saveUnreadNotification,
        handlePushNotification,
        fetchUnreadCount,
        refreshNotificationTab,

        /* Feed related */
        refreshGoalFeed,
        refreshActivityFeed,
        fetchProfile,
        checkIfNewlyCreated,
        closeCreateOverlay,
        refreshProfileData,
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
        getUserVisitedNumber,

        getToastsData,
        getAllNudges,
    },
    null,
    { withRef: true }
)(HomeExplained)
