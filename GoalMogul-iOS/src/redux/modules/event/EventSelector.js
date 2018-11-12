import { createSelector } from 'reselect';
import _ from 'lodash';

const getEventParticipants = (state) => {
  if (state.event.item) {
    return state.event.item.participants;
  }
  return [];
};

const getMyEventParticipants = (state) => {
  if (state.myEvent.item) {
    return state.myEvent.item.participants;
  }
  return [];
};
const getUserId = (state) => state.user.userId;
const getParticipantsFilter = (state) => state.event.participantsFilter;

const getMyParticipantsFilter = (state) => state.myEvent.participantsFilter;

const getMyEventMemberNavigationStates = (state) => {
  const { memberNavigationState, memberDefaultRoutes } = state.myEvent;
  return {
    memberNavigationState,
    memberDefaultRoutes
  };
};

/*
 * Transform a goal's need and step to become
 * [ {needTitle: 'needs'}, ..., {stepTitle: 'steps'}, ...]
 */
export const getUserStatus = createSelector(
  [getEventParticipants, getUserId],
  (participants, userId) => {
    if (!participants) return '';

    let status;
    participants.map((participant) => {
      if (participant.participantRef._id === userId) {
        status = participant.rsvp;
      }
      return '';
    });
    return status;
  }
);

export const getMyEventUserStatus = createSelector(
  [getMyEventParticipants, getUserId],
  (participants, userId) => {
    if (!participants) return '';

    let status;
    participants.map((participant) => {
      if (participant.participantRef._id === userId) {
        status = participant.rsvp;
      }
      return '';
    });
    return status;
  }
);

// Select participants based on the filter option
export const participantSelector = createSelector(
  [getParticipantsFilter, getEventParticipants],
  (filter, participants) => {
    if (!participants) return '';

    return participants.filter((participant) => participant.rsvp === filter);
  }
);

export const myEventParticipantSelector = createSelector(
  [getMyParticipantsFilter, getMyEventParticipants],
  (filter, participants) => {
    if (!participants) return '';

    return participants.filter((participant) => participant.rsvp === filter);
  }
);

// This function currently is not used since people can see all participants
export const getMyEventMemberNavigationState = createSelector(
  [getMyEventMemberNavigationStates, getMyEventParticipants, getUserId],
  (navigationStates, members, userId) => {
    const { memberNavigationState, memberDefaultRoutes } = navigationStates;
    const navigationStateToReturn = _.cloneDeep(memberNavigationState);

    if (!members || members.length === 0) {
      return _.set(navigationStateToReturn, 'routes', memberDefaultRoutes);
    }

    let isAdmin;
    members.forEach((member) => {
      if (member.memberRef._id === userId
        && (member.category === 'Admin')) {
        isAdmin = true;
      }
    });

    return isAdmin
      ? navigationStateToReturn
      : _.set(navigationStateToReturn, 'routes', memberDefaultRoutes);
  }
);
