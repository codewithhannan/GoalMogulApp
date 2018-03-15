import React from 'react';
import { Scene, Router } from 'react-native-router-flux';

/* Auth */
import Login from './Login';

/* Registration */
import Account from './Registration/Account';
import IntroForm from './Registration/IntroForm';
import AddProfilePic from './Registration/AddProfilePic';
import Contacts from './Registration/Contacts';

const RouterComponent = () => {
  return (
    <Router>
      <Scene key="root" hideNavBar>
        <Scene key="auth">
          <Scene key="login" component={Login} title="Please log in" initial />
        </Scene>

        <Scene key="registration">
          <Scene key="registrationAccount" component={Account} intial />
        </Scene>
        <Scene key="registrationIntro" component={AddProfilePic} />
      </Scene>
    </Router>
  );
};

export default RouterComponent;
