import React, { Component } from 'react';
import {
  Scene,
  Router,
  Stack,
  Tabs,
  Modal,
  Reducer,
  Actions
} from 'react-native-router-flux';
import { connect } from 'react-redux';
import Expo from 'expo';
import { Linking } from 'react-native';

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
import Home from './Main/Home/Home';

// Profile
import Profile from './Main/Profile/Profile';
import ProfileDetail from './Main/Profile/ProfileDetail';
// ProfileForm
import ProfileDetailEditForm from './Main/Profile/ProfileCard/ProfileDetailEditForm';

// Account
import Setting from './Main/Setting/Setting';
import Email from './Main/Setting/Account/Email';
import EditEmailForm from './Main/Setting/Account/EditEmailForm';
import Phone from './Main/Setting/Account/Phone';
import AddPhoneNumberForm from './Main/Setting/Account/AddPhoneNumberForm';
import EditPhoneNumberForm from './Main/Setting/Account/EditPhoneNumberForm';
import EditPasswordForm from './Main/Setting/Account/EditPasswordForm';
import Privacy from './Main/Setting/Privacy/Privacy';
import FriendsSetting from './Main/Setting/Privacy/FriendsSetting';

class RouterComponent extends Component {

  reducerCreate(params) {
    const defaultReducer = Reducer(params);
    return (state, action) => {
      this.props.dispatch(action);
      return defaultReducer(state, action);
    };
  }

  render() {
    return (
      <Router
        createReducer={this.reducerCreate.bind(this)}
        uriPrefix='exp://100.64.25.239:19000'
      >
        <Modal>
          <Scene key="root" hideNavBar>
            <Scene key="auth" initial hideNavBar>
              <Scene key="splash" component={SplashScreen} initial />
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
                swipeEnabled
                tabBarStyle={styles.tabBarStyle}
                activeTintColor="#324a61"
                inactiveTintColor="#b8c7cc"
                tabs
                showLabel={false}
              >
                <Stack
                  key="homeTab"
                  initial
                  icon={TabIcon}
                  hideNavBar
                >
                  <Scene key="home" component={Home} initial />
                  <Scene key="profile" component={Profile} panHandlers={null} />
                  <Scene key="profileDetail" component={ProfileDetail} panHandlers={null} />
                  <Scene key="setting" component={Setting} />
                  <Scene key="email" component={Email} />
                  <Scene key="editEmailForm" component={EditEmailForm} />
                  <Scene key="editPasswordForm" component={EditPasswordForm} />
                  <Scene key="phone" component={Phone} path='/phone/verification' />
                  <Scene key="addPhoneNumberForm" component={AddPhoneNumberForm} />
                  <Scene key="editPhoneNumberForm" component={EditPhoneNumberForm} />
                  <Scene key="privacy" component={Privacy} />
                  <Scene key="friendsSetting" component={FriendsSetting} />
                </Stack>

                <Stack
                  key="goalTab"
                  icon={TabIcon}
                  hideNavBar
                >
                  <Scene key="goal" component={Home} hideNavBar />
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
                  <Scene key="explore" component={Home} />
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
          <Scene
            key="profileDetailEditForm"
            component={ProfileDetailEditForm}
            hideNavBar
          />

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

  }
};

export default connect()(RouterComponent);
