// This is the reducer for creating a new comment
import _ from 'lodash';

/**
 * This reducer is servered as denormalized comment stores
 */
const INITIAL_STATE = {
  contentText: '',
  owner: undefined,
  // ["Goal", "Post"]
  parentType: undefined,
  parentRef: undefined,
  content: undefined,
  // ["Comment", "Reply", "Suggestion"]
  commentType: undefined,
  replyToRef: undefined,
  showSuggestionModal: false,
  tmpSuggestion: { ...INITIAL_SUGGESETION },
  suggestion: { ...INITIAL_SUGGESETION },
  // This is used when suggestion type is friend and we search for certain friend
  friendList: []
};

const INITIAL_SUGGESETION = {
  // ["ChatConvoRoom", "Event", "Tribe", "Link", "Reading",
  // "Step", "Need", "Friend", "User", "Custom"]
  suggestionType: undefined,
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
};

export const COMMENT_NEW = 'comment_new';
export const COMMENT_NEW_TEXT_ON_CHANGE = 'comment_new_text_on_change';
export const COMMENT_NEW_SUGGESTION_CREATE = 'comment_new_suggestion_create';
export const COMMENT_NEW_SUGGESTION_ATTACH = 'comment_new_suggestion_attach';
// Open the attached suggestion to edit
export const COMMENT_NEW_SUGGESTION_OPEN_CURRENT = 'comment_new_suggestion_open_current';
export const COMMENT_NEW_SUGGESTION_CANCEL = 'comment_new_suggestion_cancel';
export const COMMENT_NEW_SUGGESTION_REMOVE = 'comment_new_suggestion_remove';
export const COMMENT_NEW_SUGGESTION_UPDAET_TYPE = 'comment_new_suggestion_update_type';
// Posting a comment
export const COMMENT_NEW_POST_START = 'comment_new_post_start';
export const COMMENT_NEW_POST_SUCCESS = 'comment_new_post_success';
export const COMMENT_NEW_POST_FAIL = 'comment_new_post_fail';

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // cases related to new comment
    case COMMENT_NEW_TEXT_ON_CHANGE: {
      // TODO: potential optimzation
      let newState = _.cloneDeep(state);
      return _.set(newState, 'contentText', action.payload);
    }

    case COMMENT_NEW_SUGGESTION_UPDAET_TYPE: {
      let newState = _.cloneDeep(state);
      return _.set(newState, 'tmpSuggestion.suggestionType', action.payload);
    }

    case COMMENT_NEW_SUGGESTION_CREATE: {
      const { suggestionFor } = action.payload;
      let newState = _.cloneDeep(state);
      newState = _.set(newState, 'tmpSuggestion.suggestionFor', suggestionFor);

      // Open suggestion modal
      newState = _.set(newState, 'showSuggestionModal', true);
      return newState;
    }

    // Remove the suggestion to become initial state
    case COMMENT_NEW_SUGGESTION_REMOVE: {
      let newState = _.cloneDeep(state);
      return _.set(newState, 'suggestion', { ...INITIAL_SUGGESETION });
    }

    // Reset the temperary suggestion to become initial state
    case COMMENT_NEW_SUGGESTION_CANCEL: {
      let newState = _.cloneDeep(state);

      // Close suggestion modal
      newState = _.set(newState, 'showSuggestionModal', false);
      return _.set(newState, 'tmpSuggestion', { ...INITIAL_SUGGESETION });
    }

    // Set tmp suggestion to final suggestion
    case COMMENT_NEW_SUGGESTION_ATTACH: {
      let newState = _.cloneDeep(state);
      const tmpSuggestion = _.get(newState, 'tmpSuggestion');
      newState = _.set(newState, 'suggestion', tmpSuggestion);

      // Close suggestion modal
      return _.set(newState, 'showSuggestionModal', false);
    }

    // Set current suggestion to tmp suggestion for editing
    case COMMENT_NEW_SUGGESTION_OPEN_CURRENT: {
      let newState = _.cloneDeep(state);
      const suggestion = _.get(newState, 'suggestion');
      newState = _.set(newState, 'tmpSuggestion', suggestion);

      // Open suggestion modal
      return _.set(newState, 'showSuggestionModal', true);
    }

    default: return { ...state };
  }
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
