import {
  REGISTRATION_ERROR,
  REGISTRATION_BACK,
  REGISTRATION_ACCOUNT,
  REGISTRATION_LOGIN,
  REGISTRATION_ADDPROFILE,
  REGISTRATION_INTRO,
  REGISTRATION_INTRO_SKIP,
  REGISTRATION_CONTACT,
  REGISTRATION_CONTACT_SKIP,
  REGISTRATION_CONTACT_SYNC,

  REGISTRATION_ACCOUNT_FORM_CHANGE,
  REGISTRATION_INTRO_FORM_CHANGE,
  REGISTRATION_ADDPROFILE_CAMERAROLL_OPEN,
  REGISTRATION_ADDPROFILE_CAMERAROLL_PHOTO_CHOOSE
} from '../actions/types';

const INITIAL_STATE = {
  name: '',
  email: '',
  password: '',
  headline: '',
  contacts: [],
  profilePic: null,
  step: '',
  error: {},
  errorMessage: '',
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {

    case REGISTRATION_ERROR:
     return { ...state, error: action.payload };

    // User pressed back button on nav bar
    case REGISTRATION_BACK:
      return { ...state };

    // User pressed login button
    case REGISTRATION_LOGIN:
      return { ...state, ...INITIAL_STATE };

    case REGISTRATION_ACCOUNT:
      return { ...state, step: REGISTRATION_ACCOUNT };

    // Registration account form change
    case REGISTRATION_ACCOUNT_FORM_CHANGE:
      return { ...state, [action.payload.prop]: action.payload.value, error: {}, errorMessage: '' };

    case REGISTRATION_INTRO_FORM_CHANGE:
      return { ...state, headline: action.payload, error: {}, errorMessage: '' };

    // User go to adding profile picture part
    case REGISTRATION_ADDPROFILE:
      return { ...state, step: REGISTRATION_ADDPROFILE };

    case REGISTRATION_ADDPROFILE_CAMERAROLL_OPEN:
      return { ...state, cameraRollModalOpen: true };

    case REGISTRATION_ADDPROFILE_CAMERAROLL_PHOTO_CHOOSE:
      return { ...state, profilePic: action.payload };

    case REGISTRATION_INTRO:
      return { ...state, step: REGISTRATION_INTRO };

    // User skipped profile picture section
    case REGISTRATION_INTRO_SKIP:
      return { ...state, profilePic: null };

    case REGISTRATION_CONTACT:
      return { ...state, step: REGISTRATION_CONTACT };

    case REGISTRATION_CONTACT_SKIP:
      return { ...state, headline: '' };

    case REGISTRATION_CONTACT_SYNC:
      return { ...state, step: REGISTRATION_CONTACT_SYNC };

    default:
      return state;
  }
};
