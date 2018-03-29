import React from 'react';
import {
  Scene,
  Router,
  Stack,
  Tabs,
  Modal
} from 'react-native-router-flux';

/* Auth */
import Login from './Login';

/* Registration */
import Account from './Registration/Account';
import IntroForm from './Registration/IntroForm';
import AddProfilePic from './Registration/AddProfilePic';
import Contacts from './Registration/Contacts';
import ContactSync from './Registration/ContactSync';

/* Main App */
import TabIcon from './Main/Common/TabIcon';
import Home from './Main/Home/Home';

const RouterComponent = () => {
  return (
    <Router>
      <Modal>
        <Scene key="root" hideNavBar>
          <Scene key="auth" initial hideNavBar>
            <Scene key="login" component={Login} initial />
          </Scene>

          {/* Registration screen stack*/}
          <Stack key="registration" hideNavBar>
            <Scene
              key="registrationAccount"
              component={Account}
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
                <Scene key="home" component={Home} initial hideNavBar />
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

      </Modal>

    </Router>
  );
};

const styles = {
  navBarStyle: {
    backgroundColor: '#34c0dd',
    borderBottomColor: 'transparent'
  },
  tabBarStyle: {

  }
};

export default RouterComponent;
