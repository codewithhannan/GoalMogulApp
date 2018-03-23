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
  }
};

export default RouterComponent;
