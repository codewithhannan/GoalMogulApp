import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { reducer as formReducer } from 'redux-form';

/* reducers */
import AuthReducers from './AuthReducers';
import RegReducers from './RegReducers';
import CameraRollReducers from './CameraRollReducers';
import User from './User';
import Profile from './Profile';
import Setting from './Setting';
import NavigationReducers from './NavigationReducers';
import MeetReducers from './MeetReducers';
import Home from './Home';
import Search from '../redux/modules/search/Search';
import GoalDetailReducers from './GoalDetailReducers';
import CreateGoal from '../redux/modules/goal/CreateGoal';
import PostReducers from '../redux/modules/feed/post/PostReducers';
import ShareReducers from '../redux/modules/feed/post/ShareReducers';
import TribeReducers from '../redux/modules/tribe/TribeReducers';
import EventReducers from '../redux/modules/event/EventReducers';
import CommentReducers from '../redux/modules/feed/comment/CommentReducers';
import NewCommentReducers from '../redux/modules/feed/comment/NewCommentReducers';
import SuggestionSearchReducers from '../redux/modules/feed/comment/SuggestionSearchReducers';
import ReportReducers from '../redux/modules/report/ReportReducers';
import NotificationTabReducers from '../redux/modules/notification/NotificationTabReducers';
// Explore tab related reducers
import EventTabReducers from '../redux/modules/event/EventTabReducers';
import TribeTabReducers from '../redux/modules/tribe/TribeTabReducers';
import ExploreReducers from '../redux/modules/explore/ExploreReducers';
import NewShareReducers from '../redux/modules/feed/post/NewShareReducers';
import NewTribeReducers from '../redux/modules/tribe/NewTribeReducers';
import NewEventReducers from '../redux/modules/event/NewEventReducers';
// Menu related reducers
import MyEventTabReducers from '../redux/modules/event/MyEventTabReducers';
import MyEventReducers from '../redux/modules/event/MyEventReducers';
import MyTribeTabReducers from '../redux/modules/tribe/MyTribeTabReducers';
import MyTribeReducers from '../redux/modules/tribe/MyTribeReducers';
// Chat related reducers
import ChatTabReducers from '../redux/modules/chat/ChatTabReducers';

const rootPersistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2, // see "Merge Process" section for details.
  blacklist: ['registration', 'form']
};

const reducers = combineReducers({
  auth: AuthReducers,
  registration: RegReducers,
  cameraRoll: CameraRollReducers,
  user: User,
  profile: Profile,
  form: formReducer,
  setting: Setting,
  navigation: NavigationReducers,
  meet: MeetReducers,
  home: Home,
  search: Search,
  goalDetail: GoalDetailReducers,
  createGoal: CreateGoal,
  postDetail: PostReducers,
  shareDetail: ShareReducers,
  tribe: TribeReducers,
  event: EventReducers,
  comment: CommentReducers,
  newComment: NewCommentReducers,
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
  myTribe: MyTribeReducers,
  newTribe: NewTribeReducers,
  newEvent: NewEventReducers,
  notification: NotificationTabReducers,
  chat: ChatTabReducers
});

export default persistReducer(rootPersistConfig, reducers);
