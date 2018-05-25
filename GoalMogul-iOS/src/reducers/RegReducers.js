import _ from 'lodash';
import {
  REGISTRATION_ERROR,
  REGISTRATION_BACK,
  REGISTRATION_ACCOUNT,
  REGISTRATION_ACCOUNT_LOADING,
  REGISTRATION_ACCOUNT_SUCCESS,
  REGISTRATION_LOGIN,
  REGISTRATION_ADDPROFILE,
  REGISTRATION_INTRO,
  REGISTRATION_INTRO_SKIP,
  REGISTRATION_CONTACT,
  REGISTRATION_CONTACT_SKIP,
  REGISTRATION_CONTACT_SYNC,
  REGISTRATION_CONTACT_SYNC_DONE,
  REGISTRATION_CONTACT_SYNC_FETCH,
  REGISTRATION_CONTACT_SYNC_FETCH_DONE,
  REGISTRATION_CONTACT_SYNC_UPLOAD_DONE,
  REGISTRATION_CONTACT_SYNC_SKIP,
  REGISTRATION_CONTACT_SYNC_REFRESH,
  REGISTRATION_CONTACT_SYNC_REFRESH_DONE,

  REGISTRATION_ACCOUNT_FORM_CHANGE,
  REGISTRATION_INTRO_FORM_CHANGE,
  REGISTRATION_ADDPROFILE_CAMERAROLL_OPEN,
  REGISTRATION_ADDPROFILE_CAMERAROLL_PHOTO_CHOOSE,
  REGISTRATION_ADDPROFILE_UPLOAD_SUCCESS
} from '../actions/types';

export function arrayUnique(array) {
  let a = array.concat();
  for (let i = 0; i < a.length; ++i) {
    for (let j = i + 1; j < a.length; ++j) {
      if (a[i]._id === a[j]._id) {
        a.splice(j--, 1);
      }
    }
  }

  return a;
}

const INITIAL_STATE = {
  name: '',
  email: '',
  password: '',
  headline: '',
  matchedContacts: {
    data: [],
    limit: 30,
    skip: 0,
    refreshing: true
  },
  profilePic: null,
  profileObjectId: null,
  step: '',
  error: {},
  errorMessage: '',
  uploading: false, // flag for uploading user contacts
  fetching: false, // flag for fetching matched contacts
  loading: false // Register account loading. Disable account input when loading
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

    case REGISTRATION_ACCOUNT_LOADING:
      return { ...state, loading: true };

    case REGISTRATION_ACCOUNT_SUCCESS:
      return { ...state, loading: false };

    // Registration account form change
    case REGISTRATION_ACCOUNT_FORM_CHANGE:
      return { ...state, [action.payload.prop]: action.payload.value, error: {}, errorMessage: '' };

    case REGISTRATION_INTRO_FORM_CHANGE:
      return { ...state, headline: action.payload, error: {}, errorMessage: '' };

    // User go to adding profile picture part
    case REGISTRATION_ADDPROFILE:
      return { ...state, step: REGISTRATION_ADDPROFILE };

    case REGISTRATION_ADDPROFILE_UPLOAD_SUCCESS:
      return { ...state, profileObjectId: action.payload };

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

    // User starts to upload contacts
    case REGISTRATION_CONTACT_SYNC:
      return { ...state, step: REGISTRATION_CONTACT_SYNC, uploading: true };

    // Contacts upload done
    case REGISTRATION_CONTACT_SYNC_UPLOAD_DONE:
      return { ...state, uploading: false };

    case REGISTRATION_CONTACT_SYNC_FETCH:
      return { ...state, fetching: true };

    // Contacts fetching done
    case REGISTRATION_CONTACT_SYNC_FETCH_DONE: {
      const newMatchedContacts = { ...state.matchedContacts };
      newMatchedContacts.data = arrayUnique(newMatchedContacts.data.concat(action.payload.data));
      newMatchedContacts.skip = action.payload.skip;
      newMatchedContacts.refreshing = false;
      console.log('contact sync fetch done.');
      return { ...state, fetching: false, matchedContacts: newMatchedContacts };
    }

    // Refresh contact sync
    case REGISTRATION_CONTACT_SYNC_REFRESH: {
      const newMatchedContacts = { ...state.matchedContacts };
      newMatchedContacts.refreshing = true;
      return { ...state, fetching: true, matchedContacts: newMatchedContacts };
    }

    // Refresh contact sync cards done
    case REGISTRATION_CONTACT_SYNC_REFRESH_DONE: {
      const newMatchedContacts = { ...state.matchedContacts };
      newMatchedContacts.data = action.payload.data;
      newMatchedContacts.refreshing = false;
      newMatchedContacts.skip = action.payload.skip;

      return { ...state, fetching: false, matchedContacts: newMatchedContacts };
    }

    case REGISTRATION_CONTACT_SYNC_DONE:
      return { ...state };

    case REGISTRATION_CONTACT_SYNC_SKIP:
      return { ...state };

    default:
      return { ...state };
  }
};
