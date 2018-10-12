import { createSelector } from 'reselect';

const getTribeMembers = (state) => {
  if (state.tribe.item) {
    return state.tribe.item.members;
  }
  return [];
};
const getUserId = (state) => state.user.userId;

const getMembersFilter = (state) => state.tribe.membersFilter;

/**
 * My tribes related
 */
const getMyTribeMembersFilter = (state) => state.myTribe.membersFilter;
const getMyTribeMembers = (state) => {
  if (state.myTribe.item) {
    return state.myTribe.item.members;
  }
  return [];
};


/*
 * Iterate through member list to check if user is a current member
 */
export const getUserStatus = createSelector(
  [getTribeMembers, getUserId],
  (members, userId) => {
    if (!members) return '';

    let status = false;
    members.map((member) => {
      if (member.memberRef._id === userId) {
        status = true;
      }
      return '';
    });
    return status;
  }
);

export const memberSelector = createSelector(
  // Select participants based on the filter option
  [getMembersFilter, getTribeMembers],
  (filterOption, members) => {
    if (!members) return '';

    return members.filter((member) => member.category === filterOption);
  }
);

/**
 * My tribe related selectors
 */
export const getMyTribeUserStatus = createSelector(
  [getMyTribeMembers, getUserId],
  (members, userId) => {
    if (!members) return '';

    let status = false;
    members.map((member) => {
      if (member.memberRef._id === userId) {
        status = true;
      }
      return '';
    });
    return status;
  }
);

export const myTribeMemberSelector = createSelector(
  // Select participants based on the filter option
  [getMyTribeMembersFilter, getMyTribeMembers],
  (filterOption, members) => {
    if (!members) return '';

    return members.filter((member) => member.category === filterOption);
  }
);
