import { createSelector } from 'reselect';
import _ from 'lodash';

const getNavigationTab = (state) => {
  const { tab } = state.navigation;
  return tab;
};

const getPost = (state) => state.postDetail;

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

const capitalizeWord = (word) => {
  if (!word) return '';
  word.replace(/^\w/, c => c.toUpperCase());
};
