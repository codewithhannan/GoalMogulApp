/** @format */

import React, { Component } from 'react'
import { Animated, Easing } from 'react-native'
import {
    ActionConst,
    Actions,
    Drawer,
    Lightbox,
    Modal,
    Reducer,
    Router,
    Scene,
    Stack,
    Tabs,
    Linking,
} from 'react-native-router-flux'
import { connect } from 'react-redux'
import LoginPage from './LoginPage'

import crossroads from 'crossroads'
// Chat
import Chat from './Main/Chat/Chat'
import ChatRoomConversation from './Main/Chat/ChatRoom/ChatRoomConversation'
import ChatRoomMembers from './Main/Chat/ChatRoom/ChatRoomMembers'
import ChatRoomMessageSearch from './Main/Chat/ChatRoom/ChatRoomMessageSearch'
import ChatRoomOptions from './Main/Chat/ChatRoom/ChatRoomOptions'
import ChatRoomPubicView from './Main/Chat/ChatRoom/ChatRoomPublicView'
import ChatMessageSnapshotModal from './Main/Chat/Modals/ChatMessageSnapshotModal'
import CreateChatRoomModal from './Main/Chat/Modals/CreateChatRoomModal'
import ShareToChatModal from './Main/Chat/Modals/ShareToChatModal'
import CreateButtonOverlay from './Main/Common/Button/CreateButtonOverlay'
import CreateGoalButtonOverlay from './Main/Common/Button/CreateGoalButtonOverlay'
import SilverChallenge from './Main/Challenges/SilverChallenge'
import GoldChallenge from './Main/Challenges/GoldChallenge'
/* Main App */
import TabIcon from './Main/Common/TabIcon'
import CreateEventModal from './Main/Event/CreateEventModal'
// Event
import Event from './Main/Event/Event'
// Explore Tab
import Explore from './Main/Explore/Explore'
import CreateGoalModal from './Main/Goal/CreateGoalModal'
import SeekHelp from './Main/Goal/Common/SeekHelp'
import TrendingGoalView from './Main/Goal/NewGoal/TrendingGoalView'
import GoalDetailCard from './Main/Goal/GoalDetailCard/GoalDetailCardV3'
// Home Tab
import Home from './Main/Home/Home'
// import MeetTab from './Main/MeetTab/MeetTabV2';
import DiscoverTabView from './Main/MeetTab/V2/DiscoverTab/DiscoverTabView'
import FriendInvitationView from './Main/MeetTab/V2/FriendInvitationView'
// Meet
import FriendTabView from './Main/MeetTab/V2/FriendTab/FriendTabView'
import RequestTabView from './Main/MeetTab/V2/RequestTab/RequestTabView'
import MyEvent from './Main/Menu/Event/MyEvent'
import ContactInvitePage from './Main/MeetTab/Contacts/ContactInvitePage'
// Friend tab
import MeetTab from './Main/MeetTab/FriendTab'
// Menu
import MyEventTab from './Main/Menu/Event/MyEventTab'
import Menu from './Main/Menu/Menu'
import MyTribe from './Main/Menu/Tribe/MyTribe'
import MyTribeTab from './Main/Menu/Tribe/MyTribeTab'
import MyTribeDescription from './Main/Menu/Tribe/MyTribeDescription'
import MyTribeMembers from './Main/Menu/Tribe/MyTribeMembers'
import NotificationNeedListView from './Main/Notification/Need/NotificationNeedListView'
import NotificationListView from './Main/Notification/Notification/NotificationListView'
// Notification
import NotificationTab from './Main/Notification/NotificationTab'
import PostDetailCard from './Main/Post/PostDetailCard/PostDetailCard'
import ShareDetailCard from './Main/Post/ShareDetailCard/ShareDetailCard'
// Lightbox form
import ShareModal from './Main/Post/ShareModal'
import MutualFriends from './Main/Profile/MutualFriends'
// ProfileForm
import ProfileDetailEditForm from './Main/Profile/ProfileCard/ProfileDetailEditForm'
import ProfileDetail from './Main/Profile/ProfileDetail'
// Profile
import Profile from './Main/Profile/ProfileV2'
import ReportModal from './Main/Report/ReportModal'
import EventSearchOverlay from './Main/Search/EventSearchOverlay'
import PeopleSearchOverlay from './Main/Search/PeopleSearchOverlay'
import SearchOverlay from './Main/Search/SearchOverlay'
import TribeSearchOverlay from './Main/Search/TribeSearchOverlay'
import AddPhoneNumberForm from './Main/Setting/Account/AddPhoneNumberForm'
import FriendsBlocked from './Main/Setting/Account/Blocking/FriendsBlocked'
import EditEmailForm from './Main/Setting/Account/EditEmailForm'
import EditPasswordForm from './Main/Setting/Account/EditPasswordForm'
import EditPhoneNumberForm from './Main/Setting/Account/EditPhoneNumberForm'
import Email from './Main/Setting/Account/Email'
import NotificationSetting from './Main/Setting/Account/NotificationSetting'
import Phone from './Main/Setting/Account/Phone'
import FriendsSetting from './Main/Setting/Privacy/FriendsSetting'
import Privacy from './Main/Setting/Privacy/Privacy'
// Account
import Setting from './Main/Setting/Setting'
import CreateTribeModal from './Main/Tribe/CreateTribeModal'
import AddProfilePic from './Registration/AddProfilePic'
import Contacts from './Registration/Contacts'
import ContactSync from './Registration/ContactSync'
import IntroForm from './Registration/IntroForm'
import SendContactMessage from './Main/MeetTab/Modal/SendContactMessage'
/* Registration */
// import RegistrationAccount from './Registration/Account';
// import RegistrationAccount from './Registration/RegistrationAccount';
import {
    RegistrationAccount,
    OnboardingIntroTransition,
    OnboardingSelectionTarget,
    OnboardingTribeSelection,
    OnboardingCommunity,
    OnboardingSyncContact,
    OnboardingWelcome,
    SyncContactInvite,
    OnboardingAddPhotos,
    OnboardingFbPlugin,
    OnboardingPeopleKnow,
    UserAgreement,
} from './Main/Onboarding'
// import CardStackStyleInterpolator from "react-navigation-stack/src/views/StackView/StackViewStyleInterpolator";
/* Auth */
import SplashScreen from './SplashScreen'
import Tutorial from './Tutorial/Tutorial'
import MultiUserInvitePage from './Main/Common/MultiUserInvitePage'
import TribeHub from './Main/Explore/TribeHub'
import MyTribeGoalShare from './Main/Menu/Tribe/MyTribeGoalShare'
import MyTribeInviteFriends from './Main/Menu/Tribe/MyTribeInviteFriends'
import MainProfile from './Main/Profile/MainProfile'
import ReplyThread from './Main/Goal/GoalDetailCard/Comment/ReplyThread'
import TribeDiscover from './Main/Tribe/TribeDiscover'
import EditInviteCodeForm from './Main/Setting/Account/EditInviteCodeForm'
import Challenges from './Main/Challenges/Challenges'
import OnboardingInviteCode from './Main/Onboarding/OnboardingInviteCode'
import OnboardingWaitlist from './Main/Onboarding/OnboardingWaitlist'
import OnboardingPhoneVerification from './Main/Onboarding/OnboardingPhoneVerification'
import OnboardingComfirmPhone from './Main/Onboarding/OnboardingComfirmPhone'
import ConversationGoal from './Main/Goal/NewGoal/ConversationGoal'
import { EVENT as E, track } from './monitoring/segment'
import SendFeedback from './Main/Menu/SendFeedback'
import MultipleImagePicker from './Main/Menu/MutlipleImagePicker'
import InviteFriendScreen from './Main/MeetTab/Modal/InviteFriendScreen'
import AccountabilityBuddies from './Main/Accountability/AccountabilityBuddies'
import HoldingMe from './Main/Accountability/HoldingMe'
import HoldingAccountable from './Main/Accountability/HoldingAccountable'
import PatriciaModal from './Main/Accountability/PatriciaModal'
import TimePickers from './Main/Accountability/TimePickers'
import CalenderModel from './Main/Accountability/CalenderModel'
import SeekTribe from './Main/Goal/Common/SeekTribe'
import seekHelpFriendList from './Main/Goal/Common/seekHelpFriendList'
// tab is one of {'home', 'profileTab', 'notificationTab', 'exploreTab', 'chatTab'}
function getCommonScenes(tab) {
    let prefix = `${tab}_`
    if (tab === 'home') {
        prefix = ''
    }
    return [
        <Scene
            key={`${prefix}ContactMessage`}
            component={SendContactMessage}
        />,

        <Scene key={`${prefix}ImagePicker`} component={MultipleImagePicker} />,
        <Scene key={`${prefix}sendFeedback`} component={SendFeedback} />,
        <Scene key={`${prefix}goal`} component={GoalDetailCard} />,
        <Scene key={`${prefix}post`} component={PostDetailCard} />,
        <Scene key={`${prefix}share`} component={ShareDetailCard} />,
        <Scene key={`${prefix}replyThread`} component={ReplyThread} />,
        <Scene key={`${prefix}profile`} component={Profile} />,
        <Scene key={`${prefix}profileDetail`} component={ProfileDetail} />,
        <Scene key={`${prefix}myEventTab`} component={MyEventTab} />,
        <Scene key={`${prefix}myEventDetail`} component={MyEvent} />,
        <Scene key={`${prefix}myTribeTab`} component={MyTribeTab} />,
        <Scene key={`${prefix}myTribeDetail`} component={MyTribe} />,

        <Scene key={`${prefix}challenges`} component={Challenges} />,
        <Scene key={`${prefix}setting`} component={Setting} />,
        <Scene key={`${prefix}email`} component={Email} />,
        <Scene key={`${prefix}editEmailForm`} component={EditEmailForm} />,
        <Scene
            key={`${prefix}editInviteCodeForm`}
            component={EditInviteCodeForm}
        />,
        <Scene
            key={`${prefix}editPasswordForm`}
            component={EditPasswordForm}
        />,
        <Scene
            key={`${prefix}phone`}
            component={Phone}
            path="/phone/verification"
        />,
        <Scene
            key={`${prefix}addPhoneNumberForm`}
            component={AddPhoneNumberForm}
        />,
        <Scene
            key={`${prefix}editPhoneNumberForm`}
            component={EditPhoneNumberForm}
        />,
        <Scene key={`${prefix}friendsBlocked`} component={FriendsBlocked} />,
        <Scene key={`${prefix}privacy`} component={Privacy} />,
        <Scene key={`${prefix}friendsSetting`} component={FriendsSetting} />,
        <Scene
            key={`${prefix}chatRoomPublicView`}
            component={ChatRoomPubicView}
        />,
        <Scene
            key={`${prefix}notification_setting`}
            component={NotificationSetting}
        />,

        <Scene key={`${prefix}searchLightBox`} component={SearchOverlay} />,

        <Scene key={`${prefix}meet`} component={MeetTab} />,
        <Scene key={`${prefix}shareMeetTab`} component={ShareDetailCard} />,
        <Scene key={`${prefix}friendTabView`} component={FriendTabView} />,
        <Scene key={`${prefix}requestTabView`} component={RequestTabView} />,
        <Scene key={`${prefix}discoverTabView`} component={DiscoverTabView} />,
        <Scene
            key={`${prefix}friendInvitationView`}
            component={FriendInvitationView}
        />,
        <Scene key="myTribeMembers" component={MyTribeMembers} />,
        <Scene key="member" component={AccountabilityBuddies} />,
        <Scene key="holding" component={HoldingMe} />,
        <Scene key="holdingAccountable" component={HoldingAccountable} />,
        // <Scene key="time" component={TimePickers} />,
        <Scene key="time" component={CalenderModel} />,
    ]
}

class RouterComponent extends Component {
    onTabPress = (all) => {
        const { state, isFocused } = all.navigation

        switch (state.key) {
            case 'homeTab':
                track(E.BOTTOM_HOME_CLICKED)
                break
            case 'exploreTab':
                track(E.BOTTOM_TRIBE_CLICKED)
                break
            case 'profileTab':
                track(E.BOTTOM_PROFILE_CLICKED)
                break
            case 'notificationTab':
                track(E.BOTTOM_NOTIFICATION_CLICKED)
                break
            case 'chatTab':
                track(E.BOTTOM_CHAT_CLICKED)
                break
            default:
                return null
        }

        // Back to initial for homeTab
        if (state.key === 'homeTab' && isFocused() && state.routes.length > 1) {
            return Actions.popTo('home'), track(EVENT.BOTTOM_HOME_CLICKED, {})
        }

        // Back to initial for exploreTab
        if (
            state.key === 'exploreTab' &&
            isFocused() &&
            state.routes.length > 1
        ) {
            return Actions.popTo('tribeHub')
        }

        // Back to initial for friendTab
        if (
            state.key === 'profileTab' &&
            isFocused() &&
            state.routes.length > 1
        ) {
            return Actions.popTo('mainProfile')
        }

        // Back to initial for notificationTab
        if (
            state.key === 'notificationTab' &&
            isFocused() &&
            state.routes.length > 1
        ) {
            return Actions.popTo('notification')
        }

        // Back to initial for chatTab
        if (state.key === 'chatTab' && isFocused() && state.routes.length > 1) {
            return Actions.popTo('chat')
        }

        if (state.key === 'notificationTab') {
            if (Actions.refs.notification !== undefined) {
                Actions.refs.notification.getWrappedInstance().handleRefresh()
            }
        }

        if (state.key === 'homeTab' && isFocused()) {
            if (Actions.refs.home !== undefined) {
                // console.log(
                //     'THIS IS HAPPENINGGG 1',
                //     Actions.refs.home.getWrappedInstance().props.getToastsData()
                // )
                Actions.refs.home
                    .getWrappedInstance()
                    .props.refreshActivityFeed()
                Actions.refs.home
                    .getWrappedInstance()
                    .innerComponent.scrollToTop()
            }
        }

        if (state.key === 'exploreTab' && isFocused()) {
            if (Actions.refs.tribeHub !== undefined) {
                Actions.refs.tribeHub.getWrappedInstance().scrollToTop()
            }
        }
        return Actions[state.key].call()
    }

    reducerCreate(params) {
        const defaultReducer = Reducer(params)
        return (state, action) => {
            // console.log('reducer: ACTION: ', action);
            this.props.dispatch(action)
            return defaultReducer(state, action)
        }
    }

    stateHandler = (prevState, newState, action) => {
        if (action && action.routeName) {
            // trackViewScreen(action.routeName)
        }
        // console.log('newState is: ', newState);
    }
    rootTransitionConfig = () => {
        // we're just doing a regular horizontal slide for now
        return {
            transitionSpec: {
                duration: 750,
                easing: Easing.out(Easing.poly(4)),
                timing: Animated.timing,
            },

            screenInterpolator: (sceneProps) => {
                const { layout, position, scene, index, scenes } = sceneProps

                const thisSceneIndex = scene.index
                const toIndex = index
                const lastSceneIndex = scenes[scenes.length - 1].index
                const width = layout.initWidth

                const translateX = position.interpolate({
                    inputRange: [thisSceneIndex - 1, thisSceneIndex],
                    outputRange: [width, 0],
                })
                const fadeOut = position.interpolate({
                    inputRange: [thisSceneIndex, thisSceneIndex + 1],
                    outputRange: [1, 0.5],
                })

                // if we're going back several screens
                if (lastSceneIndex - toIndex > 1) {
                    // if it's the base scene or topmost, animate it sliding
                    if (
                        thisSceneIndex == toIndex ||
                        thisSceneIndex == lastSceneIndex
                    ) {
                        return {
                            transform: [{ translateX }],
                        }
                    } else {
                        // hide all screens in between
                        return { opacity: 0 }
                    }
                }

                return {
                    transform: [{ translateX }],
                    opacity: scene.isActive ? 1 : fadeOut,
                }
            },
        }
    }

    render() {
        return (
            <Router
                createReducer={this.reducerCreate.bind(this)}
                onStateChange={this.stateHandler.bind(this)}
                sceneStyle={{
                    shadowColor: 'transparent',
                    shadowOpacity: 0,
                    shadowRadius: 0,
                    elevation: 0,
                }}
                {...this.props}
                uriPrefix={'https://web.goalmogul.com'}
            >
                <Modal key="modal" hideNavBar>
                    <Lightbox key="lightbox" hideNavBar>
                        <Stack
                            key="root"
                            hideNavBars
                            transitionConfig={
                                this.rootTransitionConfig().screenInterpolator
                            }
                        >
                            <Stack key="auth" initial hideNavBar>
                                <Scene
                                    key="splash"
                                    component={SplashScreen}
                                    initial
                                />
                                <Scene key="login" component={LoginPage} />
                                <Scene
                                    key="registrationAccount"
                                    component={RegistrationAccount}
                                />
                                <Scene
                                    key="user_agreement"
                                    component={UserAgreement}
                                />
                            </Stack>

                            {/** V1 implementation for registration process */}
                            {/* <Stack
                                key="registration"
                                hideNavBar
                                type={ActionConst.RESET}
                            >
                                <Scene
                                    key="registrationProfile"
                                    component={AddProfilePic}
                                    initial
                                />
                                <Scene
                                    key="registrationIntro"
                                    component={IntroForm}
                                />
                                <Scene
                                    key="registrationContact"
                                    component={Contacts}
                                />
                                <Scene
                                    key="registrationContactSync"
                                    component={ContactSync}
                                />
                            </Stack> */}
                            <Stack
                                key="registration"
                                hideNavBar
                                type={ActionConst.RESET}
                                drawerLockMode="locked-closed"
                                gesturesEnabled={false}
                                panHandlers={null}
                            >
                                <Scene
                                    initial
                                    key="registration_enter_phone"
                                    component={OnboardingPhoneVerification}
                                />
                                <Scene
                                    key="registration_verify_phone"
                                    component={OnboardingComfirmPhone}
                                />
                                <Scene
                                    key="registration_add_photo"
                                    component={OnboardingAddPhotos}
                                />
                                <Scene
                                    key="registration_people_know"
                                    component={OnboardingPeopleKnow}
                                />
                                <Scene
                                    key="registration_contact_sync"
                                    component={OnboardingSyncContact}
                                />
                                <Scene
                                    key="registration_contact_invite"
                                    component={SyncContactInvite}
                                />

                                {/* <Scene
                                    key="registration_transition"
                                    component={OnboardingIntroTransition}
                                />
                                <Scene
                                    key="registration_target_selection"
                                    component={OnboardingSelectionTarget}
                                /> */}
                                {/* <Scene
                                    key="registration_tribe_selection"
                                    component={OnboardingTribeSelection}
                                /> */}
                                <Scene
                                    key="registration_community_guideline"
                                    component={OnboardingCommunity}
                                />

                                <Scene
                                    key="registration_welcome"
                                    component={OnboardingWelcome}
                                />
                            </Stack>

                            <Stack
                                key="waitlist"
                                hideNavBar
                                type={ActionConst.RESET}
                                drawerLockMode="locked-closed"
                                gesturesEnabled={false}
                                panHandlers={null}
                            >
                                <Scene
                                    initial
                                    key="OnBoardingWaitlist"
                                    component={OnboardingInviteCode}
                                />
                                <Scene
                                    key="OnBoardingWaitlistNoCode"
                                    component={OnboardingWaitlist}
                                />
                            </Stack>

                            <Stack
                                key="contacts"
                                hideNavBar
                                type={ActionConst.RESET}
                                drawerLockMode="locked-closed"
                                gesturesEnabled={false}
                                panHandlers={null}
                            >
                                <Scene
                                    initial
                                    key="registration_contact_sync"
                                    component={OnboardingSyncContact}
                                />
                                <Scene
                                    key="registration_contact_invite"
                                    component={SyncContactInvite}
                                />
                            </Stack>
                            <Stack
                                key="questions"
                                hideNavBar
                                type={ActionConst.RESET}
                                drawerLockMode="locked-closed"
                                gesturesEnabled={false}
                                panHandlers={null}
                            >
                                <Scene
                                    key="registration_transition"
                                    component={OnboardingIntroTransition}
                                />
                                <Scene
                                    key="registration_target_selection"
                                    component={OnboardingSelectionTarget}
                                />
                            </Stack>

                            <Stack
                                key="no_goal_conversation"
                                hideNavBar
                                type={ActionConst.RESET}
                                drawerLockMode="locked-closed"
                                gesturesEnabled={false}
                                panHandlers={null}
                            >
                                <Scene
                                    key="no_goal_conversation"
                                    component={ConversationGoal}
                                />
                            </Stack>
                            <Scene
                                key="tutorial"
                                component={Tutorial}
                                hideNavBar
                            />
                            <Drawer
                                drawerType="push-screen"
                                hideNavBar
                                key="drawer"
                                drawerPosition="right"
                                contentComponent={Menu}
                                drawerWidth={290}
                                type={ActionConst.REPLACE}
                            >
                                <Scene
                                    key="main"
                                    hideNavBar
                                    drawerLockMode="unlocked"
                                >
                                    <Tabs
                                        key="mainTabs"
                                        routeName="mainTabs"
                                        hideNavBar
                                        swipeEnabled={false}
                                        tabBarStyle={styles.tabBarStyle}
                                        tabs
                                        showLabel={false}
                                        tabBarOnPress={this.onTabPress}
                                        lazy
                                    >
                                        <Stack
                                            key="homeTab"
                                            initial
                                            icon={TabIcon}
                                            hideNavBar
                                            transitionConfig={() => ({
                                                screenInterpolator: (props) => {
                                                    const { scene } = props
                                                    switch (
                                                        scene.route.routeName
                                                    ) {
                                                        /* case yourKeyScene:
                                                        return theAnimationYouWant(props)*/
                                                        case 'home':
                                                            return this.rootTransitionConfig().screenInterpolator(
                                                                props
                                                            )
                                                        case 'searchLightBox':
                                                            return this.rootTransitionConfig().screenInterpolator(
                                                                props
                                                            )
                                                        default:
                                                            return this.rootTransitionConfig().screenInterpolator(
                                                                props
                                                            )
                                                    }
                                                },
                                            })}
                                        >
                                            <Scene
                                                key="home"
                                                initial
                                                component={Home}
                                            />

                                            {getCommonScenes('home')}
                                        </Stack>

                                        <Stack
                                            key="exploreTab"
                                            icon={TabIcon}
                                            hideNavBar
                                            transitionConfig={() => ({
                                                screenInterpolator: (props) => {
                                                    const { scene } = props
                                                    switch (
                                                        scene.route.routeName
                                                    ) {
                                                        /* case yourKeyScene:
                                                        return theAnimationYouWant(props)*/
                                                        case 'tribeHub':
                                                            return this.rootTransitionConfig().screenInterpolator(
                                                                props
                                                            )
                                                        case 'exploreTab_searchLightBox':
                                                            return this.rootTransitionConfig().screenInterpolator(
                                                                props
                                                            )
                                                        default:
                                                            return this.rootTransitionConfig().screenInterpolator(
                                                                props
                                                            )
                                                    }
                                                },
                                            })}
                                        >
                                            <Scene
                                                key="tribeHub"
                                                component={TribeHub}
                                                initial
                                                path={'/tribehub/:funnel'}
                                            />
                                            <Scene
                                                key="explore"
                                                component={Explore}
                                            />
                                            <Scene
                                                key="eventDetail"
                                                component={Event}
                                            />
                                            <Scene
                                                key="postExploreTab"
                                                component={PostDetailCard}
                                            />
                                            <Scene
                                                key="goalExploreTab"
                                                component={GoalDetailCard}
                                            />
                                            <Scene
                                                key="shareExploreTab"
                                                component={ShareDetailCard}
                                            />
                                            <Scene
                                                key="tribeDiscover"
                                                component={TribeDiscover}
                                            />
                                            {getCommonScenes('exploreTab')}
                                        </Stack>

                                        <Stack
                                            key="profileTab"
                                            icon={TabIcon}
                                            hideNavBar
                                            transitionConfig={() => ({
                                                screenInterpolator: (props) => {
                                                    const { scene } = props
                                                    switch (
                                                        scene.route.routeName
                                                    ) {
                                                        /* case yourKeyScene:
                                                        return theAnimationYouWant(props)*/
                                                        case 'mainProfile':
                                                            return this.rootTransitionConfig().screenInterpolator(
                                                                props
                                                            )
                                                        case 'profileTab_searchLightBox':
                                                            return this.rootTransitionConfig().screenInterpolator(
                                                                props
                                                            )
                                                        default:
                                                            return this.rootTransitionConfig().screenInterpolator(
                                                                props
                                                            )
                                                    }
                                                },
                                            })}
                                        >
                                            <Scene
                                                key={`mainProfile`}
                                                component={MainProfile}
                                                path={'/profile/:funnel'}
                                                initial
                                            />
                                            {getCommonScenes('profileTab')}
                                        </Stack>

                                        <Stack
                                            key="notificationTab"
                                            icon={TabIcon}
                                            hideNavBar
                                            transitionConfig={() => ({
                                                screenInterpolator: (props) => {
                                                    const { scene } = props
                                                    switch (
                                                        scene.route.routeName
                                                    ) {
                                                        /* case yourKeyScene:
                                                        return theAnimationYouWant(props)*/
                                                        case 'notification':
                                                            return this.rootTransitionConfig().screenInterpolator(
                                                                props
                                                            )
                                                        case 'notificationTab_searchLightBox':
                                                            return this.rootTransitionConfig().screenInterpolator(
                                                                props
                                                            )
                                                        default:
                                                            return this.rootTransitionConfig().screenInterpolator(
                                                                props
                                                            )
                                                    }
                                                },
                                            })}
                                        >
                                            <Scene
                                                key="notification"
                                                component={NotificationTab}
                                                path={'/notifications'}
                                                hideNavBar
                                                onEnter={() => {
                                                    if (
                                                        Actions.refs
                                                            .notification !==
                                                        undefined
                                                    ) {
                                                        // Actions.refs.notification.getWrappedInstance().refreshNotification();
                                                    }
                                                }}
                                            />
                                            <Scene
                                                key="notificationList"
                                                component={NotificationListView}
                                                hideNavBar
                                            />
                                            <Scene
                                                key="notificationNeedList"
                                                component={
                                                    NotificationNeedListView
                                                }
                                                hideNavBar
                                            />
                                            {getCommonScenes('notificationTab')}
                                        </Stack>

                                        <Stack
                                            key="chatTab"
                                            icon={TabIcon}
                                            hideNavBar
                                            transitionConfig={() => ({
                                                screenInterpolator: (props) => {
                                                    const { scene } = props
                                                    switch (
                                                        scene.route.routeName
                                                    ) {
                                                        /* case yourKeyScene:
                                                        return theAnimationYouWant(props)*/
                                                        case 'chat':
                                                            return this.rootTransitionConfig().screenInterpolator(
                                                                props
                                                            )
                                                        case 'chatTab_searchLightBox':
                                                            return this.rootTransitionConfig().screenInterpolator(
                                                                props
                                                            )
                                                        default:
                                                            return this.rootTransitionConfig().screenInterpolator(
                                                                props
                                                            )
                                                    }
                                                },
                                            })}
                                        >
                                            <Scene
                                                key="chat"
                                                component={Chat}
                                                path={'/chat/:funnel'}
                                                initial
                                            />
                                            <Scene
                                                key="chatRoomConversation"
                                                component={ChatRoomConversation}
                                            />
                                            <Scene
                                                key="chatRoomOptions"
                                                component={ChatRoomOptions}
                                            />
                                            <Scene
                                                key="chatRoomMembers"
                                                component={ChatRoomMembers}
                                            />
                                            <Scene
                                                key="chatRoomMessageSearch"
                                                component={
                                                    ChatRoomMessageSearch
                                                }
                                            />
                                            <Scene
                                                key="chatMessageSnapshotModal"
                                                component={
                                                    ChatMessageSnapshotModal
                                                }
                                            />
                                            {getCommonScenes('chatTab')}
                                        </Stack>
                                    </Tabs>
                                </Scene>
                            </Drawer>
                        </Stack>
                        {/*
                        This model is deprecated. Using ImagePickerIOS instead.
                        Could potential later be used in Android.
                        <Scene key="photolib" component={CameraRollModal} />
                        */}
                        <Scene
                            key="createGoalButtonOverlay"
                            component={CreateGoalButtonOverlay}
                            hideNavBar
                        />
                        <Scene
                            key="createButtonOverlay"
                            component={CreateButtonOverlay}
                            hideNavBar
                        />
                    </Lightbox>
                    <Scene key="myTutorial" component={Tutorial} hideNavBar />
                    <Scene
                        key="profileDetailEditForm"
                        component={ProfileDetailEditForm}
                        hideNavBar
                    />
                    <Scene
                        path={'/creategoal/:funnel'}
                        key="createGoalModal"
                        component={CreateGoalModal}
                        hideNavBar
                    />
                    <Scene
                        path={'/seekhelp'}
                        key="seekhelp"
                        component={SeekHelp}
                        hideNavBar
                    />
                    <Scene
                        path={'/seektribe'}
                        key="seekTribe"
                        component={SeekTribe}
                        hideNavBar
                    />
                    <Scene
                        path={'/seekHelpFriendList'}
                        key="seekHelpFriendList"
                        component={seekHelpFriendList}
                        hideNavBar
                    />

                    <Scene
                        path={'/trendinggoal/:funnel'}
                        key="trendingGoalView"
                        component={TrendingGoalView}
                        hideNavBar
                    />
                    <Scene
                        path={'/silverchallenge/:funnel'}
                        key="silverchallenge"
                        component={SilverChallenge}
                        hideNavBar
                    />
                    <Scene
                        path={'/goldchallenge/:funnel'}
                        key="goldchallenge"
                        component={GoldChallenge}
                        hideNavBar
                    />

                    <Scene
                        key="invitefriend"
                        component={InviteFriendScreen}
                        hideNavBar
                        path={'/invitefriend/:funnel'}
                    />
                    <Scene
                        key={'ContactMessageScreen'}
                        component={SendContactMessage}
                    />
                    <Stack key="createChatRoomStack" hideNavBar>
                        <Scene
                            key="createChatRoomModal"
                            component={CreateChatRoomModal}
                            initial
                            hideNavBar
                        />
                    </Stack>
                    <Stack key="createTribeStack" hideNavBar>
                        <Scene
                            key="createTribeModal"
                            component={CreateTribeModal}
                            initial
                            hideNavBar
                        />
                    </Stack>

                    <Stack key="createEventStack" hideNavBar>
                        <Scene
                            key="createEventModal"
                            component={CreateEventModal}
                            initial
                            hideNavBar
                        />
                    </Stack>

                    <Stack key="createReportStack" hideNavBar>
                        <Scene
                            key="createReport"
                            component={ReportModal}
                            intial
                            hideNavBar
                        />
                    </Stack>

                    <Scene key="shareModal" component={ShareModal} hideNavBar />
                    <Scene
                        key="searchEventLightBox"
                        component={EventSearchOverlay}
                        hideNavBar
                    />
                    <Scene
                        key="searchTribeLightBox"
                        component={TribeSearchOverlay}
                        hideNavBar
                    />
                    <Scene
                        key="searchPeopleLightBox"
                        component={PeopleSearchOverlay}
                        hideNavBar
                    />
                    <Scene
                        key="shareToChatLightBox"
                        component={ShareToChatModal}
                        hideNavBar
                    />
                    <Scene
                        key="multiSearchPeopleLightBox"
                        component={MultiUserInvitePage}
                        hideNavBar
                    />
                    <Scene
                        key="myTribeGoalShareView"
                        component={MyTribeGoalShare}
                        hideNavBar
                    />
                    <Scene
                        key="myTribeGoalInviteFriends"
                        component={MyTribeInviteFriends}
                        hideNavBar
                    />
                    <Scene
                        key="myTribeDescriptionLightBox"
                        component={MyTribeDescription}
                    />
                    <Scene key="mutualFriends" component={MutualFriends} />
                    <Scene
                        key="meetContactSync"
                        component={ContactSync}
                        hideNavBar
                    />
                </Modal>
            </Router>
        )
    }
}

const styles = {
    tabBarStyle: {
        backgroundColor: 'white',
        borderTopColor: 'transparent',
        shadowColor: 'lightgray',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 3,
        elevation: 1,
    },
}

export default connect()(RouterComponent)
