// This stores all the comments for a specific goal
import R from 'ramda';
import _ from 'lodash';

import { arrayUnique } from '../../../middleware/utils';
import {
  GOAL_DETAIL_CLOSE
} from '../../../../reducers/GoalDetailReducers';

import {
  LIKE_COMMENT,
  UNLIKE_COMMENT
} from '../../like/LikeReducers';

const COMMENT_INITIAL_STATE = {
  data: [],
  transformedComments: [],
  skip: 0,
  limit: 20,
  loading: false,
  hasNextPage: undefined
};
/**
 * This reducer is servered as denormalized comment stores
 */
const INITIAL_STATE = {
  homeTab: {
    ...COMMENT_INITIAL_STATE
  },
  meetTab: {
    ...COMMENT_INITIAL_STATE
  },
  notificationTab: {
    ...COMMENT_INITIAL_STATE
  },
  exploreTab: {
    ...COMMENT_INITIAL_STATE
  },
  chatTab: {
    ...COMMENT_INITIAL_STATE
  }
};

export const COMMENT_LOAD = 'comment_load';
export const COMMENT_REFRESH_DONE = 'comment_refresh_done';
export const COMMENT_LOAD_DONE = 'comment_load';
export const COMMENT_LOAD_MORE_REPLIES = 'comment_load_more_replies';

// New comment related constants
export const COMMENT_POST = 'comment_post';
export const COMMENT_POST_DONE = 'comment_post_done';

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // TODO: clear state on GoalDetailCard close
    case GOAL_DETAIL_CLOSE: {
      const { tab } = action.payload;
      const path = !tab ? 'homeTab' : `${tab}`;
      return _.set(state, `${path}`, { ...COMMENT_INITIAL_STATE });
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
      const { tab } = action.payload;
      const newState = _.cloneDeep(state);
      const path = !tab ? 'homeTab' : `${tab}`;
      return _.set(newState, `${path}.loading`, true);
    }

    case COMMENT_REFRESH_DONE: {
      const { skip, data, hasNextPage, tab } = action.payload;
      const path = !tab ? 'homeTab' : `${tab}`;
      let newState = _.cloneDeep(state);
      newState = _.set(newState, `${path}.loading`, false);

      if (skip !== undefined) {
        newState = _.set(newState, `${path}.skip`, skip);
      }
      newState = _.set(newState, `${path}.hasNextPage`, hasNextPage);
      newState = _.set(newState, `${path}.data`, data);

      // A dump way to transform all comments to comments with childComments
      const transformedComments = transformComments(data);
      return _.set(newState, `${path}.transformedComments`, transformedComments);
    }

    case COMMENT_LOAD_DONE: {
      const { skip, data, hasNextPage, tab } = action.payload;
      let newState = _.cloneDeep(state);
      const path = !tab ? 'homeTab' : `${tab}`;
      newState = _.set(newState, `${path}.loading`, false);

      if (skip !== undefined) {
        newState = _.set(newState, `${path}.skip`, skip);
      }
      newState = _.set(newState, `${path}.hasNextPage`, hasNextPage);
      const oldData = _.get(newState, `${path}.data`);
      return _.set(newState, `${path}.data`, arrayUnique(oldData.concat(data)));
    }

    // User likes a comment or User unlikes a comment
    case UNLIKE_COMMENT:
    case LIKE_COMMENT: {
      const { id, likeId, tab } = action.payload;
      console.log(`${action.type} comment, id is: ${id}, likeId is: ${likeId}`);

      let newState = _.cloneDeep(state);
      const path = !tab ? 'homeTab' : `${tab}`;
      // Update original comments
      const newData = updateLike(_.get(newState, `${path}.data`), id, likeId);
      // Update transformed comments
      const transformedComments = transformComments(newData);
      newState = _.set(newState, `${path}.data`, newData);
      return _.set(newState, `${path}.transformedComments`, transformedComments);
    }

    default:
      return { ...state };
  }
};

const transformComments = (data) =>
  data.filter(comment => !comment.replyToRef).map(comment => {
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

function updateLike(array, id, like) {
  return array.map((item) => {
    let newItem = _.cloneDeep(item);
    if (item._id.toString() === id.toString()) {
      newItem = _.set(newItem, 'maybeLikeRef', like);
    }
    return newItem;
  });
}

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
