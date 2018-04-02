import { Actions } from 'react-native-router-flux';

import {
  REGISTRATION_BACK,
} from './types';

export const openProfile = () => {
  Actions.profile();
};
