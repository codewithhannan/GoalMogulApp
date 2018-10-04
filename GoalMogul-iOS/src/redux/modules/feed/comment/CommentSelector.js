import { createSelector } from 'reselect';
import _ from 'lodash';

const getNavigationTab = (state) => {
  const { tab } = state.navigation;
  return tab;
};
const getComment = (state) => state.comment;

const getNewComment = (state) => state.newComment;

/*
 * Iterate through member list to check if user is a current member
 */
export const getCommentByTab = createSelector(
  [getNavigationTab, getComment],
  (tab, comment) => {
    const path = !tab ? 'homeTab' : `${tab}`;
    return _.get(comment, `${path}`);
  }
);

export const getNewCommentByTab = createSelector(
  [getNavigationTab, getNewComment],
  (tab, newComment) => {
    const path = !tab ? 'homeTab' : `${tab}`;
    return _.get(newComment, `${path}`);
  }
);
