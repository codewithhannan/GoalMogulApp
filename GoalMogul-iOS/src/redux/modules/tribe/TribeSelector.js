import { createSelector } from 'reselect';
import _ from 'lodash';

// TODO: tribe: update selectors and their callers e.g. passing in pageId and etc
const getTribeMembers = (state) => {
  if (state.tribe.item) {
    return state.tribe.item.members;
  }
  return [];
};
const getUserId = (state) => state.user.userId;

const getMembersFilter = (state) => state.tribe.membersFilter;

const getTribeNavigationStates = (state) => {
  const { navigationState, defaultRoutes } = state.tribe;
  return {
    navigationState,
    defaultRoutes
  };
};

const getTribeIsMemberCanInvite = (state) => {
  const { item } = state.tribe;
  if (!item || !item.membersCanInvite) return false;

  return true;
};

const getTribeMemberNavigationStates = (state) => {
  const { memberNavigationState, memberDefaultRoutes, memberCanInviteRoutes } = state.tribe;
  return {
    memberNavigationState,
    memberDefaultRoutes,
    memberCanInviteRoutes
  };
};

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

const getMyTribeNavigationStates = (state) => {
  const { navigationState, defaultRoutes } = state.myTribe;
  return {
    navigationState,
    defaultRoutes
  };
};

const getMyTribeMemberNavigationStates = (state) => {
  const { memberNavigationState, memberDefaultRoutes, memberCanInviteRoutes } = state.myTribe;
  return {
    memberNavigationState,
    memberDefaultRoutes,
    memberCanInviteRoutes
  };
};

const getMyTribeIsMemberCanInvite = (state) => {
  const { item } = state.myTribe;
  if (!item || !item.membersCanInvite) return false;

  return true;
};

/*
 * Iterate through member list to check if user is a current member
 */
export const getUserStatus = createSelector(
  [getTribeMembers, getUserId],
  (members, userId) => {
    if (!members) return '';

    let status;
    members.map((member) => {
      const { memberRef, category } = member;
      if (memberRef && memberRef._id === userId) {
        status = category;
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

// Get tribe navigationState, if not a member, obfuscate Post tab with default routes
export const getTribeNavigationState = createSelector(
  [getTribeNavigationStates, getTribeMembers, getUserId],
  (navigationStates, members, userId) => {
    const { navigationState, defaultRoutes } = navigationStates;
    const navigationStateToReturn = _.cloneDeep(navigationState);

    if (!members || members.length === 0) {
      return _.set(navigationStateToReturn, 'routes', defaultRoutes);
    }

    let isMember;
    members.forEach((member) => {
      if (member.memberRef && member.memberRef._id === userId
        && (member.category === 'Admin'
        || member.category === 'Member'
        || member.category === 'Invitee')) {
        isMember = true;
      }
    });

    return isMember
      ? navigationStateToReturn
      : _.set(navigationStateToReturn, 'routes', defaultRoutes);
  }
);

export const getTribeMemberNavigationState = createSelector(
  [getTribeMemberNavigationStates, getTribeMembers, getUserId, getTribeIsMemberCanInvite],
  (navigationStates, members, userId, membersCanInvite) => {
    const {
      memberNavigationState,
      memberDefaultRoutes,
      memberCanInviteRoutes
    } = navigationStates;
    const navigationStateToReturn = _.cloneDeep(memberNavigationState);

    if (!members || members.length === 0) {
      return _.set(navigationStateToReturn, 'routes', memberDefaultRoutes);
    }

    let isAdmin;
    let isMember;
    members.forEach((member) => {
      if (member.memberRef && member.memberRef._id === userId) {
        if (member.category === 'Admin') {
          isAdmin = true;
        }
        if (member.category === 'Member') {
          isMember = true;
        }
      }
    });

    if (isMember && membersCanInvite) {
      return _.set(navigationStateToReturn, 'routes', memberCanInviteRoutes);
    }

    return isAdmin
      ? navigationStateToReturn
      : _.set(navigationStateToReturn, 'routes', memberDefaultRoutes);
  }
);

/**
 * My tribe related selectors
 */
export const getMyTribeUserStatus = createSelector(
  [getMyTribeMembers, getUserId],
  (members, userId) => {
    if (!members) return '';

    let status;
    members.map((member) => {
      const { memberRef, category } = member;
      if (memberRef && memberRef._id === userId) {
        status = category;
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
    if (!members || _.isEmpty(members)) return '';

    return members.filter((member) => member.category === filterOption);
  }
);

// Get my tribe navigationState, if not a member, obfuscate Post tab with default routes
export const getMyTribeNavigationState = createSelector(
  [getMyTribeNavigationStates, getMyTribeMembers, getUserId],
  (navigationStates, members, userId) => {
    const { navigationState, defaultRoutes } = navigationStates;
    const navigationStateToReturn = _.cloneDeep(navigationState);

    if (!members || members.length === 0) {
      return _.set(navigationStateToReturn, 'routes', defaultRoutes);
    }

    let isMember;
    members.forEach((member) => {
      if (member.memberRef && member.memberRef._id === userId
        && (member.category === 'Admin'
        || member.category === 'Member'
        || member.category === 'Invitee')) {
        isMember = true;
      }
    });

    return isMember
      ? navigationStateToReturn
      : _.set(navigationStateToReturn, 'routes', defaultRoutes);
  }
);

export const getMyTribeMemberNavigationState = createSelector(
  [getMyTribeMemberNavigationStates, getMyTribeMembers, getUserId, getMyTribeIsMemberCanInvite],
  (navigationStates, members, userId, membersCanInvite) => {
    const {
      memberNavigationState,
      memberDefaultRoutes,
      memberCanInviteRoutes
    } = navigationStates;
    const navigationStateToReturn = _.cloneDeep(memberNavigationState);

    if (!members || members.length === 0) {
      return _.set(navigationStateToReturn, 'routes', memberDefaultRoutes);
    }

    let isAdmin;
    let isMember;
    members.forEach((member) => {
      if (member.memberRef && member.memberRef._id === userId) {
        if (member.category === 'Admin') {
          isAdmin = true;
        }
        if (member.category === 'Member') {
          isMember = true;
        }
      }
    });

    if (isMember && membersCanInvite) {
      return _.set(navigationStateToReturn, 'routes', memberCanInviteRoutes);
    }

    return isAdmin
      ? navigationStateToReturn
      : _.set(navigationStateToReturn, 'routes', memberDefaultRoutes);
  }
);
