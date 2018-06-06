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

// Extract outgoing request user information
const getOutgoingData = (state) => state.meet.requests.outgoing.data;

const extractUser = R.map(
  d => ({
    user: R.pipe(R.prop('participants'), R.last, R.prop('users_id'))(d),
    friendshipId: R.prop('_id', d)
  })
);

export const getOutgoingUserFromFriendship = createSelector(
  [getOutgoingData],
  (data) => extractUser(data)
);

// Extract incoming request user information
const getIncomingData = (state) => state.meet.requests.incoming.data;

// const extractIncomingUser = R.map(
//   d => ({
//     user: R.prop('initiator_id')(d),
//     friendshipId: R.prop('_id', d)
//   })
// );

const extractIncomingUser = R.map(
  d => ({
    user: R.pipe(R.prop('participants'), R.head, R.prop('users_id'))(d),
    friendshipId: R.prop('_id', d)
  })
);

export const getIncomingUserFromFriendship = createSelector(
  [getIncomingData],
  (data) => extractIncomingUser(data)
);
