import { createSelector } from 'reselect';
import _ from 'lodash';

const getNavigationTab = (state) => {
  const { tab } = state.navigation;
  return tab;
};

const getPost = (state) => state.postDetail;
const getShare = (state) => state.shareDetail;

/*
 * Iterate through member list to check if user is a current member
 */
export const getPostDetailByTab = createSelector(
  [getNavigationTab, getPost],
  (tab, post) => {
    const path = !tab ? 'post' : `post${capitalizeWord(tab)}`;
    return _.get(post, `${path}`);
  }
);

export const getShareDetailByTab = createSelector(
  [getNavigationTab, getShare],
  (tab, share) => {
    const path = !tab ? 'share' : `share${capitalizeWord(tab)}`;
    return _.get(share, `${path}`);
  }
);

const capitalizeWord = (word) => {
  if (!word) return '';
  return word.replace(/^\w/, c => c.toUpperCase());
};
