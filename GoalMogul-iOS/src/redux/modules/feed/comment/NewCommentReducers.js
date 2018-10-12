// This is the reducer for creating a new comment
import _ from 'lodash';
import {
  GOAL_DETAIL_OPEN,
  GOAL_DETAIL_CLOSE
} from '../../../../reducers/GoalDetailReducers';

const NEW_COMMENT_INITIAL_STATE = {
  contentText: '',
  owner: undefined,
  // ["Goal", "Post"]
  parentType: undefined,
  parentRef: undefined,
  content: undefined,
  // ["Comment", "Reply", "Suggestion"]
  commentType: undefined,
  replyToRef: undefined,
  tmpSuggestion: { ...INITIAL_SUGGESETION },
  suggestion: { ...INITIAL_SUGGESETION },
  // This is used when suggestion type is friend and we search for certain friend
  friendList: [],
  showSuggestionModal: false,
  showAttachedSuggestion: false,
};
/**
 * This reducer is servered as denormalized comment stores
 */
const INITIAL_STATE = {
  homeTab: {
    ...NEW_COMMENT_INITIAL_STATE
  },
  meetTab: {
    ...NEW_COMMENT_INITIAL_STATE
  },
  notificationTab: {
    ...NEW_COMMENT_INITIAL_STATE
  },
  exploreTab: {
    ...NEW_COMMENT_INITIAL_STATE
  },
  chatTab: {
    ...NEW_COMMENT_INITIAL_STATE
  }
};

const INITIAL_SUGGESETION = {
  // ["ChatConvoRoom", "Event", "Tribe", "Link", "Reading",
  // "Step", "Need", "Friend", "User", "Custom"]
  suggestionType: 'Reading',
  // ["Goal", "Need", "Step"]
  suggestionFor: undefined,
  suggestionForRef: undefined,
  mediaRef: undefined,
  suggestionLink: undefined,
  suggestionText: undefined,
  userRef: undefined,
  goalRef: undefined,
  needRef: undefined,
  stepRef: undefined,
  chatRoomRef: undefined,
  eventRef: undefined,
  tribeRef: undefined,
  selectedItem: undefined
};

export const COMMENT_NEW = 'comment_new';
export const COMMENT_NEW_TEXT_ON_CHANGE = 'comment_new_text_on_change';
export const COMMENT_NEW_SUGGESTION_CREATE = 'comment_new_suggestion_create';
export const COMMENT_NEW_SUGGESTION_ATTACH = 'comment_new_suggestion_attach';
// Open suggestion modal
export const COMMENT_NEW_SUGGESTION_OPEN_MODAL = 'comment_new_suggestion_open_modal';
// Open the attached suggestion to edit
export const COMMENT_NEW_SUGGESTION_OPEN_CURRENT = 'comment_new_suggestion_open_current';
export const COMMENT_NEW_SUGGESTION_CANCEL = 'comment_new_suggestion_cancel';
export const COMMENT_NEW_SUGGESTION_REMOVE = 'comment_new_suggestion_remove';
export const COMMENT_NEW_SUGGESTION_UPDAET_TYPE = 'comment_new_suggestion_update_type';
export const COMMENT_NEW_SUGGESTION_UPDATE_TEXT = 'comment_new_suggestion_update_text';
export const COMMENT_NEW_SUGGESTION_UPDATE_LINK = 'comment_new_suggestion_update_link';
// Select item for suggestion
export const COMMENT_NEW_SUGGESTION_SELECT_ITEM = 'comment_new_suggestion_select_item';
// Posting a comment
export const COMMENT_NEW_POST_START = 'comment_new_post_start';
export const COMMENT_NEW_POST_SUCCESS = 'comment_new_post_success';
export const COMMENT_NEW_POST_FAIL = 'comment_new_post_fail';

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GOAL_DETAIL_OPEN: {
      let newState = _.cloneDeep(state);
      const { tab, goal } = action.payload;
      const path = !tab ? 'homeTab' : `${tab}`;
      newState = _.set(newState, `${path}.parentType`, 'goal');
      return _.set(newState, `${path}.parentRef`, goal._id);
    }

    // when comment posts succeed, delete everything but parent type and ref
    case COMMENT_NEW_POST_SUCCESS: {
      const newState = _.cloneDeep(state);
      const { tab } = action.payload;
      const path = !tab ? 'homeTab' : `${tab}`;
      const parentType = _.get(newState, `${path}.parentType`);
      const parentRef = _.get(newState, `${path}.parentRef`);

      const newTabState = {
        ...NEW_COMMENT_INITIAL_STATE,
        parentType,
        parentRef
      };

      return _.set(newState, `${path}`, newTabState);
    }

    // When user exits the GoalDetailCard, we need to reset the state
    case GOAL_DETAIL_CLOSE: {
      const newState = _.cloneDeep(state);
      const { tab } = action.payload;
      const path = !tab ? 'homeTab' : `${tab}`;
      return _.set(newState, `${path}`, { ...NEW_COMMENT_INITIAL_STATE });
    }

    // cases related to new comment
    case COMMENT_NEW_TEXT_ON_CHANGE: {
      // TODO: potential optimzation
      const newState = _.cloneDeep(state);
      const { tab, text } = action.payload;
      const path = !tab ? 'homeTab' : `${tab}`;
      return _.set(newState, `${path}.contentText`, text);
    }

    case COMMENT_NEW: {
      const { parentType, parentRef, commentType, replyToRef, owner, tab } = action.payload;
      const path = !tab ? 'homeTab' : `${tab}`;
      let newState = _.cloneDeep(state);
      newState = setState(newState, `${path}.parentType`, parentType);
      newState = setState(newState, `${path}.parentRef`, parentRef);
      newState = setState(newState, `${path}.commentType`, commentType);
      newState = setState(newState, `${path}.replyToRef`, replyToRef);
      newState = setState(newState, `${path}.owner`, owner);

      return newState;
    }

    case COMMENT_NEW_SUGGESTION_UPDAET_TYPE: {
      let newState = _.cloneDeep(state);
      const { tab, suggestionType } = action.payload;
      const path = !tab ? 'homeTab' : `${tab}`;
      newState = _.set(newState, `${path}.tmpSuggestion.suggestionType`, suggestionType);
      return newState;
    }

    case COMMENT_NEW_SUGGESTION_CREATE: {
      const { suggestionFor, suggestionForRef, tab } = action.payload;
      const path = !tab ? 'homeTab' : `${tab}`;
      let newState = _.cloneDeep(state);
      newState = _.set(newState, `${path}.tmpSuggestion.suggestionFor`, suggestionFor);
      newState = _.set(newState, `${path}.tmpSuggestion.suggestionForRef`, suggestionForRef);

      return newState;
    }

    // Remove the suggestion to become initial state
    case COMMENT_NEW_SUGGESTION_REMOVE: {
      let newState = _.cloneDeep(state);
      const { tab } = action.payload;
      const path = !tab ? 'homeTab' : `${tab}`;
      newState = _.set(newState, `${path}.showAttachedSuggestion`, false);
      return _.set(newState, `${path}.suggestion`, { ...INITIAL_SUGGESETION });
    }

    // Reset the temperary suggestion to become initial state
    case COMMENT_NEW_SUGGESTION_CANCEL: {
      let newState = _.cloneDeep(state);
      const { tab } = action.payload;
      const path = !tab ? 'homeTab' : `${tab}`;

      // Close suggestion modal
      newState = _.set(newState, `${path}.showSuggestionModal`, false);
      return _.set(newState, `${path}.tmpSuggestion`, { ...INITIAL_SUGGESETION });
    }

    // Set tmp suggestion to final suggestion
    case COMMENT_NEW_SUGGESTION_ATTACH: {
      let newState = _.cloneDeep(state);
      const { tab } = action.payload;
      const path = !tab ? 'homeTab' : `${tab}`;

      const tmpSuggestion = _.get(newState, `${path}.tmpSuggestion`);
      newState = _.set(newState, `${path}.suggestion`, tmpSuggestion);
      newState = _.set(newState, `${path}.showAttachedSuggestion`, true);
      // Close suggestion modal
      return _.set(newState, `${path}.showSuggestionModal`, false);
    }

    // Set current suggestion to tmp suggestion for editing
    case COMMENT_NEW_SUGGESTION_OPEN_CURRENT: {
      let newState = _.cloneDeep(state);
      const { tab } = action.payload;
      const path = !tab ? 'homeTab' : `${tab}`;

      const suggestion = _.get(newState, `${path}.suggestion`);
      newState = _.set(newState, `${path}.tmpSuggestion`, suggestion);

      // Open suggestion modal
      return _.set(newState, `${path}.showSuggestionModal`, true);
    }

    case COMMENT_NEW_SUGGESTION_OPEN_MODAL: {
      const newState = _.cloneDeep(state);
      const { tab } = action.payload;
      const path = !tab ? 'homeTab' : `${tab}`;

      return _.set(newState, `${path}.showSuggestionModal`, true);
    }

    // Update suggestion text
    case COMMENT_NEW_SUGGESTION_UPDATE_TEXT: {
      const newState = _.cloneDeep(state);
      const { tab, text } = action.payload;
      const path = !tab ? 'homeTab' : `${tab}`;
      return _.set(newState, `${path}.tmpSuggestion.suggestionText`, text);
    }

    // Update suggestion link
    case COMMENT_NEW_SUGGESTION_UPDATE_LINK: {
      const newState = _.cloneDeep(state);
      const { tab, suggestionLink } = action.payload;
      const path = !tab ? 'homeTab' : `${tab}`;
      return _.set(newState, `${path}.tmpSuggestion.suggestionLink`, suggestionLink);
    }

    // Update item selected
    case COMMENT_NEW_SUGGESTION_SELECT_ITEM: {
      const newState = _.cloneDeep(state);
      const { tab, selectedItem } = action.payload;
      const path = !tab ? 'homeTab' : `${tab}`;
      return _.set(newState, `${path}.tmpSuggestion.selectedItem`, selectedItem);
    }

    default: return { ...state };
  }
};

const setState = (newState, path, data) => {
  // If data exists or original field is set, then we set explicitly.
  if (data || _.get(newState, `${path}`)) return _.set(newState, `${path}`, data);
  return newState;
};

/**
 * Note: following is the schema design for comment
{
  created: {
		type: Date,
		required: true,
	},
	lastUpdated: {
		type: Date,
		required: true,
	},
	owner: {
		type: Schema.ObjectId,
		ref: 'users',
		required: true,
  },
  parentType: {
    type: String,
    enum: ["Goal", "Post"],
    required: true,
  },
  parentRef: {
    type: Schema.ObjectId,
    required: true,
  },
	content: {
		text: String,
		tags: [{
			startIndex: Number,
			endIndex: Number,
			user: {
				type: Schema.ObjectId,
				ref: 'users',
			},
    }],
    links: [mongoose.SchemaTypes.Url]
  },
  commentType: {
    type: String,
    enum: ["Comment", "Reply", "Suggestion"],
    required: true,
  },
  replyToRef: {
      type: Schema.ObjectId,
      ref: 'comments',
  },
  suggestion: {
    suggestionType: {
      type: String,
      enum: ["ChatConvoRoom", "Event", "Tribe", "Link", "Reading", "Step", "Need", "Friend", "User", "Custom"],
      required: true,
    },
    suggestionFor: {
      type: String,
      enum: ["Goal", "Need", "Step"],
      required: true,
    },
    suggestionForRef: Schema.ObjectId,
    mediaRef: String,
    suggestionLink: mongoose.SchemaTypes.Url, // reading, link, custom
    suggestionText: String, // reading, custom
    userRef: {
        type: Schema.ObjectId,
        ref: 'users',
    },
    goalRef: {
        type: Schema.ObjectId,
        ref: 'goals',
    },
    needRef: Schema.ObjectId,
    stepRef: Schema.ObjectId, // pairs with goalRef
    // chatRoomRef/eventRef/tribeRef
  },
});
 */
