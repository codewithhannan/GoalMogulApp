import { createSelector } from 'reselect';
import _ from 'lodash';

const getNavigationTab = (state) => {
  const { tab } = state.navigation;
  return tab;
};
const getComment = (state) => state.comment;

const getNewComment = (state) => state.newComment;

const getPageId = (state, pageId) => pageId;

/*
 * Iterate through member list to check if user is a current member
 */
export const getCommentByTab = createSelector(
  [getNavigationTab, getComment, getPageId],
  (tab, comment, pageId) => {
    const page = pageId ? `${pageId}` : 'default';
    const path = !tab ? `homeTab.${page}` : `${tab}.${page}`;
    return _.get(comment, `${path}`);
  }
);

export const getNewCommentByTab = createSelector(
  [getNavigationTab, getNewComment, getPageId],
  (tab, newComment, pageId) => {
    const page = pageId ? `${pageId}` : 'default';
    const path = !tab ? `homeTab.${page}` : `${tab}.${page}`;
    return _.get(newComment, `${path}`);
  }
);
