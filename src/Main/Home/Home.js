/** @format */

// /** @format */

// // /** @format */

// import React, { Component } from 'react'
// import {
//     View,
//     AppState,
//     FlatList,
//     TouchableWithoutFeedback,
//     Image,
//     TouchableOpacity,
//     SafeAreaView,
//     Alert,
//     Keyboard,
// } from 'react-native'
// import { connect } from 'react-redux'
// import { MenuProvider } from 'react-native-popup-menu'
// import { Actions } from 'react-native-router-flux'
// import _ from 'lodash'
// import * as Notifications from 'expo-notifications'
// import { copilot } from 'react-native-copilot-gm'
// import R from 'ramda'
// import NewGoalView from '../Goal/NewGoal/NewGoalView'
// import * as Permissions from 'expo-permissions'
// import moment from 'moment'
// // import Animated from 'react-native-reanimated'
// import Animated from 'react-native-reanimated'
// import CustomBackdrop from './CustomBackdrop'
// // import { copilot } from 'react-native-copilot'
// // import { makeGetUserGoals } from '../../redux/modules/User/Selector'

// /* Components */
// import TabButtonGroup from '../Common/TabButtonGroup'
// import SearchBarHeader from '../Common/Header/SearchBarHeader'
// import { openCamera, openCameraRoll } from '../../actions'
// // import BottomSheet from 'reanimated-bottom-sheet'
// import BottomSheet from '@gorhom/bottom-sheet'
// // import  from '@gorhom/bottom-sheet';

// import Mastermind from './Mastermind'
// import ActivityFeed from './ActivityFeed'
// import EarnBadgeModal from '../Gamification/Badge/EarnBadgeModal'
// import CreatePostModal from '../Post/CreatePostModal'
// import CreateContentButtons from '../Common/Button/CreateContentButtons'
// import { wrapAnalytics, SCREENS } from '../../monitoring/segment'
// import { getToastsData } from '../../actions/ToastActions'
// import BottomButtonsSheet from '../Common/Modal/BottomButtonsSheet'

// //video stroyline
// import VideoStoryLineCircle from './VideoStoryLineCircle'

// import {
//     track,
//     trackWithProperties,
//     EVENT as E,
//     identifyWithTraits,
// } from '../../monitoring/segment'

// // Actions
// import {
//     homeSwitchTab,
//     fetchAppUserProfile,
//     fetchProfile,
//     checkIfNewlyCreated,
//     getUserVisitedNumber,
//     refreshProfileData,
// } from '../../actions'

// import {
//     createGoalSwitchTab,
//     submitGoal,
//     validate,
//     refreshTrendingGoals,
// } from '../../redux/modules/goal/CreateGoalActions'

// import {
//     openCreateOverlay,
//     refreshGoalFeed,
//     closeCreateOverlay,
// } from '../../redux/modules/home/mastermind/actions'

// import { refreshActivityFeed } from '../../redux/modules/home/feed/actions'

// import {
//     subscribeNotification,
//     saveUnreadNotification,
//     handlePushNotification,
// } from '../../redux/modules/notification/NotificationActions'

// import {
//     showNextTutorialPage,
//     startTutorial,
//     saveTutorialState,
//     updateNextStepNumber,
//     pauseTutorial,
//     markUserAsOnboarded,
//     resetTutorial,
// } from '../../redux/modules/User/TutorialActions'
// import * as ImagePicker from 'expo-image-picker'

// import { saveRemoteMatches } from '../../actions/MeetActions'

// // Styles
// import { color } from '../../styles/basic'
// import { TEXT_FONT_SIZE, FONT_FAMILY } from '../../styles/basic/text'
// import video_icon from '../../asset/icons/video_icon.png'
// import { getButtonBottomSheetHeight } from '../../styles'

// // Utils
// import { CreateGoalTooltip } from '../Tutorial/Tooltip'
// import { Text } from 'react-native-animatable'
// import {
//     fetchUnreadCount,
//     refreshNotificationTab,
// } from '../../redux/modules/notification/NotificationTabActions'
// import { makeGetUserGoals } from '../../redux/modules/User/Selector'
// // import { trackWithProperties } from 'expo-analytics-segment'
// import { getAllNudges } from '../../actions/NudgeActions'

// const stories = [
//     {
//         profileImage: require('../../asset/image/Community_1.png'),

//         name: 'Test Name 1',
//         story: [
//             {
//                 type: 'img',
//                 uri: require('../../testStory3.jpg'),
//             },
//             {
//                 type: 'vid',
//                 uri:
//                     'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
//             },
//             {
//                 type: 'img',
//                 uri: require('../../testStory4.jpeg'),
//             },
//         ],
//     },
//     // {
//     //     profileImage: require('../../asset/image/Community_1.png'),

//     //     name: 'Test Name 1',
//     //     story: require('../../testStory2.png'),
//     // },
//     // {
//     //     profileImage: require('../../asset/image/Community_1.png'),

//     //     name: 'Test Name 1',
//     //     story: require('../../testStory3.jpg'),
//     // },
//     {
//         profileImage: require('../../asset/image/Community_1.png'),

//         name: 'Test Name 2',
//         story: [
//             {
//                 type: 'img',
//                 uri: require('../../testStory.jpeg'),
//             },
//             {
//                 type: 'img',
//                 uri: require('../../testStory2.png'),
//             },
//         ],
//     },
//     // {
//     //     profileImage: require('../../asset/image/Community_1.png'),

//     //     name: 'Test Name 2',
//     //     story: require('../../testStory.jpeg'),
//     // },
//     {
//         profileImage: require('../../asset/image/Community_1.png'),

//         name: 'Test Name 3',
//         story: [
//             {
//                 type: 'img',
//                 uri: require('../../testStory3.jpg'),
//             },
//         ],
//     },
// ]

// // const unique = stories.reduce((res, itm) => {
// //     let result = res.find(
// //         (item) => JSON.stringify(item.name) == JSON.stringify(itm.name)
// //     )
// //     if (!result) return res.concat(itm)
// //     return res
// // }, [])

// const DEBUG_KEY = '[ UI Home ]'

// let pageAb

// class Home extends Component {
//     constructor(props) {
//         super(props)
//         this.sheetref = React.createRef()
//         this.state = {
//             navigationState: {
//                 index: 0,
//                 routes: [
//                     { key: 'activity', title: 'All Posts' },
//                     { key: 'goals', title: 'Just Goals' },
//                 ],
//             },
//             appState: AppState.currentState,
//             showWelcomeScreen: false,
//             showBadgeEarnModal: false,
//             shouldRenderBadgeModal: false,
//             pickedImage: null,
//             shareModal: false,
//             currentPositionBottomSheet: 0,
//         }
//         this.scrollToTop = this.scrollToTop.bind(this)
//         this._renderScene = this._renderScene.bind(this)
//         this.setTimer = this.setTimer.bind(this)
//         this.stopTimer = this.stopTimer.bind(this)
//         this._handleNotification = this._handleNotification.bind(this)
//         this._notificationSubscription = undefined
//         this.setMastermindRef = this.setMastermindRef.bind(this)
//         this.handleCreate = this.handleCreate.bind(this)
//         this.handleGoalReminder = this.handleGoalReminder.bind(this)
//         // this.handleIndexChange = this.handleIndexChange.bind(this)
//     }

//     // CustomBackdrop = ({ animatedIndex, style }) => {
//     //     // animated variables
//     //     const animatedOpacity =
//     //             interpolate(animatedIndex, {
//     //                 inputRange: [0, 1],
//     //                 outputRange: [0, 1],
//     //                 extrapolate: Extrapolate.CLAMP,
//     //             }),
//     //         [animatedIndex]
//     //     )

//     //     // styles
//     //     const containerStyle = useMemo(
//     //         () => [
//     //             style,
//     //             {
//     //                 backgroundColor: '#a8b5eb',
//     //                 opacity: animatedOpacity,
//     //             },
//     //         ],
//     //         [style, animatedOpacity]
//     //     )

//     //     return <Animated.View style={containerStyle} />
//     // }
//     handleGoalReminder = async () => {
//         const { initializeFromState } = this.props
//         if (initializeFromState) {
//             // This is updating the goal
//             this.handleCreate()
//             return
//         }

//         const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
//         if (status !== 'granted') {
//             return Alert.alert(
//                 'Goal Reminders',
//                 'Enable Push Notifications for GoalMogul in your phone’s settings to get reminders',
//                 [
//                     {
//                         text: 'Settings',
//                         onPress: () => Linking.openURL('app-settings:'),
//                     },
//                     { text: 'Skip', onPress: () => this.handleCreate() },
//                 ]
//             )
//         }

//         const hasAskedPermission = true
//         Alert.alert(
//             'Goal Reminder',
//             'Would you like to set a reminder for this goal?',
//             [
//                 {
//                     text: 'Tomorrow',
//                     onPress: () => {
//                         // Add 24 hours to current time
//                         const reminderTime = moment(new Date())
//                             .add(24, 'hours')
//                             .toDate()
//                         const scheduleNotificationCallback = (goal) => {
//                             this.props.scheduleNotification(
//                                 reminderTime,
//                                 goal,
//                                 hasAskedPermission
//                             )
//                         }
//                         this.handleCreate(scheduleNotificationCallback)
//                         // trackWithProperties(EVENT.GOAL_CREATED, {
//                         //     reminder_set: true,
//                         //     reminder_type: 'tomorrow',
//                         // })
//                     },
//                 },
//                 {
//                     text: 'Next Week',
//                     onPress: () => {
//                         // Add 7 days to current time
//                         const reminderTime = moment(new Date())
//                             .add(7, 'days')
//                             .toDate()
//                         const scheduleNotificationCallback = (goal) => {
//                             this.props.scheduleNotification(
//                                 reminderTime,
//                                 goal,
//                                 hasAskedPermission
//                             )
//                         }
//                         this.handleCreate(scheduleNotificationCallback)
//                         // trackWithProperties(EVENT.GOAL_CREATED, {
//                         //     reminder_set: true,
//                         //     reminder_type: 'nextweek',
//                         // })
//                     },
//                 },
//                 {
//                     text: 'Custom',
//                     onPress: () => {
//                         this.setState({
//                             ...this.state,
//                             goalReminderDatePicker: true,
//                         })
//                         // trackWithProperties(EVENT.GOAL_CREATED, {
//                         //     reminder_set: true,
//                         //     reminder_type: 'custom',
//                         // })
//                     },
//                 },
//                 {
//                     text: 'No Thanks',
//                     onPress: () => {
//                         // Use chooses not to set reminder
//                         this.handleCreate()
//                         // trackWithProperties(EVENT.GOAL_CREATED, {
//                         //     reminder_set: false,
//                         // })
//                     },
//                     style: 'cancel',
//                 },
//             ],
//             { cancelable: false }
//         )
//     }

//     handleCreate = (scheduleNotificationCallback) => {
//         //Close keyboard no matter what
//         Keyboard.dismiss()
//         const errors = validate(this.props.formVals.values)
//         console.log(
//             `${DEBUG_KEY}: raw goal values are: `,
//             this.props.formVals.values
//         )
//         if (
//             !(Object.keys(errors).length === 0 && errors.constructor === Object)
//         ) {
//             // throw new SubmissionError(errors);
//             return Alert.alert('Error', 'You have incomplete fields.')
//         }

//         const { goal, initializeFromState, uploading, goals } = this.props

//         if (!uploading) return // when uploading is false, it's actually uploading.
//         const goalId = goal ? goal._id : undefined

//         const getGoalPrivacy =
//             this.props.formVals.values.privacy === 'self' && goals.length == 0

//         if (getGoalPrivacy) {
//             this.setState({ goalModalVisible: true })
//         } else {
//             // const durationSec =
//             //     (new Date().getTime() - this.startTime.getTime()) / 1000

//             identifyWithTraits(this.props.userId, {
//                 goalsCreated: goals.length + 1,
//             })

//             trackWithProperties(E.GOAL_CREATED, {
//                 goal_title: this.props.formVals.values.title,
//                 category: this.props.formVals.values.category,
//                 goal_importance: this.props.formVals.values.priority,
//                 privacy: this.props.formVals.values.privacy,
//                 start_date: this.props.formVals.values.startTime.date,
//                 end_date: this.props.formVals.values.endTime.date,
//                 steps: this.props.formVals.values.steps.length,
//                 needs: this.props.formVals.values.needs.length,
//             })

//             return this.props.submitGoal(
//                 this.props.formVals.values,
//                 this.props.user._id,
//                 initializeFromState,
//                 (createdGoal) => {
//                     this.sheetref.current.collapse()
//                     console.log(`${DEBUG_KEY}: [handleCreate] poping the modal`)
//                     if (this.props.callback) {
//                         console.log(
//                             `${DEBUG_KEY}: [handleCreate] calling callback`
//                         )
//                         this.props.callback()
//                     }
//                     if (this.props.onClose) {
//                         console.log(
//                             `${DEBUG_KEY}: [handleCreate] calling onClose`
//                         )
//                         this.props.onClose()
//                     }

//                     if (scheduleNotificationCallback) {
//                         // This is to schedule notification on user create goal
//                         // Edit goal won't have this callback
//                         console.log(
//                             `${DEBUG_KEY}: [handleCreate]: [CreateGoalActions]: callback: scheduleNotificationCallback with created goal: `,
//                             createdGoal
//                         )
//                         scheduleNotificationCallback(createdGoal)
//                     }
//                     Actions.pop()
//                 },
//                 goalId,
//                 {
//                     needOpenProfile:
//                         this.props.openProfile === undefined ||
//                         this.props.openProfile === true,
//                     needRefreshProfile: this.props.openProfile === false,
//                 },
//                 this.props.pageId
//             )
//         }
//     }

//     renderContent = () => {
//         const actionText = this.props.initializeFromState ? 'Update' : 'Create'

//         const titleText = this.props.initializeFromState
//             ? 'Edit Goal'
//             : 'New Goal'
//         const hasValidFormVals =
//             this.props.formVals &&
//             this.props.formVals.values &&
//             this.props.formVals.values.title &&
//             this.props.formVals.values.category &&
//             this.props.formVals.values.priority &&
//             this.props.formVals.values.title.trim() !== ''
//         return (
//             <>
//                 {/* <SafeAreaView style={{ flex: 0, backgroundColor: '#42C0F5' }} /> */}
//                 {/* <View
//                     style={{
//                         height: 20,
//                         width: '100%',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         paddingTop: 5,
//                     }}
//                 >

//                 </View> */}
//                 <View
//                     style={{
//                         backgroundColor: 'white',
//                         padding: 10,
//                         height: '100%',
//                     }}
//                 >
//                     {/* <TouchableOpacity
//                         style={{ alignSelf: 'center', marginBottom: 10 }}
//                         onPress={() => {
//                             this.setState({ currentPositionBottomSheet: 2 })
//                             console.log(this.currentPositionBottomSheet)
//                             this.sheetref.current.snapTo(2)
//                         }}
//                     >
//                         <Image
//                             source={
//                                 this.state.currentPositionBottomSheet === 1
//                                     ? require('../../asset/upward_arrow.png')
//                                     : require('../../asset/linegrey.png')
//                             }
//                             style={{
//                                 width: 35,
//                                 height:
//                                     this.state.currentPositionBottomSheet === 1
//                                         ? 7
//                                         : 2,
//                             }}
//                         />
//                     </TouchableOpacity> */}
//                     <NewGoalView
//                         currentstatebottom={
//                             this.state.currentPositionBottomSheet
//                         }
//                         initializeFromState={this.props.initializeFromState}
//                         isImportedGoal={this.props.isImportedGoal}
//                         goal={this.props.goal}
//                         tutorialText={this.props.tutorialText}
//                         onRef={(r) => {
//                             this.newGoalView = r
//                         }}
//                         createButtonTitle={actionText}
//                         handleCreateButton={this.handleGoalReminder}
//                         actionDisabled={
//                             !this.props.uploading || !hasValidFormVals
//                         }
//                         prefilledTitle={this.props.preffiled}
//                     />
//                 </View>
//             </>
//         )
//     }
//     fall = new Animated.Value(1)
//     componentDidUpdate(prevProps) {
//         // this.props.getToastsData()
//         // if (!prevProps.showTutorial && this.props.showTutorial === true) {
//         //     console.log(
//         //         `${DEBUG_KEY}: [ componentDidUpdate ]: tutorial start: `,
//         //         this.props.nextStepNumber
//         //     )
//         //     this.props.start()
//         // }

//         if (
//             !_.isEqual(prevProps.user, this.props.user) &&
//             !prevProps.user &&
//             !this.props.user.isOnBoarded
//         ) {
//             console.log(
//                 `${DEBUG_KEY}: [ componentDidUpdate ]: prev user: `,
//                 prevProps.user
//             )
//             setTimeout(() => {
//                 console.log('[Home UI] [componentDidUpdate] start tutorial')
//                 this.props.start()
//             }, 200)
//         }

//         if (
//             !_.isEqual(prevProps.user, this.props.user) &&
//             !this.props.user.isOnBoarded
//         ) {
//             // Tutorial will be started by on welcome screen closed
//             this.setState({
//                 showWelcomeScreen: true,
//             })
//             return
//         }

//         if (
//             !this.state.showBadgeEarnModal &&
//             !_.get(
//                 this.props.user,
//                 'profile.badges.milestoneBadge.currentMilestone',
//                 0
//             ) > 0 &&
//             !_.get(
//                 this.props.user,
//                 'profile.badges.milestoneBadge.isAwardAlertShown',
//                 true
//             )
//         ) {
//             // Showing modal to congrats user earning a new badge
//             this.setState({
//                 showBadgeEarnModal: true,
//             })
//             return
//         }
//     }

//     componentDidMount() {
//         const pageId = this.props.refreshProfileData(this.props.userId)
//         this.sheetref.current.snapTo(0)
//         pageAb = pageId

//         setTimeout(() => {
//             this.handleEarnBadgeModal()
//         }, 2000)

//         this.props.refreshNotificationTab()
//         // this.props.fetchUnreadCount()

//         this.props.refreshActivityFeed()
//         AppState.addEventListener('change', this.handleAppStateChange)
//         // this._notificationSubscription = Notifications.addListener(
//         //     this._handleNotification
//         // )
//         this._notificationSubscription = Notifications.addNotificationReceivedListener(
//             this._handleNotification
//         )

//         // Set timer to fetch profile again if previously failed
//         this.setTimer()
//         this.props.checkIfNewlyCreated()

//         this.props.getUserVisitedNumber()

//         const { user } = this.props
//         if (user && !user.isOnBoarded) {
//             setTimeout(() => {
//                 console.log('[Home UI] [componentDidMount] start tutorial')
//                 this.props.start()
//             }, 300)
//         }

//         this.props.copilotEvents.on('stop', () => {
//             console.log(
//                 `${DEBUG_KEY}: [ componentDidMount ]: [ copilotEvents ] tutorial stop. show next page. Next step number is: `,
//                 this.props.nextStepNumber
//             )

//             if (this.props.nextStepNumber === 1) {
//                 Actions.createGoalModal({ isFirstTimeCreateGoal: true })
//                 this.props.pauseTutorial('create_goal', 'home', 1)
//                 setTimeout(() => {
//                     this.props.showNextTutorialPage('create_goal', 'home')
//                     this.props.markUserAsOnboarded()
//                 }, 400)
//                 return
//             }
//         })

//         this.props.copilotEvents.on('stepChange', (step) => {
//             const { order, name } = step
//             console.log(
//                 `${DEBUG_KEY}: [ onStepChange ]: step order: ${order}, step visible: ${name}, current next step is: ${this.props.nextStepNumber}`
//             )
//             // console.log(`${DEBUG_KEY}: [ componentDidMount ]: [ stepChange ]: step change to ${step.order}`);
//             // TODO: if later we have more steps in between, change here
//             // This is called before changing to a new step
//             this.props.updateNextStepNumber('create_goal', 'home', order + 1)
//         })
//     }

//     componentWillUnmount() {
//         console.log(`${DEBUG_KEY}: [ componentWillUnmount ]`)
//         this.sheetref.current.snapTo(0)

//         // Remove tutorial listener
//         this.props.copilotEvents.off('stop')
//         this.props.copilotEvents.off('stepChange')

//         AppState.removeEventListener('change', this.handleAppStateChange)
//         this._notificationSubscription.remove()
//         // Remove timer in case app crash
//         this.stopTimer()
//     }

//     setMastermindRef(mastermindRef) {
//         this.mastermindRef = mastermindRef
//     }

//     setTimer() {
//         this.stopTimer() // Clear the previous timer if there is one

//         console.log(
//             `${DEBUG_KEY}: [ Setting New Timer ] for fetching profile after 1s`
//         )
//         this.timer = setTimeout(() => {
//             console.log(
//                 `${DEBUG_KEY}: [ Timer firing ] fetching profile again.`
//             )
//             this.props.fetchProfile(this.props.userId)
//         }, 1000)
//     }

//     stopTimer() {
//         if (this.timer !== undefined) {
//             console.log(
//                 `${DEBUG_KEY}: [ Timer clearing ] for fetching profile 5s after mounted`
//             )
//             clearInterval(this.timer)
//         }
//     }

//     scrollToTop = () => {
//         if (this.flatList) console.log('THIS IS FLATLISTTT', this.flatList)
//         this.flatList.scrollToIndex({
//             animated: true,
//             index: 0,
//             viewOffset: this.topTabBarHeight || 80,
//         })
//     }

//     _handleNotification(notification) {
//         this.props.handlePushNotification(notification)
//     }

//     // pickImage = async () => {
//     //     if (Platform.OS !== 'web') {
//     //         const {
//     //             status,
//     //         } = await ImagePicker.requestMediaLibraryPermissionsAsync()
//     //         if (status !== 'granted') {
//     //             return alert(
//     //                 'Sorry, we need camera roll permissions to make this work!'
//     //             )
//     //         } else {
//     //             let result = await ImagePicker.launchImageLibraryAsync({
//     //                 mediaTypes: ImagePicker.MediaTypeOptions.All,
//     //                 allowsEditing: true,
//     //                 aspect: [4, 3],
//     //                 quality: 0.3,
//     //             })

//     //             console.log(result)

//     //             if (!result.cancelled) {
//     //                 this.setState({ pickedImage: result })
//     //             }
//     //         }
//     //     }
//     // }

//     handleAppStateChange = async (nextAppState) => {
//         if (
//             this.state.appState.match(/inactive|background/) &&
//             nextAppState === 'active'
//         ) {
//             console.log(
//                 `${DEBUG_KEY}: [handleAppStateChange] App has become active!`
//             )

//             trackWithProperties(E.APP_ACTIVE, {
//                 source: 'direct',
//             })

//             const {
//                 needRefreshActivity,
//                 needRefreshMastermind,
//                 user,
//             } = this.props
//             if (user === undefined || _.isEmpty(user) || !user.profile) {
//                 this.props.fetchAppUserProfile({ navigate: false })
//             }

//             if (needRefreshMastermind) {
//                 this.props.refreshGoalFeed()
//             }

//             if (needRefreshActivity) {
//                 this.props.refreshActivityFeed()
//             }
//         }

//         if (this.state.appState === 'active' && nextAppState !== 'active') {
//             console.log(
//                 `${DEBUG_KEY}: [handleAppStateChange] App has become inactive!`
//             )
//             track(E.APP_INACTIVE)
//             await this.props.saveUnreadNotification()
//             await this.props.saveTutorialState()
//         }

//         this.setState({
//             appState: nextAppState,
//         })
//     }

//     _handleIndexChange = (index) => {
//         this.setState({
//             navigationState: {
//                 ...this.state.navigationState,
//                 index,
//             },
//         })
//         this.props.homeSwitchTab(index)
//     }

//     _renderHeader = (props) => {
//         return (
//             <View
//                 onLayout={(e) =>
//                     (this.topTabBarHeight = e.nativeEvent.layout.height)
//                 }
//             >
//                 <CreateContentButtons
//                     onCreateUpdatePress={
//                         () =>
//                             this.createPostModal && this.createPostModal.open()
//                         // this.setState({ shareModal: true })
//                     }
//                     onCreateGoalPress={() =>
//                         // Actions.push('createGoalModal', {
//                         //     pageId: pageAb,
//                         // })
//                         {
//                             // console.log('THIS sheet', this.sheetref.current)

//                             // this.setState({ currentPositionBottomSheet: 1 })
//                             // console.log(this.state.currentPositionBottomSheet)

//                             this.sheetref.current.snapTo(1)
//                         }
//                     }
//                 />
//                 {/* Hid switching tabs to clean up the main view to just friend's Goals and Updates */}
//                 {/* <View style={styles.tabContainer}>
//                     <TabButtonGroup buttons={props} />
//                 </View> */}
//             </View>
//         )
//     }

//     handleOnRefresh = () => {
//         const { routes, index } = this.state.navigationState
//         const { token } = this.props
//         routes[index].key === 'activity'
//             ? this.props.refreshActivityFeed()
//             : this.props.refreshGoalFeed()
//         this.props.getAllNudges(token)
//     }

//     _renderScene() {
//         const { routes, index } = this.state.navigationState

//         switch (routes[index].key) {
//             case 'goals':
//                 return (
//                     <Mastermind
//                         tutorialText={this.props.tutorialText[0]}
//                         nextStepNumber={this.props.nextStepNumber}
//                         order={0}
//                         name="create_goal_home_0"
//                         setMastermindRef={this.setMastermindRef}
//                     />
//                 )
//             case 'activity':
//                 return <ActivityFeed />
//             default:
//                 return null
//         }
//     }

//     _storyLineHeader = (props) => {
//         const options = [
//             {
//                 text: 'Open Gallery',
//                 onPress: this.handleOpenCameraRoll,
//             },
//             {
//                 text: 'Open Camera',
//                 onPress: this.handleOpenCamera,
//             },
//         ]
//         return (
//             <>
//                 <TouchableOpacity onPress={this.handleImageIconOnClick}>
//                     <View
//                         style={{
//                             width: 70,
//                             height: 70,
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             backgroundColor: color.GM_LIGHT_GRAY,
//                             borderRadius: 35,
//                             marginTop: 5,
//                         }}
//                     >
//                         <Image
//                             source={video_icon}
//                             resizeMode="contain"
//                             style={{
//                                 height: 20,
//                                 width: 20,
//                             }}
//                         />
//                     </View>
//                 </TouchableOpacity>
//                 <BottomButtonsSheet
//                     ref={(r) => (this.bottomSheetRef = r)}
//                     buttons={options}
//                     height={getButtonBottomSheetHeight(options.length)}
//                     enabledContentTapInteraction={false}
//                 />
//             </>
//         )
//     }
//     handleImageIconOnClick = () => {
//         this.bottomSheetRef && this.bottomSheetRef.open()
//     }

//     handleEarnBadgeModal = () => {
//         this.setState({ shouldRenderBadgeModal: true })
//     }

//     handleOpenCameraRoll = () => {
//         // const callback = R.curry((result) => {
//         //     this.props.newCommentOnMediaRefChange(result.uri, this.props.pageId)
//         // })
//         this.bottomSheetRef.close()
//         setTimeout(() => {
//             this.props.openCameraRoll((result) => console.log(result), {
//                 disableEditing: true,
//             })
//         }, 500)
//     }

//     handleOpenCamera = () => {
//         this.bottomSheetRef.close()

//         setTimeout(() => {
//             this.props.openCamera(
//                 (result) => console.log(result),
//                 null,
//                 null,
//                 true
//             )
//         }, 500)
//     }

//     render() {
//         const { user, refreshing } = this.props

//         // NOTE: this has to compare with true otherwise it might be undefine
//         const showRefreshing = refreshing === true && user.isOnBoarded === true
//         const tutorialOn =
//             this.props.nextStepNumber >= 2
//                 ? {
//                       rightIcon: {
//                           iconType: 'menu',
//                           tutorialText: this.props.tutorialText[1],
//                           order: 1,
//                           name: 'create_goal_home_menu',
//                       },
//                   }
//                 : undefined

//         return (
//             <MenuProvider customStyles={{ backdrop: styles.backdrop }}>
//                 <CreatePostModal
//                     attachGoalRequired
//                     // onModal={() => this.setState({ shareModal: true })}
//                     onRef={(r) => (this.createPostModal = r)}
//                 />
//                 <Animated.View
//                     style={[
//                         styles.homeContainerStyle,
//                         {
//                             opacity: Animated.add(
//                                 0.1,
//                                 Animated.multiply(this.fall, 0.9)
//                             ),
//                         },
//                     ]}
//                 >
//                     <SearchBarHeader rightIcon="menu" tutorialOn={tutorialOn} />

//                     {/* <View
//                         style={{
//                             width: '100%',
//                             height: 150,
//                             backgroundColor: 'white',
//                             justifyContent: 'center',
//                             paddingVertical: 2,
//                             marginBottom: 10,
//                             paddingLeft: 10,
//                         }}
//                     >
//                         <Text
//                             style={{
//                                 fontSize: TEXT_FONT_SIZE.FONT_1,
//                                 fontFamily: FONT_FAMILY.SEMI_BOLD,
//                                 marginBottom: 12,
//                             }}
//                         >
//                             Trending Stories
//                         </Text>
//                         <FlatList
//                             keyExtractor={(index) => index.toString()}
//                             horizontal={true}
//                             ListHeaderComponent={this._storyLineHeader}
//                             data={stories}
//                             renderItem={({ item }) => {
//                                 return (
//                                     <VideoStoryLineCircle
//                                         image={item.story[0].uri}
//                                         profileImage={item.profileImage}
//                                         name={item.name}
//                                         arrayStory={item.story}
//                                         stories={stories}
//                                     />
//                                 )
//                             }}
//                         />
//                     </View> */}

//                     <FlatList
//                         keyExtractor={(item, index) => index.toString()}
//                         keyboardShouldPersistTaps="handled"
//                         ref={(ref) => (this.flatList = ref)}
//                         ListHeaderComponent={this._renderHeader({
//                             jumpToIndex: this._handleIndexChange,
//                             navigationState: this.state.navigationState,
//                         })}
//                         data={[{}]}
//                         renderItem={this._renderScene}
//                         refreshing={showRefreshing}
//                         onRefresh={this.handleOnRefresh}
//                     />
//                     {/* {this.state.shouldRenderBadgeModal ? (
//                         <EarnBadgeModal
//                             isVisible={this.state.showBadgeEarnModal}
//                             closeModal={() => {
//                                 this.setState({
//                                     showBadgeEarnModal: false,
//                                 })
//                             }}
//                             user={this.props.user}
//                         />
//                     ) : null} */}
//                 </Animated.View>
//                 <BottomSheet
//                     ref={this.sheetref}
//                     snapPoints={[0, 450, '88%']}
//                     index={-1}
//                     onChange={(index) =>
//                         this.setState({ currentPositionBottomSheet: index })
//                     }
//                     // renderContent={this.renderContent}
//                     // callbackNode={this.fall}
//                     BottomSheetBackdrop={() => (
//                         <CustomBackdrop
//                             animatedIndex={
//                                 this.state.currentPositionBottomSheet
//                             }
//                         />
//                     )}
//                 >
//                     {/* <Text>TEST TEST</Text> */}
//                     {this.renderContent()}
//                 </BottomSheet>
//             </MenuProvider>
//         )
//     }
// }

// const mapStateToProps = (state) => {
//     const getUserGoals = makeGetUserGoals()

//     const { popup } = state
//     const { token } = state.auth.user
//     const { userId } = state.user
//     const refreshing = state.home.activityfeed.refreshing
//     // || state.home.mastermind.refreshing
//     const needRefreshMastermind = _.isEmpty(state.home.mastermind.data)
//     const needRefreshActivity = _.isEmpty(state.home.activityfeed.data)
//     const { user } = state.user
//     const { navigationState, uploading } = state.createGoal
//     const goals = getUserGoals(state, userId, pageAb)

//     // Tutorial related
//     const { create_goal } = state.tutorials
//     const { home } = create_goal
//     const { hasShown, showTutorial, tutorialText, nextStepNumber } = home

//     return {
//         refreshing,
//         token,
//         user,
//         needRefreshActivity,
//         needRefreshMastermind,
//         formVals: state.form.createGoalModal,
//         userId,
//         // Tutorial related
//         hasShown,
//         showTutorial,
//         tutorialText,
//         nextStepNumber,
//         popup,

//         navigationState,
//         uploading,
//         goals,
//     }
// }

// const styles = {
//     homeContainerStyle: {
//         backgroundColor: color.GM_BACKGROUND,
//         flex: 1,
//     },
//     tabContainer: {
//         paddingLeft: 8,
//         paddingRight: 8,
//         backgroundColor: color.GM_CARD_BACKGROUND,
//     },
//     backdrop: {
//         backgroundColor: 'gray',
//         opacity: 0.5,
//     },
// }

// const AnalyticsWrapped = wrapAnalytics(Home, SCREENS.HOME)

// const HomeExplained = copilot({
//     overlay: 'svg', // or 'view'
//     animated: true, // or false
//     stepNumberComponent: () => <View />,
//     tooltipComponent: CreateGoalTooltip,
//     // svgMaskPath: svgMaskPath,
// })(AnalyticsWrapped)

// export default connect(
//     mapStateToProps,
//     {
//         openCamera,
//         openCameraRoll,
//         fetchAppUserProfile,
//         homeSwitchTab,
//         openCreateOverlay,
//         /* Notification related */
//         subscribeNotification,
//         saveUnreadNotification,
//         handlePushNotification,
//         fetchUnreadCount,
//         refreshNotificationTab,

//         /* Feed related */
//         refreshGoalFeed,
//         refreshActivityFeed,
//         fetchProfile,
//         checkIfNewlyCreated,
//         closeCreateOverlay,
//         refreshProfileData,
//         /* Tutorial related */
//         showNextTutorialPage,
//         startTutorial,
//         saveTutorialState,
//         updateNextStepNumber,
//         pauseTutorial,
//         markUserAsOnboarded,
//         resetTutorial,
//         /* Contact sync related */
//         saveRemoteMatches,
//         getUserVisitedNumber,

//         getToastsData,
//         getAllNudges,
//         createGoalSwitchTab,
//         submitGoal,
//         validate,
//         refreshTrendingGoals,
//     },
//     null,
//     { withRef: true }
// )(HomeExplained)

/** @format */

import React, { Component } from 'react'
import {
    View,
    AppState,
    FlatList,
    TouchableWithoutFeedback,
    Image,
    TouchableOpacity,
    Platform,
    // SafeAreaView,
    StatusBar,
} from 'react-native'
import { connect } from 'react-redux'
import { MenuProvider } from 'react-native-popup-menu'
import { Actions } from 'react-native-router-flux'
import _ from 'lodash'
import * as Notifications from 'expo-notifications'
import { copilot } from 'react-native-copilot-gm'
import R from 'ramda'
// import NewGoalView from '../Goal/NewGoal/NewGoalView'

// import { copilot } from 'react-native-copilot'

/* Components */
import TabButtonGroup from '../Common/TabButtonGroup'
import SearchBarHeader from '../Common/Header/SearchBarHeader'
import { openCamera, openCameraRoll, uploadPopupData } from '../../actions'
import Mastermind from './Mastermind'
import ActivityFeed from './ActivityFeed'
import EarnBadgeModal from '../Gamification/Badge/EarnBadgeModal'
import CreatePostModal from '../Post/CreatePostModal'
import CreateContentButtons from '../Common/Button/CreateContentButtons'
import { wrapAnalytics, SCREENS } from '../../monitoring/segment'
import { track, EVENT as E } from '../../monitoring/segment'
import { getToastsData } from '../../actions/ToastActions'
import BottomButtonsSheet from '../Common/Modal/BottomButtonsSheet'
import GOAL_ENDDATE_2_WEEKS from '../Goal/Common/GOAL_ENDDATE_2_WEEKS'
import GOAL_UPDATE_POPUP_A from '../Goal/Common/GOAL_UPDATE_POPUP_A'
import GOAL_UPDATE_POPUP_B from '../Goal/Common/GOAL_UPDATE_POPUP_B'
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
    // fetchGoalPopup27Day,
} from '../../actions'

import {
    openCreateOverlay,
    refreshGoalFeed,
    closeCreateOverlay,
} from '../../redux/modules/home/mastermind/actions'
import Popup from '../Journey/Popup'

import { refreshActivityFeed } from '../../redux/modules/home/feed/actions'

import {
    subscribeNotification,
    saveUnreadNotification,
    handlePushNotification,
    getFcmToken,
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
        // this.sheetref = React.createRef()
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
            isVisible: false,
            isVisibleA: this.props.lateGoal.show,
            isVisibleB: false,
            showPopupModal: false,
            popupName: '',
        }
        this.scrollToTop = this.scrollToTop.bind(this)
        this._renderScene = this._renderScene.bind(this)
        this.setTimer = this.setTimer.bind(this)
        this.stopTimer = this.stopTimer.bind(this)
        this._handleNotification = this._handleNotification.bind(this)
        this._notificationSubscription = undefined
        this.setMastermindRef = this.setMastermindRef.bind(this)
    }
    // renderContent = () => {
    //     const actionText = this.props.initializeFromState ? 'Update' : 'Create'

    //     const titleText = this.props.initializeFromState
    //         ? 'Edit Goal'
    //         : 'New Goal'
    //     const hasValidFormVals =
    //         this.props.formVals &&
    //         this.props.formVals.values &&
    //         this.props.formVals.values.title &&
    //         this.props.formVals.values.category &&
    //         this.props.formVals.values.priority &&
    //         this.props.formVals.values.title.trim() !== ''
    //     return (
    //         <>
    //             <SafeAreaView style={{ flex: 0, backgroundColor: '#42C0F5' }} />
    //             <View
    //                 style={{
    //                     backgroundColor: 'white',
    //                     padding: 16,
    //                     height: '100%',
    //                 }}
    //             >
    //                 <NewGoalView
    //                     initializeFromState={this.props.initializeFromState}
    //                     isImportedGoal={this.props.isImportedGoal}
    //                     goal={this.props.goal}
    //                     tutorialText={this.props.tutorialText}
    //                     onRef={(r) => {
    //                         this.newGoalView = r
    //                     }}
    //                     createButtonTitle={actionText}
    //                     handleCreateButton={this.handleGoalReminder}
    //                     actionDisabled={
    //                         !this.props.uploading || !hasValidFormVals
    //                     }
    //                     prefilledTitle={this.props.preffiled}
    //                 />
    //             </View>
    //         </>
    //     )
    // }
    componentDidUpdate(prevProps) {
        // this.props.getToastsData()
        // if (!prevProps.showTutorial && this.props.showTutorial === true) {
        //     console.log(
        //         `${DEBUG_KEY}: [ componentDidUpdate ]: tutorial start: `,
        //         this.props.nextStepNumber
        //     )
        //     this.props.start()
        // }
        if (!_.isEqual(prevProps.lateGoal, this.props.lateGoal)) {
            this.setState({ isVisibleA: this.props.lateGoal.show })
        }
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
        if (Platform.OS === 'android') {
            getFcmToken()
        }
        this.setState({ isVisibleA: this.props.lateGoal.show })
        const pageId = this.props.refreshProfileData(this.props.userId)

        pageAb = pageId

        setTimeout(() => {
            this.handleEarnBadgeModal()
        }, 2000)

        this.props.refreshNotificationTab()
        // this.props.fetchUnreadCount()

        setTimeout(() => {
            this.handlePopup()
        }, 500)
        // this.props.fetchGoalPopup27Day()
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
                    onCreateGoalPress={
                        () =>
                            Actions.push('createGoalModal', {
                                pageId: pageAb,
                            })
                        // this.sheetref.current.snapTo(1)
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

    handleQuestionPopup = () => {
        // console.log('\ncoming in handleQuestionPopup')
        this.setState({
            showPopupModal: false,
        })
        setTimeout(() => {
            if (!this.props.popup['INVITE_POPUPS'].status) {
                this.props.uploadPopupData('INVITE_POPUPS')
                this.setState({
                    showQuestionModal: true,
                })
            }
        }, 500)
    }

    handlePopup = () => {
        // console.log('\nhandlePopup is called')
        const { popup, profile, myGoals } = this.props

        console.log('POPUP DATA', popup)
        console.log('POPUP DATA 1', this.state.popupName)
        // console.log('POPP UPP OBJECT', popup)
        // console.log('\nThis is popup', profile)
        if (!popup['FIRST_GOAL'].status && myGoals.length === 1) {
            this.props.uploadPopupData('FIRST_GOAL')
            this.setState({ showPopupModal: true, popupName: 'FIRST_GOAL' })
        } else if (
            !popup['GREEN_BADGE'].status &&
            profile.badges.milestoneBadge.currentMilestone === 1
        ) {
            this.props.uploadPopupData('GREEN_BADGE')
            this.setState({ showPopupModal: true, popupName: 'GREEN_BADGE' })
        } else if (
            !popup['BRONZE_BADGE'].status &&
            profile.badges.milestoneBadge.currentMilestone === 2
        ) {
            this.props.uploadPopupData('BRONZE_BADGE')
            this.setState({ showPopupModal: true, popupName: 'BRONZE_BADGE' })
        } else if (!popup['SEVEN_GOALS'].status && myGoals.length === 7) {
            this.props.uploadPopupData('SEVEN_GOALS')
            this.setState({ showPopupModal: true, popupName: 'SEVEN_GOALS' })
        } else if (
            !popup['SILVER_BADGE'].status &&
            profile.badges.milestoneBadge.currentMilestone === 3
        ) {
            this.props.uploadPopupData('SILVER_BADGE')
            this.setState({ showPopupModal: true, popupName: 'SILVER_BADGE' })
        } else if (
            !popup['GOLD_BADGE'].status &&
            profile.badges.milestoneBadge.currentMilestone === 4
        ) {
            this.props.uploadPopupData('GOLD_BADGE')
            this.setState({ showPopupModal: true, popupName: 'GOLD_BADGE' })
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
            <MenuProvider
                customStyles={{ backdrop: styles.backdrop }}
                skipInstanceCheck={true}
            >
                <StatusBar
                    animated={true}
                    backgroundColor={color.GM_BLUE_DEEP}
                    // barStyle={statusBarStyle}
                    // showHideTransition={statusBarTransition}
                />
                <CreatePostModal
                    attachGoalRequired
                    // onModal={() => this.setState({ shareModal: true })}
                    onRef={(r) => (this.createPostModal = r)}
                />
                {/* <GOAL_ENDDATE_2_WEEKS
                    isVisible={this.state.isVisible}
                    closeModal={() => this.setState({ isVisible: false })}
                />
                <GOAL_UPDATE_POPUP_A
                    pageId={this.props.pageId}
                    isVisible={this.state.isVisibleA}
                    closeModal={() => this.setState({ isVisibleA: false })}
                    data={this.props.lateGoal}
                    makeVisibleB={() => this.setState({ isVisibleB: true })}
                />
                <GOAL_UPDATE_POPUP_B
                    data={this.props.lateGoal}
                    pageId={this.props.pageId}
                    isVisible={this.state.isVisibleB}
                    closeModal={() => this.setState({ isVisibleB: false })}
                /> */}
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
                    {/* <BottomSheet
                        ref={this.sheetref}
                        snapPoints={[0, 300, '85%']}
                        renderContent={this.renderContent}
                    /> */}

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
                    <Popup
                        popupName={this.state.popupName}
                        isVisible={this.state.showPopupModal}
                        closeModal={() => {
                            this.state.popupName == 'FIRST_GOAL'
                                ? this.handleQuestionPopup()
                                : this.setState({
                                      showPopupModal: false,
                                  })
                        }}
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
    // console.log("STATE",state);
    const { popup } = state
    const { token } = state.auth.user
    const { profile } = state.user.user
    const { myGoals } = state.goals
    const { userId } = state.user
    const refreshing = state.home.activityfeed.refreshing
    const lateGoal = state.profile.lateGoal
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
        profile,
        user,
        needRefreshActivity,
        needRefreshMastermind,
        userId,
        myGoals,
        // Tutorial related
        hasShown,
        showTutorial,
        tutorialText,
        nextStepNumber,
        popup,
        lateGoal,
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
        // fetchGoalPopup27Day,
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
        uploadPopupData,
    },
    null,
    { withRef: true }
)(HomeExplained)
