/**
 * /* Initializing Apps
 *
 * @format
 */

export const APP_LOADING = 'app_loading'
export const APP_LOADING_DONE = 'app_loading_done'

/* Login Actions */
export const USERNAME_CHANGED = 'username_changed'
export const PASSWORD_CHANGED = 'password_changed'
export const LOGIN_USER_SUCCESS = 'login_user_success'
export const LOGIN_USER_FAIL = 'login_user_fail'
export const LOGIN_USER_LOADING = 'login_user_loading'

/* Registration Constants */
// General registration error
export const REGISTRATION_ERROR = 'registration_error'
export const REGISTRATION_BACK = 'registration_back'
export const REGISTRATION_ACCOUNT = 'registration_account'
export const REGISTRATION_ACCOUNT_LOADING = 'registration_account_loading'
export const REGISTRATION_ACCOUNT_SUCCESS = 'registration_account_success'
export const REGISTRATION_ACCOUNT_FORM_CHANGE =
    'registration_account_form_change'
export const ACCOUNT_UPDATE_PASSWORD = 'account_update_password'
export const ACCOUNT_UPDATE_PASSWORD_DONE = 'account_update_password_done'

export const REGISTRATION_LOGIN = 'registration_login'
export const REGISTRATION_ADDPROFILE = 'registration_addprofile'
export const REGISTRATION_INTRO = 'registration_intro'
export const REGISTRATION_INTRO_SKIP = 'registration_intro_skip'
export const REGISTRATION_CONTACT = 'registration_contact'
export const REGISTRATION_CONTACT_SKIP = 'registration_contact_skip'
export const REGISTRATION_CONTACT_SYNC = 'registration_contact_sync'
export const REGISTRATION_CONTACT_SYNC_UPLOAD_DONE =
    'registration_contact_sync_upload_done'
export const REGISTRATION_CONTACT_SYNC_FETCH = 'registration_contact_sync_fetch'
export const REGISTRATION_CONTACT_SYNC_FETCH_DONE =
    'registration_contact_sync_fetch_done'
export const REGISTRATION_CONTACT_SYNC_SKIP = 'registration_contact_sync_skip'
export const REGISTRATION_CONTACT_SYNC_DONE = 'registration_contact_sync_done'
export const REGISTRATION_CONTACT_SYNC_REFRESH =
    'registratoin_contact_sync_refresh'
export const REGISTRATION_CONTACT_SYNC_REFRESH_DONE =
    'registratoin_contact_sync_refresh_done'

export const REGISTRATION_INTRO_FORM_CHANGE = 'registration_intro_form_change'

export const REGISTRATION_ADDPROFILE_UPLOAD_SUCCESS =
    'registration_addprofile_upload_success'
export const REGISTRATION_ADDPROFILE_UPLOAD_FAIL =
    'registration_addprofile_upload_fail'
export const REGISTRATION_ADDPROFILE_CAMERAROLL_OPEN =
    'registration_addprofile_cameraroll_open'
export const REGISTRATION_ADDPROFILE_CAMERAROLL_LOAD_PHOTO =
    'registration_addprofile_load_photo'
export const REGISTRATION_ADDPROFILE_CAMERAROLL_CLOSE =
    'registration_addprofile_cameraroll_close'
export const REGISTRATION_ADDPROFILE_CAMERAROLL_PHOTO_CHOOSE =
    'registration_addprofile_cameraroll_photo_choose'
export const REGISTRATION_ADDPROFILE_CAMERA_OPEN =
    'registration_addprofile_camera_open'

/* Main App Actions */

/* Home Tab actions */
export const HOME_SWITCH_TAB = 'home_switch_tab'

/* Profile actions */
export const PROFILE_OPEN_PROFILE = 'profile_open_profile' // User tries to open a profile
export const PROFILE_CLOSE_PROFILE_DETAIL = 'profile_close_profile_detail'
export const PROFILE_CLOSE_PROFILE = 'profile_close_profile' // User closes a profile
export const PROFILE_FETCHING = 'profile_fetching' // Start Loading profile
export const PROFILE_FETCHING_SUCCESS = 'profile_fetching_success' // Loading profile succeed
export const PROFILE_FETCHING_FAIL = 'profile_fetching_fail' // Loading profile fails
export const PROFILE_OPEN_PROFILE_DETAIL = 'profile_open_profile_detail' // User opens a profile detail
export const PROFILE_SUBMIT_UPDATE = 'profile_submit_update'
export const PROFILE_IMAGE_UPLOAD_SUCCESS = 'profile_image_upload_success'
export const PROFILE_UPDATE_SUCCESS = 'profile_update_success'
export const PROFILE_UPDATE_FAIL = 'profile_update_fail'
export const PROFILE_SWITCH_TAB = 'profile_switch_tab'
export const GOAL_UPDATE_27 = 'goal_update_27'

/* Setting actions */
export const SETTING_OPEN_SETTING = 'setting_open_setting'
export const SETTING_TAB_SELECTION = 'setting_tab_selection'
export const SETTING_RESENT_EMAIL_VERIFICATION =
    'setting_resent_email_verification'
export const SETTING_EMAIL_UPDATE_SUCCESS = 'setting_email_update_success'
export const SETTING_PHONE_UPDATE_SUCCESS = 'setting_phone_update_success'
export const SETTING_INVITE_CODE_UPDATE = 'setting_invite_code_update'
export const SETTING_INVITE_CODE_UPDATE_SUCCESS =
    'setting_invite_code_update_success'
export const SETTING_PHONE_VERIFICATION_SUCCESS =
    'setting_phone_verification_success'
export const SETTING_FRIEND_SETTING_SELECTION =
    'setting_friend_setting_selection'
export const SETTING_FRIEND_SETTING_UPDATE_SUCCESS =
    'setting_friend_setting_update_success'
export const SETTING_BLOCK_FETCH_ALL = 'setting_block_fetch_all'
export const SETTING_BLOCK_FETCH_ALL_DONE = 'setting_block_fetch_all_done'
export const SETTING_BLOCK_REFRESH_DONE = 'setting_block_fetch_all_done'
export const SETTING_BLOCK_BLOCK_REQUEST = 'setting_block_block_request'
export const SETTING_BLOCK_BLOCK_REQUEST_DONE =
    'setting_block_block_request_done'
export const SETTING_BLOCK_UNBLOCK_REQUEST = 'setting_block_unblock_request'
export const SETTING_BLOCK_UNBLOCK_REQUEST_DONE =
    'setting_block_unblock_request_done'

/* Meet Actions */
export const MEET_SELECT_TAB = 'meet_select_tab'
export const MEET_LOADING = 'meet_loading'
export const MEET_LOADING_DONE = 'meet_loading_done'
export const MEET_UPDATE_FRIENDSHIP = 'meet_update_friendship'
export const MEET_UPDATE_FRIENDSHIP_DONE = 'meet_update_friendship_done'
export const MEET_TAB_REFRESH = 'meet_tab_refresh'
export const MEET_TAB_REFRESH_DONE = 'meet_tab_refresh_done'

export const MEET_TAB_ONBOARDING_REFRESH = 'meet_tab_onboarding_refresh'
export const MEET_TAB_ONBOARDING_REFRESH_DONE =
    'meet_tab_onboarding_refresh_done'

export const MEET_CHANGE_FILTER = 'meet_change_filter'
export const MEET_REQUESTS_CHANGE_TAB = 'meet_requests_change_tab'
export const MEET_BLOCK_USER_DONE = 'meet_block_user_done'

/*Challenges Actions */
export const CHALLENGES_OPEN_CHALLENGES = 'challenges_open_challenges'
