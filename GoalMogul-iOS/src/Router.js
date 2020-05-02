import React, { Component } from 'react';
import { Animated, Easing } from 'react-native';
import { ActionConst, Actions, Drawer, Lightbox, Modal, Reducer, Router, Scene, Stack, Tabs } from 'react-native-router-flux';
import { connect } from 'react-redux';
// import Login from './Login';
import LoginPage from './LoginPage';
// Chat
import Chat from './Main/Chat/Chat';
import ChatRoomConversation from './Main/Chat/ChatRoom/ChatRoomConversation';
import ChatRoomMembers from './Main/Chat/ChatRoom/ChatRoomMembers';
import ChatRoomMessageSearch from './Main/Chat/ChatRoom/ChatRoomMessageSearch';
import ChatRoomOptions from './Main/Chat/ChatRoom/ChatRoomOptions';
import ChatRoomPubicView from './Main/Chat/ChatRoom/ChatRoomPublicView';
import ChatMessageSnapshotModal from './Main/Chat/Modals/ChatMessageSnapshotModal';
import CreateChatRoomModal from './Main/Chat/Modals/CreateChatRoomModal';
import ShareToChatModal from './Main/Chat/Modals/ShareToChatModal';
import CreateButtonOverlay from './Main/Common/Button/CreateButtonOverlay';
import CreateGoalButtonOverlay from './Main/Common/Button/CreateGoalButtonOverlay';
/* Main App */
import TabIcon from './Main/Common/TabIcon';
import CreateEventModal from './Main/Event/CreateEventModal';
// Event
import Event from './Main/Event/Event';
// Explore Tab
import Explore from './Main/Explore/Explore';
import CreateGoalModal from './Main/Goal/CreateGoalModal';
import GoalDetailCard from './Main/Goal/GoalDetailCard/GoalDetailCardV3';
// import MeetCard from './Main/MeetTab/MeetCard';
// Home Tab
import Home from './Main/Home/Home';
import MeetTab from './Main/MeetTab/MeetTabV2';
import DiscoverTabView from './Main/MeetTab/V2/DiscoverTab/DiscoverTabView';
import FriendInvitationView from './Main/MeetTab/V2/FriendInvitationView';
// Meet
import FriendTabView from './Main/MeetTab/V2/FriendTab/FriendTabView';
import RequestTabView from './Main/MeetTab/V2/RequestTab/RequestTabView';
import MyEvent from './Main/Menu/Event/MyEvent';
import ContactInvitePage from './Main/MeetTab/Contacts/ContactInvitePage';
// Menu
import MyEventTab from './Main/Menu/Event/MyEventTab';
import Menu from './Main/Menu/Menu';
import MyTribe from './Main/Menu/Tribe/MyTribe';
import MyTribeTab from './Main/Menu/Tribe/MyTribeTab';
import NotificationNeedListView from './Main/Notification/Need/NotificationNeedListView';
import NotificationListView from './Main/Notification/Notification/NotificationListView';
// Notification
import NotificationTab from './Main/Notification/NotificationTab';
import CreatePostModal from './Main/Post/CreatePostModal';
import PostDetailCard from './Main/Post/PostDetailCard/PostDetailCard';
import ShareDetailCard from './Main/Post/ShareDetailCard/ShareDetailCard';
// Lightbox form
import ShareModal from './Main/Post/ShareModal';
import MutualFriends from './Main/Profile/MutualFriends';
// ProfileForm
import ProfileDetailEditForm from './Main/Profile/ProfileCard/ProfileDetailEditForm';
import ProfileDetail from './Main/Profile/ProfileDetail';
// Profile
import Profile from './Main/Profile/ProfileV2';
import ReportModal from './Main/Report/ReportModal';
import EventSearchOverlay from './Main/Search/EventSearchOverlay';
import PeopleSearchOverlay from './Main/Search/PeopleSearchOverlay';
import SearchOverlay from './Main/Search/SearchOverlay';
import TribeSearchOverlay from './Main/Search/TribeSearchOverlay';
import AddPhoneNumberForm from './Main/Setting/Account/AddPhoneNumberForm';
import FriendsBlocked from './Main/Setting/Account/Blocking/FriendsBlocked';
import EditEmailForm from './Main/Setting/Account/EditEmailForm';
import EditPasswordForm from './Main/Setting/Account/EditPasswordForm';
import EditPhoneNumberForm from './Main/Setting/Account/EditPhoneNumberForm';
import Email from './Main/Setting/Account/Email';
import NotificationSetting from './Main/Setting/Account/NotificationSetting';
import Phone from './Main/Setting/Account/Phone';
import FriendsSetting from './Main/Setting/Privacy/FriendsSetting';
import Privacy from './Main/Setting/Privacy/Privacy';
// Account
import Setting from './Main/Setting/Setting';
import CreateTribeModal from './Main/Tribe/CreateTribeModal';
// Tribe
import Tribe from './Main/Tribe/Tribe';
import AddProfilePic from './Registration/AddProfilePic';
import Contacts from './Registration/Contacts';
import ContactSync from './Registration/ContactSync';
import IntroForm from './Registration/IntroForm';
/* Registration */
// import RegistrationAccount from './Registration/Account';
// import RegistrationAccount from './Registration/RegistrationAccount';
import { RegistrationAccount, OnboardingIntroTransition, 
  OnboardingSelectionTarget, OnboardingTribeSelection, 
  OnboardingCommunity, OnboardingSyncContact, OnboardingWelcome,
  SyncContactInvite
} from './Main/Onboarding';
// import CardStackStyleInterpolator from "react-navigation-stack/src/views/StackView/StackViewStyleInterpolator";
/* Auth */
import SplashScreen from './SplashScreen';
import Tutorial from './Tutorial/Tutorial';
import UserInviteModal from './Main/Common/Modal/UserInviteModal';
import { trackViewScreen } from './monitoring/segment';


class RouterComponent extends Component {
  onTabPress = (all) => {
    const { state, isFocused } = all.navigation;

    // Back to initial for homeTab
    if (state.key === 'homeTab' && isFocused() && state.routes.length > 1) {
      return Actions.popTo('home');
    }

    // Back to initial for exploreTab
    if (state.key === 'exploreTab' && isFocused() && state.routes.length > 1) {
      return Actions.popTo('explore');
    }

    // Back to initial for friendTab
    if (state.key === 'meetTab' && isFocused() && state.routes.length > 1) {
      return Actions.popTo('meet');
    }

    // Back to initial for notificationTab
    if (state.key === 'notificationTab' && isFocused() && state.routes.length > 1) {
      return Actions.popTo('notification');
    }

    // Back to initial for chatTab
    if (state.key === 'chatTab' && isFocused() && state.routes.length > 1) {
      return Actions.popTo('chat');
    }

    if (state.key === 'notificationTab') {
      if (Actions.refs.notification !== undefined) {
        Actions.refs.notification.getWrappedInstance().refreshNotification();
      }
    }

    if (state.key === 'homeTab' && isFocused()) {
      if (Actions.refs.home !== undefined) {
        Actions.refs.home.getWrappedInstance().innerComponent.scrollToTop();
      }
    }
    return Actions[state.key].call();
  }

  reducerCreate(params) {
    const defaultReducer = Reducer(params);
    return (state, action) => {
      // console.log('reducer: ACTION: ', action);
      this.props.dispatch(action);
      return defaultReducer(state, action);
    };
  }

  stateHandler = (prevState, newState, action) => {
    if (action && action.routeName) {
      // trackViewScreen(action.routeName);
    }
    // console.log('newState is: ', newState);
  }
  rootTransitionConfig = () => {
    // we're just doing a regular horizontal slide for now
    return {
      transitionSpec: {
        duration: 750,
        easing: Easing.out(Easing.poly(4)),
        timing: Animated.timing
      },
      screenInterpolator: sceneProps => {
        const { layout, position, scene, index, scenes } = sceneProps;

        const thisSceneIndex = scene.index;
        const toIndex = index;
        const lastSceneIndex = scenes[scenes.length - 1].index;
        const width = layout.initWidth;

        const translateX = position.interpolate({
          inputRange: [thisSceneIndex - 1, thisSceneIndex],
          outputRange: [width, 0],
        });
        const fadeOut = position.interpolate({
          inputRange: [thisSceneIndex, thisSceneIndex + 1],
          outputRange: [1, 0.5],
        });
 
        // if we're going back several screens
        if (lastSceneIndex - toIndex > 1) {
          // if it's the base scene or topmost, animate it sliding
          if (thisSceneIndex == toIndex || thisSceneIndex == lastSceneIndex) {
            return {
              transform: [ { translateX } ],
            };
          } else { // hide all screens in between
            return { opacity: 0, };
          };

        };
  
        return {
          transform: [ { translateX } ],
          opacity: scene.isActive ? 1 : fadeOut,
        };
      },
    }
  }

  render() {
    return (
      <Router
        createReducer={this.reducerCreate.bind(this)}
        onStateChange={this.stateHandler.bind(this)}
      >
        <Modal key="modal" hideNavBar>
          <Lightbox key="lightbox" hideNavBar>
            <Stack
              key="root"
              hideNavBars
              transitionConfig={this.rootTransitionConfig().screenInterpolator}
            >
              <Stack key="auth" initial hideNavBar>
                <Scene key="splash" component={SplashScreen} initial />
                <Scene key="login" component={LoginPage} />
                <Scene 
                  key="registrationAccount" 
                  // component={RegistrationAccount}  
                  component={OnboardingSyncContact} 
                />
              </Stack>

              {/** V1 implementation for registration process */}
              {/* <Stack key="registration" hideNavBar type={ActionConst.RESET}>
                <Scene key="registrationProfile" component={AddProfilePic} initial />
                <Scene key="registrationIntro" component={IntroForm} />
                <Scene key="registrationContact" component={Contacts} />
                <Scene key="registrationContactSync" component={ContactSync} />
              </Stack> */}
              <Stack key="registration" hideNavBar type={ActionConst.RESET} drawerLockMode='locked-closed' gesturesEnabled={false} panHandlers={null}>
                <Scene key="registration_transition" component={OnboardingIntroTransition} initial />
                <Scene key="registration_target_selection" component={OnboardingSelectionTarget} />
                <Scene key="registration_tribe_selection" component={OnboardingTribeSelection} />
                <Scene key="registration_community_guideline" component={OnboardingCommunity} />
                <Scene key="registration_contact_sync" component={OnboardingSyncContact} />
                <Scene key="registration_contact_invite" component={SyncContactInvite} />
                <Scene key="registration_welcome" component={OnboardingWelcome} />
              </Stack>
              <Scene key="tutorial" component={Tutorial} hideNavBar />

              {/* Registration screen stack*/}
             {/** 
              <Stack key="registration" hideNavBar>
                
              </Stack>
             */} 

              {/* Main App */}
              <Drawer
                drawerType='push-screen'
                hideNavBar
                key="drawer"
                drawerPosition='right'
                contentComponent={Menu}
                drawerWidth={240}
                type={ActionConst.RESET}
              >
                <Scene key="main" hideNavBar drawerLockMode="locked-closed">
                  <Tabs
                    key="mainTabs"
                    routeName="mainTabs"
                    hideNavBar
                    swipeEnabled={false}
                    tabBarStyle={styles.tabBarStyle}
                    activeTintColor="#4096c6"
                    inactiveTintColor="#dde4e6"
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
                            const { scene } = props;
                            switch (scene.route.routeName) {
                              /* case yourKeyScene:
                              return theAnimationYouWant(props)*/
                              case 'home': 
                                return this.rootTransitionConfig().screenInterpolator(props);
                              case 'searchLightBox':
                                return this.rootTransitionConfig().screenInterpolator(props);
                              default:
                                return this.rootTransitionConfig().screenInterpolator(props);
                            }
                          }
                        })
                      }
                    >
                      <Scene key="home" initial component={Home} />
                      
                      <Scene key="myEventTab" component={MyEventTab} />
                      <Scene key="myEventDetail" component={MyEvent} />
                      
                      
                      <Scene key="myTribeTab" component={MyTribeTab} />
                      <Scene key="myTribeDetail" component={MyTribe} />
                      
                      
                      <Scene key="goal" component={GoalDetailCard} />
                      <Scene key="post" component={PostDetailCard} />
                      <Scene key="share" component={ShareDetailCard} />
                      <Scene key="profile" component={Profile} />
                      <Scene key="profileDetail" component={ProfileDetail} />
                      <Scene key="setting" component={Setting} />
                      <Scene key="email" component={Email} />
                      <Scene key="editEmailForm" component={EditEmailForm} />
                      <Scene key="editPasswordForm" component={EditPasswordForm} />
                      <Scene key="phone" component={Phone} path='/phone/verification' />
                      <Scene key="addPhoneNumberForm" component={AddPhoneNumberForm} />
                      <Scene key="editPhoneNumberForm" component={EditPhoneNumberForm} />
                      <Scene key="friendsBlocked" component={FriendsBlocked} />
                      <Scene key="privacy" component={Privacy} />
                      <Scene key="friendsSetting" component={FriendsSetting} />
                      <Scene key="chatRoomPublicView" component={ChatRoomPubicView} />
                      <Scene key="notification_setting" component={NotificationSetting} />

                      <Scene key="searchLightBox" component={SearchOverlay} />
                    </Stack>

                    <Stack
                      key="meetTab"
                      icon={TabIcon}
                      hideNavBar
                      transitionConfig={() => ({
                          screenInterpolator: (props) => {
                            const { scene } = props;
                            switch (scene.route.routeName) {
                              /* case yourKeyScene:
                              return theAnimationYouWant(props)*/
                              case 'meet': 
                                return this.rootTransitionConfig().screenInterpolator(props);
                              case 'meetTab_searchLightBox':
                                return this.rootTransitionConfig().screenInterpolator(props);
                              default:
                                return this.rootTransitionConfig().screenInterpolator(props);
                            }
                          }
                        })
                      }
                    >
                      <Scene key="meet" component={MeetTab} hideNavBar initial />
                      <Scene key="shareMeetTab" component={ShareDetailCard} />
                      <Scene key="friendTabView" component={FriendTabView} />
                      <Scene key="requestTabView" component={RequestTabView} />
                      <Scene key="discoverTabView" component={DiscoverTabView} />
                      <Scene key="friendInvitationView" component={FriendInvitationView} />

                      <Scene key="meetTab_myEventDetail" component={MyEvent} />
                      <Scene key="meetTab_goal" component={GoalDetailCard} />
                      <Scene key="meetTab_post" component={PostDetailCard} />
                      <Scene key="meetTab_share" component={ShareDetailCard} />
                      <Scene key="meetTab_profile" component={Profile} />
                      <Scene key="meetTab_profileDetail" component={ProfileDetail} />
                      <Scene key="meetTab_setting" component={Setting} />
                      <Scene key="meetTab_email" component={Email} />
                      <Scene key="meetTab_editEmailForm" component={EditEmailForm} />
                      <Scene key="meetTab_editPasswordForm" component={EditPasswordForm} />
                      <Scene key="meetTab_phone" component={Phone} path='/phone/verification' />
                      <Scene key="meetTab_addPhoneNumberForm" component={AddPhoneNumberForm} />
                      <Scene key="meetTab_editPhoneNumberForm" component={EditPhoneNumberForm} />
                      <Scene key="meetTab_friendsBlocked" component={FriendsBlocked} />
                      <Scene key="meetTab_privacy" component={Privacy} />
                      <Scene key="meetTab_friendsSetting" component={FriendsSetting} />
                      <Scene key="meetTab_notification_setting" component={NotificationSetting} />

                      <Scene key="meetTab_myEventTab" component={MyEventTab} />
                      <Scene key="meetTab_myTribeTab" component={MyTribeTab} />

                      <Scene key="meetTab_chatRoomPublicView" component={ChatRoomPubicView} />

                      <Scene key="meetTab_meetContactSync" component={ContactSync} />
                      <Scene key="meetTab_contactInvite" component={ContactInvitePage} />
                      <Scene key="meetTab_searchLightBox" component={SearchOverlay} hideNavBar />
                    </Stack>

                    <Stack
                      key="notificationTab"
                      icon={TabIcon}
                      hideNavBar
                      transitionConfig={() => ({
                          screenInterpolator: (props) => {
                            const { scene } = props;
                            switch (scene.route.routeName) {
                              /* case yourKeyScene:
                              return theAnimationYouWant(props)*/
                              case 'notification': 
                                return this.rootTransitionConfig().screenInterpolator(props);
                              case 'notificationTab_searchLightBox':
                                return this.rootTransitionConfig().screenInterpolator(props);
                              default:
                                return this.rootTransitionConfig().screenInterpolator(props);
                            }
                          }
                        })
                      }
                    >
                      <Scene
                        key="notification"
                        component={NotificationTab}
                        hideNavBar
                        onEnter={() => {
                          if (Actions.refs.notification !== undefined) {
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
                        component={NotificationNeedListView}
                        hideNavBar
                      />

                      <Scene key="notificationTab_myEventDetail" component={MyEvent} />
                      <Scene key="notificationTab_goal" component={GoalDetailCard} />
                      <Scene key="notificationTab_post" component={PostDetailCard} />
                      <Scene key="notificationTab_share" component={ShareDetailCard} />
                      <Scene key="notificationTab_profile" component={Profile} />
                      <Scene key="notificationTab_profileDetail" component={ProfileDetail} />
                      <Scene key="notificationTab_setting" component={Setting} />
                      <Scene key="notificationTab_email" component={Email} />
                      <Scene key="notificationTab_editEmailForm" component={EditEmailForm} />
                      <Scene key="notificationTab_editPasswordForm" component={EditPasswordForm} />
                      <Scene key="notificationTab_phone" component={Phone} path='/phone/verification' />
                      <Scene key="notificationTab_addPhoneNumberForm" component={AddPhoneNumberForm} />
                      <Scene key="notificationTab_editPhoneNumberForm" component={EditPhoneNumberForm} />
                      <Scene key="notificationTab_friendsBlocked" component={FriendsBlocked} />
                      <Scene key="notificationTab_privacy" component={Privacy} />
                      <Scene key="notificationTab_friendsSetting" component={FriendsSetting} />
                      <Scene key="notificationTab_chatRoomPublicView" component={ChatRoomPubicView} />
                      <Scene key="notificationTab_searchLightBox" component={SearchOverlay} hideNavBar />
                      <Scene key="notificationTab_notification_setting" component={NotificationSetting} />

                      <Scene key="notificationTab_myEventTab" component={MyEventTab} />
                      <Scene key="notificationTab_myTribeTab" component={MyTribeTab} />
                    </Stack>

                    <Stack
                      key="exploreTab"
                      icon={TabIcon}
                      hideNavBar
                      transitionConfig={() => ({
                          screenInterpolator: (props) => {
                            const { scene } = props;
                            switch (scene.route.routeName) {
                              /* case yourKeyScene:
                              return theAnimationYouWant(props)*/
                              case 'explore': 
                                return this.rootTransitionConfig().screenInterpolator(props);
                              case 'exploreTab_searchLightBox':
                                return this.rootTransitionConfig().screenInterpolator(props);
                              default:
                                return this.rootTransitionConfig().screenInterpolator(props);
                            }
                          }
                        })
                      }
                    >
                      <Scene key="explore" component={Explore} initial />
                      <Scene key="tribeDetail" component={Tribe} />
                      <Scene key="eventDetail" component={Event} />
                      <Scene key="postExploreTab" component={PostDetailCard} />
                      <Scene key="goalExploreTab" component={GoalDetailCard} />
                      <Scene key="shareExploreTab" component={ShareDetailCard} />
                      
                      <Scene key="exploreTab_chatRoomPublicView" component={ChatRoomPubicView} />
                      <Scene key="exploreTab_myEventDetail" component={MyEvent} />
                      <Scene key="exploreTab_goal" component={GoalDetailCard} />
                      <Scene key="exploreTab_post" component={PostDetailCard} />
                      <Scene key="exploreTab_share" component={ShareDetailCard} />
                      <Scene key="exploreTab_profile" component={Profile} />
                      <Scene key="exploreTab_profileDetail" component={ProfileDetail} />
                      <Scene key="exploreTab_setting" component={Setting} />
                      <Scene key="exploreTab_email" component={Email} />
                      <Scene key="exploreTab_editEmailForm" component={EditEmailForm} />
                      <Scene key="exploreTab_editPasswordForm" component={EditPasswordForm} />
                      <Scene key="exploreTab_phone" component={Phone} path='/phone/verification' />
                      <Scene key="exploreTab_addPhoneNumberForm" component={AddPhoneNumberForm} />
                      <Scene key="exploreTab_editPhoneNumberForm" component={EditPhoneNumberForm} />
                      <Scene key="exploreTab_friendsBlocked" component={FriendsBlocked} />
                      <Scene key="exploreTab_privacy" component={Privacy} />
                      <Scene key="exploreTab_friendsSetting" component={FriendsSetting} />
                      <Scene key="exploreTab_notification_setting" component={NotificationSetting} />

                      <Scene key="exploreTab_friendInvitationView" component={FriendInvitationView} />

                      <Scene key="exploreTab_searchLightBox" component={SearchOverlay} hideNavBar />

                      <Scene key="exploreTab_myEventTab" component={MyEventTab} />
                      <Scene key="exploreTab_myTribeTab" component={MyTribeTab} />
                    </Stack>

                    <Stack
                      key="chatTab"
                      icon={TabIcon}
                      hideNavBar
                      transitionConfig={() => ({
                          screenInterpolator: (props) => {
                            const { scene } = props;
                            switch (scene.route.routeName) {
                              /* case yourKeyScene:
                              return theAnimationYouWant(props)*/
                              case 'chat': 
                                return this.rootTransitionConfig().screenInterpolator(props);
                              case 'chatTab_searchLightBox':
                                return this.rootTransitionConfig().screenInterpolator(props);
                              default:
                                return this.rootTransitionConfig().screenInterpolator(props);
                            }
                          }
                        })
                      }
                    >
                      <Scene key="chat" component={Chat} initial />
                      <Scene key="chatRoomConversation" component={ChatRoomConversation} />
                      <Scene key="chatRoomOptions" component={ChatRoomOptions} />
                      <Scene key="chatRoomMembers" component={ChatRoomMembers} />
                      <Scene key="chatRoomMessageSearch" component={ChatRoomMessageSearch} />
                      <Scene key="chatMessageSnapshotModal" component={ChatMessageSnapshotModal} />
                      <Scene key="chatTab_chatRoomPublicView" component={ChatRoomPubicView} />
                      <Scene key="chatTab_searchLightBox" component={SearchOverlay} />
                      <Scene key="chatTab_myEventDetail" component={MyEvent} />
                      <Scene key="chatTab_goal" component={GoalDetailCard} />
                      <Scene key="chatTab_post" component={PostDetailCard} />
                      <Scene key="chatTab_share" component={ShareDetailCard} />
                      <Scene key="chatTab_profile" component={Profile} />
                      <Scene key="chatTab_profileDetail" component={ProfileDetail} />
                      <Scene key="chatTab_setting" component={Setting} />
                      <Scene key="chatTab_email" component={Email} />
                      <Scene key="chatTab_editEmailForm" component={EditEmailForm} />
                      <Scene key="chatTab_editPasswordForm" component={EditPasswordForm} />
                      <Scene key="chatTab_phone" component={Phone} path='/phone/verification' />
                      <Scene key="chatTab_addPhoneNumberForm" component={AddPhoneNumberForm} />
                      <Scene key="chatTab_editPhoneNumberForm" component={EditPhoneNumberForm} />
                      <Scene key="chatTab_friendsBlocked" component={FriendsBlocked} />
                      <Scene key="chatTab_privacy" component={Privacy} />
                      <Scene key="chatTab_friendsSetting" component={FriendsSetting} />
                      <Scene key="chatTab_notification_setting" component={NotificationSetting} />

                      <Scene key="chatTab_myEventTab" component={MyEventTab} />
                      <Scene key="chatTab_myTribeTab" component={MyTribeTab} />
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
            key="createGoalModal"
            component={CreateGoalModal}
            hideNavBar
          />
          <Scene
            key="createPostModal"
            component={CreatePostModal}
            hideNavBar
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
            <Scene key="createTribeModal" component={CreateTribeModal} initial hideNavBar />
          </Stack>

          <Stack key="createEventStack" hideNavBar>
            <Scene key="createEventModal" component={CreateEventModal} initial hideNavBar />
          </Stack>

          <Stack key="createReportStack" hideNavBar>
            <Scene key="createReport" component={ReportModal} intial hideNavBar />
          </Stack>

          <Scene key="shareModal" component={ShareModal} hideNavBar />
          <Scene key="searchEventLightBox" component={EventSearchOverlay} hideNavBar />
          <Scene key="searchTribeLightBox" component={TribeSearchOverlay} hideNavBar />
          <Scene key="searchPeopleLightBox" component={PeopleSearchOverlay} hideNavBar />
          <Scene key="shareToChatLightBox" component={ShareToChatModal} hideNavBar />
          <Scene key="multiSearchPeopleLightBox" component={UserInviteModal} hideNavBar />

          <Scene key="mutualFriends" component={MutualFriends} />
          <Scene key="meetContactSync" component={ContactSync} hideNavBar />
        </Modal>

      </Router>
    );
  }
}

const styles = {
  navBarStyle: {
    backgroundColor: '#34c0dd',
    borderBottomColor: 'transparent'
  },
  tabBarStyle: {
    backgroundColor: 'white',
    borderTopColor: 'transparent',
    shadowColor: 'lightgray',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 1,
  }
};

// const RouterComponentExplained = copilot({
//   overlay: 'svg', // or 'view'
//   animated: true, // or false
// })(RouterComponent);

export default connect()(RouterComponent);
