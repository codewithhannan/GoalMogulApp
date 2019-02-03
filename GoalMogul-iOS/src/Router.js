import React, { Component } from 'react';
import {
  Scene,
  Router,
  Stack,
  Tabs,
  Modal,
  Reducer,
  Lightbox,
  Actions,
  Drawer,
  ActionConst
} from 'react-native-router-flux';
import { connect } from 'react-redux';
import { Platform, AppState } from 'react-native';

/* Auth */
import SplashScreen from './SplashScreen';
// import Login from './Login';
import LoginPage from './LoginPage';

import Tutorial from './Tutorial/Tutorial';

/* Registration */
// import RegistrationAccount from './Registration/Account';
import RegistrationAccount from './Registration/RegistrationAccount';
import IntroForm from './Registration/IntroForm';
import AddProfilePic from './Registration/AddProfilePic';
import Contacts from './Registration/Contacts';
import ContactSync from './Registration/ContactSync';

/* Main App */
import TabIcon from './Main/Common/TabIcon';
import MeetTab from './Main/MeetTab/MeetTabV2';
import SearchOverlay from './Main/Search/SearchOverlay';
import EventSearchOverlay from './Main/Search/EventSearchOverlay';
import TribeSearchOverlay from './Main/Search/TribeSearchOverlay';
import PeopleSearchOverlay from './Main/Search/PeopleSearchOverlay';
// import MeetCard from './Main/MeetTab/MeetCard';

// Home Tab
import Home from './Main/Home/Home';
import CreateGoalButtonOverlay from './Main/Common/Button/CreateGoalButtonOverlay';
import CreateButtonOverlay from './Main/Common/Button/CreateButtonOverlay';
import CreateGoalModal from './Main/Goal/CreateGoalModal';
import CreatePostModal from './Main/Post/CreatePostModal';
import GoalDetailCard from './Main/Goal/GoalDetailCard/GoalDetailCardV3';
import PostDetailCard from './Main/Post/PostDetailCard/PostDetailCard';
import ShareDetailCard from './Main/Post/ShareDetailCard/ShareDetailCard';
// Menu
import MyEventTab from './Main/Menu/Event/MyEventTab';
import MyEvent from './Main/Menu/Event/MyEvent';
import CreateEventModal from './Main/Event/CreateEventModal';
import MyTribeTab from './Main/Menu/Tribe/MyTribeTab';
import MyTribe from './Main/Menu/Tribe/MyTribe';
import CreateTribeModal from './Main/Tribe/CreateTribeModal';
import Menu from './Main/Menu/Menu';

// Meet
import FriendTabView from './Main/MeetTab/V2/FriendTab/FriendTabView';
import RequestTabView from './Main/MeetTab/V2/RequestTab/RequestTabView';
import DiscoverTabView from './Main/MeetTab/V2/DiscoverTab/DiscoverTabView';
import FriendInvitationView from './Main/MeetTab/V2/FriendInvitationView';

// Profile
import Profile from './Main/Profile/Profile';
import ProfileDetail from './Main/Profile/ProfileDetail';
// ProfileForm
import ProfileDetailEditForm from './Main/Profile/ProfileCard/ProfileDetailEditForm';
import MutualFriends from './Main/Profile/MutualFriends';

// Explore Tab
import Explore from './Main/Explore/Explore';
// Event
import Event from './Main/Event/Event';

// Tribe
import Tribe from './Main/Tribe/Tribe';

// Notification
import NotificationTab from './Main/Notification/NotificationTab';

// Chat
import ChatTab from './Main/Chat/ChatTab';

// Account
import Setting from './Main/Setting/Setting';
import Email from './Main/Setting/Account/Email';
import EditEmailForm from './Main/Setting/Account/EditEmailForm';
import Phone from './Main/Setting/Account/Phone';
import AddPhoneNumberForm from './Main/Setting/Account/AddPhoneNumberForm';
import EditPhoneNumberForm from './Main/Setting/Account/EditPhoneNumberForm';
import EditPasswordForm from './Main/Setting/Account/EditPasswordForm';
import FriendsBlocked from './Main/Setting/Account/Blocking/FriendsBlocked';
import Privacy from './Main/Setting/Privacy/Privacy';
import FriendsSetting from './Main/Setting/Privacy/FriendsSetting';

// Lightbox form
import ShareModal from './Main/Post/ShareModal';
import ReportModal from './Main/Report/ReportModal';

// Navigation
import { customPanHandlers, iosOnlyPanHandlers } from './redux/modules/navigation';

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

    if (state.key === 'homeTab' && isFocused()) {
      if (Actions.refs.home !== undefined) {
        Actions.refs.home.getWrappedInstance().scrollToTop();
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
    // console.log('onStateChange: ACTION: ', action);
    // console.log('newState is: ', newState);
  }

  render() {
    return (
      <Router
        createReducer={this.reducerCreate.bind(this)}
        onStateChange={this.stateHandler.bind(this)}
      >
        <Modal key="modal" hideNavBar>
          <Lightbox key="lightbox" hideNavBar>
            <Stack key="root" hideNavBars>
              <Stack key="auth" initial hideNavBar>
                <Scene key="splash" component={SplashScreen} initial />
                <Scene key="login" component={LoginPage} />
                <Scene key="tutorial" component={Tutorial} />
              </Stack>

              {/* Registration screen stack*/}
              <Stack key="registration" hideNavBar>
                <Scene
                  key="registrationAccount"
                  component={RegistrationAccount}
                  intial
                />
                <Scene
                  key="registrationProfile"
                  component={AddProfilePic}
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
              </Stack>

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
                    >
                      <Scene key="home" initial component={Home} />
                      <Stack key="myEventTabRoot" hideNavBar>
                        <Scene key="myEventTab" component={MyEventTab} initial />
                        <Scene key="myEventDetail" component={MyEvent} />
                      </Stack>
                      <Stack key="myTribeTabRoot" hideNavBar>
                        <Scene key="myTribeTab" component={MyTribeTab} initial />
                        <Scene key="myTribeDetail" component={MyTribe} />
                      </Stack>
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
                    </Stack>

                    <Stack
                      key="meetTab"
                      icon={TabIcon}
                      hideNavBar
                    >
                      <Scene key="meet" component={MeetTab} hideNavBar initial />
                      <Scene key="shareMeetTab" component={ShareDetailCard} />
                      <Scene key="friendTabView" component={FriendTabView} />
                      <Scene key="requestTabView" component={RequestTabView} />
                      <Scene key="discoverTabView" component={DiscoverTabView} />
                      <Scene key="friendInvitationView" component={FriendInvitationView} />
                    </Stack>

                    <Stack
                      key="notificationTab"
                      icon={TabIcon}
                      hideNavBar
                    >
                      <Scene
                        key="notification"
                        component={NotificationTab}
                        hideNavBar
                      />
                    </Stack>

                    <Stack
                      key="exploreTab"
                      icon={TabIcon}
                      hideNavBar
                    >
                      <Scene key="explore" component={Explore} initial />
                      <Scene key="tribeDetail" component={Tribe} drawerLockMode="locked-closed" />
                      <Scene key="eventDetail" component={Event} drawerLockMode="locked-closed" />
                      <Scene key="postExploreTab" component={PostDetailCard} />
                      <Scene key="goalExploreTab" component={GoalDetailCard} />
                      <Scene key="shareExploreTab" component={ShareDetailCard} />
                    </Stack>

                    <Stack
                      key="chatTab"
                      icon={TabIcon}
                      hideNavBar
                    >
                      <Scene key="chat" component={ChatTab} initial />
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
            <Scene key="searchLightBox" component={SearchOverlay} hideNavBar />
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

export default connect()(RouterComponent);
