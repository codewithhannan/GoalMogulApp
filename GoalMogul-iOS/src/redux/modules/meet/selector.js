import { createSelector } from 'reselect';
import R from 'ramda';

const getFriendsFilter = (state) => state.meet.friends.filter.sortBy;
const getFriendsData = (state) => state.meet.friends.data;

const userAlphabeticalComparator
  = R.comparator((a, b) => R.lt(R.prop('name', a), R.prop('name', b)));

const userCreatedAtComparator
  = R.comparator((a, b) => R.lt(R.prop('created', a), R.prop('created', b)));

export const getFilteredFriendsList = createSelector(
  [getFriendsFilter, getFriendsData],
  (friendsFilter, data) => {
    switch (friendsFilter) {
      case 'alphabetical': {
        return R.sort(userAlphabeticalComparator, data);
      }

      case 'lastadd': {
        return data;
      }

      default:
        return data;
    }
  }
);
