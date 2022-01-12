/** @format */

import { combineReducers } from 'redux'
import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import { reducer as formReducer } from 'redux-form'

/* reducers */
import Tooltip from './TooltipReducer'
import FriendsRequests from './FriendsRequestReducer'
import Challenges from './Challenges'
import Popup from './PopupReducers'
import AuthReducers from './AuthReducers'
import RegReducers from './RegReducers'
import GoalPrivacyReducers from './GoalPrivacy'
import CameraRollReducers from './CameraRollReducers'
import User from './User'
import Users from '../redux/modules/User/Users'
import Profile from './Profile'
import Setting from './Setting'
import ToastsReducers from './ToastReducers'
import NavigationReducers from './NavigationReducers'
import MeetReducers from './MeetReducers'
import Home from './Home'
import Search from '../redux/modules/search/Search'
import GoalDetailReducers from './GoalDetailReducers'
import Goals from '../redux/modules/goal/Goals'
import CreateGoal from '../redux/modules/goal/CreateGoal'
import PostReducers from '../redux/modules/feed/post/PostReducers'
import Posts from '../redux/modules/feed/post/Posts'
import ShareReducers from '../redux/modules/feed/post/ShareReducers'
import Tribes from '../redux/modules/tribe/Tribes'
import EventReducers from '../redux/modules/event/EventReducers'
import Events from '../redux/modules/event/Events'
import CommentReducers from '../redux/modules/feed/comment/CommentReducers'
import Comments from '../redux/modules/feed/comment/Comments'
import NewCommentReducers from '../redux/modules/feed/comment/NewCommentReducers'
import SuggestionSearchReducers from '../redux/modules/feed/comment/SuggestionSearchReducers'
import ReportReducers from '../redux/modules/report/ReportReducers'
import NotificationTabReducers from '../redux/modules/notification/NotificationTabReducers'
// Explore tab related reducers
import EventTabReducers from '../redux/modules/event/EventTabReducers'
import TribeTabReducers from '../redux/modules/tribe/TribeTabReducers'
import ExploreReducers from '../redux/modules/explore/ExploreReducers'
import NewShareReducers from '../redux/modules/feed/post/NewShareReducers'
import NewTribeReducers from '../redux/modules/tribe/NewTribeReducers'
import NewEventReducers from '../redux/modules/event/NewEventReducers'
// Menu related reducers
import MyEventTabReducers from '../redux/modules/event/MyEventTabReducers'
import MyEventReducers from '../redux/modules/event/MyEventReducers'
import MyTribeTabReducers from '../redux/modules/tribe/MyTribeTabReducers'
// Chat related reducers
import ChatReducers from '../redux/modules/chat/ChatReducers'
import CreateChatRoomReducers from '../redux/modules/chat/CreateChatRoomReducers'
import ChatRoomReducers from '../redux/modules/chat/ChatRoomReducers'
import TabIconReducers from '../redux/modules/navigation/TabIconReducers'
import ChatRoomMembersReducers from '../redux/modules/chat/ChatRoomMembersReducers'
import ShareToChatReducers from '../redux/modules/chat/ShareToChatReducers'
import AccountsReducers from './ExistingAccounts'
import FeedBackReducers from './FeedbackReducers'
import AccountabilityReducers from './AccountabilityTimePicker'

//Seek Help

import SeekHelpReducer from '../redux/modules/SeekHelp/seekHelpReducers'

import VisitedUsers from './UserVisited'

import ProfileGoalSwipe from './ProfileGoalSwipeReducer'

//Nudge Reducers

import NudgeReducers from './NudgesReducer'

//Contact Reducers

import ContactsReducer from '../reducers/ContactsReducer'

// Step by Step tutorial reducers
import Tutorials from '../redux/modules/User/Tutorials'
// Contact Sync
import ContactSyncReducers from '../redux/modules/User/ContactSync/ContactSyncReducers'

//All Existing Accounts
import ExistingAccountsReducers from './ExistingAccounts'

const rootPersistConfig = {
    key: 'root',
    storage,
    stateReconciler: autoMergeLevel2, // see "Merge Process" section for details.
    blacklist: ['registration', 'form'],
}

export const reducers = combineReducers({
    auth: AuthReducers,
    registration: RegReducers,
    cameraRoll: CameraRollReducers,
    user: User,
    users: Users,
    profile: Profile,
    form: formReducer,
    setting: Setting,
    navigation: NavigationReducers,
    meet: MeetReducers,
    home: Home,
    search: Search,
    goalDetail: GoalDetailReducers,
    goals: Goals,
    createGoal: CreateGoal,
    postDetail: PostReducers,
    posts: Posts,
    shareDetail: ShareReducers,
    tribes: Tribes,
    event: EventReducers,
    events: Events,
    comment: CommentReducers,
    newComment: NewCommentReducers,
    comments: Comments,
    report: ReportReducers,
    explore: ExploreReducers,
    eventTab: EventTabReducers,
    tribeTab: TribeTabReducers,
    newShare: NewShareReducers,
    suggestionSearch: SuggestionSearchReducers,
    // menu related reducers. The following four reducers can be abstracted out later
    myEventTab: MyEventTabReducers,
    myTribeTab: MyTribeTabReducers,
    myEvent: MyEventReducers,
    newTribe: NewTribeReducers,
    newEvent: NewEventReducers,
    newChatRoom: CreateChatRoomReducers,
    shareToChat: ShareToChatReducers,
    notification: NotificationTabReducers,
    chat: ChatReducers,
    chatRoom: ChatRoomReducers,
    chatRoomMembers: ChatRoomMembersReducers,
    navigationTabBadging: TabIconReducers,
    tutorials: Tutorials,
    contactSync: ContactSyncReducers,
    challenges: Challenges,
    goalPrivacy: GoalPrivacyReducers,
    popup: Popup,
    tooltip: Tooltip,
    nudges: NudgeReducers,
    contacts: ContactsReducer,
    account: AccountsReducers,
    usersVisited: VisitedUsers,
    toasts: ToastsReducers,
    friendsRequest: FriendsRequests,
    feedback: FeedBackReducers,
    goalSwiper: ProfileGoalSwipe,
    seekHelp: SeekHelpReducer,
    accountabilityTime: AccountabilityReducers,
})

export default persistReducer(rootPersistConfig, reducers)
