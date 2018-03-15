import React from 'react';
import { Scene, Router } from 'react-native-router-flux';

/* Auth */
import Login from './Login';

/* Registration */
import Account from './Registration/Account';
import IntroForm from './Registration/IntroForm';
import AddProfilePic from './Registration/AddProfilePic';
import Contacts from './Registration/Contacts';
import ContactSync from './Registration/ContactSync';

const RouterComponent = () => {
  return (
    <Router>
      <Scene key="root" hideNavBar>
        <Scene key="auth" hideNavBar>
          <Scene key="login" component={Login} initial />
        </Scene>

        <Scene key="registration" hideNavBar>
          <Scene key="registrationAccount" component={Account} intial />
          <Scene key="registrationProfile" component={AddProfilePic} />
          <Scene key="registrationIntro" component={IntroForm} />
          <Scene key="registrationContact" component={Contacts} />
          <Scene key="registrationContactSync" component={ContactSync} />
        </Scene>
      </Scene>
    </Router>
  );
};

export default RouterComponent;
