/* Login Actions */
export const USERNAME_CHANGED = 'username_changed';
export const PASSWORD_CHANGED = 'password_changed';
export const LOGIN_USER_SUCCESS = 'login_user_success';
export const LOGIN_USER_FAIL = 'login_user_fail';
export const LOGIN_USER_LOADING = 'login_user_loading';

/* Registration Constants */
// General registration error
export const REGISTRATION_ERROR = 'registration_error';
export const REGISTRATION_BACK = 'registration_back';
export const REGISTRATION_ACCOUNT = 'registration_account';
export const REGISTRATION_ACCOUNT_SUCCESS = 'registration_account_success';
export const REGISTRATION_ACCOUNT_FORM_CHANGE = 'registration_account_form_change';

export const REGISTRATION_LOGIN = 'registration_login';
export const REGISTRATION_ADDPROFILE = 'registration_addprofile';
export const REGISTRATION_INTRO = 'registration_intro';
export const REGISTRATION_INTRO_SKIP = 'registration_intro_skip';
export const REGISTRATION_CONTACT = 'registration_contact';
export const REGISTRATION_CONTACT_SKIP = 'registration_contact_skip';
export const REGISTRATION_CONTACT_SYNC = 'registration_contact_sync';
export const REGISTRATION_CONTACT_SYNC_SKIP = 'registration_contact_sync_skip';
export const REGISTRATION_CONTACT_SYNC_DONE = 'registration_contact_sync_done';

export const REGISTRATION_INTRO_FORM_CHANGE = 'registration_intro_form_change';

export const REGISTRATION_ADDPROFILE_UPLOAD_SUCCESS = 'registration_addprofile_upload_success';
export const REGISTRATION_ADDPROFILE_UPLOAD_FAIL = 'registration_addprofile_upload_fail';
export const REGISTRATION_ADDPROFILE_CAMERAROLL_OPEN = 'registration_addprofile_cameraroll_open';
export const REGISTRATION_ADDPROFILE_CAMERAROLL_LOAD_PHOTO = 'registration_addprofile_load_photo';
export const REGISTRATION_ADDPROFILE_CAMERAROLL_CLOSE = 'registration_addprofile_cameraroll_close';
export const REGISTRATION_ADDPROFILE_CAMERAROLL_PHOTO_CHOOSE
  = 'registration_addprofile_cameraroll_photo_choose';
export const REGISTRATION_ADDPROFILE_CAMERA_OPEN = 'registration_addprofile_camera_open';

/* Main App Actions */
/* Profile actions */
export const PROFILE_OPEN_PROFILE = 'profile_open_profile'; // User tries to open a profile
export const PROFILE_FETCHING_SUCCESS = 'profile_fetching_success'; // Loading profile succeed
export const PROFILE_FETCHING_FAIL = 'profile_fetching_fail'; // Loading profile fails
export const PROFILE_OPEN_PROFILE_DETAIL
  = 'profile_open_profile_detail'; // User opens a profile detail
export const PROFILE_SUBMIT_UPDATE = 'profile_submit_update';
export const PROFILE_IMAGE_UPLOAD_SUCCESS = 'profile_image_upload_success';
export const PROFILE_UPDATE_SUCCESS = 'profile_update_success';
export const PROFILE_UPDATE_FAIL = 'profile_update_fail';

/* Setting actions */
export const SETTING_OPEN_SETTING = 'setting_open_setting';
export const SETTING_TAB_SELECTION = 'setting_tab_selection';
export const SETTING_RESENT_EMAIL_VERIFICATION = 'setting_resent_email_verification';
