import { createSelector } from 'reselect';

const getTribeMembers = (state) => {
  if (state.tribe.item) {
    return state.tribe.item.members;
  }
  return [];
};
const getUserId = (state) => state.user.userId;

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
