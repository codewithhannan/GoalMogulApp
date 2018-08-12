import R from 'ramda';
import _ from 'lodash';

/**
 * This reducer is servered as denormalized comment stores
 */
const INITIAL_STATE = {
  data: [],
  skip: 0,
  limit: 20,
  loading: false,
  hasNextPage: undefined
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    default:
      return { ...state };
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
