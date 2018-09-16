import React, { Component } from 'react';
import {
  Scene,
  Router,
  Stack,
  Tabs,
  Modal,
  Reducer,
  Lightbox,
  Actions
} from 'react-native-router-flux';
import { connect } from 'react-redux';

/* Auth */
import SplashScreen from './SplashScreen';
// import Login from './Login';
import LoginPage from './LoginPage';

/* Registration */
// import RegistrationAccount from './Registration/Account';
import RegistrationAccount from './Registration/RegistrationAccount';
import IntroForm from './Registration/IntroForm';
import AddProfilePic from './Registration/AddProfilePic';
import Contacts from './Registration/Contacts';
import ContactSync from './Registration/ContactSync';

/* Main App */
import TabIcon from './Main/Common/TabIcon';
import MeetTab from './Main/MeetTab/MeetTab';
import SearchOverlay from './Main/Search/SearchOverlay';
import EventSearchOverlay from './Main/Search/EventSearchOverlay';
import TribeSearchOverlay from './Main/Search/TribeSearchOverlay';
// import MeetCard from './Main/MeetTab/MeetCard';

// Home Tab
import Home from './Main/Home/Home';
import CreateGoalButtonOverlay from './Main/Common/Button/CreateGoalButtonOverlay';
import CreateGoalModal from './Main/Goal/CreateGoalModal';
import CreatePostModal from './Main/Post/CreatePostModal';
import GoalCard from './Main/Goal/GoalCard/GoalCard'; // For debug purpose
import NeedCard from './Main/Goal/NeedCard/NeedCard'; // For debug purpose
import GoalDetailCard from './Main/Goal/GoalDetailCard/GoalDetailCard2';
import MyEventTab from './Main/Menu/Event/MyEventTab';
import MyTribeTab from './Main/Menu/Tribe/MyTribeTab';

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

class RouterComponent extends Component {

  onTabPress = (all) => {
    const { state, isFocused } = all.navigation;
    if (state.key === 'homeTab' && isFocused() && state.routes.length > 1) {
      return Actions.popTo('home');
    }
    return Actions[state.key].call();
  }

  reducerCreate(params) {
    const defaultReducer = Reducer(params);
    return (state, action) => {
      console.log('reducer: ACTION: ', action);
      this.props.dispatch(action);
      return defaultReducer(state, action);
    };
  }

  stateHandler = (prevState, newState, action) => {
    console.log('onStateChange: ACTION: ', action);
    // console.log('newState is: ', newState);
  }

  render() {
    return (
      <Router
        createReducer={this.reducerCreate.bind(this)}
        onStateChange={this.stateHandler.bind(this)}
      >
        <Modal>
          <Lightbox hideNavBar>
            <Scene key="root" hideNavBar>
              <Scene key="auth" initial hideNavBar>
                <Scene key="splash" component={Explore} initial />
                <Scene key="login" component={LoginPage} />
              </Scene>

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

              <Scene hideNavBar panHandlers={null}>
                <Tabs
                  key="mainTabs"
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
                    <Scene key="home" component={Home} initial />
                    <Stack key="myEventTabRoot" hideNavBar>
                      <Scene key="myEventTab" component={MyEventTab} initial />
                      <Scene key="myEventDetail" component={Event} />
                    </Stack>
                    <Stack key="myTribeTabRoot" hideNavBar>
                      <Scene key="myTribeTab" component={MyTribeTab} initial />
                      <Scene key="myTribeDetail" component={Tribe} />
                    </Stack>
                    <Scene key="goal" component={GoalDetailCard} />
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
                    <Scene key="goal" component={MeetTab} hideNavBar />
                  </Stack>

                  <Stack
                    key="notificationTab"
                    icon={TabIcon}
                    hideNavBar
                  >
                    <Scene key="notification" component={Home} />
                  </Stack>

                  <Stack
                    key="exploreTab"
                    icon={TabIcon}
                    hideNavBar
                  >
                    <Scene key="explore" component={Explore} initial />
                    <Scene key="tribeDetail" component={Tribe} />
                      <Scene key="eventDetail" component={Event} />
                  </Stack>

                  <Stack
                    key="chatTab"
                    icon={TabIcon}
                    hideNavBar
                  >
                    <Scene key="chat" component={Home} />
                  </Stack>

                </Tabs>
              </Scene>

            </Scene>
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
          </Lightbox>
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

          <Scene key="shareModal" component={ShareModal} hideNavBar />
          <Scene key="searchEventLightBox" component={EventSearchOverlay} hideNavBar />
          <Scene key="searchTribeLightBox" component={TribeSearchOverlay} hideNavBar />

          <Scene key="mutualFriends" component={MutualFriends} />
          <Scene key="meetContactSync" component={ContactSync} hideNavBar />
        </Modal>

      </Router>
    );
  }
}

const mapStateToProps = states => {
  return states;
};

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
