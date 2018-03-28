import React from 'react';
import {
  Scene,
  Router,
  Stack,
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
import CameraRollModal from './Registration/CameraRollModal';
import Header from './Registration/Common/Header';

/* Main App */
import Home from './Main/Home/Home';

/* Assets */
import IconHome from './asset/footer/navigation/home.png';
import IconBell from './asset/footer/navigation/bell.png';
import IconGoal from './asset/footer/navigation/goal.png';
import IconChat from './asset/footer/navigation/chat.png';
import IconStar from './asset/footer/navigation/star.png';

const RouterComponent = () => {
  return (
    <Router>
      <Modal>
        <Scene key="root" hideNavBar>
          <Scene key="auth" hideNavBar>
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
          <Scene
            key="main-tabs"
            hideNavBar
            swipeEnabled
            tabBarStyle={styles.tabBarStyle}
            activeTintColor="#324a61"
            inactiveTintColor="#b8c7cc"
            tabs
          >
            <Stack
              key="home-tab"
              initial
              icon={IconHome}
              hideNavBar
            >
              <Scene key="home" component={Home} initial hideNavBar />
            </Stack>

            <Stack
              key="goal-tab"
              icon={IconGoal}
              hideNavBar
            >
              <Scene key="goal" component={Home} hideNavBar />
            </Stack>

            <Stack
              key="notification-tab"
              icon={IconBell}
              hideNavBar
            >
              <Scene key="notification" component={Home} />
            </Stack>

            <Stack
              key="explore-tab"
              icon={IconHome}
              hideNavBar
            >
              <Scene key="explore" component={Home} />
            </Stack>

            <Stack
              key="chat-tab"
              icon={IconHome}
              hideNavBar
            >
              <Scene key="chat" component={Home} />
            </Stack>


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
