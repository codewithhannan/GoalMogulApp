import R from 'ramda';
import _ from 'lodash';

import { arrayUnique } from '../../../middleware/utils';
import {
  GOAL_DETAIL_CLOSE
} from '../../../../reducers/GoalDetailReducers';

/**
 * This reducer is servered as denormalized comment stores
 */
const INITIAL_STATE = {
  data: [],
  transformedComments: [],
  skip: 0,
  limit: 20,
  loading: false,
  hasNextPage: undefined,
  newComment: {
    contentText: ''
  }
};

export const COMMENT_LOAD = 'comment_load';
export const COMMENT_REFRESH_DONE = 'comment_refresh_done';
export const COMMENT_LOAD_DONE = 'comment_load';
export const COMMENT_LOAD_MORE_REPLIES = 'comment_load_more_replies';

// New comment related constants
export const COMMENT_POST = 'comment_post';
export const COMMENT_POST_DONE = 'comment_post_done';
export const COMMENT_NEW_TEXT_ON_CHANGE = 'comment_new_text_on_change';

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // TODO: clear state on GoalDetailCard close
    case GOAL_DETAIL_CLOSE: {
      return {
        ...INITIAL_STATE
      };
    }

    // cases related to new comment
    case COMMENT_NEW_TEXT_ON_CHANGE: {
      return {
        ...state,
        newComment: {
          ...state.newComment,
          contentText: action.payload
        }
      };
    }

    // load more child comments
    case COMMENT_LOAD_MORE_REPLIES: {
      // TODO: find the comment and update the numberOfChildrenShowing and hasMoreToShow
      return {
        ...state
      };
    }

    // following switches are to handle loading Comments
    case COMMENT_LOAD: {
      // const { type } = action.payload;
      let newState = _.cloneDeep(state);
      return _.set(newState, 'loading', true);
    }

    case COMMENT_REFRESH_DONE: {
      const { skip, data, hasNextPage, type } = action.payload;
      let newState = _.cloneDeep(state);
      newState = _.set(newState, 'loading', false);

      if (skip !== undefined) {
        newState = _.set(newState, 'skip', skip);
      }
      newState = _.set(newState, 'hasNextPage', hasNextPage);
      newState = _.set(newState, 'data', data);

      // A dump way to transform all comments to comments with childComments
      const transformedComments = data.filter(comment => !comment.replyToRef).map(comment => {
        const commentId = comment._id.toString();
        const childComments = data.filter(
          currentComment => currentComment.replyToRef.toString() === commentId);

        const numberOfChildrenShowing = childComments.length > 0 ? 1 : 0;
        const hasMoreToShow = numberOfChildrenShowing !== childComments.length;
        const newComment = {
          ...comment,
          childComments,
          hasMoreToShow,
          numberOfChildrenShowing
        };
        return newComment;
      });
      return _.set(newState, 'transformedComments', transformedComments);
    }

    case COMMENT_LOAD_DONE: {
      const { skip, data, hasNextPage, type } = action.payload;
      let newState = _.cloneDeep(state);
      newState = _.set(newState, 'loading', false);

      if (skip !== undefined) {
        newState = _.set(newState, 'skip', skip);
      }
      newState = _.set(newState, 'hasNextPage', hasNextPage);
      const oldData = _.get(newState, 'data');
      return _.set(newState, 'data', arrayUnique(oldData.concat(data)));
    }

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
